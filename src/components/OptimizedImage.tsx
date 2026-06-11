import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: 'low' | 'medium' | 'high';
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  quality = 'high',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const getOptimizedSrc = (baseSrc: string, width: number): string => {
    if (baseSrc.includes('pexels.com')) {
      const url = new URL(baseSrc);
      url.searchParams.set('auto', 'compress');
      url.searchParams.set('cs', 'tinysrgb');
      url.searchParams.set('w', width.toString());
      url.searchParams.set('dpr', '2');
      return url.toString();
    }
    return baseSrc;
  };

  const qualityWidths = {
    low: 400,
    medium: 800,
    high: 1260,
  };

  const width = qualityWidths[quality];

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {isInView && (
        <img
          src={getOptimizedSrc(src, width)}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          srcSet={`
            ${getOptimizedSrc(src, 400)} 400w,
            ${getOptimizedSrc(src, 800)} 800w,
            ${getOptimizedSrc(src, 1260)} 1260w
          `}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

export function OptimizedBackground({
  src,
  children,
  className = '',
  priority = false,
}: {
  src: string;
  children?: React.ReactNode;
  className?: string;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const backgroundImage = isInView
    ? `url(${src}?auto=compress&cs=tinysrgb&w=1920)`
    : 'none';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {isInView && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      {children}
    </div>
  );
}
