import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  applyCollisionPenalty,
  awardFlowEvent,
  buildRunResult,
  createInitialScoringState,
  speedMpsToKmh,
  tickScoring,
  type ScoringState,
} from '../game/rules';
import {
  compileRoutePolyline,
  sampleCompiledRoute,
  type CompiledRoute,
} from '../geo/projection';
import { RegionManager } from '../geo/regionLoader';
import { SoundEngine } from '../audio/soundEngine';
import type {
  GameSettings,
  GameState,
  HudSnapshot,
  PhotoPreset,
  RouteDefinition,
  RouteRecord,
  RunResult,
  WeatherPreset,
} from '../types/game';
import {
  animateRunnerRig,
  createCairnTokenModel,
  createDefenderModel,
  createHerdwickSheepModel,
  createLakeSteamerModel,
  createLakesBusModel,
  createRunnerModel,
  type RunnerRig,
} from './models';
import { createProceduralTextureSet, type ProceduralTextureSet } from './textures';
import {
  buildChunkGroup,
  buildTerrainAndWaterMeshes,
  createWorldMaterials,
  type BuiltChunkResult,
  type WorldMaterials,
} from './worldBuilder';

interface RouteObstacle {
  id: number;
  kind: 'hurdle' | 'sign_arch' | 'ramp' | 'rail' | 'finish';
  dist: number;
  laneOffset: number;
  width: number;
  height: number;
  length: number;
  yBase: number;
  mesh: THREE.Object3D;
  triggered: boolean;
}

interface RouteToken {
  id: number;
  dist: number;
  laneOffset: number;
  y: number;
  mesh: THREE.Group;
  collected: boolean;
}

interface TrafficActor {
  mesh: THREE.Group;
  dist: number;
  laneOffset: number;
  speedMps: number;
  direction: 1 | -1; // British LHT: oncoming on runner's right (+laneOffset), same-dir on left (-laneOffset)
  halfW: number;
  halfL: number;
  nearMissed: boolean;
}

interface SteamerActor {
  mesh: THREE.Group;
  x: number;
  z: number;
  dirZ: 1 | -1;
  speed: number;
}

interface SheepActor {
  mesh: THREE.Group;
  x: number;
  z: number;
  baseX: number;
  baseZ: number;
  phase: number;
}

interface PooledParticle {
  active: boolean;
  life: number;
  maxLife: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  scale: number;
  color: THREE.Color;
}

export interface EngineCallbacks {
  onHudUpdate: (hud: HudSnapshot) => void;
  onRunEnd: (result: RunResult) => void;
  onReady: () => void;
  onError: (msg: string) => void;
}

// Pre-allocated scratch math helpers (zero GC inside tick loop)
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

export class LakelandEngine {
  private container: HTMLElement;
  private callbacks: EngineCallbacks;
  private region = new RegionManager('windermere');
  private sound = new SoundEngine();

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sunLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private fog!: THREE.FogExp2;

  private textures!: ProceduralTextureSet;
  private materials!: WorldMaterials;
  private runner!: RunnerRig;

  private terrainMesh: THREE.Mesh | null = null;
  private waterMesh: THREE.Mesh | null = null;
  private rainMesh: THREE.Points | null = null;

  private particlePoolMesh!: THREE.InstancedMesh;
  private particles: PooledParticle[] = [];
  private particleCursor = 0;

  private loadedChunks = new Map<string, BuiltChunkResult>();
  private loadingChunkKeys = new Set<string>();
  private routePropsGroup = new THREE.Group();
  private ambientActorsGroup = new THREE.Group();

  private isSoftwareGl = false;
  private disposed = false;
  private resizeObserver: ResizeObserver | null = null;
  private frameId = 0;
  private lastTimestamp = 0;
  private elapsedTime = 0;
  private hudThrottleTimer = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;
  private currentFps = 60;

  // Game & Route State
  private gameState: GameState = 'title';
  private activeRoute!: RouteDefinition;
  private compiledRoute!: CompiledRoute;
  private settings: GameSettings;
  private prevRecord?: RouteRecord;

  // Player Physics State
  private playerX = 0;
  private playerY = 1;
  private playerZ = 0;
  private playerVy = 0;
  private playerHeading = 0; // radians, 0 = -Z (North)
  private routeDist = 0;
  private laneOffset = 0;
  private targetLaneVelocity = 0;
  private stridePhase = 0;
  private footstepTimer = 0;
  private isGrounded = true;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private slideTimer = 0;
  private isGrinding = false;
  private grindHeight = 0;
  private invulnTimer = 0;
  private hitstopTimer = 0;
  private cameraTrauma = 0;
  private skyDropTimer = 0;
  private squashY = 1;
  private steerTilt = 0;

  private scoring: ScoringState = createInitialScoringState();
  private runElapsedSec = 0;
  private totalDistanceM = 0;
  private actionCallout = '';
  private calloutTimer = 0;

  private obstacles: RouteObstacle[] = [];
  private tokens: RouteToken[] = [];
  private traffic: TrafficActor[] = [];
  private steamers: SteamerActor[] = [];
  private sheep: SheepActor[] = [];

  // Camera & Photo Mode
  private camPos = new THREE.Vector3(0, 14, 24);
  private camLook = new THREE.Vector3(0, 3, -20);
  private photoPreset: PhotoPreset = 'runner';
  private photoOrbitYaw = 0.55;
  private photoOrbitPitch = 0.28;
  private photoZoom = 1.0;

  // Unified Input State
  private keysHeld = new Set<string>();
  private virtualSteer = 0; // -1..1 from touch joystick

  constructor(
    container: HTMLElement,
    initialRoute: RouteDefinition,
    initialSettings: GameSettings,
    callbacks: EngineCallbacks,
  ) {
    this.container = container;
    this.activeRoute = initialRoute;
    this.settings = { ...initialSettings };
    this.callbacks = callbacks;
    this.compiledRoute = compileRoutePolyline(initialRoute.waypoints);
  }

