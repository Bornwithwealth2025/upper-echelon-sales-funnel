import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService, { AssetTag } from '../services/api';
import { Crest, Wordmark } from '../components/UpperEchelonBrand';

const AssetUploadPage: React.FC = () => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [tags, setTags] = useState<AssetTag[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const filePreviewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  const thumbnailPreviewUrl = useMemo(() => (thumbnail ? URL.createObjectURL(thumbnail) : ''), [thumbnail]);

  const onTagToggle = (tag: AssetTag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!file) {
      setError('File is required');
      return;
    }

    if (tags.length === 0) {
      setError('Select at least one tag');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('file', file);
    tags.forEach((tag) => formData.append('tags', tag));
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      setLoading(true);
      const response = await apiService.uploadAsset(formData);
      if (response.success && response.data) {
        setMessage(`Asset uploaded. UUID: ${response.data.assetId}`);
        setName('');
        setFile(null);
        setThumbnail(null);
        setTags([]);
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9]">
      <nav className="bg-[#0a1628] border-b border-[#c9a445]/15">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <Crest size={30} />
            <Wordmark tone="light" />
          </Link>
          <div className="flex gap-2">
            <Link to="/assets" className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition">
              Asset List
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Upload Asset
          </h1>
          <p className="text-slate-500 mt-1">Upload file, optional thumbnail, and tags for lead collector delivery behavior.</p>

          {message && <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">{message}</div>}
          {error && <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a445] focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Asset name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">File Upload</label>
              <input
                type="file"
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/*,audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
              {file && (
                <p className="text-xs text-slate-500 mt-2">{file.name} ({Math.round(file.size / 1024)} KB){(file.type.startsWith('video/') || file.type.startsWith('audio/')) ? ' - playable tag will be added automatically' : ''}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                disabled={loading}
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-700 mb-2">Tags</span>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tags.includes('emailable')}
                    onChange={() => onTagToggle('emailable')}
                    disabled={loading}
                  />
                  emailable
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tags.includes('downloadable')}
                    onChange={() => onTagToggle('downloadable')}
                    disabled={loading}
                  />
                  downloadable
                </label>
              </div>
            </div>

            {(filePreviewUrl || thumbnailPreviewUrl) && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-sm font-semibold mb-2 text-[#0a1628]">File Preview</p>
                  {file?.type.startsWith('image/') && filePreviewUrl && (
                    <img src={filePreviewUrl} alt="File preview" className="h-40 object-contain" />
                  )}
                  {file?.type.startsWith('video/') && filePreviewUrl && (
                    <video src={filePreviewUrl} controls className="h-40 w-full" />
                  )}
                  {file?.type.startsWith('audio/') && filePreviewUrl && (
                    <audio src={filePreviewUrl} controls className="w-full" />
                  )}
                  {file && !file.type.startsWith('image/') && !file.type.startsWith('video/') && !file.type.startsWith('audio/') && (
                    <p className="text-sm text-slate-500">Preview not available for this file type.</p>
                  )}
                </div>
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-sm font-semibold mb-2 text-[#0a1628]">Thumbnail Preview</p>
                  {thumbnailPreviewUrl ? (
                    <img src={thumbnailPreviewUrl} alt="Thumbnail preview" className="h-40 object-contain" />
                  ) : (
                    <p className="text-sm text-slate-500">No thumbnail selected.</p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#c9a445] text-[#0a1628] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#e7c972] transition disabled:bg-slate-300 disabled:text-slate-500"
            >
              {loading ? 'Uploading...' : 'Upload Asset'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AssetUploadPage;