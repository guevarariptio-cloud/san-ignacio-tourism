import { useState, useCallback, useEffect } from 'react';

export type MessageType = 'success' | 'error' | 'info';

interface Message {
  type: MessageType;
  text: string;
}

export function useNotification(autoCloseDuration = 3000) {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = useCallback((text: string, type: MessageType = 'success') => {
    setMessage({ type, text });
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  useEffect(() => {
    if (!message || autoCloseDuration <= 0) return;

    const timer = setTimeout(clearMessage, autoCloseDuration);
    return () => clearTimeout(timer);
  }, [message, autoCloseDuration, clearMessage]);

  return { message, showMessage, clearMessage };
}

export function useCarousel(itemCount: number, initialIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(initialIndex, Math.max(0, itemCount - 1))
  );

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + itemCount) % itemCount);
  }, [itemCount]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % itemCount);
  }, [itemCount]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, itemCount - 1)));
  }, [itemCount]);

  return { currentIndex, goToPrevious, goToNext, goToIndex, setCurrentIndex };
}

export function useImagePreviews() {
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);

  const addPreviews = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newPreviews = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const removePreview = useCallback((index: number) => {
    setPreviews(prev => {
      const preview = prev[index];
      if (preview) {
        URL.revokeObjectURL(preview.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearPreviews = useCallback(() => {
    previews.forEach(preview => {
      URL.revokeObjectURL(preview.url);
    });
    setPreviews([]);
  }, [previews]);

  return { previews, addPreviews, removePreview, clearPreviews };
}
