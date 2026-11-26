// Matched to the authored GLB frontages. Thresholds are model estimates, not surveys.
export const SHOPS = [
  { id: 'black-sheep', name: 'Black Sheep Shop', door: [68.69,-1398.10], outward: [1,0.02],
    subtitle: 'Gifts from the Lake District' },
  { id: 'picnic', name: 'Lakeside Picnic', door: [72.55,-374.55], outward: [-.478,.878],
    subtitle: 'Waterhead café and takeaway' },
] as const;

export type Shop = typeof SHOPS[number];

export function shopAtDoor(x: number,z: number): Shop | undefined {
  return SHOPS.find(shop => {
    const dx=x-shop.door[0], dz=z-shop.door[1];
    return Math.hypot(dx,dz)<3.85 && dx*shop.outward[0]+dz*shop.outward[1]>-.15;
  });
}

export function doorstep(shop: Shop): [number,number] {
  return [shop.door[0]+shop.outward[0]*1.65,shop.door[1]+shop.outward[1]*1.65];
}
