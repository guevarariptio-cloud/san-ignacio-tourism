import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>;
  currentImage?: string;
  label?: string;
  maxSize?: number; // en MB
}

export function ImageUpload({
  onUpload,
  currentImage,
  label = 'Subir imagen',
  maxSize = 5,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      setError(`La imagen no debe superar ${maxSize}MB`);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Subir archivo
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {preview && (
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500 hover:bg-emerald-50'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-8 h-8 mb-2 ${isLoading ? 'text-gray-400' : 'text-emerald-600'}`} />
            <p className="text-sm text-gray-700">
              {isLoading ? 'Subiendo...' : 'Arrastra o haz clic para subir'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF (máx {maxSize}MB)
            </p>
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
