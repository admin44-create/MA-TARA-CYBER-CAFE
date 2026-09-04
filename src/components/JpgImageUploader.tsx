import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, Check, RefreshCw, Link as LinkIcon, Sparkles } from 'lucide-react';

interface JpgImageUploaderProps {
  label: string;
  description?: string;
  currentImageUrl: string;
  onImageChange: (imageUrl: string) => void;
  maxDimension?: number;
  quality?: number;
  aspectRatioHint?: string;
  presets?: { label: string; url: string; description?: string }[];
  variant?: 'logo' | 'banner' | 'qr';
}

export const JpgImageUploader: React.FC<JpgImageUploaderProps> = ({
  label,
  description,
  currentImageUrl,
  onImageChange,
  maxDimension = 1200,
  quality = 0.85,
  aspectRatioHint = 'Recommended: JPG / JPEG format',
  presets = [],
  variant = 'banner'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [uploadSuccessNote, setUploadSuccessNote] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid JPG or PNG image file.');
      return;
    }

    setIsProcessing(true);
    setUploadSuccessNote(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw with white background for transparency safety in JPG
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }

          const optimizedJpg = canvas.toDataURL('image/jpeg', quality);
          const sizeKb = Math.round((optimizedJpg.length * 3) / 4 / 1024);

          onImageChange(optimizedJpg);
          setUploadSuccessNote(`JPG uploaded successfully (${width}x${height}px, ~${sizeKb} KB)`);
          setTimeout(() => setUploadSuccessNote(null), 3500);
        } catch (err) {
          console.error('Error optimizing image', err);
          onImageChange(rawDataUrl);
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
        alert('Could not parse image. Please try another JPG file.');
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlDraft.trim()) {
      onImageChange(urlDraft.trim());
      setShowUrlInput(false);
      setUrlDraft('');
      setUploadSuccessNote('Image URL updated!');
      setTimeout(() => setUploadSuccessNote(null), 3000);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <label className="block text-xs font-bold text-slate-800">
            {label}
          </label>
          {description && (
            <p className="text-[11px] text-slate-500 font-normal">{description}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-500 font-medium">
          {aspectRatioHint}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Current Preview Card */}
      {currentImageUrl ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            {/* Visual Thumbnail based on variant */}
            <div className={`shrink-0 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm ${
              variant === 'banner' ? 'w-28 h-16 sm:w-36 sm:h-20' : variant === 'logo' ? 'w-14 h-14' : 'w-16 h-16'
            }`}>
              <img
                src={currentImageUrl}
                alt={label}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info & Action Controls */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  <Check className="w-3 h-3" />
                  <span>JPG Active</span>
                </span>
                <span className="text-[11px] text-slate-500 truncate font-mono">
                  {currentImageUrl.startsWith('data:image') 
                    ? 'Uploaded Local JPG Image' 
                    : 'Hosted Image Asset'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Processing JPG...' : 'Upload New JPG'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onImageChange('')}
                  className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-300 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Remove</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-2.5 py-1.5 text-[11px] text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
                >
                  {showUrlInput ? 'Hide URL link' : 'Or edit link URL'}
                </button>
              </div>
            </div>
          </div>

          {/* Feedback badge */}
          {uploadSuccessNote && (
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              {uploadSuccessNote}
            </div>
          )}
        </div>
      ) : (
        /* Empty State: Direct JPG Drop & Upload Zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/50' 
              : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-400'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Click to select JPG file or drag & drop here
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Direct JPG file upload from Computer / Mobile (No web link needed)
              </p>
            </div>
            <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
              {variant === 'banner' ? 'Upload Banner JPG' : variant === 'logo' ? 'Upload Logo JPG' : 'Upload QR JPG'}
            </span>
          </div>
        </div>
      )}

      {/* Optional Collapsible Web URL fallback */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="flex items-center gap-2 pt-1 animate-in fade-in">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="Paste image link URL (e.g. https://.../image.jpg)"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono"
            />
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0"
          >
            Apply URL
          </button>
        </form>
      )}

      {/* Preset Quick Selectors */}
      {presets.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[11px] font-bold text-slate-700">
              Or Choose 1-Click Cyber Cafe Preset JPG:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onImageChange(preset.url)}
                className="text-[10px] font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
