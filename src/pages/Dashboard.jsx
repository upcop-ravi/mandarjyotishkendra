import React, { useState, useEffect, useCallback } from 'react';
import AdminNav       from '../components/admin/AdminNav';
import MetricWidget   from '../components/admin/MetricWidget';
import CreatePostForm from '../components/admin/CreatePostForm';
import PostsTable     from '../components/admin/PostsTable';
import { fetchAllPosts } from '../lib/firebase';
import {
  FileText, Image as ImageIcon, Activity, Clock, Menu, X,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [activeTab,   setActiveTab]   = useState('overview');
  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [editPost,    setEditPost]    = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  // When edit is triggered — switch tab and scroll
  const handleEdit = (post) => {
    setEditPost(post);
    setActiveTab('create');
    setMobileSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called after create/update
  const handleFormSuccess = () => {
    loadPosts();
    setEditPost(null);
    setActiveTab('manage');
  };

  // Metrics
  const totalPosts     = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const draftPosts     = posts.filter(p => p.status === 'draft').length;
  const totalPhotos    = posts.reduce((acc, p) => acc + (p.images?.length ?? 0), 0);
  const totalMeals     = posts
    .filter(p => p.status === 'published')
    .reduce((acc, p) => acc + (Number(p.mealsServed) || 0), 0);
  const recentPosts    = [...posts]
    .sort((a, b) => {
      const at = a.createdAt?.toDate?.() ?? new Date(0);
      const bt = b.createdAt?.toDate?.() ?? new Date(0);
      return bt - at;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Sidebar — desktop */}
      <div className="hidden md:flex flex-col">
        <AdminNav activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setEditPost(null); }} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebar && (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          onClick={() => setMobileSidebar(false)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <AdminNav activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setMobileSidebar(false); setEditPost(null); }} />
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-primary-50 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Mobile menu btn */}
          <button
            id="admin-mobile-menu-btn"
            className="md:hidden p-2 rounded-lg text-charcoal-600 hover:bg-cream-100 transition-colors"
            onClick={() => setMobileSidebar(o => !o)}
            aria-label="Open admin menu"
          >
            {mobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <h1 className="font-heading font-bold text-xl text-charcoal-800">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'create'   && (editPost ? 'Edit Post' : 'Create New Post')}
              {activeTab === 'manage'   && 'Manage Posts'}
            </h1>
            <p className="text-xs text-charcoal-400 mt-0.5">
              {format(new Date(), "EEEE, dd MMMM yyyy")}
            </p>
          </div>

          {/* Quick action */}
          <button
            id="quick-create-btn"
            onClick={() => { setEditPost(null); setActiveTab('create'); }}
            className="btn-primary text-sm py-2 hidden sm:flex items-center gap-2"
          >
            + New Post
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-8">

          {/* ── OVERVIEW TAB ──────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8 animate-fade-in">
              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricWidget
                  icon={FileText} label="Total Posts" value={totalPosts}
                  sub={`${publishedPosts} published · ${draftPosts} draft`}
                  color="bg-primary-500"
                />
                <MetricWidget
                  icon={ImageIcon} label="Photos Uploaded" value={totalPhotos}
                  sub="Across all drives"
                  color="bg-amber-500"
                />
                <MetricWidget
                  icon={Activity} label="Meals Documented" value={totalMeals}
                  sub="Published drives only"
                  color="bg-teal-600"
                  trend={`${publishedPosts} active drives`}
                />
                <MetricWidget
                  icon={Clock} label="Drafts Pending" value={draftPosts}
                  sub="Awaiting review"
                  color="bg-rose-400"
                />
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-2xl shadow-card border border-primary-50 p-6">
                <h2 className="font-heading font-bold text-lg text-charcoal-800 mb-5">
                  Recent Activity
                </h2>
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
                  </div>
                ) : recentPosts.length === 0 ? (
                  <p className="text-charcoal-400 text-sm">No posts yet.</p>
                ) : (
                  <ul className="divide-y divide-primary-50">
                    {recentPosts.map(post => {
                      const createdAt = post.createdAt?.toDate?.() ?? new Date();
                      return (
                        <li
                          key={post.id}
                          className="flex items-center gap-4 py-3 hover:bg-cream-50 -mx-2 px-2 rounded-xl transition-colors"
                        >
                          {post.images?.[0]?.url ? (
                            <img src={post.images[0].url} alt=""
                                 className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 text-xl">
                              🍱
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-charcoal-800 text-sm truncate">{post.title}</p>
                            <p className="text-xs text-charcoal-400">{format(createdAt, 'dd MMM yyyy, hh:mm a')}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {post.status}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── CREATE / EDIT TAB ─────────────────────────────── */}
          {activeTab === 'create' && (
            <div className="bg-white rounded-2xl shadow-card border border-primary-50 p-6 sm:p-8 animate-fade-in">
              {editPost && (
                <div className="flex items-center gap-3 mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-amber-600 text-sm font-medium">
                    ✏️ Editing: <strong>{editPost.title}</strong>
                  </span>
                  <button
                    onClick={() => setEditPost(null)}
                    className="ml-auto text-xs text-charcoal-400 hover:text-charcoal-600"
                  >
                    Cancel edit
                  </button>
                </div>
              )}
              <CreatePostForm
                editPost={editPost}
                onSuccess={handleFormSuccess}
              />
            </div>
          )}

          {/* ── MANAGE POSTS TAB ──────────────────────────────── */}
          {activeTab === 'manage' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-charcoal-500 text-sm">
                  {posts.length} total {posts.length === 1 ? 'entry' : 'entries'}
                </p>
                <button
                  onClick={loadPosts}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  ↺ Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
                </div>
              ) : (
                <PostsTable posts={posts} onEdit={handleEdit} onRefresh={loadPosts} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
