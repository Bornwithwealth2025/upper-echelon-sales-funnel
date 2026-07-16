import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EmailTemplateBuilder } from '../utils/EmailTemplateBuilder';
import api from '../services/api';

export const CampaignCreatePage: React.FC = () => {
  const [step] = useState(1); // 1: Template, 2: Content, 3: Preview (multi-step wizard planned)
  const [campaignName, setCampaignName] = useState('');
  const [templateType, setTemplateType] = useState<'promotional' | 'newsletter' | 'product' | 'event' | 'custom'>('promotional');
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [imageUrl] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [templateOptions, setTemplateOptions] = useState<any>({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleGenerateTemplate = () => {
    try {
      let generatedHTML = '';

      switch (templateType) {
        case 'promotional':
          generatedHTML = EmailTemplateBuilder.promotionalTemplate(
            templateOptions.companyName || 'Your Company',
            templateOptions.headline || 'Special Offer',
            templateOptions.description || 'Check out our amazing offer',
            templateOptions.imageUrl || 'https://via.placeholder.com/600x400?text=Promotional',
            templateOptions.ctaText || 'Shop Now',
            templateOptions.ctaLink || '#',
            templateOptions.discount
          );
          break;
        case 'newsletter':
          generatedHTML = EmailTemplateBuilder.newsletterTemplate(
            templateOptions.companyName || 'Your Company',
            templateOptions.issueTitle || 'Monthly Newsletter',
            templateOptions.articles || [
              {
                title: 'Article 1',
                excerpt: 'This is the first article excerpt',
                link: '#'
              }
            ],
            templateOptions.imageUrl
          );
          break;
        case 'product':
          generatedHTML = EmailTemplateBuilder.productTemplate(
            templateOptions.productName || 'Product Name',
            templateOptions.productDescription || 'Product description',
            templateOptions.features || ['Feature 1', 'Feature 2'],
            templateOptions.imageUrl || 'https://via.placeholder.com/600x400?text=Product',
            templateOptions.price || '$99',
            templateOptions.ctaLink || '#'
          );
          break;
        case 'event':
          generatedHTML = EmailTemplateBuilder.eventTemplate(
            templateOptions.eventName || 'Event Name',
            templateOptions.eventDate || 'December 15, 2024',
            templateOptions.eventTime || '10:00 AM',
            templateOptions.location || 'Your Location',
            templateOptions.description || 'Event description',
            templateOptions.imageUrl || 'https://via.placeholder.com/600x400?text=Event',
            templateOptions.ctaLink || '#'
          );
          break;
      }

      setHtmlContent(generatedHTML);
      setPreview(true);
    } catch (err: any) {
      setError(err.message || 'Failed to generate template');
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      setError('Campaign name is required');
      return;
    }
    if (!subject.trim()) {
      setError('Email subject is required');
      return;
    }
    if (!htmlContent.trim()) {
      setError('Email content is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: any = {
        name: campaignName,
        subject,
        templateType,
        content: htmlContent,
        imageUrl: imageUrl || undefined
      };

      if (isScheduled && scheduleDate && scheduleTime) {
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        payload.scheduleFor = scheduledDateTime;
      }

      const response = await api.createCampaign(payload);

      if (response.success) {
        alert(response.message || 'Campaign created successfully!');
        navigate('/campaigns');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const fieldClasses =
    'w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a445] focus:border-transparent outline-none transition';

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
          <h1
            className="text-3xl sm:text-4xl text-[#0a1628]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create Email Campaign
          </h1>
          <p className="text-slate-500 mt-2">Design and send beautiful marketing emails to your leads</p>
        </div>

        <div className="flex mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className={`flex-${stepNum === 1 || stepNum === 2 ? '1' : '2'} flex items-center `}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold
                  ${step >= stepNum ? 'bg-[#0a1628] text-[#e7c972]' : 'bg-slate-200 text-slate-500'}`}
              >
                {stepNum}
              </div>
              <div className={`flex-1 h-1 mx-2 ${step > stepNum ? 'bg-[#c9a445]' : 'bg-slate-200'} ${step === 3 ? 'hidden' : ''}`}></div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl text-[#0a1628] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Campaign Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className={`${fieldClasses} py-3`}
                  placeholder="e.g., Founders Circle Q1 Invite"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Email Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`${fieldClasses} py-3`}
                  placeholder="e.g., Your invitation to The Upper Echelon"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Select Template Type</label>
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
                      {type === 'promotional' && '🎉'}
                      {type === 'newsletter' && '📰'}
                      {type === 'product' && '🎁'}
                      {type === 'event' && '🎊'}
                      <div className="text-sm mt-1">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Template Options</h3>

                {templateType === 'promotional' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={templateOptions.companyName || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, companyName: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Headline"
                      value={templateOptions.headline || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, headline: e.target.value })}
                      className={fieldClasses}
                    />
                    <textarea
                      placeholder="Description"
                      value={templateOptions.description || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, description: e.target.value })}
                      className={fieldClasses}
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={templateOptions.imageUrl || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, imageUrl: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="CTA Button Text"
                      value={templateOptions.ctaText || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, ctaText: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="CTA Link"
                      value={templateOptions.ctaLink || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, ctaLink: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="number"
                      placeholder="Discount % (optional)"
                      value={templateOptions.discount || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, discount: e.target.value })}
                      className={fieldClasses}
                    />
                  </div>
                )}

                {templateType === 'newsletter' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={templateOptions.companyName || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, companyName: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Newsletter Title"
                      value={templateOptions.issueTitle || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, issueTitle: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Header Image URL"
                      value={templateOptions.imageUrl || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, imageUrl: e.target.value })}
                      className={fieldClasses}
                    />
                  </div>
                )}

                {templateType === 'product' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={templateOptions.productName || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, productName: e.target.value })}
                      className={fieldClasses}
                    />
                    <textarea
                      placeholder="Product Description"
                      value={templateOptions.productDescription || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, productDescription: e.target.value })}
                      className={fieldClasses}
                      rows={2}
                    />
                    <input
                      type="text"
                      placeholder="Product Image URL"
                      value={templateOptions.imageUrl || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, imageUrl: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={templateOptions.price || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, price: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="CTA Link"
                      value={templateOptions.ctaLink || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, ctaLink: e.target.value })}
                      className={fieldClasses}
                    />
                  </div>
                )}

                {templateType === 'event' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={templateOptions.eventName || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, eventName: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Event Date"
                      value={templateOptions.eventDate || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, eventDate: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Event Time"
                      value={templateOptions.eventTime || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, eventTime: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={templateOptions.location || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, location: e.target.value })}
                      className={fieldClasses}
                    />
                    <textarea
                      placeholder="Description"
                      value={templateOptions.description || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, description: e.target.value })}
                      className={fieldClasses}
                      rows={2}
                    />
                    <input
                      type="text"
                      placeholder="Event Image URL"
                      value={templateOptions.imageUrl || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, imageUrl: e.target.value })}
                      className={fieldClasses}
                    />
                    <input
                      type="text"
                      placeholder="Registration Link"
                      value={templateOptions.ctaLink || ''}
                      onChange={(e) => setTemplateOptions({ ...templateOptions, ctaLink: e.target.value })}
                      className={fieldClasses}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleGenerateTemplate}
                className="flex-1 bg-[#0a1628] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#10203b] transition"
              >
                Generate Template
              </button>
            </div>
          </div>
        )}

        {preview && htmlContent && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mt-8">
            <h2 className="text-2xl text-[#0a1628] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Email Preview
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden" style={{ height: '600px', overflow: 'auto' }}>
              <iframe
                srcDoc={htmlContent}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Email Preview"
              ></iframe>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Schedule Campaign</label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-700">Send at a specific date and time</span>
                </label>
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className={fieldClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-semibold mb-1">Time</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className={fieldClasses}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setPreview(false)}
                className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Edit Template
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={loading}
                className="flex-1 bg-[#c9a445] text-[#0a1628] px-6 py-3 rounded-lg font-semibold hover:bg-[#e7c972] transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : '✓ Create Campaign'}
              </button>
            </div>
          </div>
        )}

        {!preview && step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="customHtml"
                checked={templateType === 'custom'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTemplateType('custom');
                  } else {
                    setTemplateType('promotional');
                  }
                }}
                className="w-4 h-4"
              />
              <label htmlFor="customHtml" className="text-slate-700 font-semibold text-sm">
                Or paste custom HTML
              </label>
            </div>
            {templateType === 'custom' && (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Paste your HTML email content here..."
                className={`${fieldClasses} font-mono py-3`}
                rows={10}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};