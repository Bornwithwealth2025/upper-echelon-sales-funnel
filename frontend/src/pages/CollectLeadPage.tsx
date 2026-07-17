import React, { useEffect, useState } from 'react';
import {
  Link,
  useSearchParams
} from 'react-router-dom';
import apiService, { Asset, Lead } from '../services/api';
import { Crest, Wordmark } from '../components/UpperEchelonBrand';

const CollectLeadPage: React.FC = () => {

  const [searchParams] = useSearchParams();
  const markerIdFromQuery = searchParams.get('marker_id')?.trim() || '';
  const marketingCategoryFromQuery = searchParams.get('marketing_category')?.trim() || '';
  const assetIdsFromQuery = (() => {
    const singleCommaSeparated = (searchParams.get('asset_id') || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    const altParam = (searchParams.get('asset_ids') || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    return [...new Set([ ...singleCommaSeparated, ...altParam].filter(Boolean))];
  })();

  const [loading, setLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Your application has been submitted successfully.');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState<Lead>({
    fullName: '',
    email: '',
    phoneNumber: '',
    additionalInfo: '',
    markerId: markerIdFromQuery,
    marketingCategory: marketingCategoryFromQuery
  });

  useEffect(() => {
    const fetchAssets = async () => {
      if (assetIdsFromQuery.length === 0) {
        setAssets([]);
        return;
      }

      try {
        setAssetLoading(true);
        setError('');

        const responses = await Promise.allSettled(
          assetIdsFromQuery.map((assetId) => apiService.getAssetById(assetId))
        );

        const foundAssets: Asset[] = [];
        const failedIds: string[] = [];

        responses.forEach((result, index) => {
          const id = assetIdsFromQuery[index];
          if (result.status === 'fulfilled' && result.value.success && result.value.data) {
            foundAssets.push(result.value.data);
          } else {
            failedIds.push(id);
          }
        });

        setAssets(foundAssets);
        if (failedIds.length > 0) {
          setError(`Some assets could not be loaded: ${failedIds.join(', ')}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load requested assets');
      } finally {
        setAssetLoading(false);
      }
    };

    fetchAssets();
  }, [searchParams]);

  const getAssetPrompt = (assetList: Asset[]): string => {
    if (assetList.length === 0) {
      return 'Applications are reviewed by hand. Tell us who you are — we\'ll take it from there.';
    }

    const downloadable = assetList.filter((a) => a.tags.includes('downloadable'));
    const emailable = assetList.filter((a) => a.tags.includes('emailable'));
    const playable = assetList.filter((a) => a.tags.includes('playable'));

    if (downloadable.length > 0 && emailable.length > 0) {
      return `Submit your form to download and receive ${assetList.length} assets`;
    }

    if (downloadable.length > 0) {
      return `Submit your form to download ${downloadable.length} asset${downloadable.length > 1 ? 's' : ''}`;
    }

    if (emailable.length > 0) {
      return `Submit your form to receive ${emailable.length} asset${emailable.length > 1 ? 's' : ''} via email`;
    }

    if (playable.length > 0) {
      return `Playable media available: ${playable.length} asset${playable.length > 1 ? 's' : ''}`;
    }

    return 'Applications are reviewed by hand. Tell us who you are — we\'ll take it from there.';
  };

  const renderPlayableAsset = (asset: Asset) => {
    if (!asset.tags.includes('playable')) {
      return null;
    }

    const source = apiService.resolveAssetUrl(asset.fileUrl);
    if (!source) {
      return null;
    }

    if (asset.mimeType.startsWith('video/')) {
      return <video src={source} controls className="mt-2 w-full max-w-md rounded-md border border-[#c9a445]/30" />;
    }

    if (asset.mimeType.startsWith('audio/')) {
      return <audio src={source} controls className="mt-2 w-full max-w-md" />;
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSuccessMessage('Application submitted successfully. One of our team members will reach out to you shortly.');
    setLoading(true);

    try {
      const response = await apiService.saveLead(formData);

      if (response.success) {
        const downloadableAssets = assets.filter((a) => a.tags.includes('downloadable'));
        const emailableAssets = assets.filter((a) => a.tags.includes('emailable'));

        downloadableAssets.forEach((downloadableAsset) => {
          const downloadUrl = apiService.getAssetDownloadUrl(downloadableAsset.assetId);
          window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        });

        const emailResults = await Promise.allSettled(
          emailableAssets.map((emailableAsset) =>
            apiService.emailAsset(emailableAsset.assetId, {
              email: formData.email,
              fullName: formData.fullName
            })
          )
        );

        const emailFailures = emailResults.filter((result) => result.status === 'rejected').length;

        setSuccess(true);

        const actions: string[] = [];
        if (downloadableAssets.length > 0) {
          actions.push(`download ${downloadableAssets.length} asset${downloadableAssets.length > 1 ? 's' : ''}`);
        }
        if (emailableAssets.length > 0) {
          const delivered = emailableAssets.length - emailFailures;
          if (delivered > 0) {
            actions.push(`receive ${delivered} asset${delivered > 1 ? 's' : ''} by email`);
          }
        }

        if (actions.length > 0) {
          setSuccessMessage(`Submission successful. You can now ${actions.join(' and ')}.`);
        }

        if (emailFailures > 0) {
          setError(`${emailFailures} asset email${emailFailures > 1 ? 's' : ''} failed to send.`);
        }

        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          additionalInfo: '',
          markerId: markerIdFromQuery,
          marketingCategory: marketingCategoryFromQuery
        });
      } else {
        setError(response.message || 'Failed to save data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the data');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-[#0a1628] focus:ring-2 focus:ring-[#c9a445] focus:border-transparent outline-none transition disabled:bg-slate-100 disabled:cursor-not-allowed';
  const labelClasses = 'block text-sm font-medium text-[#0a1628] mb-2';

  return (
    <div className="min-h-screen bg-[#f4f1e9]">
      <nav className="bg-[#fcfbf8] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Crest size={38} />
            <Wordmark tone="dark" className="hidden sm:block" />
          </Link>
          {/* <Link
            to="/login"
            className="text-sm font-semibold text-[#0a1628] hover:text-[#8a6e24] transition"
          >
            Promoter Login
          </Link> */}
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a6e24] mb-3">
            Membership Application
          </p>
          <h2
            className="text-3xl sm:text-4xl text-[#0a1628] mb-3 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Join The Upper Echelon
          </h2>
          <p className="text-slate-600 mb-8">{getAssetPrompt(assets)}</p>

          {assetLoading && (
            <div className="mb-6 p-4 rounded-lg bg-[#f4f1e9] text-[#8a6e24] text-sm">
              Loading asset details...
            </div>
          )}

          {!assetLoading && assets.length > 0 && (
            <div className="mb-6 border border-[#c9a445]/30 bg-[#f4f1e9] rounded-lg p-4">
              <p className="text-sm text-[#8a6e24] font-semibold mb-3">Requested Assets ({assets.length})</p>
              <div className="grid gap-3">
                {assets.map((asset) => (
                  <div key={asset.assetId} className="flex gap-4 items-center bg-white border border-[#c9a445]/20 rounded-lg p-3">
                    {asset.thumbnailUrl ? (
                      <img
                        src={apiService.resolveAssetUrl(asset.thumbnailUrl)}
                        alt={asset.name}
                        className="h-16 w-20 object-cover rounded-md border border-[#c9a445]/30"
                      />
                    ) : (
                      <div className="h-16 w-20 rounded-md border border-[#c9a445]/30 bg-white flex items-center justify-center text-xs text-slate-400">
                        No thumb
                      </div>
                    )}
                    <div>
                      <p className="text-base text-[#0a1628] font-bold">{asset.name}</p>
                      <p className="text-xs text-[#8a6e24]">{asset.tags.join(', ')}</p>
                      {renderPlayableAsset(asset)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-800 px-4 py-4 rounded-lg flex items-start text-sm">
              <span className="text-xl mr-3">✓</span>
              <div>
                <p className="font-bold">Success!</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 text-red-800 px-4 py-4 rounded-lg flex items-start text-sm">
              <span className="text-xl mr-3">✗</span>
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className={labelClasses}>
                Full Name <span className="text-[#c9a445]">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jordan Blake"
                required
                disabled={loading}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}>
                Email <span className="text-[#c9a445]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jordan@company.com"
                required
                disabled={loading}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className={labelClasses}>
                Phone Number <span className="text-[#c9a445]">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                required
                disabled={loading}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="additionalInfo" className={labelClasses}>
                Tell Us About Your Ambition <span className="text-slate-400 text-xs font-normal">(Optional)</span>
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="What are you building, and what are you looking for from this community?"
                disabled={loading}
                rows={4}
                className={`${inputClasses} resize-none`}
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#c9a445] text-[#0a1628] px-6 py-3.5 rounded-lg hover:bg-[#e7c972] transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Your Application →'}
              </button>
              <Link
                to="/"
                className="flex-1 bg-slate-100 text-[#0a1628] px-6 py-3.5 rounded-lg hover:bg-slate-200 transition font-semibold text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-[#0a1628]">Need help?</span> All fields marked with an asterisk (*) are required.
              Your information is secure and reviewed only for membership consideration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectLeadPage;