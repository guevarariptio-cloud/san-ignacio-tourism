import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export function ModernGallery({ images }: { images: GalleryImage[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIndex = images.findIndex((img) => img.id === selectedId);

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedId(images[selectedIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedId(images[selectedIndex - 1].id);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, idx) => (
          <div
            key={image.id}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer card-premium animate-fade-in-up card-stagger-${(idx % 6) + 1}`}
            onClick={() => setSelectedId(image.id)}
          >
            <div className="aspect-video overflow-hidden">
              <OptimizedImage
                src={image.url}
                alt={image.title}
                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                quality="medium"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Info overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-lg font-bold text-white mb-1">{image.title}</h3>
              {image.description && (
                <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedId !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="relative max-w-4xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src={images[selectedIndex].url}
                alt={images[selectedIndex].title}
                className="w-full h-auto max-h-[80vh] object-contain"
                quality="high"
              />

              {/* Navigation buttons */}
              {selectedIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 glass-premium rounded-full p-2 hover:bg-white/30 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}

              {selectedIndex < images.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 glass-premium rounded-full p-2 hover:bg-white/30 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 glass-premium rounded-full p-2 hover:bg-white/30 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-premium px-4 py-2 rounded-full text-white text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 glass-premium rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{images[selectedIndex].title}</h2>
              {images[selectedIndex].description && (
                <p className="text-white/70 leading-relaxed">{images[selectedIndex].description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
