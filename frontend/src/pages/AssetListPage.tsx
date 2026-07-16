import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService, { Asset, AssetTag } from '../services/api';
import { Crest, Wordmark } from '../components/UpperEchelonBrand';

const AssetListPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState<AssetTag[]>([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getAssets();
      if (response.success && response.data) {
        setAssets(response.data);
      } else {
        setError(response.message || 'Failed to fetch assets');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (asset: Asset) => {
    setEditingId(asset.assetId);
    setEditName(asset.name);
    setEditTags(asset.tags);
  };

  const toggleEditTag = (tag: AssetTag) => {
    setEditTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const saveEdit = async (assetId: string) => {
    try {
      const response = await apiService.updateAsset(assetId, { name: editName, tags: editTags });
      if (response.success && response.data) {
        setAssets((prev) => prev.map((asset) => (asset.assetId === assetId ? response.data! : asset)));
        setEditingId(null);
      } else {
        setError(response.message || 'Failed to update asset');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update asset');
    }
  };

  const deleteAsset = async (assetId: string) => {
    if (!window.confirm('Delete this asset?')) {
      return;
    }

    try {
      const response = await apiService.deleteAsset(assetId);
      if (response.success) {
        setAssets((prev) => prev.filter((asset) => asset.assetId !== assetId));
      } else {
        setError(response.message || 'Failed to delete asset');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset');
    }
  };

  const copyUuid = async (assetId: string) => {
    try {
      await navigator.clipboard.writeText(assetId);
      alert('UUID copied');
    } catch {
      alert('Could not copy UUID');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9]">
      <nav className="bg-[#0a1628] border-b border-[#c9a445]/15">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <Crest size={30} />
            <Wordmark tone="light" />
          </Link>
          <Link to="/assets/upload" className="bg-[#c9a445] text-[#0a1628] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e7c972] transition">
            Upload Asset
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Asset List
        </h1>
        <p className="text-slate-500 mt-1">Manage uploaded assets and copy UUIDs for lead collector links.</p>

        {error && <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

        {loading ? (
          <div className="mt-8 text-slate-500">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 text-slate-500">No assets uploaded yet.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {assets.map((asset) => (
              <div key={asset.assetId} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="grid md:grid-cols-[140px,1fr,auto] gap-4 items-start">
                  <div className="h-24 w-36 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
                    {asset.thumbnailUrl ? (
                      <img src={apiService.resolveAssetUrl(asset.thumbnailUrl)} alt={asset.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">No thumbnail</span>
                    )}
                  </div>

                  <div>
                    {editingId === asset.assetId ? (
                      <div className="space-y-3">
                        <input
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a445]"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <div className="flex gap-4 text-sm">
                          <label className="inline-flex items-center gap-2">
                            <input type="checkbox" checked={editTags.includes('emailable')} onChange={() => toggleEditTag('emailable')} />
                            emailable
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input type="checkbox" checked={editTags.includes('downloadable')} onChange={() => toggleEditTag('downloadable')} />
                            downloadable
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-emerald-700 transition" onClick={() => saveEdit(asset.assetId)}>
                            Save
                          </button>
                          <button className="bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md text-sm hover:bg-slate-300 transition" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-[#0a1628]">{asset.name}</h3>
                        <p className="text-sm text-slate-500">{asset.originalFileName}</p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {asset.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#f4f1e9] text-[#8a6e24] border border-[#c9a445]/30">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3">
                          <span className="text-xs text-slate-400">UUID:</span>
                          <div className="flex gap-2 items-center mt-1">
                            <code className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">{asset.assetId}</code>
                            <button className="text-xs bg-[#0a1628] text-white px-2 py-1 rounded hover:bg-[#10203b] transition" onClick={() => copyUuid(asset.assetId)}>
                              Copy
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {editingId !== asset.assetId && (
                    <div className="flex md:flex-col gap-2">
                      <button className="bg-amber-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-600 transition" onClick={() => startEdit(asset)}>
                        Update
                      </button>
                      <button className="bg-rose-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-rose-700 transition" onClick={() => deleteAsset(asset.assetId)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AssetListPage;