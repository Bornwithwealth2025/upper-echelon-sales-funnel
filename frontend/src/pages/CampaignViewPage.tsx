import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { Campaign, CampaignPayload } from '../services/api';

export const CampaignViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [templateType, setTemplateType] = useState<'promotional' | 'newsletter' | 'product' | 'event' | 'custom'>('promotional');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (id) {
      fetchCampaign();
    }
  }, [isAuthenticated, id]);

  const fetchCampaign = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getCampaignById(id!);
      if (response.success && response.data) {
        setCampaign(response.data);
        setName(response.data.name);
        setSubject(response.data.subject);
        setTemplateType(response.data.templateType as any);
        setContent(response.data.content);
        setImageUrl(response.data.imageUrl || '');

        if (response.data.scheduledAt) {
          const scheduleDateTime = new Date(response.data.scheduledAt);
          const dateStr = scheduleDateTime.toISOString().split('T')[0];
          const timeStr = scheduleDateTime.toTimeString().slice(0, 5);
          setScheduleDate(dateStr);
          setScheduleTime(timeStr);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError('Campaign name is required');
      return;
    }
    if (!subject.trim()) {
      setError('Email subject is required');
      return;
    }
    if (!content.trim()) {
      setError('Email content is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload: Partial<CampaignPayload> = {
        name,
        subject,
        templateType,
        content,
        imageUrl: imageUrl || undefined
      };

      if (scheduleDate && scheduleTime) {
        payload.scheduleFor = new Date(`${scheduleDate}T${scheduleTime}`);
      }

      const response = await api.updateCampaign(id!, payload);

      if (response.success) {
        setSuccess('Campaign updated successfully!');
        setIsEditMode(false);
        await fetchCampaign();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.deleteCampaign(id!);
      if (response.success) {
        alert('Campaign deleted successfully');
        navigate('/campaigns');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete campaign');
    }
  };

  const handleSendNow = async () => {
    if (!window.confirm('Are you sure you want to send this campaign now to all leads?')) {
      return;
    }

    try {
      const response = await api.sendCampaignNow(id!);
      if (response.success && response.data) {
        alert(`Campaign sent! ${response.data.sent} emails sent, ${response.data.failed} failed.`);
        await fetchCampaign();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send campaign');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-emerald-100 text-emerald-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-slate-100 text-slate-700';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const fieldClasses =
    'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c9a445] focus:border-transparent outline-none transition text-sm';

  if (loading && !campaign) {
    return (
      <div className="min-h-screen bg-[#f4f1e9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a445]"></div>
          <p className="mt-4 text-slate-500">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#f4f1e9] p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 text-lg">{error || 'Campaign not found'}</p>
          <button
            onClick={() => navigate('/campaigns')}
            className="mt-4 text-[#8a6e24] hover:text-[#c9a445] font-semibold transition"
          >
            ← Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1e9] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/campaigns')}
            className="text-[#8a6e24] hover:text-[#c9a445] font-semibold mb-4 flex items-center gap-2 transition"
          >
            ← Back to Campaigns
          </button>

          <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl text-[#0a1628]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {campaign.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(campaign.status)}`}>
                  {campaign.status.toUpperCase()}
                </span>
                <span className="text-slate-500">
                  {campaign.templateType}
                </span>
              </div>
            </div>

            {!isEditMode && campaign.status !== 'sent' && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-[#0a1628] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#10203b] transition text-sm"
                >
                  ✏️ Edit
                </button>
                {campaign.status !== 'sent' && (
                  <button
                    onClick={handleSendNow}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition text-sm"
                  >
                    📤 Send Now
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        {!isEditMode && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl text-[#0a1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Campaign Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-sm font-semibold">Subject</p>
                  <p className="text-[#0a1628]">{campaign.subject}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm font-semibold">Template Type</p>
                  <p className="text-[#0a1628] capitalize">{campaign.templateType}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm font-semibold">Recipient Count</p>
                  <p className="text-[#0a1628]">{campaign.recipientCount}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm font-semibold">Sent Count</p>
                  <p className="text-[#0a1628]">{campaign.sentCount} / {campaign.recipientCount}</p>
                </div>

                {campaign.scheduledAt && (
                  <div>
                    <p className="text-slate-500 text-sm font-semibold">Scheduled For</p>
                    <p className="text-[#0a1628]">{new Date(campaign.scheduledAt).toLocaleString()}</p>
                  </div>
                )}

                {campaign.sentAt && (
                  <div>
                    <p className="text-slate-500 text-sm font-semibold">Sent At</p>
                    <p className="text-[#0a1628]">{new Date(campaign.sentAt).toLocaleString()}</p>
                  </div>
                )}

                <div>
                  <p className="text-slate-500 text-sm font-semibold">Created</p>
                  <p className="text-[#0a1628]">{new Date(campaign.createdAt).toLocaleString()}</p>
                </div>

                {campaign.failedCount > 0 && (
                  <div>
                    <p className="text-slate-500 text-sm font-semibold">Failed</p>
                    <p className="text-red-600 font-semibold">{campaign.failedCount}</p>
                  </div>
                )}
              </div>

              {campaign.imageUrl && (
                <div className="mt-4">
                  <p className="text-slate-500 text-sm font-semibold mb-2">Campaign Image</p>
                  <img src={campaign.imageUrl} alt="Campaign" className="rounded-lg max-w-md" />
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl text-[#0a1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Email Preview
              </h2>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
              </div>
            </div>
          </div>
        )}

        {isEditMode && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[#0a1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Edit Campaign
              </h2>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setError('');
                  setSuccess('');
                  if (campaign) {
                    setName(campaign.name);
                    setSubject(campaign.subject);
                    setContent(campaign.content);
                  }
                }}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClasses}
                  placeholder="e.g., Founders Circle Q1 Invite"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Email Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={fieldClasses}
                  placeholder="e.g., Your invitation to The Upper Echelon"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Template Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['promotional', 'newsletter', 'product', 'event'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTemplateType(type)}
                      className={`p-4 rounded-lg border-2 font-semibold transition text-center capitalize
                        ${templateType === type
                          ? 'border-[#c9a445] bg-[#f4f1e9] text-[#8a6e24]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#c9a445]/50'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">HTML Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className={`${fieldClasses} font-mono`}
                  placeholder="Paste your HTML email content here..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Image URL (Optional)</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={fieldClasses}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Schedule (Optional)</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className={fieldClasses}
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className={fieldClasses}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 bg-[#c9a445] text-[#0a1628] py-3 rounded-lg font-semibold hover:bg-[#e7c972] transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : '✓ Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};