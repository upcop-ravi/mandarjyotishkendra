import React from 'react';
import PostCard, { PostCardSkeleton } from './PostCard';
import { LayoutGrid } from 'lucide-react';

export default function BlogFeed({ posts, loading }) {
  // Show 6 skeletons while loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4
                      text-center">
        <div className="text-6xl animate-float">🌱</div>
        <h3 className="font-heading font-bold text-2xl text-charcoal-700">No Stories Yet</h3>
        <p className="text-charcoal-500 max-w-sm">
          Our team is out there serving meals right now. Check back soon for photo stories
          from our community drives!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Result count */}
      <div className="flex items-center gap-2 text-sm text-charcoal-500 mb-6">
        <LayoutGrid className="w-4 h-4" />
        <span>
          Showing <strong className="text-primary-600">{posts.length}</strong> drive{posts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
