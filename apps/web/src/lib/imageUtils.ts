const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const MAX_SIZE_KB = 500;

export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }

      if (height > MAX_HEIGHT) {
        width = (width * MAX_HEIGHT) / height;
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not compress image'));
            return;
          }

          if (blob.size > MAX_SIZE_KB * 1024) {
            canvas.toBlob(
              (compressedBlob) => {
                if (compressedBlob) {
                  resolve(compressedBlob);
                } else {
                  reject(new Error('Could not compress image to target size'));
                }
              },
              'image/jpeg',
              0.7
            );
          } else {
            resolve(blob);
          }
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = () => reject(new Error('Could not load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function getImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}
