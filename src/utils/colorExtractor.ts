// Utilitário para extrair cores dominantes de uma imagem
export interface ExtractedColors {
  primaryColor: string; // Cor mais escura (para face QR)
  backgroundColor: string; // Cor mais clara (para face selos)
  dominantColors: string[]; // Top 10 cores dominantes
}

// Converte RGB para luminância (0-1, onde 1 é mais claro)
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Converte RGB para hex
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Calcula distância entre duas cores RGB
function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  const [r1, g1, b1] = c1;
  const [r2, g2, b2] = c2;
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
}

export async function extractColorsFromImage(imageFile: File): Promise<ExtractedColors> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        // Redimensionar para análise mais rápida (max 100x100)
        const maxSize = 100;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Agrupar cores similares
        const colorMap = new Map<string, { count: number; r: number; g: number; b: number }>();
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Ignorar pixels transparentes ou quase transparentes
          if (a < 128) continue;

          // Quantizar cores (agrupar cores similares)
          const quantizedR = Math.round(r / 16) * 16;
          const quantizedG = Math.round(g / 16) * 16;
          const quantizedB = Math.round(b / 16) * 16;
          
          const key = `${quantizedR},${quantizedG},${quantizedB}`;
          
          if (colorMap.has(key)) {
            colorMap.get(key)!.count++;
          } else {
            colorMap.set(key, { count: 1, r: quantizedR, g: quantizedG, b: quantizedB });
          }
        }

        // Obter as cores mais dominantes (ignorar branco e preto puros)
        const colors = Array.from(colorMap.entries())
          .filter(([_, color]) => {
            // Filtrar branco e preto puros, e cores muito próximas
            const isWhite = color.r > 240 && color.g > 240 && color.b > 240;
            const isBlack = color.r < 15 && color.g < 15 && color.b < 15;
            return !isWhite && !isBlack;
          })
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 10); // Top 10 cores

        // Converter as cores dominantes para array de hex
        const dominantColors = colors.map(([_, color]) => rgbToHex(color.r, color.g, color.b));

        if (colors.length === 0) {
          // Fallback para cores padrão
          resolve({
            primaryColor: "#8B5CF6", // Roxo
            backgroundColor: "#F3F4F6", // Cinza claro
            dominantColors: ["#8B5CF6", "#F3F4F6", "#3B82F6", "#10B981", "#F97316", "#EF4444", "#EC4899", "#6366F1", "#14B8A6", "#1F2937"]
          });
          return;
        }

        // Se só temos uma cor dominante, criar uma versão mais clara
        if (colors.length === 1) {
          const color = colors[0][1];
          const luminance = getLuminance(color.r, color.g, color.b);
          
          if (luminance > 0.5) {
            // Cor é clara, criar uma versão mais escura para primary
            resolve({
              primaryColor: rgbToHex(
                Math.max(0, color.r - 60),
                Math.max(0, color.g - 60),
                Math.max(0, color.b - 60)
              ),
              backgroundColor: rgbToHex(color.r, color.g, color.b),
              dominantColors
            });
          } else {
            // Cor é escura, criar uma versão mais clara para background
            resolve({
              primaryColor: rgbToHex(color.r, color.g, color.b),
              backgroundColor: rgbToHex(
                Math.min(255, color.r + 60),
                Math.min(255, color.g + 60),
                Math.min(255, color.b + 60)
              ),
              dominantColors
            });
          }
          return;
        }

        // Pegar as duas cores mais contrastantes
        let bestPair = [colors[0][1], colors[1][1]];
        let maxContrast = 0;

        for (let i = 0; i < Math.min(colors.length, 5); i++) {
          for (let j = i + 1; j < Math.min(colors.length, 5); j++) {
            const color1 = colors[i][1];
            const color2 = colors[j][1];
            const contrast = colorDistance([color1.r, color1.g, color1.b], [color2.r, color2.g, color2.b]);
            
            if (contrast > maxContrast) {
              maxContrast = contrast;
              bestPair = [color1, color2];
            }
          }
        }

        // Determinar qual cor é mais escura (primary) e mais clara (background)
        const [color1, color2] = bestPair;
        const luminance1 = getLuminance(color1.r, color1.g, color1.b);
        const luminance2 = getLuminance(color2.r, color2.g, color2.b);

        const darkerColor = luminance1 < luminance2 ? color1 : color2;
        const lighterColor = luminance1 < luminance2 ? color2 : color1;

        resolve({
          primaryColor: rgbToHex(darkerColor.r, darkerColor.g, darkerColor.b),
          backgroundColor: rgbToHex(lighterColor.r, lighterColor.g, lighterColor.b),
          dominantColors
        });

      } catch (error) {
        console.error('Error extracting colors:', error);
        // Fallback para cores padrão
        resolve({
          primaryColor: "#8B5CF6",
          backgroundColor: "#F3F4F6",
          dominantColors: ["#8B5CF6", "#F3F4F6", "#3B82F6", "#10B981", "#F97316", "#EF4444", "#EC4899", "#6366F1", "#14B8A6", "#1F2937"]
        });
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(imageFile);
  });
}