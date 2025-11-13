 /**
  * PUBLIC_INTERFACE
  * Build a public URL path for figma images placed under public/figmaimages.
  * Example: getFigmaAsset('figma_image_642_5363.png') => `${process.env.PUBLIC_URL}/figmaimages/figma_image_642_5363.png`
  */
export function getFigmaAsset(filename) {
  const base = process.env.PUBLIC_URL || '';
  return `${base}/figmaimages/${filename}`;
}
