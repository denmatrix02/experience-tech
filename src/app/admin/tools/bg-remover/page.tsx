'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Layers,
  Image as ImageIcon,
  Loader2,
  Copy,
} from 'lucide-react';
import { autoRemoveBackgroundToWhite } from '@/lib/image-processing';

export default function BackgroundRemoverPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(28);
  const [feather, setFeather] = useState(2);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const src = event.target?.result as string;
      setOriginalImage(src);
      processImage(src, tolerance, feather);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (src: string, tol: number, fth: number) => {
    setIsProcessing(true);
    try {
      const result = await autoRemoveBackgroundToWhite(src, {
        tolerance: tol,
        feather: fth,
        outputFormat: 'image/jpeg',
        quality: 0.95,
      });
      setProcessedImage(result);
    } catch (err: any) {
      alert('Error removing background: ' + (err?.message || err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReprocess = () => {
    if (originalImage) {
      processImage(originalImage, tolerance, feather);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `experiencetech-white-bg-${Date.now()}.jpg`;
    link.click();
  };

  const handleCopy = () => {
    if (!processedImage) return;
    navigator.clipboard.writeText(processedImage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-medium">
              🪄
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#0B192C]">
              Studio White Background Tool
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automatically strip cluttered backgrounds and convert product photos to pure e-commerce studio white (#FFFFFF).
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
        >
          <span>Go to Products Inventory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Preview Workspace */}
        <div className="lg:col-span-2 space-y-4">
          {!originalImage ? (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white hover:border-amber-500 transition-colors shadow-xs">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="studio-file-upload"
              />
              <label
                htmlFor="studio-file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-sm font-medium text-amber-600 hover:underline">
                    Click to select or drop a product photo here
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    Accepts JPG, PNG, WEBP, or AVIF laptop and gadget photos.
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium mt-2">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Instant client-side perimeter flood-fill & white replacement</span>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Photo */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>Original Photo</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:underline"
                    >
                      Change Photo
                    </button>
                  </div>
                  <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                    <img
                      src={originalImage}
                      alt="Original upload"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Studio White BG Output */}
                <div className="bg-white rounded-2xl p-4 border-2 border-amber-400 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-amber-700">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Studio Pure White (#FFFFFF)
                    </span>
                    {isProcessing && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600">
                        <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                      </span>
                    )}
                  </div>
                  <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                    {processedImage ? (
                      <img
                        src={processedImage}
                        alt="Pure white background studio version"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs">Processing image...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!processedImage || isProcessing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-medium transition-colors shadow-xs disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download White BG Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!processedImage || isProcessing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Data URL!' : 'Copy Image Data URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOriginalImage(null);
                    setProcessedImage(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Upload Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Fine-Tuning Controls & Advice */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-[#0B192C]">Algorithm Controls</h3>
            </div>

            {/* Tolerance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Tolerance Sensitivity</span>
                <span className="font-mono font-medium text-amber-600">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Higher tolerance removes more varied shadow tones; lower tolerance protects lighter laptop cases.
              </span>
            </div>

            {/* Feather Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Edge Feathering / Anti-Aliasing</span>
                <span className="font-mono font-medium text-amber-600">{feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={feather}
                onChange={(e) => setFeather(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Blends outer border pixels with white to avoid jagged pixelated cutouts.
              </span>
            </div>

            <button
              type="button"
              onClick={handleReprocess}
              disabled={!originalImage || isProcessing}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Apply & Re-Process Image</span>
            </button>
          </div>

          {/* Quick Best Practice Card */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
            <strong className="block font-semibold">💡 Photography Tips for Best White BG:</strong>
            <ul className="space-y-1 text-[11px] text-slate-600 list-disc pl-4">
              <li>Place the laptop or gadget on a reasonably uncluttered table or desk.</li>
              <li>Ensure even ambient lighting so hard shadows are minimized.</li>
              <li>The automatic tool samples outer boundary borders to preserve internal silver or white components.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
