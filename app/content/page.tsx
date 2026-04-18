'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Loader as Loader2,
  Image as ImageIcon,
  Download,
} from 'lucide-react';
import type { GeneratedMarketingImage } from '@/types/content-engine';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContentEnginePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [images, setImages] = useState<GeneratedMarketingImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) processImageFile(file);
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !imagePreview) return;

    setFormState('loading');
    setError(null);
    setImages([]);

    try {
      const form = new FormData();
      form.append('image', imageFile);
      if (description.trim()) {
        form.append('description', description.trim());
      }

      const response = await fetch('/api/content-images', {
        method: 'POST',
        body: form,
      });

      const text = await response.text();
      let data: { error?: string; images?: GeneratedMarketingImage[] } = {};
      try {
        data = text ? (JSON.parse(text) as typeof data) : {};
      } catch {
        throw new Error(
          response.ok
            ? 'Server returned invalid JSON. Please try again.'
            : `Request failed (${response.status}). If the image is very large, try resizing under ~8MP or use a JPEG under 5MB.`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || 'Could not generate images.');
      }

      setImages(data.images ?? []);
      setFormState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setFormState('error');
    }
  };

  const reset = () => {
    setFormState('idle');
    setImages([]);
    setError(null);
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="animate-orb absolute -top-60 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.07] dark:opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.7) 0%, transparent 70%)' }}
        />
        <div className="page-bg-grid absolute inset-0" />
      </div>

      <div className="relative z-10 min-h-screen">
        <nav className="flex items-center justify-between px-6 py-6 pr-14 max-w-6xl mx-auto md:pr-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white text-base tracking-tight">MarketMind</span>
          </div>
        </nav>

        <div className="px-6 pb-24 max-w-5xl mx-auto">
          {formState === 'idle' || formState === 'error' ? (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <p className="text-xs text-blue-400 font-medium uppercase tracking-widest mb-2">
                  Content engine
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  Product → 3 marketing images
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
                  We read your packshot, write headlines for the frame, then render photoreal ads with
                  GPT Image (text on image). If your account can’t use that model yet, we fall back to
                  DALL·E 3. Optional notes steer mood and audience.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
                <div
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                    isDragging
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.02]'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleImageDrop}
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />

                  {imagePreview ? (
                    <div className="relative p-4">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-56 object-contain rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-6 right-6 w-7 h-7 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 dark:bg-black/60 dark:hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="mt-3 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs text-slate-500">{imageFile?.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 dark:bg-white/[0.04] dark:border-white/10 flex items-center justify-center mb-4">
                        <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Product image required
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-600">PNG, JPG, or WEBP</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Optional context
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Premium skincare for busy professionals, minimal aesthetic…"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-white/[0.05] transition-all"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!imagePreview}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-white/10 dark:disabled:text-slate-600 text-white font-semibold text-base transition-all duration-200 glow-blue-sm disabled:shadow-none"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate 3 images
                </button>
              </form>
            </div>
          ) : formState === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-28 animate-fade-in">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-2xl animate-ping bg-blue-500/10" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Creating your visuals…</h2>
              <p className="text-slate-600 dark:text-slate-500 text-sm text-center max-w-sm">
                Planning three ad concepts with on-image copy, then rendering (often 1–2 minutes).
              </p>
            </div>
          ) : (
            <div className="animate-scale-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                  <p className="text-xs text-blue-400 font-medium uppercase tracking-widest mb-1">
                    Ready
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your 3 marketing images</h2>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl glass-card text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all self-start sm:self-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Start over
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {images.map((item, i) => (
                  <article
                    key={`${item.title}-${i}`}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col dark:border-white/10 dark:bg-white/[0.02]"
                  >
                    <div className="aspect-square bg-slate-100 relative dark:bg-black/40">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                          <p className="text-sm text-red-400">{item.error || 'Failed to render.'}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed flex-1">{item.summary}</p>
                      {item.modelUsed && (
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-600">
                          Model: {item.modelUsed}
                        </p>
                      )}
                      {item.imageUrl && (
                        <a
                          href={item.imageUrl}
                          download={`marketmind-${i + 1}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Open / save
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
