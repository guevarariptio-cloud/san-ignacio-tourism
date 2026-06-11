import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, currentIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Galería compacta */}
      <div className="space-y-4">
        {/* Vista principal */}
        <div
          className="relative w-full aspect-video overflow-hidden rounded-2xl group cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <OptimizedImage
            src={images[currentIndex]}
            alt={`${title} - imagen ${currentIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            priority={true}
            quality="high"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Navegación principal */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 glass-dark rounded-full p-3 hover:bg-white/30 transition-all active:scale-95"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 glass-dark rounded-full p-3 hover:bg-white/30 transition-all active:scale-95"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Indicador de posición */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 glass-dark text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Botón expandir */}
          <div className="absolute top-4 right-4 z-20 glass-dark rounded-full p-3 group-hover:bg-white/30 transition-all">
            <X className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? 'border-emerald-500 ring-2 ring-emerald-300'
                    : 'border-white/20 hover:border-white/40'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <OptimizedImage
                  src={image}
                  alt={`${title} - miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  quality="low"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal expandido */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            {/* Imagen principal */}
            <div className="relative w-full h-full">
              <OptimizedImage
                src={images[currentIndex]}
                alt={`${title} - imagen ${currentIndex + 1}`}
                className="w-full h-full object-contain"
                quality="high"
              />

              {/* Navegación */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 glass-light rounded-full p-4 hover:bg-white/20 transition-all active:scale-95"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-8 h-8 text-white" />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 glass-light rounded-full p-4 hover:bg-white/20 transition-all active:scale-95"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-8 h-8 text-white" />
                  </button>

                  {/* Indicador */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 glass-dark text-white px-4 py-2 rounded-full font-medium">
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 z-30 glass-light rounded-full p-4 hover:bg-white/20 transition-all active:scale-95"
              aria-label="Cerrar"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            {/* Miniaturas en modal */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-x-auto max-w-xs">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentIndex === index
                        ? 'border-emerald-400 ring-2 ring-emerald-300'
                        : 'border-white/20 hover:border-white/40 opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${title} - miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                      quality="low"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
