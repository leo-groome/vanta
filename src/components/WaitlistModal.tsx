import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzwzyrv';
const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbzAjrczJVoIaI5VI8Jbe2SUwDZ5Uxy-5L9fkmQKLIeiQDSwAGGwP36YXBgBeuTy81dt/exec';

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, planName }) => {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', contact: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // honeypot anti-spam
    setStatus('loading');

    const formData = {
      name: form.name,
      contact: form.contact,
      plan: planName,
      lang: i18n.language,
      _subject: `Waitlist Lead: ${form.name} - ${planName}`
    };

    try {
      const formspreePromise = fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const params = new URLSearchParams();
      Object.entries(formData).forEach(([k, v]) => params.append(k, String(v)));
      const sheetUrl = `${SHEETS_WEBHOOK}?${params.toString()}`;
      
      const img = new Image();
      const sheetsPromise = new Promise((resolve) => {
        img.onload = img.onerror = () => resolve(true);
        img.src = sheetUrl;
      });

      const [response] = await Promise.all([formspreePromise, sheetsPromise]);

      if ((response as Response).ok) {
        setStatus('success');
        setForm({ name: '', contact: '', website: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error enviando formulario:", error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 left-0 top-0 w-full h-full text-left">
      <div className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 z-20"
        >
          <span className="material-symbols-outlined text-xl leading-none">close</span>
        </button>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">{t('waitlist_modal.success_title')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {t('waitlist_modal.success_desc')}
            </p>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-xl font-bold tracking-widest text-sm uppercase bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                {t('waitlist_modal.title')} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">VANTA CRM</span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {t('waitlist_modal.subtitle')} <strong className="text-white font-medium">{planName}</strong>.
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-5 relative z-10">
              <input type="text" name="website" value={form.website} onChange={handleChange} className="hidden" tabIndex={-1} aria-hidden="true" />
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">{t('waitlist_modal.name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-violet-500/50 text-white placeholder-gray-600 transition-colors"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">{t('waitlist_modal.contact')}</label>
                <input 
                  type="text" 
                  name="contact" 
                  value={form.contact} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-violet-500/50 text-white placeholder-gray-600 transition-colors"
                  placeholder="juan@email.com o +52..."
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mt-2 animate-in slide-in-from-top-2">
                  <span className="material-symbols-outlined text-red-400">error</span>
                  <p className="text-sm text-red-200">{t('waitlist_modal.error')}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="mt-4 w-full py-5 rounded-xl font-bold tracking-widest text-sm uppercase bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('waitlist_modal.sending')}
                  </>
                ) : (
                  <>
                    {t('waitlist_modal.submit')}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
