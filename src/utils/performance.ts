// Performance monitoring utilities

export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  static startTimer(name: string): void {
    this.metrics.set(name, performance.now());
  }

  static endTimer(name: string): number {
    const startTime = this.metrics.get(name);
    if (!startTime) {
      console.warn(`Timer "${name}" was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);

    // Log slow operations in production
    if (import.meta.env.PROD && duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startTimer(name);
      try {
        const result = await fn();
        const duration = this.endTimer(name);
        console.log(`${name} completed in ${duration.toFixed(2)}ms`);
        resolve(result);
      } catch (error) {
        this.endTimer(name);
        reject(error);
      }
    });
  }

  static logWebVitals(): void {
    // Log Web Vitals if available
    if ('web-vitals' in window) {
      // This would require installing web-vitals package
      // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
      console.log('Web Vitals tracking enabled');
    }
  }
}

// Image optimization utilities
export const optimizeImageForUpload = (file: File, maxSize: number = 1024): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size <= maxSize * 1024) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        } else {
          resolve(file);
        }
      }, 'image/jpeg', 0.85);
    };

    img.src = URL.createObjectURL(file);
  });
};