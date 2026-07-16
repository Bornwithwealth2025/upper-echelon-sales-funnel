import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Check,
  Crown,
  Lightbulb,
  Menu,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import {
  //Crest,
  InstagramIcon,
  LinkedinIcon,
// Wordmark,
  XMark,
  YoutubeIcon,
} from '../components/UpperEchelonBrand';
import logo from '../assets/logoo.png';

const heroImage =
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?fm=jpg&q=80&w=2400&auto=format&fit=crop';

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Our Mission', href: '#mission' },
  { label: 'Membership', href: '#membership' },
];

const pillars = [
  {
    number: '01',
    icon: Users,
    title: 'Strategic Network',
    description:
      'Build meaningful relationships with ambitious professionals, founders, investors, and industry leaders.',
  },
  {
    number: '02',
    icon: TrendingUp,
    title: 'Wealth & Ownership',
    description:
      'Develop the knowledge, mindset, and access needed to create lasting assets and generational value.',
  },
  {
    number: '03',
    icon: Lightbulb,
    title: 'Innovation & Influence',
    description:
      'Turn valuable ideas into credible opportunities, ventures, and work that moves markets forward.',
  },
  {
    number: '04',
    icon: Award,
    title: 'Leadership & Legacy',
    description:
      'Grow into a leader whose standards, decisions, and contribution create a lasting impact.',
  },
];

const benefits = [
  'A selective community of ambitious professionals and builders',
  'Meaningful access to mentors, investors, founders, and industry leaders',
  'Opportunities to collaborate on projects with measurable impact',
  'A platform to strengthen your network, personal brand, and long-term influence',
];

const heroStats = [
  { value: '1,200+', label: 'Vetted members across 40+ industries' },
  { value: '85%', label: 'Report a new venture or partnership within a year' },
  { value: 'By invitation', label: 'Every application reviewed by hand' },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#fcfbf8]/95 shadow-[0_1px_0_rgba(10,22,40,0.04)] backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="flex items-center"
          aria-label="The Upper Echelon home"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="The Upper Echelon"
            className="h-14 w-auto max-w-[230px] object-contain sm:h-[60px] sm:max-w-[280px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:gap-10 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-2 text-sm font-medium text-slate-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#c9a445] after:transition-all hover:text-[#0a1628] hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden text-sm font-semibold text-[#0a1628] transition-colors hover:text-[#8a6e24] sm:inline-block"
          >
            Member Login
          </Link>

          <Link
            to="/collect"
            className="hidden rounded-md bg-[#0a1628] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b3156] sm:inline-flex"
          >
            Apply Now
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-[#0a1628] transition hover:border-[#c9a445] hover:text-[#8a6e24] md:hidden"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-[#fcfbf8] px-5 py-6 shadow-lg md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#f4f1e9] hover:text-[#0a1628]"
              >
                {link.label}
              </a>
            ))}

            <div className="my-3 h-px bg-slate-200" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-md px-3 py-3 text-sm font-semibold text-[#0a1628]"
            >
              Member Login
            </Link>

            <Link
              to="/collect"
              onClick={closeMenu}
              className="mt-2 rounded-md bg-[#0a1628] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1b3156]"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden bg-[#0a1628]">
    <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-10 lg:py-28">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp} className="mb-7 flex items-center gap-3 text-[#e7c972]">
          <span className="h-px w-10 bg-[#c9a445]" />
          <span className="text-xs font-bold uppercase tracking-[0.22em]">The Upper Echelon</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-6xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Where ambition finds
          <span className="block text-[#e7c972]">its rightful room.</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          The Upper Echelon is a private community for high-potential professionals,
          entrepreneurs, and innovators building the work, network, and legacy that
          define the future.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/collect"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c9a445] px-6 py-3.5 text-sm font-bold text-[#0a1628] transition hover:bg-[#e7c972]"
          >
            Begin Your Application
            <ArrowRight size={17} />
          </Link>

          <a
            href="#mission"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Discover the community
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#c9a445]/30">
          <img src={heroImage} alt="" className="h-72 w-full object-cover sm:h-80 lg:h-[26rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/10 to-transparent" />
        </div>

        <div className="relative -mt-16 mx-4 rounded-xl border border-[#c9a445]/25 bg-[#0a1628]/95 p-5 backdrop-blur sm:mx-6 sm:p-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="sm:border-r sm:border-[#c9a445]/20 sm:pr-3 sm:last:border-r-0 sm:last:pr-0">
                <dt
                  className="text-xl font-semibold text-[#e7c972] sm:text-lg"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-slate-400">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </div>
  </section>
);

const Mission: React.FC = () => (
  <section id="mission" className="bg-[#fcfbf8] py-20 sm:py-28">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a6e24]">
          Our mission
        </p>
        <h2
          className="mt-5 text-4xl leading-tight text-[#0a1628] sm:text-5xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Exceptional people become more powerful together.
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="border-l border-[#c9a445] pl-6 sm:pl-8"
      >
        <motion.p variants={fadeUp} className="text-lg leading-relaxed text-slate-600">
          Ambition needs more than motivation. It needs proximity to people who raise
          your standards, challenge your thinking, and turn possibility into action.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-slate-500">
          We bring together emerging leaders who are serious about building wealth,
          influence, ventures, and meaningful impact.
        </motion.p>
      </motion.div>
    </div>
  </section>
);

const Pillars: React.FC = () => (
  <section id="membership" className="border-y border-slate-200 bg-[#f4f1e9] py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a6e24]">
          The membership experience
        </p>
        <h2
          className="mt-4 text-4xl leading-tight text-[#0a1628] sm:text-5xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Built for people who intend to leave a mark.
        </h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <motion.article
              key={pillar.number}
              variants={fadeUp}
              className="group border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-wider text-[#8a6e24]">
                  {pillar.number}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a1628] text-[#e7c972]">
                  <Icon size={18} />
                </span>
              </div>

              <h3
                className="mt-10 text-2xl leading-tight text-[#0a1628]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {pillar.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {pillar.description}
              </p>

              <div className="mt-7 h-px w-10 bg-[#c9a445] transition-all group-hover:w-16" />
            </motion.article>
          );
        })}
      </motion.div>
    </div>
  </section>
);

