import fs from 'fs/promises';

async function run() {
  const html = await fs.readFile('../stitch_landing.html', 'utf8');

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) throw new Error("No body found");
  let jsx = bodyMatch[1];

  jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
  jsx = jsx.replace(/<style[\s\S]*?<\/style>/g, '');
  jsx = jsx.replace(/class=/g, 'className=');
  jsx = jsx.replace(/for="/g, 'htmlFor="');
  jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
  jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
  jsx = jsx.replace(/stroke-linejoin/g, 'strokeLinejoin');
  jsx = jsx.replace(/stroke-dasharray/g, 'strokeDasharray');
  jsx = jsx.replace(/stroke-dashoffset/g, 'strokeDashoffset');
  jsx = jsx.replace(/clip-path/g, 'clipPath');
  jsx = jsx.replace(/fill-rule/g, 'fillRule');
  jsx = jsx.replace(/clip-rule/g, 'clipRule');
  jsx = jsx.replace(/viewbox/g, 'viewBox');
  jsx = jsx.replace(/viewBox/gi, 'viewBox');
  
  // self-closing fix
  jsx = jsx.replace(/<br\s*\/?>/g, '<br />');
  jsx = jsx.replace(/<hr\s*\/?>/g, '<hr />');
  jsx = jsx.replace(/<img(.*?[^\/])>/g, '<img$1 />');
  jsx = jsx.replace(/<input(.*?[^\/])>/g, '<input$1 />');
  
  // replace the script tags
  jsx = jsx.replace(/<script[\s\S]*?<\/script>/g, '');
  
  // Fix inline styles
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
      const declarations = p1.split(';').filter(Boolean);
      const styleObj = declarations.map(decl => {
          const [prop, val] = decl.split(':');
          if (!prop || !val) return '';
          const camelProp = prop.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          return `${camelProp}: '${val.trim()}'`;
      }).filter(Boolean).join(', ');
      return `style={{${styleObj}}}`;
  });

  // Load translations & replace literal texts
  const tpl = await fs.readFile('locales/es/translation.json', 'utf8');
  const es = JSON.parse(tpl);
  
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const applyTranslations = (obj, prefix = '') => {
      for (const key in obj) {
          const val = obj[key];
          if (typeof val === 'string') {
              if (val.trim() === '40%' || val.trim() === '0') continue;
              
              const valEscaped = escapeRegExp(val);
              try {
                const regex = new RegExp('>\\\\s*' + valEscaped + '\\\\s*<', 'g');
                jsx = jsx.replace(regex, `>{t('${prefix}${key}')}<`);
              } catch (e) {
                console.log("Error regex:", valEscaped);
              }

              if (val.length > 5 && !val.includes('{')) {
                  jsx = jsx.replace(new RegExp(valEscaped, 'g'), `{t('${prefix}${key}')}`);
              }
          } else {
              applyTranslations(val, prefix + key + '.');
          }
      }
  }

  applyTranslations(es);
  
  // Manual touch-ups for anything missed:
  jsx = jsx.replace(/>\s*40%\s*</g, '>{t("hero.card1_value")}<');
  jsx = jsx.replace(/>\s*0\s*</g, '>{t("hero.card2_value")}<');

  // Also replace some SVG inline issues:
  // We need to inject the Contact Form!
  const contactFormJSX = `
  <section id="contact" className="py-24 relative overflow-hidden bg-black/60 backdrop-blur-3xl border-t border-white/5">
    <div className="max-w-4xl mx-auto px-4 relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold gradient-heading mb-4">{t('contacto', 'Contacto Directo')}</h2>
        <p className="text-gray-400 text-lg">{t('contact_subtitle', 'Agenda un diagnóstico estructural y evalúa si tu arquitectura es la correcta.')}</p>
      </div>

      <form className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden" onSubmit={onSubmit}>
        <div style={{ display: 'none' }}>
          <label htmlFor="website">Website</label>
          <input id="website" value={form.website} onChange={(e) => setForm(s => ({ ...s, website: e.target.value }))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Nombre Completo</label>
            <input className="w-full bg-[#0a0514] border border-violet-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
              required value={form.name} onChange={(e) => setForm(s => ({...s, name: e.target.value}))} placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Empresa</label>
            <input className="w-full bg-[#0a0514] border border-violet-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
              required value={form.company} onChange={(e) => setForm(s => ({...s, company: e.target.value}))} placeholder="Nombre de tu empresa" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Email Profesional</label>
            <input className="w-full bg-[#0a0514] border border-violet-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" type="email"
              required value={form.email} onChange={(e) => setForm(s => ({...s, email: e.target.value}))} placeholder="correo@empresa.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">WhatsApp</label>
            <input className="w-full bg-[#0a0514] border border-violet-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
              required value={form.whatsapp} onChange={(e) => setForm(s => ({...s, whatsapp: e.target.value}))} placeholder="+52..." />
          </div>
        </div>
        
        <div className="space-y-2 mb-8">
          <label className="text-sm text-gray-400 font-medium">Detalles o Retos Principales</label>
          <textarea className="w-full bg-[#0a0514] border border-violet-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors min-h-[120px]"
            value={form.message} onChange={(e) => setForm(s => ({...s, message: e.target.value}))} placeholder="Describe brevemente tus cuellos de botella" />
        </div>

        <button type="submit" disabled={status === 'loading'} className="w-full py-4 text-white font-bold tracking-wide rounded-xl btn-primary-gradient relative overflow-hidden group">
          <span className="relative z-10">{status === 'loading' ? t('enviando', 'Enviando...') : t('enviar', 'ENVIAR SOLICITUD DE DIAGNÓSTICO')}</span>
        </button>

        {status === 'success' && <p className="text-green-400 text-center mt-4">✓ Mensaje recibido. Nos contactaremos pronto.</p>}
        {status === 'error' && <p className="text-red-400 text-center mt-4">✗ Hubo un error. Intenta enviarnos un email.</p>}
      </form>
    </div>
  </section>
  `;

  const reactCode = `import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'es');
  
  const [form, setForm] = useState({
    name: '', company: '', whatsapp: '', email: '', industry: '', goal: '', message: '', website: ''
  });
  const [status, setStatus] = useState('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return;
    setStatus('loading');
    try {
      const resp = await fetch('https://vantasolutions-production.up.railway.app/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang })
      });
      if (!resp.ok) throw new Error('Network response was not ok');
      setStatus('success');
      setForm({ name: '', company: '', whatsapp: '', email: '', industry: '', goal: '', message: '', website: '' });
    } catch {
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
      <div className="fixed top-4 right-4 z-[60]">
        <button onClick={toggleLang} className="bg-violet-600/10 hover:bg-violet-600/20 text-white px-4 py-2 rounded-full border border-violet-500/30 text-xs font-semibold backdrop-blur-md transition-all flex items-center justify-center min-w-[40px] shadow-lg shadow-violet-500/20">
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
      ${jsx}
      ${contactFormJSX}
    </>
  );
}
`;

  await fs.writeFile('App.tsx', reactCode);
}
run();
