import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, Eye, EyeOff, MapPin, Calendar, Utensils, ChevronUp, ChevronDown } from 'lucide-react';
import { deletePost, updatePost } from '../../lib/firebase';

export default function PostsTable({ posts, onEdit, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [sortKey,    setSortKey]    = useState('createdAt');
  const [sortDir,    setSortDir]    = useState('desc');

  const sorted = [...posts].sort((a, b) => {
    const aVal = a[sortKey]?.toDate ? a[sortKey].toDate() : a[sortKey];
    const bVal = b[sortKey]?.toDate ? b[sortKey].toDate() : b[sortKey];
    if (aVal < bVal) return sortDir === 'asc' ? -1 :  1;
    if (aVal > bVal) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeletingId(post.id);
    try {
      await deletePost(post.id);
      onRefresh();
    } catch (err) {
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (post) => {
    setTogglingId(post.id);
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      await updatePost(post.id, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  const SortBtn = ({ col, label }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 font-semibold hover:text-primary-600 transition-colors"
      aria-label={`Sort by ${label}`}
    >
      {label}
      {sortKey === col
        ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
        : <ChevronDown className="w-3 h-3 opacity-30" />}
    </button>
  );

  if (!posts.length) {
    return (
      <div className="text-center py-16 text-charcoal-400">
        <div className="text-5xl mb-4">📋</div>
        <p className="font-medium">No posts yet. Create your first drive entry!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-50 shadow-card">
      <table className="w-full text-sm" aria-label="Blog posts management table">
        <thead>
          <tr className="bg-primary-50 text-charcoal-500 text-xs uppercase tracking-wide">
            <th className="text-left px-5 py-4"><SortBtn col="title" label="Title" /></th>
            <th className="text-left px-4 py-4 hidden md:table-cell"><SortBtn col="date" label="Date" /></th>
            <th className="text-left px-4 py-4 hidden lg:table-cell">Location</th>
            <th className="text-left px-4 py-4 hidden lg:table-cell">Meals</th>
            <th className="text-left px-4 py-4">Status</th>
            <th className="text-right px-5 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-50 bg-white">
          {sorted.map(post => {
            const dateObj = post.date?.toDate ? post.date.toDate() : new Date(post.date);
            const dateStr = isNaN(dateObj) ? '—' : format(dateObj, 'dd MMM yyyy');
            const isPublished = post.status === 'published';

            return (
              <tr
                key={post.id}
                id={`post-row-${post.id}`}
                className="hover:bg-cream-50 transition-colors"
              >
                {/* Title */}
                <td className="px-5 py-4 font-medium text-charcoal-800 max-w-[200px]">
                  <div className="flex items-center gap-3">
                    {post.images?.[0]?.url && (
                      <img
                        src={post.images[0].url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <span className="line-clamp-2">{post.title}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-4 text-charcoal-500 hidden md:table-cell whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary-400" />
                    {dateStr}
                  </span>
                </td>

                {/* Location */}
                <td className="px-4 py-4 text-charcoal-500 hidden lg:table-cell">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {post.location || '—'}
                  </span>
                </td>

                {/* Meals */}
                <td className="px-4 py-4 text-charcoal-500 hidden lg:table-cell">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-primary-400" />
                    {post.mealsServed ? Number(post.mealsServed).toLocaleString('en-IN') : '—'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isPublished
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Toggle publish */}
                    <button
                      id={`toggle-status-${post.id}`}
                      onClick={() => handleToggleStatus(post)}
                      disabled={togglingId === post.id}
                      title={isPublished ? 'Unpublish' : 'Publish'}
                      aria-label={isPublished ? `Unpublish ${post.title}` : `Publish ${post.title}`}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        isPublished
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      id={`edit-post-${post.id}`}
                      onClick={() => onEdit(post)}
                      title="Edit post"
                      aria-label={`Edit ${post.title}`}
                      className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      id={`delete-post-${post.id}`}
                      onClick={() => handleDelete(post)}
                      disabled={deletingId === post.id}
                      title="Delete post"
                      aria-label={`Delete ${post.title}`}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
