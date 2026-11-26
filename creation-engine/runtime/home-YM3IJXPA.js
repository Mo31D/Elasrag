var $d=Object.defineProperty;var gt=(r,e)=>()=>(r&&(e=r(r=0)),e);var Qd=(r,e)=>{for(var t in e)$d(r,t,{get:e[t],enumerable:!0})};function Mh(r){return Object.hasOwn(yh,r)?yh[r]:null}function Sh(r,e){return!!r&&r.pointerId===e.pointerId&&e.time>=r.time&&e.time-r.time<700&&Math.max(e.maxDistance||0,Math.hypot(e.x-r.x,e.y-r.y))<8}var yh,ja=gt(()=>{yh=Object.freeze({technology:{label:"Build",kicker:"CONNECTED SYSTEMS",title:"Make technology useful.",description:"Websites, applications and digital tools. I connect thoughtful interfaces with the systems that make them work.",detail:"The layers connect: interface, logic, data.",example:"Explore a learning experience",href:"https://elasrag.com/adam/",diagram:"layers"},ai:{label:"Think",kicker:"AI & INNOVATION",title:"Explore what\u2019s possible.",description:"Exploring AI and emerging technology to make information approachable and new ideas useful.",detail:"Connections grow into a structured network.",example:"Start a conversation about an idea",href:"mailto:mo@elasrag.com",diagram:"network"},design:{label:"Design",kicker:"DESIGN & DEVELOPMENT",title:"Give ideas their own form.",description:"From an early sketch to an interactive experience. I bring structure, visual thinking and development together.",detail:"Construction lines resolve into a usable form.",example:"Explore this creation process",href:"#experience",diagram:"construction"},strategy:{label:"Solve",kicker:"STRATEGY & PROBLEM SOLVING",title:"Make complexity clear.",description:"Understand the problem. Question assumptions. Connect the right pieces, then build something that makes sense.",detail:"A considered route connects the starting point to a solution.",example:"Tell me what you have in mind",href:"mailto:mo@elasrag.com",diagram:"path"},mo:{label:"Meet Mo",kicker:"THE PERSON BEHIND THE IDEAS",title:"You can call me Mo.",description:"I\u2019m Mohamed El-Asrag. Curious by nature, creative by instinct, and fascinated by what technology can make possible.",detail:"United Kingdom \xB7 Working globally",example:"Say hello to Mo",href:"mailto:mo@elasrag.com",diagram:"signature"}})});var Ti,bh=gt(()=>{Ti={width:1200,height:1200,coordinateSystem:"normalized-top-left",anchors:{mo:{x:.50000006,y:.5},ai:{x:.74057102,y:.2541706},design:{x:.74057102,y:.77113308},strategy:{x:.2396035,y:.75418457},technology:{x:.2396035,y:.23722208}}}});function ep(r,e){let t=Math.min(r/Ti.width,e/Ti.height),n=Ti.width*t,i=Ti.height*t;return Object.entries(Ti.anchors).map(([s,a])=>({id:s,x:(r-n)/2+a.x*n,y:(e-i)/2+a.y*i}))}function Th(r){let e=r.querySelector("#engine-poster"),t=r.querySelector("#capability-hotspots"),n=new Map([...t.querySelectorAll("[data-capability]")].map(o=>[o.dataset.capability,o])),i=new AbortController;function s(){if(r.body.dataset.experience==="ready")return;let{width:o,height:l}=e.getBoundingClientRect();if(!(!o||!l)){for(let c of ep(o,l)){let h=n.get(c.id);h&&(h.hidden=!1,h.style.left=`${c.x}px`,h.style.top=`${c.y}px`)}t.hidden=!1}}let a=typeof ResizeObserver=="function"?new ResizeObserver(s):null;return a?.observe(e),e.addEventListener("load",s,{signal:i.signal}),r.defaultView.addEventListener("resize",s,{signal:i.signal}),s(),{refresh:s,dispose(){a?.disconnect(),i.abort()}}}var wh=gt(()=>{bh()});var Ah={};Qd(Ah,{createDiscovery:()=>Eh,discovery:()=>pt});function Eh(r=document){let e=r.querySelector("#capability-panel"),t=[...r.querySelectorAll("[data-capability]")],n=new AbortController,i=new Set,s=Th(r),a=null,o=null;function l(h,u){let d=Mh(h);if(!d)return!1;a=h,o=u||r.activeElement,r.body.dataset.selection=h;for(let f of["kicker","title","description"])r.querySelector(`#capability-${f}`).textContent=d[f];let p=r.querySelector("#capability-example");p.textContent=d.example,p.setAttribute("href",d.href),p.hidden=!1,e.hidden=!1,r.querySelector(".interaction-hint").textContent=d.detail,t.forEach(f=>f.setAttribute("aria-expanded",String(f.dataset.capability===h)));let g=r.querySelector("#experience").getBoundingClientRect();if(u?.closest("#capability-directory")||g.bottom<100||g.top>innerHeight)scrollTo({top:scrollY+g.top,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});else{let f=e.getBoundingClientRect?.();f?.height>0&&(f.top<16||f.bottom>innerHeight-16)&&e.scrollIntoView?.({block:"nearest",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}return e.focus({preventScroll:!0}),i.forEach(f=>f(h)),!0}function c(h=!0){a&&(a=null,delete r.body.dataset.selection,e.hidden=!0,r.querySelector(".interaction-hint").textContent="Choose a point. See what it means.",t.forEach(u=>u.setAttribute("aria-expanded","false")),h&&o?.isConnected&&o.focus({preventScroll:!o.closest("#capability-directory")}),i.forEach(u=>u(null)))}return t.forEach(h=>h.addEventListener("click",()=>l(h.dataset.capability,h),{signal:n.signal})),r.querySelector('[data-action="close-capability"]').addEventListener("click",()=>c(),{signal:n.signal}),r.addEventListener("keydown",h=>{h.key==="Escape"&&a&&(h.preventDefault(),c())},{signal:n.signal}),{get selected(){return a},select:l,close:c,refreshPoster:s.refresh,subscribe(h){return i.add(h),()=>i.delete(h)},dispose(){n.abort(),i.clear(),s.dispose()}}}var pt,qa=gt(()=>{ja();wh();pt=Eh()});function Ht(){let r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0;return(_t[255&r]+_t[r>>8&255]+_t[r>>16&255]+_t[r>>24&255]+"-"+_t[255&e]+_t[e>>8&255]+"-"+_t[e>>16&15|64]+_t[e>>24&255]+"-"+_t[63&t|128]+_t[t>>8&255]+"-"+_t[t>>16&255]+_t[t>>24&255]+_t[255&n]+_t[n>>8&255]+_t[n>>16&255]+_t[n>>24&255]).toLowerCase()}function st(r,e,t){return Math.max(e,Math.min(t,r))}function cl(r,e){return(r%e+e)%e}function Ar(r,e,t){return(1-t)*r+t*e}function Qt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Ve(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}function hd(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Nr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Dp(){let r=Nr("canvas");return r.style.display="block",r}function wr(r){r in Nh||(Nh[r]=!0,console.warn(r))}function xn(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function Gi(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}function Ka(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?hl.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function $a(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){ai.fromArray(r,s);let o=i.x*Math.abs(ai.x)+i.y*Math.abs(ai.y)+i.z*Math.abs(ai.z),l=e.dot(ai),c=t.dot(ai),h=n.dot(ai);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}function uo(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}function Wp(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[256|l]=32768,i[l]=24,i[256|l]=24):c<-14?(n[l]=1024>>-c-14,n[256|l]=1024>>-c-14|32768,i[l]=-c-1,i[256|l]=-c-1):c<=15?(n[l]=c+15<<10,n[256|l]=c+15<<10|32768,i[l]=13,i[256|l]=13):c<128?(n[l]=31744,n[256|l]=64512,i[l]=24,i[256|l]=24):(n[l]=31744,n[256|l]=64512,i[l]=13,i[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:a,offsetTable:o}}function Ts(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,xs),r.getVertexPosition(l,ys),r.getVertexPosition(c,Ms);let h=(function(u,d,p,m,g,f,_,v){let x;if(x=d.side===1?m.intersectTriangle(_,f,g,!0,v):m.intersectTriangle(g,f,_,d.side===0,v),x===null)return null;bs.copy(v),bs.applyMatrix4(u.matrixWorld);let y=p.ray.origin.distanceTo(bs);return y<p.near||y>p.far?null:{distance:y,point:bs.clone(),object:u}})(r,e,t,n,xs,ys,Ms,Jh);if(h){let u=new T;Fn.getBarycoord(Jh,xs,ys,Ms,u),i&&(h.uv=Fn.getInterpolatedAttribute(i,o,l,c,u,new te)),s&&(h.uv1=Fn.getInterpolatedAttribute(s,o,l,c,u,new te)),a&&(h.normal=Fn.getInterpolatedAttribute(a,o,l,c,u,new T),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new T,materialIndex:0};Fn.getNormal(xs,ys,Ms,d.normal),h.face=d,h.barycoord=u}return h}function Qi(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function bt(r){let e={};for(let t=0;t<r.length;t++){let n=Qi(r[t]);for(let i in n)e[i]=n[i]}return e}function dd(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Oe.workingColorSpace}function pd(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Zp(r){let e=new WeakMap;return{get:function(t){return t.isInterleavedBufferAttribute&&(t=t.data),e.get(t)},remove:function(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=e.get(t);n&&(r.deleteBuffer(n.buffer),e.delete(t))},update:function(t,n){if(t.isInterleavedBufferAttribute&&(t=t.data),t.isGLBufferAttribute){let s=e.get(t);return void((!s||s.version<t.version)&&e.set(t,{buffer:t.buffer,type:t.type,bytesPerElement:t.elementSize,version:t.version}))}let i=e.get(t);if(i===void 0)e.set(t,(function(s,a){let o=s.array,l=s.usage,c=o.byteLength,h=r.createBuffer(),u;if(r.bindBuffer(a,h),r.bufferData(a,o,l),s.onUploadCallback(),o instanceof Float32Array)u=r.FLOAT;else if(o instanceof Uint16Array)u=s.isFloat16BufferAttribute?r.HALF_FLOAT:r.UNSIGNED_SHORT;else if(o instanceof Int16Array)u=r.SHORT;else if(o instanceof Uint32Array)u=r.UNSIGNED_INT;else if(o instanceof Int32Array)u=r.INT;else if(o instanceof Int8Array)u=r.BYTE;else if(o instanceof Uint8Array)u=r.UNSIGNED_BYTE;else{if(!(o instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+o);u=r.UNSIGNED_BYTE}return{buffer:h,type:u,bytesPerElement:o.BYTES_PER_ELEMENT,version:s.version,size:c}})(t,n));else if(i.version<t.version){if(i.size!==t.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(s,a,o){let l=a.array,c=a.updateRanges;if(r.bindBuffer(o,s),c.length===0)r.bufferSubData(o,0,l);else{c.sort(((u,d)=>u.start-d.start));let h=0;for(let u=1;u<c.length;u++){let d=c[h],p=c[u];p.start<=d.start+d.count+1?d.count=Math.max(d.count,p.start+p.count-d.start):(++h,c[h]=p)}c.length=h+1;for(let u=0,d=c.length;u<d;u++){let p=c[u];r.bufferSubData(o,p.start*l.BYTES_PER_ELEMENT,l,p.start,p.count)}a.clearUpdateRanges()}a.onUploadCallback()})(i.buffer,t,n),i.version=t.version}}}}function Jp(r,e,t,n,i,s,a){let o=new xe(0),l,c,h=s===!0?0:1,u=null,d=0,p=null;function m(f){let _=f.isScene===!0?f.background:null;return _&&_.isTexture&&(_=(f.backgroundBlurriness>0?t:e).get(_)),_}function g(f,_){f.getRGB(Es,dd(r)),n.buffers.color.setClear(Es.r,Es.g,Es.b,_,a)}return{getClearColor:function(){return o},setClearColor:function(f,_=1){o.set(f),h=_,g(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(f){h=f,g(o,h)},render:function(f){let _=!1,v=m(f);v===null?g(o,h):v&&v.isColor&&(g(v,1),_=!0);let x=r.xr.getEnvironmentBlendMode();x==="additive"?n.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))},addToRenderList:function(f,_){let v=m(_);v&&(v.isCubeTexture||v.mapping===ba)?(c===void 0&&(c=new ze(new Xn(1,1,1),new Gt({name:"BackgroundCubeMaterial",uniforms:Qi(on.backgroundCube.uniforms),vertexShader:on.backgroundCube.vertexShader,fragmentShader:on.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(x,y,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),ci.copy(_.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),c.material.uniforms.envMap.value=v,c.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Kp.makeRotationFromEuler(ci)),c.material.toneMapped=Oe.getTransfer(v.colorSpace)!==We,u===v&&d===v.version&&p===r.toneMapping||(c.material.needsUpdate=!0,u=v,d=v.version,p=r.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ze(new Br(2,2),new Gt({name:"BackgroundMaterial",uniforms:Qi(on.background.uniforms),vertexShader:on.background.vertexShader,fragmentShader:on.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=Oe.getTransfer(v.colorSpace)!==We,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),u===v&&d===v.version&&p===r.toneMapping||(l.material.needsUpdate=!0,u=v,d=v.version,p=r.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))}}}function $p(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=c(null),s=i,a=!1;function o(_){return r.bindVertexArray(_)}function l(_){return r.deleteVertexArray(_)}function c(_){let v=[],x=[],y=[];for(let A=0;A<t;A++)v[A]=0,x[A]=0,y[A]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:v,enabledAttributes:x,attributeDivisors:y,object:_,attributes:{},index:null}}function h(){let _=s.newAttributes;for(let v=0,x=_.length;v<x;v++)_[v]=0}function u(_){d(_,0)}function d(_,v){let x=s.newAttributes,y=s.enabledAttributes,A=s.attributeDivisors;x[_]=1,y[_]===0&&(r.enableVertexAttribArray(_),y[_]=1),A[_]!==v&&(r.vertexAttribDivisor(_,v),A[_]=v)}function p(){let _=s.newAttributes,v=s.enabledAttributes;for(let x=0,y=v.length;x<y;x++)v[x]!==_[x]&&(r.disableVertexAttribArray(x),v[x]=0)}function m(_,v,x,y,A,M,C){C===!0?r.vertexAttribIPointer(_,v,x,A,M):r.vertexAttribPointer(_,v,x,y,A,M)}function g(){f(),a=!0,s!==i&&(s=i,o(s.object))}function f(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:function(_,v,x,y,A){let M=!1,C=(function(L,U,z){let V=z.wireframe===!0,H=n[L.id];H===void 0&&(H={},n[L.id]=H);let j=H[U.id];j===void 0&&(j={},H[U.id]=j);let G=j[V];return G===void 0&&(G=c(r.createVertexArray()),j[V]=G),G})(y,x,v);s!==C&&(s=C,o(s.object)),M=(function(L,U,z,V){let H=s.attributes,j=U.attributes,G=0,Y=z.getAttributes();for(let K in Y)if(Y[K].location>=0){let ie=H[K],ne=j[K];if(ne===void 0&&(K==="instanceMatrix"&&L.instanceMatrix&&(ne=L.instanceMatrix),K==="instanceColor"&&L.instanceColor&&(ne=L.instanceColor)),ie===void 0||ie.attribute!==ne||ne&&ie.data!==ne.data)return!0;G++}return s.attributesNum!==G||s.index!==V})(_,y,x,A),M&&(function(L,U,z,V){let H={},j=U.attributes,G=0,Y=z.getAttributes();for(let K in Y)if(Y[K].location>=0){let ie=j[K];ie===void 0&&(K==="instanceMatrix"&&L.instanceMatrix&&(ie=L.instanceMatrix),K==="instanceColor"&&L.instanceColor&&(ie=L.instanceColor));let ne={};ne.attribute=ie,ie&&ie.data&&(ne.data=ie.data),H[K]=ne,G++}s.attributes=H,s.attributesNum=G,s.index=V})(_,y,x,A),A!==null&&e.update(A,r.ELEMENT_ARRAY_BUFFER),(M||a)&&(a=!1,(function(L,U,z,V){h();let H=V.attributes,j=z.getAttributes(),G=U.defaultAttributeValues;for(let Y in j){let K=j[Y];if(K.location>=0){let ie=H[Y];if(ie===void 0&&(Y==="instanceMatrix"&&L.instanceMatrix&&(ie=L.instanceMatrix),Y==="instanceColor"&&L.instanceColor&&(ie=L.instanceColor)),ie!==void 0){let ne=ie.normalized,fe=ie.itemSize,ve=e.get(ie);if(ve===void 0)continue;let ee=ve.buffer,se=ve.type,ue=ve.bytesPerElement,de=se===r.INT||se===r.UNSIGNED_INT||ie.gpuType===hc;if(ie.isInterleavedBufferAttribute){let oe=ie.data,E=oe.stride,w=ie.offset;if(oe.isInstancedInterleavedBuffer){for(let N=0;N<K.locationSize;N++)d(K.location+N,oe.meshPerAttribute);L.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let N=0;N<K.locationSize;N++)u(K.location+N);r.bindBuffer(r.ARRAY_BUFFER,ee);for(let N=0;N<K.locationSize;N++)m(K.location+N,fe/K.locationSize,se,ne,E*ue,(w+fe/K.locationSize*N)*ue,de)}else{if(ie.isInstancedBufferAttribute){for(let oe=0;oe<K.locationSize;oe++)d(K.location+oe,ie.meshPerAttribute);L.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let oe=0;oe<K.locationSize;oe++)u(K.location+oe);r.bindBuffer(r.ARRAY_BUFFER,ee);for(let oe=0;oe<K.locationSize;oe++)m(K.location+oe,fe/K.locationSize,se,ne,fe*ue,fe/K.locationSize*oe*ue,de)}}else if(G!==void 0){let ne=G[Y];if(ne!==void 0)switch(ne.length){case 2:r.vertexAttrib2fv(K.location,ne);break;case 3:r.vertexAttrib3fv(K.location,ne);break;case 4:r.vertexAttrib4fv(K.location,ne);break;default:r.vertexAttrib1fv(K.location,ne)}}}}p()})(_,v,x,y),A!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(A).buffer))},reset:g,resetDefaultState:f,dispose:function(){g();for(let _ in n){let v=n[_];for(let x in v){let y=v[x];for(let A in y)l(y[A].object),delete y[A];delete v[x]}delete n[_]}},releaseStatesOfGeometry:function(_){if(n[_.id]===void 0)return;let v=n[_.id];for(let x in v){let y=v[x];for(let A in y)l(y[A].object),delete y[A];delete v[x]}delete n[_.id]},releaseStatesOfProgram:function(_){for(let v in n){let x=n[v];if(x[_.id]===void 0)continue;let y=x[_.id];for(let A in y)l(y[A].object),delete y[A];delete x[_.id]}},initAttributes:h,enableAttribute:u,disableUnusedAttributes:p}}function Qp(r,e,t){let n;function i(s,a,o){o!==0&&(r.drawArraysInstanced(n,s,a,o),t.update(a,n,o))}this.setMode=function(s){n=s},this.render=function(s,a){r.drawArrays(n,s,a),t.update(a,n,1)},this.renderInstances=i,this.renderMultiDraw=function(s,a,o){if(o===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,s,0,a,0,o);let l=0;for(let c=0;c<o;c++)l+=a[c];t.update(l,n,1)},this.renderMultiDrawInstances=function(s,a,o,l){if(o===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<s.length;h++)i(s[h],a[h],l[h]);else{c.multiDrawArraysInstancedWEBGL(n,s,0,a,0,l,0,o);let h=0;for(let u=0;u<o;u++)h+=a[u]*l[u];t.update(h,n,1)}}}function ef(r,e,t,n){let i;function s(d){if(d==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";d="mediump"}return d==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=t.precision!==void 0?t.precision:"highp",o=s(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=t.logarithmicDepthBuffer===!0,c=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),u=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let d=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(d.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i},getMaxPrecision:s,textureFormatReadable:function(d){return d===tn||n.convert(d)===r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(d){let p=d===$r&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(d!==Gn&&n.convert(d)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&d!==en&&!p)},precision:a,logarithmicDepthBuffer:l,reverseDepthBuffer:c,maxTextures:h,maxVertexTextures:u,maxTextureSize:r.getParameter(r.MAX_TEXTURE_SIZE),maxCubemapSize:r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:r.getParameter(r.MAX_VERTEX_ATTRIBS),maxVertexUniforms:r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:r.getParameter(r.MAX_VARYING_VECTORS),maxFragmentUniforms:r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:u>0,maxSamples:r.getParameter(r.MAX_SAMPLES)}}function tf(r){let e=this,t=null,n=0,i=!1,s=!1,a=new _n,o=new Ae,l={value:null,needsUpdate:!1};function c(h,u,d,p){let m=h!==null?h.length:0,g=null;if(m!==0){if(g=l.value,p!==!0||g===null){let f=d+4*m,_=u.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<f)&&(g=new Float32Array(f));for(let v=0,x=d;v!==m;++v,x+=4)a.copy(h[v]).applyMatrix4(_,o),a.normal.toArray(g,x),g[x+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,g}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let d=h.length!==0||u||n!==0||i;return i=u,n=h.length,d},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=c(h,u,0)},this.setState=function(h,u,d){let p=h.clippingPlanes,m=h.clipIntersection,g=h.clipShadows,f=r.get(h);if(!i||p===null||p.length===0||s&&!g)s?c(null):(function(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0})();else{let _=s?0:n,v=4*_,x=f.clippingState||null;l.value=x,x=c(p,u,v,d);for(let y=0;y!==v;++y)x[y]=t[y];f.clippingState=x,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=_}}}function nf(r){let e=new WeakMap;function t(i,s){return s===No?i.mapping=Xi:s===Uo&&(i.mapping=ji),i}function n(i){let s=i.target;s.removeEventListener("dispose",n);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(i){if(i&&i.isTexture){let s=i.mapping;if(s===No||s===Uo){if(e.has(i))return t(e.get(i).texture,i.mapping);{let a=i.image;if(a&&a.height>0){let o=new fl(a.height);return o.fromEquirectangularTexture(r,i),e.set(i,o),i.addEventListener("dispose",n),t(o.texture,i.mapping)}return null}}}return i},dispose:function(){e=new WeakMap}}}function iu(r,e,t){let n=new yn(r,e,t);return n.texture.mapping=ba,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function As(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function ru(){return new Gt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function su(){return new Gt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function _c(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function rf(r){let e=new WeakMap,t=null;function n(i){let s=i.target;s.removeEventListener("dispose",n);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(i){if(i&&i.isTexture){let s=i.mapping,a=s===No||s===Uo,o=s===Xi||s===ji;if(a||o){let l=e.get(i),c=l!==void 0?l.texture.pmremVersion:0;if(i.isRenderTargetTexture&&i.pmremVersion!==c)return t===null&&(t=new nr(r)),l=a?t.fromEquirectangular(i,l):t.fromCubemap(i,l),l.texture.pmremVersion=i.pmremVersion,e.set(i,l),l.texture;if(l!==void 0)return l.texture;{let h=i.image;return a&&h&&h.height>0||o&&h&&(function(u){let d=0,p=6;for(let m=0;m<p;m++)u[m]!==void 0&&d++;return d===p})(h)?(t===null&&(t=new nr(r)),l=a?t.fromEquirectangular(i):t.fromCubemap(i),l.texture.pmremVersion=i.pmremVersion,e.set(i,l),i.addEventListener("dispose",n),l.texture):null}}}return i},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function sf(r){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&wr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function af(r,e,t,n){let i={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let u in c.attributes)e.remove(c.attributes[u]);for(let u in c.morphAttributes){let d=c.morphAttributes[u];for(let p=0,m=d.length;p<m;p++)e.remove(d[p])}c.removeEventListener("dispose",a),delete i[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),n.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,u=l.attributes.position,d=0;if(h!==null){let g=h.array;d=h.version;for(let f=0,_=g.length;f<_;f+=3){let v=g[f+0],x=g[f+1],y=g[f+2];c.push(v,x,x,y,y,v)}}else{if(u===void 0)return;{let g=u.array;d=u.version;for(let f=0,_=g.length/3-1;f<_;f+=3){let v=f+0,x=f+1,y=f+2;c.push(v,x,x,y,y,v)}}}let p=new(hd(c)?Js:Ks)(c,1);p.version=d;let m=s.get(l);m&&e.remove(m),s.set(l,p)}return{get:function(l,c){return i[c.id]===!0||(c.addEventListener("dispose",a),i[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let u in c)e.update(c[u],r.ARRAY_BUFFER);let h=l.morphAttributes;for(let u in h){let d=h[u];for(let p=0,m=d.length;p<m;p++)e.update(d[p],r.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function of(r,e,t){let n,i,s;function a(o,l,c){c!==0&&(r.drawElementsInstanced(n,l,i,o*s,c),t.update(l,n,c))}this.setMode=function(o){n=o},this.setIndex=function(o){i=o.type,s=o.bytesPerElement},this.render=function(o,l){r.drawElements(n,l,i,o*s),t.update(l,n,1)},this.renderInstances=a,this.renderMultiDraw=function(o,l,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,l,0,i,o,0,c);let h=0;for(let u=0;u<c;u++)h+=l[u];t.update(h,n,1)},this.renderMultiDrawInstances=function(o,l,c,h){if(c===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<o.length;d++)a(o[d]/s,l[d],h[d]);else{u.multiDrawElementsInstancedWEBGL(n,l,0,i,o,0,h,0,c);let d=0;for(let p=0;p<c;p++)d+=l[p]*h[p];t.update(d,n,1)}}}function lf(r){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,n,i){switch(e.calls++,n){case r.TRIANGLES:e.triangles+=i*(t/3);break;case r.LINES:e.lines+=i*(t/2);break;case r.LINE_STRIP:e.lines+=i*(t-1);break;case r.LINE_LOOP:e.lines+=i*t;break;case r.POINTS:e.points+=i*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",n)}}}}function cf(r,e,t){let n=new WeakMap,i=new He;return{update:function(s,a,o){let l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=c!==void 0?c.length:0,u=n.get(a);if(u===void 0||u.count!==h){let L=function(){M.dispose(),n.delete(a),a.removeEventListener("dispose",L)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],v=0;d===!0&&(v=1),p===!0&&(v=2),m===!0&&(v=3);let x=a.attributes.position.count*v,y=1;x>e.maxTextureSize&&(y=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let A=new Float32Array(x*y*4*h),M=new Zs(A,x,y,h);M.type=en,M.needsUpdate=!0;let C=4*v;for(let U=0;U<h;U++){let z=g[U],V=f[U],H=_[U],j=x*y*4*U;for(let G=0;G<z.count;G++){let Y=G*C;d===!0&&(i.fromBufferAttribute(z,G),A[j+Y+0]=i.x,A[j+Y+1]=i.y,A[j+Y+2]=i.z,A[j+Y+3]=0),p===!0&&(i.fromBufferAttribute(V,G),A[j+Y+4]=i.x,A[j+Y+5]=i.y,A[j+Y+6]=i.z,A[j+Y+7]=0),m===!0&&(i.fromBufferAttribute(H,G),A[j+Y+8]=i.x,A[j+Y+9]=i.y,A[j+Y+10]=i.z,A[j+Y+11]=H.itemSize===4?i.w:1)}}u={count:h,texture:M,size:new te(x,y)},n.set(a,u),a.addEventListener("dispose",L)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(r,"morphTexture",s.morphTexture,t);else{let d=0;for(let m=0;m<l.length;m++)d+=l[m];let p=a.morphTargetsRelative?1:1-d;o.getUniforms().setValue(r,"morphTargetBaseInfluence",p),o.getUniforms().setValue(r,"morphTargetInfluences",l)}o.getUniforms().setValue(r,"morphTargetsTexture",u.texture,t),o.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}}}function hf(r,e,t,n){let i=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=n.render.frame,l=a.geometry,c=e.get(a,l);if(i.get(c)!==o&&(e.update(c),i.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),i.get(a)!==o&&(t.update(a.instanceMatrix,r.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,r.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;i.get(h)!==o&&(h.update(),i.set(h,o))}return c},dispose:function(){i=new WeakMap}}}function ar(r,e,t){let n=r[0];if(n<=0||n>0)return r;let i=e*t,s=ou[i];if(s===void 0&&(s=new Float32Array(i),ou[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function lt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function ct(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Ea(r,e){let t=lu[e];t===void 0&&(t=new Int32Array(e),lu[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function uf(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function df(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;r.uniform2fv(this.addr,e),ct(t,e)}}function pf(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(lt(t,e))return;r.uniform3fv(this.addr,e),ct(t,e)}}function ff(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;r.uniform4fv(this.addr,e),ct(t,e)}}function mf(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(lt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,n))return;uu.set(n),r.uniformMatrix2fv(this.addr,!1,uu),ct(t,n)}}function gf(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(lt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,n))return;hu.set(n),r.uniformMatrix3fv(this.addr,!1,hu),ct(t,n)}}function _f(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(lt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,n))return;cu.set(n),r.uniformMatrix4fv(this.addr,!1,cu),ct(t,n)}}function vf(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function xf(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;r.uniform2iv(this.addr,e),ct(t,e)}}function yf(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(lt(t,e))return;r.uniform3iv(this.addr,e),ct(t,e)}}function Mf(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;r.uniform4iv(this.addr,e),ct(t,e)}}function Sf(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function bf(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;r.uniform2uiv(this.addr,e),ct(t,e)}}function Tf(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(lt(t,e))return;r.uniform3uiv(this.addr,e),ct(t,e)}}function wf(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;r.uniform4uiv(this.addr,e),ct(t,e)}}function Ef(r,e,t){let n=this.cache,i=t.allocateTextureUnit(),s;n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),this.type===r.SAMPLER_2D_SHADOW?(au.compareFunction=515,s=au):s=fd,t.setTexture2D(e||s,i)}function Af(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||gd,i)}function Rf(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||_d,i)}function Cf(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||md,i)}function If(r,e){r.uniform1fv(this.addr,e)}function Pf(r,e){let t=ar(e,this.size,2);r.uniform2fv(this.addr,t)}function Lf(r,e){let t=ar(e,this.size,3);r.uniform3fv(this.addr,t)}function Df(r,e){let t=ar(e,this.size,4);r.uniform4fv(this.addr,t)}function Nf(r,e){let t=ar(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Uf(r,e){let t=ar(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Of(r,e){let t=ar(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Bf(r,e){r.uniform1iv(this.addr,e)}function Ff(r,e){r.uniform2iv(this.addr,e)}function zf(r,e){r.uniform3iv(this.addr,e)}function kf(r,e){r.uniform4iv(this.addr,e)}function Hf(r,e){r.uniform1uiv(this.addr,e)}function Vf(r,e){r.uniform2uiv(this.addr,e)}function Gf(r,e){r.uniform3uiv(this.addr,e)}function Wf(r,e){r.uniform4uiv(this.addr,e)}function Xf(r,e,t){let n=this.cache,i=e.length,s=Ea(t,i);lt(n,s)||(r.uniform1iv(this.addr,s),ct(n,s));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||fd,s[a])}function jf(r,e,t){let n=this.cache,i=e.length,s=Ea(t,i);lt(n,s)||(r.uniform1iv(this.addr,s),ct(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||gd,s[a])}function qf(r,e,t){let n=this.cache,i=e.length,s=Ea(t,i);lt(n,s)||(r.uniform1iv(this.addr,s),ct(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||_d,s[a])}function Yf(r,e,t){let n=this.cache,i=e.length,s=Ea(t,i);lt(n,s)||(r.uniform1iv(this.addr,s),ct(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||md,s[a])}function du(r,e){r.seq.push(e),r.map[e.id]=e}function Zf(r,e,t){let n=r.name,i=n.length;for(Mo.lastIndex=0;;){let s=Mo.exec(n),a=Mo.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===i){du(t,c===void 0?new ml(o,r,e):new gl(o,r,e));break}{let h=t.map[o];h===void 0&&(h=new _l(o),du(t,h)),t=h}}}function pu(r,e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}function mu(r,e,t){let n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";let s=/ERROR: 0:(\d+)/.exec(i);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+(function(o,l){let c=o.split(`
`),h=[],u=Math.max(l-6,0),d=Math.min(l+6,c.length);for(let p=u;p<d;p++){let m=p+1;h.push(`${m===l?">":" "} ${m}: ${c[p]}`)}return h.join(`
`)})(r.getShaderSource(e),a)}return i}function Jf(r,e){let t=(function(n){Oe._getMatrix(fu,Oe.workingColorSpace,n);let i=`mat3( ${fu.elements.map((s=>s.toFixed(4)))} )`;switch(Oe.getTransfer(n)){case wa:return[i,"LinearTransferOETF"];case We:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[i,"LinearTransferOETF"]}})(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $f(r,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="Cineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Qf(){return Oe.getLuminanceCoefficients(Rs),["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${Rs.x.toFixed(4)}, ${Rs.y.toFixed(4)}, ${Rs.z.toFixed(4)} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yr(r){return r!==""}function gu(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _u(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function vl(r){return r.replace(em,nm)}function nm(r,e){let t=Ce[e];if(t===void 0){let n=tm.get(e);if(n===void 0)throw new Error("Can not resolve #include <"+e+">");t=Ce[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n)}return vl(t)}function vu(r){return r.replace(im,rm)}function rm(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function xu(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function sm(r,e,t,n){let i=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=(function(V){let H="SHADOWMAP_TYPE_BASIC";return V.shadowMapType===1?H="SHADOWMAP_TYPE_PCF":V.shadowMapType===2?H="SHADOWMAP_TYPE_PCF_SOFT":V.shadowMapType===3&&(H="SHADOWMAP_TYPE_VSM"),H})(t),c=(function(V){let H="ENVMAP_TYPE_CUBE";if(V.envMap)switch(V.envMapMode){case Xi:case ji:H="ENVMAP_TYPE_CUBE";break;case ba:H="ENVMAP_TYPE_CUBE_UV"}return H})(t),h=(function(V){let H="ENVMAP_MODE_REFLECTION";return V.envMap&&V.envMapMode===ji&&(H="ENVMAP_MODE_REFRACTION"),H})(t),u=(function(V){let H="ENVMAP_BLENDING_NONE";if(V.envMap)switch(V.combine){case 0:H="ENVMAP_BLENDING_MULTIPLY";break;case 1:H="ENVMAP_BLENDING_MIX";break;case 2:H="ENVMAP_BLENDING_ADD"}return H})(t),d=(function(V){let H=V.envMapCubeUVHeight;if(H===null)return null;let j=Math.log2(H)-2,G=1/H;return{texelWidth:1/(3*Math.max(Math.pow(2,j),112)),texelHeight:G,maxMip:j}})(t),p=(function(V){return[V.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",V.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(yr).join(`
`)})(t),m=(function(V){let H=[];for(let j in V){let G=V[j];G!==!1&&H.push("#define "+j+" "+G)}return H.join(`
`)})(s),g=i.createProgram(),f,_,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(yr).join(`
`),f.length>0&&(f+=`
`),_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(yr).join(`
`),_.length>0&&(_+=`
`)):(f=[xu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(yr).join(`
`),_=[xu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Ce.tonemapping_pars_fragment:"",t.toneMapping!==0?$f("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ce.colorspace_pars_fragment,Jf("linearToOutputTexel",t.outputColorSpace),Qf(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(yr).join(`
`)),a=vl(a),a=gu(a,t),a=_u(a,t),o=vl(o),o=gu(o,t),o=_u(o,t),a=vu(a),o=vu(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,_=["#define varying in",t.glslVersion===Lh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);let x=v+f+a,y=v+_+o,A=pu(i,i.VERTEX_SHADER,x),M=pu(i,i.FRAGMENT_SHADER,y);function C(V){if(r.debug.checkShaderErrors){let H=i.getProgramInfoLog(g).trim(),j=i.getShaderInfoLog(A).trim(),G=i.getShaderInfoLog(M).trim(),Y=!0,K=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(Y=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,g,A,M);else{let ie=mu(i,A,"vertex"),ne=mu(i,M,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+V.name+`
Material Type: `+V.type+`

Program Info Log: `+H+`
`+ie+`
`+ne)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):j!==""&&G!==""||(K=!1);K&&(V.diagnostics={runnable:Y,programLog:H,vertexShader:{log:j,prefix:f},fragmentShader:{log:G,prefix:_}})}i.deleteShader(A),i.deleteShader(M),L=new Wi(i,g),U=(function(H,j){let G={},Y=H.getProgramParameter(j,H.ACTIVE_ATTRIBUTES);for(let K=0;K<Y;K++){let ie=H.getActiveAttrib(j,K),ne=ie.name,fe=1;ie.type===H.FLOAT_MAT2&&(fe=2),ie.type===H.FLOAT_MAT3&&(fe=3),ie.type===H.FLOAT_MAT4&&(fe=4),G[ne]={type:ie.type,location:H.getAttribLocation(j,ne),locationSize:fe}}return G})(i,g)}let L,U;i.attachShader(g,A),i.attachShader(g,M),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g),this.getUniforms=function(){return L===void 0&&C(this),L},this.getAttributes=function(){return U===void 0&&C(this),U};let z=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=i.getProgramParameter(g,37297)),z},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Kf++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=A,this.fragmentShader=M,this}function om(r,e,t,n,i,s,a){let o=new Ur,l=new xl,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures,p=i.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(f){return c.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,_,v,x,y){let A=x.fog,M=y.geometry,C=f.isMeshStandardMaterial?x.environment:null,L=(f.isMeshStandardMaterial?t:e).get(f.envMap||C),U=L&&L.mapping===ba?L.image.height:null,z=m[f.type];f.precision!==null&&(p=i.getMaxPrecision(f.precision),p!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",p,"instead."));let V=M.morphAttributes.position||M.morphAttributes.normal||M.morphAttributes.color,H=V!==void 0?V.length:0,j,G,Y,K,ie=0;if(M.morphAttributes.position!==void 0&&(ie=1),M.morphAttributes.normal!==void 0&&(ie=2),M.morphAttributes.color!==void 0&&(ie=3),z){let dr=on[z];j=dr.vertexShader,G=dr.fragmentShader}else j=f.vertexShader,G=f.fragmentShader,l.update(f),Y=l.getVertexShaderID(f),K=l.getFragmentShaderID(f);let ne=r.getRenderTarget(),fe=r.state.buffers.depth.getReversed(),ve=y.isInstancedMesh===!0,ee=y.isBatchedMesh===!0,se=!!f.map,ue=!!f.matcap,de=!!L,oe=!!f.aoMap,E=!!f.lightMap,w=!!f.bumpMap,N=!!f.normalMap,D=!!f.displacementMap,R=!!f.emissiveMap,P=!!f.metalnessMap,S=!!f.roughnessMap,I=f.anisotropy>0,B=f.clearcoat>0,$=f.dispersion>0,O=f.iridescence>0,Z=f.sheen>0,q=f.transmission>0,Q=I&&!!f.anisotropyMap,ce=B&&!!f.clearcoatMap,le=B&&!!f.clearcoatNormalMap,ge=B&&!!f.clearcoatRoughnessMap,Te=O&&!!f.iridescenceMap,Fe=O&&!!f.iridescenceThicknessMap,Pe=Z&&!!f.sheenColorMap,_e=Z&&!!f.sheenRoughnessMap,ke=!!f.specularMap,je=!!f.specularColorMap,Je=!!f.specularIntensityMap,pe=q&&!!f.transmissionMap,Ne=q&&!!f.thicknessMap,Xe=!!f.gradientMap,Si=!!f.alphaMap,as=f.alphaTest>0,jt=!!f.alphaHash,sn=!!f.extensions,ti=0;f.toneMapped&&(ne!==null&&ne.isXRRenderTarget!==!0||(ti=r.toneMapping));let F={shaderID:z,shaderType:f.type,shaderName:f.name,vertexShader:j,fragmentShader:G,defines:f.defines,customVertexShaderID:Y,customFragmentShaderID:K,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:p,batching:ee,batchingColor:ee&&y._colorsTexture!==null,instancing:ve,instancingColor:ve&&y.instanceColor!==null,instancingMorph:ve&&y.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ne===null?r.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:xt,alphaToCoverage:!!f.alphaToCoverage,map:se,matcap:ue,envMap:de,envMapMode:de&&L.mapping,envMapCubeUVHeight:U,aoMap:oe,lightMap:E,bumpMap:w,normalMap:N,displacementMap:d&&D,emissiveMap:R,normalMapObjectSpace:N&&f.normalMapType===1,normalMapTangentSpace:N&&f.normalMapType===0,metalnessMap:P,roughnessMap:S,anisotropy:I,anisotropyMap:Q,clearcoat:B,clearcoatMap:ce,clearcoatNormalMap:le,clearcoatRoughnessMap:ge,dispersion:$,iridescence:O,iridescenceMap:Te,iridescenceThicknessMap:Fe,sheen:Z,sheenColorMap:Pe,sheenRoughnessMap:_e,specularMap:ke,specularColorMap:je,specularIntensityMap:Je,transmission:q,transmissionMap:pe,thicknessMap:Ne,gradientMap:Xe,opaque:f.transparent===!1&&f.blending===1&&f.alphaToCoverage===!1,alphaMap:Si,alphaTest:as,alphaHash:jt,combine:f.combine,mapUv:se&&g(f.map.channel),aoMapUv:oe&&g(f.aoMap.channel),lightMapUv:E&&g(f.lightMap.channel),bumpMapUv:w&&g(f.bumpMap.channel),normalMapUv:N&&g(f.normalMap.channel),displacementMapUv:D&&g(f.displacementMap.channel),emissiveMapUv:R&&g(f.emissiveMap.channel),metalnessMapUv:P&&g(f.metalnessMap.channel),roughnessMapUv:S&&g(f.roughnessMap.channel),anisotropyMapUv:Q&&g(f.anisotropyMap.channel),clearcoatMapUv:ce&&g(f.clearcoatMap.channel),clearcoatNormalMapUv:le&&g(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&g(f.clearcoatRoughnessMap.channel),iridescenceMapUv:Te&&g(f.iridescenceMap.channel),iridescenceThicknessMapUv:Fe&&g(f.iridescenceThicknessMap.channel),sheenColorMapUv:Pe&&g(f.sheenColorMap.channel),sheenRoughnessMapUv:_e&&g(f.sheenRoughnessMap.channel),specularMapUv:ke&&g(f.specularMap.channel),specularColorMapUv:je&&g(f.specularColorMap.channel),specularIntensityMapUv:Je&&g(f.specularIntensityMap.channel),transmissionMapUv:pe&&g(f.transmissionMap.channel),thicknessMapUv:Ne&&g(f.thicknessMap.channel),alphaMapUv:Si&&g(f.alphaMap.channel),vertexTangents:!!M.attributes.tangent&&(N||I),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!M.attributes.color&&M.attributes.color.itemSize===4,pointsUvs:y.isPoints===!0&&!!M.attributes.uv&&(se||Si),fog:!!A,useFog:f.fog===!0,fogExp2:!!A&&A.isFogExp2,flatShading:f.flatShading===!0,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:fe,skinning:y.isSkinnedMesh===!0,morphTargets:M.morphAttributes.position!==void 0,morphNormals:M.morphAttributes.normal!==void 0,morphColors:M.morphAttributes.color!==void 0,morphTargetsCount:H,morphTextureStride:ie,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:r.shadowMap.enabled&&v.length>0,shadowMapType:r.shadowMap.type,toneMapping:ti,decodeVideoTexture:se&&f.map.isVideoTexture===!0&&Oe.getTransfer(f.map.colorSpace)===We,decodeVideoTextureEmissive:R&&f.emissiveMap.isVideoTexture===!0&&Oe.getTransfer(f.emissiveMap.colorSpace)===We,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===2,flipSided:f.side===1,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionClipCullDistance:sn&&f.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(sn&&f.extensions.multiDraw===!0||ee)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return F.vertexUv1s=c.has(1),F.vertexUv2s=c.has(2),F.vertexUv3s=c.has(3),c.clear(),F},getProgramCacheKey:function(f){let _=[];if(f.shaderID?_.push(f.shaderID):(_.push(f.customVertexShaderID),_.push(f.customFragmentShaderID)),f.defines!==void 0)for(let v in f.defines)_.push(v),_.push(f.defines[v]);return f.isRawShaderMaterial===!1&&((function(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)})(_,f),(function(v,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),v.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),v.push(o.mask)})(_,f),_.push(r.outputColorSpace)),_.push(f.customProgramCacheKey),_.join()},getUniforms:function(f){let _=m[f.type],v;if(_){let x=on[_];v=jp.clone(x.uniforms)}else v=f.uniforms;return v},acquireProgram:function(f,_){let v;for(let x=0,y=h.length;x<y;x++){let A=h[x];if(A.cacheKey===_){v=A,++v.usedTimes;break}}return v===void 0&&(v=new sm(r,_,f,s),h.push(v)),v},releaseProgram:function(f){if(--f.usedTimes==0){let _=h.indexOf(f);h[_]=h[h.length-1],h.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:h,dispose:function(){l.dispose()}}}function lm(){let r=new WeakMap;return{has:function(e){return r.has(e)},get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,n){r.get(e)[t]=n},dispose:function(){r=new WeakMap}}}function cm(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function yu(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Mu(){let r=[],e=0,t=[],n=[],i=[];function s(a,o,l,c,h,u){let d=r[e];return d===void 0?(d={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:u},r[e]=d):(d.id=a.id,d.object=a,d.geometry=o,d.material=l,d.groupOrder=c,d.renderOrder=a.renderOrder,d.z=h,d.group=u),e++,d}return{opaque:t,transmissive:n,transparent:i,init:function(){e=0,t.length=0,n.length=0,i.length=0},push:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?n.push(d):l.transparent===!0?i.push(d):t.push(d)},unshift:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?n.unshift(d):l.transparent===!0?i.unshift(d):t.unshift(d)},finish:function(){for(let a=e,o=r.length;a<o;a++){let l=r[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||cm),n.length>1&&n.sort(o||yu),i.length>1&&i.sort(o||yu)}}}function hm(){let r=new WeakMap;return{get:function(e,t){let n=r.get(e),i;return n===void 0?(i=new Mu,r.set(e,[i])):t>=n.length?(i=new Mu,n.push(i)):i=n[t],i},dispose:function(){r=new WeakMap}}}function um(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new T,color:new xe};break;case"SpotLight":t={position:new T,direction:new T,color:new xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new T,color:new xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new T,skyColor:new xe,groundColor:new xe};break;case"RectAreaLight":t={color:new xe,position:new T,halfWidth:new T,halfHeight:new T}}return r[e.id]=t,t}}}function pm(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function fm(r){let e=new um,t=(function(){let o={};return{get:function(l){if(o[l.id]!==void 0)return o[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"PointLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te,shadowCameraNear:1,shadowCameraFar:1e3}}return o[l.id]=c,c}}})(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let o=0;o<9;o++)n.probe.push(new T);let i=new T,s=new ye,a=new ye;return{setup:function(o){let l=0,c=0,h=0;for(let C=0;C<9;C++)n.probe[C].set(0,0,0);let u=0,d=0,p=0,m=0,g=0,f=0,_=0,v=0,x=0,y=0,A=0;o.sort(pm);for(let C=0,L=o.length;C<L;C++){let U=o[C],z=U.color,V=U.intensity,H=U.distance,j=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)l+=z.r*V,c+=z.g*V,h+=z.b*V;else if(U.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(U.sh.coefficients[G],V);A++}else if(U.isDirectionalLight){let G=e.get(U);if(G.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let Y=U.shadow,K=t.get(U);K.shadowIntensity=Y.intensity,K.shadowBias=Y.bias,K.shadowNormalBias=Y.normalBias,K.shadowRadius=Y.radius,K.shadowMapSize=Y.mapSize,n.directionalShadow[u]=K,n.directionalShadowMap[u]=j,n.directionalShadowMatrix[u]=U.shadow.matrix,f++}n.directional[u]=G,u++}else if(U.isSpotLight){let G=e.get(U);G.position.setFromMatrixPosition(U.matrixWorld),G.color.copy(z).multiplyScalar(V),G.distance=H,G.coneCos=Math.cos(U.angle),G.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),G.decay=U.decay,n.spot[p]=G;let Y=U.shadow;if(U.map&&(n.spotLightMap[x]=U.map,x++,Y.updateMatrices(U),U.castShadow&&y++),n.spotLightMatrix[p]=Y.matrix,U.castShadow){let K=t.get(U);K.shadowIntensity=Y.intensity,K.shadowBias=Y.bias,K.shadowNormalBias=Y.normalBias,K.shadowRadius=Y.radius,K.shadowMapSize=Y.mapSize,n.spotShadow[p]=K,n.spotShadowMap[p]=j,v++}p++}else if(U.isRectAreaLight){let G=e.get(U);G.color.copy(z).multiplyScalar(V),G.halfWidth.set(.5*U.width,0,0),G.halfHeight.set(0,.5*U.height,0),n.rectArea[m]=G,m++}else if(U.isPointLight){let G=e.get(U);if(G.color.copy(U.color).multiplyScalar(U.intensity),G.distance=U.distance,G.decay=U.decay,U.castShadow){let Y=U.shadow,K=t.get(U);K.shadowIntensity=Y.intensity,K.shadowBias=Y.bias,K.shadowNormalBias=Y.normalBias,K.shadowRadius=Y.radius,K.shadowMapSize=Y.mapSize,K.shadowCameraNear=Y.camera.near,K.shadowCameraFar=Y.camera.far,n.pointShadow[d]=K,n.pointShadowMap[d]=j,n.pointShadowMatrix[d]=U.shadow.matrix,_++}n.point[d]=G,d++}else if(U.isHemisphereLight){let G=e.get(U);G.skyColor.copy(U.color).multiplyScalar(V),G.groundColor.copy(U.groundColor).multiplyScalar(V),n.hemi[g]=G,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ae.LTC_FLOAT_1,n.rectAreaLTC2=ae.LTC_FLOAT_2):(n.rectAreaLTC1=ae.LTC_HALF_1,n.rectAreaLTC2=ae.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=c,n.ambient[2]=h;let M=n.hash;M.directionalLength===u&&M.pointLength===d&&M.spotLength===p&&M.rectAreaLength===m&&M.hemiLength===g&&M.numDirectionalShadows===f&&M.numPointShadows===_&&M.numSpotShadows===v&&M.numSpotMaps===x&&M.numLightProbes===A||(n.directional.length=u,n.spot.length=p,n.rectArea.length=m,n.point.length=d,n.hemi.length=g,n.directionalShadow.length=f,n.directionalShadowMap.length=f,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=f,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=v+x-y,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=A,M.directionalLength=u,M.pointLength=d,M.spotLength=p,M.rectAreaLength=m,M.hemiLength=g,M.numDirectionalShadows=f,M.numPointShadows=_,M.numSpotShadows=v,M.numSpotMaps=x,M.numLightProbes=A,n.version=dm++)},setupView:function(o,l){let c=0,h=0,u=0,d=0,p=0,m=l.matrixWorldInverse;for(let g=0,f=o.length;g<f;g++){let _=o[g];if(_.isDirectionalLight){let v=n.directional[c];v.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),c++}else if(_.isSpotLight){let v=n.spot[u];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(_.isRectAreaLight){let v=n.rectArea[d];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(_.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(.5*_.width,0,0),v.halfHeight.set(0,.5*_.height,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),d++}else if(_.isPointLight){let v=n.point[h];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),h++}else if(_.isHemisphereLight){let v=n.hemi[p];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(m),p++}}},state:n}}function Su(r){let e=new fm(r),t=[],n=[],i={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:function(s){i.camera=s,t.length=0,n.length=0},state:i,setupLights:function(){e.setup(t)},setupLightsView:function(s){e.setupView(t,s)},pushLight:function(s){t.push(s)},pushShadow:function(s){n.push(s)}}}function mm(r){let e=new WeakMap;return{get:function(t,n=0){let i=e.get(t),s;return i===void 0?(s=new Su(r),e.set(t,[s])):n>=i.length?(s=new Su(r),i.push(s)):s=i[n],s},dispose:function(){e=new WeakMap}}}function gm(r,e,t){let n=new er,i=new te,s=new te,a=new He,o=new Ml({depthPacking:3201}),l=new Sl,c={},h=t.maxTextureSize,u={[ac]:1,[oc]:0,[lc]:2},d=new Gt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new te},radius:{value:4}},vertexShader:`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragmentShader:`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let m=new Ge;m.setAttribute("position",new ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new ze(m,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;function v(M,C){let L=e.update(g);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,p.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new yn(i.x,i.y)),d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,r.setRenderTarget(M.mapPass),r.clear(),r.renderBufferDirect(C,null,L,d,g,null),p.uniforms.shadow_pass.value=M.mapPass.texture,p.uniforms.resolution.value=M.mapSize,p.uniforms.radius.value=M.radius,r.setRenderTarget(M.map),r.clear(),r.renderBufferDirect(C,null,L,p,g,null)}function x(M,C,L,U){let z=null,V=L.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(V!==void 0)z=V;else if(z=L.isPointLight===!0?l:o,r.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let H=z.uuid,j=C.uuid,G=c[H];G===void 0&&(G={},c[H]=G);let Y=G[j];Y===void 0&&(Y=z.clone(),G[j]=Y,C.addEventListener("dispose",A)),z=Y}return z.visible=C.visible,z.wireframe=C.wireframe,z.side=U===3?C.shadowSide!==null?C.shadowSide:C.side:C.shadowSide!==null?C.shadowSide:u[C.side],z.alphaMap=C.alphaMap,z.alphaTest=C.alphaTest,z.map=C.map,z.clipShadows=C.clipShadows,z.clippingPlanes=C.clippingPlanes,z.clipIntersection=C.clipIntersection,z.displacementMap=C.displacementMap,z.displacementScale=C.displacementScale,z.displacementBias=C.displacementBias,z.wireframeLinewidth=C.wireframeLinewidth,z.linewidth=C.linewidth,L.isPointLight===!0&&z.isMeshDistanceMaterial===!0&&(r.properties.get(z).light=L),z}function y(M,C,L,U,z){if(M.visible===!1)return;if(M.layers.test(C.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&z===3)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,M.matrixWorld);let H=e.update(M),j=M.material;if(Array.isArray(j)){let G=H.groups;for(let Y=0,K=G.length;Y<K;Y++){let ie=G[Y],ne=j[ie.materialIndex];if(ne&&ne.visible){let fe=x(M,ne,U,z);M.onBeforeShadow(r,M,C,L,H,fe,ie),r.renderBufferDirect(L,null,H,fe,M,ie),M.onAfterShadow(r,M,C,L,H,fe,ie)}}}else if(j.visible){let G=x(M,j,U,z);M.onBeforeShadow(r,M,C,L,H,G,null),r.renderBufferDirect(L,null,H,G,M,null),M.onAfterShadow(r,M,C,L,H,G,null)}}let V=M.children;for(let H=0,j=V.length;H<j;H++)y(V[H],C,L,U,z)}function A(M){M.target.removeEventListener("dispose",A);for(let C in c){let L=c[C],U=M.target.uuid;U in L&&(L[U].dispose(),delete L[U])}}this.render=function(M,C,L){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||M.length===0)return;let U=r.getRenderTarget(),z=r.getActiveCubeFace(),V=r.getActiveMipmapLevel(),H=r.state;H.setBlending(0),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);let j=_!==3&&this.type===3,G=_===3&&this.type!==3;for(let Y=0,K=M.length;Y<K;Y++){let ie=M[Y],ne=ie.shadow;if(ne===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(ne.autoUpdate===!1&&ne.needsUpdate===!1)continue;i.copy(ne.mapSize);let fe=ne.getFrameExtents();if(i.multiply(fe),s.copy(ne.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/fe.x),i.x=s.x*fe.x,ne.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/fe.y),i.y=s.y*fe.y,ne.mapSize.y=s.y)),ne.map===null||j===!0||G===!0){let ee=this.type!==3?{minFilter:wt,magFilter:wt}:{};ne.map!==null&&ne.map.dispose(),ne.map=new yn(i.x,i.y,ee),ne.map.texture.name=ie.name+".shadowMap",ne.camera.updateProjectionMatrix()}r.setRenderTarget(ne.map),r.clear();let ve=ne.getViewportCount();for(let ee=0;ee<ve;ee++){let se=ne.getViewport(ee);a.set(s.x*se.x,s.y*se.y,s.x*se.z,s.y*se.w),H.viewport(a),ne.updateMatrices(ie,ee),n=ne.getFrustum(),y(C,L,ne.camera,ie,this.type)}ne.isPointLightShadow!==!0&&this.type===3&&v(ne,L),ne.needsUpdate=!1}_=this.type,f.needsUpdate=!1,r.setRenderTarget(U,z,V)}}function vm(r,e){let t=new function(){let S=!1,I=new He,B=null,$=new He(0,0,0,0);return{setMask:function(O){B===O||S||(r.colorMask(O,O,O,O),B=O)},setLocked:function(O){S=O},setClear:function(O,Z,q,Q,ce){ce===!0&&(O*=Q,Z*=Q,q*=Q),I.set(O,Z,q,Q),$.equals(I)===!1&&(r.clearColor(O,Z,q,Q),$.copy(I))},reset:function(){S=!1,B=null,$.set(-1,0,0,0)}}},n=new function(){let S=!1,I=!1,B=null,$=null,O=null;return{setReversed:function(Z){if(I!==Z){let q=e.get("EXT_clip_control");I?q.clipControlEXT(q.LOWER_LEFT_EXT,q.ZERO_TO_ONE_EXT):q.clipControlEXT(q.LOWER_LEFT_EXT,q.NEGATIVE_ONE_TO_ONE_EXT);let Q=O;O=null,this.setClear(Q)}I=Z},getReversed:function(){return I},setTest:function(Z){Z?de(r.DEPTH_TEST):oe(r.DEPTH_TEST)},setMask:function(Z){B===Z||S||(r.depthMask(Z),B=Z)},setFunc:function(Z){if(I&&(Z=_m[Z]),$!==Z){switch(Z){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:default:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL)}$=Z}},setLocked:function(Z){S=Z},setClear:function(Z){O!==Z&&(I&&(Z=1-Z),r.clearDepth(Z),O=Z)},reset:function(){S=!1,B=null,$=null,O=null,I=!1}}},i=new function(){let S=!1,I=null,B=null,$=null,O=null,Z=null,q=null,Q=null,ce=null;return{setTest:function(le){S||(le?de(r.STENCIL_TEST):oe(r.STENCIL_TEST))},setMask:function(le){I===le||S||(r.stencilMask(le),I=le)},setFunc:function(le,ge,Te){B===le&&$===ge&&O===Te||(r.stencilFunc(le,ge,Te),B=le,$=ge,O=Te)},setOp:function(le,ge,Te){Z===le&&q===ge&&Q===Te||(r.stencilOp(le,ge,Te),Z=le,q=ge,Q=Te)},setLocked:function(le){S=le},setClear:function(le){ce!==le&&(r.clearStencil(le),ce=le)},reset:function(){S=!1,I=null,B=null,$=null,O=null,Z=null,q=null,Q=null,ce=null}}},s=new WeakMap,a=new WeakMap,o={},l={},c=new WeakMap,h=[],u=null,d=!1,p=null,m=null,g=null,f=null,_=null,v=null,x=null,y=new xe(0,0,0),A=0,M=!1,C=null,L=null,U=null,z=null,V=null,H=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,G=0,Y=r.getParameter(r.VERSION);Y.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(Y)[1]),j=G>=1):Y.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),j=G>=2);let K=null,ie={},ne=r.getParameter(r.SCISSOR_BOX),fe=r.getParameter(r.VIEWPORT),ve=new He().fromArray(ne),ee=new He().fromArray(fe);function se(S,I,B,$){let O=new Uint8Array(4),Z=r.createTexture();r.bindTexture(S,Z),r.texParameteri(S,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(S,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let q=0;q<B;q++)S===r.TEXTURE_3D||S===r.TEXTURE_2D_ARRAY?r.texImage3D(I,0,r.RGBA,1,1,$,0,r.RGBA,r.UNSIGNED_BYTE,O):r.texImage2D(I+q,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,O);return Z}let ue={};function de(S){o[S]!==!0&&(r.enable(S),o[S]=!0)}function oe(S){o[S]!==!1&&(r.disable(S),o[S]=!1)}ue[r.TEXTURE_2D]=se(r.TEXTURE_2D,r.TEXTURE_2D,1),ue[r.TEXTURE_CUBE_MAP]=se(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[r.TEXTURE_2D_ARRAY]=se(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ue[r.TEXTURE_3D]=se(r.TEXTURE_3D,r.TEXTURE_3D,1,1),t.setClear(0,0,0,1),n.setClear(1),i.setClear(0),de(r.DEPTH_TEST),n.setFunc(3),D(!1),R(1),de(r.CULL_FACE),N(0);let E={[di]:r.FUNC_ADD,[tp]:r.FUNC_SUBTRACT,[np]:r.FUNC_REVERSE_SUBTRACT};E[103]=r.MIN,E[104]=r.MAX;let w={[ip]:r.ZERO,[rp]:r.ONE,[sp]:r.SRC_COLOR,[Lo]:r.SRC_ALPHA,[up]:r.SRC_ALPHA_SATURATE,[cp]:r.DST_COLOR,[op]:r.DST_ALPHA,[ap]:r.ONE_MINUS_SRC_COLOR,[Do]:r.ONE_MINUS_SRC_ALPHA,[hp]:r.ONE_MINUS_DST_COLOR,[lp]:r.ONE_MINUS_DST_ALPHA,[dp]:r.CONSTANT_COLOR,[pp]:r.ONE_MINUS_CONSTANT_COLOR,[fp]:r.CONSTANT_ALPHA,[mp]:r.ONE_MINUS_CONSTANT_ALPHA};function N(S,I,B,$,O,Z,q,Q,ce,le){if(S!==0){if(d===!1&&(de(r.BLEND),d=!0),S===5)O=O||I,Z=Z||B,q=q||$,I===m&&O===_||(r.blendEquationSeparate(E[I],E[O]),m=I,_=O),B===g&&$===f&&Z===v&&q===x||(r.blendFuncSeparate(w[B],w[$],w[Z],w[q]),g=B,f=$,v=Z,x=q),Q.equals(y)!==!1&&ce===A||(r.blendColor(Q.r,Q.g,Q.b,ce),y.copy(Q),A=ce),p=S,M=!1;else if(S!==p||le!==M){if(m===di&&_===di||(r.blendEquation(r.FUNC_ADD),m=di,_=di),le)switch(S){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",S)}else switch(S){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",S)}g=null,f=null,v=null,x=null,y.set(0,0,0),A=0,p=S,M=le}}else d===!0&&(oe(r.BLEND),d=!1)}function D(S){C!==S&&(S?r.frontFace(r.CW):r.frontFace(r.CCW),C=S)}function R(S){S!==0?(de(r.CULL_FACE),S!==L&&(S===1?r.cullFace(r.BACK):S===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):oe(r.CULL_FACE),L=S}function P(S,I,B){S?(de(r.POLYGON_OFFSET_FILL),z===I&&V===B||(r.polygonOffset(I,B),z=I,V=B)):oe(r.POLYGON_OFFSET_FILL)}return{buffers:{color:t,depth:n,stencil:i},enable:de,disable:oe,bindFramebuffer:function(S,I){return l[S]!==I&&(r.bindFramebuffer(S,I),l[S]=I,S===r.DRAW_FRAMEBUFFER&&(l[r.FRAMEBUFFER]=I),S===r.FRAMEBUFFER&&(l[r.DRAW_FRAMEBUFFER]=I),!0)},drawBuffers:function(S,I){let B=h,$=!1;if(S){B=c.get(I),B===void 0&&(B=[],c.set(I,B));let O=S.textures;if(B.length!==O.length||B[0]!==r.COLOR_ATTACHMENT0){for(let Z=0,q=O.length;Z<q;Z++)B[Z]=r.COLOR_ATTACHMENT0+Z;B.length=O.length,$=!0}}else B[0]!==r.BACK&&(B[0]=r.BACK,$=!0);$&&r.drawBuffers(B)},useProgram:function(S){return u!==S&&(r.useProgram(S),u=S,!0)},setBlending:N,setMaterial:function(S,I){S.side===2?oe(r.CULL_FACE):de(r.CULL_FACE);let B=S.side===1;I&&(B=!B),D(B),S.blending===1&&S.transparent===!1?N(0):N(S.blending,S.blendEquation,S.blendSrc,S.blendDst,S.blendEquationAlpha,S.blendSrcAlpha,S.blendDstAlpha,S.blendColor,S.blendAlpha,S.premultipliedAlpha),n.setFunc(S.depthFunc),n.setTest(S.depthTest),n.setMask(S.depthWrite),t.setMask(S.colorWrite);let $=S.stencilWrite;i.setTest($),$&&(i.setMask(S.stencilWriteMask),i.setFunc(S.stencilFunc,S.stencilRef,S.stencilFuncMask),i.setOp(S.stencilFail,S.stencilZFail,S.stencilZPass)),P(S.polygonOffset,S.polygonOffsetFactor,S.polygonOffsetUnits),S.alphaToCoverage===!0?de(r.SAMPLE_ALPHA_TO_COVERAGE):oe(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:D,setCullFace:R,setLineWidth:function(S){S!==U&&(j&&r.lineWidth(S),U=S)},setPolygonOffset:P,setScissorTest:function(S){S?de(r.SCISSOR_TEST):oe(r.SCISSOR_TEST)},activeTexture:function(S){S===void 0&&(S=r.TEXTURE0+H-1),K!==S&&(r.activeTexture(S),K=S)},bindTexture:function(S,I,B){B===void 0&&(B=K===null?r.TEXTURE0+H-1:K);let $=ie[B];$===void 0&&($={type:void 0,texture:void 0},ie[B]=$),$.type===S&&$.texture===I||(K!==B&&(r.activeTexture(B),K=B),r.bindTexture(S,I||ue[S]),$.type=S,$.texture=I)},unbindTexture:function(){let S=ie[K];S!==void 0&&S.type!==void 0&&(r.bindTexture(S.type,null),S.type=void 0,S.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexImage3D:function(){try{r.compressedTexImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texImage2D:function(){try{r.texImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texImage3D:function(){try{r.texImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},updateUBOMapping:function(S,I){let B=a.get(I);B===void 0&&(B=new WeakMap,a.set(I,B));let $=B.get(S);$===void 0&&($=r.getUniformBlockIndex(I,S.name),B.set(S,$))},uniformBlockBinding:function(S,I){let B=a.get(I).get(S);s.get(I)!==B&&(r.uniformBlockBinding(I,B,S.__bindingPointIndex),s.set(I,B))},texStorage2D:function(){try{r.texStorage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texStorage3D:function(){try{r.texStorage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texSubImage2D:function(){try{r.texSubImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texSubImage3D:function(){try{r.texSubImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},scissor:function(S){ve.equals(S)===!1&&(r.scissor(S.x,S.y,S.z,S.w),ve.copy(S))},viewport:function(S){ee.equals(S)===!1&&(r.viewport(S.x,S.y,S.z,S.w),ee.copy(S))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),n.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),o={},K=null,ie={},l={},c=new WeakMap,h=[],u=null,d=!1,p=null,m=null,g=null,f=null,_=null,v=null,x=null,y=new xe(0,0,0),A=0,M=!1,C=null,L=null,U=null,z=null,V=null,ve.set(0,0,r.canvas.width,r.canvas.height),ee.set(0,0,r.canvas.width,r.canvas.height),t.reset(),n.reset(),i.reset()}}}function bu(r,e,t,n){let i=(function(s){switch(s){case Gn:case Qu:return{byteLength:1,components:1};case Lr:case ed:case $r:return{byteLength:2,components:1};case uc:case dc:return{byteLength:2,components:4};case mi:case hc:case en:return{byteLength:4,components:1};case td:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)})(n);switch(t){case nd:case rd:return r*e;case sd:return r*e*2;case pc:case fc:return r*e/i.components*i.byteLength;case ad:case mc:return r*e*2/i.components*i.byteLength;case id:return r*e*3/i.components*i.byteLength;case tn:case gc:return r*e*4/i.components*i.byteLength;case Vs:case Gs:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Ws:case Xs:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Bo:case zo:return Math.max(r,16)*Math.max(e,8)/4;case Oo:case Fo:return Math.max(r,8)*Math.max(e,8)/2;case ko:case Ho:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Vo:case Go:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Wo:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Xo:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case jo:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case qo:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Ko:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Jo:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case $o:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Qo:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case el:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case tl:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case nl:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case js:case il:case rl:return Math.ceil(r/4)*Math.ceil(e/4)*16;case od:case sl:return Math.ceil(r/4)*Math.ceil(e/4)*8;case al:case ol:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function xm(r,e,t,n,i,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new te,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(E,w){return p?new OffscreenCanvas(E,w):Nr("canvas")}function g(E,w,N){let D=1,R=oe(E);if((R.width>N||R.height>N)&&(D=N/Math.max(R.width,R.height)),D<1){if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let P=Math.floor(D*R.width),S=Math.floor(D*R.height);u===void 0&&(u=m(P,S));let I=w?m(P,S):u;return I.width=P,I.height=S,I.getContext("2d").drawImage(E,0,0,P,S),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+P+"x"+S+")."),I}return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),E}return E}function f(E){return E.generateMipmaps}function _(E){r.generateMipmap(E)}function v(E){return E.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?r.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(E,w,N,D,R=!1){if(E!==null){if(r[E]!==void 0)return r[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let P=w;if(w===r.RED&&(N===r.FLOAT&&(P=r.R32F),N===r.HALF_FLOAT&&(P=r.R16F),N===r.UNSIGNED_BYTE&&(P=r.R8)),w===r.RED_INTEGER&&(N===r.UNSIGNED_BYTE&&(P=r.R8UI),N===r.UNSIGNED_SHORT&&(P=r.R16UI),N===r.UNSIGNED_INT&&(P=r.R32UI),N===r.BYTE&&(P=r.R8I),N===r.SHORT&&(P=r.R16I),N===r.INT&&(P=r.R32I)),w===r.RG&&(N===r.FLOAT&&(P=r.RG32F),N===r.HALF_FLOAT&&(P=r.RG16F),N===r.UNSIGNED_BYTE&&(P=r.RG8)),w===r.RG_INTEGER&&(N===r.UNSIGNED_BYTE&&(P=r.RG8UI),N===r.UNSIGNED_SHORT&&(P=r.RG16UI),N===r.UNSIGNED_INT&&(P=r.RG32UI),N===r.BYTE&&(P=r.RG8I),N===r.SHORT&&(P=r.RG16I),N===r.INT&&(P=r.RG32I)),w===r.RGB_INTEGER&&(N===r.UNSIGNED_BYTE&&(P=r.RGB8UI),N===r.UNSIGNED_SHORT&&(P=r.RGB16UI),N===r.UNSIGNED_INT&&(P=r.RGB32UI),N===r.BYTE&&(P=r.RGB8I),N===r.SHORT&&(P=r.RGB16I),N===r.INT&&(P=r.RGB32I)),w===r.RGBA_INTEGER&&(N===r.UNSIGNED_BYTE&&(P=r.RGBA8UI),N===r.UNSIGNED_SHORT&&(P=r.RGBA16UI),N===r.UNSIGNED_INT&&(P=r.RGBA32UI),N===r.BYTE&&(P=r.RGBA8I),N===r.SHORT&&(P=r.RGBA16I),N===r.INT&&(P=r.RGBA32I)),w===r.RGB&&N===r.UNSIGNED_INT_5_9_9_9_REV&&(P=r.RGB9_E5),w===r.RGBA){let S=R?wa:Oe.getTransfer(D);N===r.FLOAT&&(P=r.RGBA32F),N===r.HALF_FLOAT&&(P=r.RGBA16F),N===r.UNSIGNED_BYTE&&(P=S===We?r.SRGB8_ALPHA8:r.RGBA8),N===r.UNSIGNED_SHORT_4_4_4_4&&(P=r.RGBA4),N===r.UNSIGNED_SHORT_5_5_5_1&&(P=r.RGB5_A1)}return P!==r.R16F&&P!==r.R32F&&P!==r.RG16F&&P!==r.RG32F&&P!==r.RGBA16F&&P!==r.RGBA32F||e.get("EXT_color_buffer_float"),P}function y(E,w){let N;return E?w===null||w===mi||w===qi?N=r.DEPTH24_STENCIL8:w===en?N=r.DEPTH32F_STENCIL8:w===Lr&&(N=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===mi||w===qi?N=r.DEPTH_COMPONENT24:w===en?N=r.DEPTH_COMPONENT32F:w===Lr&&(N=r.DEPTH_COMPONENT16),N}function A(E,w){return f(E)===!0||E.isFramebufferTexture&&E.minFilter!==wt&&E.minFilter!==Nt?Math.log2(Math.max(w.width,w.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?w.mipmaps.length:1}function M(E){let w=E.target;w.removeEventListener("dispose",M),(function(N){let D=n.get(N);if(D.__webglInit===void 0)return;let R=N.source,P=d.get(R);if(P){let S=P[D.__cacheKey];S.usedTimes--,S.usedTimes===0&&L(N),Object.keys(P).length===0&&d.delete(R)}n.remove(N)})(w),w.isVideoTexture&&h.delete(w)}function C(E){let w=E.target;w.removeEventListener("dispose",C),(function(N){let D=n.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),n.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let P=0;P<6;P++){if(Array.isArray(D.__webglFramebuffer[P]))for(let S=0;S<D.__webglFramebuffer[P].length;S++)r.deleteFramebuffer(D.__webglFramebuffer[P][S]);else r.deleteFramebuffer(D.__webglFramebuffer[P]);D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer[P])}else{if(Array.isArray(D.__webglFramebuffer))for(let P=0;P<D.__webglFramebuffer.length;P++)r.deleteFramebuffer(D.__webglFramebuffer[P]);else r.deleteFramebuffer(D.__webglFramebuffer);if(D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer),D.__webglMultisampledFramebuffer&&r.deleteFramebuffer(D.__webglMultisampledFramebuffer),D.__webglColorRenderbuffer)for(let P=0;P<D.__webglColorRenderbuffer.length;P++)D.__webglColorRenderbuffer[P]&&r.deleteRenderbuffer(D.__webglColorRenderbuffer[P]);D.__webglDepthRenderbuffer&&r.deleteRenderbuffer(D.__webglDepthRenderbuffer)}let R=N.textures;for(let P=0,S=R.length;P<S;P++){let I=n.get(R[P]);I.__webglTexture&&(r.deleteTexture(I.__webglTexture),a.memory.textures--),n.remove(R[P])}n.remove(N)})(w)}function L(E){let w=n.get(E);r.deleteTexture(w.__webglTexture);let N=E.source;delete d.get(N)[w.__cacheKey],a.memory.textures--}let U=0;function z(E,w){let N=n.get(E);if(E.isVideoTexture&&(function(D){let R=a.render.frame;h.get(D)!==R&&(h.set(D,R),D.update())})(E),E.isRenderTargetTexture===!1&&E.version>0&&N.__version!==E.version){let D=E.image;if(D===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(D.complete!==!1)return void K(N,E,w);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(r.TEXTURE_2D,N.__webglTexture,r.TEXTURE0+w)}let V={[pi]:r.REPEAT,[fi]:r.CLAMP_TO_EDGE,[Pr]:r.MIRRORED_REPEAT},H={[wt]:r.NEAREST,[cc]:r.NEAREST_MIPMAP_NEAREST,[ki]:r.NEAREST_MIPMAP_LINEAR,[Nt]:r.LINEAR,[Er]:r.LINEAR_MIPMAP_NEAREST,[vn]:r.LINEAR_MIPMAP_LINEAR},j={[wp]:r.NEVER,[Lp]:r.ALWAYS,[Ep]:r.LESS,[Rp]:r.LEQUAL,[Ap]:r.EQUAL,[Pp]:r.GEQUAL,[Cp]:r.GREATER,[Ip]:r.NOTEQUAL};function G(E,w){if(w.type!==en||e.has("OES_texture_float_linear")!==!1||w.magFilter!==Nt&&w.magFilter!==Er&&w.magFilter!==ki&&w.magFilter!==vn&&w.minFilter!==Nt&&w.minFilter!==Er&&w.minFilter!==ki&&w.minFilter!==vn||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(E,r.TEXTURE_WRAP_S,V[w.wrapS]),r.texParameteri(E,r.TEXTURE_WRAP_T,V[w.wrapT]),E!==r.TEXTURE_3D&&E!==r.TEXTURE_2D_ARRAY||r.texParameteri(E,r.TEXTURE_WRAP_R,V[w.wrapR]),r.texParameteri(E,r.TEXTURE_MAG_FILTER,H[w.magFilter]),r.texParameteri(E,r.TEXTURE_MIN_FILTER,H[w.minFilter]),w.compareFunction&&(r.texParameteri(E,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(E,r.TEXTURE_COMPARE_FUNC,j[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===wt||w.minFilter!==ki&&w.minFilter!==vn||w.type===en&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");r.texParameterf(E,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Y(E,w){let N=!1;E.__webglInit===void 0&&(E.__webglInit=!0,w.addEventListener("dispose",M));let D=w.source,R=d.get(D);R===void 0&&(R={},d.set(D,R));let P=(function(S){let I=[];return I.push(S.wrapS),I.push(S.wrapT),I.push(S.wrapR||0),I.push(S.magFilter),I.push(S.minFilter),I.push(S.anisotropy),I.push(S.internalFormat),I.push(S.format),I.push(S.type),I.push(S.generateMipmaps),I.push(S.premultiplyAlpha),I.push(S.flipY),I.push(S.unpackAlignment),I.push(S.colorSpace),I.join()})(w);if(P!==E.__cacheKey){R[P]===void 0&&(R[P]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,N=!0),R[P].usedTimes++;let S=R[E.__cacheKey];S!==void 0&&(R[E.__cacheKey].usedTimes--,S.usedTimes===0&&L(w)),E.__cacheKey=P,E.__webglTexture=R[P].texture}return N}function K(E,w,N){let D=r.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(D=r.TEXTURE_2D_ARRAY),w.isData3DTexture&&(D=r.TEXTURE_3D);let R=Y(E,w),P=w.source;t.bindTexture(D,E.__webglTexture,r.TEXTURE0+N);let S=n.get(P);if(P.version!==S.__version||R===!0){t.activeTexture(r.TEXTURE0+N);let I=Oe.getPrimaries(Oe.workingColorSpace),B=w.colorSpace===zi?null:Oe.getPrimaries(w.colorSpace),$=w.colorSpace===zi||I===B?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,w.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,w.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);let O=g(w.image,!1,i.maxTextureSize);O=de(w,O);let Z=s.convert(w.format,w.colorSpace),q=s.convert(w.type),Q,ce=x(w.internalFormat,Z,q,w.colorSpace,w.isVideoTexture);G(D,w);let le=w.mipmaps,ge=w.isVideoTexture!==!0,Te=S.__version===void 0||R===!0,Fe=P.dataReady,Pe=A(w,O);if(w.isDepthTexture)ce=y(w.format===Yi,w.type),Te&&(ge?t.texStorage2D(r.TEXTURE_2D,1,ce,O.width,O.height):t.texImage2D(r.TEXTURE_2D,0,ce,O.width,O.height,0,Z,q,null));else if(w.isDataTexture)if(le.length>0){ge&&Te&&t.texStorage2D(r.TEXTURE_2D,Pe,ce,le[0].width,le[0].height);for(let _e=0,ke=le.length;_e<ke;_e++)Q=le[_e],ge?Fe&&t.texSubImage2D(r.TEXTURE_2D,_e,0,0,Q.width,Q.height,Z,q,Q.data):t.texImage2D(r.TEXTURE_2D,_e,ce,Q.width,Q.height,0,Z,q,Q.data);w.generateMipmaps=!1}else ge?(Te&&t.texStorage2D(r.TEXTURE_2D,Pe,ce,O.width,O.height),Fe&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,O.width,O.height,Z,q,O.data)):t.texImage2D(r.TEXTURE_2D,0,ce,O.width,O.height,0,Z,q,O.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){ge&&Te&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Pe,ce,le[0].width,le[0].height,O.depth);for(let _e=0,ke=le.length;_e<ke;_e++)if(Q=le[_e],w.format!==tn)if(Z!==null)if(ge){if(Fe)if(w.layerUpdates.size>0){let je=bu(Q.width,Q.height,w.format,w.type);for(let Je of w.layerUpdates){let pe=Q.data.subarray(Je*je/Q.data.BYTES_PER_ELEMENT,(Je+1)*je/Q.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,_e,0,0,Je,Q.width,Q.height,1,Z,pe)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,_e,0,0,0,Q.width,Q.height,O.depth,Z,Q.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,_e,ce,Q.width,Q.height,O.depth,0,Q.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ge?Fe&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,_e,0,0,0,Q.width,Q.height,O.depth,Z,q,Q.data):t.texImage3D(r.TEXTURE_2D_ARRAY,_e,ce,Q.width,Q.height,O.depth,0,Z,q,Q.data)}else{ge&&Te&&t.texStorage2D(r.TEXTURE_2D,Pe,ce,le[0].width,le[0].height);for(let _e=0,ke=le.length;_e<ke;_e++)Q=le[_e],w.format!==tn?Z!==null?ge?Fe&&t.compressedTexSubImage2D(r.TEXTURE_2D,_e,0,0,Q.width,Q.height,Z,Q.data):t.compressedTexImage2D(r.TEXTURE_2D,_e,ce,Q.width,Q.height,0,Q.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ge?Fe&&t.texSubImage2D(r.TEXTURE_2D,_e,0,0,Q.width,Q.height,Z,q,Q.data):t.texImage2D(r.TEXTURE_2D,_e,ce,Q.width,Q.height,0,Z,q,Q.data)}else if(w.isDataArrayTexture)if(ge){if(Te&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Pe,ce,O.width,O.height,O.depth),Fe)if(w.layerUpdates.size>0){let _e=bu(O.width,O.height,w.format,w.type);for(let ke of w.layerUpdates){let je=O.data.subarray(ke*_e/O.data.BYTES_PER_ELEMENT,(ke+1)*_e/O.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,ke,O.width,O.height,1,Z,q,je)}w.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,O.width,O.height,O.depth,Z,q,O.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,ce,O.width,O.height,O.depth,0,Z,q,O.data);else if(w.isData3DTexture)ge?(Te&&t.texStorage3D(r.TEXTURE_3D,Pe,ce,O.width,O.height,O.depth),Fe&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,O.width,O.height,O.depth,Z,q,O.data)):t.texImage3D(r.TEXTURE_3D,0,ce,O.width,O.height,O.depth,0,Z,q,O.data);else if(w.isFramebufferTexture){if(Te)if(ge)t.texStorage2D(r.TEXTURE_2D,Pe,ce,O.width,O.height);else{let _e=O.width,ke=O.height;for(let je=0;je<Pe;je++)t.texImage2D(r.TEXTURE_2D,je,ce,_e,ke,0,Z,q,null),_e>>=1,ke>>=1}}else if(le.length>0){if(ge&&Te){let _e=oe(le[0]);t.texStorage2D(r.TEXTURE_2D,Pe,ce,_e.width,_e.height)}for(let _e=0,ke=le.length;_e<ke;_e++)Q=le[_e],ge?Fe&&t.texSubImage2D(r.TEXTURE_2D,_e,0,0,Z,q,Q):t.texImage2D(r.TEXTURE_2D,_e,ce,Z,q,Q);w.generateMipmaps=!1}else if(ge){if(Te){let _e=oe(O);t.texStorage2D(r.TEXTURE_2D,Pe,ce,_e.width,_e.height)}Fe&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Z,q,O)}else t.texImage2D(r.TEXTURE_2D,0,ce,Z,q,O);f(w)&&_(D),S.__version=P.version,w.onUpdate&&w.onUpdate(w)}E.__version=w.version}function ie(E,w,N,D,R,P){let S=s.convert(N.format,N.colorSpace),I=s.convert(N.type),B=x(N.internalFormat,S,I,N.colorSpace),$=n.get(w),O=n.get(N);if(O.__renderTarget=w,!$.__hasExternalTextures){let Z=Math.max(1,w.width>>P),q=Math.max(1,w.height>>P);R===r.TEXTURE_3D||R===r.TEXTURE_2D_ARRAY?t.texImage3D(R,P,B,Z,q,w.depth,0,S,I,null):t.texImage2D(R,P,B,Z,q,0,S,I,null)}t.bindFramebuffer(r.FRAMEBUFFER,E),ue(w)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,D,R,O.__webglTexture,0,se(w)):(R===r.TEXTURE_2D||R>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&R<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,D,R,O.__webglTexture,P),t.bindFramebuffer(r.FRAMEBUFFER,null)}function ne(E,w,N){if(r.bindRenderbuffer(r.RENDERBUFFER,E),w.depthBuffer){let D=w.depthTexture,R=D&&D.isDepthTexture?D.type:null,P=y(w.stencilBuffer,R),S=w.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,I=se(w);ue(w)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,I,P,w.width,w.height):N?r.renderbufferStorageMultisample(r.RENDERBUFFER,I,P,w.width,w.height):r.renderbufferStorage(r.RENDERBUFFER,P,w.width,w.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,S,r.RENDERBUFFER,E)}else{let D=w.textures;for(let R=0;R<D.length;R++){let P=D[R],S=s.convert(P.format,P.colorSpace),I=s.convert(P.type),B=x(P.internalFormat,S,I,P.colorSpace),$=se(w);N&&ue(w)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,$,B,w.width,w.height):ue(w)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,$,B,w.width,w.height):r.renderbufferStorage(r.RENDERBUFFER,B,w.width,w.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function fe(E){let w=n.get(E),N=E.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==E.depthTexture){let D=E.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),D){let R=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,D.removeEventListener("dispose",R)};D.addEventListener("dispose",R),w.__depthDisposeCallback=R}w.__boundDepthTexture=D}if(E.depthTexture&&!w.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");(function(D,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,D),!R.depthTexture||!R.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let P=n.get(R.depthTexture);P.__renderTarget=R,P.__webglTexture&&R.depthTexture.image.width===R.width&&R.depthTexture.image.height===R.height||(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),z(R.depthTexture,0);let S=P.__webglTexture,I=se(R);if(R.depthTexture.format===Dr)ue(R)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,S,0,I):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,S,0);else{if(R.depthTexture.format!==Yi)throw new Error("Unknown depthTexture format");ue(R)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,S,0,I):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,S,0)}})(w.__webglFramebuffer,E)}else if(N){w.__webglDepthbuffer=[];for(let D=0;D<6;D++)if(t.bindFramebuffer(r.FRAMEBUFFER,w.__webglFramebuffer[D]),w.__webglDepthbuffer[D]===void 0)w.__webglDepthbuffer[D]=r.createRenderbuffer(),ne(w.__webglDepthbuffer[D],E,!1);else{let R=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,P=w.__webglDepthbuffer[D];r.bindRenderbuffer(r.RENDERBUFFER,P),r.framebufferRenderbuffer(r.FRAMEBUFFER,R,r.RENDERBUFFER,P)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=r.createRenderbuffer(),ne(w.__webglDepthbuffer,E,!1);else{let D=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,R=w.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,R),r.framebufferRenderbuffer(r.FRAMEBUFFER,D,r.RENDERBUFFER,R)}t.bindFramebuffer(r.FRAMEBUFFER,null)}let ve=[],ee=[];function se(E){return Math.min(i.maxSamples,E.samples)}function ue(E){let w=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function de(E,w){let N=E.colorSpace,D=E.format,R=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||N!==xt&&N!==zi&&(Oe.getTransfer(N)===We?D===tn&&R===Gn||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),w}function oe(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=function(){let E=U;return E>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+i.maxTextures),U+=1,E},this.resetTextureUnits=function(){U=0},this.setTexture2D=z,this.setTexture2DArray=function(E,w){let N=n.get(E);E.version>0&&N.__version!==E.version?K(N,E,w):t.bindTexture(r.TEXTURE_2D_ARRAY,N.__webglTexture,r.TEXTURE0+w)},this.setTexture3D=function(E,w){let N=n.get(E);E.version>0&&N.__version!==E.version?K(N,E,w):t.bindTexture(r.TEXTURE_3D,N.__webglTexture,r.TEXTURE0+w)},this.setTextureCube=function(E,w){let N=n.get(E);E.version>0&&N.__version!==E.version?(function(D,R,P){if(R.image.length!==6)return;let S=Y(D,R),I=R.source;t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture,r.TEXTURE0+P);let B=n.get(I);if(I.version!==B.__version||S===!0){t.activeTexture(r.TEXTURE0+P);let $=Oe.getPrimaries(Oe.workingColorSpace),O=R.colorSpace===zi?null:Oe.getPrimaries(R.colorSpace),Z=R.colorSpace===zi||$===O?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);let q=R.isCompressedTexture||R.image[0].isCompressedTexture,Q=R.image[0]&&R.image[0].isDataTexture,ce=[];for(let pe=0;pe<6;pe++)ce[pe]=q||Q?Q?R.image[pe].image:R.image[pe]:g(R.image[pe],!0,i.maxCubemapSize),ce[pe]=de(R,ce[pe]);let le=ce[0],ge=s.convert(R.format,R.colorSpace),Te=s.convert(R.type),Fe=x(R.internalFormat,ge,Te,R.colorSpace),Pe=R.isVideoTexture!==!0,_e=B.__version===void 0||S===!0,ke=I.dataReady,je,Je=A(R,le);if(G(r.TEXTURE_CUBE_MAP,R),q){Pe&&_e&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Je,Fe,le.width,le.height);for(let pe=0;pe<6;pe++){je=ce[pe].mipmaps;for(let Ne=0;Ne<je.length;Ne++){let Xe=je[Ne];R.format!==tn?ge!==null?Pe?ke&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne,0,0,Xe.width,Xe.height,ge,Xe.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne,Fe,Xe.width,Xe.height,0,Xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pe?ke&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne,0,0,Xe.width,Xe.height,ge,Te,Xe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne,Fe,Xe.width,Xe.height,0,ge,Te,Xe.data)}}}else{if(je=R.mipmaps,Pe&&_e){je.length>0&&Je++;let pe=oe(ce[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Je,Fe,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(Q){Pe?ke&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,ce[pe].width,ce[pe].height,ge,Te,ce[pe].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,Fe,ce[pe].width,ce[pe].height,0,ge,Te,ce[pe].data);for(let Ne=0;Ne<je.length;Ne++){let Xe=je[Ne].image[pe].image;Pe?ke&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne+1,0,0,Xe.width,Xe.height,ge,Te,Xe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne+1,Fe,Xe.width,Xe.height,0,ge,Te,Xe.data)}}else{Pe?ke&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,ge,Te,ce[pe]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,Fe,ge,Te,ce[pe]);for(let Ne=0;Ne<je.length;Ne++){let Xe=je[Ne];Pe?ke&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne+1,0,0,ge,Te,Xe.image[pe]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Ne+1,Fe,ge,Te,Xe.image[pe])}}}f(R)&&_(r.TEXTURE_CUBE_MAP),B.__version=I.version,R.onUpdate&&R.onUpdate(R)}D.__version=R.version})(N,E,w):t.bindTexture(r.TEXTURE_CUBE_MAP,N.__webglTexture,r.TEXTURE0+w)},this.rebindTextures=function(E,w,N){let D=n.get(E);w!==void 0&&ie(D.__webglFramebuffer,E,E.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),N!==void 0&&fe(E)},this.setupRenderTarget=function(E){let w=E.texture,N=n.get(E),D=n.get(w);E.addEventListener("dispose",C);let R=E.textures,P=E.isWebGLCubeRenderTarget===!0,S=R.length>1;if(S||(D.__webglTexture===void 0&&(D.__webglTexture=r.createTexture()),D.__version=w.version,a.memory.textures++),P){N.__webglFramebuffer=[];for(let I=0;I<6;I++)if(w.mipmaps&&w.mipmaps.length>0){N.__webglFramebuffer[I]=[];for(let B=0;B<w.mipmaps.length;B++)N.__webglFramebuffer[I][B]=r.createFramebuffer()}else N.__webglFramebuffer[I]=r.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){N.__webglFramebuffer=[];for(let I=0;I<w.mipmaps.length;I++)N.__webglFramebuffer[I]=r.createFramebuffer()}else N.__webglFramebuffer=r.createFramebuffer();if(S)for(let I=0,B=R.length;I<B;I++){let $=n.get(R[I]);$.__webglTexture===void 0&&($.__webglTexture=r.createTexture(),a.memory.textures++)}if(E.samples>0&&ue(E)===!1){N.__webglMultisampledFramebuffer=r.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let I=0;I<R.length;I++){let B=R[I];N.__webglColorRenderbuffer[I]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,N.__webglColorRenderbuffer[I]);let $=s.convert(B.format,B.colorSpace),O=s.convert(B.type),Z=x(B.internalFormat,$,O,B.colorSpace,E.isXRRenderTarget===!0),q=se(E);r.renderbufferStorageMultisample(r.RENDERBUFFER,q,Z,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+I,r.RENDERBUFFER,N.__webglColorRenderbuffer[I])}r.bindRenderbuffer(r.RENDERBUFFER,null),E.depthBuffer&&(N.__webglDepthRenderbuffer=r.createRenderbuffer(),ne(N.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(P){t.bindTexture(r.TEXTURE_CUBE_MAP,D.__webglTexture),G(r.TEXTURE_CUBE_MAP,w);for(let I=0;I<6;I++)if(w.mipmaps&&w.mipmaps.length>0)for(let B=0;B<w.mipmaps.length;B++)ie(N.__webglFramebuffer[I][B],E,w,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+I,B);else ie(N.__webglFramebuffer[I],E,w,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+I,0);f(w)&&_(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(S){for(let I=0,B=R.length;I<B;I++){let $=R[I],O=n.get($);t.bindTexture(r.TEXTURE_2D,O.__webglTexture),G(r.TEXTURE_2D,$),ie(N.__webglFramebuffer,E,$,r.COLOR_ATTACHMENT0+I,r.TEXTURE_2D,0),f($)&&_(r.TEXTURE_2D)}t.unbindTexture()}else{let I=r.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(I=E.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(I,D.__webglTexture),G(I,w),w.mipmaps&&w.mipmaps.length>0)for(let B=0;B<w.mipmaps.length;B++)ie(N.__webglFramebuffer[B],E,w,r.COLOR_ATTACHMENT0,I,B);else ie(N.__webglFramebuffer,E,w,r.COLOR_ATTACHMENT0,I,0);f(w)&&_(I),t.unbindTexture()}E.depthBuffer&&fe(E)},this.updateRenderTargetMipmap=function(E){let w=E.textures;for(let N=0,D=w.length;N<D;N++){let R=w[N];if(f(R)){let P=v(E),S=n.get(R).__webglTexture;t.bindTexture(P,S),_(P),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(E){if(E.samples>0){if(ue(E)===!1){let w=E.textures,N=E.width,D=E.height,R=r.COLOR_BUFFER_BIT,P=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,S=n.get(E),I=w.length>1;if(I)for(let B=0;B<w.length;B++)t.bindFramebuffer(r.FRAMEBUFFER,S.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+B,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+B,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,S.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,S.__webglFramebuffer);for(let B=0;B<w.length;B++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(R|=r.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(R|=r.STENCIL_BUFFER_BIT)),I){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,S.__webglColorRenderbuffer[B]);let $=n.get(w[B]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,$,0)}r.blitFramebuffer(0,0,N,D,0,0,N,D,R,r.NEAREST),l===!0&&(ve.length=0,ee.length=0,ve.push(r.COLOR_ATTACHMENT0+B),E.depthBuffer&&E.resolveDepthBuffer===!1&&(ve.push(P),ee.push(P),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,ee)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ve))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),I)for(let B=0;B<w.length;B++){t.bindFramebuffer(r.FRAMEBUFFER,S.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+B,r.RENDERBUFFER,S.__webglColorRenderbuffer[B]);let $=n.get(w[B]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+B,r.TEXTURE_2D,$,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,S.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){let w=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[w])}}},this.setupDepthRenderbuffer=fe,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=ue}function ym(r,e){return{convert:function(t,n=""){let i,s=Oe.getTransfer(n);if(t===Gn)return r.UNSIGNED_BYTE;if(t===uc)return r.UNSIGNED_SHORT_4_4_4_4;if(t===dc)return r.UNSIGNED_SHORT_5_5_5_1;if(t===td)return r.UNSIGNED_INT_5_9_9_9_REV;if(t===Qu)return r.BYTE;if(t===ed)return r.SHORT;if(t===Lr)return r.UNSIGNED_SHORT;if(t===hc)return r.INT;if(t===mi)return r.UNSIGNED_INT;if(t===en)return r.FLOAT;if(t===$r)return r.HALF_FLOAT;if(t===nd)return r.ALPHA;if(t===id)return r.RGB;if(t===tn)return r.RGBA;if(t===rd)return r.LUMINANCE;if(t===sd)return r.LUMINANCE_ALPHA;if(t===Dr)return r.DEPTH_COMPONENT;if(t===Yi)return r.DEPTH_STENCIL;if(t===pc)return r.RED;if(t===fc)return r.RED_INTEGER;if(t===ad)return r.RG;if(t===mc)return r.RG_INTEGER;if(t===gc)return r.RGBA_INTEGER;if(t===Vs||t===Gs||t===Ws||t===Xs)if(s===We){if(i=e.get("WEBGL_compressed_texture_s3tc_srgb"),i===null)return null;if(t===Vs)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(t===Gs)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(t===Ws)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(t===Xs)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(i=e.get("WEBGL_compressed_texture_s3tc"),i===null)return null;if(t===Vs)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(t===Gs)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(t===Ws)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(t===Xs)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t===Oo||t===Bo||t===Fo||t===zo){if(i=e.get("WEBGL_compressed_texture_pvrtc"),i===null)return null;if(t===Oo)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(t===Bo)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(t===Fo)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(t===zo)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t===ko||t===Ho||t===Vo){if(i=e.get("WEBGL_compressed_texture_etc"),i===null)return null;if(t===ko||t===Ho)return s===We?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(t===Vo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC}if(t===Go||t===Wo||t===Xo||t===jo||t===qo||t===Yo||t===Zo||t===Ko||t===Jo||t===$o||t===Qo||t===el||t===tl||t===nl){if(i=e.get("WEBGL_compressed_texture_astc"),i===null)return null;if(t===Go)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(t===Wo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(t===Xo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(t===jo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(t===qo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(t===Yo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(t===Zo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(t===Ko)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(t===Jo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(t===$o)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(t===Qo)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(t===el)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(t===tl)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(t===nl)return s===We?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}if(t===js||t===il||t===rl){if(i=e.get("EXT_texture_compression_bptc"),i===null)return null;if(t===js)return s===We?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(t===il)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(t===rl)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(t===od||t===sl||t===al||t===ol){if(i=e.get("EXT_texture_compression_rgtc"),i===null)return null;if(t===js)return i.COMPRESSED_RED_RGTC1_EXT;if(t===sl)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(t===al)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(t===ol)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return t===qi?r.UNSIGNED_INT_24_8:r[t]!==void 0?r[t]:null}}}function bm(r,e){function t(i,s){i.matrixAutoUpdate===!0&&i.updateMatrix(),s.value.copy(i.matrix)}function n(i,s){i.opacity.value=s.opacity,s.color&&i.diffuse.value.copy(s.color),s.emissive&&i.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(i.map.value=s.map,t(s.map,i.mapTransform)),s.alphaMap&&(i.alphaMap.value=s.alphaMap,t(s.alphaMap,i.alphaMapTransform)),s.bumpMap&&(i.bumpMap.value=s.bumpMap,t(s.bumpMap,i.bumpMapTransform),i.bumpScale.value=s.bumpScale,s.side===1&&(i.bumpScale.value*=-1)),s.normalMap&&(i.normalMap.value=s.normalMap,t(s.normalMap,i.normalMapTransform),i.normalScale.value.copy(s.normalScale),s.side===1&&i.normalScale.value.negate()),s.displacementMap&&(i.displacementMap.value=s.displacementMap,t(s.displacementMap,i.displacementMapTransform),i.displacementScale.value=s.displacementScale,i.displacementBias.value=s.displacementBias),s.emissiveMap&&(i.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,i.emissiveMapTransform)),s.specularMap&&(i.specularMap.value=s.specularMap,t(s.specularMap,i.specularMapTransform)),s.alphaTest>0&&(i.alphaTest.value=s.alphaTest);let a=e.get(s),o=a.envMap,l=a.envMapRotation;o&&(i.envMap.value=o,hi.copy(l),hi.x*=-1,hi.y*=-1,hi.z*=-1,o.isCubeTexture&&o.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),i.envMapRotation.value.setFromMatrix4(Sm.makeRotationFromEuler(hi)),i.flipEnvMap.value=o.isCubeTexture&&o.isRenderTargetTexture===!1?-1:1,i.reflectivity.value=s.reflectivity,i.ior.value=s.ior,i.refractionRatio.value=s.refractionRatio),s.lightMap&&(i.lightMap.value=s.lightMap,i.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,i.lightMapTransform)),s.aoMap&&(i.aoMap.value=s.aoMap,i.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,i.aoMapTransform))}return{refreshFogUniforms:function(i,s){s.color.getRGB(i.fogColor.value,dd(r)),s.isFog?(i.fogNear.value=s.near,i.fogFar.value=s.far):s.isFogExp2&&(i.fogDensity.value=s.density)},refreshMaterialUniforms:function(i,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?n(i,s):s.isMeshToonMaterial?(n(i,s),(function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)})(i,s)):s.isMeshPhongMaterial?(n(i,s),(function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)})(i,s)):s.isMeshStandardMaterial?(n(i,s),(function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),h.envMap&&(c.envMapIntensity.value=h.envMapIntensity)})(i,s),s.isMeshPhysicalMaterial&&(function(c,h,u){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===1&&c.clearcoatNormalScale.value.negate())),h.dispersion>0&&(c.dispersion.value=h.dispersion),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=u.texture,c.transmissionSamplerSize.value.set(u.width,u.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))})(i,s,l)):s.isMeshMatcapMaterial?(n(i,s),(function(c,h){h.matcap&&(c.matcap.value=h.matcap)})(i,s)):s.isMeshDepthMaterial?n(i,s):s.isMeshDistanceMaterial?(n(i,s),(function(c,h){let u=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(u.matrixWorld),c.nearDistance.value=u.shadow.camera.near,c.farDistance.value=u.shadow.camera.far})(i,s)):s.isMeshNormalMaterial?n(i,s):s.isLineBasicMaterial?((function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))})(i,s),s.isLineDashedMaterial&&(function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale})(i,s)):s.isPointsMaterial?(function(c,h,u,d){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*u,c.scale.value=.5*d,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(i,s,a,o):s.isSpriteMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(i,s):s.isShadowMaterial?(i.color.value.copy(s.color),i.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function Tm(r,e,t,n){let i={},s={},a=[],o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(u,d,p,m){let g=u.value,f=d+"_"+p;if(m[f]===void 0)return m[f]=typeof g=="number"||typeof g=="boolean"?g:g.clone(),!0;{let _=m[f];if(typeof g=="number"||typeof g=="boolean"){if(_!==g)return m[f]=g,!0}else if(_.equals(g)===!1)return _.copy(g),!0}return!1}function c(u){let d={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(d.boundary=4,d.storage=4):u.isVector2?(d.boundary=8,d.storage=8):u.isVector3||u.isColor?(d.boundary=16,d.storage=12):u.isVector4?(d.boundary=16,d.storage=16):u.isMatrix3?(d.boundary=48,d.storage=48):u.isMatrix4?(d.boundary=64,d.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),d}function h(u){let d=u.target;d.removeEventListener("dispose",h);let p=a.indexOf(d.__bindingPointIndex);a.splice(p,1),r.deleteBuffer(i[d.id]),delete i[d.id],delete s[d.id]}return{bind:function(u,d){let p=d.program;n.uniformBlockBinding(u,p)},update:function(u,d){let p=i[u.id];p===void 0&&((function(f){let _=f.uniforms,v=0,x=16;for(let A=0,M=_.length;A<M;A++){let C=Array.isArray(_[A])?_[A]:[_[A]];for(let L=0,U=C.length;L<U;L++){let z=C[L],V=Array.isArray(z.value)?z.value:[z.value];for(let H=0,j=V.length;H<j;H++){let G=c(V[H]),Y=v%x,K=Y%G.boundary,ie=Y+K;v+=K,ie!==0&&x-ie<G.storage&&(v+=x-ie),z.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=G.storage}}}let y=v%x;y>0&&(v+=x-y),f.__size=v,f.__cache={}})(u),p=(function(f){let _=(function(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0})();f.__bindingPointIndex=_;let v=r.createBuffer(),x=f.__size,y=f.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,x,y),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,_,v),v})(u),i[u.id]=p,u.addEventListener("dispose",h));let m=d.program;n.updateUBOMapping(u,m);let g=e.render.frame;s[u.id]!==g&&((function(f){let _=i[f.id],v=f.uniforms,x=f.__cache;r.bindBuffer(r.UNIFORM_BUFFER,_);for(let y=0,A=v.length;y<A;y++){let M=Array.isArray(v[y])?v[y]:[v[y]];for(let C=0,L=M.length;C<L;C++){let U=M[C];if(l(U,y,C,x)===!0){let z=U.__offset,V=Array.isArray(U.value)?U.value:[U.value],H=0;for(let j=0;j<V.length;j++){let G=V[j],Y=c(G);typeof G=="number"||typeof G=="boolean"?(U.__data[0]=G,r.bufferSubData(r.UNIFORM_BUFFER,z+H,U.__data)):G.isMatrix3?(U.__data[0]=G.elements[0],U.__data[1]=G.elements[1],U.__data[2]=G.elements[2],U.__data[3]=0,U.__data[4]=G.elements[3],U.__data[5]=G.elements[4],U.__data[6]=G.elements[5],U.__data[7]=0,U.__data[8]=G.elements[6],U.__data[9]=G.elements[7],U.__data[10]=G.elements[8],U.__data[11]=0):(G.toArray(U.__data,H),H+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,z,U.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)})(u),s[u.id]=g)},dispose:function(){for(let u in i)r.deleteBuffer(i[u]);a=[],i={},s={}}}}function Ls(r,e,t,n,i,s){let a=r.geometry.attributes.position;if(sa.fromBufferAttribute(a,i),aa.fromBufferAttribute(a,s),t.distanceSqToSegment(sa,aa,To,Du)>n)return;To.applyMatrix4(r.matrixWorld);let o=e.ray.origin.distanceTo(To);return o<e.near||o>e.far?void 0:{distance:o,point:Du.clone().applyMatrix4(r.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:r}}function Bu(r,e,t,n,i,s,a){let o=Al.distanceSqToPoint(r);if(o<t){let l=new T;Al.closestPointToPoint(r,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}function vc(){let r=0,e=0,t=0,n=0;function i(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){i(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let d=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,i(a,o,d,p)},calc:function(s){let a=s*s;return r+e*s+t*a+n*(a*s)}}}function Fu(r,e,t,n,i){let s=.5*(n-e),a=.5*(i-t),o=r*r;return(2*t-2*n+s+a)*(r*o)+(-3*t+3*n-2*s-a)*o+s*r+t}function Cr(r,e,t,n){return(function(i,s){let a=1-i;return a*a*s})(r,e)+(function(i,s){return 2*(1-i)*i*s})(r,t)+(function(i,s){return i*i*s})(r,n)}function Ir(r,e,t,n,i){return(function(s,a){let o=1-s;return o*o*o*a})(r,e)+(function(s,a){let o=1-s;return 3*o*o*s*a})(r,t)+(function(s,a){return 3*(1-s)*s*s*a})(r,n)+(function(s,a){return s*s*s*a})(r,i)}function zu(r,e,t,n,i){let s,a;if(i===(function(o,l,c,h){let u=0;for(let d=l,p=c-h;d<c;d+=h)u+=(o[p]-o[d])*(o[d+1]+o[p+1]),p=d;return u})(r,e,t,n)>0)for(s=e;s<t;s+=n)a=ku(s,r[s],r[s+1],a);else for(s=t-n;s>=e;s-=n)a=ku(s,r[s],r[s+1],a);return a&&Aa(a,a.next)&&(qr(a),a=a.next),a}function xi(r,e){if(!r)return r;e||(e=r);let t,n=r;do if(t=!1,n.steiner||!Aa(n,n.next)&&$e(n.prev,n,n.next)!==0)n=n.next;else{if(qr(n),n=e=n.prev,n===n.next)break;t=!0}while(t||n!==e);return e}function Xr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&(function(h,u,d,p){let m=h;do m.z===0&&(m.z=Bl(m.x,m.y,u,d,p)),m.prevZ=m.prev,m.nextZ=m.next,m=m.next;while(m!==h);m.prevZ.nextZ=null,m.prevZ=null,(function(g){let f,_,v,x,y,A,M,C,L=1;do{for(_=g,g=null,y=null,A=0;_;){for(A++,v=_,M=0,f=0;f<L&&(M++,v=v.nextZ,v);f++);for(C=L;M>0||C>0&&v;)M!==0&&(C===0||!v||_.z<=v.z)?(x=_,_=_.nextZ,M--):(x=v,v=v.nextZ,C--),y?y.nextZ=x:g=x,x.prevZ=y,y=x;_=v}y.nextZ=null,L*=2}while(A>1)})(m)})(r,n,i,s);let o,l,c=r;for(;r.prev!==r.next;)if(o=r.prev,l=r.next,s?Im(r,n,i,s):Cm(r))e.push(o.i/t|0),e.push(r.i/t|0),e.push(l.i/t|0),qr(r),r=l.next,c=l.next;else if((r=l)===c){a?a===1?Xr(r=Pm(xi(r),e,t),e,t,n,i,s,2):a===2&&Lm(r,e,t,n,i,s):Xr(xi(r),e,t,n,i,s,1);break}}function Cm(r){let e=r.prev,t=r,n=r.next;if($e(e,t,n)>=0)return!1;let i=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=i<s?i<a?i:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,d=i>s?i>a?i:a:s>a?s:a,p=o>l?o>c?o:c:l>c?l:c,m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=p&&Hi(i,o,s,l,a,c,m.x,m.y)&&$e(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Im(r,e,t,n){let i=r.prev,s=r,a=r.next;if($e(i,s,a)>=0)return!1;let o=i.x,l=s.x,c=a.x,h=i.y,u=s.y,d=a.y,p=o<l?o<c?o:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,g=o>l?o>c?o:c:l>c?l:c,f=h>u?h>d?h:d:u>d?u:d,_=Bl(p,m,e,t,n),v=Bl(g,f,e,t,n),x=r.prevZ,y=r.nextZ;for(;x&&x.z>=_&&y&&y.z<=v;){if(x.x>=p&&x.x<=g&&x.y>=m&&x.y<=f&&x!==i&&x!==a&&Hi(o,h,l,u,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=p&&y.x<=g&&y.y>=m&&y.y<=f&&y!==i&&y!==a&&Hi(o,h,l,u,c,d,y.x,y.y)&&$e(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=_;){if(x.x>=p&&x.x<=g&&x.y>=m&&x.y<=f&&x!==i&&x!==a&&Hi(o,h,l,u,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=v;){if(y.x>=p&&y.x<=g&&y.y>=m&&y.y<=f&&y!==i&&y!==a&&Hi(o,h,l,u,c,d,y.x,y.y)&&$e(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Pm(r,e,t){let n=r;do{let i=n.prev,s=n.next.next;!Aa(i,s)&&vd(i,n,n.next,s)&&jr(i,s)&&jr(s,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),qr(n),qr(n.next),n=r=s),n=n.next}while(n!==r);return xi(n)}function Lm(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Bm(a,o)){let l=xd(a,o);return a=xi(a,a.next),l=xi(l,l.next),Xr(a,e,t,n,i,s,0),void Xr(l,e,t,n,i,s,0)}o=o.next}a=a.next}while(a!==r)}function Dm(r,e){return r.x-e.x}function Nm(r,e){let t=(function(i,s){let a,o=s,l=-1/0,c=i.x,h=i.y;do{if(h<=o.y&&h>=o.next.y&&o.next.y!==o.y){let f=o.x+(h-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(f<=c&&f>l&&(l=f,a=o.x<o.next.x?o:o.next,f===c))return a}o=o.next}while(o!==s);if(!a)return null;let u=a,d=a.x,p=a.y,m,g=1/0;o=a;do c>=o.x&&o.x>=d&&c!==o.x&&Hi(h<p?c:l,h,d,p,h<p?l:c,h,o.x,o.y)&&(m=Math.abs(h-o.y)/(c-o.x),jr(o,i)&&(m<g||m===g&&(o.x>a.x||o.x===a.x&&Um(a,o)))&&(a=o,g=m)),o=o.next;while(o!==u);return a})(r,e);if(!t)return e;let n=xd(t,r);return xi(n,n.next),xi(t,t.next)}function Um(r,e){return $e(r.prev,r,e.prev)<0&&$e(e.next,r,r.next)<0}function Bl(r,e,t,n,i){return(r=1431655765&((r=858993459&((r=252645135&((r=16711935&((r=(r-t)*i|0)|r<<8))|r<<4))|r<<2))|r<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-n)*i|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function Om(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Hi(r,e,t,n,i,s,a,o){return(i-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(i-a)*(n-o)}function Bm(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!(function(t,n){let i=t;do{if(i.i!==t.i&&i.next.i!==t.i&&i.i!==n.i&&i.next.i!==n.i&&vd(i,i.next,t,n))return!0;i=i.next}while(i!==t);return!1})(r,e)&&(jr(r,e)&&jr(e,r)&&(function(t,n){let i=t,s=!1,a=(t.x+n.x)/2,o=(t.y+n.y)/2;do i.y>o!=i.next.y>o&&i.next.y!==i.y&&a<(i.next.x-i.x)*(o-i.y)/(i.next.y-i.y)+i.x&&(s=!s),i=i.next;while(i!==t);return s})(r,e)&&($e(r.prev,r,e.prev)||$e(r,e.prev,e))||Aa(r,e)&&$e(r.prev,r,r.next)>0&&$e(e.prev,e,e.next)>0)}function $e(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Aa(r,e){return r.x===e.x&&r.y===e.y}function vd(r,e,t,n){let i=ks($e(r,e,t)),s=ks($e(r,e,n)),a=ks($e(t,n,r)),o=ks($e(t,n,e));return i!==s&&a!==o||!(i!==0||!zs(r,t,e))||!(s!==0||!zs(r,n,e))||!(a!==0||!zs(t,r,n))||!(o!==0||!zs(t,e,n))}function zs(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function ks(r){return r>0?1:r<0?-1:0}function jr(r,e){return $e(r.prev,r,r.next)<0?$e(r,e,r.next)>=0&&$e(r,r.prev,e)>=0:$e(r,e,r.prev)<0||$e(r,r.next,e)<0}function xd(r,e){let t=new Fl(r.i,r.x,r.y),n=new Fl(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function ku(r,e,t,n){let i=new Fl(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function qr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Fl(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Hu(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Vu(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}function Gu(r,e,t){let n=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(n)!==!0&&t.has(i)!==!0&&(t.add(n),t.add(i),!0)}function Hs(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function zm(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function km(r){let e=r.length,t=new Array(e);for(let n=0;n!==e;++n)t[n]=n;return t.sort((function(n,i){return r[n]-r[i]})),t}function Wu(r,e,t){let n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){let o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function yd(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push.apply(t,a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}function Hm(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=(function(t){switch(t.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return bn;case"vector":case"vector2":case"vector3":case"vector4":return wn;case"color":return _a;case"quaternion":return Tn;case"bool":case"boolean":return zn;case"string":return kn}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+t)})(r.type);if(r.times===void 0){let t=[],n=[];yd(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}function Zu(r,e){return r.distance-e.distance}function sc(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let a=0,o=s.length;a<o;a++)sc(s[a],e,t,!0)}}var ac,oc,lc,Ku,di,tp,np,ip,rp,sp,ap,Lo,Do,op,lp,cp,hp,up,dp,pp,fp,mp,gp,_p,vp,xp,yp,Mp,Sp,bp,Ju,Rh,Tp,$u,Xi,ji,No,Uo,ba,pi,fi,Pr,wt,cc,ki,Nt,Er,vn,Gn,Qu,ed,Lr,hc,mi,en,$r,uc,dc,qi,td,nd,id,tn,rd,sd,Dr,Yi,pc,fc,ad,mc,gc,Vs,Gs,Ws,Xs,Oo,Bo,Fo,zo,ko,Ho,Vo,Go,Wo,Xo,jo,qo,Yo,Zo,Ko,Jo,$o,Qo,el,tl,nl,js,il,rl,od,sl,al,ol,Zi,Ki,Ya,Ch,Ih,Ph,ld,Ta,Qr,zi,it,xt,wa,We,wi,wp,Ep,Ap,Rp,Cp,Ip,Pp,Lp,ll,Lh,Ji,qs,Wn,_t,Dh,Vi,$i,cd,te,Ae,Za,Nh,Oe,Uh,Oh,Bh,Fh,zh,Ei,hl,Np,Ys,Up,mt,He,ul,yn,Zs,dl,Ut,T,Ja,kh,Et,un,Kt,cs,Ai,Ri,Ci,Ln,Dn,si,mr,hs,us,ai,Op,gr,Qa,At,dn,eo,ds,Nn,to,ps,no,gi,ye,Ii,Jt,Bp,Fp,Un,fs,Lt,Hh,Vh,ln,Ur,zp,Gh,Pi,pn,ms,_r,kp,Hp,Wh,Xh,jh,qh,Vp,Li,io,et,$t,fn,ro,mn,Di,Ni,Yh,so,ao,oo,lo,co,ho,Fn,ud,On,gs,xe,vt,Gp,Ot,Rt,fg,nt,_s,ot,Ks,Js,be,Xp,kt,po,Ui,Dt,vr,ut,Ge,Zh,oi,vs,Kh,xs,ys,Ms,fo,Ss,Jh,bs,ze,Xn,jp,Gt,Or,Bn,$h,Qh,at,Oi,pl,$s,fl,mo,qp,Yp,_n,li,ws,er,Br,Ce,ae,on,Es,ci,Kp,tr,eu,xr,go,tu,_o,vo,xo,yo,ui,Bi,nu,nr,Qs,fd,au,md,gd,_d,ou,lu,cu,hu,uu,ml,gl,_l,Mo,Wi,Kf,fu,Rs,em,tm,im,am,xl,yl,dm,Ml,Sl,_m,bl,ft,Mm,Rr,Tl,wl,hi,Sm,ea,ir,Fr,St,zr,mg,gg,_g,vg,xg,yg,Mg,Sg,bg,Tg,wg,Eg,Ag,Rg,Tu,wu,Eu,wm,Au,Cs,So,Ru,bo,ta,kr,na,Cu,Em,ia,_i,Fi,Iu,Is,Pu,Am,Mr,Sr,ra,El,Cg,Ig,Pg,Lg,Dg,Ng,Ug,Og,Bg,Fg,Mn,sa,aa,Lu,br,Ps,To,Du,jn,Nu,Uu,rr,oa,Hr,Ou,Al,Ds,Ns,sr,Wt,Vr,Rl,Us,wo,Eo,Ao,Cl,la,Il,ca,Pl,ha,ua,da,pa,Ll,Gr,fa,Dl,Nl,ma,Ul,vi,Ol,Os,Bs,Ro,Fs,Wr,ga,Rm,Vn,zl,Fm,kl,Hl,Vl,Gl,Yr,Wl,Xl,jl,ql,Yl,zg,Sn,Bt,qn,Zl,Kl,Jl,Vt,zn,_a,bn,$l,Tn,kn,wn,va,Hn,Ql,Vm,En,gn,ec,Zr,tc,xa,Kr,Co,Xu,ju,Jr,nc,ya,qu,Tr,Io,ic,Yn,rc,Zn,Kn,Ma,kg,Hg,Vg,Gg,Wg,Xg,jg,qg,Yg,Zg,Kg,xc,Gm,Po,Wm,Xm,jm,Ye,Jg,Yu,Sa,$g,Qg,e0,t0,n0,i0,r0,s0,a0,o0,l0,c0,h0,u0,d0,p0,f0,Jn=gt(()=>{ac=0,oc=1,lc=2,Ku=2,di=100,tp=101,np=102,ip=200,rp=201,sp=202,ap=203,Lo=204,Do=205,op=206,lp=207,cp=208,hp=209,up=210,dp=211,pp=212,fp=213,mp=214,gp=0,_p=1,vp=2,xp=3,yp=4,Mp=5,Sp=6,bp=7,Ju=4,Rh="attached",Tp="detached",$u=300,Xi=301,ji=302,No=303,Uo=304,ba=306,pi=1e3,fi=1001,Pr=1002,wt=1003,cc=1004,ki=1005,Nt=1006,Er=1007,vn=1008,Gn=1009,Qu=1010,ed=1011,Lr=1012,hc=1013,mi=1014,en=1015,$r=1016,uc=1017,dc=1018,qi=1020,td=35902,nd=1021,id=1022,tn=1023,rd=1024,sd=1025,Dr=1026,Yi=1027,pc=1028,fc=1029,ad=1030,mc=1031,gc=1033,Vs=33776,Gs=33777,Ws=33778,Xs=33779,Oo=35840,Bo=35841,Fo=35842,zo=35843,ko=36196,Ho=37492,Vo=37496,Go=37808,Wo=37809,Xo=37810,jo=37811,qo=37812,Yo=37813,Zo=37814,Ko=37815,Jo=37816,$o=37817,Qo=37818,el=37819,tl=37820,nl=37821,js=36492,il=36494,rl=36495,od=36283,sl=36284,al=36285,ol=36286,Zi=2300,Ki=2301,Ya=2302,Ch=2400,Ih=2401,Ph=2402,ld=0,Ta=1,Qr=2,zi="",it="srgb",xt="srgb-linear",wa="linear",We="srgb",wi=7680,wp=512,Ep=513,Ap=514,Rp=515,Cp=516,Ip=517,Pp=518,Lp=519,ll=35044,Lh="300 es",Ji=2e3,qs=2001,Wn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let i=n.indexOf(t);i!==-1&&n.splice(i,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let i=0,s=n.length;i<s;i++)n[i].call(this,e);e.target=null}}},_t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Dh=1234567,Vi=Math.PI/180,$i=180/Math.PI;cd={DEG2RAD:Vi,RAD2DEG:$i,generateUUID:Ht,clamp:st,euclideanModulo:cl,mapLinear:function(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)},inverseLerp:function(r,e,t){return r!==e?(t-r)/(e-r):0},lerp:Ar,damp:function(r,e,t,n){return Ar(r,e,1-Math.exp(-t*n))},pingpong:function(r,e=1){return e-Math.abs(cl(r,2*e)-e)},smoothstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*(3-2*r)},smootherstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*r*(r*(6*r-15)+10)},randInt:function(r,e){return r+Math.floor(Math.random()*(e-r+1))},randFloat:function(r,e){return r+Math.random()*(e-r)},randFloatSpread:function(r){return r*(.5-Math.random())},seededRandom:function(r){r!==void 0&&(Dh=r);let e=Dh+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(r){return r*Vi},radToDeg:function(r){return r*$i},isPowerOfTwo:function(r){return!(r&r-1)&&r!==0},ceilPowerOfTwo:function(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))},floorPowerOfTwo:function(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))},setQuaternionFromProperEuler:function(r,e,t,n,i){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),p=s((n-e)/2),m=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*u,l*d,o*c);break;case"YZY":r.set(l*d,o*h,l*u,o*c);break;case"ZXZ":r.set(l*u,l*d,o*h,o*c);break;case"XZX":r.set(o*h,l*m,l*p,o*c);break;case"YXY":r.set(l*p,o*h,l*m,o*c);break;case"ZYZ":r.set(l*m,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}},normalize:Ve,denormalize:Qt},te=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ae=class r{constructor(e,t,n,i,s,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],m=n[8],g=i[0],f=i[3],_=i[6],v=i[1],x=i[4],y=i[7],A=i[2],M=i[5],C=i[8];return s[0]=a*g+o*v+l*A,s[3]=a*f+o*x+l*M,s[6]=a*_+o*y+l*C,s[1]=c*g+h*v+u*A,s[4]=c*f+h*x+u*M,s[7]=c*_+h*y+u*C,s[2]=d*g+p*v+m*A,s[5]=d*f+p*x+m*M,s[8]=d*_+p*y+m*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,p=c*s-a*l,m=t*u+n*d+i*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/m;return e[0]=u*g,e[1]=(i*c-h*n)*g,e[2]=(o*n-i*a)*g,e[3]=d*g,e[4]=(h*t-i*l)*g,e[5]=(i*s-o*t)*g,e[6]=p*g,e[7]=(n*l-c*t)*g,e[8]=(a*t-n*s)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Za.makeScale(e,t)),this}rotate(e){return this.premultiply(Za.makeRotation(-e)),this}translate(e,t){return this.premultiply(Za.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Za=new Ae;Nh={};Oe={enabled:!0,workingColorSpace:xt,spaces:{},convert:function(r,e,t){return this.enabled!==!1&&e!==t&&e&&t&&(this.spaces[e].transfer===We&&(r.r=xn(r.r),r.g=xn(r.g),r.b=xn(r.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(r.applyMatrix3(this.spaces[e].toXYZ),r.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===We&&(r.r=Gi(r.r),r.g=Gi(r.g),r.b=Gi(r.b))),r},fromWorkingColorSpace:function(r,e){return this.convert(r,this.workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===zi?wa:this.spaces[r].transfer},getLuminanceCoefficients:function(r,e=this.workingColorSpace){return r.fromArray(this.spaces[e].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,e,t){return r.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}};Uh=[.64,.33,.3,.6,.15,.06],Oh=[.2126,.7152,.0722],Bh=[.3127,.329],Fh=new Ae().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zh=new Ae().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Oe.define({[xt]:{primaries:Uh,whitePoint:Bh,transfer:wa,toXYZ:Fh,fromXYZ:zh,luminanceCoefficients:Oh,workingColorSpaceConfig:{unpackColorSpace:it},outputColorSpaceConfig:{drawingBufferColorSpace:it}},[it]:{primaries:Uh,whitePoint:Bh,transfer:We,toXYZ:Fh,fromXYZ:zh,luminanceCoefficients:Oh,outputColorSpaceConfig:{drawingBufferColorSpace:it}}});hl=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ei===void 0&&(Ei=Nr("canvas")),Ei.width=e.width,Ei.height=e.height;let n=Ei.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ei}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Nr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=255*xn(s[a]/255);return n.putImageData(i,0,0),t}if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(255*xn(t[n]/255)):t[n]=xn(t[n]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Np=0,Ys=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=Ht(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Ka(i[a].image)):s.push(Ka(i[a]))}else s=Ka(i);n.url=s}return t||(e.images[this.uuid]=n),n}};Up=0,mt=class r extends Wn{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=1001,i=1001,s=1006,a=1008,o=1023,l=1009,c=r.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Up++}),this.uuid=Ht(),this.name="",this.source=new Ys(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new te(0,0),this.repeat=new te(1,1),this.center=new te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ae,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$u)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case pi:e.x=e.x-Math.floor(e.x);break;case fi:e.x=e.x<0?0:1;break;case Pr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case pi:e.y=e.y-Math.floor(e.y);break;case fi:e.y=e.y<0?0:1;break;case Pr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};mt.DEFAULT_IMAGE=null,mt.DEFAULT_MAPPING=$u,mt.DEFAULT_ANISOTROPY=1;He=class r{constructor(e=0,t=0,n=0,i=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],m=l[9],g=l[2],f=l[6],_=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-g)<.01&&Math.abs(m-f)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+g)<.1&&Math.abs(m+f)<.1&&Math.abs(c+p+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,y=(p+1)/2,A=(_+1)/2,M=(h+d)/4,C=(u+g)/4,L=(m+f)/4;return x>y&&x>A?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=M/n,s=C/n):y>A?y<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(y),n=M/i,s=L/i):A<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(A),n=C/s,i=L/s),this.set(n,i,s,t),this}let v=Math.sqrt((f-m)*(f-m)+(u-g)*(u-g)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(f-m)/v,this.y=(u-g)/v,this.z=(d-h)/v,this.w=Math.acos((c+p+_-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ul=class extends Wn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new He(0,0,e,t),this.scissorTest=!1,this.viewport=new He(0,0,e,t);let i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new mt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ys(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},yn=class extends ul{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Zs=class extends mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=wt,this.minFilter=wt,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},dl=class extends mt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=wt,this.minFilter=wt,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ut=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=s[a+0],p=s[a+1],m=s[a+2],g=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=u);if(o===1)return e[t+0]=d,e[t+1]=p,e[t+2]=m,void(e[t+3]=g);if(u!==g||l!==d||c!==p||h!==m){let f=1-o,_=l*d+c*p+h*m+u*g,v=_>=0?1:-1,x=1-_*_;if(x>Number.EPSILON){let A=Math.sqrt(x),M=Math.atan2(A,_*v);f=Math.sin(f*M)/A,o=Math.sin(o*M)/A}let y=o*v;if(l=l*f+d*y,c=c*f+p*y,h=h*f+m*y,u=u*f+g*y,f===1-o){let A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],d=s[a+1],p=s[a+2],m=s[a+3];return e[t]=o*m+h*u+l*p-c*d,e[t+1]=l*m+h*d+c*u-o*p,e[t+2]=c*m+h*p+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),d=l(n/2),p=l(i/2),m=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"YXZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"ZXY":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"ZYX":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"YZX":this._x=d*h*u+c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u-d*p*m;break;case"XZY":this._x=d*h*u-c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u+d*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-i)*p}else if(n>o&&n>u){let p=2*Math.sqrt(1+n-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(s+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-n-u);this._w=(s-c)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-o);this._w=(a-i)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,s=this._z,a=this._w,o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*i+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},T=class r{constructor(e=0,t=0,n=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=i+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ja.copy(this).projectOnVector(e),this.sub(Ja)}reflect(e){return this.sub(Ja.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ja=new T,kh=new Ut,Et=class{constructor(e=new T(1/0,1/0,1/0),t=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Kt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Kt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Kt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Kt):Kt.fromBufferAttribute(s,a),Kt.applyMatrix4(e.matrixWorld),this.expandByPoint(Kt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),cs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),cs.copy(n.boundingBox)),cs.applyMatrix4(e.matrixWorld),this.union(cs)}let i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Kt),Kt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(mr),hs.subVectors(this.max,mr),Ai.subVectors(e.a,mr),Ri.subVectors(e.b,mr),Ci.subVectors(e.c,mr),Ln.subVectors(Ri,Ai),Dn.subVectors(Ci,Ri),si.subVectors(Ai,Ci);let t=[0,-Ln.z,Ln.y,0,-Dn.z,Dn.y,0,-si.z,si.y,Ln.z,0,-Ln.x,Dn.z,0,-Dn.x,si.z,0,-si.x,-Ln.y,Ln.x,0,-Dn.y,Dn.x,0,-si.y,si.x,0];return!!$a(t,Ai,Ri,Ci,hs)&&(t=[1,0,0,0,1,0,0,0,1],!!$a(t,Ai,Ri,Ci,hs)&&(us.crossVectors(Ln,Dn),t=[us.x,us.y,us.z],$a(t,Ai,Ri,Ci,hs)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Kt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Kt).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},un=[new T,new T,new T,new T,new T,new T,new T,new T],Kt=new T,cs=new Et,Ai=new T,Ri=new T,Ci=new T,Ln=new T,Dn=new T,si=new T,mr=new T,hs=new T,us=new T,ai=new T;Op=new Et,gr=new T,Qa=new T,At=class{constructor(e=new T,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Op.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gr.subVectors(e,this.center);let t=gr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=.5*(n-this.radius);this.center.addScaledVector(gr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gr.copy(e.center).add(Qa)),this.expandByPoint(gr.copy(e.center).sub(Qa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},dn=new T,eo=new T,ds=new T,Nn=new T,to=new T,ps=new T,no=new T,gi=class{constructor(e=new T,t=new T(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(dn.copy(this.origin).addScaledVector(this.direction,t),dn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){eo.copy(e).add(t).multiplyScalar(.5),ds.copy(t).sub(e).normalize(),Nn.copy(this.origin).sub(eo);let s=.5*e.distanceTo(t),a=-this.direction.dot(ds),o=Nn.dot(this.direction),l=-Nn.dot(ds),c=Nn.lengthSq(),h=Math.abs(1-a*a),u,d,p,m;if(h>0)if(u=a*l-o,d=a*o-l,m=s*h,u>=0)if(d>=-m)if(d<=m){let g=1/h;u*=g,d*=g,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(eo).addScaledVector(ds,d),p}intersectSphere(e,t){dn.subVectors(e.center,this.origin);let n=dn.dot(this.direction),i=dn.dot(dn)-n*n,s=e.radius*e.radius;if(i>s)return null;let a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>i?null:((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i?null:((o>n||n!=n)&&(n=o),(l<i||i!=i)&&(i=l),i<0?null:this.at(n>=0?n:i,t)))}intersectsBox(e){return this.intersectBox(e,dn)!==null}intersectTriangle(e,t,n,i,s){to.subVectors(t,e),ps.subVectors(n,e),no.crossVectors(to,ps);let a,o=this.direction.dot(no);if(o>0){if(i)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}Nn.subVectors(this.origin,e);let l=a*this.direction.dot(ps.crossVectors(Nn,ps));if(l<0)return null;let c=a*this.direction.dot(to.cross(Nn));if(c<0||l+c>o)return null;let h=-a*Nn.dot(no);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ye=class r{constructor(e,t,n,i,s,a,o,l,c,h,u,d,p,m,g,f){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,u,d,p,m,g,f)}set(e,t,n,i,s,a,o,l,c,h,u,d,p,m,g,f){let _=this.elements;return _[0]=e,_[4]=t,_[8]=n,_[12]=i,_[1]=s,_[5]=a,_[9]=o,_[13]=l,_[2]=c,_[6]=h,_[10]=u,_[14]=d,_[3]=p,_[7]=m,_[11]=g,_[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Ii.setFromMatrixColumn(e,0).length(),s=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*h,p=a*u,m=o*h,g=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+m*c,t[5]=d-g*c,t[9]=-o*l,t[2]=g-d*c,t[6]=m+p*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,m=c*h,g=c*u;t[0]=d+g*o,t[4]=m*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=p*o-m,t[6]=g+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,m=c*h,g=c*u;t[0]=d-g*o,t[4]=-a*u,t[8]=m+p*o,t[1]=p+m*o,t[5]=a*h,t[9]=g-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,p=a*u,m=o*h,g=o*u;t[0]=l*h,t[4]=m*c-p,t[8]=d*c+g,t[1]=l*u,t[5]=g*c+d,t[9]=p*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,p=a*c,m=o*l,g=o*c;t[0]=l*h,t[4]=g-d*u,t[8]=m*u+p,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*u+m,t[10]=d-g*u}else if(e.order==="XZY"){let d=a*l,p=a*c,m=o*l,g=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+g,t[5]=a*h,t[9]=p*u-m,t[2]=m*u-p,t[6]=o*h,t[10]=g*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bp,e,Fp)}lookAt(e,t,n){let i=this.elements;return Lt.subVectors(e,t),Lt.lengthSq()===0&&(Lt.z=1),Lt.normalize(),Un.crossVectors(n,Lt),Un.lengthSq()===0&&(Math.abs(n.z)===1?Lt.x+=1e-4:Lt.z+=1e-4,Lt.normalize(),Un.crossVectors(n,Lt)),Un.normalize(),fs.crossVectors(Lt,Un),i[0]=Un.x,i[4]=fs.x,i[8]=Lt.x,i[1]=Un.y,i[5]=fs.y,i[9]=Lt.y,i[2]=Un.z,i[6]=fs.z,i[10]=Lt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],m=n[2],g=n[6],f=n[10],_=n[14],v=n[3],x=n[7],y=n[11],A=n[15],M=i[0],C=i[4],L=i[8],U=i[12],z=i[1],V=i[5],H=i[9],j=i[13],G=i[2],Y=i[6],K=i[10],ie=i[14],ne=i[3],fe=i[7],ve=i[11],ee=i[15];return s[0]=a*M+o*z+l*G+c*ne,s[4]=a*C+o*V+l*Y+c*fe,s[8]=a*L+o*H+l*K+c*ve,s[12]=a*U+o*j+l*ie+c*ee,s[1]=h*M+u*z+d*G+p*ne,s[5]=h*C+u*V+d*Y+p*fe,s[9]=h*L+u*H+d*K+p*ve,s[13]=h*U+u*j+d*ie+p*ee,s[2]=m*M+g*z+f*G+_*ne,s[6]=m*C+g*V+f*Y+_*fe,s[10]=m*L+g*H+f*K+_*ve,s[14]=m*U+g*j+f*ie+_*ee,s[3]=v*M+x*z+y*G+A*ne,s[7]=v*C+x*V+y*Y+A*fe,s[11]=v*L+x*H+y*K+A*ve,s[15]=v*U+x*j+y*ie+A*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14];return e[3]*(+s*l*u-i*c*u-s*o*d+n*c*d+i*o*p-n*l*p)+e[7]*(+t*l*p-t*c*d+s*a*d-i*a*p+i*c*h-s*l*h)+e[11]*(+t*c*u-t*o*p-s*a*u+n*a*p+s*o*h-n*c*h)+e[15]*(-i*o*h-t*l*u+t*o*d+i*a*u-n*a*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],m=e[12],g=e[13],f=e[14],_=e[15],v=u*f*c-g*d*c+g*l*p-o*f*p-u*l*_+o*d*_,x=m*d*c-h*f*c-m*l*p+a*f*p+h*l*_-a*d*_,y=h*g*c-m*u*c+m*o*p-a*g*p-h*o*_+a*u*_,A=m*u*l-h*g*l-m*o*d+a*g*d+h*o*f-a*u*f,M=t*v+n*x+i*y+s*A;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/M;return e[0]=v*C,e[1]=(g*d*s-u*f*s-g*i*p+n*f*p+u*i*_-n*d*_)*C,e[2]=(o*f*s-g*l*s+g*i*c-n*f*c-o*i*_+n*l*_)*C,e[3]=(u*l*s-o*d*s-u*i*c+n*d*c+o*i*p-n*l*p)*C,e[4]=x*C,e[5]=(h*f*s-m*d*s+m*i*p-t*f*p-h*i*_+t*d*_)*C,e[6]=(m*l*s-a*f*s-m*i*c+t*f*c+a*i*_-t*l*_)*C,e[7]=(a*d*s-h*l*s+h*i*c-t*d*c-a*i*p+t*l*p)*C,e[8]=y*C,e[9]=(m*u*s-h*g*s-m*n*p+t*g*p+h*n*_-t*u*_)*C,e[10]=(a*g*s-m*o*s+m*n*c-t*g*c-a*n*_+t*o*_)*C,e[11]=(h*o*s-a*u*s-h*n*c+t*u*c+a*n*p-t*o*p)*C,e[12]=A*C,e[13]=(h*g*i-m*u*i+m*n*d-t*g*d-h*n*f+t*u*f)*C,e[14]=(m*o*i-a*g*i-m*n*l+t*g*l+a*n*f-t*o*f)*C,e[15]=(a*u*i-h*o*i+h*n*l-t*u*l-a*n*d+t*o*d)*C,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,p=s*h,m=s*u,g=a*h,f=a*u,_=o*u,v=l*c,x=l*h,y=l*u,A=n.x,M=n.y,C=n.z;return i[0]=(1-(g+_))*A,i[1]=(p+y)*A,i[2]=(m-x)*A,i[3]=0,i[4]=(p-y)*M,i[5]=(1-(d+_))*M,i[6]=(f+v)*M,i[7]=0,i[8]=(m+x)*C,i[9]=(f-v)*C,i[10]=(1-(d+g))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,s=Ii.set(i[0],i[1],i[2]).length(),a=Ii.set(i[4],i[5],i[6]).length(),o=Ii.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],Jt.copy(this);let l=1/s,c=1/a,h=1/o;return Jt.elements[0]*=l,Jt.elements[1]*=l,Jt.elements[2]*=l,Jt.elements[4]*=c,Jt.elements[5]*=c,Jt.elements[6]*=c,Jt.elements[8]*=h,Jt.elements[9]*=h,Jt.elements[10]*=h,t.setFromRotationMatrix(Jt),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a,o=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i),p,m;if(o===Ji)p=-(a+s)/(a-s),m=-2*a*s/(a-s);else{if(o!==qs)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);p=-a/(a-s),m=-a*s/(a-s)}return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=2e3){let l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(a-s),d=(t+e)*c,p=(n+i)*h,m,g;if(o===Ji)m=(a+s)*u,g=-2*u;else{if(o!==qs)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);m=s*u,g=-1*u}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=g,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ii=new T,Jt=new ye,Bp=new T(0,0,0),Fp=new T(1,1,1),Un=new T,fs=new T,Lt=new T,Hh=new ye,Vh=new Ut,ln=class r{constructor(e=0,t=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(st(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(st(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Hh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vh.setFromEuler(this),this.setFromQuaternion(Vh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ln.DEFAULT_ORDER="XYZ";Ur=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return!!(this.mask&e.mask)}isEnabled(e){return!!(this.mask&1<<e)}},zp=0,Gh=new T,Pi=new Ut,pn=new ye,ms=new T,_r=new T,kp=new T,Hp=new Ut,Wh=new T(1,0,0),Xh=new T(0,1,0),jh=new T(0,0,1),qh={type:"added"},Vp={type:"removed"},Li={type:"childadded",child:null},io={type:"childremoved",child:null},et=class r extends Wn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zp++}),this.uuid=Ht(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new T,t=new ln,n=new Ut,i=new T(1,1,1);t._onChange((function(){n.setFromEuler(t,!1)})),n._onChange((function(){t.setFromQuaternion(n,void 0,!1)})),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ye},normalMatrix:{value:new Ae}}),this.matrix=new ye,this.matrixWorld=new ye,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ur,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.multiply(Pi),this}rotateOnWorldAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.premultiply(Pi),this}rotateX(e){return this.rotateOnAxis(Wh,e)}rotateY(e){return this.rotateOnAxis(Xh,e)}rotateZ(e){return this.rotateOnAxis(jh,e)}translateOnAxis(e,t){return Gh.copy(e).applyQuaternion(this.quaternion),this.position.add(Gh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wh,e)}translateY(e){return this.translateOnAxis(Xh,e)}translateZ(e){return this.translateOnAxis(jh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(pn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ms.copy(e):ms.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),_r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pn.lookAt(_r,ms,this.up):pn.lookAt(ms,_r,this.up),this.quaternion.setFromRotationMatrix(pn),i&&(pn.extractRotation(i.matrixWorld),Pi.setFromRotationMatrix(pn),this.quaternion.premultiply(Pi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qh),Li.child=e,this.dispatchEvent(Li),Li.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Vp),io.child=e,this.dispatchEvent(io),io.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),pn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),pn.multiply(e.parent.matrixWorld)),e.applyMatrix4(pn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qh),Li.child=e,this.dispatchEvent(Li),Li.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,e,kp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,Hp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map((o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()}))),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};et.DEFAULT_UP=new T(0,1,0),et.DEFAULT_MATRIX_AUTO_UPDATE=!0,et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;$t=new T,fn=new T,ro=new T,mn=new T,Di=new T,Ni=new T,Yh=new T,so=new T,ao=new T,oo=new T,lo=new He,co=new He,ho=new He,Fn=class r{constructor(e=new T,t=new T,n=new T){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),$t.subVectors(e,t),i.cross($t);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){$t.subVectors(i,t),fn.subVectors(n,t),ro.subVectors(e,t);let a=$t.dot($t),o=$t.dot(fn),l=$t.dot(ro),c=fn.dot(fn),h=fn.dot(ro),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(c*l-o*h)*d,m=(a*h-o*l)*d;return s.set(1-p-m,m,p)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,mn)!==null&&mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,mn.x),l.addScaledVector(a,mn.y),l.addScaledVector(o,mn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return lo.setScalar(0),co.setScalar(0),ho.setScalar(0),lo.fromBufferAttribute(e,t),co.fromBufferAttribute(e,n),ho.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(lo,s.x),a.addScaledVector(co,s.y),a.addScaledVector(ho,s.z),a}static isFrontFacing(e,t,n,i){return $t.subVectors(n,t),fn.subVectors(e,t),$t.cross(fn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $t.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),.5*$t.cross(fn).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return r.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,a,o;Di.subVectors(i,n),Ni.subVectors(s,n),so.subVectors(e,n);let l=Di.dot(so),c=Ni.dot(so);if(l<=0&&c<=0)return t.copy(n);ao.subVectors(e,i);let h=Di.dot(ao),u=Ni.dot(ao);if(h>=0&&u<=h)return t.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Di,a);oo.subVectors(e,s);let p=Di.dot(oo),m=Ni.dot(oo);if(m>=0&&p<=m)return t.copy(s);let g=p*c-l*m;if(g<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Ni,o);let f=h*m-p*u;if(f<=0&&u-h>=0&&p-m>=0)return Yh.subVectors(s,i),o=(u-h)/(u-h+(p-m)),t.copy(i).addScaledVector(Yh,o);let _=1/(f+g+d);return a=g*_,o=d*_,t.copy(n).addScaledVector(Di,a).addScaledVector(Ni,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ud={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},On={h:0,s:0,l:0},gs={h:0,s:0,l:0};xe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=it){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Oe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Oe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Oe.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Oe.workingColorSpace){if(e=cl(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=uo(a,s,e+1/3),this.g=uo(a,s,e),this.b=uo(a,s,e-1/3)}return Oe.toWorkingColorSpace(this,i),this}setStyle(e,t=it){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=it){let n=ud[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xn(e.r),this.g=xn(e.g),this.b=xn(e.b),this}copyLinearToSRGB(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=it){return Oe.fromWorkingColorSpace(vt.copy(this),e),65536*Math.round(st(255*vt.r,0,255))+256*Math.round(st(255*vt.g,0,255))+Math.round(st(255*vt.b,0,255))}getHexString(e=it){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Oe.workingColorSpace){Oe.fromWorkingColorSpace(vt.copy(this),t);let n=vt.r,i=vt.g,s=vt.b,a=Math.max(n,i,s),o=Math.min(n,i,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Oe.workingColorSpace){return Oe.fromWorkingColorSpace(vt.copy(this),t),e.r=vt.r,e.g=vt.g,e.b=vt.b,e}getStyle(e=it){Oe.fromWorkingColorSpace(vt.copy(this),e);let t=vt.r,n=vt.g,i=vt.b;return e!==it?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*n)},${Math.round(255*i)})`}offsetHSL(e,t,n){return this.getHSL(On),this.setHSL(On.h+e,On.s+t,On.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(On),e.getHSL(gs);let n=Ar(On.h,gs.h,t),i=Ar(On.s,gs.s,t),s=Ar(On.l,gs.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},vt=new xe;xe.NAMES=ud;Gp=0,Ot=class extends Wn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gp++}),this.uuid=Ht(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lo,this.blendDst=Do,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new xe(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];i!==void 0?i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function i(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Lo&&(n.blendSrc=this.blendSrc),this.blendDst!==Do&&(n.blendDst=this.blendDst),this.blendEquation!==di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData),t){let s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Rt=class extends Ot{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},fg=Wp();nt=new T,_s=new te,ot=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ll,this.updateRanges=[],this.gpuType=en,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_s.fromBufferAttribute(this,t),_s.applyMatrix3(e),this.setXY(t,_s.x,_s.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyMatrix3(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyMatrix4(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyNormalMatrix(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.transformDirection(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Qt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ve(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Qt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ve(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Qt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ve(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Qt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ve(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Qt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ve(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ve(t,this.array),n=Ve(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Ve(t,this.array),n=Ve(n,this.array),i=Ve(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=Ve(t,this.array),n=Ve(n,this.array),i=Ve(i,this.array),s=Ve(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ll&&(e.usage=this.usage),e}},Ks=class extends ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Js=class extends ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}},be=class extends ot{constructor(e,t,n){super(new Float32Array(e),t,n)}},Xp=0,kt=new ye,po=new et,Ui=new T,Dt=new Et,vr=new Et,ut=new T,Ge=class r extends Wn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=Ht(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hd(e)?Js:Ks)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Ae().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return kt.makeRotationFromQuaternion(e),this.applyMatrix4(kt),this}rotateX(e){return kt.makeRotationX(e),this.applyMatrix4(kt),this}rotateY(e){return kt.makeRotationY(e),this.applyMatrix4(kt),this}rotateZ(e){return kt.makeRotationZ(e),this.applyMatrix4(kt),this}translate(e,t,n){return kt.makeTranslation(e,t,n),this.applyMatrix4(kt),this}scale(e,t,n){return kt.makeScale(e,t,n),this.applyMatrix4(kt),this}lookAt(e){return po.lookAt(e),po.updateMatrix(),this.applyMatrix4(po.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ui).negate(),this.translate(Ui.x,Ui.y,Ui.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new be(n,3))}else{for(let n=0,i=t.count;n<i;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Et);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];Dt.setFromBufferAttribute(s),this.morphTargetsRelative?(ut.addVectors(this.boundingBox.min,Dt.min),this.boundingBox.expandByPoint(ut),ut.addVectors(this.boundingBox.max,Dt.max),this.boundingBox.expandByPoint(ut)):(this.boundingBox.expandByPoint(Dt.min),this.boundingBox.expandByPoint(Dt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new At);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new T,1/0);if(e){let n=this.boundingSphere.center;if(Dt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];vr.setFromBufferAttribute(o),this.morphTargetsRelative?(ut.addVectors(Dt.min,vr.min),Dt.expandByPoint(ut),ut.addVectors(Dt.max,vr.max),Dt.expandByPoint(ut)):(Dt.expandByPoint(vr.min),Dt.expandByPoint(vr.max))}Dt.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)ut.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(ut));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ut.fromBufferAttribute(o,c),l&&(Ui.fromBufferAttribute(e,c),ut.add(Ui)),i=Math.max(i,n.distanceToSquared(ut))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ot(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<n.count;L++)o[L]=new T,l[L]=new T;let c=new T,h=new T,u=new T,d=new te,p=new te,m=new te,g=new T,f=new T;function _(L,U,z){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,U),u.fromBufferAttribute(n,z),d.fromBufferAttribute(s,L),p.fromBufferAttribute(s,U),m.fromBufferAttribute(s,z),h.sub(c),u.sub(c),p.sub(d),m.sub(d);let V=1/(p.x*m.y-m.x*p.y);isFinite(V)&&(g.copy(h).multiplyScalar(m.y).addScaledVector(u,-p.y).multiplyScalar(V),f.copy(u).multiplyScalar(p.x).addScaledVector(h,-m.x).multiplyScalar(V),o[L].add(g),o[U].add(g),o[z].add(g),l[L].add(f),l[U].add(f),l[z].add(f))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let L=0,U=v.length;L<U;++L){let z=v[L],V=z.start;for(let H=V,j=V+z.count;H<j;H+=3)_(e.getX(H+0),e.getX(H+1),e.getX(H+2))}let x=new T,y=new T,A=new T,M=new T;function C(L){A.fromBufferAttribute(i,L),M.copy(A);let U=o[L];x.copy(U),x.sub(A.multiplyScalar(A.dot(U))).normalize(),y.crossVectors(M,U);let z=y.dot(l[L])<0?-1:1;a.setXYZW(L,x.x,x.y,x.z,z)}for(let L=0,U=v.length;L<U;++L){let z=v[L],V=z.start;for(let H=V,j=V+z.count;H<j;H+=3)C(e.getX(H+0)),C(e.getX(H+1)),C(e.getX(H+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ot(new Float32Array(3*t.count),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let i=new T,s=new T,a=new T,o=new T,l=new T,c=new T,h=new T,u=new T;if(e)for(let d=0,p=e.count;d<p;d+=3){let m=e.getX(d+0),g=e.getX(d+1),f=e.getX(d+2);i.fromBufferAttribute(t,m),s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,f),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ut.fromBufferAttribute(e,t),ut.normalize(),e.setXYZ(t,ut.x,ut.y,ut.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),p=0,m=0;for(let g=0,f=l.length;g<f;g++){p=o.isInterleavedBufferAttribute?l[g]*o.data.stride+o.offset:l[g]*h;for(let _=0;_<h;_++)d[m++]=c[p++]}return new ot(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let o in i){let l=e(i[o],n);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){let d=e(c[h],n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Zh=new ye,oi=new gi,vs=new At,Kh=new T,xs=new T,ys=new T,Ms=new T,fo=new T,Ss=new T,Jh=new T,bs=new T,ze=class extends et{constructor(e=new Ge,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,s=n.length;i<s;i++){let a=n[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=i}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(s&&o){Ss.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],u=s[l];h!==0&&(fo.fromBufferAttribute(u,e),a?Ss.addScaledVector(fo,h):Ss.addScaledVector(fo.sub(t),h))}t.add(Ss)}return t}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;if(i!==void 0){if(n.boundingSphere===null&&n.computeBoundingSphere(),vs.copy(n.boundingSphere),vs.applyMatrix4(s),oi.copy(e.ray).recast(e.near),vs.containsPoint(oi.origin)===!1&&(oi.intersectSphere(vs,Kh)===null||oi.origin.distanceToSquared(Kh)>(e.far-e.near)**2))return;Zh.copy(s).invert(),oi.copy(e.ray).applyMatrix4(Zh),n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1||this._computeIntersections(e,t,oi)}}_computeIntersections(e,t,n){let i,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,g=d.length;m<g;m++){let f=d[m],_=a[f.materialIndex];for(let v=Math.max(f.start,p.start),x=Math.min(o.count,Math.min(f.start+f.count,p.start+p.count));v<x;v+=3)i=Ts(this,_,e,n,c,h,u,o.getX(v),o.getX(v+1),o.getX(v+2)),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=f.materialIndex,t.push(i))}else for(let m=Math.max(0,p.start),g=Math.min(o.count,p.start+p.count);m<g;m+=3)i=Ts(this,a,e,n,c,h,u,o.getX(m),o.getX(m+1),o.getX(m+2)),i&&(i.faceIndex=Math.floor(m/3),t.push(i));else if(l!==void 0)if(Array.isArray(a))for(let m=0,g=d.length;m<g;m++){let f=d[m],_=a[f.materialIndex];for(let v=Math.max(f.start,p.start),x=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));v<x;v+=3)i=Ts(this,_,e,n,c,h,u,v,v+1,v+2),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=f.materialIndex,t.push(i))}else for(let m=Math.max(0,p.start),g=Math.min(l.count,p.start+p.count);m<g;m+=3)i=Ts(this,a,e,n,c,h,u,m,m+1,m+2),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}};Xn=class r extends Ge{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};let o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,p=0;function m(g,f,_,v,x,y,A,M,C,L,U){let z=y/C,V=A/L,H=y/2,j=A/2,G=M/2,Y=C+1,K=L+1,ie=0,ne=0,fe=new T;for(let ve=0;ve<K;ve++){let ee=ve*V-j;for(let se=0;se<Y;se++){let ue=se*z-H;fe[g]=ue*v,fe[f]=ee*x,fe[_]=G,c.push(fe.x,fe.y,fe.z),fe[g]=0,fe[f]=0,fe[_]=M>0?1:-1,h.push(fe.x,fe.y,fe.z),u.push(se/C),u.push(1-ve/L),ie+=1}}for(let ve=0;ve<L;ve++)for(let ee=0;ee<C;ee++){let se=d+ee+Y*ve,ue=d+ee+Y*(ve+1),de=d+(ee+1)+Y*(ve+1),oe=d+(ee+1)+Y*ve;l.push(se,ue,oe),l.push(ue,de,oe),ne+=6}o.addGroup(p,ne,U),p+=ne,d+=ie}m("z","y","x",-1,-1,n,t,e,a,s,0),m("z","y","x",1,-1,n,t,-e,a,s,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,s,4),m("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new be(c,3)),this.setAttribute("normal",new be(h,3)),this.setAttribute("uv",new be(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};jp={clone:Qi,merge:bt},Gt=class extends Ot{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=(function(t){let n=[];for(let i=0;i<t.length;i++)n.push(t[i].clone());return n})(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Or=class extends et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ye,this.projectionMatrix=new ye,this.projectionMatrixInverse=new ye,this.coordinateSystem=Ji}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Bn=new T,$h=new te,Qh=new te,at=class extends Or{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*$i*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*Vi*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*$i*Math.atan(Math.tan(.5*Vi*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z)}getViewSize(e,t){return this.getViewBounds(e,$h,Qh),t.subVectors(Qh,$h)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*Vi*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Oi=-90,pl=class extends et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new at(Oi,1,e,t);i.layers=this.layers,this.add(i);let s=new at(Oi,1,e,t);s.layers=this.layers,this.add(s);let a=new at(Oi,1,e,t);a.layers=this.layers,this.add(a);let o=new at(Oi,1,e,t);o.layers=this.layers,this.add(o);let l=new at(Oi,1,e,t);l.layers=this.layers,this.add(l);let c=new at(Oi,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===Ji)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==qs)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},$s=class extends mt{constructor(e,t,n,i,s,a,o,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:Xi,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},fl=class extends yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new $s(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Nt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Xn(5,5,5),s=new Gt({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;let a=new ze(i,s),o=t.minFilter;return t.minFilter===vn&&(t.minFilter=Nt),new pl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}},mo=new T,qp=new T,Yp=new Ae,_n=class{constructor(e=new T(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=mo.subVectors(n,t).cross(qp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(mo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Yp.getNormalMatrix(e),i=this.coplanarPoint(mo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},li=new At,ws=new T,er=class{constructor(e=new _n,t=new _n,n=new _n,i=new _n,s=new _n,a=new _n){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){let n=this.planes,i=e.elements,s=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],p=i[8],m=i[9],g=i[10],f=i[11],_=i[12],v=i[13],x=i[14],y=i[15];if(n[0].setComponents(l-s,d-c,f-p,y-_).normalize(),n[1].setComponents(l+s,d+c,f+p,y+_).normalize(),n[2].setComponents(l+a,d+h,f+m,y+v).normalize(),n[3].setComponents(l-a,d-h,f-m,y-v).normalize(),n[4].setComponents(l-o,d-u,f-g,y-x).normalize(),t===Ji)n[5].setComponents(l+o,d+u,f+g,y+x).normalize();else{if(t!==qs)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(o,u,g,x).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(e){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(e.matrixWorld),this.intersectsSphere(li)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(ws.x=i.normal.x>0?e.max.x:e.min.x,ws.y=i.normal.y>0?e.max.y:e.min.y,ws.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ws)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};Br=class r extends Ge{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,p=[],m=[],g=[],f=[];for(let _=0;_<h;_++){let v=_*d-a;for(let x=0;x<c;x++){let y=x*u-s;m.push(y,-v,0),g.push(0,0,1),f.push(x/o),f.push(1-_/l)}}for(let _=0;_<l;_++)for(let v=0;v<o;v++){let x=v+c*_,y=v+c*(_+1),A=v+1+c*(_+1),M=v+1+c*_;p.push(x,y,M),p.push(y,A,M)}this.setIndex(p),this.setAttribute("position",new be(m,3)),this.setAttribute("normal",new be(g,3)),this.setAttribute("uv",new be(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Ce={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},ae={common:{diffuse:{value:new xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ae},alphaMap:{value:null},alphaMapTransform:{value:new Ae},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ae}},envmap:{envMap:{value:null},envMapRotation:{value:new Ae},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ae}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ae}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ae},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ae},normalScale:{value:new te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ae},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ae}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ae}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ae}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ae},alphaTest:{value:0},uvTransform:{value:new Ae}},sprite:{diffuse:{value:new xe(16777215)},opacity:{value:1},center:{value:new te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ae},alphaMap:{value:null},alphaMapTransform:{value:new Ae},alphaTest:{value:0}}},on={basic:{uniforms:bt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Ce.meshbasic_vert,fragmentShader:Ce.meshbasic_frag},lambert:{uniforms:bt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new xe(0)}}]),vertexShader:Ce.meshlambert_vert,fragmentShader:Ce.meshlambert_frag},phong:{uniforms:bt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new xe(0)},specular:{value:new xe(1118481)},shininess:{value:30}}]),vertexShader:Ce.meshphong_vert,fragmentShader:Ce.meshphong_frag},standard:{uniforms:bt([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag},toon:{uniforms:bt([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new xe(0)}}]),vertexShader:Ce.meshtoon_vert,fragmentShader:Ce.meshtoon_frag},matcap:{uniforms:bt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Ce.meshmatcap_vert,fragmentShader:Ce.meshmatcap_frag},points:{uniforms:bt([ae.points,ae.fog]),vertexShader:Ce.points_vert,fragmentShader:Ce.points_frag},dashed:{uniforms:bt([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ce.linedashed_vert,fragmentShader:Ce.linedashed_frag},depth:{uniforms:bt([ae.common,ae.displacementmap]),vertexShader:Ce.depth_vert,fragmentShader:Ce.depth_frag},normal:{uniforms:bt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Ce.meshnormal_vert,fragmentShader:Ce.meshnormal_frag},sprite:{uniforms:bt([ae.sprite,ae.fog]),vertexShader:Ce.sprite_vert,fragmentShader:Ce.sprite_frag},background:{uniforms:{uvTransform:{value:new Ae},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ce.background_vert,fragmentShader:Ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ae}},vertexShader:Ce.backgroundCube_vert,fragmentShader:Ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ce.cube_vert,fragmentShader:Ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ce.equirect_vert,fragmentShader:Ce.equirect_frag},distanceRGBA:{uniforms:bt([ae.common,ae.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ce.distanceRGBA_vert,fragmentShader:Ce.distanceRGBA_frag},shadow:{uniforms:bt([ae.lights,ae.fog,{color:{value:new xe(0)},opacity:{value:1}}]),vertexShader:Ce.shadow_vert,fragmentShader:Ce.shadow_frag}};on.physical={uniforms:bt([on.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ae},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ae},clearcoatNormalScale:{value:new te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ae},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ae},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ae},sheen:{value:0},sheenColor:{value:new xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ae},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ae},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ae},transmissionSamplerSize:{value:new te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ae},attenuationDistance:{value:0},attenuationColor:{value:new xe(0)},specularColor:{value:new xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ae},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ae},anisotropyVector:{value:new te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ae}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag};Es={r:0,b:0,g:0},ci=new ln,Kp=new ye;tr=class extends Or{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},eu=[.125,.215,.35,.446,.526,.582],xr=20,go=new tr,tu=new xe,_o=null,vo=0,xo=0,yo=!1,ui=(1+Math.sqrt(5))/2,Bi=1/ui,nu=[new T(-ui,Bi,0),new T(ui,Bi,0),new T(-Bi,0,ui),new T(Bi,0,ui),new T(0,ui,-Bi),new T(0,ui,Bi),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)],nr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){_o=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),xo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=su(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ru(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_o,vo,xo),this._renderer.xr.enabled=yo,e.scissorTest=!1,As(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xi||e.mapping===ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_o=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),xo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:$r,format:tn,colorSpace:xt,depthBuffer:!1},i=iu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=iu(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=(function(a){let o=[],l=[],c=[],h=a,u=a-4+1+eu.length;for(let d=0;d<u;d++){let p=Math.pow(2,h);l.push(p);let m=1/p;d>a-4?m=eu[d-a+4-1]:d===0&&(m=0),c.push(m);let g=1/(p-2),f=-g,_=1+g,v=[f,f,_,f,_,_,f,f,_,_,f,_],x=6,y=6,A=3,M=2,C=1,L=new Float32Array(A*y*x),U=new Float32Array(M*y*x),z=new Float32Array(C*y*x);for(let H=0;H<x;H++){let j=H%3*2/3-1,G=H>2?0:-1,Y=[j,G,0,j+2/3,G,0,j+2/3,G+1,0,j,G,0,j+2/3,G+1,0,j,G+1,0];L.set(Y,A*y*H),U.set(v,M*y*H);let K=[H,H,H,H,H,H];z.set(K,C*y*H)}let V=new Ge;V.setAttribute("position",new ot(L,A)),V.setAttribute("uv",new ot(U,M)),V.setAttribute("faceIndex",new ot(z,C)),o.push(V),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}})(s)),this._blurMaterial=(function(a,o,l){let c=new Float32Array(xr),h=new T(0,1,0);return new Gt({name:"SphericalGaussianBlur",defines:{n:xr,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:_c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})})(s,e,t)}return i}_compileMaterial(e){let t=new ze(this._lodPlanes[0],e);this._renderer.compile(t,go)}_sceneToCubeUV(e,t,n,i){let s=new at(90,1,t,n),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(tu),l.toneMapping=0,l.autoClear=!1;let u=new Rt({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),d=new ze(new Xn,u),p=!1,m=e.background;m?m.isColor&&(u.color.copy(m),e.background=null,p=!0):(u.color.copy(tu),p=!0);for(let g=0;g<6;g++){let f=g%3;f===0?(s.up.set(0,a[g],0),s.lookAt(o[g],0,0)):f===1?(s.up.set(0,0,a[g]),s.lookAt(0,o[g],0)):(s.up.set(0,a[g],0),s.lookAt(0,0,o[g]));let _=this._cubeSize;As(i,f*_,g>2?_:0,_,_),l.setRenderTarget(i),p&&l.render(d,s),l.render(e,s)}d.geometry.dispose(),d.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Xi||e.mapping===ji;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=su()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ru());let s=i?this._cubemapMaterial:this._equirectMaterial,a=new ze(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;As(t,0,0,3*o,2*o),n.setRenderTarget(t),n.render(a,go)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let s=1;s<i;s++){let a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=nu[(i-s-1)%nu.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,i,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new ze(this._lodPlanes[i],c),u=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/39,m=s/p,g=isFinite(s)?1+Math.floor(3*m):xr;g>xr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to 20`);let f=[],_=0;for(let y=0;y<xr;++y){let A=y/m,M=Math.exp(-A*A/2);f.push(M),y===0?_+=M:y<g&&(_+=2*M)}for(let y=0;y<f.length;y++)f[y]=f[y]/_;u.envMap.value=e.texture,u.samples.value=g,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:v}=this;u.dTheta.value=p,u.mipInt.value=v-n;let x=this._sizeLods[i];As(t,3*x*(i>v-4?i-v+4:0),4*(this._cubeSize-x),3*x,2*x),l.setRenderTarget(t),l.render(h,go)}};Qs=class extends mt{constructor(e,t,n,i,s,a,o,l,c,h=1026){if(h!==Dr&&h!==Yi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Dr&&(n=mi),n===void 0&&h===Yi&&(n=qi),super(null,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:wt,this.minFilter=l!==void 0?l:wt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},fd=new mt,au=new Qs(1,1),md=new Zs,gd=new dl,_d=new $s,ou=[],lu=[],cu=new Float32Array(16),hu=new Float32Array(9),uu=new Float32Array(4);ml=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=(function(i){switch(i){case 5126:return uf;case 35664:return df;case 35665:return pf;case 35666:return ff;case 35674:return mf;case 35675:return gf;case 35676:return _f;case 5124:case 35670:return vf;case 35667:case 35671:return xf;case 35668:case 35672:return yf;case 35669:case 35673:return Mf;case 5125:return Sf;case 36294:return bf;case 36295:return Tf;case 36296:return wf;case 35678:case 36198:case 36298:case 36306:case 35682:return Ef;case 35679:case 36299:case 36307:return Af;case 35680:case 36300:case 36308:case 36293:return Rf;case 36289:case 36303:case 36311:case 36292:return Cf}})(t.type)}},gl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=(function(i){switch(i){case 5126:return If;case 35664:return Pf;case 35665:return Lf;case 35666:return Df;case 35674:return Nf;case 35675:return Uf;case 35676:return Of;case 5124:case 35670:return Bf;case 35667:case 35671:return Ff;case 35668:case 35672:return zf;case 35669:case 35673:return kf;case 5125:return Hf;case 36294:return Vf;case 36295:return Gf;case 36296:return Wf;case 35678:case 36198:case 36298:case 36306:case 35682:return Xf;case 35679:case 36299:case 36307:return jf;case 35680:case 36300:case 36308:case 36293:return qf;case 36289:case 36303:case 36311:case 36292:return Yf}})(t.type)}},_l=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,a=i.length;s!==a;++s){let o=i[s];o.setValue(e,t[o.id],n)}}},Mo=/(\w+)(\])?(\[|\.)?/g;Wi=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let s=e.getActiveUniform(t,i);Zf(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,n,i){let s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let a=e[i];a.id in t&&n.push(a)}return n}};Kf=0,fu=new Ae;Rs=new T;em=/^[ \t]*#include +<([\w\d./]+)>/gm;tm=new Map;im=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;am=0,xl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new yl(e),t.set(e,n)),n}},yl=class{constructor(e){this.id=am++,this.code=e,this.usedTimes=0}};dm=0;Ml=class extends Ot{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Sl=class extends Ot{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};_m={[gp]:1,[vp]:6,[yp]:7,[xp]:5,[_p]:0,[Sp]:2,[bp]:4,[Mp]:3};bl=class extends at{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},ft=class extends et{constructor(){super(),this.isGroup=!0,this.type="Group"}},Mm={type:"move"},Rr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ft,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ft,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ft,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let g of e.hand.values()){let f=t.getJointPose(g,n),_=this._getHandJoint(c,g);f!==null&&(_.matrix.fromArray(f.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=f.radius),_.visible=f!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,m=.005;c.inputState.pinching&&d>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Mm)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ft;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Tl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let i=new mt;e.properties.get(i).__webglTexture=t.texture,t.depthNear==n.depthNear&&t.depthFar==n.depthFar||(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Gt({vertexShader:`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fragmentShader:`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ze(new Br(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},wl=class extends Wn{constructor(e,t){super();let n=this,i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,m=null,g=new Tl,f=t.getContextAttributes(),_=null,v=null,x=[],y=[],A=new te,M=null,C=new at;C.viewport=new He;let L=new at;L.viewport=new He;let U=[C,L],z=new bl,V=null,H=null;function j(ee){let se=y.indexOf(ee.inputSource);if(se===-1)return;let ue=x[se];ue!==void 0&&(ue.update(ee.inputSource,ee.frame,c||a),ue.dispatchEvent({type:ee.type,data:ee.inputSource}))}function G(){i.removeEventListener("select",j),i.removeEventListener("selectstart",j),i.removeEventListener("selectend",j),i.removeEventListener("squeeze",j),i.removeEventListener("squeezestart",j),i.removeEventListener("squeezeend",j),i.removeEventListener("end",G),i.removeEventListener("inputsourceschange",Y);for(let ee=0;ee<x.length;ee++){let se=y[ee];se!==null&&(y[ee]=null,x[ee].disconnect(se))}V=null,H=null,g.reset(),e.setRenderTarget(_),p=null,d=null,u=null,i=null,v=null,ve.stop(),n.isPresenting=!1,e.setPixelRatio(M),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}function Y(ee){for(let se=0;se<ee.removed.length;se++){let ue=ee.removed[se],de=y.indexOf(ue);de>=0&&(y[de]=null,x[de].disconnect(ue))}for(let se=0;se<ee.added.length;se++){let ue=ee.added[se],de=y.indexOf(ue);if(de===-1){for(let E=0;E<x.length;E++){if(E>=y.length){y.push(ue),de=E;break}if(y[E]===null){y[E]=ue,de=E;break}}if(de===-1)break}let oe=x[de];oe&&oe.connect(ue)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let se=x[ee];return se===void 0&&(se=new Rr,x[ee]=se),se.getTargetRaySpace()},this.getControllerGrip=function(ee){let se=x[ee];return se===void 0&&(se=new Rr,x[ee]=se),se.getGripSpace()},this.getHand=function(ee){let se=x[ee];return se===void 0&&(se=new Rr,x[ee]=se),se.getHandSpace()},this.setFramebufferScaleFactor=function(ee){s=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){o=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(ee){c=ee},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(ee){if(i=ee,i!==null){if(_=e.getRenderTarget(),i.addEventListener("select",j),i.addEventListener("selectstart",j),i.addEventListener("selectend",j),i.addEventListener("squeeze",j),i.addEventListener("squeezestart",j),i.addEventListener("squeezeend",j),i.addEventListener("end",G),i.addEventListener("inputsourceschange",Y),f.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(A),i.renderState.layers===void 0){let se={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,t,se),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new yn(p.framebufferWidth,p.framebufferHeight,{format:tn,type:Gn,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let se=null,ue=null,de=null;f.depth&&(de=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=f.stencil?Yi:Dr,ue=f.stencil?qi:mi);let oe={colorFormat:t.RGBA8,depthFormat:de,scaleFactor:s};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(oe),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new yn(d.textureWidth,d.textureHeight,{format:tn,type:Gn,depthTexture:new Qs(d.textureWidth,d.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),ve.setContext(i),ve.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};let K=new T,ie=new T;function ne(ee,se){se===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(se.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(i===null)return;let se=ee.near,ue=ee.far;g.texture!==null&&(g.depthNear>0&&(se=g.depthNear),g.depthFar>0&&(ue=g.depthFar)),z.near=L.near=C.near=se,z.far=L.far=C.far=ue,V===z.near&&H===z.far||(i.updateRenderState({depthNear:z.near,depthFar:z.far}),V=z.near,H=z.far),C.layers.mask=2|ee.layers.mask,L.layers.mask=4|ee.layers.mask,z.layers.mask=C.layers.mask|L.layers.mask;let de=ee.parent,oe=z.cameras;ne(z,de);for(let E=0;E<oe.length;E++)ne(oe[E],de);oe.length===2?(function(E,w,N){K.setFromMatrixPosition(w.matrixWorld),ie.setFromMatrixPosition(N.matrixWorld);let D=K.distanceTo(ie),R=w.projectionMatrix.elements,P=N.projectionMatrix.elements,S=R[14]/(R[10]-1),I=R[14]/(R[10]+1),B=(R[9]+1)/R[5],$=(R[9]-1)/R[5],O=(R[8]-1)/R[0],Z=(P[8]+1)/P[0],q=S*O,Q=S*Z,ce=D/(-O+Z),le=ce*-O;if(w.matrixWorld.decompose(E.position,E.quaternion,E.scale),E.translateX(le),E.translateZ(ce),E.matrixWorld.compose(E.position,E.quaternion,E.scale),E.matrixWorldInverse.copy(E.matrixWorld).invert(),R[10]===-1)E.projectionMatrix.copy(w.projectionMatrix),E.projectionMatrixInverse.copy(w.projectionMatrixInverse);else{let ge=S+ce,Te=I+ce,Fe=q-le,Pe=Q+(D-le),_e=B*I/Te*ge,ke=$*I/Te*ge;E.projectionMatrix.makePerspective(Fe,Pe,_e,ke,ge,Te),E.projectionMatrixInverse.copy(E.projectionMatrix).invert()}})(z,C,L):z.projectionMatrix.copy(C.projectionMatrix),(function(E,w,N){N===null?E.matrix.copy(w.matrixWorld):(E.matrix.copy(N.matrixWorld),E.matrix.invert(),E.matrix.multiply(w.matrixWorld)),E.matrix.decompose(E.position,E.quaternion,E.scale),E.updateMatrixWorld(!0),E.projectionMatrix.copy(w.projectionMatrix),E.projectionMatrixInverse.copy(w.projectionMatrixInverse),E.isPerspectiveCamera&&(E.fov=2*$i*Math.atan(1/E.projectionMatrix.elements[5]),E.zoom=1)})(ee,z,de)},this.getCamera=function(){return z},this.getFoveation=function(){if(d!==null||p!==null)return l},this.setFoveation=function(ee){l=ee,d!==null&&(d.fixedFoveation=ee),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=ee)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(z)};let fe=null,ve=new pd;ve.setAnimationLoop((function(ee,se){if(h=se.getViewerPose(c||a),m=se,h!==null){let ue=h.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let de=!1;ue.length!==z.cameras.length&&(z.cameras.length=0,de=!0);for(let E=0;E<ue.length;E++){let w=ue[E],N=null;if(p!==null)N=p.getViewport(w);else{let R=u.getViewSubImage(d,w);N=R.viewport,E===0&&(e.setRenderTargetTextures(v,R.colorTexture,d.ignoreDepthValues?void 0:R.depthStencilTexture),e.setRenderTarget(v))}let D=U[E];D===void 0&&(D=new at,D.layers.enable(E),D.viewport=new He,U[E]=D),D.matrix.fromArray(w.transform.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale),D.projectionMatrix.fromArray(w.projectionMatrix),D.projectionMatrixInverse.copy(D.projectionMatrix).invert(),D.viewport.set(N.x,N.y,N.width,N.height),E===0&&(z.matrix.copy(D.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),de===!0&&z.cameras.push(D)}let oe=i.enabledFeatures;if(oe&&oe.includes("depth-sensing")){let E=u.getDepthInformation(ue[0]);E&&E.isValid&&E.texture&&g.init(e,E,i.renderState)}}for(let ue=0;ue<x.length;ue++){let de=y[ue],oe=x[ue];de!==null&&oe!==void 0&&oe.update(de,se,c||a)}fe&&fe(ee,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),m=null})),this.setAnimationLoop=function(ee){fe=ee},this.dispose=function(){}}},hi=new ln,Sm=new ye;ea=class{constructor(e={}){let{canvas:t=Dp(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e,p;if(this.isWebGLRenderer=!0,n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let m=new Uint32Array(4),g=new Int32Array(4),f=null,_=null,v=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=it,this.toneMapping=0,this.toneMappingExposure=1;let y=this,A=!1,M=0,C=0,L=null,U=-1,z=null,V=new He,H=new He,j=null,G=new xe(0),Y=0,K=t.width,ie=t.height,ne=1,fe=null,ve=null,ee=new He(0,0,K,ie),se=new He(0,0,K,ie),ue=!1,de=new er,oe=!1,E=!1,w=new ye,N=new ye,D=new T,R=new He,P={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},S=!1;function I(){return L===null?ne:1}let B,$,O,Z,q,Q,ce,le,ge,Te,Fe,Pe,_e,ke,je,Je,pe,Ne,Xe,Si,as,jt,sn,ti,F=n;function dr(b,k){return t.getContext(b,k)}try{let b={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",rh,!1),t.addEventListener("webglcontextrestored",sh,!1),t.addEventListener("webglcontextcreationerror",ah,!1),F===null){let k="webgl2";if(F=dr(k,b),F===null)throw dr(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}function ih(){B=new sf(F),B.init(),jt=new ym(F,B),$=new ef(F,B,e,jt),O=new vm(F,B),$.reverseDepthBuffer&&d&&O.buffers.depth.setReversed(!0),Z=new lf(F),q=new lm,Q=new xm(F,B,O,q,$,jt,Z),ce=new nf(y),le=new rf(y),ge=new Zp(F),sn=new $p(F,ge),Te=new af(F,ge,Z,sn),Fe=new hf(F,Te,ge,Z),Xe=new cf(F,$,Q),Je=new tf(q),Pe=new om(y,ce,le,B,$,sn,Je),_e=new bm(y,q),ke=new hm,je=new mm(B),Ne=new Jp(y,ce,le,O,Fe,p,l),pe=new gm(y,Fe,$),ti=new Tm(F,Z,$,O),Si=new Qp(F,B,Z),as=new of(F,B,Z),Z.programs=Pe.programs,y.capabilities=$,y.extensions=B,y.properties=q,y.renderLists=ke,y.shadowMap=pe,y.state=O,y.info=Z}ih();let ht=new wl(y,F);function rh(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function sh(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let b=Z.autoReset,k=pe.enabled,X=pe.autoUpdate,J=pe.needsUpdate,W=pe.type;ih(),Z.autoReset=b,pe.enabled=k,pe.autoUpdate=X,pe.needsUpdate=J,pe.type=W}function ah(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function oh(b){let k=b.target;k.removeEventListener("dispose",oh),(function(X){(function(J){let W=q.get(J).programs;W!==void 0&&(W.forEach((function(re){Pe.releaseProgram(re)})),J.isShaderMaterial&&Pe.releaseShaderCache(J))})(X),q.remove(X)})(k)}function lh(b,k,X){b.transparent===!0&&b.side===2&&b.forceSinglePass===!1?(b.side=1,b.needsUpdate=!0,ls(b,k,X),b.side=0,b.needsUpdate=!0,ls(b,k,X),b.side=2):ls(b,k,X)}this.xr=ht,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let b=B.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=B.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(b){b!==void 0&&(ne=b,this.setSize(K,ie,!1))},this.getSize=function(b){return b.set(K,ie)},this.setSize=function(b,k,X=!0){ht.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(K=b,ie=k,t.width=Math.floor(b*ne),t.height=Math.floor(k*ne),X===!0&&(t.style.width=b+"px",t.style.height=k+"px"),this.setViewport(0,0,b,k))},this.getDrawingBufferSize=function(b){return b.set(K*ne,ie*ne).floor()},this.setDrawingBufferSize=function(b,k,X){K=b,ie=k,ne=X,t.width=Math.floor(b*X),t.height=Math.floor(k*X),this.setViewport(0,0,b,k)},this.getCurrentViewport=function(b){return b.copy(V)},this.getViewport=function(b){return b.copy(ee)},this.setViewport=function(b,k,X,J){b.isVector4?ee.set(b.x,b.y,b.z,b.w):ee.set(b,k,X,J),O.viewport(V.copy(ee).multiplyScalar(ne).round())},this.getScissor=function(b){return b.copy(se)},this.setScissor=function(b,k,X,J){b.isVector4?se.set(b.x,b.y,b.z,b.w):se.set(b,k,X,J),O.scissor(H.copy(se).multiplyScalar(ne).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(b){O.setScissorTest(ue=b)},this.setOpaqueSort=function(b){fe=b},this.setTransparentSort=function(b){ve=b},this.getClearColor=function(b){return b.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor.apply(Ne,arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha.apply(Ne,arguments)},this.clear=function(b=!0,k=!0,X=!0){let J=0;if(b){let W=!1;if(L!==null){let re=L.texture.format;W=re===gc||re===mc||re===fc}if(W){let re=L.texture.type,he=re===Gn||re===mi||re===Lr||re===qi||re===uc||re===dc,me=Ne.getClearColor(),Me=Ne.getClearAlpha(),Ee=me.r,Re=me.g,Se=me.b;he?(m[0]=Ee,m[1]=Re,m[2]=Se,m[3]=Me,F.clearBufferuiv(F.COLOR,0,m)):(g[0]=Ee,g[1]=Re,g[2]=Se,g[3]=Me,F.clearBufferiv(F.COLOR,0,g))}else J|=F.COLOR_BUFFER_BIT}k&&(J|=F.DEPTH_BUFFER_BIT),X&&(J|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",rh,!1),t.removeEventListener("webglcontextrestored",sh,!1),t.removeEventListener("webglcontextcreationerror",ah,!1),ke.dispose(),je.dispose(),q.dispose(),ce.dispose(),le.dispose(),Fe.dispose(),sn.dispose(),ti.dispose(),Pe.dispose(),ht.dispose(),ht.removeEventListener("sessionstart",ch),ht.removeEventListener("sessionend",hh),ni.stop()},this.renderBufferDirect=function(b,k,X,J,W,re){k===null&&(k=P);let he=W.isMesh&&W.matrixWorld.determinant()<0,me=(function(Be,Mt,dt,Ie,we){Mt.isScene!==!0&&(Mt=P),Q.resetTextureUnits();let qt=Mt.fog,ka=Ie.isMeshStandardMaterial?Mt.environment:null,pr=L===null?y.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:xt,bi=(Ie.isMeshStandardMaterial?le:ce).get(Ie.envMap||ka),Ha=Ie.vertexColors===!0&&!!dt.attributes.color&&dt.attributes.color.itemSize===4,Va=!!dt.attributes.tangent&&(!!Ie.normalMap||Ie.anisotropy>0),Ga=!!dt.morphAttributes.position,In=!!dt.morphAttributes.normal,Zd=!!dt.morphAttributes.color,gh=0;Ie.toneMapped&&(L!==null&&L.isXRRenderTarget!==!0||(gh=y.toneMapping));let _h=dt.morphAttributes.position||dt.morphAttributes.normal||dt.morphAttributes.color,Kd=_h!==void 0?_h.length:0,Ue=q.get(Ie),Jd=_.state.lights;if(oe===!0&&(E===!0||Be!==z)){let zt=Be===z&&Ie.id===U;Je.setState(Ie,Be,zt)}let Yt=!1;Ie.version===Ue.__version?Ue.needsLights&&Ue.lightsStateVersion!==Jd.state.version||Ue.outputColorSpace!==pr||we.isBatchedMesh&&Ue.batching===!1?Yt=!0:we.isBatchedMesh||Ue.batching!==!0?we.isBatchedMesh&&Ue.batchingColor===!0&&we.colorTexture===null||we.isBatchedMesh&&Ue.batchingColor===!1&&we.colorTexture!==null||we.isInstancedMesh&&Ue.instancing===!1?Yt=!0:we.isInstancedMesh||Ue.instancing!==!0?we.isSkinnedMesh&&Ue.skinning===!1?Yt=!0:we.isSkinnedMesh||Ue.skinning!==!0?we.isInstancedMesh&&Ue.instancingColor===!0&&we.instanceColor===null||we.isInstancedMesh&&Ue.instancingColor===!1&&we.instanceColor!==null||we.isInstancedMesh&&Ue.instancingMorph===!0&&we.morphTexture===null||we.isInstancedMesh&&Ue.instancingMorph===!1&&we.morphTexture!==null||Ue.envMap!==bi||Ie.fog===!0&&Ue.fog!==qt?Yt=!0:Ue.numClippingPlanes===void 0||Ue.numClippingPlanes===Je.numPlanes&&Ue.numIntersection===Je.numIntersection?(Ue.vertexAlphas!==Ha||Ue.vertexTangents!==Va||Ue.morphTargets!==Ga||Ue.morphNormals!==In||Ue.morphColors!==Zd||Ue.toneMapping!==gh||Ue.morphTargetsCount!==Kd)&&(Yt=!0):Yt=!0:Yt=!0:Yt=!0:Yt=!0:(Yt=!0,Ue.__version=Ie.version);let ii=Ue.currentProgram;Yt===!0&&(ii=ls(Ie,Mt,we));let vh=!1,fr=!1,Wa=!1,tt=ii.getUniforms(),Pn=Ue.uniforms;if(O.useProgram(ii.program)&&(vh=!0,fr=!0,Wa=!0),Ie.id!==U&&(U=Ie.id,fr=!0),vh||z!==Be){O.buffers.depth.getReversed()?(w.copy(Be.projectionMatrix),(function(ri){let Ke=ri.elements;Ke[2]=.5*Ke[2]+.5*Ke[3],Ke[6]=.5*Ke[6]+.5*Ke[7],Ke[10]=.5*Ke[10]+.5*Ke[11],Ke[14]=.5*Ke[14]+.5*Ke[15]})(w),(function(ri){let Ke=ri.elements;Ke[11]===-1?(Ke[10]=-Ke[10]-1,Ke[14]=-Ke[14]):(Ke[10]=-Ke[10],Ke[14]=1-Ke[14])})(w),tt.setValue(F,"projectionMatrix",w)):tt.setValue(F,"projectionMatrix",Be.projectionMatrix),tt.setValue(F,"viewMatrix",Be.matrixWorldInverse);let zt=tt.map.cameraPosition;zt!==void 0&&zt.setValue(F,D.setFromMatrixPosition(Be.matrixWorld)),$.logarithmicDepthBuffer&&tt.setValue(F,"logDepthBufFC",2/(Math.log(Be.far+1)/Math.LN2)),(Ie.isMeshPhongMaterial||Ie.isMeshToonMaterial||Ie.isMeshLambertMaterial||Ie.isMeshBasicMaterial||Ie.isMeshStandardMaterial||Ie.isShaderMaterial)&&tt.setValue(F,"isOrthographic",Be.isOrthographicCamera===!0),z!==Be&&(z=Be,fr=!0,Wa=!0)}if(we.isSkinnedMesh){tt.setOptional(F,we,"bindMatrix"),tt.setOptional(F,we,"bindMatrixInverse");let zt=we.skeleton;zt&&(zt.boneTexture===null&&zt.computeBoneTexture(),tt.setValue(F,"boneTexture",zt.boneTexture,Q))}we.isBatchedMesh&&(tt.setOptional(F,we,"batchingTexture"),tt.setValue(F,"batchingTexture",we._matricesTexture,Q),tt.setOptional(F,we,"batchingIdTexture"),tt.setValue(F,"batchingIdTexture",we._indirectTexture,Q),tt.setOptional(F,we,"batchingColorTexture"),we._colorsTexture!==null&&tt.setValue(F,"batchingColorTexture",we._colorsTexture,Q));let Xa=dt.morphAttributes;Xa.position===void 0&&Xa.normal===void 0&&Xa.color===void 0||Xe.update(we,dt,ii),(fr||Ue.receiveShadow!==we.receiveShadow)&&(Ue.receiveShadow=we.receiveShadow,tt.setValue(F,"receiveShadow",we.receiveShadow)),Ie.isMeshGouraudMaterial&&Ie.envMap!==null&&(Pn.envMap.value=bi,Pn.flipEnvMap.value=bi.isCubeTexture&&bi.isRenderTargetTexture===!1?-1:1),Ie.isMeshStandardMaterial&&Ie.envMap===null&&Mt.environment!==null&&(Pn.envMapIntensity.value=Mt.environmentIntensity),fr&&(tt.setValue(F,"toneMappingExposure",y.toneMappingExposure),Ue.needsLights&&(Zt=Wa,(an=Pn).ambientLightColor.needsUpdate=Zt,an.lightProbe.needsUpdate=Zt,an.directionalLights.needsUpdate=Zt,an.directionalLightShadows.needsUpdate=Zt,an.pointLights.needsUpdate=Zt,an.pointLightShadows.needsUpdate=Zt,an.spotLights.needsUpdate=Zt,an.spotLightShadows.needsUpdate=Zt,an.rectAreaLights.needsUpdate=Zt,an.hemisphereLights.needsUpdate=Zt),qt&&Ie.fog===!0&&_e.refreshFogUniforms(Pn,qt),_e.refreshMaterialUniforms(Pn,Ie,ne,ie,_.state.transmissionRenderTarget[Be.id]),Wi.upload(F,fh(Ue),Pn,Q));var an,Zt;if(Ie.isShaderMaterial&&Ie.uniformsNeedUpdate===!0&&(Wi.upload(F,fh(Ue),Pn,Q),Ie.uniformsNeedUpdate=!1),Ie.isSpriteMaterial&&tt.setValue(F,"center",we.center),tt.setValue(F,"modelViewMatrix",we.modelViewMatrix),tt.setValue(F,"normalMatrix",we.normalMatrix),tt.setValue(F,"modelMatrix",we.matrixWorld),Ie.isShaderMaterial||Ie.isRawShaderMaterial){let zt=Ie.uniformsGroups;for(let ri=0,Ke=zt.length;ri<Ke;ri++){let xh=zt[ri];ti.update(xh,ii),ti.bind(xh,ii)}}return ii})(b,k,X,J,W);O.setMaterial(J,he);let Me=X.index,Ee=1;if(J.wireframe===!0){if(Me=Te.getWireframeAttribute(X),Me===void 0)return;Ee=2}let Re=X.drawRange,Se=X.attributes.position,Le=Re.start*Ee,Qe=(Re.start+Re.count)*Ee;re!==null&&(Le=Math.max(Le,re.start*Ee),Qe=Math.min(Qe,(re.start+re.count)*Ee)),Me!==null?(Le=Math.max(Le,0),Qe=Math.min(Qe,Me.count)):Se!=null&&(Le=Math.max(Le,0),Qe=Math.min(Qe,Se.count));let qe=Qe-Le;if(qe<0||qe===1/0)return;let rt;sn.setup(W,J,me,X,Me);let Ze=Si;if(Me!==null&&(rt=ge.get(Me),Ze=as,Ze.setIndex(rt)),W.isMesh)J.wireframe===!0?(O.setLineWidth(J.wireframeLinewidth*I()),Ze.setMode(F.LINES)):Ze.setMode(F.TRIANGLES);else if(W.isLine){let Be=J.linewidth;Be===void 0&&(Be=1),O.setLineWidth(Be*I()),W.isLineSegments?Ze.setMode(F.LINES):W.isLineLoop?Ze.setMode(F.LINE_LOOP):Ze.setMode(F.LINE_STRIP)}else W.isPoints?Ze.setMode(F.POINTS):W.isSprite&&Ze.setMode(F.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Ze.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(B.get("WEBGL_multi_draw"))Ze.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let Be=W._multiDrawStarts,Mt=W._multiDrawCounts,dt=W._multiDrawCount,Ie=Me?ge.get(Me).bytesPerElement:1,we=q.get(J).currentProgram.getUniforms();for(let qt=0;qt<dt;qt++)we.setValue(F,"_gl_DrawID",qt),Ze.render(Be[qt]/Ie,Mt[qt])}else if(W.isInstancedMesh)Ze.renderInstances(Le,qe,W.count);else if(X.isInstancedBufferGeometry){let Be=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Mt=Math.min(X.instanceCount,Be);Ze.renderInstances(Le,qe,Mt)}else Ze.render(Le,qe)},this.compile=function(b,k,X=null){X===null&&(X=b),_=je.get(X),_.init(k),x.push(_),X.traverseVisible((function(W){W.isLight&&W.layers.test(k.layers)&&(_.pushLight(W),W.castShadow&&_.pushShadow(W))})),b!==X&&b.traverseVisible((function(W){W.isLight&&W.layers.test(k.layers)&&(_.pushLight(W),W.castShadow&&_.pushShadow(W))})),_.setupLights();let J=new Set;return b.traverse((function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let re=W.material;if(re)if(Array.isArray(re))for(let he=0;he<re.length;he++){let me=re[he];lh(me,X,W),J.add(me)}else lh(re,X,W),J.add(re)})),x.pop(),_=null,J},this.compileAsync=function(b,k,X=null){let J=this.compile(b,k,X);return new Promise((W=>{function re(){J.forEach((function(he){q.get(he).currentProgram.isReady()&&J.delete(he)})),J.size!==0?setTimeout(re,10):W(b)}B.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)}))};let Fa=null;function ch(){ni.stop()}function hh(){ni.start()}let ni=new pd;function za(b,k,X,J){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)X=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLight)_.pushLight(b),b.castShadow&&_.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||de.intersectsSprite(b)){J&&R.setFromMatrixPosition(b.matrixWorld).applyMatrix4(N);let re=Fe.update(b),he=b.material;he.visible&&f.push(b,re,he,X,R.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||de.intersectsObject(b))){let re=Fe.update(b),he=b.material;if(J&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),R.copy(b.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),R.copy(re.boundingSphere.center)),R.applyMatrix4(b.matrixWorld).applyMatrix4(N)),Array.isArray(he)){let me=re.groups;for(let Me=0,Ee=me.length;Me<Ee;Me++){let Re=me[Me],Se=he[Re.materialIndex];Se&&Se.visible&&f.push(b,re,Se,X,R.z,Re)}}else he.visible&&f.push(b,re,he,X,R.z,null)}}let W=b.children;for(let re=0,he=W.length;re<he;re++)za(W[re],k,X,J)}function uh(b,k,X,J){let W=b.opaque,re=b.transmissive,he=b.transparent;_.setupLightsView(X),oe===!0&&Je.setGlobalState(y.clippingPlanes,X),J&&O.viewport(V.copy(J)),W.length>0&&os(W,k,X),re.length>0&&os(re,k,X),he.length>0&&os(he,k,X),O.buffers.depth.setTest(!0),O.buffers.depth.setMask(!0),O.buffers.color.setMask(!0),O.setPolygonOffset(!1)}function dh(b,k,X,J){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;_.state.transmissionRenderTarget[J.id]===void 0&&(_.state.transmissionRenderTarget[J.id]=new yn(1,1,{generateMipmaps:!0,type:B.has("EXT_color_buffer_half_float")||B.has("EXT_color_buffer_float")?$r:Gn,minFilter:vn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Oe.workingColorSpace}));let W=_.state.transmissionRenderTarget[J.id],re=J.viewport||V;W.setSize(re.z,re.w);let he=y.getRenderTarget();y.setRenderTarget(W),y.getClearColor(G),Y=y.getClearAlpha(),Y<1&&y.setClearColor(16777215,.5),y.clear(),S&&Ne.render(X);let me=y.toneMapping;y.toneMapping=0;let Me=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),_.setupLightsView(J),oe===!0&&Je.setGlobalState(y.clippingPlanes,J),os(b,X,J),Q.updateMultisampleRenderTarget(W),Q.updateRenderTargetMipmap(W),B.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let Re=0,Se=k.length;Re<Se;Re++){let Le=k[Re],Qe=Le.object,qe=Le.geometry,rt=Le.material,Ze=Le.group;if(rt.side===2&&Qe.layers.test(J.layers)){let Be=rt.side;rt.side=1,rt.needsUpdate=!0,ph(Qe,X,J,qe,rt,Ze),rt.side=Be,rt.needsUpdate=!0,Ee=!0}}Ee===!0&&(Q.updateMultisampleRenderTarget(W),Q.updateRenderTargetMipmap(W))}y.setRenderTarget(he),y.setClearColor(G,Y),Me!==void 0&&(J.viewport=Me),y.toneMapping=me}function os(b,k,X){let J=k.isScene===!0?k.overrideMaterial:null;for(let W=0,re=b.length;W<re;W++){let he=b[W],me=he.object,Me=he.geometry,Ee=J===null?he.material:J,Re=he.group;me.layers.test(X.layers)&&ph(me,k,X,Me,Ee,Re)}}function ph(b,k,X,J,W,re){b.onBeforeRender(y,k,X,J,W,re),b.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),W.onBeforeRender(y,k,X,J,b,re),W.transparent===!0&&W.side===2&&W.forceSinglePass===!1?(W.side=1,W.needsUpdate=!0,y.renderBufferDirect(X,k,J,W,b,re),W.side=0,W.needsUpdate=!0,y.renderBufferDirect(X,k,J,W,b,re),W.side=2):y.renderBufferDirect(X,k,J,W,b,re),b.onAfterRender(y,k,X,J,W,re)}function ls(b,k,X){k.isScene!==!0&&(k=P);let J=q.get(b),W=_.state.lights,re=_.state.shadowsArray,he=W.state.version,me=Pe.getParameters(b,W.state,re,k,X),Me=Pe.getProgramCacheKey(me),Ee=J.programs;J.environment=b.isMeshStandardMaterial?k.environment:null,J.fog=k.fog,J.envMap=(b.isMeshStandardMaterial?le:ce).get(b.envMap||J.environment),J.envMapRotation=J.environment!==null&&b.envMap===null?k.environmentRotation:b.envMapRotation,Ee===void 0&&(b.addEventListener("dispose",oh),Ee=new Map,J.programs=Ee);let Re=Ee.get(Me);if(Re!==void 0){if(J.currentProgram===Re&&J.lightsStateVersion===he)return mh(b,me),Re}else me.uniforms=Pe.getUniforms(b),b.onBeforeCompile(me,y),Re=Pe.acquireProgram(me,Me),Ee.set(Me,Re),J.uniforms=me.uniforms;let Se=J.uniforms;return(b.isShaderMaterial||b.isRawShaderMaterial)&&b.clipping!==!0||(Se.clippingPlanes=Je.uniform),mh(b,me),J.needsLights=(function(Le){return Le.isMeshLambertMaterial||Le.isMeshToonMaterial||Le.isMeshPhongMaterial||Le.isMeshStandardMaterial||Le.isShadowMaterial||Le.isShaderMaterial&&Le.lights===!0})(b),J.lightsStateVersion=he,J.needsLights&&(Se.ambientLightColor.value=W.state.ambient,Se.lightProbe.value=W.state.probe,Se.directionalLights.value=W.state.directional,Se.directionalLightShadows.value=W.state.directionalShadow,Se.spotLights.value=W.state.spot,Se.spotLightShadows.value=W.state.spotShadow,Se.rectAreaLights.value=W.state.rectArea,Se.ltc_1.value=W.state.rectAreaLTC1,Se.ltc_2.value=W.state.rectAreaLTC2,Se.pointLights.value=W.state.point,Se.pointLightShadows.value=W.state.pointShadow,Se.hemisphereLights.value=W.state.hemi,Se.directionalShadowMap.value=W.state.directionalShadowMap,Se.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Se.spotShadowMap.value=W.state.spotShadowMap,Se.spotLightMatrix.value=W.state.spotLightMatrix,Se.spotLightMap.value=W.state.spotLightMap,Se.pointShadowMap.value=W.state.pointShadowMap,Se.pointShadowMatrix.value=W.state.pointShadowMatrix),J.currentProgram=Re,J.uniformsList=null,Re}function fh(b){if(b.uniformsList===null){let k=b.currentProgram.getUniforms();b.uniformsList=Wi.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function mh(b,k){let X=q.get(b);X.outputColorSpace=k.outputColorSpace,X.batching=k.batching,X.batchingColor=k.batchingColor,X.instancing=k.instancing,X.instancingColor=k.instancingColor,X.instancingMorph=k.instancingMorph,X.skinning=k.skinning,X.morphTargets=k.morphTargets,X.morphNormals=k.morphNormals,X.morphColors=k.morphColors,X.morphTargetsCount=k.morphTargetsCount,X.numClippingPlanes=k.numClippingPlanes,X.numIntersection=k.numClipIntersection,X.vertexAlphas=k.vertexAlphas,X.vertexTangents=k.vertexTangents,X.toneMapping=k.toneMapping}ni.setAnimationLoop((function(b){Fa&&Fa(b)})),typeof self<"u"&&ni.setContext(self),this.setAnimationLoop=function(b){Fa=b,ht.setAnimationLoop(b),b===null?ni.stop():ni.start()},ht.addEventListener("sessionstart",ch),ht.addEventListener("sessionend",hh),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(A===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ht.enabled===!0&&ht.isPresenting===!0&&(ht.cameraAutoUpdate===!0&&ht.updateCamera(k),k=ht.getCamera()),b.isScene===!0&&b.onBeforeRender(y,b,k,L),_=je.get(b,x.length),_.init(k),x.push(_),N.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),de.setFromProjectionMatrix(N),E=this.localClippingEnabled,oe=Je.init(this.clippingPlanes,E),f=ke.get(b,v.length),f.init(),v.push(f),ht.enabled===!0&&ht.isPresenting===!0){let re=y.xr.getDepthSensingMesh();re!==null&&za(re,k,-1/0,y.sortObjects)}za(b,k,0,y.sortObjects),f.finish(),y.sortObjects===!0&&f.sort(fe,ve),S=ht.enabled===!1||ht.isPresenting===!1||ht.hasDepthSensing()===!1,S&&Ne.addToRenderList(f,b),this.info.render.frame++,oe===!0&&Je.beginShadows();let X=_.state.shadowsArray;pe.render(X,b,k),oe===!0&&Je.endShadows(),this.info.autoReset===!0&&this.info.reset();let J=f.opaque,W=f.transmissive;if(_.setupLights(),k.isArrayCamera){let re=k.cameras;if(W.length>0)for(let he=0,me=re.length;he<me;he++)dh(J,W,b,re[he]);S&&Ne.render(b);for(let he=0,me=re.length;he<me;he++){let Me=re[he];uh(f,b,Me,Me.viewport)}}else W.length>0&&dh(J,W,b,k),S&&Ne.render(b),uh(f,b,k);L!==null&&(Q.updateMultisampleRenderTarget(L),Q.updateRenderTargetMipmap(L)),b.isScene===!0&&b.onAfterRender(y,b,k),sn.resetDefaultState(),U=-1,z=null,x.pop(),x.length>0?(_=x[x.length-1],oe===!0&&Je.setGlobalState(y.clippingPlanes,_.state.camera)):_=null,v.pop(),f=v.length>0?v[v.length-1]:null},this.getActiveCubeFace=function(){return M},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(b,k,X){q.get(b.texture).__webglTexture=k,q.get(b.depthTexture).__webglTexture=X;let J=q.get(b);J.__hasExternalTextures=!0,J.__autoAllocateDepthBuffer=X===void 0,J.__autoAllocateDepthBuffer||B.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,k){let X=q.get(b);X.__webglFramebuffer=k,X.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,X=0){L=b,M=k,C=X;let J=!0,W=null,re=!1,he=!1;if(b){let me=q.get(b);if(me.__useDefaultFramebuffer!==void 0)O.bindFramebuffer(F.FRAMEBUFFER,null),J=!1;else if(me.__webglFramebuffer===void 0)Q.setupRenderTarget(b);else if(me.__hasExternalTextures)Q.rebindTextures(b,q.get(b.texture).__webglTexture,q.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Re=b.depthTexture;if(me.__boundDepthTexture!==Re){if(Re!==null&&q.has(Re)&&(b.width!==Re.image.width||b.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Q.setupDepthRenderbuffer(b)}}let Me=b.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(he=!0);let Ee=q.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(W=Array.isArray(Ee[k])?Ee[k][X]:Ee[k],re=!0):W=b.samples>0&&Q.useMultisampledRTT(b)===!1?q.get(b).__webglMultisampledFramebuffer:Array.isArray(Ee)?Ee[X]:Ee,V.copy(b.viewport),H.copy(b.scissor),j=b.scissorTest}else V.copy(ee).multiplyScalar(ne).floor(),H.copy(se).multiplyScalar(ne).floor(),j=ue;if(O.bindFramebuffer(F.FRAMEBUFFER,W)&&J&&O.drawBuffers(b,W),O.viewport(V),O.scissor(H),O.setScissorTest(j),re){let me=q.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,me.__webglTexture,X)}else if(he){let me=q.get(b.texture),Me=k||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,me.__webglTexture,X||0,Me)}U=-1},this.readRenderTargetPixels=function(b,k,X,J,W,re,he){if(!b||!b.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=q.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&he!==void 0&&(me=me[he]),me){O.bindFramebuffer(F.FRAMEBUFFER,me);try{let Me=b.texture,Ee=Me.format,Re=Me.type;if(!$.textureFormatReadable(Ee))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!$.textureTypeReadable(Re))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");k>=0&&k<=b.width-J&&X>=0&&X<=b.height-W&&F.readPixels(k,X,J,W,jt.convert(Ee),jt.convert(Re),re)}finally{let Me=L!==null?q.get(L).__webglFramebuffer:null;O.bindFramebuffer(F.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(b,k,X,J,W,re,he){if(!b||!b.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=q.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&he!==void 0&&(me=me[he]),me){let Me=b.texture,Ee=Me.format,Re=Me.type;if(!$.textureFormatReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=b.width-J&&X>=0&&X<=b.height-W){O.bindFramebuffer(F.FRAMEBUFFER,me);let Se=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Se),F.bufferData(F.PIXEL_PACK_BUFFER,re.byteLength,F.STREAM_READ),F.readPixels(k,X,J,W,jt.convert(Ee),jt.convert(Re),0);let Le=L!==null?q.get(L).__webglFramebuffer:null;O.bindFramebuffer(F.FRAMEBUFFER,Le);let Qe=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await(function(qe,rt,Ze){return new Promise((function(Be,Mt){setTimeout((function dt(){switch(qe.clientWaitSync(rt,qe.SYNC_FLUSH_COMMANDS_BIT,0)){case qe.WAIT_FAILED:Mt();break;case qe.TIMEOUT_EXPIRED:setTimeout(dt,Ze);break;default:Be()}}),Ze)}))})(F,Qe,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Se),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,re),F.deleteBuffer(Se),F.deleteSync(Qe),re}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,k=null,X=0){b.isTexture!==!0&&(wr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,b=arguments[1]);let J=Math.pow(2,-X),W=Math.floor(b.image.width*J),re=Math.floor(b.image.height*J),he=k!==null?k.x:0,me=k!==null?k.y:0;Q.setTexture2D(b,0),F.copyTexSubImage2D(F.TEXTURE_2D,X,0,0,he,me,W,re),O.unbindTexture()},this.copyTextureToTexture=function(b,k,X=null,J=null,W=0){let re,he,me,Me,Ee,Re,Se,Le,Qe;b.isTexture!==!0&&(wr("WebGLRenderer: copyTextureToTexture function signature has changed."),J=arguments[0]||null,b=arguments[1],k=arguments[2],W=arguments[3]||0,X=null);let qe=b.isCompressedTexture?b.mipmaps[W]:b.image;X!==null?(re=X.max.x-X.min.x,he=X.max.y-X.min.y,me=X.isBox3?X.max.z-X.min.z:1,Me=X.min.x,Ee=X.min.y,Re=X.isBox3?X.min.z:0):(re=qe.width,he=qe.height,me=qe.depth||1,Me=0,Ee=0,Re=0),J!==null?(Se=J.x,Le=J.y,Qe=J.z):(Se=0,Le=0,Qe=0);let rt=jt.convert(k.format),Ze=jt.convert(k.type),Be;k.isData3DTexture?(Q.setTexture3D(k,0),Be=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Q.setTexture2DArray(k,0),Be=F.TEXTURE_2D_ARRAY):(Q.setTexture2D(k,0),Be=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);let Mt=F.getParameter(F.UNPACK_ROW_LENGTH),dt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Ie=F.getParameter(F.UNPACK_SKIP_PIXELS),we=F.getParameter(F.UNPACK_SKIP_ROWS),qt=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,qe.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,qe.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Me),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ee),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Re);let ka=b.isDataArrayTexture||b.isData3DTexture,pr=k.isDataArrayTexture||k.isData3DTexture;if(b.isRenderTargetTexture||b.isDepthTexture){let bi=q.get(b),Ha=q.get(k),Va=q.get(bi.__renderTarget),Ga=q.get(Ha.__renderTarget);O.bindFramebuffer(F.READ_FRAMEBUFFER,Va.__webglFramebuffer),O.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ga.__webglFramebuffer);for(let In=0;In<me;In++)ka&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,q.get(b).__webglTexture,W,Re+In),b.isDepthTexture?(pr&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,q.get(k).__webglTexture,W,Qe+In),F.blitFramebuffer(Me,Ee,re,he,Se,Le,re,he,F.DEPTH_BUFFER_BIT,F.NEAREST)):pr?F.copyTexSubImage3D(Be,W,Se,Le,Qe+In,Me,Ee,re,he):F.copyTexSubImage2D(Be,W,Se,Le,Qe+In,Me,Ee,re,he);O.bindFramebuffer(F.READ_FRAMEBUFFER,null),O.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else pr?b.isDataTexture||b.isData3DTexture?F.texSubImage3D(Be,W,Se,Le,Qe,re,he,me,rt,Ze,qe.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(Be,W,Se,Le,Qe,re,he,me,rt,qe.data):F.texSubImage3D(Be,W,Se,Le,Qe,re,he,me,rt,Ze,qe):b.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,W,Se,Le,re,he,rt,Ze,qe.data):b.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,W,Se,Le,qe.width,qe.height,rt,qe.data):F.texSubImage2D(F.TEXTURE_2D,W,Se,Le,re,he,rt,Ze,qe);F.pixelStorei(F.UNPACK_ROW_LENGTH,Mt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,dt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ie),F.pixelStorei(F.UNPACK_SKIP_ROWS,we),F.pixelStorei(F.UNPACK_SKIP_IMAGES,qt),W===0&&k.generateMipmaps&&F.generateMipmap(Be),O.unbindTexture()},this.copyTextureToTexture3D=function(b,k,X=null,J=null,W=0){return b.isTexture!==!0&&(wr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,J=arguments[1]||null,b=arguments[2],k=arguments[3],W=arguments[4]||0),wr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,k,X,J,W)},this.initRenderTarget=function(b){q.get(b).__webglFramebuffer===void 0&&Q.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Q.setTextureCube(b,0):b.isData3DTexture?Q.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Q.setTexture2DArray(b,0):Q.setTexture2D(b,0),O.unbindTexture()},this.resetState=function(){M=0,C=0,L=null,O.reset(),sn.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Oe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Oe._getUnpackColorSpace()}},ir=class extends et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Fr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ll,this.updateRanges=[],this.version=0,this.uuid=Ht()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ht()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ht()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},St=new T,zr=class r{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Qt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ve(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ve(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ve(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ve(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ve(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Qt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Qt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Qt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Qt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ve(t,this.array),n=Ve(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ve(t,this.array),n=Ve(n,this.array),i=Ve(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ve(t,this.array),n=Ve(n,this.array),i=Ve(i,this.array),s=Ve(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new ot(new this.array.constructor(t),this.itemSize,this.normalized)}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},mg=new T,gg=new T,_g=new T,vg=new te,xg=new te,yg=new ye,Mg=new T,Sg=new T,bg=new T,Tg=new te,wg=new te,Eg=new te,Ag=new T,Rg=new T,Tu=new T,wu=new He,Eu=new He,wm=new T,Au=new ye,Cs=new T,So=new At,Ru=new ye,bo=new gi,ta=class extends ze{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Rh,this.bindMatrix=new ye,this.bindMatrixInverse=new ye,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Et),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Cs),this.boundingBox.expandByPoint(Cs)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new At),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Cs),this.boundingSphere.expandByPoint(Cs)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),So.copy(this.boundingSphere),So.applyMatrix4(i),e.ray.intersectsSphere(So)!==!1&&(Ru.copy(i).invert(),bo.copy(e.ray).applyMatrix4(Ru),this.boundingBox!==null&&bo.intersectsBox(this.boundingBox)===!1||this._computeIntersections(e,t,bo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new He,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Rh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Tp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;wu.fromBufferAttribute(i.attributes.skinIndex,e),Eu.fromBufferAttribute(i.attributes.skinWeight,e),Tu.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){let a=Eu.getComponent(s);if(a!==0){let o=wu.getComponent(s);Au.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(wm.copy(Tu).applyMatrix4(Au),a)}}return t.applyMatrix4(this.bindMatrixInverse)}},kr=class extends et{constructor(){super(),this.isBone=!0,this.type="Bone"}},na=class extends mt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=1003,h=1003,u,d){super(null,a,o,l,c,h,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Cu=new ye,Em=new ye,ia=class r{constructor(e=[],t=[]){this.uuid=Ht(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(16*e.length),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new ye)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ye;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){let o=e[s]?e[s].matrixWorld:Em;Cu.multiplyMatrices(o,t[s]),Cu.toArray(n,16*s)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(4*this.bones.length);e=4*Math.ceil(e/4),e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new na(t,e,e,tn,en);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new kr),this.bones.push(a),this.boneInverses.push(new ye().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let a=t[i];e.bones.push(a.uuid);let o=n[i];e.boneInverses.push(o.toArray())}return e}},_i=class extends ot{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Fi=new ye,Iu=new ye,Is=[],Pu=new Et,Am=new ye,Mr=new ze,Sr=new At,ra=class extends ze{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new _i(new Float32Array(16*n),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Am)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Et),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fi),Pu.copy(e.boundingBox).applyMatrix4(Fi),this.boundingBox.union(Pu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new At),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fi),Sr.copy(e.boundingSphere).applyMatrix4(Fi),this.boundingSphere.union(Sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,3*e)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,16*e)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=e*(n.length+1)+1;for(let a=0;a<n.length;a++)n[a]=i[s+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Mr.geometry=this.geometry,Mr.material=this.material,Mr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Sr.copy(this.boundingSphere),Sr.applyMatrix4(n),e.ray.intersectsSphere(Sr)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Fi),Iu.multiplyMatrices(n,Fi),Mr.matrixWorld=Iu,Mr.raycast(e,Is);for(let a=0,o=Is.length;a<o;a++){let l=Is[a];l.instanceId=s,l.object=this,t.push(l)}Is.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new _i(new Float32Array(3*this.instanceMatrix.count).fill(1),3)),t.toArray(this.instanceColor.array,3*e)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,16*e)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new na(new Float32Array(i*this.count),i,this.count,pc,en));let s=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;s[l]=o,s.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}},El=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,a=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}},Cg=new ye,Ig=new xe(1,1,1),Pg=new er,Lg=new Et,Dg=new At,Ng=new T,Ug=new T,Og=new T,Bg=new El,Fg=new ze,Mn=class extends Ot{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},sa=new T,aa=new T,Lu=new ye,br=new gi,Ps=new At,To=new T,Du=new T,jn=class extends et{constructor(e=new Ge,t=new Mn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)sa.fromBufferAttribute(t,i-1),aa.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=sa.distanceTo(aa);e.setAttribute("lineDistance",new be(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ps.copy(n.boundingSphere),Ps.applyMatrix4(i),Ps.radius+=s,e.ray.intersectsSphere(Ps)===!1)return;Lu.copy(i).invert(),br.copy(e.ray).applyMatrix4(Lu);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let m=d,g=p-1;m<g;m+=c){let f=h.getX(m),_=h.getX(m+1),v=Ls(this,e,br,l,f,_);v&&t.push(v)}if(this.isLineLoop){let m=h.getX(p-1),g=h.getX(d),f=Ls(this,e,br,l,m,g);f&&t.push(f)}}else{let d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let m=d,g=p-1;m<g;m+=c){let f=Ls(this,e,br,l,m,m+1);f&&t.push(f)}if(this.isLineLoop){let m=Ls(this,e,br,l,p-1,d);m&&t.push(m)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,s=n.length;i<s;i++){let a=n[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=i}}}}};Nu=new T,Uu=new T,rr=class extends jn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Nu.fromBufferAttribute(t,i),Uu.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Nu.distanceTo(Uu);e.setAttribute("lineDistance",new be(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},oa=class extends jn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Hr=class extends Ot{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ou=new ye,Al=new gi,Ds=new At,Ns=new T,sr=class extends et{constructor(e=new Ge,t=new Hr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ds.copy(n.boundingSphere),Ds.applyMatrix4(i),Ds.radius+=s,e.ray.intersectsSphere(Ds)===!1)return;Ou.copy(i).invert(),Al.copy(e.ray).applyMatrix4(Ou);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null)for(let u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);u<d;u++){let p=c.getX(u);Ns.fromBufferAttribute(h,p),Bu(Ns,p,l,i,e,t,this)}else for(let u=Math.max(0,a.start),d=Math.min(h.count,a.start+a.count);u<d;u++)Ns.fromBufferAttribute(h,u),Bu(Ns,u,l,i,e,t,this)}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,s=n.length;i<s;i++){let a=n[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=i}}}}};Wt=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),i=0,s=n.length,a;a=t||e*n[s-1];let o,l=0,c=s-1;for(;l<=c;)if(i=Math.floor(l+(c-l)/2),o=n[i]-a,o<0)l=i+1;else{if(!(o>0)){c=i;break}c=i-1}if(i=c,n[i]===a)return i/(s-1);let h=n[i];return(i+(a-h)/(n[i+1]-h))/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);let a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new te:new T);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new T,i=[],s=[],a=[],o=new T,l=new ye;for(let p=0;p<=e;p++){let m=p/e;i[p]=this.getTangentAt(m,new T)}s[0]=new T,a[0]=new T;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(i[p-1],i[p]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(st(i[p-1].dot(i[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,m))}a[p].crossVectors(i[p],s[p])}if(t===!0){let p=Math.acos(st(s[0].dot(s[e]),-1,1));p/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(i[m],p*m)),a[m].crossVectors(i[m],s[m])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Vr=class extends Wt{constructor(e=0,t=0,n=1,i=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new te){let n=t,i=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(s=a?0:i),this.aClockwise!==!0||a||(s===i?s=-i:s-=i);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Rl=class extends Vr{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};Us=new T,wo=new vc,Eo=new vc,Ao=new vc,Cl=class extends Wt{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new T){let n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=i[(c-1)%s]:(Us.subVectors(i[0],i[1]).add(i[0]),o=Us);let u=i[c%s],d=i[(c+1)%s];if(this.closed||c+2<s?l=i[(c+2)%s]:(Us.subVectors(i[s-1],i[s-2]).add(i[s-1]),l=Us),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(o.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(d),p),f=Math.pow(d.distanceToSquared(l),p);g<1e-4&&(g=1),m<1e-4&&(m=g),f<1e-4&&(f=g),wo.initNonuniformCatmullRom(o.x,u.x,d.x,l.x,m,g,f),Eo.initNonuniformCatmullRom(o.y,u.y,d.y,l.y,m,g,f),Ao.initNonuniformCatmullRom(o.z,u.z,d.z,l.z,m,g,f)}else this.curveType==="catmullrom"&&(wo.initCatmullRom(o.x,u.x,d.x,l.x,this.tension),Eo.initCatmullRom(o.y,u.y,d.y,l.y,this.tension),Ao.initCatmullRom(o.z,u.z,d.z,l.z,this.tension));return n.set(wo.calc(h),Eo.calc(h),Ao.calc(h)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new T().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};la=class extends Wt{constructor(e=new te,t=new te,n=new te,i=new te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new te){let n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ir(e,i.x,s.x,a.x,o.x),Ir(e,i.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Il=class extends Wt{constructor(e=new T,t=new T,n=new T,i=new T){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new T){let n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ir(e,i.x,s.x,a.x,o.x),Ir(e,i.y,s.y,a.y,o.y),Ir(e,i.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ca=class extends Wt{constructor(e=new te,t=new te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new te){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Pl=class extends Wt{constructor(e=new T,t=new T){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new T){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new T){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ha=class extends Wt{constructor(e=new te,t=new te,n=new te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new te){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Cr(e,i.x,s.x,a.x),Cr(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ua=class extends Wt{constructor(e=new T,t=new T,n=new T){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new T){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Cr(e,i.x,s.x,a.x),Cr(e,i.y,s.y,a.y),Cr(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},da=class extends Wt{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new te){let n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),o=s-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Fu(o,l.x,c.x,h.x,u.x),Fu(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new te().fromArray(i))}return this}},pa=Object.freeze({__proto__:null,ArcCurve:Rl,CatmullRomCurve3:Cl,CubicBezierCurve:la,CubicBezierCurve3:Il,EllipseCurve:Vr,LineCurve:ca,LineCurve3:Pl,QuadraticBezierCurve:ha,QuadraticBezierCurve3:ua,SplineCurve:da}),Ll=class extends Wt{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let a=i[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,s=this.curves;i<s.length;i++){let a=s[i],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new pa[i.type]().fromJSON(i))}return this}},Gr=class extends Ll{constructor(e){super(),this.type="Path",this.currentPoint=new te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ca(this.currentPoint.clone(),new te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let s=new ha(this.currentPoint.clone(),new te(e,t),new te(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){let o=new la(this.currentPoint.clone(),new te(e,t),new te(n,i),new te(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new da(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,s,a,o,l),this}absellipse(e,t,n,i,s,a,o,l){let c=new Vr(e,t,n,i,s,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},fa=class r extends Ge{constructor(e=[new te(0,-.5),new te(.5,0),new te(0,.5)],t=12,n=0,i=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=st(i,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,u=new T,d=new te,p=new T,m=new T,g=new T,f=0,_=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:f=e[v+1].x-e[v].x,_=e[v+1].y-e[v].y,p.x=1*_,p.y=-f,p.z=0*_,g.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(g.x,g.y,g.z);break;default:f=e[v+1].x-e[v].x,_=e[v+1].y-e[v].y,p.x=1*_,p.y=-f,p.z=0*_,m.copy(p),p.x+=g.x,p.y+=g.y,p.z+=g.z,p.normalize(),l.push(p.x,p.y,p.z),g.copy(m)}for(let v=0;v<=t;v++){let x=n+v*h*i,y=Math.sin(x),A=Math.cos(x);for(let M=0;M<=e.length-1;M++){u.x=e[M].x*y,u.y=e[M].y,u.z=e[M].x*A,a.push(u.x,u.y,u.z),d.x=v/t,d.y=M/(e.length-1),o.push(d.x,d.y);let C=l[3*M+0]*y,L=l[3*M+1],U=l[3*M+0]*A;c.push(C,L,U)}}for(let v=0;v<t;v++)for(let x=0;x<e.length-1;x++){let y=x+v*e.length,A=y,M=y+e.length,C=y+e.length+1,L=y+1;s.push(A,M,L),s.push(C,L,M)}this.setIndex(s),this.setAttribute("position",new be(a,3)),this.setAttribute("uv",new be(o,2)),this.setAttribute("normal",new be(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},Dl=class r extends fa{constructor(e=1,t=1,n=4,i=8){let s=new Gr;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new r(e.radius,e.length,e.capSegments,e.radialSegments)}},Nl=class r extends Ge{constructor(e=1,t=32,n=0,i=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new T,h=new te;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=n+u/t*i;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new be(a,3)),this.setAttribute("normal",new be(o,3)),this.setAttribute("uv",new be(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},ma=class r extends Ge{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;i=Math.floor(i),s=Math.floor(s);let h=[],u=[],d=[],p=[],m=0,g=[],f=n/2,_=0;function v(x){let y=m,A=new te,M=new T,C=0,L=x===!0?e:t,U=x===!0?1:-1;for(let V=1;V<=i;V++)u.push(0,f*U,0),d.push(0,U,0),p.push(.5,.5),m++;let z=m;for(let V=0;V<=i;V++){let H=V/i*l+o,j=Math.cos(H),G=Math.sin(H);M.x=L*G,M.y=f*U,M.z=L*j,u.push(M.x,M.y,M.z),d.push(0,U,0),A.x=.5*j+.5,A.y=.5*G*U+.5,p.push(A.x,A.y),m++}for(let V=0;V<i;V++){let H=y+V,j=z+V;x===!0?h.push(j,j+1,H):h.push(j+1,j,H),C+=3}c.addGroup(_,C,x===!0?1:2),_+=C}(function(){let x=new T,y=new T,A=0,M=(t-e)/n;for(let C=0;C<=s;C++){let L=[],U=C/s,z=U*(t-e)+e;for(let V=0;V<=i;V++){let H=V/i,j=H*l+o,G=Math.sin(j),Y=Math.cos(j);y.x=z*G,y.y=-U*n+f,y.z=z*Y,u.push(y.x,y.y,y.z),x.set(G,M,Y).normalize(),d.push(x.x,x.y,x.z),p.push(H,1-U),L.push(m++)}g.push(L)}for(let C=0;C<i;C++)for(let L=0;L<s;L++){let U=g[L][C],z=g[L+1][C],V=g[L+1][C+1],H=g[L][C+1];(e>0||L!==0)&&(h.push(U,z,H),A+=3),(t>0||L!==s-1)&&(h.push(z,V,H),A+=3)}c.addGroup(_,A,0),_+=A})(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new be(u,3)),this.setAttribute("normal",new be(d,3)),this.setAttribute("uv",new be(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ul=class r extends ma{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},vi=class r extends Ge{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let s=[],a=[];function o(d,p,m,g){let f=g+1,_=[];for(let v=0;v<=f;v++){_[v]=[];let x=d.clone().lerp(m,v/f),y=p.clone().lerp(m,v/f),A=f-v;for(let M=0;M<=A;M++)_[v][M]=M===0&&v===f?x:x.clone().lerp(y,M/A)}for(let v=0;v<f;v++)for(let x=0;x<2*(f-v)-1;x++){let y=Math.floor(x/2);x%2==0?(l(_[v][y+1]),l(_[v+1][y]),l(_[v][y])):(l(_[v][y+1]),l(_[v+1][y+1]),l(_[v+1][y]))}}function l(d){s.push(d.x,d.y,d.z)}function c(d,p){let m=3*d;p.x=e[m+0],p.y=e[m+1],p.z=e[m+2]}function h(d,p,m,g){g<0&&d.x===1&&(a[p]=d.x-1),m.x===0&&m.z===0&&(a[p]=g/2/Math.PI+.5)}function u(d){return Math.atan2(d.z,-d.x)}(function(d){let p=new T,m=new T,g=new T;for(let f=0;f<t.length;f+=3)c(t[f+0],p),c(t[f+1],m),c(t[f+2],g),o(p,m,g,d)})(i),(function(d){let p=new T;for(let m=0;m<s.length;m+=3)p.x=s[m+0],p.y=s[m+1],p.z=s[m+2],p.normalize().multiplyScalar(d),s[m+0]=p.x,s[m+1]=p.y,s[m+2]=p.z})(n),(function(){let d=new T;for(let m=0;m<s.length;m+=3){d.x=s[m+0],d.y=s[m+1],d.z=s[m+2];let g=u(d)/2/Math.PI+.5,f=(p=d,Math.atan2(-p.y,Math.sqrt(p.x*p.x+p.z*p.z))/Math.PI+.5);a.push(g,1-f)}var p;(function(){let m=new T,g=new T,f=new T,_=new T,v=new te,x=new te,y=new te;for(let A=0,M=0;A<s.length;A+=9,M+=6){m.set(s[A+0],s[A+1],s[A+2]),g.set(s[A+3],s[A+4],s[A+5]),f.set(s[A+6],s[A+7],s[A+8]),v.set(a[M+0],a[M+1]),x.set(a[M+2],a[M+3]),y.set(a[M+4],a[M+5]),_.copy(m).add(g).add(f).divideScalar(3);let C=u(_);h(v,M+0,m,C),h(x,M+2,g,C),h(y,M+4,f,C)}})(),(function(){for(let m=0;m<a.length;m+=6){let g=a[m+0],f=a[m+2],_=a[m+4],v=Math.max(g,f,_),x=Math.min(g,f,_);v>.9&&x<.1&&(g<.2&&(a[m+0]+=1),f<.2&&(a[m+2]+=1),_<.2&&(a[m+4]+=1))}})()})(),this.setAttribute("position",new be(s,3)),this.setAttribute("normal",new be(s.slice(),3)),this.setAttribute("uv",new be(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},Ol=class r extends vi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=1/n;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Os=new T,Bs=new T,Ro=new T,Fs=new Fn,Wr=class extends Ge{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),s=Math.cos(Vi*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let m=0;m<l;m+=3){a?(c[0]=a.getX(m),c[1]=a.getX(m+1),c[2]=a.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:g,b:f,c:_}=Fs;if(g.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),_.fromBufferAttribute(o,c[2]),Fs.getNormal(Ro),u[0]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,u[1]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,u[2]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let v=0;v<3;v++){let x=(v+1)%3,y=u[v],A=u[x],M=Fs[h[v]],C=Fs[h[x]],L=`${y}_${A}`,U=`${A}_${y}`;U in d&&d[U]?(Ro.dot(d[U].normal)<=s&&(p.push(M.x,M.y,M.z),p.push(C.x,C.y,C.z)),d[U]=null):L in d||(d[L]={index0:c[v],index1:c[x],normal:Ro.clone()})}}for(let m in d)if(d[m]){let{index0:g,index1:f}=d[m];Os.fromBufferAttribute(o,g),Bs.fromBufferAttribute(o,f),p.push(Os.x,Os.y,Os.z),p.push(Bs.x,Bs.y,Bs.z)}this.setAttribute("position",new be(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},ga=class extends Gr{constructor(e){super(e),this.uuid=Ht(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new Gr().fromJSON(i))}return this}},Rm=function(r,e,t=2){let n=e&&e.length,i=n?e[0]*t:r.length,s=zu(r,0,i,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,u,d,p;if(n&&(s=(function(m,g,f,_){let v=[],x,y,A,M,C;for(x=0,y=g.length;x<y;x++)A=g[x]*_,M=x<y-1?g[x+1]*_:m.length,C=zu(m,A,M,_,!1),C===C.next&&(C.steiner=!0),v.push(Om(C));for(v.sort(Dm),x=0;x<v.length;x++)f=Nm(v[x],f);return f})(r,e,s,t)),r.length>80*t){o=c=r[0],l=h=r[1];for(let m=t;m<i;m+=t)u=r[m],d=r[m+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-o,h-l),p=p!==0?32767/p:0}return Xr(s,a,t,o,l,p,0),a};Vn=class r{static area(e){let t=e.length,n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return .5*n}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let n=[],i=[],s=[];Hu(e),Vu(n,e);let a=e.length;t.forEach(Hu);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Vu(n,t[l]);let o=Rm(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};zl=class r extends Ge{constructor(e=new ga([new te(.5,.5),new te(-.5,.5),new te(-.5,-.5),new te(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled===void 0||t.bevelEnabled,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,g=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,_=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:Fm,x,y,A,M,C,L=!1;_&&(x=_.getSpacedPoints(h),L=!0,d=!1,y=_.computeFrenetFrames(h,!1),A=new T,M=new T,C=new T),d||(f=0,p=0,m=0,g=0);let U=o.extractPoints(c),z=U.shape,V=U.holes;if(!Vn.isClockWise(z)){z=z.reverse();for(let D=0,R=V.length;D<R;D++){let P=V[D];Vn.isClockWise(P)&&(V[D]=P.reverse())}}let H=Vn.triangulateShape(z,V),j=z;for(let D=0,R=V.length;D<R;D++){let P=V[D];z=z.concat(P)}function G(D,R,P){return R||console.error("THREE.ExtrudeGeometry: vec does not exist"),D.clone().addScaledVector(R,P)}let Y=z.length,K=H.length;function ie(D,R,P){let S,I,B,$=D.x-R.x,O=D.y-R.y,Z=P.x-D.x,q=P.y-D.y,Q=$*$+O*O,ce=$*q-O*Z;if(Math.abs(ce)>Number.EPSILON){let le=Math.sqrt(Q),ge=Math.sqrt(Z*Z+q*q),Te=R.x-O/le,Fe=R.y+$/le,Pe=((P.x-q/ge-Te)*q-(P.y+Z/ge-Fe)*Z)/($*q-O*Z);S=Te+$*Pe-D.x,I=Fe+O*Pe-D.y;let _e=S*S+I*I;if(_e<=2)return new te(S,I);B=Math.sqrt(_e/2)}else{let le=!1;$>Number.EPSILON?Z>Number.EPSILON&&(le=!0):$<-Number.EPSILON?Z<-Number.EPSILON&&(le=!0):Math.sign(O)===Math.sign(q)&&(le=!0),le?(S=-O,I=$,B=Math.sqrt(Q)):(S=$,I=O,B=Math.sqrt(Q/2))}return new te(S/B,I/B)}let ne=[];for(let D=0,R=j.length,P=R-1,S=D+1;D<R;D++,P++,S++)P===R&&(P=0),S===R&&(S=0),ne[D]=ie(j[D],j[P],j[S]);let fe=[],ve,ee=ne.concat();for(let D=0,R=V.length;D<R;D++){let P=V[D];ve=[];for(let S=0,I=P.length,B=I-1,$=S+1;S<I;S++,B++,$++)B===I&&(B=0),$===I&&($=0),ve[S]=ie(P[S],P[B],P[$]);fe.push(ve),ee=ee.concat(ve)}for(let D=0;D<f;D++){let R=D/f,P=p*Math.cos(R*Math.PI/2),S=m*Math.sin(R*Math.PI/2)+g;for(let I=0,B=j.length;I<B;I++){let $=G(j[I],ne[I],S);de($.x,$.y,-P)}for(let I=0,B=V.length;I<B;I++){let $=V[I];ve=fe[I];for(let O=0,Z=$.length;O<Z;O++){let q=G($[O],ve[O],S);de(q.x,q.y,-P)}}}let se=m+g;for(let D=0;D<Y;D++){let R=d?G(z[D],ee[D],se):z[D];L?(M.copy(y.normals[0]).multiplyScalar(R.x),A.copy(y.binormals[0]).multiplyScalar(R.y),C.copy(x[0]).add(M).add(A),de(C.x,C.y,C.z)):de(R.x,R.y,0)}for(let D=1;D<=h;D++)for(let R=0;R<Y;R++){let P=d?G(z[R],ee[R],se):z[R];L?(M.copy(y.normals[D]).multiplyScalar(P.x),A.copy(y.binormals[D]).multiplyScalar(P.y),C.copy(x[D]).add(M).add(A),de(C.x,C.y,C.z)):de(P.x,P.y,u/h*D)}for(let D=f-1;D>=0;D--){let R=D/f,P=p*Math.cos(R*Math.PI/2),S=m*Math.sin(R*Math.PI/2)+g;for(let I=0,B=j.length;I<B;I++){let $=G(j[I],ne[I],S);de($.x,$.y,u+P)}for(let I=0,B=V.length;I<B;I++){let $=V[I];ve=fe[I];for(let O=0,Z=$.length;O<Z;O++){let q=G($[O],ve[O],S);L?de(q.x,q.y+x[h-1].y,x[h-1].x+P):de(q.x,q.y,u+P)}}}function ue(D,R){let P=D.length;for(;--P>=0;){let S=P,I=P-1;I<0&&(I=D.length-1);for(let B=0,$=h+2*f;B<$;B++){let O=Y*B,Z=Y*(B+1);E(R+S+O,R+I+O,R+I+Z,R+S+Z)}}}function de(D,R,P){l.push(D),l.push(R),l.push(P)}function oe(D,R,P){w(D),w(R),w(P);let S=i.length/3,I=v.generateTopUV(n,i,S-3,S-2,S-1);N(I[0]),N(I[1]),N(I[2])}function E(D,R,P,S){w(D),w(R),w(S),w(R),w(P),w(S);let I=i.length/3,B=v.generateSideWallUV(n,i,I-6,I-3,I-2,I-1);N(B[0]),N(B[1]),N(B[3]),N(B[1]),N(B[2]),N(B[3])}function w(D){i.push(l[3*D+0]),i.push(l[3*D+1]),i.push(l[3*D+2])}function N(D){s.push(D.x),s.push(D.y)}(function(){let D=i.length/3;if(d){let R=0,P=Y*R;for(let S=0;S<K;S++){let I=H[S];oe(I[2]+P,I[1]+P,I[0]+P)}R=h+2*f,P=Y*R;for(let S=0;S<K;S++){let I=H[S];oe(I[0]+P,I[1]+P,I[2]+P)}}else{for(let R=0;R<K;R++){let P=H[R];oe(P[2],P[1],P[0])}for(let R=0;R<K;R++){let P=H[R];oe(P[0]+Y*h,P[1]+Y*h,P[2]+Y*h)}}n.addGroup(D,i.length/3-D,0)})(),(function(){let D=i.length/3,R=0;ue(j,R),R+=j.length;for(let P=0,S=V.length;P<S;P++){let I=V[P];ue(I,R),R+=I.length}n.addGroup(D,i.length/3-D,1)})()}this.setAttribute("position",new be(i,3)),this.setAttribute("uv",new be(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n,i){if(i.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];i.shapes.push(o.uuid)}else i.shapes.push(t.uuid);return i.options=Object.assign({},n),n.extrudePath!==void 0&&(i.options.extrudePath=n.extrudePath.toJSON()),i})(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let n=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];n.push(o)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new pa[i.type]().fromJSON(i)),new r(n,e.options)}},Fm={generateTopUV:function(r,e,t,n,i){let s=e[3*t],a=e[3*t+1],o=e[3*n],l=e[3*n+1],c=e[3*i],h=e[3*i+1];return[new te(s,a),new te(o,l),new te(c,h)]},generateSideWallUV:function(r,e,t,n,i,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*n],h=e[3*n+1],u=e[3*n+2],d=e[3*i],p=e[3*i+1],m=e[3*i+2],g=e[3*s],f=e[3*s+1],_=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new te(a,1-l),new te(c,1-u),new te(d,1-m),new te(g,1-_)]:[new te(o,1-l),new te(h,1-u),new te(p,1-m),new te(f,1-_)]}},kl=class r extends vi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2;super([-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Hl=class r extends vi{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Vl=class r extends Ge{constructor(e=.5,t=1,n=32,i=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/(i=Math.max(1,i)),p=new T,m=new te;for(let g=0;g<=i;g++){for(let f=0;f<=n;f++){let _=s+f/n*a;p.x=u*Math.cos(_),p.y=u*Math.sin(_),l.push(p.x,p.y,p.z),c.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let g=0;g<i;g++){let f=g*(n+1);for(let _=0;_<n;_++){let v=_+f,x=v,y=v+n+1,A=v+n+2,M=v+1;o.push(x,y,M),o.push(y,A,M)}}this.setIndex(o),this.setAttribute("position",new be(l,3)),this.setAttribute("normal",new be(c,3)),this.setAttribute("uv",new be(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Gl=class r extends Ge{constructor(e=new ga([new te(0,.5),new te(-.5,-.5),new te(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],i=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let u=i.length/3,d=h.extractPoints(t),p=d.shape,m=d.holes;Vn.isClockWise(p)===!1&&(p=p.reverse());for(let f=0,_=m.length;f<_;f++){let v=m[f];Vn.isClockWise(v)===!0&&(m[f]=v.reverse())}let g=Vn.triangulateShape(p,m);for(let f=0,_=m.length;f<_;f++){let v=m[f];p=p.concat(v)}for(let f=0,_=p.length;f<_;f++){let v=p[f];i.push(v.x,v.y,0),s.push(0,0,1),a.push(v.x,v.y)}for(let f=0,_=g.length;f<_;f++){let v=g[f],x=v[0]+u,y=v[1]+u,A=v[2]+u;n.push(x,y,A),l+=3}}this.setIndex(n),this.setAttribute("position",new be(i,3)),this.setAttribute("normal",new be(s,3)),this.setAttribute("uv",new be(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n){if(n.shapes=[],Array.isArray(t))for(let i=0,s=t.length;i<s;i++){let a=t[i];n.shapes.push(a.uuid)}else n.shapes.push(t.uuid);return n})(this.parameters.shapes,e)}static fromJSON(e,t){let n=[];for(let i=0,s=e.shapes.length;i<s;i++){let a=t[e.shapes[i]];n.push(a)}return new r(n,e.curveSegments)}},Yr=class r extends Ge{constructor(e=1,t=32,n=16,i=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new T,d=new T,p=[],m=[],g=[],f=[];for(let _=0;_<=n;_++){let v=[],x=_/n,y=0;_===0&&a===0?y=.5/t:_===n&&l===Math.PI&&(y=-.5/t);for(let A=0;A<=t;A++){let M=A/t;u.x=-e*Math.cos(i+M*s)*Math.sin(a+x*o),u.y=e*Math.cos(a+x*o),u.z=e*Math.sin(i+M*s)*Math.sin(a+x*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),g.push(d.x,d.y,d.z),f.push(M+y,1-x),v.push(c++)}h.push(v)}for(let _=0;_<n;_++)for(let v=0;v<t;v++){let x=h[_][v+1],y=h[_][v],A=h[_+1][v],M=h[_+1][v+1];(_!==0||a>0)&&p.push(x,y,M),(_!==n-1||l<Math.PI)&&p.push(y,A,M)}this.setIndex(p),this.setAttribute("position",new be(m,3)),this.setAttribute("normal",new be(g,3)),this.setAttribute("uv",new be(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Wl=class r extends vi{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Xl=class r extends Ge{constructor(e=1,t=.4,n=12,i=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);let a=[],o=[],l=[],c=[],h=new T,u=new T,d=new T;for(let p=0;p<=n;p++)for(let m=0;m<=i;m++){let g=m/i*s,f=p/n*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(g),u.y=(e+t*Math.cos(f))*Math.sin(g),u.z=t*Math.sin(f),o.push(u.x,u.y,u.z),h.x=e*Math.cos(g),h.y=e*Math.sin(g),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let m=1;m<=i;m++){let g=(i+1)*p+m-1,f=(i+1)*(p-1)+m-1,_=(i+1)*(p-1)+m,v=(i+1)*p+m;a.push(g,f,v),a.push(f,_,v)}this.setIndex(a),this.setAttribute("position",new be(o,3)),this.setAttribute("normal",new be(l,3)),this.setAttribute("uv",new be(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},jl=class r extends Ge{constructor(e=1,t=.4,n=64,i=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:s,q:a},n=Math.floor(n),i=Math.floor(i);let o=[],l=[],c=[],h=[],u=new T,d=new T,p=new T,m=new T,g=new T,f=new T,_=new T;for(let x=0;x<=n;++x){let y=x/n*s*Math.PI*2;v(y,s,a,e,p),v(y+.01,s,a,e,m),f.subVectors(m,p),_.addVectors(m,p),g.crossVectors(f,_),_.crossVectors(g,f),g.normalize(),_.normalize();for(let A=0;A<=i;++A){let M=A/i*Math.PI*2,C=-t*Math.cos(M),L=t*Math.sin(M);u.x=p.x+(C*_.x+L*g.x),u.y=p.y+(C*_.y+L*g.y),u.z=p.z+(C*_.z+L*g.z),l.push(u.x,u.y,u.z),d.subVectors(u,p).normalize(),c.push(d.x,d.y,d.z),h.push(x/n),h.push(A/i)}}for(let x=1;x<=n;x++)for(let y=1;y<=i;y++){let A=(i+1)*(x-1)+(y-1),M=(i+1)*x+(y-1),C=(i+1)*x+y,L=(i+1)*(x-1)+y;o.push(A,M,L),o.push(M,C,L)}function v(x,y,A,M,C){let L=Math.cos(x),U=Math.sin(x),z=A/y*x,V=Math.cos(z);C.x=M*(2+V)*.5*L,C.y=M*(2+V)*U*.5,C.z=M*Math.sin(z)*.5}this.setIndex(o),this.setAttribute("position",new be(l,3)),this.setAttribute("normal",new be(c,3)),this.setAttribute("uv",new be(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},ql=class r extends Ge{constructor(e=new ua(new T(-1,-1,0),new T(-1,1,0),new T(1,1,0)),t=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new T,l=new T,c=new te,h=new T,u=[],d=[],p=[],m=[];function g(f){h=e.getPointAt(f/t,h);let _=a.normals[f],v=a.binormals[f];for(let x=0;x<=i;x++){let y=x/i*Math.PI*2,A=Math.sin(y),M=-Math.cos(y);l.x=M*_.x+A*v.x,l.y=M*_.y+A*v.y,l.z=M*_.z+A*v.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,u.push(o.x,o.y,o.z)}}(function(){for(let f=0;f<t;f++)g(f);g(s===!1?t:0),(function(){for(let f=0;f<=t;f++)for(let _=0;_<=i;_++)c.x=f/t,c.y=_/i,p.push(c.x,c.y)})(),(function(){for(let f=1;f<=t;f++)for(let _=1;_<=i;_++){let v=(i+1)*(f-1)+(_-1),x=(i+1)*f+(_-1),y=(i+1)*f+_,A=(i+1)*(f-1)+_;m.push(v,x,A),m.push(x,y,A)}})()})(),this.setIndex(m),this.setAttribute("position",new be(u,3)),this.setAttribute("normal",new be(d,3)),this.setAttribute("uv",new be(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new pa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Yl=class extends Ge{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,i=new T,s=new T;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start;for(let p=d,m=d+u.count;p<m;p+=3)for(let g=0;g<3;g++){let f=o.getX(p+g),_=o.getX(p+(g+1)%3);i.fromBufferAttribute(a,f),s.fromBufferAttribute(a,_),Gu(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,u=3*o+(c+1)%3;i.fromBufferAttribute(a,h),s.fromBufferAttribute(a,u),Gu(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new be(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};zg=Object.freeze({__proto__:null,BoxGeometry:Xn,CapsuleGeometry:Dl,CircleGeometry:Nl,ConeGeometry:Ul,CylinderGeometry:ma,DodecahedronGeometry:Ol,EdgesGeometry:Wr,ExtrudeGeometry:zl,IcosahedronGeometry:kl,LatheGeometry:fa,OctahedronGeometry:Hl,PlaneGeometry:Br,PolyhedronGeometry:vi,RingGeometry:Vl,ShapeGeometry:Gl,SphereGeometry:Yr,TetrahedronGeometry:Wl,TorusGeometry:Xl,TorusKnotGeometry:jl,TubeGeometry:ql,WireframeGeometry:Yl}),Sn=class extends Ot{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Bt=class extends Sn{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new te(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return st(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new xe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new xe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new xe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};qn=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];t:{e:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break n}if(e>=s)break t;{let o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0}}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Zl=class extends qn{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ch,endingEnd:Ch}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ih:s=e,o=2*t-n;break;case Ph:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ih:a=e,l=2*n-t;break;case Ph:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}let c=.5*(n-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,m=(n-t)/(i-t),g=m*m,f=g*m,_=-d*f+2*d*g-d*m,v=(1+d)*f+(-1.5-2*d)*g+(-.5+d)*m+1,x=(-1-p)*f+(1.5+p)*g+.5*m,y=p*f-p*g;for(let A=0;A!==o;++A)s[A]=_*a[h+A]+v*a[c+A]+x*a[l+A]+y*a[u+A];return s}},Kl=class extends qn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}},Jl=class extends qn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Vt=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Hs(t,this.TimeBufferType),this.values=Hs(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Hs(e.times,Array),values:Hs(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Jl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Kl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Zl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Zi:t=this.InterpolantFactoryMethodDiscrete;break;case Ki:t=this.InterpolantFactoryMethodLinear;break;case Ya:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(n);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zi;case this.InterpolantFactoryMethodLinear:return Ki;case this.InterpolantFactoryMethodSmooth:return Ya}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&zm(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ya,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(i)l=!0;else{let h=o*n,u=h-n,d=h+n;for(let p=0;p!==n;++p){let m=t[h+p];if(m!==t[u+p]||m!==t[d+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*n,u=a*n;for(let d=0;d!==n;++d)t[u+d]=t[h+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=new this.constructor(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}};Vt.prototype.TimeBufferType=Float32Array,Vt.prototype.ValueBufferType=Float32Array,Vt.prototype.DefaultInterpolation=Ki;zn=class extends Vt{constructor(e,t,n){super(e,t,n)}};zn.prototype.ValueTypeName="bool",zn.prototype.ValueBufferType=Array,zn.prototype.DefaultInterpolation=Zi,zn.prototype.InterpolantFactoryMethodLinear=void 0,zn.prototype.InterpolantFactoryMethodSmooth=void 0;_a=class extends Vt{};_a.prototype.ValueTypeName="color";bn=class extends Vt{};bn.prototype.ValueTypeName="number";$l=class extends qn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t),c=e*o;for(let h=c+o;c!==h;c+=4)Ut.slerpFlat(s,0,a,c-o,a,c,l);return s}},Tn=class extends Vt{InterpolantFactoryMethodLinear(e){return new $l(this.times,this.values,this.getValueSize(),e)}};Tn.prototype.ValueTypeName="quaternion",Tn.prototype.InterpolantFactoryMethodSmooth=void 0;kn=class extends Vt{constructor(e,t,n){super(e,t,n)}};kn.prototype.ValueTypeName="string",kn.prototype.ValueBufferType=Array,kn.prototype.DefaultInterpolation=Zi,kn.prototype.InterpolantFactoryMethodLinear=void 0,kn.prototype.InterpolantFactoryMethodSmooth=void 0;wn=class extends Vt{};wn.prototype.ValueTypeName="vector";va=class{constructor(e="",t=-1,n=[],i=2500){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Ht(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Hm(n[a]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,a=n.length;s!==a;++s)t.push(Vt.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);let h=km(l);l=Wu(l,1,h),c=Wu(c,1,h),i||l[0]!==0||(l.push(s),c.push(c[0])),a.push(new bn(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(s);if(h&&h.length>1){let u=h[1],d=i[u];d||(i[u]=d=[]),d.push(c)}}let a=[];for(let o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(h,u,d,p,m){if(d.length!==0){let g=[],f=[];yd(d,g,f,p),g.length!==0&&m.push(new h(u,g,f))}},i=[],s=e.name||"default",a=e.fps||30,o=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let h=0;h<c.length;h++){let u=c[h].keys;if(u&&u.length!==0)if(u[0].morphTargets){let d={},p;for(p=0;p<u.length;p++)if(u[p].morphTargets)for(let m=0;m<u[p].morphTargets.length;m++)d[u[p].morphTargets[m]]=-1;for(let m in d){let g=[],f=[];for(let _=0;_!==u[p].morphTargets.length;++_){let v=u[p];g.push(v.time),f.push(v.morphTarget===m?1:0)}i.push(new bn(".morphTargetInfluence["+m+"]",g,f))}l=d.length*a}else{let d=".bones["+t[h].name+"]";n(wn,d+".position",u,"pos",i),n(Tn,d+".quaternion",u,"rot",i),n(wn,d+".scale",u,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){let e=0;for(let t=0,n=this.tracks.length;t!==n;++t){let i=this.tracks[t];e=Math.max(e,i.times[i.times.length-1])}return this.duration=e,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};Hn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},Ql=class{constructor(e,t,n){let i=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){l++,a===!1&&i.onStart!==void 0&&i.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,l),o===l&&(a=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],m=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return m}return null}}},Vm=new Ql,En=class{constructor(e){this.manager=e!==void 0?e:Vm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise((function(i,s){n.load(e,i,t,s)}))}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};En.DEFAULT_MATERIAL_NAME="__DEFAULT";gn={},ec=class extends Error{constructor(e,t){super(e),this.response=t}},Zr=class extends En{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=Hn.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout((()=>{t&&t(s),this.manager.itemEnd(e)}),0),s;if(gn[e]!==void 0)return void gn[e].push({onLoad:t,onProgress:n,onError:i});gn[e]=[],gn[e].push({onLoad:t,onProgress:n,onError:i});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then((c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=gn[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=d?parseInt(d):0,m=p!==0,g=0,f=new ReadableStream({start(_){(function v(){u.read().then((({done:x,value:y})=>{if(x)_.close();else{g+=y.byteLength;let A=new ProgressEvent("progress",{lengthComputable:m,loaded:g,total:p});for(let M=0,C=h.length;M<C;M++){let L=h[M];L.onProgress&&L.onProgress(A)}_.enqueue(y),v()}}),(x=>{_.error(x)}))})()}});return new Response(f)}throw new ec(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)})).then((c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then((h=>new DOMParser().parseFromString(h,o)));case"json":return c.json();default:if(o===void 0)return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(o),u=h&&h[1]?h[1].toLowerCase():void 0,d=new TextDecoder(u);return c.arrayBuffer().then((p=>d.decode(p)))}}})).then((c=>{Hn.add(e,c);let h=gn[e];delete gn[e];for(let u=0,d=h.length;u<d;u++){let p=h[u];p.onLoad&&p.onLoad(c)}})).catch((c=>{let h=gn[e];if(h===void 0)throw this.manager.itemError(e),c;delete gn[e];for(let u=0,d=h.length;u<d;u++){let p=h[u];p.onError&&p.onError(c)}this.manager.itemError(e)})).finally((()=>{this.manager.itemEnd(e)})),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}},tc=class extends En{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Hn.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout((function(){t&&t(a),s.manager.itemEnd(e)}),0),a;let o=Nr("img");function l(){h(),Hn.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){h(),i&&i(u),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}},xa=class extends En{constructor(e){super(e)}load(e,t,n,i){let s=new mt,a=new tc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,(function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)}),n,i),s}},Kr=class extends et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Co=new ye,Xu=new T,ju=new T,Jr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new te(512,512),this.map=null,this.mapPass=null,this.matrix=new ye,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new er,this._frameExtents=new te(1,1),this._viewportCount=1,this._viewports=[new He(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Xu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xu),ju.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ju),t.updateMatrixWorld(),Co.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Co),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Co)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},nc=class extends Jr{constructor(){super(new at(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=2*$i*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;n===t.fov&&i===t.aspect&&s===t.far||(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},ya=class extends Kr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(et.DEFAULT_UP),this.updateMatrix(),this.target=new et,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new nc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},qu=new ye,Tr=new T,Io=new T,ic=class extends Jr{constructor(){super(new at(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new te(4,2),this._viewportCount=6,this._viewports=[new He(2,1,1,1),new He(0,1,1,1),new He(3,1,1,1),new He(1,1,1,1),new He(3,0,1,1),new He(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Tr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Tr),Io.copy(n.position),Io.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Io),n.updateMatrixWorld(),i.makeTranslation(-Tr.x,-Tr.y,-Tr.z),qu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qu)}},Yn=class extends Kr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ic}get power(){return 4*this.intensity*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},rc=class extends Jr{constructor(){super(new tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Zn=class extends Kr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(et.DEFAULT_UP),this.updateMatrix(),this.target=new et,this.shadow=new rc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Kn=class{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Ma=class extends En{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Hn.get(e);if(a!==void 0)return s.manager.itemStart(e),a.then?void a.then((c=>{t&&t(c),s.manager.itemEnd(e)})).catch((c=>{i&&i(c)})):(setTimeout((function(){t&&t(a),s.manager.itemEnd(e)}),0),a);let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;let l=fetch(e,o).then((function(c){return c.blob()})).then((function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))})).then((function(c){return Hn.add(e,c),t&&t(c),s.manager.itemEnd(e),c})).catch((function(c){i&&i(c),Hn.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)}));Hn.add(e,l),s.manager.itemStart(e)}},kg=new ye,Hg=new ye,Vg=new ye,Gg=new T,Wg=new Ut,Xg=new T,jg=new T,qg=new T,Yg=new Ut,Zg=new T,Kg=new T,xc="\\[\\]\\.:\\/",Gm=new RegExp("["+xc+"]","g"),Po="[^"+xc+"]",Wm="[^"+xc.replace("\\.","")+"]",Xm=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",Po)+/(WCOD+)?/.source.replace("WCOD",Wm)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Po)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Po)+"$"),jm=["material","materials","bones","map"],Ye=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Gm,"")}static parseTrackName(e){let t=Xm.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);jm.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[n]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[n]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[i];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ye.Composite=class{constructor(r,e,t){let n=t||Ye.parseTrackName(e);this._targetGroup=r,this._bindings=r.subscribe_(e,n)}getValue(r,e){this.bind();let t=this._targetGroup.nCachedObjects_,n=this._bindings[t];n!==void 0&&n.getValue(r,e)}setValue(r,e){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].setValue(r,e)}bind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].bind()}unbind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].unbind()}},Ye.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Ye.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Ye.prototype.GetterByBindingType=[Ye.prototype._getValue_direct,Ye.prototype._getValue_array,Ye.prototype._getValue_arrayElement,Ye.prototype._getValue_toArray],Ye.prototype.SetterByBindingTypeAndVersioning=[[Ye.prototype._setValue_direct,Ye.prototype._setValue_direct_setNeedsUpdate,Ye.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_array,Ye.prototype._setValue_array_setNeedsUpdate,Ye.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_arrayElement,Ye.prototype._setValue_arrayElement_setNeedsUpdate,Ye.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_fromArray,Ye.prototype._setValue_fromArray_setNeedsUpdate,Ye.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];Jg=new Float32Array(1),Yu=new ye,Sa=class{constructor(e,t,n=0,i=1/0){this.ray=new gi(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ur,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Yu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Yu),this}intersectObject(e,t=!0,n=[]){return sc(e,this,n,t),n.sort(Zu),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)sc(e[i],this,n,t);return n.sort(Zu),n}};$g=new te,Qg=new T,e0=new T,t0=new T,n0=new T,i0=new ye,r0=new ye,s0=new T,a0=new xe,o0=new xe,l0=new T,c0=new T,h0=new T,u0=new T,d0=new Or,p0=new Et,f0=new T;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170")});function yc(r,e){if(e===ld)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===Qr||e===Ta){let t=r.getIndex();if(t===null){let a=[],o=r.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}let n=t.count-2,i=[];if(e===Qr)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}var Md=gt(()=>{Jn()});function qm(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function Km(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Sn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ac})),r.DefaultMaterial}function yi(r,e,t){for(let n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function An(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Jm(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;o.push(d)}if(s){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],d=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=d),r.morphTargetsRelative=!0,r})}function $m(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Qm(r){let e,t=r.extensions&&r.extensions[De.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+bc(t.attributes):e=r.indices+":"+bc(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+bc(r.targets[n]);return e}function bc(r){let e="",t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function Yc(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function eg(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function ng(r,e,t){let n=e.attributes,i=new Et;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new T(l[0],l[1],l[2]),new T(c[0],c[1],c[2])),o.normalized){let h=Yc(or[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let o=new T,l=new T;for(let c=0,h=s.length;c<h;c++){let u=s[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],p=d.min,m=d.max;if(p!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(m[2]))),d.normalized){let g=Yc(or[d.componentType]);l.multiplyScalar(g)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;let a=new At;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function wd(r,e,t){let n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(let a in n){let o=qc[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){let a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return Oe.workingColorSpace!==xt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Oe.workingColorSpace}" not supported.`),An(r,e),ng(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Jm(r,e.targets,t):r})}var Ca,De,Tc,wc,Ec,Ac,Rc,Cc,Ic,Pc,Lc,Dc,Nc,Uc,Oc,Bc,Fc,zc,kc,Hc,Ed,es,Sd,Vc,Gc,Wc,Xc,Ia,Ym,jc,Xt,or,bd,Td,Mc,qc,$n,Zm,Sc,tg,Zc,Ad=gt(()=>{Jn();Md();Ca=class extends En{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ac(t)}),this.register(function(t){return new Rc(t)}),this.register(function(t){return new Bc(t)}),this.register(function(t){return new Fc(t)}),this.register(function(t){return new zc(t)}),this.register(function(t){return new Ic(t)}),this.register(function(t){return new Pc(t)}),this.register(function(t){return new Lc(t)}),this.register(function(t){return new Dc(t)}),this.register(function(t){return new Ec(t)}),this.register(function(t){return new Nc(t)}),this.register(function(t){return new Cc(t)}),this.register(function(t){return new Oc(t)}),this.register(function(t){return new Uc(t)}),this.register(function(t){return new Tc(t)}),this.register(function(t){return new kc(t)}),this.register(function(t){return new Hc(t)})}load(e,t,n,i){let s=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=Kn.extractUrlBase(e);a=Kn.resolveURL(c,this.path)}else a=Kn.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Zr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Ed){try{a[De.KHR_BINARY_GLTF]=new Vc(e)}catch(u){i&&i(u);return}s=JSON.parse(a[De.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Zc(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){let u=s.extensionsUsed[h],d=s.extensionsRequired||[];switch(u){case De.KHR_MATERIALS_UNLIT:a[u]=new wc;break;case De.KHR_DRACO_MESH_COMPRESSION:a[u]=new Gc(s,this.dracoLoader);break;case De.KHR_TEXTURE_TRANSFORM:a[u]=new Wc;break;case De.KHR_MESH_QUANTIZATION:a[u]=new Xc;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};De={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Tc=class{constructor(e){this.parser=e,this.name=De.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,h=new xe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],xt);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Zn(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Yn(h),c.distance=u;break;case"spot":c=new ya(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),c.decay=2,An(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},wc=class{constructor(){this.name=De.KHR_MATERIALS_UNLIT}getMaterialType(){return Rt}extendParams(e,t,n){let i=[];e.color=new xe(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],xt),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,it))}return Promise.all(i)}},Ec=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}},Ac=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){let o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new te(o,o)}return Promise.all(s)}},Rc=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}},Cc=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(s)}},Ic=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[];t.sheenColor=new xe(0,0,0),t.sheenRoughness=0,t.sheen=1;let a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){let o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],xt)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,it)),a.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(s)}},Pc=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(s)}},Lc=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;let o=a.attenuationColor||[1,1,1];return t.attenuationColor=new xe().setRGB(o[0],o[1],o[2],xt),Promise.all(s)}},Dc=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}},Nc=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));let o=a.specularColorFactor||[1,1,1];return t.specularColor=new xe().setRGB(o[0],o[1],o[2],xt),a.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,it)),Promise.all(s)}},Uc=class{constructor(e){this.parser=e,this.name=De.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(s)}},Oc=class{constructor(e){this.parser=e,this.name=De.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(s)}},Bc=class{constructor(e){this.parser=e,this.name=De.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}},Fc=class{constructor(e){this.parser=e,this.name=De.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],o=i.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,a.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}},zc=class{constructor(e){this.parser=e,this.name=De.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],o=i.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,a.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}},kc=class{constructor(e){this.name=De.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){let l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(p){return p.buffer}):a.ready.then(function(){let p=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(p),h,u,d,i.mode,i.filter),p})})}else return null}},Hc=class{constructor(e){this.name=De.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==Xt.TRIANGLES&&c.mode!==Xt.TRIANGLE_STRIP&&c.mode!==Xt.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,p=[];for(let m of u){let g=new ye,f=new T,_=new Ut,v=new T(1,1,1),x=new ra(m.geometry,m.material,d);for(let y=0;y<d;y++)l.TRANSLATION&&f.fromBufferAttribute(l.TRANSLATION,y),l.ROTATION&&_.fromBufferAttribute(l.ROTATION,y),l.SCALE&&v.fromBufferAttribute(l.SCALE,y),x.setMatrixAt(y,g.compose(f,_,v));for(let y in l)if(y==="_COLOR_0"){let A=l[y];x.instanceColor=new _i(A.array,A.itemSize,A.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&m.geometry.setAttribute(y,l[y]);et.prototype.copy.call(x,m),this.parser.assignFinalMaterial(x),p.push(x)}return h.isGroup?(h.clear(),h.add(...p),h):p[0]}))}},Ed="glTF",es=12,Sd={JSON:1313821514,BIN:5130562},Vc=class{constructor(e){this.name=De.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,es),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Ed)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-es,s=new DataView(e,es),a=0;for(;a<i;){let o=s.getUint32(a,!0);a+=4;let l=s.getUint32(a,!0);if(a+=4,l===Sd.JSON){let c=new Uint8Array(e,es+a,o);this.content=n.decode(c)}else if(l===Sd.BIN){let c=es+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Gc=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=De.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let u=qc[h]||h.toLowerCase();o[u]=a[h]}for(let h in e.attributes){let u=qc[h]||h.toLowerCase();if(a[h]!==void 0){let d=n.accessors[e.attributes[h]],p=or[d.componentType];c[u]=p.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(p){for(let m in p.attributes){let g=p.attributes[m],f=l[m];f!==void 0&&(g.normalized=f)}u(p)},o,c,xt,d)})})}},Wc=class{constructor(){this.name=De.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Xc=class{constructor(){this.name=De.KHR_MESH_QUANTIZATION}},Ia=class extends qn{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,d=u*u,p=d*u,m=e*c,g=m-c,f=-2*p+3*d,_=p-d,v=1-f,x=_-d+u;for(let y=0;y!==o;y++){let A=a[g+y+o],M=a[g+y+l]*h,C=a[m+y+o],L=a[m+y]*h;s[y]=v*A+x*M+f*C+_*L}return s}},Ym=new Ut,jc=class extends Ia{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return Ym.fromArray(s).normalize().toArray(s),s}},Xt={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},or={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},bd={9728:wt,9729:Nt,9984:cc,9985:Er,9986:ki,9987:vn},Td={33071:fi,33648:Pr,10497:pi},Mc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},qc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},$n={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Zm={CUBICSPLINE:void 0,LINEAR:Ki,STEP:Zi},Sc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};tg=new ye,Zc=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new qm,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new xa(this.options.manager):this.textureLoader=new Ma(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Zr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return yi(s,o,i),An(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())s(h,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[De.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,a){n.load(Kn.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let a=Mc[i.type],o=or[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new ot(c,a,l))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){let o=a[0],l=Mc[i.type],c=or[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,p=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0,g,f;if(p&&p!==u){let _=Math.floor(d/p),v="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+_+":"+i.count,x=t.cache.get(v);x||(g=new c(o,_*p,i.count*p/h),x=new Fr(g,p/h),t.cache.add(v,x)),f=new zr(x,l,d%p/h,m)}else o===null?g=new c(i.count*l):g=new c(o,d,i.count*l),f=new ot(g,l,m);if(i.sparse!==void 0){let _=Mc.SCALAR,v=or[i.sparse.indices.componentType],x=i.sparse.indices.byteOffset||0,y=i.sparse.values.byteOffset||0,A=new v(a[1],x,i.sparse.count*_),M=new c(a[2],y,i.sparse.count*l);o!==null&&(f=new ot(f.array.slice(),f.itemSize,f.normalized)),f.normalized=!1;for(let C=0,L=A.length;C<L;C++){let U=A[C];if(f.setX(U,M[C*l]),l>=2&&f.setY(U,M[C*l+1]),l>=3&&f.setZ(U,M[C*l+2]),l>=4&&f.setW(U,M[C*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}f.normalized=m}return f})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){let i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let d=(s.samplers||{})[a.sampler]||{};return h.magFilter=bd[d.magFilter]||Nt,h.minFilter=bd[d.minFilter]||vn,h.wrapS=Td[d.wrapS]||pi,h.wrapT=Td[d.wrapT]||pi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==wt&&h.minFilter!==Nt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let a=i.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(d,p){let m=d;t.isImageBitmapLoader===!0&&(m=function(g){let f=new mt(g);f.needsUpdate=!0,d(f)}),t.load(Kn.resolveURL(u,s.path),m,void 0,p)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),An(u,a),u.userData.mimeType=a.mimeType||eg(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[De.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[De.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=s.associations.get(a);a=s.extensions[De.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Hr,Ot.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Mn,Ot.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Sn}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],a,o={},l=s.extensions||{},c=[];if(l[De.KHR_MATERIALS_UNLIT]){let u=i[De.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,s,t))}else{let u=s.pbrMetallicRoughness||{};if(o.color=new xe(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],xt),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,it)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=lc);let h=s.alphaMode||Sc.OPAQUE;if(h===Sc.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Sc.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==Rt&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new te(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;o.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==Rt&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==Rt){let u=s.emissiveFactor;o.emissive=new xe().setRGB(u[0],u[1],u[2],xt)}return s.emissiveTexture!==void 0&&a!==Rt&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,it)),Promise.all(c).then(function(){let u=new a(o);return s.name&&(u.name=s.name),An(u,s),t.associations.set(u,{materials:e}),s.extensions&&yi(i,u,s),u})}createUniqueName(e){let t=Ye.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[De.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return wd(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=Qm(c),u=i[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[De.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=wd(new Ge,c,t),i[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?Km(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let p=0,m=h.length;p<m;p++){let g=h[p],f=a[p],_,v=c[p];if(f.mode===Xt.TRIANGLES||f.mode===Xt.TRIANGLE_STRIP||f.mode===Xt.TRIANGLE_FAN||f.mode===void 0)_=s.isSkinnedMesh===!0?new ta(g,v):new ze(g,v),_.isSkinnedMesh===!0&&_.normalizeSkinWeights(),f.mode===Xt.TRIANGLE_STRIP?_.geometry=yc(_.geometry,Ta):f.mode===Xt.TRIANGLE_FAN&&(_.geometry=yc(_.geometry,Qr));else if(f.mode===Xt.LINES)_=new rr(g,v);else if(f.mode===Xt.LINE_STRIP)_=new jn(g,v);else if(f.mode===Xt.LINE_LOOP)_=new oa(g,v);else if(f.mode===Xt.POINTS)_=new sr(g,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+f.mode);Object.keys(_.geometry.morphAttributes).length>0&&$m(_,s),_.name=t.createUniqueName(s.name||"mesh_"+e),An(_,s),f.extensions&&yi(i,_,f),t.assignFinalMaterial(_),u.push(_)}for(let p=0,m=u.length;p<m;p++)t.associations.set(u[p],{meshes:e,primitives:p});if(u.length===1)return s.extensions&&yi(i,u[0],s),u[0];let d=new ft;s.extensions&&yi(i,d,s),t.associations.set(d,{meshes:e});for(let p=0,m=u.length;p<m;p++)d.add(u[p]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new at(cd.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new tr(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),An(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let u=a[c];if(u){o.push(u);let d=new ye;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new ia(o,l)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){let p=i.channels[u],m=i.samplers[p.sampler],g=p.target,f=g.node,_=i.parameters!==void 0?i.parameters[m.input]:m.input,v=i.parameters!==void 0?i.parameters[m.output]:m.output;g.node!==void 0&&(a.push(this.getDependency("node",f)),o.push(this.getDependency("accessor",_)),l.push(this.getDependency("accessor",v)),c.push(m),h.push(g))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],p=u[1],m=u[2],g=u[3],f=u[4],_=[];for(let v=0,x=d.length;v<x;v++){let y=d[v],A=p[v],M=m[v],C=g[v],L=f[v];if(y===void 0)continue;y.updateMatrix&&y.updateMatrix();let U=n._createAnimationTracks(y,A,M,C,L);if(U)for(let z=0;z<U.length;z++)_.push(U[z])}return new va(s,void 0,_)})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(p){p.isSkinnedMesh&&p.bind(d,tg)});for(let p=0,m=u.length;p<m;p++)h.add(u[p]);return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(s.isBone===!0?h=new kr:c.length>1?h=new ft:c.length===1?h=c[0]:h=new et,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(s.name&&(h.userData.name=s.name,h.name=a),An(h,s),s.extensions&&yi(n,h,s),s.matrix!==void 0){let u=new ye;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new ft;n.name&&(s.name=i.createUniqueName(n.name)),An(s,n),n.extensions&&yi(t,s,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++)s.add(l[h]);let c=h=>{let u=new Map;for(let[d,p]of i.associations)(d instanceof Ot||d instanceof mt)&&u.set(d,p);return h.traverse(d=>{let p=i.associations.get(d);p!=null&&u.set(d,p)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){let a=[],o=e.name?e.name:e.uuid,l=[];$n[s.path]===$n.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let c;switch($n[s.path]){case $n.weights:c=bn;break;case $n.rotation:c=Tn;break;case $n.position:case $n.scale:c=wn;break;default:switch(n.itemSize){case 1:c=bn;break;case 2:case 3:default:c=wn;break}break}let h=i.interpolation!==void 0?Zm[i.interpolation]:Ki,u=this._getArrayFromAccessor(n);for(let d=0,p=l.length;d<p;d++){let m=new c(l[d]+"."+$n[s.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),a.push(m)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Yc(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Tn?jc:Ia;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});async function Rd(r,e){let n=(await new Ca().loadAsync(new URL("../assets/mo-signature.glb",import.meta.url).href)).scene;n.updateMatrixWorld(!0);let i=new ft;i.name="Creation_Engine_Experience",i.add(n);let s=[],a=new Set,o=new xe(15585699),l=new Set,c=[],h=0;n.traverse(g=>{if(g.userData.component&&s.push({node:g,position:g.position.clone(),quaternion:g.quaternion.clone(),explode:new T(...g.userData.explode||[0,0,0]),role:g.userData.role}),!g.isMesh)return;l.add(g.material);let f=g.material=g.material.clone(),_=g;for(;_&&!_.userData.capability;)_=_.parent;f.userData.capability=_?.userData.capability,f.userData.originalColor=f.color.clone(),a.add(f),g.frustumCulled=!0;let v=g.geometry.attributes.position;for(let x=0;x<v.count;x++){if(h++%(e.constrained?85:45))continue;let y=new T().fromBufferAttribute(v,x).applyMatrix4(g.matrixWorld);c.push(y.x,y.y,y.z)}}),l.forEach(g=>g.dispose());let u=[];for(let g of s){let f=new ft;f.name=`${g.node.name}_construction`;let _=g.node.matrixWorld.clone().invert();g.node.traverse(v=>{if(!v.isMesh||/glass/i.test(v.material.name))return;let x=new Wr(v.geometry,27);x.applyMatrix4(_.clone().multiply(v.matrixWorld));let y=new rr(x,new Mn({color:12505311,transparent:!0,opacity:0,depthWrite:!1}));f.add(y),u.push(y)}),i.add(f),g.wire=f}for(let g of a)g.userData.originalOpacity=g.opacity,g.userData.isGlass=/glass/i.test(g.name),g.userData.isEnergy=/energy/i.test(g.name),g.userData.isGlass&&(g.transmission=e.constrained||e.mobile?.15:.4,g.roughness=.19,g.opacity=.45,g.userData.originalOpacity=.45),g.envMapIntensity=/graphite/i.test(g.name)?.7:1.15;let d=new Ge;d.setAttribute("position",new be(c,3));let p=new Gt({transparent:!0,depthWrite:!1,blending:Ku,uniforms:{formation:{value:1},opacity:{value:0},density:{value:r.getPixelRatio()}},vertexShader:`uniform float formation; uniform float density; varying float brightness;
      void main(){
        vec3 p=position * max(.006,formation);
        float spread=sin(formation*3.14159)*.23;
        p += vec3(sin(position.y*8.),cos(position.z*7.),sin(position.x*9.))*spread;
        vec4 mv=modelViewMatrix*vec4(p,1.);
        gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp(16.*density / -mv.z,1.,5.);
        brightness=.45+.55*fract(sin(dot(position,vec3(12.9898,78.233,43.2)))*43758.5453);
      }`,fragmentShader:`uniform float opacity; varying float brightness;
      void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
      gl_FragColor=vec4(vec3(.84,.89,1.),pow(1.-r,1.4)*opacity*brightness);}`}),m=new sr(d,p);return m.name="Idea_structure_samples",i.add(m),{assembly:i,model:n,components:s,particles:m,anchors:s.filter(g=>g.node.userData.capability),update(g,f,_,v){let x=Math.max(g.explode,_.explode),y=g.wire+(1-g.wire)*_.wireframe,A=g.solid*(1-_.wireframe);n.visible=A>.003;for(let M of a){let C=M.userData.isGlass,L=M.userData.capability==="mo",U=v.id&&v.id!=="mo",z=L&&U?1-v.amount*.86:1,V=A*z<.995||C;M.transparent!==V&&(M.transparent=V,M.needsUpdate=!0),M.opacity=M.userData.originalOpacity*A*z,M.depthWrite=A*z>.95&&!C;let H=M.userData.capability===v.id;M.color.copy(M.userData.originalColor),H&&M.color.lerp(o,v.amount*.15),M.userData.isEnergy&&(M.emissiveIntensity=.6+g.activation*2)}for(let M of s)M.node.position.copy(M.position).addScaledVector(M.explode,x*.85),M.node.userData.capability===v.id&&v.id!=="mo"&&M.node.position.addScaledVector(M.explode,v.amount*.25),M.node.quaternion.copy(M.quaternion),M.role==="rotor"&&M.node.rotateZ(f*.19*g.activation*(/Rear/.test(M.node.name)?-1:1)),M.role==="gimbal"&&M.node.rotateZ(Math.sin(f*.12)*.14*g.activation),M.wire.position.copy(M.node.position),M.wire.quaternion.copy(M.node.quaternion),M.wire.scale.copy(M.node.scale),M.wire.visible=y>.003;for(let M of u)M.material.opacity=y*.65;m.visible=g.particles>.003,p.uniforms.opacity.value=g.particles,p.uniforms.formation.value=g.formation},dispose(){let g=new Set;i.traverse(f=>{f.geometry&&g.add(f.geometry)}),g.forEach(f=>f.dispose()),a.forEach(f=>f.dispose()),u.forEach(f=>f.material.dispose()),p.dispose()}}}var Cd=gt(()=>{Jn();Ad()});function lr(r){let e=new Rt;return e.color.setScalar(r),e}var Pa,Id=gt(()=>{Jn();Pa=class extends ir{constructor(){super();let e=new Xn;e.deleteAttribute("uv");let t=new Sn({side:oc}),n=new Sn,i=new Yn(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);let s=new ze(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);let a=new ze(e,n);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);let o=new ze(e,n);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);let l=new ze(e,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let c=new ze(e,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);let h=new ze(e,n);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);let u=new ze(e,n);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let d=new ze(e,lr(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);let p=new ze(e,lr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let m=new ze(e,lr(17));m.position.set(14.904,12.198,-1.832),m.scale.set(.15,4.265,6.331),this.add(m);let g=new ze(e,lr(43));g.position.set(-.462,8.89,14.52),g.scale.set(4.38,5.441,.088),this.add(g);let f=new ze(e,lr(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let _=new ze(e,lr(100));_.position.set(0,20,0),_.scale.set(1,.1,1),this.add(_)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}}});function Pd(r,e){let t=new Pa,n=new nr(e),i=n.fromScene(t,.04);r.environment=i.texture,r.environmentIntensity=1.35,t.dispose(),n.dispose();let s=new Zn(15856639,5);s.position.set(3,5,4);let a=new Zn(13227497,3.5);a.position.set(-4,2,-2);let o=new Zn(16769467,2);o.position.set(1,-3,2);let l=new Yn(16770498,5,6,2);return l.position.set(0,0,1.2),r.add(s,a,o,l),{core:l,dispose(){i.dispose()}}}var Ld=gt(()=>{Jn();Id()});function Dd(){let r=matchMedia("(max-width: 760px)").matches,e=navigator.connection?.saveData||navigator.deviceMemory&&navigator.deviceMemory<=4||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4;return{mobile:r,constrained:e,pixelRatio:Math.min(devicePixelRatio||1,e?1:r?1.4:1.75)}}var La,Nd=gt(()=>{La=class{constructor(e,t){this.renderer=e,this.maxRatio=t,this.samples=[],this.lastAdjustment=0,this.fps=60}sample(e,t){if(e<=0||e>.25||(this.samples.push(e),this.samples.length<120)||(this.fps=1/(this.samples.reduce((s,a)=>s+a,0)/this.samples.length),this.samples.length=0,t-this.lastAdjustment<6))return;let n=this.renderer.getPixelRatio(),i=this.fps<38?Math.max(.75,n*.8):this.fps>57?Math.min(this.maxRatio,n+.1):n;Math.abs(i-n)>.01&&(this.renderer.setPixelRatio(i),this.lastAdjustment=t)}}});function Ud(){let r=new ft;r.name="Interactive_capability_diagrams";let e=new Map,t=new Mn({color:15785923,transparent:!0,opacity:0,depthWrite:!1}),n=new Rt({color:16313299,transparent:!0,opacity:0,depthWrite:!1}),i=new Yr(.055,10,8);function s(l,c,h=!1){let u=c.map(m=>new T(...m));h&&u.push(u[0].clone());let d=new Ge().setFromPoints(u),p=new jn(d,t.clone());return l.add(p),p}function a(l,c,h=1){let u=new ze(i,n.clone());return u.position.set(...c),u.scale.setScalar(h),l.add(u),u}function o(l,c){let h=new ft;h.name=`Capability_${l}`,h.position.z=.65,r.add(h);let u=c(h);e.set(l,{group:h,update:u,amount:0})}return o("technology",l=>{let c=[];for(let h=0;h<3;h++){let u=new ft;l.add(u),s(u,[[-.78,-.48,0],[.78,-.48,0],[.78,.48,0],[-.78,.48,0]],!0),s(u,[[-.78,.25,0],[.78,.25,0]]);for(let d=0;d<3;d++)a(u,[-.62+d*.13,.36,0],.45);c.push(u)}return s(l,[[0,-.85,-.25],[0,.85,.25]]),(h,u)=>c.forEach((d,p)=>{d.position.set((p-1)*.2*h,(p-1)*.28*h,(p-1)*.5*h),d.rotation.y=-.18*h})}),o("ai",l=>{let c=[[0,0,.15],[-.85,.5,0],[.8,.55,0],[-.7,-.65,0],[.75,-.5,0],[0,.9,-.2],[.1,-.95,-.15]],h=c.map(u=>a(l,u));for(let[u,d]of[[0,1],[0,2],[0,3],[0,4],[1,5],[2,5],[3,6],[4,6],[1,3],[2,4]])s(l,[c[u],c[d]]);return(u,d)=>h.forEach((p,m)=>p.scale.setScalar(1+.18*Math.sin(d*1.8-m)*u))}),o("design",l=>{for(let h=-2;h<=2;h++){let u=h*.4;s(l,[[-1,u,-.1],[1,u,-.1]]),s(l,[[u,-1,-.1],[u,1,-.1]])}let c=s(l,[[-.75,-.7,0],[-.75,.7,0],[0,-.05,0],[.75,.7,0],[.75,-.7,0]]);for(let h of[[-.75,-.7,0],[-.75,.7,0],[0,-.05,0],[.75,.7,0],[.75,-.7,0]])a(l,h,.85);return h=>{c.position.z=h*.25}}),o("strategy",l=>{let c=[[-.9,-.65,0],[-.45,-.2,.05],[.1,-.2,.1],[.1,.45,.15],[.85,.65,.2]];s(l,c),c.forEach(u=>a(l,u));let h=a(l,c[0],1.6);return(u,d)=>{let p=d*.5%4,m=Math.floor(p),g=p-m;h.position.fromArray(c[m]).lerp(new T(...c[m+1]),g)}}),{root:r,update(l,c,h,u,d){let p=!1;return e.forEach((m,g)=>{let f=g===l?c:0;m.amount+=(f-m.amount)*(d?1:1-Math.exp(-u*8)),p||=Math.abs(f-m.amount)>.001,m.group.visible=m.amount>.003,m.group.scale.setScalar(.5+m.amount*.5),m.group.traverse(_=>{_.material&&(_.material.opacity=m.amount*.78)}),m.update?.(m.amount,h)}),p},dispose(){r.traverse(l=>{l.geometry?.dispose(),l.material?.dispose()}),t.dispose(),n.dispose(),i.dispose()}}}var Od=gt(()=>{Jn()});async function Bd(r){let e=Dd(),t;try{let m=function(){let g=r.getBoundingClientRect();d=Math.max(1,g.width),p=Math.max(1,g.height),i.aspect=d/p,i.updateProjectionMatrix(),t.setSize(d,p,!1)};t=new ea({canvas:r,antialias:!e.constrained,alpha:!0,powerPreference:"default"}),t.setPixelRatio(e.pixelRatio),t.outputColorSpace=it,t.toneMapping=Ju,t.toneMappingExposure=1.05;let n=new ir,i=new at(34,1,.1,60),s=Pd(n,t),a;try{a=await Rd(t,e)}catch(g){throw s.dispose(),g}n.add(a.assembly);let o=Ud();a.assembly.add(o.root);let l=new Sa,c=new te,h=new T,u=new La(t,e.pixelRatio),d=1,p=1;return m(),{engine:a,renderer:t,profile:e,monitor:u,resize:m,render(g,f,_,v,x,y,A){a.update(g,f,v,A);let C=(d/p<.95?11.8:10.8)/_.zoom;i.position.set(.6+_.parallaxX*.14,.3-_.parallaxY*.12,C),i.lookAt(0,0,0),a.assembly.rotation.set(.16-A.amount*.06+_.x,-.26+A.amount*.15+_.y+x,-.055),a.assembly.scale.setScalar(1-Math.max(g.explode,v.explode)*.1),s.core.intensity=1+g.activation*4,u.sample(y,f);let L=o.update(A.id,A.amount,f,y,A.reduced);return t.render(n,i),L},projectAnchors(){return a.anchors.map(g=>(h.fromArray(g.node.userData.hotspot||[0,0,0]).applyMatrix4(g.node.matrixWorld),h.project(i),{id:g.node.userData.capability,x:(h.x*.5+.5)*d,y:(-.5*h.y+.5)*p,visible:h.z>-1&&h.z<1&&Math.abs(h.x)<.98&&Math.abs(h.y)<.98}))},pick(g,f){let _=r.getBoundingClientRect();c.set((g-_.left)/_.width*2-1,-(f-_.top)/_.height*2+1),l.setFromCamera(c,i);let v=l.intersectObject(a.model,!0);for(let x of v){let y=x.object;for(;y&&!y.userData.capability;)y=y.parent;if(y?.userData.capability)return y.userData.capability}return v.length?"mo":null},dispose(){a.assembly.remove(o.root),o.dispose(),a.dispose(),s.dispose(),t.dispose()}}}catch(n){throw t?.dispose(),n}}var Fd=gt(()=>{Jn();Cd();Ld();Nd();Od()});function Qn(r,e,t){let n=Ft((t-r)/(e-r));return n*n*(3-2*n)}function Kc(r,e=!1){let t=Ft(r,0,3);return e?{particles:0,formation:1,wire:0,solid:1,explode:0,activation:1}:{particles:1-Qn(.65,1.15,t),formation:Qn(0,.7,t),wire:Qn(.35,.95,t)*(1-Qn(1.45,2.15,t)),solid:Qn(1.35,1.95,t),explode:Qn(1.05,1.6,t)*(1-Qn(2,2.9,t)),activation:Qn(2.55,3,t)}}var Ft,cr,Jc=gt(()=>{Ft=(r,e=0,t=1)=>Math.max(e,Math.min(t,r));cr=[{name:"IDEA",description:"Everything begins somewhere.",position:.38},{name:"DESIGN",description:"Giving ideas structure.",position:1.1},{name:"BUILD",description:"Making complexity work.",position:2},{name:"REALITY",description:"Turning ideas into reality.",position:3}]});function zd(r,e){let t=new AbortController,n={signal:t.signal},i={x:0,y:0,zoom:1,parallaxX:0,parallaxY:0,lastInput:performance.now(),dragging:!1},s=null,a=()=>{i.lastInput=performance.now(),e()};r.addEventListener("pointerdown",l=>{!l.isPrimary||l.button!==0||(s={x:l.clientX,y:l.clientY,rotationX:i.x,rotationY:i.y,type:l.pointerType,pointerId:l.pointerId},i.dragging=!0,l.pointerType!=="touch"&&r.setPointerCapture(l.pointerId),a())},n),r.addEventListener("pointermove",l=>{let c=r.getBoundingClientRect();if(s){if(l.pointerId!==s.pointerId)return;let h=l.clientX-s.x,u=l.clientY-s.y;if(s.type==="touch"&&Math.abs(u)>Math.abs(h)*1.25)return;i.y=s.rotationY+h*.007,i.x=Ft(s.rotationX+u*.005,-.9,.9),a()}else l.pointerType==="mouse"&&(i.parallaxX=(l.clientX-c.left)/c.width-.5,i.parallaxY=(l.clientY-c.top)/c.height-.5,e())},n);let o=l=>{s&&l.pointerId!==void 0&&l.pointerId!==s.pointerId||(s=null,i.dragging=!1)};return window.addEventListener("pointerup",o,n),window.addEventListener("blur",o,n),r.addEventListener("pointercancel",o,n),r.addEventListener("pointerleave",()=>{i.parallaxX=i.parallaxY=0,e()},n),r.addEventListener("keydown",l=>{let c={ArrowLeft:()=>i.y-=.14,ArrowRight:()=>i.y+=.14,ArrowUp:()=>i.x=Ft(i.x-.14,-.9,.9),ArrowDown:()=>i.x=Ft(i.x+.14,-.9,.9),"+":()=>i.zoom=Ft(i.zoom+.1,.75,1.35),"=":()=>i.zoom=Ft(i.zoom+.1,.75,1.35),"-":()=>i.zoom=Ft(i.zoom-.1,.75,1.35)};c[l.key]&&(l.preventDefault(),c[l.key](),a())},n),{state:i,zoom(l){i.zoom=Ft(i.zoom+l,.75,1.35),a()},reset(){i.x=i.y=i.parallaxX=i.parallaxY=0,i.zoom=1,a()},dispose(){t.abort()}}}var kd=gt(()=>{Jc()});var ag={};function $c(r="Choose a point to meet Mo and explore the work."){cancelAnimationFrame(hn),hn=0,document.body.dataset.experience="fallback",document.body.dataset.phase="hero",Gd.style.opacity="1",Ct.style.visibility="hidden",ss.hidden=!0,pt.refreshPoster(),document.querySelector("#explore-engine").hidden=!0,document.querySelector(".stage-navigation").hidden=!0,Vd.textContent=r,qd()}function Rn(){!hn&&!Ba&&It&&Na&&!document.hidden&&(hn=requestAnimationFrame(rg))}function rg(r){hn=0;let e=ur?Math.min((r-ur)/1e3,.075):1/60;ur=r,!rn&&!Pt&&(Ua+=e);let t=!1,i=(pt.selected?1:0)-Cn.amount;Cn.amount+=i*(Pt?1:1-Math.exp(-e*7)),!pt.selected&&Cn.amount<.001&&(Cn.id=null),Cn.reduced=Pt,t||=Math.abs(i)>.001;for(let c in rs){let h=rs[c]-Mi[c];Mi[c]=Pt?rs[c]:Mi[c]+h*(1-Math.exp(-e*10)),t||=Math.abs(h)>.001}for(let c in is){let h=Number(cn[c])-is[c];is[c]+=h*(Pt?1:1-Math.exp(-e*7)),t||=Math.abs(h)>.001}let s=r-nn.state.lastInput>4500&&!nn.state.dragging,a=rn?hr:!Pt&&s&&!pt.selected?Math.sin(Ua*.12)*.08:0;hr+=(a-hr)*(Pt?1:.035);let o=It.render(Mi,Ua,nn.state,is,hr,e,Cn),l=(ei||!!pt.selected||ns>2.55)&&Mi.solid>.7;document.querySelector("#capability-hotspots").hidden=!l;for(let c of It.projectAnchors()){let h=ig.get(c.id);h&&(h.hidden=!c.visible,h.style.left=`${c.x}px`,h.style.top=`${c.y}px`)}(!rn&&!Pt||t||o||Math.abs(a-hr)>.001)&&Rn()}function ts(){let r=Oa.getBoundingClientRect(),e=Math.max(1,Oa.offsetHeight-innerHeight),t=Ft(-r.top/e);ei=t<.12,ns=Ft((t-.12)/.88*3,0,3),rs=Kc(ns,ei||!!pt.selected);let n=ei?-1:Math.min(3,Math.floor(ns+.42));n!==Qc&&(Qc=n,document.body.dataset.phase=ei?"hero":cr[n].name.toLowerCase(),ei||(document.querySelector("#stage-index").textContent=`0${n+1}`,document.querySelector("#stage-name").textContent=n===3?"Turning ideas into reality.":cr[n].name,document.querySelector("#stage-description").textContent=n===3?"":cr[n].description),Wd.forEach((i,s)=>{s===n?i.setAttribute("aria-current","step"):i.removeAttribute("aria-current")})),document.querySelector("#stage-progress").style.transform=`scaleX(${ei?0:ns/3})`,Rn()}function Hd(r){pt.close(!1);let e=Oa.offsetHeight-innerHeight,t=scrollY+Oa.getBoundingClientRect().top,n=.12+cr[r].position/3*.88;scrollTo({top:t+n*e,behavior:Pt?"instant":"smooth"})}function Da(){for(let e of["explode","wireframe"])ss.querySelector(`[data-action="${e}"]`).setAttribute("aria-pressed",String(cn[e]));let r=ss.querySelector('[data-action="pause"]');r.setAttribute("aria-pressed",String(rn)),r.setAttribute("aria-label",rn?"Resume engine motion":"Pause engine motion"),r.title=rn?"Resume motion":"Pause motion"}function qd(){Ba||(Ba=!0,cancelAnimationFrame(hn),Xd.abort(),eh?.disconnect(),th?.disconnect(),nn?.dispose(),jd?.(),It?.dispose())}async function sg(){if(new URLSearchParams(location.search).get("engine")==="fallback"){$c();return}try{if(It=await Bd(Ct),Ba){It.dispose();return}nn=zd(Ct,Rn),Ct.removeAttribute("aria-hidden"),Ct.setAttribute("tabindex","0"),Ct.setAttribute("role","img"),Ct.setAttribute("aria-label","Mo\u2019s interactive M and O signature. Click a part to explore, or use the labelled point buttons. Drag to rotate. Arrow keys rotate; plus or minus zoom."),document.body.dataset.experience="ready",ss.hidden=!1,Vd.textContent="",ts(),It.resize(),It.render(Mi,Ua,nn.state,is,0,1/60,Cn),Gd.style.opacity="0",Da(),window.addEventListener("scroll",ts,{...Tt,passive:!0}),Wd.forEach((r,e)=>r.addEventListener("click",()=>Hd(e),Tt)),document.querySelector("#explore-engine").addEventListener("click",r=>pt.select("technology",r.currentTarget),Tt),jd=pt.subscribe(r=>{r&&(Cn.id=r),nn.reset(),r&&(cn.explode=cn.wireframe=!1,Da()),ts(),Rn()}),pt.selected&&(Cn.id=pt.selected,ts()),document.querySelector("#capability-example").addEventListener("click",r=>{pt.selected==="design"&&(r.preventDefault(),Hd(0))},Tt),Ct.addEventListener("pointerdown",r=>{r.isPrimary&&r.button===0&&(yt={x:r.clientX,y:r.clientY,time:performance.now(),pointerId:r.pointerId,maxDistance:0})},Tt),Ct.addEventListener("pointermove",r=>{yt?.pointerId===r.pointerId&&(yt.maxDistance=Math.max(yt.maxDistance,Math.hypot(r.clientX-yt.x,r.clientY-yt.y)))},Tt),Ct.addEventListener("pointerup",r=>{if(!(!yt||yt.pointerId!==r.pointerId)){if(r.isPrimary&&Sh(yt,{x:r.clientX,y:r.clientY,time:performance.now(),pointerId:r.pointerId,maxDistance:yt.maxDistance})&&Mi.solid>.7){let e=It.pick(r.clientX,r.clientY);e&&pt.select(e,Ct)}yt=null}},Tt),window.addEventListener("pointerup",r=>{yt?.pointerId===r.pointerId&&(yt=null)},Tt),Ct.addEventListener("pointercancel",r=>{yt?.pointerId===r.pointerId&&(yt=null)},Tt),window.addEventListener("blur",()=>{yt=null},Tt),ss.addEventListener("click",r=>{let e=r.target.closest("[data-action]");if(e){switch(e.dataset.action){case"explode":cn.explode=!cn.explode;break;case"wireframe":cn.wireframe=!cn.wireframe;break;case"pause":rn=!rn,rn||(Pt=!1),ur=0;break;case"zoom-in":nn.zoom(.1);break;case"zoom-out":nn.zoom(-.1);break;case"reset":pt.close(!1),nn.reset(),cn.explode=cn.wireframe=!1,hr=0;break}nn.state.lastInput=performance.now(),Da(),Rn()}},Tt),eh=new IntersectionObserver(([r])=>{Na=r.isIntersecting,ur=0,Na?Rn():(cancelAnimationFrame(hn),hn=0)}),eh.observe(document.querySelector(".experience-stage")),th=new ResizeObserver(()=>{It.resize(),ts()}),th.observe(Ct),document.addEventListener("visibilitychange",()=>{cancelAnimationFrame(hn),hn=0,ur=0,Rn()},Tt),nh.addEventListener("change",r=>{Pt=r.matches,rn=Pt,Da(),Rn()},Tt),Ct.addEventListener("webglcontextlost",r=>{r.preventDefault(),$c()},Tt),window.creationEngineDiagnostics=()=>({fps:Math.round(It.monitor.fps),pixelRatio:It.renderer.getPixelRatio(),drawCalls:It.renderer.info.render.calls,triangles:It.renderer.info.render.triangles,stage:ei?"hero":cr[Qc].name,selection:pt.selected,paused:rn,reducedMotion:Pt,visible:Na}),Rn()}catch(r){console.warn("Creation Engine could not initialise:",r.message),$c()}}var Oa,Ct,Vd,ss,Gd,nh,Wd,Xd,Tt,It,nn,hn,Ba,Na,rn,Pt,ur,Ua,hr,rs,Mi,ns,ei,Qc,cn,is,Cn,ig,yt,jd,eh,th,Yd=gt(()=>{Fd();kd();Jc();qa();ja();Oa=document.querySelector("#experience"),Ct=document.querySelector("#engine-canvas"),Vd=document.querySelector("#engine-status"),ss=document.querySelector("#engine-controls"),Gd=document.querySelector("#engine-poster"),nh=matchMedia("(prefers-reduced-motion: reduce)"),Wd=[...document.querySelectorAll("[data-stage]")],Xd=new AbortController,Tt={signal:Xd.signal},hn=0,Ba=!1,Na=!0,rn=nh.matches,Pt=nh.matches,ur=0,Ua=0,hr=0,rs=Kc(3,!0),Mi={...rs},ns=3,ei=!0,Qc=-1,cn={explode:!1,wireframe:!1},is={explode:0,wireframe:0},Cn={id:null,amount:0,reduced:Pt},ig=new Map([...document.querySelectorAll("#capability-hotspots [data-capability]")].map(r=>[r.dataset.capability,r])),yt=null;window.addEventListener("pagehide",r=>{r.persisted||qd()},Tt);sg()});Promise.resolve().then(()=>(qa(),Ah)).then(()=>Promise.resolve().then(()=>(Yd(),ag))).catch(r=>{console.warn("Creation Engine modules unavailable:",r.message),document.body.dataset.experience="fallback",document.body.dataset.phase="hero",document.querySelector("#engine-status").textContent="Choose a point to meet Mo and explore the work.",document.querySelector("#explore-engine").hidden=!0,document.querySelector(".stage-navigation").hidden=!0});
/*! For license information please see home-YM3IJXPA.js.LEGAL.txt */
