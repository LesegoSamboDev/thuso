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
  ImagePlus,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import type { GeneratedMarketingImage } from '@/types/content-engine';

type FormState = 'idle' | 'loading' | 'success' | 'error';

async function parseJsonResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(text.slice(0, 200) || 'Invalid response from server.');
  }
}

export default function ContentPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [images, setImages] = useState<GeneratedMarketingImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const processImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setFormState('loading');
    setError(null);
    setImages(null);

    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      if (description.trim()) fd.append('description', description.trim());

      const response = await fetch('/api/content-images', {
        method: 'POST',
        body: fd,
      });

      const data = (await parseJsonResponse(response)) as {
        images?: GeneratedMarketingImage[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed. Please try again.');
      }

      if (!data.images || !Array.isArray(data.images)) {
        throw new Error('Unexpected response from server.');
      }

      setImages(data.images);
      setFormState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setFormState('error');
    }
  };

  const reset = () => {
    setFormState('idle');
    setImages(null);
    setError(null);
  };

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-[#060a14] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="animate-orb absolute -top-60 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 mm-grid-dots" />
      </div>

      <div className="relative z-10 min-h-screen">
        <nav className="flex items-center justify-between gap-3 px-6 py-6 max-w-5xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/analyze"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors hidden sm:inline"
            >
              Strategy →
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                <ImagePlus className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white text-base tracking-tight truncate max-w-[7rem] sm:max-w-none">
                MarketMind
              </span>
            </div>
          </div>
        </nav>

        <div className="px-6 pb-24 max-w-5xl mx-auto">
          {formState === 'idle' || formState === 'error' ? (
            <div className="animate-slide-up max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  Marketing images
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-base">
                  Upload your product photo. We&apos;ll plan three distinct ad concepts and generate
                  matching visuals.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                    isDragging
                      ? 'border-indigo-400 bg-indigo-500/10'
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-100/80 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.02]'
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
                        className="w-full h-48 object-contain rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-6 right-6 w-7 h-7 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-900 dark:bg-black/60 dark:border-white/20 dark:hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="mt-3 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs text-slate-500">{imageFile?.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 dark:bg-white/[0.04] dark:border-white/10 flex items-center justify-center mb-4">
                        <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-300 mb-1">
                        Drop your product image here (required)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-600">PNG, JPG, or WEBP</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Optional context
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brand tone, audience, promo angle — anything that should influence the ads..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 dark:bg-white/[0.03] dark:border-white/10 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500/50 dark:focus:bg-white/[0.05] transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!imageFile}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-white/10 dark:disabled:text-slate-600 text-white font-semibold text-base transition-all duration-200 glow-blue-sm disabled:shadow-none"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate 3 ad images
                </button>
              </form>
            </div>
          ) : formState === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-32 animate-fade-in max-w-xl mx-auto text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-2xl animate-ping bg-indigo-500/10" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Creating your creatives&hellip;
              </h2>
              <p className="text-slate-600 dark:text-slate-500 text-sm">
                Vision planning plus three image generations — this can take a minute.
              </p>
            </div>
          ) : images ? (
            <div className="animate-scale-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-widest mb-1">
                    Ready
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your marketing images</h2>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl glass-card text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all self-start sm:self-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  New upload
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {images.map((item, i) => (
                  <article
                    key={`${item.title}-${i}`}
                    className="glass-card rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 flex flex-col"
                  >
                    <div className="aspect-square bg-slate-200/80 dark:bg-black/40 relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-sm text-red-400 mb-1">Could not generate</p>
                          <p className="text-xs text-slate-500">{item.error || 'Unknown error'}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                        {item.summary}
                      </p>
                      {item.modelUsed && (
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                          {item.modelUsed}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
