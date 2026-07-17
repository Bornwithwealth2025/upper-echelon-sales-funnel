import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService, { Lead } from '../services/api';
import { Crest, Wordmark } from '../components/UpperEchelonBrand';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getLeads();

      if (response.success && response.data) {
        setLeads(response.data);
      } else {
        setError(response.message || 'Failed to fetch leads');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiService.deleteLead(id);

      if (response.success) {
        setLeads(leads.filter(lead => lead.id !== id));
        setDeleteConfirm(null);
      } else {
        setError(response.message || 'Failed to delete lead');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the lead');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleExport = () => {
    if (leads.length === 0) {
      alert('No leads to export');
      return;
    }

    const headers = ['ID', 'Full Name', 'Email', 'Phone Number', 'Additional Info', 'Created At'];
    const rows = leads.map(lead => [
      lead.id || '',
      lead.fullName,
      lead.email,
      lead.phoneNumber,
      lead.additionalInfo || '',
      lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9]">
      <nav className="bg-[#0a1628] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-3 lg:gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <Crest size={34} />
              <Wordmark tone="light" />
            </Link>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
                <span className="text-slate-300 truncate max-w-[200px]">
                  {user?.email}
                </span>
                <span className="inline-block px-3 py-1 bg-[#c9a445]/20 text-[#e7c972] text-xs font-semibold rounded-full">
                  {user?.role.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
                {/* <Link
                  to="/collect"
                  className="flex-1 sm:flex-none bg-[#c9a445] text-[#0a1628] px-3 sm:px-6 py-2 rounded-lg hover:bg-[#e7c972] transition text-sm text-center font-semibold"
                >
                  Add Lead
                </Link> */}
                {/* <Link
                  to="/campaigns"
                  className="flex-1 sm:flex-none bg-white/10 text-white px-3 sm:px-6 py-2 rounded-lg hover:bg-white/20 transition text-sm text-center"
                >
                  📧 Campaigns
                </Link> */}
                {/* <Link
                  to="/assets"
                  className="flex-1 sm:flex-none bg-white/10 text-white px-3 sm:px-6 py-2 rounded-lg hover:bg-white/20 transition text-sm text-center"
                >
                  🗂 Assets
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none bg-red-600 text-white px-3 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h2
                className="text-2xl sm:text-3xl text-[#0a1628]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Dashboard
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and view all your collected leads</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleExport}
                disabled={leads.length === 0}
                className="w-full sm:w-auto bg-emerald-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed text-sm"
              >
                📥 Export CSV
              </button>
              <button
                onClick={fetchLeads}
                disabled={loading}
                className="w-full sm:w-auto bg-[#0a1628] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#10203b] transition font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed text-sm"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-800 px-3 sm:px-4 py-4 rounded-lg flex items-start text-sm sm:text-base">
              <span className="text-xl sm:text-2xl mr-3">✗</span>
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="text-3xl sm:text-4xl">⏳</div>
              </div>
              <p className="text-sm sm:text-base text-slate-500 mt-4">Loading leads...</p>
            </div>
          )}

          {!loading && leads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl sm:text-6xl mb-4">📭</div>
              <p className="text-base sm:text-lg text-slate-600">No leads collected yet</p>
              <p className="text-sm sm:text-base text-slate-400 mb-6">Start collecting leads to see them here</p>
              <Link
                to="/collect"
                className="inline-block bg-[#0a1628] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#10203b] transition text-sm sm:text-base"
              >
                Collect Your First Lead
              </Link>
            </div>
          )}

          {!loading && leads.length > 0 && (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#0a1628]">Full Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#0a1628]">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#0a1628]">Phone Number</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#0a1628]">Additional Info</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#0a1628]">Created At</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#0a1628]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={lead.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-[#f4f1e9] transition`}>
                        <td className="px-4 py-4 text-sm text-[#0a1628] font-medium">{lead.fullName}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{lead.email}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{lead.phoneNumber}</td>
                        <td className="px-4 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {lead.additionalInfo || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <button
                            onClick={() => setDeleteConfirm(lead.id!)}
                            className="text-red-600 hover:text-red-800 font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Full Name</span>
                        <p className="text-sm font-medium text-[#0a1628]">{lead.fullName}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Email</span>
                        <p className="text-sm text-slate-600 break-all">{lead.email}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Phone</span>
                        <p className="text-sm text-slate-600">{lead.phoneNumber}</p>
                      </div>
                      {lead.additionalInfo && (
                        <div>
                          <span className="text-xs font-semibold text-slate-400">Additional Info</span>
                          <p className="text-sm text-slate-600">{lead.additionalInfo}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Created</span>
                        <p className="text-sm text-slate-600">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <button
                          onClick={() => setDeleteConfirm(lead.id!)}
                          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                        >
                          Delete Lead
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-[#f4f1e9] rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-slate-500">Total Leads</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#0a1628]">{leads.length}</p>
                </div>
                <div className="bg-[#f4f1e9] rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-slate-500">Unique Emails</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#0a1628]">{new Set(leads.map(l => l.email)).size}</p>
                </div>
                <div className="bg-[#f4f1e9] rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-slate-500">With Additional Info</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#0a1628]">{leads.filter(l => l.additionalInfo).length}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full">
            <p className="text-sm sm:text-base text-slate-700 mb-6">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-200 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-300 transition font-semibold text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;