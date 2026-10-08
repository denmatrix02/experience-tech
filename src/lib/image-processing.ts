/**
 * Studio White Background & Auto Background Removal Engine
 * Designed for ExperienceTech Product Photography & Catalogue Management.
 * 
 * Takes raw product photos, analyzes the background using perimeter flood-fill
 * and color distance thresholding, and replaces the background with pure studio white (#FFFFFF).
 */

export interface BackgroundProcessingOptions {
  /** Color difference tolerance (0 to 100). Default is 28. */
  tolerance?: number;
  /** Feather / smoothing radius in pixels (0 to 5). Default is 2. */
  feather?: number;
  /** Output format: 'image/jpeg' | 'image/png' | 'image/webp'. Default is 'image/jpeg'. */
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
  /** Quality between 0 and 1. Default is 0.94. */
  quality?: number;
}

/**
 * Loads an image from a URL, Blob, File, or existing element.
 */
function loadImage(source: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image for processing: ' + err));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

/**
 * Computes color distance between two RGBA pixels using Euclidean RGB distance.
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Automatically removes the photo background and replaces it with pure studio white (#FFFFFF).
 * Preserves foreground details (such as silver chassis, keys, screens) using perimeter flood fill.
 */
export async function autoRemoveBackgroundToWhite(
  source: string | File | Blob,
  options: BackgroundProcessingOptions = {}
): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Image processing must be executed in browser context.');
  }

  const {
    tolerance = 28,
    feather = 2,
    outputFormat = 'image/jpeg',
    quality = 0.94,
  } = options;

  const img = await loadImage(source);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  // Create processing canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D canvas context.');

  ctx.drawImage(img, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Sample perimeter border pixels to determine background baseline colors
  const samples: { r: number; g: number; b: number }[] = [];
  const step = Math.max(1, Math.floor(Math.min(width, height) / 80));

  // Top and Bottom borders
  for (let x = 0; x < width; x += step) {
    const topIdx = x * 4;
    samples.push({ r: data[topIdx], g: data[topIdx + 1], b: data[topIdx + 2] });

    const bottomIdx = ((height - 1) * width + x) * 4;
    samples.push({ r: data[bottomIdx], g: data[bottomIdx + 1], b: data[bottomIdx + 2] });
  }

  // Left and Right borders
  for (let y = 0; y < height; y += step) {
    const leftIdx = y * width * 4;
    samples.push({ r: data[leftIdx], g: data[leftIdx + 1], b: data[leftIdx + 2] });

    const rightIdx = (y * width + (width - 1)) * 4;
    samples.push({ r: data[rightIdx], g: data[rightIdx + 1], b: data[rightIdx + 2] });
  }

  // Calculate median / average background color
  let totalR = 0, totalG = 0, totalB = 0;
  for (const s of samples) {
    totalR += s.r;
    totalG += s.g;
    totalB += s.b;
  }
  const avgBgR = totalR / samples.length;
  const avgBgG = totalG / samples.length;
  const avgBgB = totalB / samples.length;

  // Maximum distance threshold based on tolerance percentage (0 - 100) -> (0 - 441.67)
  const maxDistance = (tolerance / 100) * 441.67;

  // 2. Flood Fill from image boundaries to mark only outer background pixels
  // This prevents internal white keys/surfaces on the laptop from being stripped.
  const isBackground = new Uint8Array(width * height);
  const queue: number[] = [];

  // Helper to enqueue border pixels if they match background profile
  const checkAndEnqueue = (x: number, y: number) => {
    const idx = y * width + x;
    if (isBackground[idx]) return;

    const pIdx = idx * 4;
    const dist = colorDistance(data[pIdx], data[pIdx + 1], data[pIdx + 2], avgBgR, avgBgG, avgBgB);
    if (dist <= maxDistance) {
      isBackground[idx] = 1;
      queue.push(idx);
    }
  };

  // Push all outer perimeter boundary pixels
  for (let x = 0; x < width; x++) {
    checkAndEnqueue(x, 0);
    checkAndEnqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    checkAndEnqueue(0, y);
    checkAndEnqueue(width - 1, y);
  }

  // Breadth-First Flood Fill
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // 4 Neighbors
    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !isBackground[n]) {
        const pIdx = n * 4;
        const dist = colorDistance(data[pIdx], data[pIdx + 1], data[pIdx + 2], avgBgR, avgBgG, avgBgB);
        if (dist <= maxDistance) {
          isBackground[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // 3. Apply White Background Replacement with Edge Smoothing
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * 4;

      if (isBackground[idx] === 1) {
        // Pure studio white
        data[pIdx] = 255;     // R
        data[pIdx + 1] = 255; // G
        data[pIdx + 2] = 255; // B
        data[pIdx + 3] = 255; // Alpha
      } else if (feather > 0) {
        // Check if neighboring pixels are background for anti-aliasing / feathering
        let bgNeighborCount = 0;
        for (let dy = -feather; dy <= feather; dy++) {
          for (let dx = -feather; dx <= feather; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBackground[ny * width + nx] === 1) {
                bgNeighborCount++;
              }
            }
          }
        }

        const totalKernel = (feather * 2 + 1) * (feather * 2 + 1) - 1;
        if (bgNeighborCount > 0) {
          const blendFactor = (bgNeighborCount / totalKernel) * 0.45;
          data[pIdx] = Math.round(data[pIdx] * (1 - blendFactor) + 255 * blendFactor);
          data[pIdx + 1] = Math.round(data[pIdx + 1] * (1 - blendFactor) + 255 * blendFactor);
          data[pIdx + 2] = Math.round(data[pIdx + 2] * (1 - blendFactor) + 255 * blendFactor);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Clean up object URL if created
  if (typeof source !== 'string') {
    URL.revokeObjectURL(img.src);
  }

  return canvas.toDataURL(outputFormat, quality);
}
