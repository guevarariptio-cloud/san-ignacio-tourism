import { useEffect } from 'react';

export function usePrefetchImages(urls: string[]) {
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const linkElements: HTMLLinkElement[] = [];

      urls.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
        linkElements.push(link);
      });

      return () => {
        linkElements.forEach((link) => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [urls]);
}

export function useImagePreloader(images: string[]) {
  useEffect(() => {
    const loadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loadImages());
    } else {
      setTimeout(loadImages, 200);
    }
  }, [images]);
}

export function useScrollPositionRestoration() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      sessionStorage.setItem('scrollPosition', scrollY.toString());
    };

    const restoreScroll = () => {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    restoreScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}

export function useLazyLoading() {
  useEffect(() => {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach((img) => {
        img.setAttribute('loading', 'lazy');
      });
    } else {
      // Fallback for browsers that don't support native lazy loading
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
      script.onload = () => {
        // @ts-ignore
        if (window.lozad) {
          // @ts-ignore
          const observer = window.lozad('.lazy', {
            loaded: (el: Element) => {
              el.classList.add('loaded');
            },
          });
          observer.observe();
        }
      };
      document.body.appendChild(script);
    }
  }, []);
}
