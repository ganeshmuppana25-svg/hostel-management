import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  ArrowRight,
  Wrench,
  CalendarCheck,
  Utensils,
  Sparkles,
  CheckCircle2,
  Users,
  Shield,
  Briefcase,
  GraduationCap,
  UserCheck,
  Activity,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  Play,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FloatingParticles } from '../components/common/FloatingParticles';
import { WatchDemoModal } from '../components/modals/WatchDemoModal';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [showcaseRole, setShowcaseRole] = useState<UserRole>('student');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setIsScrolled(false);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileNavOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoAccess = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'student') navigate('/dashboard');
    else if (role === 'warden') navigate('/warden');
    else if (role === 'security') navigate('/security');
    else if (role === 'maintenance') navigate('/maintenance-team');
    else if (role === 'admin') navigate('/admin');
  };

  const features = [
    {
      title: 'Smart Room Management',
      desc: 'Real-time bed allocations, occupancy maps for 4 blocks, roommate directory, and automated room transfer requests.',
      icon: Building2,
      color: 'from-blue-500 to-indigo-600',
      tag: 'Beds & Occupancy',
    },
    {
      title: 'Maintenance Operations',
      desc: 'Report infrastructure faults, upload photos, smart priority tagging, and track a live 4-stage technician repair timeline.',
      icon: Wrench,
      color: 'from-amber-500 to-orange-600',
      tag: 'Rapid Dispatch',
    },
    {
      title: 'Leave & Outstation Passes',
      desc: 'Paperless digital leave requests with parental emergency contacts, warden approvals, and instant gate pass generation.',
      icon: CalendarCheck,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Gate Verified',
    },
    {
      title: 'Mess & Dining Management',
      desc: 'Interactive daily & weekly rotational dining menus, dietary nutrition insight, real-time ratings, and student dish voting.',
      icon: Utensils,
      color: 'from-pink-500 to-rose-600',
      tag: 'Dining & Menu',
    },
    {
      title: 'Secure Visitor Management',
      desc: 'Pre-authorized guest passes for parents and visitors with digital QR verification and gate check-in/check-out timestamps.',
      icon: Users,
      color: 'from-purple-500 to-violet-600',
      tag: 'Digital QR Passes',
    },
    {
      title: 'Multi-Role Access Control',
      desc: 'Connected, unified operational dashboards for students, wardens, security officers, maintenance crew, and directors.',
      icon: Shield,
      color: 'from-cyan-500 to-blue-600',
      tag: 'Unified Ecosystem',
    },
  ];

  // Interactive showcase roles details
  const showcaseData: Record<
    UserRole,
    {
      title: string;
      subtitle: string;
      badge: string;
      stats: { label: string; value: string; trend: string }[];
      features: string[];
      previewComponent: React.ReactNode;
    }
  > = {
    student: {
      title: 'Resident Student Dashboard',
      subtitle: 'Effortless hostel living with transparent digital requests, room directory, and instant notices.',
      badge: 'Student Portal',
      stats: [
        { label: 'Room Number', value: 'B-204', trend: 'Block B' },
        { label: 'Attendance', value: '94.2%', trend: '↑ Satisfactory' },
        { label: 'Active Tickets', value: '1 Open', trend: 'Assigned' },
        { label: 'Dining Score', value: '4.8 ★', trend: 'Mess Rated' },
      ],
      features: [
        'One-click maintenance ticket submission with photo uploads',
        'Outstation leave passes with digital QR code generation',
        'Real-time mess meal ratings and dietary voting',
        'Emergency guardian verification and room details',
      ],
      previewComponent: (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                AK
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Aravind Kumar</p>
                <p className="text-xs text-slate-400">STU2026-0142 • Room B-204</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              Active Resident
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Latest Outstation Pass</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Home Visit (Approved)</p>
              <span className="text-[10px] text-indigo-500 font-mono font-semibold">Pass: VP-8910</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Maintenance Ticket</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Ceiling Fan Regulator</p>
              <span className="text-[10px] text-amber-500 font-semibold">In Progress (Tech assigned)</span>
            </div>
          </div>
        </div>
      ),
    },
    warden: {
      title: 'Chief Warden Command Center',
      subtitle: 'Unified operational oversight across 4 residential blocks, room assignments, leaves, and staff dispatch.',
      badge: 'Warden Center',
      stats: [
        { label: 'Total Residents', value: '450', trend: '4 Blocks' },
        { label: 'Hostel Occupancy', value: '92.4%', trend: '↑ High' },
        { label: 'Pending Leaves', value: '4 Queue', trend: 'Needs Review' },
        { label: 'Open Complaints', value: '6 Active', trend: '3 Assigned' },
      ],
      features: [
        'Interactive block-by-block bed allocation & vacancy grid',
        'Smart Room Recommendation simulation with compatibility scoring',
        'Instant leave review with parental consent audit notes',
        'Technician dispatch with automated priority tagging',
      ],
      previewComponent: (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Block B Bed Allocation Map</p>
              <p className="text-xs text-slate-400">Interactive Floor & Room Layout</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              92% Occupied
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['B-201 🟢', 'B-202 🟢', 'B-203 🟡', 'B-204 🟢', 'B-205 🔴', 'B-206 🟢', 'B-207 🟢', 'B-208 🟢'].map(
              (r) => (
                <div
                  key={r}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center"
                >
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{r}</p>
                </div>
              )
            )}
          </div>
        </div>
      ),
    },
    security: {
      title: 'Campus Security & Gate Post',
      subtitle: 'Biometric turnstiles, digital QR visitor passes, outstation departures, and live campus headcounts.',
      badge: 'Security Post',
      stats: [
        { label: 'Visitors Today', value: '14 Logged', trend: 'Gate 1' },
        { label: 'Currently Inside', value: '3 Active', trend: 'Pass Valid' },
        { label: 'Student Exits', value: '28 Passed', trend: 'Authorized' },
        { label: 'Gate Incidents', value: '0 Active', trend: '● Normal' },
      ],
      features: [
        'Instant digital visitor pass verification & barcode scanning',
        'Real-time student outstation movement log with timestamps',
        'One-click visitor check-in and check-out tracking',
        'Campus occupancy headcount & curfew emergency alerts',
      ],
      previewComponent: (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Gate 1 Live Turnstile Stream</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">LIVE FEED</span>
          </div>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Ramesh Deshmukh (Visitor)</span>
              <span className="text-emerald-500 font-bold">Checked Out • 11:42</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Sunita Verma (Parent)</span>
              <span className="text-indigo-500 font-bold">Inside Campus (Pass VP-9102)</span>
            </div>
          </div>
        </div>
      ),
    },
    maintenance: {
      title: 'Facilities & Maintenance Staff Portal',
      subtitle: 'On-demand rapid issue dispatch, work orders, on-site diagnostics, parts notes, and resolved certification.',
      badge: 'Maintenance Portal',
      stats: [
        { label: 'Assigned Work', value: '8 Tasks', trend: 'Electrical & AC' },
        { label: 'In Progress', value: '2 Underway', trend: 'Block B' },
        { label: 'Resolved Today', value: '12 Closed', trend: '↑ 98% On Time' },
        { label: 'Response Time', value: '24 Min', trend: 'Average' },
      ],
      features: [
        'Real-time task queue with high-priority emergency tags',
        'One-tap "Start Work" updating student timeline live',
        'Resolution note logging and parts replacement records',
        'Automated resident completion notification upon resolution',
      ],
      previewComponent: (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Active Work Order: MH-1024</p>
              <p className="text-xs text-slate-400">Room B-204 • Broken Ceiling Fan</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              HIGH PRIORITY
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Assigned: Rajesh Sharma</p>
              <p className="text-[11px] text-slate-500">Stage: In Progress (Inspecting Capacitor)</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700">
              Mark Resolved
            </button>
          </div>
        </div>
      ),
    },
    admin: {
      title: 'Institutional Administration & Analytics',
      subtitle: 'Executive intelligence, multi-block comparison metrics, complaint turnaround trends, and occupancy insights.',
      badge: 'Campus Director',
      stats: [
        { label: 'Campus Capacity', value: '480 Beds', trend: '4 Residential Blocks' },
        { label: 'Total Occupancy', value: '92.4%', trend: '↑ 443 Residents' },
        { label: 'Avg Resolution', value: '2.4 Hrs', trend: '95% Faster' },
        { label: 'Dining Satisfaction', value: '4.7 ★', trend: 'Mess Rotational' },
      ],
      features: [
        'Comprehensive Recharts visual analytics and trend curves',
        'Block-wise maintenance breakdown and turnaround speeds',
        'Gate throughput peak analysis and curfew monitoring',
        'Full administrative staff and security audit trails',
      ],
      previewComponent: (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Campus Block Capacity Breakdown</p>
            <span className="text-xs text-indigo-500 font-bold">480 Total Beds</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Block A</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">96%</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Block B</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">92%</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Block C</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">88%</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Block D</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">94%</p>
            </div>
          </div>
        </div>
      ),
    },
  };

  const currentShowcase = showcaseData[showcaseRole];

  return (
    <div
      id="home"
      className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white"
    >
      {/* Background Animated Gradient Mesh + Aurora Ribbon Waves */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle futuristic grid texture */}
        <div className="absolute inset-0 futuristic-grid opacity-70" />

        {/* Moving aurora ribbons */}
        <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-500/15 blur-[120px] animate-aurora" />
        <div className="absolute top-[30%] -right-[15%] w-[700px] h-[550px] rounded-full bg-gradient-to-bl from-purple-600/20 via-violet-600/15 to-pink-500/10 blur-[130px] animate-aurora-reverse" />
        <div className="absolute bottom-[5%] left-[20%] w-[650px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-indigo-600/10 blur-[120px] animate-aurora" />
      </div>

      {/* Floating Glass Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 dark:bg-[#0b101c]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-indigo-500/5 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <NavLink
            to="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2"
          >
            <Logo size="md" />
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#showcase"
              onClick={(e) => scrollToSection(e, 'showcase')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Platform Roles
            </a>
            <a
              href="#live-ops"
              onClick={(e) => scrollToSection(e, 'live-ops')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Live Operations
            </a>
            <a
              href="#testimonials"
              onClick={(e) => scrollToSection(e, 'testimonials')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              title="Toggle color theme"
              aria-label="Toggle color theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <NavLink to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </NavLink>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDemoAccess('student')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-4 pt-3 pb-6 bg-white/95 dark:bg-[#0b101c]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl space-y-3"
            >
              <nav className="flex flex-col space-y-2 text-sm font-medium">
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  How It Works
                </a>
                <a
                  href="#showcase"
                  onClick={(e) => scrollToSection(e, 'showcase')}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Platform Roles
                </a>
                <a
                  href="#live-ops"
                  onClick={(e) => scrollToSection(e, 'live-ops')}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Live Operations
                </a>
                <a
                  href="#testimonials"
                  onClick={(e) => scrollToSection(e, 'testimonials')}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  About
                </a>
              </nav>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => setDemoModalOpen(true)}>
                  Watch Operations Tour
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleDemoAccess('student')}>
                  Get Started as Student
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden z-10">
        {/* Lightweight interactive floating particles */}
        <FloatingParticles />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-200 dark:border-indigo-800/70 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm shadow-indigo-500/5 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Phase 2 Smart Hostel Operations Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.12]"
          >
            A Smarter Way to Live,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400">
              Learn & Belong.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            HostelHub makes hostel life simpler, safer and smarter for students, wardens, security teams and
            administrators.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleDemoAccess('student')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="shadow-xl shadow-indigo-500/25"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDemoModalOpen(true)}
              leftIcon={<Play className="w-4 h-4 text-indigo-500 fill-indigo-500" />}
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Instant Demo Role Switcher Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-slate-500 font-medium mr-1">Instant Demo Switcher:</span>
            <button
              onClick={() => handleDemoAccess('student')}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:scale-105 transition-all"
            >
              👨‍🎓 Student
            </button>
            <button
              onClick={() => handleDemoAccess('warden')}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
            >
              👔 Warden
            </button>
            <button
              onClick={() => handleDemoAccess('security')}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
            >
              🛡️ Security
            </button>
            <button
              onClick={() => handleDemoAccess('maintenance')}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
            >
              🔧 Maintenance
            </button>
            <button
              onClick={() => handleDemoAccess('admin')}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
            >
              🏢 Admin
            </button>
          </motion.div>

          {/* Hero Visual Preview with Floating Live KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 sm:mt-18 relative max-w-5xl mx-auto"
          >
            {/* Floating Live KPI Cards */}
            {/* Card 1: Occupancy */}
            <div className="hidden sm:flex absolute -top-6 -left-6 z-20 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0e1626]/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md items-center gap-3 animate-float-slow text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Occupancy</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">92%</span>
                  <span className="text-[11px] font-bold text-emerald-500 flex items-center">↑ 4.2%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Maintenance */}
            <div className="hidden sm:flex absolute -top-8 -right-6 z-20 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0e1626]/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md items-center gap-3 animate-float-reverse text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Maintenance</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">18 Active</span>
                  <span className="text-[11px] font-bold text-emerald-500">↓ 12%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Security */}
            <div className="hidden sm:flex absolute -bottom-6 right-10 z-20 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0e1626]/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md items-center gap-3 animate-float-slow text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security Gate</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">24/7 Active</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Futuristic Dashboard Concept Box */}
            <div className="rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/90 via-slate-300/40 to-indigo-500/10 dark:from-slate-800/90 dark:via-slate-900/60 dark:to-indigo-950/20 shadow-2xl border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-md">
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 text-left p-5 sm:p-7 shadow-inner">
                {/* Mock Top Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-indigo-500/30">
                      H
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        HostelHub Operations Control Room
                      </h4>
                      <p className="text-xs text-slate-400">Connected Campus Platform • 4 Residential Blocks</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDemoAccess('student')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Open live dashboard <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Conceptual Hostel Dashboard Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Block Layout & Beds</span>
                      <span className="text-xs font-bold text-emerald-500">443 / 480</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      92.4% Occupancy Verified
                    </p>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[92%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Maintenance Dispatch</span>
                      <span className="text-xs font-bold text-indigo-500">95% Turnaround</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Rapid On-Site Diagnostics
                    </p>
                    <p className="text-xs text-slate-400">
                      Smart Priority classification automatically routes tickets.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Security Checkpoints</span>
                      <span className="text-xs font-bold text-emerald-500">Gate 1 & Turnstiles</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Paperless Digital Passes
                    </p>
                    <p className="text-xs text-slate-400">
                      Outstation departs and visitor entries logged with timestamps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Animated Statistics */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1626]/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">1K+</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Students</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1626]/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">95%</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Faster Resolution</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1626]/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">24/7</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Support & Safety</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1626]/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">100%</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Connected State</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section ("A Smarter Hostel Experience") */}
      <section id="features" className="py-20 sm:py-28 relative z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
              A Smarter Hostel Experience
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Every operation from room selection and maintenance to dining and gate security engineered as one
              cohesive ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group relative p-7 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {f.tag}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Explore workflow</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase Section */}
      <section id="showcase" className="py-20 sm:py-28 bg-slate-100/60 dark:bg-[#0b101c]/80 relative z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Interactive Product Demo
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
              Tailored For Every Role
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Switch roles to experience the tailored workflows, telemetry, and capabilities of HostelHub.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {(
              [
                { role: 'student' as UserRole, label: 'Resident Student', icon: GraduationCap },
                { role: 'warden' as UserRole, label: 'Chief Warden', icon: UserCheck },
                { role: 'security' as UserRole, label: 'Security Officer', icon: Shield },
                { role: 'maintenance' as UserRole, label: 'Maintenance Staff', icon: Briefcase },
                { role: 'admin' as UserRole, label: 'Campus Director', icon: Building2 },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              const isActive = showcaseRole === t.role;
              return (
                <button
                  key={t.role}
                  onClick={() => setShowcaseRole(t.role)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                      : 'bg-white dark:bg-[#0e1626] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Showcase Display Box */}
          <div className="rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Role Information */}
              <div className="lg:col-span-6 space-y-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                  {currentShowcase.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentShowcase.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentShowcase.subtitle}
                </p>

                {/* Key Features List */}
                <div className="space-y-2.5">
                  {currentShowcase.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleDemoAccess(showcaseRole)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Open {currentShowcase.badge}
                  </Button>
                </div>
              </div>

              {/* Right Column: Live Interactive Mockup */}
              <div className="lg:col-span-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
                  {/* Stats Ribbon */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentShowcase.stats.map((s) => (
                      <div
                        key={s.label}
                        className="p-3 rounded-2xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80"
                      >
                        <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-lg font-black text-slate-900 dark:text-white">{s.value}</span>
                          <span className="text-[10px] font-bold text-indigo-500">{s.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Role Specific Interactive Preview Component */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80">
                    {currentShowcase.previewComponent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 relative z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Connected Pipeline
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
              How HostelHub Works
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              A synchronized 5-step operational pipeline connecting resident needs to on-the-ground resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Report',
                role: 'Student',
                desc: 'Student submits complaint, outstation leave, or guest pass request.',
                color: 'from-blue-500 to-indigo-600',
              },
              {
                step: '02',
                title: 'Review',
                role: 'Warden',
                desc: 'Warden reviews request, inspects severity & guardian authorization.',
                color: 'from-indigo-500 to-purple-600',
              },
              {
                step: '03',
                title: 'Assign',
                role: 'Smart Dispatch',
                desc: 'System assigns maintenance technician or pre-authorizes gate turnstile pass.',
                color: 'from-purple-500 to-pink-600',
              },
              {
                step: '04',
                title: 'Resolve',
                role: 'Staff Action',
                desc: 'Technician fixes fault on site or security checks visitor pass at the gate.',
                color: 'from-amber-500 to-emerald-600',
              },
              {
                step: '05',
                title: 'Notify',
                role: 'Student & Records',
                desc: 'Resident receives real-time notification with completed audit logs.',
                color: 'from-emerald-500 to-cyan-500',
              },
            ].map((p, _idx) => (
              <div
                key={p.step}
                className="p-5 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      Step {p.step}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">{p.role}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Operations Section */}
      <section id="live-ops" className="py-20 sm:py-28 bg-slate-100/60 dark:bg-[#0b101c]/80 relative z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Hostel Telemetry
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Real-Time Campus Activity
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Watch every hostel event update live across the network—from gate entries and visitor passes to
                technician repair jobs.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleDemoAccess('security')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View Security Gate Stream
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Live Hostel Activity Feed
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    ● ACTIVE
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { time: '14:32', event: 'Visitor entered Block B (Parent pass verified at Gate 1)', type: 'security' },
                    { time: '14:35', event: 'Maintenance request created for Room B-204 (Ceiling fan)', type: 'maint' },
                    { time: '14:41', event: 'Leave request approved for student Aravind Kumar (Weekend Home Visit)', type: 'leave' },
                    { time: '14:46', event: 'Room B-204 issue resolved: Capacitor replaced & certified functional', type: 'resolved' },
                    { time: '14:52', event: 'Biometric turnstile check-in logged for Pranav Patel (A-102)', type: 'turnstile' },
                  ].map((item, _idx) => (
                    <div
                      key={item.time}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {item.time}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{item.event}</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Platform Cards Section */}
      <section id="roles" className="py-20 sm:py-28 relative z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Role-Based Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
              Dedicated Experiences For Every User
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Choose your portal to enter the live operations environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              {
                role: 'student' as UserRole,
                title: 'Students',
                badge: 'Resident Portal',
                desc: 'Manage room, submit complaints, outstation passes, and rate dining.',
                icon: GraduationCap,
                color: 'border-blue-500/40 hover:border-blue-500',
              },
              {
                role: 'warden' as UserRole,
                title: 'Wardens',
                badge: 'Command Center',
                desc: '4-block room mapping, student allocations, leave approvals, and broadcast notices.',
                icon: UserCheck,
                color: 'border-indigo-500/40 hover:border-indigo-500',
              },
              {
                role: 'security' as UserRole,
                title: 'Security',
                badge: 'Gate Command',
                desc: 'Visitor QR scanning, student movement check-in/out, and campus occupancy.',
                icon: Shield,
                color: 'border-emerald-500/40 hover:border-emerald-500',
              },
              {
                role: 'maintenance' as UserRole,
                title: 'Maintenance',
                badge: 'Technician Staff',
                desc: 'Assigned repair queue, diagnosis notes, and student completion notices.',
                icon: Briefcase,
                color: 'border-amber-500/40 hover:border-amber-500',
              },
              {
                role: 'admin' as UserRole,
                title: 'Administrators',
                badge: 'Global Analytics',
                desc: 'Campus Recharts trends, multi-block comparison, and executive governance.',
                icon: Building2,
                color: 'border-purple-500/40 hover:border-purple-500',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`p-6 rounded-3xl bg-white dark:bg-[#0e1626] border ${card.color} shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-1`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-indigo-500">{card.badge}</span>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{card.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleDemoAccess(card.role)}
                      className="w-full py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      Enter Portal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section (Demo Identities) */}
      <section id="testimonials" className="py-20 sm:py-28 bg-slate-100/60 dark:bg-[#0b101c]/80 relative z-10 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              Community Voices
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
              Designed For Real Campus Living
            </h2>
            <p className="mt-3 text-xs text-slate-400 italic">
              (Representative simulation reviews from demonstration student and staff profiles)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'HostelHub turns everyday hostel requests into a simple, transparent workflow. I never have to chase paper permission slips for weekend passes.',
                author: 'Aravind Kumar',
                role: 'Resident Student (Block B)',
                avatar: '/avatars/aravind_kumar.jpg',
                rating: 5,
              },
              {
                quote:
                  'Managing 480 beds and approving outstation leaves used to take hours. Now the bed matrix and automated parental emergency checks happen instantly.',
                author: 'Dr. K. Ramanathan',
                role: 'Chief Hostel Warden',
                avatar: '/avatars/dr_ramanathan.jpg',
                rating: 5,
              },
              {
                quote:
                  'Turnstile entry and digital visitor passes eliminated queue bottlenecks at Gate 1 completely. Everything is verified and audit-ready.',
                author: 'Officer S. Verma',
                role: 'Chief Security Supervisor',
                avatar: '/avatars/officer_verma.jpg',
                rating: 5,
              },
            ].map((t) => (
              <div
                key={t.author}
                className="p-7 rounded-3xl bg-white dark:bg-[#0e1626] border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-base">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.author}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dramatic CTA Section */}
      <section className="py-20 sm:py-28 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl relative overflow-hidden">
            {/* Ambient lighting inside CTA */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-purple-400/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Ready to make hostel life smarter?
              </h2>
              <p className="text-base sm:text-lg text-indigo-100 leading-relaxed">
                Join our live demonstration platform to test connected workflows across students, wardens,
                maintenance technicians, and security officers.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleDemoAccess('student')}
                  className="bg-white text-indigo-900 hover:bg-slate-100 shadow-xl"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setDemoModalOpen(true)}
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Explore Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#070b14]/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <Logo size="md" />
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                HostelHub is an integrated smart residential platform designed for modern student living, security
                automation, and facility operations.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Product
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Roles
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Resources
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => setDemoModalOpen(true)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Operations Tour
                  </button>
                </li>
                <li>
                  <NavLink to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Demo Credentials
                  </NavLink>
                </li>
                <li>
                  <a href="#home" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Company
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    About
                  </a>
                </li>
                <li>
                  <NavLink to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Contact
                  </NavLink>
                </li>
                <li>
                  <a href="#home" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
            <p>© 2026 HostelHub. All rights reserved.</p>
            <p className="font-mono text-[11px]">Phase 2 Production Release • Connected Frontend Platform</p>
          </div>
        </div>
      </footer>

      {/* Interactive Watch Demo Modal */}
      <WatchDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
};