const MembershipCta: React.FC = () => (
  <section className="bg-[#fcfbf8] py-20 sm:py-28">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a6e24]"
        >
          Why join
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="mt-5 text-4xl leading-tight text-[#0a1628] sm:text-5xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Opportunity becomes inevitable when excellence becomes your environment.
        </motion.h2>

        <motion.ul variants={stagger} className="mt-9 space-y-5">
          {benefits.map((benefit) => (
            <motion.li key={benefit} variants={fadeUp} className="flex items-start gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0a1628] text-[#e7c972]">
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="text-base leading-relaxed text-slate-600">{benefit}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55 }}
        className="bg-[#0a1628] p-8 sm:p-10"
      >
        <Crown className="text-[#c9a445]" size={29} />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#e7c972]">
          Membership application
        </p>
        <h3
          className="mt-4 text-3xl leading-tight text-white sm:text-4xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Your next chapter deserves a stronger room.
        </h3>
        <p className="mt-5 text-base leading-relaxed text-slate-300">
          Applications are reviewed to ensure every member adds to—and benefits
          from—the quality of the community.
        </p>

        <Link
          to="/collect"
          className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9a445] px-6 py-3.5 text-sm font-bold text-[#0a1628] transition hover:bg-[#e7c972]"
        >
          Submit Your Application
          <ArrowRight size={17} />
        </Link>

        <Link
          to="/login"
          className="mt-5 block text-center text-sm font-medium text-slate-300 transition hover:text-[#e7c972]"
        >
          Already a member? Sign in
        </Link>
      </motion.aside>
    </div>
  </section>
);

const Quote: React.FC = () => (
  <section className="bg-[#0a1628] py-20 text-center sm:py-24">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={fadeUp}
      className="mx-auto max-w-4xl px-5 sm:px-8"
    >
      <p
        className="text-6xl leading-none text-[#c9a445]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        &ldquo;
      </p>
      <blockquote
        className="mt-2 text-3xl leading-tight text-white sm:text-4xl lg:text-5xl"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Surround yourself with excellence.
        <span className="block text-[#e7c972]">Opportunity becomes inevitable.</span>
      </blockquote>
    </motion.div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="bg-[#07101f] py-10 text-white">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
      <div className="flex flex-col items-center gap-3 lg:items-start">
       <Link to="/" className="inline-flex items-center" aria-label="The Upper Echelon home">
  <img
    src={logo}
    alt="The Upper Echelon"
    className="h-16 w-auto max-w-[250px] object-contain invert"
  />
</Link>
        <p className="text-xs text-slate-500">Bigger than you. Smarter together. Built to change the world.</p>
      </div>

      <div className="flex items-center justify-center gap-5">
        <InstagramIcon size={18} className="text-slate-400 transition hover:text-[#e7c972]" />
        <LinkedinIcon size={18} className="text-slate-400 transition hover:text-[#e7c972]" />
        <YoutubeIcon size={18} className="text-slate-400 transition hover:text-[#e7c972]" />
        <XMark size={16} className="text-slate-400 transition hover:text-[#e7c972]" />
      </div>

      <div className="text-center lg:text-right">
        <Link
          to="/collect"
          className="text-sm font-bold text-[#e7c972] transition hover:text-white"
        >
          Apply now. The future is not waiting.
        </Link>
        <p className="mt-2 text-xs text-slate-500">
          © {new Date().getFullYear()} The Upper Echelon. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#0a1628]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <Hero />
      <Mission />
      <Pillars />
      <MembershipCta />
      <Quote />
      <Footer />
    </div>
  );
};

export default LandingPage;