  public async init(): Promise<void> {
    try {
      this.isSoftwareGl = (() => {
        try {
          const gl = document.createElement('canvas').getContext('webgl2');
          if (!gl) return true;
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
          const gpu = String(gl.getParameter(param));
          gl.getExtension('WEBGL_lose_context')?.loseContext();
          return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
        } catch {
          return true;
        }
      })();

      const width = Math.max(1, this.container.clientWidth || window.innerWidth);
      const height = Math.max(1, this.container.clientHeight || window.innerHeight);

      this.renderer = new THREE.WebGLRenderer({
        antialias: !this.isSoftwareGl,
        powerPreference: 'high-performance',
      });
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.renderer.setSize(width, height);
      this.renderer.domElement.style.display = 'block';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.applyGraphicsPreset();

      this.container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.fog = new THREE.FogExp2(0x9fb8c9, 0.0011);
      this.scene.fog = this.fog;
      this.scene.background = new THREE.Color(0x9fb8c9);

      this.camera = new THREE.PerspectiveCamera(64, width / height, 0.4, 2400);

      // Studio / Sky PBR Reflection Environment
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();

      // Balanced Warm Sun + Cool Sky Hemisphere Fill
      this.hemiLight = new THREE.HemisphereLight(0xcbe4f9, 0x3b4932, 0.95);
      this.scene.add(this.hemiLight);

      this.sunLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
      this.sunLight.position.set(160, 220, 120);
      this.sunLight.castShadow = !this.isSoftwareGl;
      this.sunLight.shadow.mapSize.set(1024, 1024);
      const d = 75;
      this.sunLight.shadow.camera.left = -d;
      this.sunLight.shadow.camera.right = d;
      this.sunLight.shadow.camera.top = d;
      this.sunLight.shadow.camera.bottom = -d;
      this.sunLight.shadow.camera.near = 10;
      this.sunLight.shadow.camera.far = 480;
      this.sunLight.shadow.bias = -0.0005;
      this.sunLight.shadow.normalBias = 0.03;
      this.scene.add(this.sunLight);
      this.scene.add(this.sunLight.target);

      const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
      this.textures = createProceduralTextureSet(maxAniso);
      this.materials = createWorldMaterials(this.textures);

      // Load real Windermere GIS data
      await this.region.initialize();
      if (this.disposed) return;

      const { terrainMesh, waterMesh } = buildTerrainAndWaterMeshes(
        this.region.terrain,
        this.region.lake,
        this.materials,
      );
      this.terrainMesh = terrainMesh;
      this.waterMesh = waterMesh;
      this.scene.add(terrainMesh, waterMesh);

      this.scene.add(this.routePropsGroup);
      this.scene.add(this.ambientActorsGroup);

      // Runner Actor
      this.runner = createRunnerModel(this.textures.contactShadowMap);
      this.scene.add(this.runner.root);

      // Pooled Particle System (140 instances, zero GC)
      this.initParticlePool();
      this.initRainSystem();
      this.spawnLakeSteamers();

      this.applyWeatherPreset(this.settings.weather);

      // Stage initial Waterhead & Ambleside chunks before first paint
      this.prepareRoute(this.activeRoute, this.prevRecord);
      await this.updateChunkStreaming(this.playerX, this.playerZ, true);

      if (!this.isSoftwareGl) {
        this.renderer.compile(this.scene, this.camera);
      }

      this.bindEvents();
      this.callbacks.onReady();

      this.lastTimestamp = performance.now();
      this.scheduleNextFrame();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to initialize 3D engine';
      this.callbacks.onError(msg);
    }
  }

