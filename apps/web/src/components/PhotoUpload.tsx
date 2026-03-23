'use client';

import { useState, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { Camera, Image, Loader2, X } from 'lucide-react';
import { compressImage, isImageFile, getImagePreviewUrl } from '@/lib/imageUtils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from '@/components/ui/Toast';

interface PhotoUploadProps {
  onCapture: (photoUrl: string) => void;
  onError?: (error: string) => void;
}

export function PhotoUpload({ onCapture, onError }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!isImageFile(file)) {
        toast.error('Por favor selecciona una imagen');
        return;
      }

      try {
        setIsCompressing(true);
        const compressed = await compressImage(file);
        setIsCompressing(false);

        const previewFile = new File([compressed], file.name, { type: 'image/jpeg' });
        setPreview(getImagePreviewUrl(previewFile));

        setIsUploading(true);
        const photoUrl = await uploadToCloudinary(compressed, `employee_${Date.now()}.jpg`);
        setIsUploading(false);

        onCapture(photoUrl);
        toast.success('Foto subida correctamente');
      } catch (error) {
        setIsCompressing(false);
        setIsUploading(false);
        const message = error instanceof Error ? error.message : 'Error al procesar imagen';
        toast.error(message);
        onError?.(message);
      }
    },
    [onCapture, onError]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const isLoading = isCompressing || isUploading;

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-48 h-48">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-full border-4 border-[#FDDC41] shadow-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className={clsx(
              'absolute -top-2 -right-2 w-10 h-10 rounded-full',
              'bg-red-500 text-white flex items-center justify-center',
              'hover:bg-red-600 transition-colors shadow-md'
            )}
            aria-label="Cambiar foto"
          >
            <X size={20} />
          </button>
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="text-white animate-spin" size={32} />
            </div>
          )}
        </div>
      ) : (
        <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#DC143C]/10 flex items-center justify-center">
            <Camera size={32} className="text-[#DC143C]" />
          </div>
          <p className="text-sm text-gray-500 text-center px-4">
            Agrega tu foto de perfil
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={clsx(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200',
            'border-2 border-[#DC143C] text-[#DC143C]',
            'hover:bg-[#DC143C]/10 min-h-[44px]',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Image size={20} />
          Galería
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isLoading}
          className={clsx(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200',
            'bg-[#DC143C] text-white',
            'hover:bg-[#DC143C]/90 min-h-[44px]',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Camera size={20} />
          Cámara
        </button>
      </div>

      {isCompressing && (
        <p className="text-sm text-gray-500 animate-pulse">
          Comprimiendo imagen...
        </p>
      )}
      {isUploading && (
        <p className="text-sm text-gray-500 animate-pulse">
          Subiendo foto...
        </p>
      )}
    </div>
  );
}
