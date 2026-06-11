import React, { useRef, useMemo } from 'react';
import { Upload, X, ChevronLeft, ChevronRight, Trash2, Check } from 'lucide-react';
import { updateItemGallery, removeFromItemGallery } from '../lib/imageUpload';
import { useNotification, useCarousel, useImagePreviews } from '../hooks/useAdminHelpers';

type ItemType = 'attraction' | 'business' | 'gastronomy';

interface GalleryManagerProps {
  itemId: string;
  itemType: ItemType;
  itemName: string;
  currentGallery: string[];
  onGalleryUpdate: (newGallery: string[]) => void;
}

export function GalleryManager({
  itemId,
  itemType,
  itemName,
  currentGallery,
  onGalleryUpdate,
}: GalleryManagerProps) {
  const [gallery, setGallery] = React.useState<string[]>(currentGallery || []);
  const [uploading, setUploading] = React.useState(false);
  const [removing, setRemoving] = React.useState<string | null>(null);
  const { message, showMessage } = useNotification();
  const { previews, addPreviews, removePreview, clearPreviews } = useImagePreviews();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allImages = useMemo(
    () => [...gallery, ...previews.map(p => p.url)],
    [gallery, previews]
  );

  const { currentIndex, goToPrevious, goToNext, goToIndex } = useCarousel(
    allImages.length,
    0
  );

  const currentImage = allImages[currentIndex];
  const currentImageType = currentIndex < gallery.length ? 'saved' : 'preview';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addPreviews(event.target.files);
    }
  };

  const handleUploadGallery = async () => {
    if (previews.length === 0) {
      showMessage('Selecciona al menos una imagen', 'error');
      return;
    }

    setUploading(true);
    try {
      const files = previews.map(p => p.file);
      const uploadedUrls = await updateItemGallery(itemType, itemId, files);
      const updatedGallery = [...gallery, ...uploadedUrls];
      setGallery(updatedGallery);
      clearPreviews();
      onGalleryUpdate(updatedGallery);
      showMessage(`${uploadedUrls.length} imagen(es) agregada(s)`, 'success');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      showMessage('Error al subir imágenes', 'error');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    setRemoving(imageUrl);
    try {
      await removeFromItemGallery(itemType, itemId, imageUrl);
      const updatedGallery = gallery.filter(url => url !== imageUrl);
      setGallery(updatedGallery);
      onGalleryUpdate(updatedGallery);
      showMessage('Imagen eliminada', 'success');
      if (currentIndex >= updatedGallery.length && currentIndex > 0) {
        goToIndex(currentIndex - 1);
      }
    } catch (error) {
      showMessage('Error al eliminar imagen', 'error');
      console.error(error);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 animate-fade-in-up ${
          message.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : message.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {allImages.length > 0 && (
        <div className="space-y-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={currentImage}
              alt={`Galería ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 glass-dark text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {allImages.length}
            </div>

            {currentImageType === 'saved' && (
              <button
                onClick={() => handleRemoveImage(currentImage)}
                disabled={removing === currentImage}
                className="absolute top-4 right-4 z-10 glass-dark hover:bg-red-600/80 rounded-full p-3 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            )}

            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 glass-dark hover:bg-white/30 rounded-full p-3 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 glass-dark hover:bg-white/30 rounded-full p-3 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {previews.length > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                  currentImageType === 'preview'
                    ? 'bg-blue-500/80'
                    : 'bg-emerald-500/80'
                }`}>
                  {currentImageType === 'preview' ? 'NUEVA' : 'GUARDADA'}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={`${index}-${image.substring(0, 20)}`}
                onClick={() => goToIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? 'border-emerald-500 ring-2 ring-emerald-300'
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 transition-all hover:border-emerald-500 hover:bg-emerald-50/30">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-3 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-all">
              <Upload className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Arrastra imágenes aquí</p>
              <p className="text-sm text-gray-500">o haz clic para seleccionar</p>
            </div>
          </button>
        </div>

        {previews.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                {previews.length}
              </span>
              {previews.length === 1 ? 'Imagen' : 'Imágenes'} para agregar
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-500/20" />
                  <button
                    onClick={() => removePreview(index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleUploadGallery}
              disabled={uploading}
              className="w-full btn-premium-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Agregar {previews.length} imagen{previews.length !== 1 ? 'es' : ''}
                </>
              )}
            </button>
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-emerald-700">{gallery.length}</span>
            <span className="text-gray-600">
              {gallery.length === 1 ? ' imagen en la galería' : ' imágenes en la galería'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
