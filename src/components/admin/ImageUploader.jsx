import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ files, onChange }) {
  const onDrop = useCallback((accepted) => {
    const newFiles = accepted.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      altText: '',
    }));
    onChange([...files, ...newFiles]);
  }, [files, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  const removeFile = (idx) => {
    const updated = [...files];
    URL.revokeObjectURL(updated[idx].preview);
    updated.splice(idx, 1);
    onChange(updated);
  };

  const updateAlt = (idx, val) => {
    const updated = [...files];
    updated[idx] = { ...updated[idx], altText: val };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        id="image-dropzone"
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        aria-label="Image upload area"
      >
        <input {...getInputProps()} id="image-file-input" aria-label="Upload images" />
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                         ${isDragActive ? 'bg-amber-100' : 'bg-primary-100'} mb-2`}>
          {isDragActive
            ? <Upload className="w-7 h-7 text-amber-600 animate-bounce" />
            : <ImageIcon className="w-7 h-7 text-primary-600" />}
        </div>
        <p className="font-semibold text-charcoal-700 text-center">
          {isDragActive ? 'Drop your images here!' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-charcoal-400 text-center">
          or <span className="text-primary-600 underline cursor-pointer">browse to upload</span>
        </p>
        <p className="text-xs text-charcoal-400">JPG, PNG, WEBP — max 10 MB each</p>
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((f, i) => (
            <div
              key={i}
              id={`image-preview-${i}`}
              className="relative rounded-xl overflow-hidden border border-primary-100 bg-cream-50"
            >
              {/* Thumbnail */}
              <div className="relative group">
                <img
                  src={f.preview || f.url}
                  alt={f.altText || `Upload ${i + 1}`}
                  className="w-full h-28 object-cover"
                />
                {/* Remove button */}
                <button
                  type="button"
                  id={`remove-image-${i}`}
                  aria-label={`Remove image ${i + 1}`}
                  onClick={() => removeFile(i)}
                  className="absolute top-2 right-2 w-7 h-7 bg-rose-500 hover:bg-rose-600
                             rounded-full flex items-center justify-center text-white
                             opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Alt text input */}
              <div className="p-2">
                <input
                  type="text"
                  id={`image-alt-${i}`}
                  placeholder="Describe this image…"
                  value={f.altText}
                  onChange={e => updateAlt(i, e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-primary-100
                             bg-white focus:outline-none focus:ring-1 focus:ring-primary-400
                             text-charcoal-700 placeholder-charcoal-400"
                  aria-label={`Alt text for image ${i + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
