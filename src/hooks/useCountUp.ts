import { useEffect, useState } from "react";

/**
 * Hook для анимированного счётчика чисел
 * @param end - Конечное значение
 * @param duration - Длительность анимации в мс (по умолчанию 2000)
 * @param start - Начальное значение (по умолчанию 0)
 */
export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0
): number {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (easeOutCubic)
      const easedPercentage = 1 - Math.pow(1 - percentage, 3);
      const currentCount = Math.floor(start + (end - start) * easedPercentage);

      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}
