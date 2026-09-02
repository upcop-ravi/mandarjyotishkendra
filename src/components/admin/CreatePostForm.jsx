import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Timestamp, createPost, updatePost, uploadImage } from '../../lib/firebase';
import ImageUploader from './ImageUploader';
import { Save, Send, Loader } from 'lucide-react';

const DRIVE_TYPES = [
  'Weekly Drive', 'Special Event', 'Festival Drive',
  'Emergency Relief', 'School Meal', 'Elder Care',
];

const EMPTY_FORM = {
  title:        '',
  date:         '',
  location:     '',
  driveType:    'Weekly Drive',
  mealsServed:  '',
  description:  '',
  status:       'draft',
};

export default function CreatePostForm({ editPost, onSuccess }) {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [files,   setFiles]   = useState([]);   // ImageUploader state
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editPost) {
      const dateObj = editPost.date?.toDate ? editPost.date.toDate() : new Date(editPost.date);
      setForm({
        title:       editPost.title       ?? '',
        date:        isNaN(dateObj) ? '' : dateObj.toISOString().slice(0, 10),
        location:    editPost.location    ?? '',
        driveType:   editPost.driveType   ?? 'Weekly Drive',
        mealsServed: editPost.mealsServed ?? '',
        description: editPost.description ?? '',
        status:      editPost.status      ?? 'draft',
      });
      // Existing images (already uploaded — url-based, no file obj)
      setFiles((editPost.images ?? []).map(img => ({
        url:      img.url,
        altText:  img.altText ?? '',
        preview:  img.url,
      })));
    } else {
      setForm(EMPTY_FORM);
      setFiles([]);
    }
  }, [editPost]);

  const field = (key) => ({
    value:    form[key],
    onChange: (e) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e, statusOverride) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!form.title.trim())  return setError('Event title is required.');
    if (!form.date)          return setError('Event date is required.');
    if (!form.location.trim()) return setError('Location is required.');

    setSaving(true);
    try {
      // Upload new images (files with .file blob) to Firebase Storage
      const uploadedImages = await Promise.all(
        files.map(async (f) => {
          if (f.file) {
            const path = `posts/${Date.now()}_${f.file.name}`;
            const url  = await uploadImage(f.file, path);
            return { url, altText: f.altText };
          }
          return { url: f.url, altText: f.altText };
        })
      );

      const payload = {
        ...form,
        status:     statusOverride ?? form.status,
        date:       Timestamp.fromDate(new Date(form.date)),
        mealsServed: Number(form.mealsServed) || 0,
        images:     uploadedImages,
      };

      if (editPost?.id) {
        await updatePost(editPost.id, payload);
        setSuccess('Post updated successfully!');
      } else {
        await createPost(payload);
        setSuccess(payload.status === 'published'
          ? 'Post published successfully!'
          : 'Draft saved successfully!');
        setForm(EMPTY_FORM);
        setFiles([]);
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError('Failed to save post. Please check your Firebase config and try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border border-primary-100 bg-cream-50 font-body
                    text-charcoal-800 placeholder-charcoal-400 focus:outline-none
                    focus:ring-2 focus:ring-primary-400 focus:border-transparent transition`;

  const labelCls = `block text-sm font-medium text-charcoal-700 mb-1.5`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Status / Error banners */}
      {error && (
        <div role="alert" id="form-error" className="bg-rose-50 border border-rose-200 text-rose-700
                                    rounded-xl px-4 py-3 text-sm">{error}</div>
      )}
      {success && (
        <div role="status" id="form-success" className="bg-emerald-50 border border-emerald-200 text-emerald-700
                                      rounded-xl px-4 py-3 text-sm">{success}</div>
      )}

      {/* Row: Title + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="post-title" className={labelCls}>Event Title *</label>
          <input id="post-title" type="text" placeholder="e.g. Sunday Community Drive — Laxmi Nagar"
                 className={inputCls} {...field('title')} aria-required="true" />
        </div>
        <div>
          <label htmlFor="post-date" className={labelCls}>Event Date *</label>
          <input id="post-date" type="date" className={inputCls} {...field('date')} aria-required="true" />
        </div>
      </div>

      {/* Row: Location + Drive Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="post-location" className={labelCls}>Location / Neighborhood *</label>
          <input id="post-location" type="text" placeholder="e.g. Laxmi Nagar, East Delhi"
                 className={inputCls} {...field('location')} aria-required="true" />
        </div>
        <div>
          <label htmlFor="post-drive-type" className={labelCls}>Drive Type</label>
          <select id="post-drive-type" className={inputCls} {...field('driveType')}>
            {DRIVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Meals served */}
      <div>
        <label htmlFor="post-meals" className={labelCls}>Meals Distributed</label>
        <input id="post-meals" type="number" min="0" placeholder="e.g. 250"
               className={inputCls} {...field('mealsServed')} />
      </div>

      {/* Description — Markdown editor */}
      <div data-color-mode="light">
        <label className={labelCls}>Impact Story / Description</label>
        <MDEditor
          id="post-description"
          value={form.description}
          onChange={val => setForm(f => ({ ...f, description: val ?? '' }))}
          height={260}
          preview="edit"
          aria-label="Post description editor"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className={labelCls}>Photos</label>
        <ImageUploader files={files} onChange={setFiles} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          id="save-draft-btn"
          onClick={e => handleSubmit(e, 'draft')}
          disabled={saving}
          className="btn-secondary flex items-center gap-2 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          Save as Draft
        </button>

        <button
          type="button"
          id="publish-post-btn"
          onClick={e => handleSubmit(e, 'published')}
          disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {saving ? 'Saving…' : 'Publish Post'}
        </button>
      </div>
    </form>
  );
}
