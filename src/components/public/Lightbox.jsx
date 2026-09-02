import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = React.useState(startIndex ?? 0);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  const img = images[current];

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      {/* Close */}
      <button
        id="lightbox-close-btn"
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20
                   rounded-full flex items-center justify-center text-white transition-colors"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium
                      glass-dark px-4 py-1.5 rounded-full">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          id="lightbox-prev-btn"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10
                     hover:bg-white/20 rounded-full flex items-center justify-center
                     text-white transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-4xl max-h-[80vh] w-full mx-16" onClick={e => e.stopPropagation()}>
        <img
          src={img.url}
          alt={img.altText || 'Charity drive photo'}
          className="w-full h-full object-contain rounded-xl shadow-2xl"
          loading="lazy"
        />
        {img.altText && (
          <p className="text-center text-white/60 text-sm mt-3 font-medium">{img.altText}</p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          id="lightbox-next-btn"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10
                     hover:bg-white/20 rounded-full flex items-center justify-center
                     text-white transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              id={`lightbox-thumb-${i}`}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              aria-label={`View image ${i + 1}`}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200
                          ${i === current ? 'border-amber-400 scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