  private initParticlePool(): void {
    const count = 140;
    const geo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.particlePoolMesh = new THREE.InstancedMesh(geo, mat, count);
    this.particlePoolMesh.frustumCulled = false;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        active: false,
        life: 0,
        maxLife: 1,
        x: 0,
        y: -500,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        scale: 0,
        color: new THREE.Color(0xfbbf24),
      });
      _dummy.position.set(0, -500, 0);
      _dummy.scale.setScalar(0.001);
      _dummy.updateMatrix();
      this.particlePoolMesh.setMatrixAt(i, _dummy.matrix);
      this.particlePoolMesh.setColorAt(i, _color.setHex(0xfbbf24));
    }
    this.particlePoolMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.particlePoolMesh);
  }

  private emitParticles(
    x: number,
    y: number,
    z: number,
    count: number,
    hexColor: number,
    speed = 5,
  ): void {
    for (let i = 0; i < count; i++) {
      const p = this.particles[this.particleCursor];
      this.particleCursor = (this.particleCursor + 1) % this.particles.length;
      p.active = true;
      p.life = 0;
      p.maxLife = 0.35 + Math.random() * 0.35;
      p.x = x + (Math.random() - 0.5) * 0.4;
      p.y = y + Math.random() * 0.3;
      p.z = z + (Math.random() - 0.5) * 0.4;
      p.vx = (Math.random() - 0.5) * speed;
      p.vy = 1.5 + Math.random() * speed * 0.9;
      p.vz = (Math.random() - 0.5) * speed;
      p.scale = 0.7 + Math.random() * 0.7;
      p.color.setHex(hexColor);
    }
  }

  private initRainSystem(): void {
    const count = 750;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = Math.random() * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xcbd5e1,
      size: 0.22,
      transparent: true,
      opacity: 0.55,
    });
    this.rainMesh = new THREE.Points(geo, mat);
    this.rainMesh.visible = false;
    this.scene.add(this.rainMesh);
  }

  private spawnLakeSteamers(): void {
    // Windermere Lake center-channel steamer cruises (North-South along Windermere)
    const steamerCoords: Array<[number, number, 1 | -1]> = [
      [140, 260, -1], // Near Waterhead Pier
      [1950, 5600, 1], // Mid-lake off Bowness / Belle Isle
      [420, 14600, -1], // Lakeside South Basin
    ];
    for (const [sx, sz, dir] of steamerCoords) {
      const mesh = createLakeSteamerModel();
      mesh.position.set(sx, 0, sz);
      if (dir === 1) mesh.rotation.y = Math.PI;
      this.ambientActorsGroup.add(mesh);
      this.steamers.push({ mesh, x: sx, z: sz, dirZ: dir, speed: 5.5 });
    }
  }

  public setSettings(next: GameSettings): void {
    const weatherChanged = next.weather !== this.settings.weather;
    const gfxChanged = next.graphics !== this.settings.graphics;
    this.settings = { ...next };

    this.sound.updateSettings(next);
    if (weatherChanged) this.applyWeatherPreset(next.weather);
    if (gfxChanged) this.applyGraphicsPreset();
  }

  public applyWeatherPreset(weather: WeatherPreset): void {
    this.sound.setWeather(weather);
    if (!this.scene || !this.sunLight || !this.hemiLight || !this.fog) return;

    const presets: Record<
      WeatherPreset,
      {
        sky: number;
        fogDensity: number;
        sunColor: number;
        sunInt: number;
        hemiSky: number;
        hemiGround: number;
        hemiInt: number;
        sunPos: [number, number, number];
        windowGlow: number;
        rain: boolean;
      }
    > = {
      clear: {
        sky: 0x92bdd9,
        fogDensity: 0.00085,
        sunColor: 0xfff3d6,
        sunInt: 2.35,
        hemiSky: 0xdbeafe,
        hemiGround: 0x3b4d30,
        hemiInt: 1.0,
        sunPos: [160, 220, 110],
        windowGlow: 0.12,
        rain: false,
      },
      cloudy: {
        sky: 0x8ea1b2,
        fogDensity: 0.0014,
        sunColor: 0xe2e8f0,
        sunInt: 1.35,
        hemiSky: 0xcbd5e1,
        hemiGround: 0x374151,
        hemiInt: 1.15,
        sunPos: [90, 240, 80],
        windowGlow: 0.25,
        rain: false,
      },
      rain: {
        sky: 0x5c7080,
        fogDensity: 0.0022,
        sunColor: 0xbcd0e0,
        sunInt: 1.05,
        hemiSky: 0x94a3b8,
        hemiGround: 0x263238,
        hemiInt: 1.0,
        sunPos: [60, 210, 90],
        windowGlow: 0.55,
        rain: true,
      },
      mist: {
        sky: 0xb9c7cf,
        fogDensity: 0.0035,
        sunColor: 0xf1f5f9,
        sunInt: 1.2,
        hemiSky: 0xe2e8f0,
        hemiGround: 0x475569,
        hemiInt: 1.2,
        sunPos: [120, 170, 60],
        windowGlow: 0.35,
        rain: false,
      },
      sunset: {
        sky: 0xd98a5f,
        fogDensity: 0.0011,
        sunColor: 0xffa45b,
        sunInt: 2.5,
        hemiSky: 0xfdba74,
        hemiGround: 0x2e2438,
        hemiInt: 0.85,
        sunPos: [-240, 65, 110],
        windowGlow: 0.78,
        rain: false,
      },
      night: {
        sky: 0x0f1a2e,
        fogDensity: 0.0015,
        sunColor: 0x93c5fd,
        sunInt: 0.85,
        hemiSky: 0x334155,
        hemiGround: 0x0f172a,
        hemiInt: 0.65,
        sunPos: [-120, 180, -80],
        windowGlow: 1.45,
        rain: false,
      },
    };

    const p = presets[weather];
    this.scene.background = new THREE.Color(p.sky);
    this.fog.color.setHex(p.sky);
    this.fog.density = p.fogDensity;
    this.sunLight.color.setHex(p.sunColor);
    this.sunLight.intensity = p.sunInt;
    this.sunLight.position.set(...p.sunPos);
    this.hemiLight.color.setHex(p.hemiSky);
    this.hemiLight.groundColor.setHex(p.hemiGround);
    this.hemiLight.intensity = p.hemiInt;
    this.materials.windowGlow.emissiveIntensity = p.windowGlow;
    if (this.rainMesh) this.rainMesh.visible = p.rain;
  }

  private applyGraphicsPreset(): void {
    if (!this.renderer) return;
    if (this.isSoftwareGl) {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      return;
    }
    const preset = this.settings.graphics;
    const dpr = window.devicePixelRatio || 1;
    if (preset === 'low') {
      this.renderer.setPixelRatio(Math.min(dpr, 1));
      this.renderer.shadowMap.enabled = false;
    } else if (preset === 'medium') {
      this.renderer.setPixelRatio(Math.min(dpr, 1.35));
      this.renderer.shadowMap.enabled = true;
    } else {
      this.renderer.setPixelRatio(Math.min(dpr, 2));
      this.renderer.shadowMap.enabled = true;
    }
  }

  public selectRoute(route: RouteDefinition, prevRecord?: RouteRecord): void {
    this.activeRoute = route;
    this.prevRecord = prevRecord;
    this.compiledRoute = compileRoutePolyline(route.waypoints);
    this.prepareRoute(route, prevRecord);
    void this.updateChunkStreaming(this.playerX, this.playerZ, true);
  }

  public startRun(route: RouteDefinition, prevRecord?: RouteRecord): void {
    this.sound.unlock();
    this.sound.playUiClick();
    this.activeRoute = route;
    this.prevRecord = prevRecord;
    this.compiledRoute = compileRoutePolyline(route.waypoints);
    this.prepareRoute(route, prevRecord);
    this.gameState = 'playing';
    this.skyDropTimer = 0.85; // Neon Scramble sky-drop entrance!
    this.keysHeld.clear();
    void this.updateChunkStreaming(this.playerX, this.playerZ, true);
  }

  public setGameState(next: GameState): void {
    this.gameState = next;
    if (next !== 'playing') {
      this.keysHeld.clear();
      this.virtualSteer = 0;
      this.sound.setGameplayState(false, 0, false);
    } else {
      this.sound.unlock();
    }
  }

  public setPhotoModePreset(preset: PhotoPreset): void {
    this.photoPreset = preset;
    if (preset === 'runner') {
      this.photoOrbitYaw = 0.55;
      this.photoOrbitPitch = 0.25;
      this.photoZoom = 0.95;
    } else if (preset === 'vista') {
      this.photoOrbitYaw = 2.4;
      this.photoOrbitPitch = 0.48;
      this.photoZoom = 2.2;
    } else {
      this.photoOrbitYaw = -1.1;
      this.photoOrbitPitch = 0.16;
      this.photoZoom = 1.4;
    }
  }

  public orbitPhotoCamera(deltaYaw: number, deltaPitch: number, deltaZoom = 0): void {
    this.photoOrbitYaw += deltaYaw;
    this.photoOrbitPitch = THREE.MathUtils.clamp(this.photoOrbitPitch + deltaPitch, 0.08, 1.15);
    this.photoZoom = THREE.MathUtils.clamp(this.photoZoom + deltaZoom, 0.65, 3.2);
  }

  public triggerTouchJump(): void {
    this.sound.unlock();
    this.jumpBufferTimer = 0.14;
  }

  public triggerTouchSlide(): void {
    this.sound.unlock();
    if (this.slideTimer <= 0 && !this.isGrinding) {
      this.slideTimer = 0.65;
      this.sound.playSlide();
      if (!this.isGrounded) {
        this.playerVy = Math.min(this.playerVy, -18);
      }
    }
  }

  public setTouchSteer(val: number): void {
    this.virtualSteer = THREE.MathUtils.clamp(val, -1, 1);
  }

  private prepareRoute(route: RouteDefinition, prevRecord?: RouteRecord): void {
    this.prevRecord = prevRecord;
    this.scoring = createInitialScoringState();
    this.runElapsedSec = 0;
    this.totalDistanceM = 0;
    this.routeDist = 0;
    this.laneOffset = 0;
    this.targetLaneVelocity = 0;
    this.playerVy = 0;
    this.isGrounded = true;
    this.isGrinding = false;
    this.slideTimer = 0;
    this.invulnTimer = 0;
    this.hitstopTimer = 0;
    this.cameraTrauma = 0;
    this.actionCallout = '';
    this.calloutTimer = 0;

    // Clear previous route props
    while (this.routePropsGroup.children.length > 0) {
      this.routePropsGroup.remove(this.routePropsGroup.children[0]);
    }
    this.obstacles = [];
    this.tokens = [];
    this.traffic = [];
    this.sheep = [];

    const startSample = sampleCompiledRoute(this.compiledRoute, 0);
    const groundY = Math.max(0.5, this.region.getTerrainHeight(startSample.x, startSample.z));
    this.playerX = startSample.x;
    this.playerZ = startSample.z;
    this.playerY = groundY;
    this.playerHeading = Math.atan2(-startSample.tx, -startSample.tz);
    this.runner.root.position.set(this.playerX, this.playerY, this.playerZ);
    this.runner.root.rotation.y = this.playerHeading;

    // Anchor chase camera directly behind the runner at route start so sky-drop swoops cleanly down-road
    const fx = -Math.sin(this.playerHeading);
    const fz = -Math.cos(this.playerHeading);
    this.camPos.set(this.playerX - fx * 7.5, this.playerY + 14.0, this.playerZ - fz * 7.5);
    this.camLook.set(this.playerX + fx * 15, this.playerY + 1.8, this.playerZ + fz * 15);

    if (route.mode === 'sprint') {
      this.populateSprintCourse();
    } else {
      this.populateExplorerTokens();
    }
    this.pushHudSnapshot();
  }

  private populateSprintCourse(): void {
    const total = this.compiledRoute.totalLength;
    let oid = 1;
    let tid = 1;

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.textures.slateStoneMap,
      roughness: 0.85,
    });
    const timberMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.textures.timberPlankMap,
      roughness: 0.72,
    });
    const railMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.65,
    });
    const signBannerMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.45,
    });

    // Place parkour features every 48m after an approachable 55m opening stretch
    for (let dist = 55; dist < total - 60; dist += 48) {
      const s = sampleCompiledRoute(this.compiledRoute, dist);
      const yaw = Math.atan2(-s.tx, -s.tz);
      const yBase = Math.max(0.5, this.region.getTerrainHeight(s.x, s.z));
      const pattern = Math.floor(dist / 48) % 5;

      if (pattern === 0) {
        // Grindable Lakeside/Stone Parapet Rail + arc of 4 Cairn Tokens
        const railLen = 22;
        const lane = ((dist / 48) % 2 === 0 ? -1 : 1) * 2.8;
        const railGroup = new THREE.Group();
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, railLen), railMat);
        bar.position.y = 1.05;
        railGroup.add(bar);
        for (const pz of [-railLen * 0.4, 0, railLen * 0.4]) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.05, 0.24), stoneMat);
          post.position.set(0, 0.52, pz);
          railGroup.add(post);
        }
        const mx = s.x + s.rx * lane;
        const mz = s.z + s.rz * lane;
        railGroup.position.set(mx, yBase, mz);
        railGroup.rotation.y = yaw;
        this.routePropsGroup.add(railGroup);
        this.obstacles.push({
          id: oid++,
          kind: 'rail',
          dist,
          laneOffset: lane,
          width: 1.4,
          height: 1.15,
          length: railLen,
          yBase,
          mesh: railGroup,
          triggered: false,
        });
        for (let k = -1; k <= 2; k++) {
          const ts = sampleCompiledRoute(this.compiledRoute, dist + k * 5);
          const tok = createCairnTokenModel();
          const ty = Math.max(0.5, this.region.getTerrainHeight(ts.x, ts.z)) + 1.2;
          tok.position.set(ts.x + ts.rx * lane, ty, ts.z + ts.rz * lane);
          this.routePropsGroup.add(tok);
          this.tokens.push({ id: tid++, dist: dist + k * 5, laneOffset: lane, y: ty, mesh: tok, collected: false });
        }
      } else if (pattern === 1) {
        // Low Hanging Lakeland Pub/Village Sign Archway -> SLIDE under!
        const lane = ((dist / 48) % 3 - 1) * 2.5;
        const arch = new THREE.Group();
        const postL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.2, 0.35), timberMat);
        postL.position.set(-2.3, 1.6, 0);
        const postR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.2, 0.35), timberMat);
        postR.position.set(2.3, 1.6, 0);
        const cross = new THREE.Mesh(new THREE.BoxGeometry(5.1, 1.15, 0.45), signBannerMat);
        cross.position.set(0, 2.05, 0);
        arch.add(postL, postR, cross);
        arch.position.set(s.x + s.rx * lane, yBase, s.z + s.rz * lane);
        arch.rotation.y = yaw;
        this.routePropsGroup.add(arch);
        this.obstacles.push({
          id: oid++,
          kind: 'sign_arch',
          dist,
          laneOffset: lane,
          width: 4.4,
          height: 1.5, // Clearance bottom height -> must slide!
          length: 1.4,
          yBase,
          mesh: arch,
          triggered: false,
        });
        const tok = createCairnTokenModel();
        tok.position.set(s.x + s.rx * lane, yBase + 0.1, s.z + s.rz * lane);
        this.routePropsGroup.add(tok);
        this.tokens.push({ id: tid++, dist, laneOffset: lane, y: yBase + 0.1, mesh: tok, collected: false });
      } else if (pattern === 2) {
        // Dry-Stone Wall Hurdle -> JUMP / VAULT over!
        const lane = ((dist / 48) % 2 === 0 ? 1 : -1) * 1.8;
        const hurdle = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.05, 0.65), stoneMat);
        hurdle.position.set(s.x + s.rx * lane, yBase + 0.52, s.z + s.rz * lane);
        hurdle.rotation.y = yaw;
        hurdle.castShadow = true;
        this.routePropsGroup.add(hurdle);
        this.obstacles.push({
          id: oid++,
          kind: 'hurdle',
          dist,
          laneOffset: lane,
          width: 4.4,
          height: 1.05,
          length: 1.0,
          yBase,
          mesh: hurdle,
          triggered: false,
        });
        const tok = createCairnTokenModel();
        tok.position.set(s.x + s.rx * lane, yBase + 1.55, s.z + s.rz * lane);
        this.routePropsGroup.add(tok);
        this.tokens.push({ id: tid++, dist, laneOffset: lane, y: yBase + 1.55, mesh: tok, collected: false });
      } else if (pattern === 3) {
        // Timber Launch Ramp -> High Vault Arc!
        const lane = 0;
        const ramp = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.45, 5.2), timberMat);
        ramp.position.set(s.x, yBase + 0.65, s.z);
        ramp.rotation.y = yaw;
        ramp.rotateX(0.26);
        this.routePropsGroup.add(ramp);
        this.obstacles.push({
          id: oid++,
          kind: 'ramp',
          dist,
          laneOffset: lane,
          width: 3.4,
          height: 1.4,
          length: 5.0,
          yBase,
          mesh: ramp,
          triggered: false,
        });
        for (let k = 1; k <= 3; k++) {
          const ts = sampleCompiledRoute(this.compiledRoute, dist + k * 4.5);
          const ty = Math.max(0.5, this.region.getTerrainHeight(ts.x, ts.z)) + 1.8 + (k === 2 ? 1.0 : 0.4);
          const tok = createCairnTokenModel();
          tok.position.set(ts.x, ty, ts.z);
          this.routePropsGroup.add(tok);
          this.tokens.push({ id: tid++, dist: dist + k * 4.5, laneOffset: lane, y: ty, mesh: tok, collected: false });
        }
      } else {
        // Slalom line of 3 Tokens
        for (let k = 0; k < 3; k++) {
          const td = dist + k * 6;
          const ts = sampleCompiledRoute(this.compiledRoute, td);
          const lane = (k - 1) * 2.4;
          const ty = Math.max(0.5, this.region.getTerrainHeight(ts.x, ts.z)) + 0.3;
          const tok = createCairnTokenModel();
          tok.position.set(ts.x + ts.rx * lane, ty, ts.z + ts.rz * lane);
          this.routePropsGroup.add(tok);
          this.tokens.push({ id: tid++, dist: td, laneOffset: lane, y: ty, mesh: tok, collected: false });
        }
      }
    }

    // Finish Banner Archway at route end
    const fin = sampleCompiledRoute(this.compiledRoute, total);
    const finY = Math.max(0.5, this.region.getTerrainHeight(fin.x, fin.z));

    // Build floating timber pontoon causeway if any route segment crosses water (e.g. Ferry Nab)
    for (let d = 10; d < total - 10; d += 12) {
      const sp = sampleCompiledRoute(this.compiledRoute, d);
      if (this.region.isInWater(sp.x, sp.z)) {
        const deck = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.38, 12.6), timberMat);
        deck.position.set(sp.x, 0.45, sp.z);
        deck.rotation.y = Math.atan2(-sp.tx, -sp.tz);
        deck.receiveShadow = true;
        this.routePropsGroup.add(deck);
      }
    }
    const finArch = new THREE.Group();
    const pMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.4 });
    const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 6.2, 10), pMat);
    pL.position.set(-5.5, 3.1, 0);
    const pR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 6.2, 10), pMat);
    pR.position.set(5.5, 3.1, 0);
    const banner = new THREE.Mesh(
      new THREE.BoxGeometry(11.6, 1.4, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x0f766e, emissive: 0x0d9488, emissiveIntensity: 0.4 }),
    );
    banner.position.set(0, 5.6, 0);
    finArch.add(pL, pR, banner);
    finArch.position.set(fin.x, finY, fin.z);
    finArch.rotation.y = Math.atan2(-fin.tx, -fin.tz);
    this.routePropsGroup.add(finArch);

    // British Left-Hand Traffic (Stagecoach Buses & Defenders)
    const numVehicles = Math.max(6, Math.floor(total / 210));
    for (let i = 0; i < numVehicles; i++) {
      const isBus = i % 3 === 0;
      const dir: 1 | -1 = i % 2 === 0 ? -1 : 1; // -1 oncoming on right side (UK LHT), +1 same direction on left
      const lane = dir === -1 ? 3.1 : -3.1;
      const dist = 130 + (i / numVehicles) * (total - 200);
      const mesh = isBus
        ? createLakesBusModel()
        : createDefenderModel(i % 2 === 0 ? 0x3f6212 : 0x334155);
      this.routePropsGroup.add(mesh);
      this.traffic.push({
        mesh,
        dist,
        laneOffset: lane,
        speedMps: isBus ? 9.5 : 12.5,
        direction: dir,
        halfW: isBus ? 1.25 : 1.0,
        halfL: isBus ? 4.1 : 2.1,
        nearMissed: false,
      });
    }

    // Grazing Herdwick Sheep along road verges
    for (let d = 80; d < total - 80; d += 140) {
      const s = sampleCompiledRoute(this.compiledRoute, d);
      const side = (d / 140) % 2 === 0 ? 1 : -1;
      const sx = s.x + s.rx * (side * 10.5);
      const sz = s.z + s.rz * (side * 10.5);
      if (this.region.isInWater(sx, sz)) continue;
      const sy = Math.max(0.5, this.region.getTerrainHeight(sx, sz));
      const sh = createHerdwickSheepModel();
      sh.position.set(sx, sy, sz);
      sh.rotation.y = (d % 6.28);
      this.routePropsGroup.add(sh);
      this.sheep.push({ mesh: sh, x: sx, z: sz, baseX: sx, baseZ: sz, phase: d * 0.1 });
    }
  }

  private populateExplorerTokens(): void {
    // Place Cairn Tokens at major Windermere settlements so explorers have discovery targets
    const settlements = this.region.manifest?.settlements ?? [];
    let tid = 1;
    for (const s of settlements) {
      const ty = Math.max(0.6, this.region.getTerrainHeight(s.x, s.z)) + 0.5;
      const tok = createCairnTokenModel();
      tok.position.set(s.x, ty, s.z);
      tok.scale.setScalar(1.4);
      this.routePropsGroup.add(tok);
      this.tokens.push({ id: tid++, dist: 0, laneOffset: 0, y: ty, mesh: tok, collected: false });
    }
  }

  private async updateChunkStreaming(x: number, z: number, immediate = false): Promise<void> {
    const [cx, cz] = this.region.getChunkKeyForWorld(x, z);
    const radius = this.settings.graphics === 'low' ? 1 : 2;
    const tasks: Array<Promise<void>> = [];

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const kx = cx + dx;
        const kz = cz + dz;
        const key = `${kx}_${kz}`;
        if (this.loadedChunks.has(key) || this.loadingChunkKeys.has(key)) continue;

        this.loadingChunkKeys.add(key);
        const task = this.region
          .ensureChunk(kx, kz)
          .then((chunkData) => {
            if (this.disposed) return;
            const built = buildChunkGroup(
              chunkData,
              this.region.terrain,
              this.region.lake,
              this.materials,
            );
            this.loadedChunks.set(key, built);
            this.scene.add(built.group);
          })
          .finally(() => {
            this.loadingChunkKeys.delete(key);
          });
        tasks.push(task);
      }
    }

    // Evict distant chunks to keep memory bounded
    for (const [key, built] of this.loadedChunks.entries()) {
      const [bx, bz] = key.split('_').map(Number);
      if (Math.abs(bx - cx) > radius + 1 || Math.abs(bz - cz) > radius + 1) {
        this.scene.remove(built.group);
        built.dispose();
        this.loadedChunks.delete(key);
      }
    }
    this.region.evictDistantChunks(cx, cz, radius + 2);

    if (immediate && tasks.length > 0) {
      await Promise.all(tasks);
    }
  }

  private scheduleNextFrame(): void {
    if (this.disposed) return;
    if (this.isSoftwareGl) {
      this.afterDraw(() => this.tick());
    } else {
      this.frameId = requestAnimationFrame(() => this.tick());
    }
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 32);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private tick(): void {
    if (this.disposed) return;
    const now = performance.now();
    const rawDt = Math.max(0.001, (now - this.lastTimestamp) / 1000);
    this.lastTimestamp = now;
    const maxStep = this.isSoftwareGl ? 0.18 : 0.05;
    const dt = Math.min(rawDt, maxStep);

    this.fpsAccum += rawDt;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.5) {
      this.currentFps = Math.round(this.fpsFrames / this.fpsAccum);
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }

    this.elapsedTime += dt;
    this.materials.waterUniforms.uTime.value = this.elapsedTime;

    if (this.gameState === 'title') {
      this.updateTitleFlyover(dt);
    } else if (this.gameState === 'playing') {
      // Sub-step physics at <= 0.04s so collisions never tunnel even on software WebGL
      const subSteps = Math.max(1, Math.ceil(dt / 0.04));
      const subDt = dt / subSteps;
      for (let s = 0; s < subSteps; s++) {
        if (this.hitstopTimer > 0) {
          this.hitstopTimer = Math.max(0, this.hitstopTimer - subDt);
        } else {
          this.updatePlaying(subDt);
        }
      }
    } else if (this.gameState === 'paused') {
      this.updatePhotoCamera(dt);
    }

    this.updateAmbientActors(dt);
    this.updateParticles(dt);
    this.updateRain(dt);

    // Keep shadow frustum anchored near the active view
    this.sunLight.target.position.set(this.playerX, this.playerY, this.playerZ);
    this.sunLight.target.updateMatrixWorld();

    this.renderer.render(this.scene, this.camera);
    this.scheduleNextFrame();
  }

  private updateTitleFlyover(dt: number): void {
    const start = sampleCompiledRoute(this.compiledRoute, 140);
    const angle = this.elapsedTime * 0.14;
    const radius = 58;
    const cx = start.x + Math.cos(angle) * radius;
    const cz = start.z + Math.sin(angle) * radius;
    const groundY = Math.max(1, this.region.getTerrainHeight(cx, cz));

    this.camera.position.set(cx, groundY + 26 + Math.sin(this.elapsedTime * 0.3) * 4, cz);
    this.camera.lookAt(start.x, Math.max(1, this.region.getTerrainHeight(start.x, start.z)) + 4, start.z);
    this.runner.root.visible = false;
    void dt;
  }

  private updatePlaying(dt: number): void {
    this.runner.root.visible = true;
    this.runElapsedSec += dt;

    if (this.calloutTimer > 0) {
      this.calloutTimer -= dt;
      if (this.calloutTimer <= 0) this.actionCallout = '';
    }
    if (this.invulnTimer > 0) {
      this.invulnTimer = Math.max(0, this.invulnTimer - dt);
      this.runner.root.visible = Math.floor(this.invulnTimer * 16) % 2 === 0;
    } else {
      this.runner.root.visible = true;
    }

    // Sky-Drop Intro camera transition (first 0.85s)
    if (this.skyDropTimer > 0) {
      this.skyDropTimer = Math.max(0, this.skyDropTimer - dt);
    }

    // Process input steer (-1 left, +1 right)
    let steer = this.virtualSteer;
    if (this.keysHeld.has('KeyA') || this.keysHeld.has('ArrowLeft')) steer -= 1;
    if (this.keysHeld.has('KeyD') || this.keysHeld.has('ArrowRight')) steer += 1;
    steer = THREE.MathUtils.clamp(steer, -1, 1);

    // Optional Auto-Pilot assist
    if (this.settings.autoPilot && this.activeRoute.mode === 'sprint') {
      let desiredLane = 0;
      for (const obs of this.obstacles) {
        const dz = obs.dist - this.routeDist;
        if (dz > 0 && dz < 26) {
          if (obs.kind === 'hurdle' && Math.abs(obs.laneOffset - this.laneOffset) < 2.2) {
            this.jumpBufferTimer = 0.1;
          } else if (obs.kind === 'sign_arch' && Math.abs(obs.laneOffset - this.laneOffset) < 2.2) {
            this.triggerTouchSlide();
          }
        }
      }
      for (const v of this.traffic) {
        const dz = v.dist - this.routeDist;
        if (dz > 0 && dz < 34 && Math.abs(v.laneOffset - this.laneOffset) < 2.1) {
          desiredLane = v.laneOffset > 0 ? -3.0 : 3.0;
        }
      }
      steer = THREE.MathUtils.clamp((desiredLane - this.laneOffset) * 0.45, -1, 1);
    }

    this.steerTilt = steer;

    // Tick scoring & speed
    this.scoring = tickScoring(this.scoring, dt, this.isGrinding);
    const speed = this.scoring.speedMps;

    // Jump buffering & Coyote time
    if (this.jumpBufferTimer > 0) this.jumpBufferTimer -= dt;
    if (this.isGrounded || this.isGrinding) {
      this.coyoteTimer = 0.1;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }
    if (this.slideTimer > 0) {
      this.slideTimer = Math.max(0, this.slideTimer - dt);
    }

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.playerVy = 11.4;
      this.isGrounded = false;
      this.isGrinding = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.slideTimer = 0;
      this.squashY = 1.24;
      this.sound.playJump();
      this.emitParticles(this.playerX, this.playerY, this.playerZ, 6, 0xe2e8f0, 3.2);
    }

    // Advance position (Guided Sprint vs 360° Explorer)
    if (this.activeRoute.mode === 'sprint') {
      this.routeDist += speed * dt;
      this.totalDistanceM = this.routeDist;

      const latSpeed = 12.5 * this.settings.sensitivity;
      this.targetLaneVelocity = THREE.MathUtils.lerp(
        this.targetLaneVelocity,
        steer * latSpeed,
        1 - Math.exp(-14 * dt),
      );
      this.laneOffset = THREE.MathUtils.clamp(
        this.laneOffset + this.targetLaneVelocity * dt,
        -this.activeRoute.corridorHalfWidth,
        this.activeRoute.corridorHalfWidth,
      );

      const sample = sampleCompiledRoute(this.compiledRoute, this.routeDist);
      this.playerX = sample.x + sample.rx * this.laneOffset;
      this.playerZ = sample.z + sample.rz * this.laneOffset;
      this.playerHeading = Math.atan2(-sample.tx, -sample.tz) - steer * 0.16;

      if (this.routeDist >= this.compiledRoute.totalLength) {
        this.finishRun(true, 'Route Completed!');
        return;
      }
    } else {
      // Free Roam 360° Explorer mode
      this.playerHeading -= steer * 2.1 * this.settings.sensitivity * dt;
      const forwardInput = this.keysHeld.has('KeyS') || this.keysHeld.has('ArrowDown') ? 0.55 : 1.0;
      const vx = -Math.sin(this.playerHeading) * speed * forwardInput;
      const vz = -Math.cos(this.playerHeading) * speed * forwardInput;
      const nextX = this.playerX + vx * dt;
      const nextZ = this.playerZ + vz * dt;

      // Building collision push-out in Free Roam
      let blocked = false;
      for (const chunk of this.loadedChunks.values()) {
        for (const c of chunk.colliders) {
          if (
            nextX >= c.minX - 0.55 &&
            nextX <= c.maxX + 0.55 &&
            nextZ >= c.minZ - 0.55 &&
            nextZ <= c.maxZ + 0.55 &&
            this.playerY < c.topY - 0.6
          ) {
            blocked = true;
            break;
          }
        }
        if (blocked) break;
      }
      if (!blocked) {
        this.playerX = nextX;
        this.playerZ = nextZ;
        this.totalDistanceM += Math.hypot(vx * dt, vz * dt);
      } else {
        this.playerHeading += 0.4;
        this.cameraTrauma = Math.min(1, this.cameraTrauma + 0.25);
      }
    }

    // Vertical physics & rooftop / terrain / grind rail grounding
    let floorY = this.region.getTerrainHeight(this.playerX, this.playerZ);
    const inWater = this.region.isInWater(this.playerX, this.playerZ);
    if (!inWater) {
      floorY = Math.max(0.45, floorY);
    } else {
      floorY = -0.6;
    }

    // Check building roofs for landing
    for (const chunk of this.loadedChunks.values()) {
      for (const c of chunk.colliders) {
        if (
          c.isRoof &&
          this.playerX >= c.minX &&
          this.playerX <= c.maxX &&
          this.playerZ >= c.minZ &&
          this.playerZ <= c.maxZ &&
          this.playerY >= c.topY - 0.85
        ) {
          floorY = Math.max(floorY, c.topY);
        }
      }
    }

    // Check grind rails
    this.isGrinding = false;
    if (this.activeRoute.mode === 'sprint') {
      for (const obs of this.obstacles) {
        if (obs.kind !== 'rail') continue;
        if (
          Math.abs(this.routeDist - obs.dist) <= obs.length * 0.52 &&
          Math.abs(this.laneOffset - obs.laneOffset) <= 1.25 &&
          this.playerY >= obs.yBase + 0.55 &&
          this.playerY <= obs.yBase + 1.85 &&
          this.playerVy <= 2.5
        ) {
          this.isGrinding = true;
          this.grindHeight = obs.yBase + 1.15;
          floorY = this.grindHeight;
          if (!obs.triggered) {
            obs.triggered = true;
            const award = awardFlowEvent(this.scoring, 160, 2.5);
            this.scoring = award.state;
            this.setCallout(`RAIL GRIND +${award.pointsAdded}`);
          }
          if (Math.random() < 0.45) {
            this.emitParticles(this.playerX, this.playerY, this.playerZ, 2, 0xfbbf24, 4.5);
          }
          break;
        }
      }
    }

    this.playerVy -= 28.0 * dt;
    this.playerY += this.playerVy * dt;

    if (this.playerY <= floorY) {
      if (!this.isGrounded && this.playerVy < -6) {
        this.squashY = 0.76;
        this.sound.playFootstep(inWater ? 'water' : 'road');
      }
      this.playerY = floorY;
      this.playerVy = 0;
      this.isGrounded = true;

      if (inWater && this.activeRoute.mode === 'freeroam' && !this.isGrinding) {
        // Splash penalty if running deep into Windermere off-pier
        this.handleHazardHit('Fell in Windermere!', true);
        const start = sampleCompiledRoute(this.compiledRoute, 0);
        this.playerX = start.x;
        this.playerZ = start.z;
        this.playerY = Math.max(0.6, this.region.getTerrainHeight(start.x, start.z));
      }
    } else {
      this.isGrounded = false;
    }

    // Sprint Obstacles, Tokens & Traffic Interactions
    this.resolveTokensAndObstacles(dt);

    // Distance-synced stride & footsteps
    this.stridePhase += speed * dt * 1.45;
    if (this.isGrounded && !this.isSliding() && !this.isGrinding) {
      this.footstepTimer -= dt * (speed / 10);
      if (this.footstepTimer <= 0) {
        this.footstepTimer = 0.28;
        this.sound.playFootstep(this.activeRoute.mode === 'sprint' ? 'road' : 'grass');
      }
    }

    this.squashY = THREE.MathUtils.lerp(this.squashY, 1, 1 - Math.exp(-12 * dt));
    this.runner.root.position.set(this.playerX, this.playerY, this.playerZ);
    this.runner.root.rotation.y = this.playerHeading;
    this.runner.contactShadow.position.y = Math.max(0.02, floorY - this.playerY + 0.02);

    animateRunnerRig(this.runner, {
      stridePhase: this.stridePhase,
      speedMps: speed,
      isAirborne: !this.isGrounded && !this.isGrinding,
      isSliding: this.isSliding(),
      isGrinding: this.isGrinding,
      steerTilt: this.steerTilt,
      squashY: this.squashY,
      time: this.elapsedTime,
      dt,
    });

    this.sound.setGameplayState(true, speed, this.isGrinding);
    this.updateChaseCamera(dt, speed);
    void this.updateChunkStreaming(this.playerX, this.playerZ, false);

    // Throttled HUD updates (~12Hz)
    this.hudThrottleTimer += dt;
    if (this.hudThrottleTimer >= 0.08) {
      this.hudThrottleTimer = 0;
      this.pushHudSnapshot();
    }
  }

  private resolveTokensAndObstacles(dt: number): void {
    // 1. Cairn Tokens
    for (const tok of this.tokens) {
      if (tok.collected) continue;
      tok.mesh.rotation.y += dt * 2.4;
      const dx = tok.mesh.position.x - this.playerX;
      const dz = tok.mesh.position.z - this.playerZ;
      const dy = tok.mesh.position.y + 0.85 - (this.playerY + 0.9);
      if (dx * dx + dz * dz < 3.4 && Math.abs(dy) < 1.8) {
        tok.collected = true;
        tok.mesh.visible = false;
        const award = awardFlowEvent(this.scoring, 120, 1.4, true);
        this.scoring = award.state;
        this.sound.playPickup(this.scoring.combo);
        this.emitParticles(tok.mesh.position.x, tok.mesh.position.y + 0.8, tok.mesh.position.z, 10, 0xfbbf24, 6);
        this.setCallout(`CAIRN +${award.pointsAdded}`);
      }
    }

    if (this.activeRoute.mode !== 'sprint') return;

    // 2. Parkour Hurdles, Sign Arches & Launch Ramps
    for (const obs of this.obstacles) {
      const dz = Math.abs(this.routeDist - obs.dist);
      const dx = Math.abs(this.laneOffset - obs.laneOffset);
      if (dz > obs.length * 0.65 || dx > obs.width * 0.55) continue;

      if (obs.kind === 'ramp' && !obs.triggered) {
        obs.triggered = true;
        this.playerVy = 15.2;
        this.isGrounded = false;
        this.squashY = 1.28;
        this.sound.playVault();
        const award = awardFlowEvent(this.scoring, 180, 3.0);
        this.scoring = award.state;
        this.setCallout(`RAMP LAUNCH +${award.pointsAdded}`);
      } else if (obs.kind === 'hurdle') {
        const clearance = this.playerY - obs.yBase;
        if (clearance >= 0.72) {
          if (!obs.triggered) {
            obs.triggered = true;
            this.sound.playVault();
            const award = awardFlowEvent(this.scoring, 150, 1.6);
            this.scoring = award.state;
            this.setCallout(`CLEAN VAULT +${award.pointsAdded}`);
          }
        } else if (!obs.triggered) {
          obs.triggered = true;
          this.handleHazardHit('Clipped dry-stone wall!', false);
        }
      } else if (obs.kind === 'sign_arch') {
        if (this.isSliding()) {
          if (!obs.triggered) {
            obs.triggered = true;
            const award = awardFlowEvent(this.scoring, 150, 1.6);
            this.scoring = award.state;
            this.setCallout(`SLIDE FLOW +${award.pointsAdded}`);
          }
        } else if (this.playerY - obs.yBase < 2.2 && !obs.triggered) {
          obs.triggered = true;
          this.handleHazardHit('Hit overhead sign!', false);
        }
      }
    }

    // 3. Moving British Left-Hand Traffic
    const total = this.compiledRoute.totalLength;
    for (const v of this.traffic) {
      v.dist += v.direction * v.speedMps * dt;
      if (v.dist < 40) v.dist = total - 50;
      if (v.dist > total - 40) v.dist = 50;

      const s = sampleCompiledRoute(this.compiledRoute, v.dist);
      const vx = s.x + s.rx * v.laneOffset;
      const vz = s.z + s.rz * v.laneOffset;
      const vy = Math.max(0.45, this.region.getTerrainHeight(vx, vz));
      v.mesh.position.set(vx, vy, vz);
      const yaw = Math.atan2(-s.tx, -s.tz) + (v.direction === -1 ? Math.PI : 0);
      v.mesh.rotation.y = yaw;

      const dAlong = Math.abs(this.routeDist - v.dist);
      const dLat = Math.abs(this.laneOffset - v.laneOffset);
      if (dAlong < v.halfL + 0.5 && dLat < v.halfW + 0.45 && this.playerY - vy < 2.2) {
        this.handleHazardHit('Traffic collision!', false);
      } else if (!v.nearMissed && dAlong < v.halfL + 1.5 && dLat < v.halfW + 1.6) {
        v.nearMissed = true;
        const award = awardFlowEvent(this.scoring, 200, 2.2);
        this.scoring = award.state;
        this.setCallout(`NEAR MISS +${award.pointsAdded}`);
        this.sound.playPickup(this.scoring.combo);
      } else if (dAlong > 25) {
        v.nearMissed = false;
      }
    }
  }

  private handleHazardHit(reason: string, isWater: boolean): void {
    if (this.invulnTimer > 0) return;
    this.scoring = applyCollisionPenalty(this.scoring);
    this.invulnTimer = 1.4;
    this.hitstopTimer = 0.055;
    this.cameraTrauma = 0.85;
    this.sound.playCollision(isWater);
    this.emitParticles(this.playerX, this.playerY + 0.8, this.playerZ, 18, isWater ? 0x38bdf8 : 0xef4444, 8);
    this.setCallout('STUMBLE! MOMENTUM LOST');

    if (this.scoring.hearts <= 0) {
      this.finishRun(false, reason);
    }
  }

  private finishRun(victory: boolean, reason: string): void {
    this.gameState = 'gameover';
    this.sound.setGameplayState(false, 0, false);
    this.sound.playFinishFanfare(victory);
    this.pushHudSnapshot();

    const result = buildRunResult(
      this.activeRoute,
      victory,
      reason,
      this.scoring,
      this.runElapsedSec,
      this.totalDistanceM,
      this.tokens.length,
      this.prevRecord,
    );
    this.callbacks.onRunEnd(result);
  }

  private updateChaseCamera(dt: number, speedMps: number): void {
    const backDist = 5.2 + (speedMps / 32) * 1.4;
    const dropFactor = this.skyDropTimer > 0 ? this.skyDropTimer / 0.85 : 0;
    const height = 2.45 + dropFactor * dropFactor * 14.0;

    const fx = -Math.sin(this.playerHeading);
    const fz = -Math.cos(this.playerHeading);

    const desiredX = this.playerX - fx * backDist;
    const desiredZ = this.playerZ - fz * backDist;
    const terrainAtCam = Math.max(0.5, this.region.getTerrainHeight(desiredX, desiredZ));
    const desiredY = Math.max(terrainAtCam + 1.4, this.playerY + height);

    const damp = 1 - Math.exp(-9.5 * dt);
    this.camPos.lerp(_v1.set(desiredX, desiredY, desiredZ), damp);
    this.camLook.lerp(
      _v2.set(this.playerX + fx * 15, this.playerY + 1.55, this.playerZ + fz * 15),
      1 - Math.exp(-12 * dt),
    );

    // Trauma shake
    this.cameraTrauma = Math.max(0, this.cameraTrauma - 2.1 * dt);
    const shake = this.cameraTrauma * this.cameraTrauma * 0.45;
    const sx = (Math.random() - 0.5) * shake;
    const sy = (Math.random() - 0.5) * shake;

    this.camera.position.set(this.camPos.x + sx, this.camPos.y + sy, this.camPos.z);
    this.camera.lookAt(this.camLook);

    const targetFov = 62 + Math.max(0, speedMps - 10) * 0.65;
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 1 - Math.exp(-5 * dt));
      this.camera.updateProjectionMatrix();
    }
  }

  private updatePhotoCamera(dt: number): void {
    const dist = 8.5 * this.photoZoom;
    const horiz = Math.cos(this.photoOrbitPitch) * dist;
    const py = this.playerY + 1.4 + Math.sin(this.photoOrbitPitch) * dist;
    const px = this.playerX + Math.sin(this.photoOrbitYaw) * horiz;
    const pz = this.playerZ + Math.cos(this.photoOrbitYaw) * horiz;
    const damp = 1 - Math.exp(-10 * dt);
    this.camera.position.lerp(_v1.set(px, py, pz), damp);
    this.camera.lookAt(this.playerX, this.playerY + 1.1, this.playerZ);
  }

  private updateAmbientActors(dt: number): void {
    for (const s of this.steamers) {
      s.z += s.dirZ * s.speed * dt;
      if (s.z < 120) s.dirZ = 1;
      if (s.z > 15200) s.dirZ = -1;
      s.mesh.position.set(s.x, Math.sin(this.elapsedTime * 1.6 + s.x) * 0.12, s.z);
      s.mesh.rotation.y = s.dirZ === 1 ? Math.PI : 0;
    }

    for (const sh of this.sheep) {
      sh.phase += dt * 0.8;
      sh.mesh.position.x = sh.baseX + Math.sin(sh.phase) * 1.2;
      sh.mesh.position.z = sh.baseZ + Math.cos(sh.phase * 0.7) * 1.2;
    }
  }

  private updateParticles(dt: number): void {
    let anyChanged = false;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.active) continue;
      anyChanged = true;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        _dummy.position.set(0, -500, 0);
        _dummy.scale.setScalar(0.001);
        _dummy.updateMatrix();
        this.particlePoolMesh.setMatrixAt(i, _dummy.matrix);
        continue;
      }
      p.vy -= 14 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      const t = 1 - p.life / p.maxLife;
      _dummy.position.set(p.x, p.y, p.z);
      _dummy.scale.setScalar(p.scale * t);
      _dummy.updateMatrix();
      this.particlePoolMesh.setMatrixAt(i, _dummy.matrix);
      this.particlePoolMesh.setColorAt(i, p.color);
    }
    if (anyChanged) {
      this.particlePoolMesh.instanceMatrix.needsUpdate = true;
      if (this.particlePoolMesh.instanceColor) {
        this.particlePoolMesh.instanceColor.needsUpdate = true;
      }
    }
  }

  private updateRain(dt: number): void {
    if (!this.rainMesh || !this.rainMesh.visible) return;
    this.rainMesh.position.set(this.playerX, this.playerY, this.playerZ);
    const pos = this.rainMesh.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) - 26 * dt;
      if (y < -2) y = 32;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  private isSliding(): boolean {
    return this.slideTimer > 0;
  }

  private setCallout(text: string): void {
    this.actionCallout = text;
    this.calloutTimer = 1.4;
  }

  private pushHudSnapshot(): void {
    const progress =
      this.activeRoute.mode === 'sprint' && this.compiledRoute.totalLength > 0
        ? Math.min(1, this.routeDist / this.compiledRoute.totalLength)
        : 0;
    this.callbacks.onHudUpdate({
      score: Math.round(this.scoring.score),
      combo: this.scoring.combo,
      comboTimer: Math.max(0, Math.min(1, this.scoring.comboTimer / 4.2)),
      speedKmh: speedMpsToKmh(this.scoring.speedMps),
      hearts: this.scoring.hearts,
      maxHearts: 3,
      progress,
      distanceMeters: Math.round(this.totalDistanceM),
      elapsedSec: Math.round(this.runElapsedSec),
      tokensCollected: this.scoring.tokensCollected,
      totalTokens: this.tokens.length,
      actionCallout: this.actionCallout,
      nearSettlement: this.region.getNearestSettlement(this.playerX, this.playerZ),
      playerX: this.playerX,
      playerZ: this.playerZ,
      playerHeading: this.playerHeading,
      fps: this.currentFps,
      isGrinding: this.isGrinding,
      isSliding: this.isSliding(),
      isAirborne: !this.isGrounded && !this.isGrinding,
    });
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.gameState !== 'playing') return;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    const firstPress = !this.keysHeld.has(e.code);
    this.keysHeld.add(e.code);
    this.sound.unlock();

    if (firstPress && (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp')) {
      this.jumpBufferTimer = 0.14;
    }
    if (firstPress && (e.code === 'KeyS' || e.code === 'ArrowDown')) {
      this.triggerTouchSlide();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keysHeld.delete(e.code);
    // Variable jump height cut
    if (
      (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') &&
      this.playerVy > 4
    ) {
      this.playerVy *= 0.52;
    }
  };

  private onWindowBlur = () => {
    this.keysHeld.clear();
    this.virtualSteer = 0;
  };

  private onResize = () => {
    if (!this.renderer || !this.camera) return;
    const width = Math.max(1, this.container.clientWidth || window.innerWidth);
    const height = Math.max(1, this.container.clientHeight || window.innerHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private bindEvents(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onWindowBlur);
    window.addEventListener('resize', this.onResize);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }
  }

  public getRegionManifest() {
    return this.region.manifest;
  }

  public getLakeData() {
    return this.region.lake;
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.resizeObserver?.disconnect();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onWindowBlur);
    window.removeEventListener('resize', this.onResize);

    for (const chunk of this.loadedChunks.values()) {
      this.scene.remove(chunk.group);
      chunk.dispose();
    }
    this.loadedChunks.clear();

    this.terrainMesh?.geometry.dispose();
    this.waterMesh?.geometry.dispose();
    this.textures?.dispose();
    this.sound.dispose();
    this.renderer?.dispose();
    if (this.renderer?.domElement?.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
