export function getMoonScreen(
  W: number,
  H: number,
): { x: number; y: number; r: number } {
  if (!W || !H) return { x: 0.66, y: 0.36, r: 0.2 };
  const aspect = W / H;
  const halfFovY = (65 * Math.PI) / 360;
  const tanHalfFovY = Math.tan(halfFovY);
  const dz = 8.5;
  const ndcX = 3.1 / (dz * tanHalfFovY * aspect);
  const ndcY = 1.5 / (dz * tanHalfFovY);

  const rFrac = 2.2 / (dz * tanHalfFovY) / 2;
  return {
    x: (ndcX + 1) / 2,
    y: (1 - ndcY) / 2,
    r: rFrac,
  };
}
