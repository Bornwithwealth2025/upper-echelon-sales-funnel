import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { Campaign } from '../services/api';

export const CampaignListPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchCampaigns();
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getCampaigns();

      if (response.success) {
        setCampaigns(response.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getCampaignStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (!window.confirm('Are you sure you want to send this campaign now? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.sendCampaignNow(campaignId);

      if (response.success && response.data) {
        alert(`Campaign sent! ${response.data.sent} emails sent, ${response.data.failed} failed.`);
        fetchCampaigns();
        fetchStats();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      const response = await api.deleteCampaign(campaignId);

      if (response.success) {
        alert('Campaign deleted successfully');
        fetchCampaigns();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete campaign');
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

  return (
    <div className="min-h-screen bg-[#f4f1e9] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 md:flex-row flex-col gap-4">
          <div>
            <h1
              className="text-3xl sm:text-4xl text-[#0a1628] mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Email Campaigns
            </h1>
            <p className="text-slate-500">Create and manage your email marketing campaigns</p>
          </div>
          <button
            onClick={() => navigate('/campaigns/create')}
            className="bg-[#c9a445] text-[#0a1628] px-6 py-3 rounded-lg font-semibold hover:bg-[#e7c972] transition"
          >
            ✨ Create Campaign
          </button>
        </div>

        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#8a6e24] hover:text-[#c9a445] font-semibold mb-4 flex items-center gap-2 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#c9a445]">
              <p className="text-slate-500 text-sm font-semibold">Total Campaigns</p>
              <p className="text-3xl font-bold text-[#0a1628]">{stats.totalCampaigns}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
              <p className="text-slate-500 text-sm font-semibold">Sent</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.sentCampaigns}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <p className="text-slate-500 text-sm font-semibold">Scheduled</p>
              <p className="text-3xl font-bold text-blue-600">{stats.scheduledCampaigns}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#0a1628]">
              <p className="text-slate-500 text-sm font-semibold">Total Emails</p>
              <p className="text-3xl font-bold text-[#0a1628]">{stats.totalEmailsSent}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a445]"></div>
              <p className="mt-4 text-slate-500">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600 text-lg mb-4">No campaigns yet</p>
              <button
                onClick={() => navigate('/campaigns/create')}
                className="bg-[#0a1628] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#10203b] transition"
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0a1628]">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0a1628]">Template</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0a1628]">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0a1628]">Recipients</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0a1628]">Sent/Failed</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0a1628]">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0a1628]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-slate-200 hover:bg-[#f4f1e9] transition">
                      <td className="px-6 py-4 text-sm font-medium text-[#0a1628]">{campaign.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{campaign.templateType}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(campaign.status)}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{campaign.recipientCount}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="text-emerald-600 font-semibold">{campaign.sentCount}</span>
                        {' / '}
                        <span className="text-red-600 font-semibold">{campaign.failedCount}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          {campaign.status !== 'sent' && (
                            <button
                              onClick={() => handleSendCampaign(campaign?.campaignId!)}
                              className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-xs font-semibold transition"
                            >
                              Send
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/campaigns/${campaign.campaignId}`)}
                            className="text-white bg-[#0a1628] hover:bg-[#10203b] px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            View
                          </button>
                          {campaign.status !== 'sent' && (
                            <button
                              onClick={() => handleDeleteCampaign(campaign?.campaignId)}
                              className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold transition"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};