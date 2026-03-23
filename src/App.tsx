import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Services from './pages/Services';
import logo from './assets/logo.svg';

const Typewriter = ({ text, delay = 0, speed = 30, className = "", onComplete, startTrigger = true }: { text: string, delay?: number, speed?: number, className?: string, onComplete?: () => void, startTrigger?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!startTrigger) return;
    
    const timeout = setTimeout(() => {
      setHasStarted(true);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed, onComplete, startTrigger]);

  return (
    <span className={className}>
      {displayedText}
      {hasStarted && displayedText.length < text.length && <span className="w-[3px] h-[0.8em] bg-violet-500 animate-pulse ml-1 inline-block align-baseline"></span>}
    </span>
  );
};

const VantaLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Rotating outer ring */}
      <svg className="absolute w-[160%] h-[160%] animate-[spin_15s_linear_infinite] opacity-30" viewBox="0 0 100 100">
        <circle 
          cx="50" cy="50" r="48" 
          fill="none" 
          stroke="#8B5CF6" 
          strokeWidth="0.5" 
          strokeDasharray="2, 6"
        />
        <circle 
          cx="50" cy="50" r="46" 
          fill="none" 
          stroke="#3B82F6" 
          strokeWidth="1" 
          strokeDasharray="40, 160"
        />
      </svg>
      
      {/* Inner scanning effect */}
      <div className="absolute inset-0 z-0 overflow-hidden mask-image-circle">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-violet-400/40 to-transparent animate-[scan_2s_linear_infinite] mix-blend-overlay" />
      </div>

      {/* The Logo */}
      <img src={logo} alt="Vanta Logo" className="relative z-10 h-full w-auto object-contain" />
    </div>
  );
};

const TypographicLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase(1), 800);
    const hideTimer = setTimeout(() => setPhase(2), 3200);
    const endTimer = setTimeout(() => {
      setPhase(3);
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      clearTimeout(endTimer);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${phase >= 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`flex flex-col items-center justify-center font-display transition-all duration-2000 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${phase === 0 ? 'opacity-0 blur-md scale-90' : ''}
        ${phase === 1 ? 'opacity-100 blur-0 scale-100' : ''}
        ${phase >= 2 ? 'opacity-0 blur-xl scale-110' : ''}
      `}>
        <VantaLogo className="h-28 md:h-40 lg:h-48 mb-12" />
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-none tracking-tighter uppercase">VANTA</span>
          <div className="h-px w-full bg-linear-to-r from-transparent via-violet-500 to-transparent opacity-50" />
          <span className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-500 leading-none tracking-[0.2em] uppercase ml-2">SOLUTIONS</span>
        </div>
      </div>
    </div>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className={`border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'bg-white/5 border-white/20' : 'hover:bg-white/2'}`}>
      <button 
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
      >
        <span className={`text-sm md:text-base font-bold transition-colors duration-300 ${isOpen ? 'text-violet-400' : 'text-gray-300 group-hover:text-white'}`}>
          {question}
        </span>
        <div className={`shrink-0 ml-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-violet-400' : 'text-gray-500 group-hover:text-white'}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6 text-sm md:text-base text-gray-400 leading-relaxed border-t border-white/5 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="faq">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-mono font-bold tracking-[0.5em] text-violet-500 uppercase mb-4 block"
          >
            {t('faq.title')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            {t('faq.subtitle')}
          </motion.h2>
        </div>

        <div className="space-y-4">
          {questions.map((item, index) => (
            <FAQItem 
              key={index}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const DisorderedWords = ({ text }: { text: string }) => {
  const words = text.split(' ');
  return (
    <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 relative">
      {words.map((word, i) => {
        // Deterministic disordered values
        const x = (Math.sin(i * 123.456) * 20).toFixed(2);
        const y = (Math.cos(i * 789.012) * 15).toFixed(2);
        const rot = (Math.sin(i * 456.789) * 25).toFixed(2);
        
        return (
          <span
            key={i}
            className="disordered-word opacity-60"
            style={{ 
              transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
              ['--idx' as any]: i 
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const VisibilityWord = ({ word, forceReset, globalReveal }: { word: string; forceReset: boolean; globalReveal: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (forceReset) {
      setIsVisible(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [forceReset]);

  useEffect(() => {
    if (globalReveal && !isVisible) {
      // Stagger the reveal for mobile tap
      const delay = Math.random() * 400;
      setTimeout(() => {
        setIsVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsVisible(false), 5000);
      }, delay);
    }
  }, [globalReveal]);

  const handleReveal = () => {
    if (isVisible) return;
    setIsVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  return (
    <span
      onMouseEnter={handleReveal}
      className={`visibility-word text-lg font-bold transition-all duration-1000 cursor-pointer grayscale select-none ${
        isVisible ? 'opacity-100 blur-0 grayscale-0' : 'opacity-30 blur-[2px]'
      }`}
    >
      {word}
    </span>
  );
};

const VisibilityWords = ({ text, resetTrigger }: { text: string; resetTrigger: boolean }) => {
  const words = text.split(' ');
  const [globalReveal, setGlobalReveal] = useState(false);

  const handleTap = () => {
    setGlobalReveal(true);
    setTimeout(() => setGlobalReveal(false), 5000);
  };

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 relative py-2 cursor-pointer" onClick={handleTap}>
      <div className={`lg:hidden absolute -top-4 right-0 text-[8px] text-red-500/60 font-mono tracking-widest transition-opacity ${globalReveal ? 'opacity-0' : 'opacity-100 animate-pulse pointer-events-none'}`}>
        TAP TO DECRYPT
      </div>
      {words.map((word, i) => (
        <VisibilityWord key={i} word={word} forceReset={resetTrigger} globalReveal={globalReveal} />
      ))}
    </div>
  );
};

const Counter = ({ value, duration = 1200, isVisible }: { value: string, duration?: number, isVisible: boolean }) => {
  const [count, setCount] = useState(0);
  const numericStr = value.replace(/^[^\d]*/, '').replace(/[^\d.].*$/, '');
  const target = parseFloat(numericStr) || 0;
  const prefix = value.match(/^[^\d]*/)?.[0] || '';
  const suffix = value.replace(/^[^\d]*/, '').replace(/^[\d.]+/, '');

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }
    
    let start = 0;
    const end = target;
    const totalFrames = Math.round(duration / 16);
    const increment = end / totalFrames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      start += increment;
      if (currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  const displayCount = Number.isInteger(target) ? Math.floor(count) : count.toFixed(1);
  return <span>{prefix}{displayCount}{suffix}</span>;
};

const StaticWords = ({ text }: { text: string }) => {
  const words = text.split(' ');
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      className="mt-4 relative overflow-hidden border border-white/10 rounded-sm bg-black/40 pt-1 cursor-pointer"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={() => setIsActive(!isActive)}
    >
      <div className={`lg:hidden absolute -top-4 right-0 z-20 text-[8px] text-red-500/60 font-mono tracking-widest transition-opacity ${isActive ? 'opacity-0' : 'opacity-100 animate-pulse pointer-events-none'}`}>
        TAP TO LOAD
      </div>
      
      {/* Excel Header row - Cleaned up */}
      <div className="flex border-b border-white/10 bg-white/5 text-[9px] font-mono text-gray-500">
        <div className="flex-1 px-2 py-0.5 border-r border-white/10">A</div>
        <div className="flex-1 px-2 py-0.5 border-r border-white/10">B</div>
        <div className="flex-1 px-2 py-0.5">C</div>
      </div>
      
      {/* Spreadsheet Content */}
      <div className="flex flex-col font-mono text-[10px]">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
            {[0, 1, 2].map((col) => {
              const wordIdx = row * 3 + col;
              const word = words[wordIdx] || (wordIdx === 8 ? '####' : '');
              return (
                <div key={col} className="flex-1 px-1 py-2 border-r border-white/5 last:border-0 truncate text-gray-400 relative h-8 flex items-center justify-center">
                  <span 
                    className={`static-word inline-block text-center ${isActive ? 'opacity-100 animate-stale-jitter' : 'opacity-0'}`}
                    style={{ 
                      transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${wordIdx * 0.03}s`,
                      transform: isActive ? 'translate(0, 0)' : (wordIdx % 2 === 0 ? 'translateY(10px)' : 'translateX(-10px)')
                    }}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Outdated Label Overlay */}
      <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-red-600/10 backdrop-blur-[0.5px] border border-red-500/30 px-3 py-1 text-[8px] text-red-500/70 font-bold rotate-12 tracking-[0.2em] uppercase">
          Static Report
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [lang, setLang] = useState(i18n.language || 'es');
  const [revealManual, setRevealManual] = useState(false);
  const [resetVisibility, setResetVisibility] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [form, setForm] = useState({
    name: '', company: '', whatsapp: '', email: '', industry: '', goal: '', message: '', website: ''
  });
  const [status, setStatus] = useState('idle');
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const diagnosticRef = useRef<HTMLElement>(null);
  const comparisonRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const protocolScrollRef = useRef<HTMLDivElement>(null);


  const TOTAL_PROTOCOL_CARDS = 4;
  const [activeCard, setActiveCard] = React.useState(0);
  const touchStartX = React.useRef(0);

  useEffect(() => {
    // Manejar el scroll automático hacia las secciones (hash links)
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const goToCard = (idx: number) => {
    if (!protocolScrollRef.current) return;
    const clamped = Math.max(0, Math.min(idx, TOTAL_PROTOCOL_CARDS - 1));
    setActiveCard(clamped);
    const card = protocolScrollRef.current.children[clamped] as HTMLElement;
    if (!card) return;
    const gap = 32; // gap-8
    const offset = clamped * (card.offsetWidth + gap);
    protocolScrollRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    protocolScrollRef.current.style.transform = `translate3d(-${offset}px, 0, 0)`;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) goToCard(delta > 0 ? activeCard + 1 : activeCard - 1);
  };






  useEffect(() => {
    if (isLoaderComplete) {
      document.body.style.overflowY = '';
    } else {
      // Only lock vertical scroll; overflow-x:clip stays from CSS
      document.body.style.overflowY = 'hidden';
    }
    return () => { document.body.style.overflowY = ''; };
  }, [isLoaderComplete]);



  // On every (re)load: disable browser scroll-restore and jump to top
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Force scroll to top before loader finishes so animation always plays from start
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const diagnosticObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setShowDiagnostic(true);
    }, { threshold: 0.2 });

    const comparisonObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setShowComparison(true);
    }, { threshold: 0.2 });

    const projectsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setShowProjects(true);
    }, { threshold: 0 });

    const impactObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setShowImpact(true);
    }, { threshold: 0.1 });

    if (diagnosticRef.current) diagnosticObserver.observe(diagnosticRef.current);
    if (comparisonRef.current) comparisonObserver.observe(comparisonRef.current);
    if (projectsRef.current) projectsObserver.observe(projectsRef.current);
    if (impactRef.current) impactObserver.observe(impactRef.current);

    return () => {
      diagnosticObserver.disconnect();
      comparisonObserver.disconnect();
      projectsObserver.disconnect();
      impactObserver.disconnect();
    };
  }, [location.pathname]);

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzwzyrv'; // Configurado con el ID del usuario
  const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbzAjrczJVoIaI5VI8Jbe2SUwDZ5Uxy-5L9fkmQKLIeiQDSwAGGwP36YXBgBeuTy81dt/exec';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // honeypot anti-spam
    setStatus('loading');

    // Preparar datos para Formspree y Sheets
    const formData = { 
      ...form, 
      lang,
      _subject: `Nuevo Lead: ${form.name} - ${form.company}`
    };

    try {
      // 1. Envío a Formspree (Correos)
      const formspreePromise = fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 2. Envío a Google Sheets (Respaldo/Base de datos)
      const params = new URLSearchParams();
      Object.entries(formData).forEach(([k, v]) => params.append(k, String(v)));
      const sheetUrl = `${SHEETS_WEBHOOK}?${params.toString()}`;
      
      const img = new Image();
      const sheetsPromise = new Promise((resolve) => {
        img.onload = img.onerror = () => resolve(true);
        img.src = sheetUrl;
      });

      // Ejecutar ambos envíos
      const [response] = await Promise.all([formspreePromise, sheetsPromise]);

      if ((response as Response).ok) {
        setStatus('success');
        setForm({ name: '', company: '', whatsapp: '', email: '', industry: '', goal: '', message: '', website: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error enviando formulario:", error);
      setStatus('error');
    }
  };





  const toggleLang = () => {
    const newLang = lang === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  return (
    <>
      <TypographicLoader onComplete={() => setIsLoaderComplete(true)} />
      
      <div className={`transition-opacity duration-1000 ${isLoaderComplete ? 'opacity-100' : 'opacity-0'}`}>
<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
<div className="parallax-shape absolute -top-20 -left-20 w-[600px] h-[600px] bg-violet-600 rounded-full blur-[150px]"></div>
<div className="parallax-shape absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px]"></div>
<div className="parallax-shape absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-indigo-900 rounded-full blur-[150px]"></div>
<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
</div>
<nav className="fixed w-full z-50 top-0 backdrop-blur-xl bg-black/40 border-b border-white/5">
<div className="w-full px-4 sm:px-6 lg:px-12">
<div className="flex items-center justify-between h-20 md:h-24">
<div className="shrink-0 flex items-center gap-3 cursor-pointer group">
<VantaLogo className="h-10 md:h-14 w-auto" />
</div>
<div className="hidden lg:block">
<div className="ml-10 flex items-baseline space-x-8 xl:space-x-12">
<Link className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm xl:text-base font-medium transition-colors relative group" to="/#manifesto">{t('nav.manifesto')}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span></Link>
        <Link className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm xl:text-base font-medium transition-colors relative group" to="/servicios/crm">{t('nav.servicios')}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span></Link>

<Link className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm xl:text-base font-medium transition-colors relative group" to="/#pain-points">{t('nav.pain_points')}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span></Link>
<Link className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm xl:text-base font-medium transition-colors relative group" to="/#command">{t('nav.command')}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span></Link>
<Link className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm xl:text-base font-medium transition-colors relative group" to="/#projects">Proyectos<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span></Link>
<Link className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm xl:text-base font-medium transition-colors relative group" to="/#contact">Contáctanos<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span></Link>
</div>
</div>
<div className="hidden lg:flex items-center gap-4 xl:gap-6">
<button onClick={toggleLang} className="bg-violet-600/10 hover:bg-violet-600/20 text-white px-3 py-1.5 xl:px-4 xl:py-2 rounded-full border border-violet-500/30 text-xs font-bold transition-all flex items-center justify-center min-w-[44px] shadow-lg shadow-violet-500/10 active:scale-95">
  {lang === 'es' ? 'EN' : 'ES'}
</button>
<a href="https://wa.me/524494401613?text=Hola%2C%20me%20interesa%20agendar%20una%20cita%20con%20Vanta%20Solutions" target="_blank" rel="noopener noreferrer" className="btn-premium-nav px-6 py-3 xl:px-10 xl:py-4 text-white rounded-full text-sm xl:text-base font-bold shadow-2xl tracking-wide uppercase inline-flex items-center justify-center">
                    {t('nav.contact')}
                </a>
</div>

{/* Mobile Menu Button */}
<div className="flex lg:hidden items-center gap-2">
  <button onClick={toggleLang} className="bg-violet-600/10 hover:bg-violet-600/20 text-white px-2 sm:px-3 py-1.5 rounded-full border border-violet-500/30 text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center min-w-[36px] shadow-sm active:scale-95">
    {lang === 'es' ? 'EN' : 'ES'}
  </button>
  <a href="https://wa.me/524494401613?text=Hola%2C%20me%20interesa%20agendar%20una%20cita%20con%20Vanta%20Solutions" target="_blank" rel="noopener noreferrer" className="bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-white rounded-full text-[10px] sm:text-xs font-bold shadow-lg shadow-violet-500/20 tracking-wide uppercase inline-flex items-center justify-center whitespace-nowrap transition-colors">
    {t('nav.contact')}
  </a>
  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-1 ml-1">
    <span className="material-symbols-outlined text-3xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
  </button>
</div>
</div>
</div>

{/* Mobile Menu Dropdown */}
{isMobileMenuOpen && (
  <div className="lg:hidden fixed inset-0 z-60 flex justify-end">
    {/* Overlay para cerrar al dar click fuera */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
    
    {/* Panel Lateral */}
    <div className="relative w-[65%] sm:w-[50%] h-dvh bg-[#050308]/98 backdrop-blur-2xl border-l border-white/10 flex flex-col items-end justify-center pr-8 gap-8 shadow-2xl animate-fade-in">
      
      {/* Botón X de cerrado */}
      <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 bg-white/5 border border-white/10 rounded-full active:scale-95 flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>

      <Link onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-violet-400 transition-colors text-xl sm:text-2xl font-medium tracking-wide" to="/#manifesto">{t('nav.manifesto')}</Link>
      <Link onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-violet-400 transition-colors text-xl sm:text-2xl font-medium tracking-wide" to="/servicios/crm">{t('nav.servicios')}</Link>

      <Link onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-violet-400 transition-colors text-xl sm:text-2xl font-medium tracking-wide" to="/#pain-points">{t('nav.pain_points')}</Link>
      <Link onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-violet-400 transition-colors text-xl sm:text-2xl font-medium tracking-wide" to="/#command">{t('nav.command')}</Link>
      <Link onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-violet-400 transition-colors text-xl sm:text-2xl font-medium tracking-wide" to="/#projects">Proyectos</Link>
      <Link onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-violet-400 transition-colors text-xl sm:text-2xl font-medium tracking-wide" to="/#contact">Contáctanos</Link>
    </div>
  </div>
)}
</nav>

    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <>
              {/* Note: In a real scenario, all sections would be here. 
                  Since I'm doing a partial replace, I'll just wrap the existing boundaries. */}

<section className="py-32 relative overflow-hidden bg-[#050505] flex items-center justify-center min-h-screen" id="manifesto">
  <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none"></div>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full manifesto-container mt-24">
  <div className={`hud-corner tl ${isLoaderComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-all duration-700 delay-500`}></div>
  <div className={`hud-corner tr ${isLoaderComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-all duration-700 delay-500`}></div>
  <div className={`hud-corner bl ${isLoaderComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-all duration-700 delay-500`}></div>
  <div className={`hud-corner br ${isLoaderComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-all duration-700 delay-500`}></div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
<div className="order-2 lg:order-1 lg:col-span-4 relative group">
<p className={`text-xl md:text-2xl text-gray-400 font-light leading-relaxed relative flashlight-text ${isLoaderComplete ? 'cinematic-fade-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                    {t('manifesto.line1')}
                    <span className="text-white font-medium">{t('manifesto.line2')}</span>
</p>

{/* Mobile-only copy of line 6 */}
<div className="flex justify-end mt-12 lg:hidden">
  <div className="inline-block relative">
    <p className={`relative text-xl md:text-2xl text-gray-300 font-light max-w-lg ml-auto text-right border-r-2 border-violet-500 pr-6 mr-2 sm:mr-4 flashlight-text ${isLoaderComplete ? 'cinematic-fade-up' : 'opacity-0'}`} style={{animationDelay: '4.8s'}}>
      {t('manifesto.line6')}
    </p>
  </div>
</div>

</div>
      <div className="order-1 lg:order-2 lg:col-span-8 text-right relative z-20">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-white mb-6 break-words" style={{ minHeight: '2em' }}>
          {isLoaderComplete && (
            <>
              <Typewriter text={t('manifesto.line3')} delay={500} speed={40} /><br />
              <Typewriter text={t('manifesto.line4')} delay={1500} speed={40} className="manifesto-highlight" />
            </>
          )}
        </h2>
        <div className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-right w-full block break-words ${isLoaderComplete ? 'cinematic-power' : 'opacity-0 scale-95'}`} style={{filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.6))', animationDelay: '2.8s'}}>
          <span className="text-white">{t('manifesto.line5')} </span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-violet-200 to-gray-400">
            {t('manifesto.power')}
          </span>
        </div>
        
        {/* Desktop-only copy of line 6 */}
        <div className="hidden lg:flex justify-end mt-8">
          <div className="inline-block relative">
            <p className={`relative text-xl md:text-2xl text-gray-300 font-light max-w-lg ml-auto text-right border-r-2 border-violet-500 pr-6 mr-4 flashlight-text ${isLoaderComplete ? 'cinematic-fade-up' : 'opacity-0'}`} style={{animationDelay: '4.8s'}}>
              {t('manifesto.line6')}
            </p>
          </div>
        </div>
      </div>
</div>
<div className={`mt-24 lg:mt-32 text-center relative flex flex-col items-center transition-opacity duration-1000 ${isLoaderComplete ? 'opacity-100 delay-2000' : 'opacity-0'}`}>
<a className="group flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 hover:border-violet-500/50 hover:bg-white/5 transition-all duration-300 transform hover:translate-y-1" href="#hero">
<span className="text-sm font-mono uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">DESCUBRE MÁS</span>
<span className="material-symbols-outlined text-gray-500 group-hover:text-violet-400 text-lg transition-colors group-hover:translate-y-1 duration-300">arrow_downward</span>
</a>
</div>
</div>
</section>
<section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-nebula" id="hero">
<div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.1]"></div>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
<div className="lg:col-span-7 space-y-10">
<div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-xl">
<span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3B82F6]"></span>
<span className="text-xs font-mono font-medium text-violet-300 uppercase tracking-[0.2em]">{t('hero.eyebrow')}</span>
</div>
<h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter text-white">
                    {t('hero.title_main')} <br />
<span className="gradient-heading italic">{t('hero.title_accent')}</span>
</h1>
<p className="text-xl lg:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light">
                    {t('hero.subtitle')}
                </p>
<div className="flex flex-col sm:flex-row gap-6 pt-4">
<a href="https://wa.me/524494401613?text=Hola%2C%20me%20interesa%20agendar%20una%20cita%20con%20Vanta%20Solutions" target="_blank" rel="noopener noreferrer" className="btn-primary-gradient text-white px-10 py-5 rounded-full text-lg font-bold flex items-center justify-center gap-3">
<span>{t('hero.cta_primary')}</span>
<span className="material-symbols-outlined text-xl">event_available</span>
</a>

</div>
<div className="pt-4 border-t border-white/5">
<ul className="space-y-3">
<li className="flex items-center gap-3 text-gray-400">
<span className="material-symbols-outlined text-green-400 text-sm">verified</span>
<span>{t('hero.bullet1')}</span>
</li>
<li className="flex items-center gap-3 text-gray-400">
<span className="material-symbols-outlined text-green-400 text-sm">verified</span>
<span>{t('hero.bullet2')}</span>
</li>
<li className="flex items-center gap-3 text-gray-400">
<span className="material-symbols-outlined text-green-400 text-sm">verified</span>
<span>{t('hero.bullet3')}</span>
</li>
</ul>
</div>
</div>
<div className="lg:col-span-5 relative">
<div className="relative w-full aspect-square flex items-center justify-center transform -rotate-6 transition-all duration-700 ease-out group perspective-1000 animate-float-slow">
<div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent rounded-[40px] border border-white/10 backdrop-blur-sm transform rotate-6 scale-90 -z-10"></div>
<div className="absolute inset-0 bg-linear-to-br from-violet-500/20 to-blue-500/20 rounded-[40px] blur-xl opacity-50 transform translate-y-4 -z-20"></div>
<div className="relative z-10 w-full bg-[#0f1115]/95 rounded-[30px] shadow-2xl overflow-visible border border-gray-700/50 backdrop-blur-md">
<div className="h-10 bg-[#1a1d24] border-b border-gray-800 flex items-center px-4 justify-between rounded-t-[30px]">
<div className="flex gap-2">
<div className="h-3 w-3 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
<div className="h-3 w-3 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]"></div>
<div className="h-3 w-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
</div>
<div className="h-1.5 w-32 bg-gray-800 rounded-full relative overflow-hidden">
  <div className="absolute inset-0 bg-violet-500/20 animate-[moveProgress_3s_linear_infinite]"></div>
</div>
</div>
<div className="p-6 relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-10">
<span className="material-symbols-outlined text-8xl text-violet-500">terminal</span>
</div>
<div className="grid grid-cols-2 gap-4 mb-6 relative">
<div className="bg-gray-800/40 p-4 rounded-xl border border-white/5 relative group/card backdrop-blur-sm overflow-hidden cursor-help">
<div className="absolute inset-0 bg-violet-600/10 backdrop-blur-md opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center z-20">
  <span className="text-[10px] font-bold text-violet-400 mb-1 tracking-widest uppercase">DETAIL_REPORT</span>
  <p className="text-[11px] leading-tight text-white font-medium">{t('hero.card1_desc')}</p>
</div>
<div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-transparent opacity-50"></div>
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{t('hero.card1_eyebrow')}</span>
<span className="material-symbols-outlined text-green-400 text-sm animate-pulse">query_stats</span>
</div>
<div className="text-3xl font-bold text-white mb-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">{t("hero.card1_value")}</div>
<div className="h-1 w-full bg-gray-700/50 rounded-full overflow-hidden">
<div className="h-full bg-green-400 w-[85%] rounded-full shadow-[0_0_10px_#4ade80] animate-grow-x" style={{animationDelay: '0.5s'}}></div>
</div>
<div className="mt-2 text-[10px] text-green-400/80 font-mono flex items-center gap-1">
  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
  {t('hero.card1_label')}
</div>
</div>
<div className="bg-gray-800/40 p-4 rounded-xl border border-white/5 relative group/card backdrop-blur-sm overflow-hidden cursor-help">
<div className="absolute inset-0 bg-red-600/10 backdrop-blur-md opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center z-20">
  <span className="text-[10px] font-bold text-red-500 mb-1 tracking-widest uppercase">TECHNICAL_DEBT_REPORT</span>
  <p className="text-[11px] leading-tight text-white font-medium">{t('hero.card2_desc')}</p>
</div>
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{t('hero.card2_eyebrow')}</span>
<span className="material-symbols-outlined text-red-500 text-sm">layers_clear</span>
</div>
<div className="text-3xl font-bold text-white mb-1 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]">{t("hero.card2_value")}</div>
<div className="h-px w-full bg-gray-700/50 mb-2"></div>
<div className="text-[10px] text-gray-400 font-mono leading-tight italic">
  {t('hero.card2_label')}
</div>
</div>
</div>

<div className="grid grid-cols-2 gap-4 mb-6">
  <div className="flex flex-col gap-1 p-3 rounded-lg bg-violet-500/5 border border-violet-500/10 hover:border-violet-500/30 transition-all group/stat relative overflow-hidden cursor-help">
    <div className="absolute inset-0 bg-violet-600/10 backdrop-blur-md opacity-0 group-hover/stat:opacity-100 transition-all duration-300 flex items-center justify-center p-3 text-center z-20">
      <p className="text-[10px] leading-tight text-white font-medium">{t('hero.card3_desc')}</p>
    </div>
    <span className="text-[9px] text-violet-400 font-mono font-bold tracking-tighter transform group-hover/stat:translate-x-1 transition-transform">SYSTEMS_ACTIVE</span>
    <span className="text-sm font-black text-white tracking-tight italic">5 PRODUCTION SYSTEMS</span>
  </div>
  <div className="flex flex-col gap-1 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 transition-all group/stat relative overflow-hidden cursor-help">
    <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-md opacity-0 group-hover/stat:opacity-100 transition-all duration-300 flex items-center justify-center p-3 text-center z-20">
      <p className="text-[10px] leading-tight text-white font-medium">{t('hero.card4_desc')}</p>
    </div>
    <span className="text-[9px] text-blue-400 font-mono font-bold tracking-tighter transform group-hover/stat:translate-x-1 transition-transform">INTEGRATIONS_CORE</span>
    <span className="text-sm font-black text-white tracking-tight italic">10+ AUTOMATED FLOWS</span>
  </div>
</div>

<div className="bg-gray-800/20 p-1 rounded-xl border border-white/5 mb-2 relative group/chart overflow-hidden cursor-help transition-all duration-300 hover:border-violet-500/40">
<div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/chart:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center z-30">
  <span className="text-[10px] font-bold text-violet-400 mb-2 tracking-[0.3em] uppercase">PROJECTION_MODEL_V2</span>
  <p className="text-xs leading-relaxed text-gray-200 font-medium max-w-[200px]">{t('hero.chart_desc')}</p>
  <div className="mt-4 flex gap-2">
    <div className="w-1 h-1 bg-violet-500 rounded-full animate-ping"></div>
    <span className="text-[8px] text-violet-400 font-mono">CALCULATING_OPTIMIZATION...</span>
  </div>
</div>
<div className="absolute top-3 right-4 z-10 flex gap-2">
<span className="text-[9px] text-violet-300 font-mono bg-violet-900/40 px-2 py-0.5 rounded border border-violet-500/20 backdrop-blur-sm">{t('hero.chart_label1')}</span>
</div>
<div className="absolute top-3 left-4 z-10">
<span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{t('hero.chart_label2')}</span>
</div>
<div className="h-32 w-full relative pt-8 chart-container-anim">
<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
<defs>
<linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)"></stop>
<stop offset="100%" stopColor="rgba(59, 130, 246, 0)"></stop>
</linearGradient>
<linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
<stop offset="0%" stopColor="#8B5CF6"></stop>
<stop offset="100%" stopColor="#3B82F6"></stop>
</linearGradient>
</defs>
<path className="chart-area" d="M0,80 C20,75 30,60 50,40 C70,20 80,25 100,10 L100,100 L0,100 Z" fill="url(#chartGradient)"></path>
<path className="chart-path-anim-loop" d="M0,80 C20,75 30,60 50,40 C70,20 80,25 100,10" fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeWidth="2.5"></path>
</svg>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="absolute bottom-0 w-full flex justify-center pb-8 z-20 pointer-events-none">
<div className="flex flex-col items-center gap-2 animate-bounce-subtle opacity-70">
<div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-violet-500 to-transparent"></div>
<div className="code-particle static animate-none text-violet-400 text-[10px]">{t('hero.scroll_down')}</div>
</div>
</div>
</section>


<section 
  className="py-32 bg-[#050505] relative overflow-hidden noise-texture" 
  id="pain-points"
  ref={diagnosticRef}
>
  {/* Technical Background Elements */}
  <div className="absolute inset-0 bg-technical-grid pointer-events-none"></div>
  <div className="absolute inset-x-0 top-0 h-px bg-white/5"></div>
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>
  
  {/* Scan Line Effect */}
  <div className={`diagnostic-scan-line ${showDiagnostic ? 'animate-scan' : ''}`}></div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className={`text-center mb-24 ${showDiagnostic ? 'reveal-diagnostic' : 'opacity-20 transition-opacity duration-1000'}`}>
      <span className="text-violet-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-6 block">
        {t('pain_points.eyebrow')}
      </span>
      <h2 className="font-display text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-tight max-w-3xl mx-auto">
        {t('pain_points.title_main')} <br /> 
        {t('pain_points.title_accent').split(' ').slice(0, -1).join(' ')} <span className="text-sintomas transition-all duration-1000 delay-200" style={{ textShadow: showDiagnostic ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none' }}>{t('pain_points.title_accent').split(' ').pop()}</span>
      </h2>
      <p className="text-gray-400 text-lg lg:text-xl max-w-[700px] mx-auto leading-relaxed font-medium">
        {t('pain_points.subtitle')}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { 
          icon: 'precision_manufacturing', 
          title1: t('pain_points.card1_title1'), 
          title2: t('pain_points.card1_title2'), 
          desc: t('pain_points.card1_desc'),
          alert: '⚠ NIVEL CRÍTICO DETECTADO'
        },
        { 
          icon: 'lan', 
          title1: t('pain_points.card2_title1'), 
          title2: t('pain_points.card2_title2'), 
          desc: t('pain_points.card2_desc'),
          alert: '⚠ FLUJO FRAGMENTADO'
        },
        { 
          icon: 'pivot_table_chart', 
          title1: t('pain_points.card3_title'), 
          title2: '', 
          desc: t('pain_points.card3_desc'),
          alert: '⚠ INFORMACIÓN DESACTUALIZADA'
        },
        { 
          icon: 'sensors_off', 
          title1: t('pain_points.card4_title1'), 
          title2: t('pain_points.card4_title2'), 
          desc: t('pain_points.card4_desc'),
          alert: '⚠ VISIBILIDAD COMPROMETIDA'
        }
      ].map((card, idx) => (
        <div 
          key={idx}
          className={`card-diagnostic ${idx === 2 ? 'card-static' : ''} p-8 rounded-2xl group relative ${showDiagnostic ? 'revealed' : ''} ${idx === 0 && !revealManual ? 'cursor-pointer select-none' : ''}`}
          style={{ animationDelay: `${0.6 + (idx * 0.15)}s` }}
          onClick={() => idx === 0 && setRevealManual(true)}
          onMouseLeave={() => {
            if (idx === 0) setRevealManual(false);
            if (idx === 3) {
              setResetVisibility(true);
              setTimeout(() => setResetVisibility(false), 100);
            }
          }}
        >
          {idx === 0 && !revealManual && (
            <div className="absolute inset-x-0 bottom-0 top-[140px] z-20 reveal-overlay flex flex-col items-center justify-center rounded-b-2xl px-6 text-center">
              <span className="material-symbols-outlined text-red-500 pulse-red mb-3 scale-125">encrypted</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-500 font-black pulse-red">Desbloquear Diagnóstico</span>
              <div className="mt-4 w-12 h-px bg-red-500/30"></div>
            </div>
          )}

          <div className="diagnostic-icon-container">
            <span className="material-symbols-outlined text-red-500/80 text-2xl font-light">
              {card.icon}
            </span>
          </div>
          
          <div className={`${idx === 0 && !revealManual ? 'blur-md grayscale' : 'blur-0 grayscale-0'} transition-all duration-1000`}>
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
              {card.title1 && <span className="text-red-400/90">{card.title1} </span>}
              {card.title2}
            </h3>
            
            <div className="text-sm text-gray-400 leading-relaxed mb-8 font-medium">
              {idx === 1 ? <DisorderedWords text={card.desc} /> : 
               idx === 2 ? <StaticWords text={card.desc} /> :
               idx === 3 ? <VisibilityWords text={card.desc} resetTrigger={resetVisibility} /> : 
               card.desc}
            </div>

            <div className="pt-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-red-500/60 tracking-wider font-bold">
                {card.alert}
              </span>
            </div>
          </div>

          {/* Hover highlight line */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-500/40 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="py-24 bg-black relative border-y border-white/5 overflow-hidden" id="comparison" ref={comparisonRef}>
<div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>

{/* Evolution Traverse Line */}
{showComparison && <div className="evolution-traverse-line animate-traverse" />}

<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
<div className={`text-center mb-20 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${showComparison ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-5 blur-sm'}`}>
<p className="text-violet-500 font-bold text-xs font-mono uppercase tracking-[0.3em] mb-4">{t('comparison.eyebrow')}</p>
<h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-2 leading-tight">{t('comparison.title_main')}</h2>
<h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-indigo-400 to-blue-400 mb-8 italic">{t('comparison.title_accent')}</h2>
<p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">{t('comparison.subtitle')}</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
{/* Left Side: Obsolete Agency */}
<div className={`comparison-card-obsolete rounded-3xl p-10 flex flex-col transition-all duration-1000 ${showComparison ? 'animate-dim-sync' : 'opacity-0 translate-x-[-15px]'}`}>
<div className="mb-10">
<div className="flex items-center gap-3 mb-3">
<span className="material-symbols-outlined text-gray-600 text-xl">group</span>
<h3 className="text-xl font-bold text-gray-500 uppercase tracking-wider">{t('comparison.agencia')}</h3>
</div>
<p className="text-gray-400 text-sm font-medium italic">{t('comparison.agencia_subtitle')}</p>
</div>
<div className="h-px w-full bg-white/5 mb-10"></div>
<ul className="space-y-8 grow">
{[1, 2, 3, 4].map((num, i) => (
<li key={num} 
    className={`flex gap-5 transition-all duration-700`}
    style={{ transitionDelay: `${0.1 + i * 0.1}s`, opacity: showComparison ? 1 : 0, transform: showComparison ? 'translateX(0)' : 'translateX(-15px)' }}>
<div className="bg-red-500/10 text-red-500 w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 border border-red-500/20">
<span className="material-symbols-outlined text-[14px] font-bold">close</span>
</div>
<div>
<strong className="text-gray-300 block mb-1 text-base font-semibold">{t(`comparison.agencia_item${num}_title`)}</strong>
<span className="text-xs text-gray-500 leading-relaxed font-light">{t(`comparison.agencia_item${num}_desc`)}</span>
</div>
</li>
))}
</ul>
</div>

{/* Right Side: Vanta Evolution */}
<div className={`comparison-card-evolution rounded-3xl p-10 flex flex-col shadow-2xl transition-all duration-1000 delay-300 ${showComparison ? 'scale-100 animate-bright-sync' : 'opacity-0 scale-[0.97] translateY-[25px]'}`}>
<div className="mb-10 flex justify-between items-center">
<div>
<div className="flex items-center gap-4 mb-3">
<VantaLogo className="w-10 h-10" />
<h3 className="text-3xl font-bold text-white tracking-tight">{t('comparison.vanta')}</h3>
</div>
<p className="text-violet-300/60 text-sm font-medium">{t('comparison.vanta_subtitle')}</p>
</div>
<div className="badge-premium-recommended">
{t('comparison.vanta_badge')}
</div>
</div>

<ul className="space-y-5 grow">
{[
{ id: 1, icon: 'all_inclusive' },
{ id: 2, icon: 'architecture' },
{ id: 3, icon: 'developer_board' },
{ id: 4, icon: 'query_stats' }
].map((item, i) => (
<li key={item.id} 
    className="vanta-comparison-item group/item"
    style={{ 
        animationName: showComparison ? 'premium-reveal-right' : 'none',
        animationDuration: '0.8s',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'forwards',
        animationDelay: `${0.5 + i * 0.15}s`,
        opacity: 0 
    }}>
<div className="active-micro-indicator"></div>
<div className="flex gap-6">
<div className="bg-violet-500/10 text-violet-400 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-violet-500/20 transition-colors border border-violet-500/10">
<span className="material-symbols-outlined text-xl">{item.icon}</span>
</div>
<div>
<strong className="text-white block mb-1.5 text-base tracking-tight">{t(`comparison.vanta_item${item.id}_title`)}</strong>
<p className="text-sm text-gray-400 leading-relaxed font-light">{t(`comparison.vanta_item${item.id}_desc`)}</p>
</div>
</div>
</li>
))}
</ul>
</div>
</div>
</div>
</section>


<section className="relative py-20 lg:py-28 bg-[#050112]" id="process" ref={processRef}>
<div className="absolute inset-0 z-0 pointer-events-none">
<div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"></div>
<div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
</div>
<div className="relative z-10 w-full">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 lg:mb-16">
        <h2 className="font-display text-5xl lg:text-7xl font-bold text-white mb-4">El <span className="gradient-heading">{t('process.title_accent')}</span></h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('process.subtitle')}</p>
      </div>

      <div className="hidden md:flex items-center justify-center gap-4 mb-12">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="flex items-center">
            <button 
              onClick={() => goToCard(idx)}
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-display text-sm transition-all duration-500 ${activeCard === idx ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-110' : 'border-white/5 text-gray-500 hover:border-white/20'}`}
            >
              0{idx + 1}
            </button>
            {idx < 3 && (
              <div className="w-12 lg:w-20 h-[2px] bg-white/5 mx-2 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-linear-to-r from-violet-500 to-indigo-500"
                  initial={{ x: '-100%' }}
                  animate={{ x: activeCard > idx ? '0%' : '-100%' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
<div className="relative w-full overflow-hidden">
<div
  className="protocol-scroll-container flex flex-nowrap gap-8 pb-2 px-4 sm:px-6 lg:px-8"
  ref={protocolScrollRef}
  onTouchStart={onTouchStart}
  onTouchEnd={onTouchEnd}
>
<div className="flip-card snap-center h-[420px] lg:h-[500px]">
<div className="flip-card-inner h-full">
<div className="flip-card-front bg-[#0a0514]/80 backdrop-blur-xl border border-violet-500/30 p-6 md:p-8 lg:p-10 flex flex-col shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] relative">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
<div className="flex justify-between items-start mb-8">
<span className="font-display font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-30">01</span>
<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600/20 to-purple-900/20 border border-violet-500/20 flex items-center justify-center">
<span className="material-symbols-outlined text-violet-400 text-3xl">search_check</span>
</div>
</div>
<h3 className="text-3xl font-display font-bold text-white mb-4">{t('process.step1_title')}</h3>
<p className="text-gray-400 text-base leading-relaxed mb-8 grow">
                    {t('process.step1_desc')}
                </p>
<div className="mt-auto pt-6 border-t border-white/5">
<p className="text-xs text-violet-400 font-mono uppercase tracking-widest mb-3">{t('process.step1_deliv_lbl')}</p>
<div className="flex flex-wrap gap-2">
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step1_deliv1')}</span>
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step1_deliv2')}</span>
</div>
</div>
</div>
<div className="flip-card-back bg-black/90 backdrop-blur-xl border border-violet-500/50 p-6 md:p-8 lg:p-10 flex flex-col shadow-[inset_0_0_30px_rgba(139,92,246,0.1)] code-bg-pattern neon-border-pulse">
<div className="flex items-center justify-between mb-6 border-b border-violet-500/30 pb-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
<span className="font-mono text-xs text-violet-300 uppercase tracking-widest">System_Status: ACTIVE</span>
</div>
<span className="font-mono text-xs text-gray-500">ID: #DSC-01</span>
</div>
<div className="space-y-6 font-mono text-sm">
<div>
<h4 className="text-violet-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-violet-500 pl-2">Tecnologías de Análisis</h4>
<div className="grid grid-cols-2 gap-2 text-gray-300">
<span className="bg-violet-900/20 px-2 py-1 rounded border border-violet-500/20">Datadog</span>
<span className="bg-violet-900/20 px-2 py-1 rounded border border-violet-500/20">SonarQube</span>
<span className="bg-violet-900/20 px-2 py-1 rounded border border-violet-500/20">Figma Dev</span>
<span className="bg-violet-900/20 px-2 py-1 rounded border border-violet-500/20">Jira</span>
</div>
</div>
<div>
<h4 className="text-violet-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-violet-500 pl-2">Est. Timeline</h4>
<div className="flex items-center gap-2 text-white">
<span className="material-symbols-outlined text-sm">timer</span>
<span>2 - 3 Semanas</span>
</div>
</div>
<div>
<h4 className="text-green-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-green-500 pl-2">Criterios de Éxito</h4>
<ul className="space-y-2 text-gray-400 text-xs">
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Mapeo completo de deuda técnica
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Definición de KPIs base
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Aprobación de alcance técnico
                            </li>
</ul>
</div>
</div>
<div className="mt-auto pt-4 border-t border-violet-500/30 flex justify-between items-center">
<span className="text-[10px] text-gray-500">Vanta Protocol v2.4</span>
<span className="material-symbols-outlined text-violet-500 animate-pulse">terminal</span>
</div>
</div>
</div>
</div>
<div className="flip-card snap-center h-[420px] lg:h-[500px]">
<div className="flip-card-inner h-full">
<div className="flip-card-front bg-[#0a0514]/80 backdrop-blur-xl border border-blue-500/30 p-6 md:p-8 lg:p-10 flex flex-col shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] relative">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
<div className="flex justify-between items-start mb-8">
<span className="font-display font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-30">02</span>
<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600/20 to-cyan-900/20 border border-blue-500/20 flex items-center justify-center">
<span className="material-symbols-outlined text-blue-400 text-3xl">architecture</span>
</div>
</div>
<h3 className="text-3xl font-display font-bold text-white mb-4">{t('process.step2_title')}</h3>
<p className="text-gray-400 text-base leading-relaxed mb-8 grow">
                    {t('process.step2_desc')}
                </p>
<div className="mt-auto pt-6 border-t border-white/5">
<p className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-3">{t('process.step1_deliv_lbl')}</p>
<div className="flex flex-wrap gap-2">
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step2_deliv1')}</span>
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step2_deliv2')}</span>
</div>
</div>
</div>
<div className="flip-card-back bg-black/90 backdrop-blur-xl border border-blue-500/50 p-6 md:p-8 lg:p-10 flex flex-col shadow-[inset_0_0_30px_rgba(59,130,246,0.1)] code-bg-pattern neon-border-pulse" style={{animationDelay: '0.5s'}}>
<div className="flex items-center justify-between mb-6 border-b border-blue-500/30 pb-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
<span className="font-mono text-xs text-blue-300 uppercase tracking-widest">Blueprint_Mode</span>
</div>
<span className="font-mono text-xs text-gray-500">ID: #ARC-02</span>
</div>
<div className="space-y-6 font-mono text-sm">
<div>
<h4 className="text-blue-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-blue-500 pl-2">Core Stack Design</h4>
<div className="grid grid-cols-2 gap-2 text-gray-300">
<span className="bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">AWS Lambda</span>
<span className="bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">PostgreSQL</span>
<span className="bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">Redis</span>
<span className="bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">Docker</span>
</div>
</div>
<div>
<h4 className="text-blue-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-blue-500 pl-2">Est. Timeline</h4>
<div className="flex items-center gap-2 text-white">
<span className="material-symbols-outlined text-sm">timer</span>
<span>3 - 4 Semanas</span>
</div>
</div>
<div>
<h4 className="text-green-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-green-500 pl-2">Criterios de Éxito</h4>
<ul className="space-y-2 text-gray-400 text-xs">
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Diagrama ER aprobado
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Estrategia de Microservicios
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Protocolos de Seguridad definidos
                            </li>
</ul>
</div>
</div>
<div className="mt-auto pt-4 border-t border-blue-500/30 flex justify-between items-center">
<span className="text-[10px] text-gray-500">Vanta Protocol v2.4</span>
<span className="material-symbols-outlined text-blue-500 animate-spin-slow">settings_suggest</span>
</div>
</div>
</div>
</div>
<div className="flip-card snap-center h-[420px] lg:h-[500px]">
<div className="flip-card-inner h-full">
<div className="flip-card-front bg-[#0a0514]/80 backdrop-blur-xl border border-indigo-500/30 p-6 md:p-8 lg:p-10 flex flex-col shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)] relative">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
<div className="flex justify-between items-start mb-8">
<span className="font-display font-bold text-6xl text-transparent bg-clip-text bg-linear-to-b from-white to-white/10 opacity-30">03</span>
<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-600/20 to-violet-900/20 border border-indigo-500/20 flex items-center justify-center">
<span className="material-symbols-outlined text-indigo-400 text-3xl">terminal</span>
</div>
</div>
<h3 className="text-3xl font-display font-bold text-white mb-4">{t('process.step3_title')}</h3>
<p className="text-gray-400 text-base leading-relaxed mb-8 grow">
                    Escuadrones de ingeniería ejecutando código limpio y modular. {t('process.step3_title')} iterativo centrado en la lógica de negocio crítica.
                </p>
<div className="mt-auto pt-6 border-t border-white/5">
<p className="text-xs text-indigo-400 font-mono uppercase tracking-widest mb-3">{t('process.step1_deliv_lbl')}</p>
<div className="flex flex-wrap gap-2">
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step3_deliv1')}</span>
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step3_deliv2')}</span>
</div>
</div>
</div>
<div className="flip-card-back bg-black/90 backdrop-blur-xl border border-indigo-500/50 p-6 md:p-8 lg:p-10 flex flex-col shadow-[inset_0_0_30px_rgba(99,102,241,0.1)] code-bg-pattern neon-border-pulse" style={{animationDelay: '1s'}}>
<div className="flex items-center justify-between mb-6 border-b border-indigo-500/30 pb-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
<span className="font-mono text-xs text-indigo-300 uppercase tracking-widest">Build_Sequence</span>
</div>
<span className="font-mono text-xs text-gray-500">ID: #DEV-03</span>
</div>
<div className="space-y-6 font-mono text-sm">
<div>
<h4 className="text-indigo-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-indigo-500 pl-2">Languages &amp; Frameworks</h4>
<div className="grid grid-cols-2 gap-2 text-gray-300">
<span className="bg-indigo-900/20 px-2 py-1 rounded border border-indigo-500/20">Rust / Go</span>
<span className="bg-indigo-900/20 px-2 py-1 rounded border border-indigo-500/20">React / Next</span>
<span className="bg-indigo-900/20 px-2 py-1 rounded border border-indigo-500/20">GraphQL</span>
<span className="bg-indigo-900/20 px-2 py-1 rounded border border-indigo-500/20">Tailwind</span>
</div>
</div>
<div>
<h4 className="text-indigo-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-indigo-500 pl-2">Est. Timeline</h4>
<div className="flex items-center gap-2 text-white">
<span className="material-symbols-outlined text-sm">timer</span>
<span>6 - 12 Semanas</span>
</div>
</div>
<div>
<h4 className="text-green-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-green-500 pl-2">Criterios de Éxito</h4>
<ul className="space-y-2 text-gray-400 text-xs">
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Test Coverage &gt; 85%
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Performance &lt; 100ms
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> CI/CD Pipelines Activos
                            </li>
</ul>
</div>
</div>
<div className="mt-auto pt-4 border-t border-indigo-500/30 flex justify-between items-center">
<span className="text-[10px] text-gray-500">Vanta Protocol v2.4</span>
<span className="material-symbols-outlined text-indigo-500">developer_board</span>
</div>
</div>
</div>
</div>
<div className="flip-card snap-center h-[500px]">
<div className="flip-card-inner h-full">
<div className="flip-card-front bg-[#0a0514]/80 backdrop-blur-xl border border-cyan-500/30 p-8 md:p-10 flex flex-col shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] relative">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
<div className="flex justify-between items-start mb-8">
<span className="font-display font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-30">04</span>
<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-600/20 to-blue-900/20 border border-cyan-500/20 flex items-center justify-center">
<span className="material-symbols-outlined text-cyan-400 text-3xl">rocket_launch</span>
</div>
</div>
<h3 className="text-3xl font-display font-bold text-white mb-4">{t('process.step4_title')}</h3>
<p className="text-gray-400 text-base leading-relaxed mb-8 grow">
                    {t('process.step4_desc')}
                </p>
<div className="mt-auto pt-6 border-t border-white/5">
<p className="text-xs text-cyan-400 font-mono uppercase tracking-widest mb-3">{t('process.step1_deliv_lbl')}</p>
<div className="flex flex-wrap gap-2">
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step4_deliv1')}</span>
<span className="text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{t('process.step4_deliv2')}</span>
</div>
</div>
</div>
<div className="flip-card-back bg-black/90 backdrop-blur-xl border border-cyan-500/50 p-8 md:p-10 flex flex-col shadow-[inset_0_0_30px_rgba(6,182,212,0.1)] code-bg-pattern neon-border-pulse" style={{animationDelay: '1.5s'}}>
<div className="flex items-center justify-between mb-6 border-b border-cyan-500/30 pb-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
<span className="font-mono text-xs text-cyan-300 uppercase tracking-widest">Launch_Control</span>
</div>
<span className="font-mono text-xs text-gray-500">ID: #DPLY-04</span>
</div>
<div className="space-y-6 font-mono text-sm">
<div>
<h4 className="text-cyan-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-cyan-500 pl-2">Infraestructura</h4>
<div className="grid grid-cols-2 gap-2 text-gray-300">
<span className="bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">Kubernetes</span>
<span className="bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">Terraform</span>
<span className="bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">CloudWatch</span>
<span className="bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">ELB</span>
</div>
</div>
<div>
<h4 className="text-cyan-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-cyan-500 pl-2">Est. Timeline</h4>
<div className="flex items-center gap-2 text-white">
<span className="material-symbols-outlined text-sm">timer</span>
<span>1 - 2 Semanas</span>
</div>
</div>
<div>
<h4 className="text-green-400 mb-2 uppercase text-xs tracking-wider border-l-2 border-green-500 pl-2">Criterios de Éxito</h4>
<ul className="space-y-2 text-gray-400 text-xs">
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Zero-downtime deployment
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Load Testing Superado
                            </li>
<li className="flex items-start gap-2">
<span className="text-green-500 mt-0.5">✓</span> Handover a Ops Team
                            </li>
</ul>
</div>
</div>
<div className="mt-auto pt-4 border-t border-cyan-500/30 flex justify-between items-center">
<span className="text-[10px] text-gray-500">Vanta Protocol v2.4</span>
<span className="material-symbols-outlined text-cyan-500 animate-bounce">rocket_launch</span>
</div>
</div>
</div>
</div>
</div>

{/* ─── PREV / NEXT navigation ─────────────────────────────────── */}
<div className="mt-10 flex items-center justify-center gap-0 select-none">
  <button
    onClick={() => goToCard(activeCard - 1)}
    disabled={activeCard === 0}
    className="text-sm font-mono tracking-widest uppercase text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200 px-6 py-2"
  >
    ← PREV
  </button>
  <div className="w-px h-5 bg-white/20" />
  <button
    onClick={() => goToCard(activeCard + 1)}
    disabled={activeCard === TOTAL_PROTOCOL_CARDS - 1}
    className="text-sm font-mono tracking-widest uppercase text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200 px-6 py-2"
  >
    NEXT →
  </button>
</div>

</div>
</div>
</section>

<section className="py-32 relative overflow-hidden bg-black/60 backdrop-blur-3xl border-y border-white/5" id="stack">
<div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
<div className="absolute inset-0 bg-linear-to-br from-indigo-900/10 via-transparent to-purple-900/10 z-0"></div>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
<div className="text-center mb-24 relative">
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-[100px] pointer-events-none"></div>
<span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4 tracking-wider">{t('stack.eyebrow1')}</span>
<p className="text-violet-400 text-sm font-medium font-mono uppercase tracking-widest mb-4">{t('stack.eyebrow2')}</p>
<h2 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">{t('stack.title_main')} <span className="gradient-heading">{t('stack.title_accent')}</span></h2>
<p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                {t('stack.subtitle')}
            </p>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-blue-400 tech-icon-glow">data_object</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-blue-300 transition-colors">React.js</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Frontend Core</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-yellow-500 tech-icon-glow">terminal</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-yellow-300 transition-colors">Python</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Data Science</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-orange-400 tech-icon-glow">cloud</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-orange-300 transition-colors">AWS</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Cloud Infra</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-blue-500 tech-icon-glow">grid_view</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">Kubernetes</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Orchestration</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-cyan-400 tech-icon-glow">database</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-cyan-300 transition-colors">PostgreSQL</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Relational DB</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-red-400 tech-icon-glow">memory</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-red-300 transition-colors">Rust</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Systems</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-400/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-blue-300 tech-icon-glow">deployed_code</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-blue-200 transition-colors">Docker</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Containerization</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-500/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-pink-400 tech-icon-glow">hub</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-pink-300 transition-colors">GraphQL</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">API Query</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-orange-500 tech-icon-glow">smart_toy</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-orange-400 transition-colors">TensorFlow</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Machine Learning</p>
</div>
</div>
<div className="tech-card p-6 rounded-2xl flex flex-col items-center justify-center gap-5 group cursor-default">
<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gray-100/10 transition-colors duration-500">
<span className="material-symbols-outlined text-4xl text-gray-200 tech-icon-glow">layers</span>
</div>
<div className="text-center">
<h3 className="text-white font-medium mb-1 group-hover:text-white transition-colors">Next.js</h3>
<p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">React Framework</p>
</div>
</div>
</div>
<div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
<div className="h-px w-24 bg-linear-to-r from-transparent to-white/20"></div>
<p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                {t('stack.footer')}
            </p>
<div className="h-px w-24 bg-linear-to-l from-transparent to-white/20"></div>
</div>
</div>
</section>
<section id="command" className="py-32 relative overflow-hidden bg-[#0a0514]">
<div className="absolute inset-0 z-0">
<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-background-deep to-background-deep opacity-50"></div>
<div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
</div>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
<div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
<div className="lg:max-w-xl">
<span className="text-blue-500 font-mono text-xs tracking-widest uppercase mb-2 block">{t('catalog.eyebrow')}</span>
<h2 className="font-display text-5xl lg:text-6xl font-bold text-white mb-4">{t('catalog.title_main')} <span className="gradient-heading">{t('catalog.title_accent')}</span></h2>
<p className="text-gray-400 text-lg">{t('catalog.subtitle')}</p>
</div>
<div className="flex items-center gap-2">
<span className="flex h-3 w-3 relative">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
</span>
<span className="text-xs font-mono text-green-400 tracking-wider">{t('catalog.online')}</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-violet-500/10 transition-colors">
<span className="material-symbols-outlined text-violet-400 text-2xl group-hover:scale-110 transition-transform duration-300">conveyor_belt</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{t('catalog.pos_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-violet-500/20 pl-3 group-hover:border-violet-500 transition-colors">
                    {t('catalog.pos_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded">React</span>
<span className="module-tech-tag px-2 py-1 rounded">Node.js</span>
<span className="module-tech-tag px-2 py-1 rounded">Redis</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] border-blue-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
<span className="material-symbols-outlined text-blue-400 text-2xl group-hover:scale-110 transition-transform duration-300">lan</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{t('catalog.erp_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-blue-500/20 pl-3 group-hover:border-blue-500 transition-colors">
                    {t('catalog.erp_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-blue-500/30 text-blue-300 bg-blue-500/10">Python</span>
<span className="module-tech-tag px-2 py-1 rounded border-blue-500/30 text-blue-300 bg-blue-500/10">PostgreSQL</span>
<span className="module-tech-tag px-2 py-1 rounded border-blue-500/30 text-blue-300 bg-blue-500/10">Docker</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] border-pink-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-pink-500/10 transition-colors">
<span className="material-symbols-outlined text-pink-400 text-2xl group-hover:scale-110 transition-transform duration-300">account_tree</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">{t('catalog.crm_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-pink-500/20 pl-3 group-hover:border-pink-500 transition-colors">
                    {t('catalog.crm_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-pink-500/30 text-pink-300 bg-pink-500/10">Next.js</span>
<span className="module-tech-tag px-2 py-1 rounded border-pink-500/30 text-pink-300 bg-pink-500/10">GraphQL</span>
<span className="module-tech-tag px-2 py-1 rounded border-pink-500/30 text-pink-300 bg-pink-500/10">AWS</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] border-orange-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
<span className="material-symbols-outlined text-orange-400 text-2xl group-hover:scale-110 transition-transform duration-300">inventory</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">{t('catalog.stock_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-orange-500/20 pl-3 group-hover:border-orange-500 transition-colors">
                    {t('catalog.stock_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-orange-500/30 text-orange-300 bg-orange-500/10">Go</span>
<span className="module-tech-tag px-2 py-1 rounded border-orange-500/30 text-orange-300 bg-orange-500/10">gRPC</span>
<span className="module-tech-tag px-2 py-1 rounded border-orange-500/30 text-orange-300 bg-orange-500/10">Kafka</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
<span className="material-symbols-outlined text-cyan-400 text-2xl group-hover:scale-110 transition-transform duration-300">event_repeat</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{t('catalog.agenda_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-cyan-500/20 pl-3 group-hover:border-cyan-500 transition-colors">
                    {t('catalog.agenda_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-cyan-500/30 text-cyan-300 bg-cyan-500/10">React Native</span>
<span className="module-tech-tag px-2 py-1 rounded border-cyan-500/30 text-cyan-300 bg-cyan-500/10">Firebase</span>
<span className="module-tech-tag px-2 py-1 rounded border-cyan-500/30 text-cyan-300 bg-cyan-500/10">Node.js</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] border-green-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
<span className="material-symbols-outlined text-green-400 text-2xl group-hover:scale-110 transition-transform duration-300">support_agent</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">{t('catalog.bot_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-green-500/20 pl-3 group-hover:border-green-500 transition-colors">
                    {t('catalog.bot_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-green-500/30 text-green-300 bg-green-500/10">Python</span>
<span className="module-tech-tag px-2 py-1 rounded border-green-500/30 text-green-300 bg-green-500/10">OpenAI API</span>
<span className="module-tech-tag px-2 py-1 rounded border-green-500/30 text-green-300 bg-green-500/10">Twilio</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] border-purple-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
<span className="material-symbols-outlined text-purple-400 text-2xl group-hover:scale-110 transition-transform duration-300">badge</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{t('catalog.faceid_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-purple-500/20 pl-3 group-hover:border-purple-500 transition-colors">
                    {t('catalog.faceid_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-purple-500/30 text-purple-300 bg-purple-500/10">TensorFlow</span>
<span className="module-tech-tag px-2 py-1 rounded border-purple-500/30 text-purple-300 bg-purple-500/10">OpenCV</span>
<span className="module-tech-tag px-2 py-1 rounded border-purple-500/30 text-purple-300 bg-purple-500/10">C++</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] border-indigo-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
<span className="material-symbols-outlined text-indigo-400 text-2xl group-hover:scale-110 transition-transform duration-300">file_present</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{t('catalog.billing_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-indigo-500/20 pl-3 group-hover:border-indigo-500 transition-colors">
                    {t('catalog.billing_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-indigo-500/30 text-indigo-300 bg-indigo-500/10">Java</span>
<span className="module-tech-tag px-2 py-1 rounded border-indigo-500/30 text-indigo-300 bg-indigo-500/10">SOAP/REST</span>
<span className="module-tech-tag px-2 py-1 rounded border-indigo-500/30 text-indigo-300 bg-indigo-500/10">XML</span>
</div>
</div>
<div className="module-card rounded-xl p-6 group cursor-pointer hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] border-red-500/20">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 rounded-lg module-icon-container flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
<span className="material-symbols-outlined text-red-400 text-2xl group-hover:scale-110 transition-transform duration-300">analytics</span>
</div>
<div className="flex items-center gap-2">
<div className="h-1.5 w-1.5 rounded-full bg-green-500 status-indicator"></div>
<span className="text-[10px] font-mono text-gray-500 uppercase">{t('catalog.status')}</span>
</div>
</div>
<h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">{t('catalog.analytics_title')}</h3>
<p className="text-sm text-gray-400 leading-relaxed mb-4 border-l-2 border-red-500/20 pl-3 group-hover:border-red-500 transition-colors">
                    {t('catalog.analytics_desc')}
                </p>
<div className="flex flex-wrap gap-2 mt-auto">
<span className="module-tech-tag px-2 py-1 rounded border-red-500/30 text-red-300 bg-red-500/10">PowerBI</span>
<span className="module-tech-tag px-2 py-1 rounded border-red-500/30 text-red-300 bg-red-500/10">SQL</span>
<span className="module-tech-tag px-2 py-1 rounded border-red-500/30 text-red-300 bg-red-500/10">ETL</span>
</div>
</div>
</div>
</div>
</section>

{/* Specialized Projects Section */}
<section className="py-24 relative overflow-hidden bg-[#050508]" id="projects" ref={projectsRef}>
  {/* Technical Background Grid */}
  <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
     <svg width="100%" height="100%">
        <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
           <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#tech-grid)" />
     </svg>
  </div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className={`text-center mb-24 transition-all duration-1000 ease-out transform
      ${showProjects ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-[40px] blur-md'}`}>
      <h2 className="font-display font-medium text-white mb-6 flex flex-col items-center">
        <span className="text-4xl lg:text-5xl opacity-40 tracking-widest uppercase mb-4 font-light">{t('specialized_projects.title_main')}</span>
        <span className="text-6xl lg:text-8xl font-black gradient-heading tracking-tighter leading-none italic uppercase text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
           {t('specialized_projects.title_accent')}
        </span>
      </h2>
      <div className="w-32 h-1 bg-linear-to-r from-transparent via-blue-500/50 to-transparent mx-auto mt-10 mb-10 opacity-30"></div>
      <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed tracking-wide italic">
        {t('specialized_projects.subtitle')}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[1, 2, 3].map((num, idx) => {
        const isCentral = num === 2;
        const colorHex = num === 1 ? 'rgba(245,158,11,0.5)' : num === 2 ? 'rgba(59,130,246,0.5)' : 'rgba(16,185,129,0.5)';
        
        return (
          <div 
            key={num} 
            className={`group relative transition-all duration-1000 ease-out transform
              ${showProjects ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-[50px] scale-[0.95]'}
              ${isCentral ? 'z-10' : 'z-0'}`}
            style={{ transitionDelay: `${0.2 + idx * 0.15}s` }}
          >
            {/* Sectorial Glow Backdrop */}
            <div className={`absolute -inset-10 blur-[120px] opacity-10 group-hover:opacity-30 transition-all duration-1000
              ${num === 1 ? 'bg-amber-600/40' : num === 2 ? 'bg-blue-600/40' : 'bg-emerald-600/40'}`}></div>
            
            <div className={`h-full glass-panel rounded-4xl overflow-hidden border transition-all duration-700 flex flex-col 
              ${isCentral ? 'border-white/20 bg-black/70 shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-black/50'}
              hover:shadow-[0_0_80px_-15px_${colorHex}] hover:-translate-y-3`}>
              
              <div className="p-10 pb-0">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                     <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)] ${num === 1 ? 'bg-amber-500' : num === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                     <span className={`text-[10px] font-mono font-bold tracking-[0.3em] uppercase ${num === 1 ? 'text-amber-400' : num === 2 ? 'text-blue-400' : 'text-emerald-400'}`}>
                       {t(`specialized_projects.project${num}_tag`)}
                     </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/30 font-bold uppercase tracking-widest px-3 py-1.5 border border-white/5 bg-white/5 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[12px] animate-spin-slow">engineering</span>
                    SISTEMA ACTIVO
                  </div>
                </div>
                
                {/* Project Visual Mockup / Dashboard */}
                <div className="aspect-video w-full rounded-2xl bg-[#000003] border border-white/10 mb-10 relative overflow-hidden p-6 group-hover:border-white/30 transition-all duration-500 shadow-inner group/dashboard">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                  <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-white/5 to-transparent h-[200%] animate-[scan_4s_linear_infinite]"></div>
                  
                  {/* Industry Specific Dashboard Content */}
                  {num === 1 && (
                    <div className="h-full flex flex-col relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">KDS_HIDROCÁLIDA</span>
                          <span className="text-[7px] text-white/40 font-mono">LIVE_OPERATIONS_FEED</span>
                        </div>
                        <div className="h-1.5 w-12 bg-amber-500/20 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 animate-[progress_5s_infinite]"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 grow">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`p-2.5 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-2 transform transition-all duration-700 ${showProjects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${0.8 + i * 0.15}s` }}>
                            <div className="flex justify-between items-center">
                              <div className="h-1.5 w-8 bg-white/20 rounded"></div>
                              <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-1 w-full bg-white/10 rounded"></div>
                              <div className="h-1 w-2/3 bg-white/5 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[8px] font-mono text-white/40">AVG_PREP_TIME: 8:42</span>
                        <span className="text-[8px] font-mono text-green-400">SYNC_OK</span>
                      </div>
                    </div>
                  )}

                  {num === 2 && (
                    <div className="h-full flex flex-col relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">SISTEMA_DENTAL</span>
                        <div className="flex gap-2">
                          <div className="w-4 h-1.5 bg-blue-500/30 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 grow">
                        <div className="flex-1 rounded-xl bg-blue-500/5 border border-blue-500/20 p-2.5 flex flex-col justify-between">
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({length: 15}).map((_, i) => (
                              <div key={i} className={`h-1.5 rounded-sm bg-white/5 ${[2, 5, 8, 12].includes(i) ? 'bg-blue-400/40' : ''}`}></div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <div className="h-1 w-full bg-blue-500/20 rounded"></div>
                            <div className="h-1 w-4/5 bg-blue-500/10 rounded"></div>
                          </div>
                        </div>
                        <div className="w-20 rounded-xl bg-white/5 border border-white/10 p-2 flex flex-col gap-2 shrink-0">
                          <div className="h-2 w-full bg-white/20 rounded-sm"></div>
                          <div className="h-1.5 w-full bg-white/10 rounded-sm"></div>
                          <div className="h-1.5 w-1/2 bg-white/10 rounded-sm"></div>
                          <div className="mt-auto h-4 w-full rounded bg-blue-500/30 border border-blue-500/30"></div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[8px] font-mono">
                         <span className="text-white/40 uppercase tracking-wider">Historial Clínico Digit.</span>
                         <span className="text-blue-400 animate-pulse font-bold">LIVE_SAVE</span>
                      </div>
                    </div>
                  )}

                  {num === 3 && (
                    <div className="h-full flex flex-col relative z-10">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">GYM_JAZAR_PRO</span>
                          <span className="text-[7px] text-white/40 font-mono tracking-widest">REALTIME_BOOKING_SYSTEM</span>
                        </div>
                        <span className="material-symbols-outlined text-emerald-500 text-sm animate-bounce-subtle">chat_bubble</span>
                      </div>
                      <div className="space-y-4 grow">
                        {[1, 2].map(i => (
                          <div key={i} className="space-y-2 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-colors duration-500 cursor-default group/item">
                            <div className="flex justify-between items-center px-1">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-emerald-500/20 flex items-center justify-center">
                                  <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="h-1.5 w-16 bg-white/20 rounded-full group-hover/item:bg-emerald-400/40 transition-colors"></div>
                              </div>
                              <span className="text-[9px] font-mono text-emerald-400 font-bold">{i === 1 ? '98%' : '82%'}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                              <div className={`h-full bg-linear-to-r from-emerald-600 to-emerald-400 transition-all duration-1500 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)] ${showProjects ? (i === 1 ? 'w-[98%]' : 'w-[82%]') : 'w-0'}`} style={{ transitionDelay: `${0.8 + i * 0.3}s` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                         <div className="flex -space-x-1.5">
                            {[1, 2, 3].map(j => (
                               <div key={j} className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                               </div>
                            ))}
                         </div>
                         <span className="text-[7px] text-white/30 font-mono uppercase tracking-widest">+12 reservas hoy</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group-hover:px-2 transition-all duration-500">
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tight leading-none group-hover:translate-x-1 transition-all">{t(`specialized_projects.project${num}_title`)}</h3>
                  <p className={`text-[11px] font-mono font-bold mb-8 uppercase tracking-[0.25em] transition-colors duration-500 ${num === 1 ? 'text-amber-500/60' : num === 2 ? 'text-blue-500/60' : 'text-emerald-500/60'}`}>{t(`specialized_projects.project${num}_stack`)}</p>
                  
                  <div className="relative mb-12">
                    <div className={`absolute -left-5 top-0 w-1 h-full rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ${num === 1 ? 'bg-amber-500' : num === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                    <blockquote className="text-[15px] text-gray-400 font-light leading-relaxed group-hover:text-gray-200 transition-colors">
                      {t(`specialized_projects.project${num}_quote`)}
                    </blockquote>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-10 pt-0">
                <div className="grid grid-cols-2 gap-5 mb-12">
                  <div className="p-6 rounded-3xl bg-white/3 border border-white/5 group-hover:bg-white/[0.07] group-hover:scale-[1.05] group-hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 relative overflow-hidden">
                    <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 delay-300 ${num === 1 ? 'bg-amber-500/30' : num === 2 ? 'bg-blue-500/30' : 'bg-emerald-500/30'}`}></div>
                    <p className={`text-2xl font-black tracking-tighter mb-1 font-display transition-transform duration-500 group-hover:scale-110 origin-left ${num === 1 ? 'text-amber-400' : num === 2 ? 'text-blue-400' : 'text-emerald-400'}`}>
                       <Counter value={t(`specialized_projects.project${num}_stat1_value`)} isVisible={showProjects} duration={2500} />
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-[0.2em]">{t(`specialized_projects.project${num}_stat1_label`)}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/3 border border-white/5 group-hover:bg-white/[0.07] group-hover:scale-[1.05] group-hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 relative overflow-hidden">
                    <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 delay-300 ${num === 1 ? 'bg-amber-500/30' : num === 2 ? 'bg-blue-500/30' : 'bg-emerald-500/30'}`}></div>
                    <p className={`text-2xl font-black tracking-tighter mb-1 font-display transition-transform duration-500 group-hover:scale-110 origin-left ${num === 1 ? 'text-amber-400' : num === 2 ? 'text-blue-400' : 'text-emerald-400'}`}>
                      <Counter value={t(`specialized_projects.project${num}_stat2_value`)} isVisible={showProjects} duration={2500} />
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-[0.2em]">{t(`specialized_projects.project${num}_stat2_label`)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-10">
                  <div className="flex items-center gap-5">
                    <div className="relative group/avatar">
                      <div className={`absolute -inset-1 blur-md opacity-20 group-hover/avatar:opacity-50 transition-all duration-500 rounded-full ${num === 1 ? 'bg-amber-500' : num === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                      <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-sm font-black text-white shadow-xl uppercase group-hover:scale-110 transition-transform">
                        {t(`specialized_projects.project${num}_author`).split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-white leading-none mb-2 font-display">{t(`specialized_projects.project${num}_author`)}</p>
                      <p className={`text-[9px] font-mono uppercase tracking-widest font-black opacity-40 group-hover:opacity-100 transition-opacity ${num === 1 ? 'text-amber-400' : num === 2 ? 'text-blue-400' : 'text-emerald-400'}`}>
                        {t(`specialized_projects.project${num}_role`)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({length: 3}).map((_, i) => (
                      <div key={i} className={`w-1 h-3 rounded-full opacity-20 ${num === 1 ? 'bg-amber-500' : num === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Measurable Impact Section */}
    <div className="mt-48 relative" ref={impactRef}>
      <div className="flex items-center gap-12 mb-28">
         <div className="h-px grow bg-linear-to-r from-transparent to-white/10"></div>
         <div className="px-8 py-3 rounded-full border border-blue-500/20 bg-blue-500/5 text-[11px] font-black tracking-[0.4em] text-blue-400 uppercase backdrop-blur-sm">
            {t('specialized_projects.measurable_impact')}
         </div>
         <div className="h-px grow bg-linear-to-l from-transparent to-white/10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
         {[1, 2, 3].map((num) => (
           <div key={num} className="group relative text-center">
              <div className={`absolute inset-0 blur-[80px] opacity-10 group-hover:opacity-30 transition-all duration-1000 ${num === 1 ? 'bg-amber-500' : num === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
              <div className="relative py-16 px-10 rounded-4xl border border-white/5 bg-black/40 hover:bg-black/60 transition-all duration-700 hover:scale-[1.02]">
                 <h4 className={`text-7xl lg:text-8xl font-black mb-6 tracking-tightest ${num === 1 ? 'text-amber-400' : num === 2 ? 'text-blue-400' : 'text-emerald-400'}`}>
                   <Counter value={t(`specialized_projects.stat${num}_value`)} isVisible={showImpact || showProjects} duration={2000} />
                 </h4>
                 <p className="text-white font-black text-base tracking-widest mb-3 uppercase">{t(`specialized_projects.stat${num}_label`)}</p>
                 <div className="w-12 h-0.5 bg-white/10 mx-auto mb-4 group-hover:w-20 transition-all"></div>
                 <p className="text-gray-500 text-xs font-mono tracking-widest leading-relaxed font-light">{t(`specialized_projects.stat${num}_desc`)}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  </div>
</section>
    <FAQSection />

  <section id="contact" className="relative py-48 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <img alt="Background Particles" className="w-full h-full object-cover opacity-30 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFMw1UxfIKK6eWIHicfXJi3kgl-ku0iHU-p1oycqsErdoKjAY1bMzTVviofu9Kg4VkrdchmK6bcu1DlexeBItX06Gj-BQAl5IS5pO-u2HlzRH3bqOp2s8LuXByRjvx8DLpCqEUM_dNTd5Qw9nz24YqCv0zcY7BsNma2_BXmaUowiRNpjnTGy1qNcE_Fw1xkHHZW4EE-RyEYOIo8Cztv73C0CjoNd-ci48fxZwMslB4Za4RyOX4AKKdXoZtQYzAiaLQTUQmj8rXWxU"/>
      <div className="absolute inset-0 bg-linear-to-t from-background-deep via-transparent to-background-deep"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 relative z-20">
      <div className="text-center mb-16">
        <div className="mb-12 inline-block relative bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-xl backdrop-blur-sm animate-pulse">
          <p className="text-red-300 text-sm font-medium">{t('cta_bottom.banner')}</p>
        </div>
        <p className="text-gray-300 text-lg mb-4 font-light italic">{t('cta_bottom.quote')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div className="text-center lg:text-left">
          <h2 className="font-display text-7xl md:text-8xl font-bold text-white mb-12 tracking-tight leading-tight">
            {t('cta_bottom.title_main')} <br /> 
            <span className="gradient-heading italic">{t('cta_bottom.title_accent')}</span>
          </h2>

        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-violet-600/20 blur-3xl opacity-50"></div>
          
          <form className="relative glass-panel p-8 md:p-10 rounded-3xl border border-white/10" onSubmit={onSubmit}>
            <div style={{ display: 'none' }}>
              <label htmlFor="website">Website</label>
              <input id="website" value={form.website} onChange={(e) => setForm(s => ({ ...s, website: e.target.value }))} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-violet-400">contact_support</span>
              {t('form.title')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">{t('form.name')}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                  required value={form.name} onChange={(e) => setForm(s => ({...s, name: e.target.value}))} placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">{t('form.company')}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                  required value={form.company} onChange={(e) => setForm(s => ({...s, company: e.target.value}))} placeholder="Nombre de tu empresa" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">{t('form.email')}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-all text-sm" type="email"
                  required value={form.email} onChange={(e) => setForm(s => ({...s, email: e.target.value}))} placeholder="correo@empresa.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">{t('form.whatsapp')}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                  required value={form.whatsapp} onChange={(e) => setForm(s => ({...s, whatsapp: e.target.value}))} placeholder="+52..." />
              </div>
            </div>
            
            <div className="space-y-2 mb-8">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">{t('form.details')}</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 transition-all text-sm min-h-[100px]"
                value={form.message} onChange={(e) => setForm(s => ({...s, message: e.target.value}))} placeholder="Describe tus cuellos de botella" />
            </div>

            <button type="submit" disabled={status === 'loading'} className="w-full py-5 text-white font-bold tracking-widest rounded-xl btn-primary-gradient relative overflow-hidden group shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-transform">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {status === 'loading' ? t('form.sending') : (
                  <>
                    {t('form.submit')}
                    <span className="material-symbols-outlined text-sm">send</span>
                  </>
                )}
              </span>
            </button>

            {status === 'success' && <p className="text-green-400 text-center text-sm mt-4 font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              {t('form.success')}
            </p>}
            {status === 'error' && <p className="text-red-400 text-center text-sm mt-4 font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {t('form.error')}
            </p>}
          </form>
        </div>
      </div>

      <div className="pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em]">
        <p className="text-center md:text-left">© 2024 {t('comparison.vanta')}. Derechos Reservados.</p>
        <div className="flex justify-center gap-8">
          <a className="hover:text-violet-400 transition-colors" href="#">{t('cta_bottom.privacy')}</a>
          <a className="hover:text-violet-400 transition-colors" href="#">{t('cta_bottom.terms')}</a>
        </div>
        <div className="flex justify-center md:justify-end gap-6 h-fit">
          <a className="hover:text-white transition-colors" href="#">{t('cta_bottom.contact')}</a>
          <a className="hover:text-white transition-colors" href="#">{t('cta_bottom.linkedin')}</a>
          <a className="hover:text-white transition-colors" href="#">{t('cta_bottom.github')}</a>
        </div>
      </div>
    </div>
  </section>

            </>
          </PageTransition>
        } />
        <Route path="/servicios/crm" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/servicios/crm/8943712" element={<PageTransition><Services isSpecialEvent={true} /></PageTransition>} />

      </Routes>
    </AnimatePresence>
  
      {/* End main content wrapper */}
      </div>
    </>
  );
}
