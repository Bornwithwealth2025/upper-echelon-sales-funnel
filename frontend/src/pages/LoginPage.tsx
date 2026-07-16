import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logoo.png';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina',
  'Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados',
  'Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana',
  'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon',
  'Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Congo (Congo-Brazzaville)','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic',
  'Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini',
  'Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana',
  'Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras',
  'Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos',
  'Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
  'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania',
  'Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco',
  'Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua',
  'Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau',
  'Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
  'Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia',
  'Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe',
  'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia',
  'Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain',
  'Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan',
  'Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia',
  'Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam',
  'Yemen','Zambia','Zimbabwe',
];

const TIMEZONES = [
  { label: '(UTC-12:00) International Date Line West', value: 'Etc/GMT+12' },
  { label: '(UTC-11:00) Coordinated Universal Time-11', value: 'Pacific/Pago_Pago' },
  { label: '(UTC-10:00) Hawaii', value: 'Pacific/Honolulu' },
  { label: '(UTC-09:00) Alaska', value: 'America/Anchorage' },
  { label: '(UTC-08:00) Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
  { label: '(UTC-07:00) Mountain Time (US & Canada)', value: 'America/Denver' },
  { label: '(UTC-07:00) Arizona', value: 'America/Phoenix' },
  { label: '(UTC-06:00) Central Time (US & Canada)', value: 'America/Chicago' },
  { label: '(UTC-06:00) Mexico City', value: 'America/Mexico_City' },
  { label: '(UTC-05:00) Eastern Time (US & Canada)', value: 'America/New_York' },
  { label: '(UTC-05:00) Bogota, Lima, Quito', value: 'America/Bogota' },
  { label: '(UTC-04:00) Atlantic Time (Canada)', value: 'America/Halifax' },
  { label: '(UTC-04:00) Caracas, La Paz', value: 'America/Caracas' },
  { label: '(UTC-04:00) Santiago', value: 'America/Santiago' },
  { label: '(UTC-03:00) Brasilia', value: 'America/Sao_Paulo' },
  { label: '(UTC-03:00) Buenos Aires', value: 'America/Argentina/Buenos_Aires' },
  { label: '(UTC-03:30) Newfoundland', value: 'America/St_Johns' },
  { label: '(UTC-02:00) Coordinated Universal Time-02', value: 'Etc/GMT+2' },
  { label: '(UTC-01:00) Azores', value: 'Atlantic/Azores' },
  { label: '(UTC+00:00) London, Dublin, Edinburgh', value: 'Europe/London' },
  { label: '(UTC+00:00) Casablanca, Monrovia, Reykjavik', value: 'Africa/Casablanca' },
  { label: '(UTC+00:00) Coordinated Universal Time', value: 'UTC' },
  { label: '(UTC+01:00) Amsterdam, Berlin, Rome, Paris', value: 'Europe/Paris' },
  { label: '(UTC+01:00) West Central Africa', value: 'Africa/Lagos' },
  { label: '(UTC+02:00) Athens, Bucharest', value: 'Europe/Athens' },
  { label: '(UTC+02:00) Cairo', value: 'Africa/Cairo' },
  { label: '(UTC+02:00) Harare, Pretoria', value: 'Africa/Harare' },
  { label: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia', value: 'Europe/Helsinki' },
  { label: '(UTC+02:00) Jerusalem', value: 'Asia/Jerusalem' },
  { label: '(UTC+03:00) Baghdad', value: 'Asia/Baghdad' },
  { label: '(UTC+03:00) Kuwait, Riyadh', value: 'Asia/Riyadh' },
  { label: '(UTC+03:00) Moscow, St. Petersburg', value: 'Europe/Moscow' },
  { label: '(UTC+03:00) Nairobi', value: 'Africa/Nairobi' },
  { label: '(UTC+03:30) Tehran', value: 'Asia/Tehran' },
  { label: '(UTC+04:00) Abu Dhabi, Muscat', value: 'Asia/Dubai' },
  { label: '(UTC+04:00) Baku', value: 'Asia/Baku' },
  { label: '(UTC+04:30) Kabul', value: 'Asia/Kabul' },
  { label: '(UTC+05:00) Ekaterinburg', value: 'Asia/Yekaterinburg' },
  { label: '(UTC+05:00) Islamabad, Karachi, Tashkent', value: 'Asia/Karachi' },
  { label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', value: 'Asia/Kolkata' },
  { label: '(UTC+05:45) Kathmandu', value: 'Asia/Kathmandu' },
  { label: '(UTC+06:00) Astana, Dhaka', value: 'Asia/Dhaka' },
  { label: '(UTC+06:30) Yangon (Rangoon)', value: 'Asia/Rangoon' },
  { label: '(UTC+07:00) Bangkok, Hanoi, Jakarta', value: 'Asia/Bangkok' },
  { label: '(UTC+07:00) Krasnoyarsk', value: 'Asia/Krasnoyarsk' },
  { label: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi', value: 'Asia/Shanghai' },
  { label: '(UTC+08:00) Kuala Lumpur, Singapore', value: 'Asia/Singapore' },
  { label: '(UTC+08:00) Perth', value: 'Australia/Perth' },
  { label: '(UTC+08:00) Taipei', value: 'Asia/Taipei' },
  { label: '(UTC+09:00) Osaka, Sapporo, Tokyo', value: 'Asia/Tokyo' },
  { label: '(UTC+09:00) Seoul', value: 'Asia/Seoul' },
  { label: '(UTC+09:30) Adelaide', value: 'Australia/Adelaide' },
  { label: '(UTC+09:30) Darwin', value: 'Australia/Darwin' },
  { label: '(UTC+10:00) Brisbane', value: 'Australia/Brisbane' },
  { label: '(UTC+10:00) Canberra, Melbourne, Sydney', value: 'Australia/Sydney' },
  { label: '(UTC+10:00) Guam, Port Moresby', value: 'Pacific/Guam' },
  { label: '(UTC+11:00) Solomon Islands, New Caledonia', value: 'Pacific/Noumea' },
  { label: '(UTC+12:00) Auckland, Wellington', value: 'Pacific/Auckland' },
  { label: '(UTC+12:00) Fiji', value: 'Pacific/Fiji' },
  { label: "(UTC+13:00) Nuku'alofa", value: 'Pacific/Tongatapu' },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'Member Access - The Upper Echelon';
    if (user?.id) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        companyName,
        industry,
        country,
        timezone
      });
      setSuccess('Account created. Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const inputClasses =
    'w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a445] focus:border-transparent transition disabled:bg-slate-100 disabled:cursor-not-allowed';
  const labelClasses = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#fcfbf8] rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <Link to="/" className="mb-7 inline-flex items-center justify-center" aria-label="The Upper Echelon home">
  <img
    src={logo}
    alt="The Upper Echelon"
    className="h-20 w-auto max-w-[280px] object-contain sm:h-24 sm:max-w-[340px]"
  />
</Link>
          <h1
            className="text-2xl sm:text-3xl text-[#0a1628] mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Member Access
          </h1>
          <p className="text-slate-500 text-sm">Sign in or apply for promoter access</p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccess('');
            }}
            className={`py-2 rounded-md text-sm font-semibold transition ${
              mode === 'login' ? 'bg-white text-[#0a1628] shadow' : 'text-slate-500'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
              setSuccess('');
            }}
            className={`py-2 rounded-md text-sm font-semibold transition ${
              mode === 'register' ? 'bg-white text-[#0a1628] shadow' : 'text-slate-500'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelClasses}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={inputClasses}
                placeholder="you@company.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={inputClasses}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-[#8a6e24] hover:text-[#c9a445] font-semibold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0a1628] hover:bg-[#10203b] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClasses}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClasses}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="lastName" className={labelClasses}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClasses}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="registerEmail" className={labelClasses}>
                Email Address
              </label>
              <input
                id="registerEmail"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className={inputClasses}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="registerPassword" className={labelClasses}>
                  Password
                </label>
                <input
                  id="registerPassword"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className={inputClasses}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClasses}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClasses}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className={labelClasses}>
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClasses}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="industry" className={labelClasses}>
                  Industry
                </label>
                <input
                  id="industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={inputClasses}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className={labelClasses}>
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`${inputClasses} bg-white`}
                  disabled={isLoading}
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className={labelClasses}>
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className={`${inputClasses} bg-white`}
                  disabled={isLoading}
                >
                  <option value="">Select timezone...</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c9a445] hover:bg-[#e7c972] text-[#0a1628] font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-8">
          <Link to="/" className="hover:text-[#8a6e24] transition">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;