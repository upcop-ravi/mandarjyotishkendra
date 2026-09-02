import React, { useState } from 'react';
import { MapPin, Calendar, Utensils, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { format } from 'date-fns';
import Lightbox from './Lightbox';

// ── Skeleton loader ──────────────────────────────────────
export function PostCardSkeleton() {
  return (
    <div className="blog-card">
      <div className="skeleton w-full h-52" />
      <div className="p-5 flex flex-col gap-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-16 w-full" />
        <div className="skeleton h-8 w-1/3" />
      </div>
    </div>
  );
}

// ── Image Carousel ────────────────────────────────────────
function ImageCarousel({ images, onOpenLightbox }) {
  const [idx, setIdx] = useState(0);

  if (!images?.length) {
    return (
      <div className="w-full h-52 bg-gradient-to-br from-primary-100 to-primary-200
                      flex items-center justify-center text-primary-400 text-4xl">
        🍱
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setIdx(i => (i - 1 + images.length) % images.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx(i => (i + 1) % images.length);
  };

  return (
    <div className="relative group overflow-hidden h-52 cursor-pointer"
         onClick={() => onOpenLightbox(idx)}>
      {/* Image */}
      <img
        src={images[idx].url}
        alt={images[idx].altText || 'Charity drive'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Zoom hint */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300
                      flex items-center justify-center opacity-0 group-hover:opacity-100">
        <ZoomIn className="w-10 h-10 text-white drop-shadow" />
      </div>

      {/* Nav arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40
                       rounded-full flex items-center justify-center text-white
                       opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40
                       rounded-full flex items-center justify-center text-white
                       opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === idx ? 'bg-white w-4' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Count badge */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs
                        font-medium px-2 py-1 rounded-full backdrop-blur-sm">
          📷 {images.length}
        </div>
      )}
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────
export default function PostCard({ post }) {
  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const dateObj  = post.date?.toDate ? post.date.toDate() : new Date(post.date);
  const dateStr  = isNaN(dateObj) ? '' : format(dateObj, 'dd MMM yyyy');

  const openLightbox = (idx) => {
    setLightboxStart(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <article
        className="blog-card"
        id={`post-card-${post.id}`}
        aria-label={`Drive: ${post.title}`}
      >
        {/* Image carousel */}
        <ImageCarousel
          images={post.images || []}
          onOpenLightbox={openLightbox}
        />

        {/* Drive type badge */}
        {post.driveType && (
          <div className="px-5 pt-4">
            <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold
                             px-3 py-1 rounded-full uppercase tracking-wide">
              {post.driveType}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="font-heading font-bold text-xl text-charcoal-800 line-clamp-2 hover:text-primary-600
                         transition-colors">
            {post.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal-500">
            {dateStr && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-400" />
                {dateStr}
              </span>
            )}
            {post.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                {post.location}
              </span>
            )}
          </div>

          {/* Description excerpt */}
          {post.description && (
            <p className="text-charcoal-600 text-sm leading-relaxed line-clamp-3">
              {post.description
                .replace(/#{1,6}\s/g, '')      // strip headings
                .replace(/\*\*(.*?)\*\*/g, '$1') // strip bold
                .replace(/\*(.*?)\*/g, '$1')    // strip italic
                .replace(/`(.*?)`/g, '$1')      // strip code
                .replace(/🍚|🍽️|👥|🌡️|📍|🙏/g, '')  // strip emoji
                .replace(/[-•]\s/g, '')         // strip bullets
                .replace(/\n+/g, ' ')           // collapse newlines
                .trim()
                .substring(0, 220) + '…'}
            </p>
          )}


          {/* Meals served pill */}
          {post.mealsServed && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200
                            rounded-xl px-4 py-2.5 w-fit">
              <Utensils className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">
                {Number(post.mealsServed).toLocaleString('en-IN')} meals distributed
              </span>
            </div>
          )}
        </div>
      </article>

      {/* Lightbox */}
      {lightboxOpen && post.images?.length > 0 && (
        <Lightbox
          images={post.images}
          startIndex={lightboxStart}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
