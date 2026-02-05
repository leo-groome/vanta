import { useMemo, useState } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'

type Lang = 'es' | 'en'

type FormState = {
  name: string
  company: string
  whatsapp: string
  email: string
  industry: string
  goal: string
  message: string
  website: string
}

const WHATSAPP_LINK_ES =
  'https://wa.me/524495411077?text=Hola,%20soy%20___%20de%20___%20(industria:%20___).%20Quiero%20un%20diagnostico%20para%20saber%20si%20mi%20negocio%20es%20rentable%20y%20c%C3%B3mo%20mejorarlo.'

const SIGNATURE = '— Vanta Solutions | Ingenieria de elite'

const content = {
  es: {
    nav: {
      manifesto: 'Manifiesto',
      dna: 'ADN',
      method: 'Metodo',
      cases: 'Casos',
      contact: 'Contacto',
    },
    ctaPrimary: 'Solicitar diagnostico estrategico',
    ctaSecondary: 'WhatsApp',
    pricingLine: 'Diagnostico estrategico sin costo · Software 100% a medida',
    hero: {
      eyebrow: 'Aguascalientes, Mexico · Ingenieria de elite',
      title: 'Eficiencia absoluta para operaciones complejas.',
      subtitle:
        'Diseccionamos tu operacion, automatizamos friccion y convertimos procesos en sistemas precisos que escalan con control.',
    },
    aside: {
      kpi1Label: 'En produccion',
      kpi1Value: '1 sistema activo',
      kpi2Label: 'En desarrollo',
      kpi2Value: '4 implementaciones',
      kpi3Label: 'Modelo',
      kpi3Value: '100% a medida',
    },
    manifesto: {
      title: 'Manifiesto',
      lines: [
        'El mundo esta lleno de software dificil, lento y generico. El tiempo se escapa en procesos que deberian ser invisibles.',
        'En Vanta Solutions no hacemos programas; disenamos poder. Aplicamos ingenieria de elite para que lo complejo se vuelva simple y lo manual se vuelva automatico.',
        'No somos los mas baratos; somos los que entienden tu proceso mejor que tu mismo. Bienvenido a la era de la eficiencia absoluta.',
      ],
    },
    dna: {
      title: 'ADN de marca',
      subtitle: 'Mision, vision y propuesta de valor.',
      items: [
        {
          title: 'Mision',
          body:
            'Erradicar la ineficiencia empresarial mediante software a medida y automatizaciones de vanguardia que transforman procesos complejos en herramientas intuitivas y poderosas.',
        },
        {
          title: 'Vision',
          body:
            'Convertirnos en el estandar global de infraestructura tecnologica para las empresas mas influyentes del mundo.',
        },
        {
          title: 'Propuesta de valor',
          body:
            'Mientras otros ofrecen parches genericos, nosotros diseccionamos tus procesos internos para construir el motor que impulsara tu crecimiento.',
        },
      ],
    },
    capabilities: {
      title: 'Ingenieria aplicada',
      subtitle: 'Tres frentes, un objetivo: eficiencia absoluta.',
      items: [
        {
          title: 'Arquitectura operativa',
          body: 'Modelamos flujos, datos y decisiones antes de escribir una linea. La precision nace del diagnostico.',
        },
        {
          title: 'Automatizacion avanzada',
          body: 'Conectamos sistemas, eliminamos pasos manuales y reducimos el tiempo muerto con flujos inteligentes.',
        },
        {
          title: 'Interfaces de control',
          body: 'UX/UI sobria y rapida para equipos que necesitan ejecutar sin friccion.',
        },
      ],
    },
    differentiator: {
      title: 'El Ingeniero de Elite',
      subtitle:
        'Directos, resolutivos y tres pasos adelante del futuro. Construimos con sobriedad tecnica, sin ruido corporativo.',
    },
    process: {
      title: 'Metodo',
      subtitle: 'Simple, visible y orientado a impacto real.',
      steps: [
        {
          title: 'Diagnostico estrategico',
          body: 'Auditamos procesos, roles y datos. Identificamos los cuellos reales.',
        },
        {
          title: 'Modelado del sistema',
          body: 'Definimos arquitectura, automatizaciones y prioridades con impacto medible.',
        },
        {
          title: 'Construccion por sprints',
          body: 'Entregas frecuentes con visibilidad total del avance.',
        },
        {
          title: 'Operacion + mejora',
          body: 'Soporte y optimizacion continua para mantener eficiencia.',
        },
      ],
    },
    cases: {
      title: 'Casos',
      subtitle: '1 sistema en produccion, 4 implementaciones en desarrollo.',
      items: [
        {
          title: 'Clinica dental: agenda + operaciones + finanzas',
          body:
            'Sistema integral con reservas web, control de tratamientos y visibilidad financiera en tiempo real.',
          status: 'En produccion',
          metrics: ['Agenda centralizada', 'Control de costos por tratamiento', 'Panel operativo diario'],
        },
        {
          title: 'Restaurantes: POS + cocina + inventario',
          body: 'Implementacion en curso para unificar venta, cocina y reposicion.',
          status: 'En desarrollo',
          phase: 'Arquitectura y prototipo funcional',
        },
        {
          title: 'Servicios profesionales: gestion de proyectos',
          body: 'Plataforma para seguimiento de clientes, tiempos y rentabilidad por servicio.',
          status: 'En desarrollo',
          phase: 'Modelado de datos y automatizaciones',
        },
        {
          title: 'Logistica urbana: operaciones y rutas',
          body: 'Control operativo, asignacion y trazabilidad de entregas.',
          status: 'En desarrollo',
          phase: 'Definicion de flujos y tableros',
        },
        {
          title: 'Retail especializado: inventario y reposicion',
          body: 'Sistema para stock, compras y alertas en tiempo real.',
          status: 'En desarrollo',
          phase: 'Discovery con equipos de tienda',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Respuestas directas para tomar decision rapido.',
      items: [
        {
          q: 'Como definen alcance y costo?',
          a: 'Proyecto por entregables. Priorizamos impacto y eliminamos sorpresas.',
        },
        {
          q: 'El codigo es del cliente?',
          a: 'Si. El sistema y sus entregables quedan para el cliente segun la propuesta.',
        },
        {
          q: 'Incluyen soporte post-lanzamiento?',
          a: 'Si. Definimos una fase de mejora continua segun tus necesidades.',
        },
        {
          q: 'Trabajan con empresas fuera de Aguascalientes?',
          a: 'Si. Operamos remoto con entregas claras y seguimiento continuo.',
        },
      ],
    },
    contact: {
      title: 'Solicita tu diagnostico estrategico.',
      subtitle: 'Comparte lo esencial. Respondemos con un plan claro.',
      formTitle: 'Brief operativo',
      submit: 'Enviar solicitud',
      submitting: 'Enviando...',
      success: 'Listo. Recibimos tu solicitud. Te contactamos por WhatsApp.',
      error: 'No se pudo enviar en este momento. Prueba por WhatsApp o intenta de nuevo.',
      note: 'Sin spam. Solo para coordinar tu diagnostico.',
      fields: {
        name: 'Nombre',
        company: 'Empresa',
        whatsapp: 'WhatsApp',
        email: 'Correo',
        industry: 'Industria',
        goal: 'Objetivo principal',
        message: 'Contexto (opcional)',
      },
      industries: ['Salud', 'Servicios', 'Logistica', 'Restaurantes', 'Retail', 'Otra'],
      goals: ['Eficiencia operativa', 'Control financiero', 'Automatizacion', 'Visibilidad de datos', 'Otro'],
    },
    footer: {
      title: 'VANTA SOLUTIONS',
      location: 'Aguascalientes, Mexico',
      email: 'VantaSolutions-Service@outlook.com',
      instagram: '@Vantasolutions',
    },
  },
  en: {
    nav: {
      manifesto: 'Manifesto',
      dna: 'DNA',
      method: 'Method',
      cases: 'Cases',
      contact: 'Contact',
    },
    ctaPrimary: 'Request strategic diagnostic',
    ctaSecondary: 'WhatsApp',
    pricingLine: 'Strategic diagnostic at no cost · 100% custom software',
    hero: {
      eyebrow: 'Aguascalientes, Mexico · Elite engineering',
      title: 'Absolute efficiency for complex operations.',
      subtitle:
        'We dissect your operation, automate friction, and turn processes into precise systems that scale with control.',
    },
    aside: {
      kpi1Label: 'In production',
      kpi1Value: '1 live system',
      kpi2Label: 'In delivery',
      kpi2Value: '4 implementations',
      kpi3Label: 'Model',
      kpi3Value: '100% custom',
    },
    manifesto: {
      title: 'Manifesto',
      lines: [
        'The world is full of software that is slow, generic, and hard to use. Time leaks through processes that should be invisible.',
        'At Vanta Solutions we do not ship programs; we design power. We apply elite engineering so the complex becomes simple and the manual becomes automatic.',
        'We are not the cheapest; we are the ones who understand your process better than anyone. Welcome to the era of absolute efficiency.',
      ],
    },
    dna: {
      title: 'Brand DNA',
      subtitle: 'Mission, vision, and value proposition.',
      items: [
        {
          title: 'Mission',
          body:
            'Eradicate business inefficiency through custom software and cutting-edge automation that turns complex processes into intuitive, powerful tools.',
        },
        {
          title: 'Vision',
          body: 'Become the global standard for technological infrastructure in the most influential companies in the world.',
        },
        {
          title: 'Value proposition',
          body:
            'While others deliver generic patches, we dissect your internal processes to build the engine that drives your growth.',
        },
      ],
    },
    capabilities: {
      title: 'Applied engineering',
      subtitle: 'Three fronts, one goal: absolute efficiency.',
      items: [
        {
          title: 'Operational architecture',
          body: 'We model flows, data, and decisions before writing a line of code. Precision starts with diagnosis.',
        },
        {
          title: 'Advanced automation',
          body: 'We connect systems, remove manual steps, and reduce downtime with intelligent workflows.',
        },
        {
          title: 'Control interfaces',
          body: 'Sober, fast UX/UI for teams that need to execute without friction.',
        },
      ],
    },
    differentiator: {
      title: 'The Elite Engineer',
      subtitle: 'Direct, resolute, and three steps ahead of the future. We build with technical clarity, no corporate noise.',
    },
    process: {
      title: 'Method',
      subtitle: 'Simple, transparent, and oriented to measurable impact.',
      steps: [
        {
          title: 'Strategic diagnostic',
          body: 'We audit processes, roles, and data. We identify the real bottlenecks.',
        },
        {
          title: 'System modeling',
          body: 'We define architecture, automation, and priorities with measurable impact.',
        },
        {
          title: 'Sprint execution',
          body: 'Frequent deliveries with full visibility on progress.',
        },
        {
          title: 'Operate + improve',
          body: 'Continuous support and optimization to maintain efficiency.',
        },
      ],
    },
    cases: {
      title: 'Cases',
      subtitle: '1 live system, 4 implementations in development.',
      items: [
        {
          title: 'Dental clinic: booking + operations + finance',
          body: 'End-to-end system with web booking, treatment control, and real-time financial visibility.',
          status: 'In production',
          metrics: ['Centralized schedule', 'Treatment cost control', 'Daily operational dashboard'],
        },
        {
          title: 'Restaurants: POS + kitchen + inventory',
          body: 'Delivery in progress to unify sales, kitchen flow, and restocking.',
          status: 'In development',
          phase: 'Architecture and functional prototype',
        },
        {
          title: 'Professional services: project management',
          body: 'Platform for client tracking, time control, and margin per service.',
          status: 'In development',
          phase: 'Data modeling and automation design',
        },
        {
          title: 'Urban logistics: operations and routes',
          body: 'Operational control, assignment, and delivery traceability.',
          status: 'In development',
          phase: 'Workflow definition and dashboards',
        },
        {
          title: 'Specialty retail: inventory and restocking',
          body: 'System for stock, purchasing, and real-time alerts.',
          status: 'In development',
          phase: 'Discovery with store teams',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Direct answers for decisive teams.',
      items: [
        {
          q: 'How do you define scope and cost?',
          a: 'Project-based with clear deliverables. We prioritize impact and eliminate surprises.',
        },
        {
          q: 'Do we own the code?',
          a: 'Yes. The system and deliverables are yours as defined in the proposal.',
        },
        {
          q: 'Do you include post-launch support?',
          a: 'Yes. We define a continuous improvement phase for your needs.',
        },
        {
          q: 'Do you work with teams outside Aguascalientes?',
          a: 'Yes. We operate remotely with clear milestones and constant follow-up.',
        },
      ],
    },
    contact: {
      title: 'Request your strategic diagnostic.',
      subtitle: 'Share the essentials. We answer with a clear plan.',
      formTitle: 'Operational brief',
      submit: 'Send request',
      submitting: 'Sending...',
      success: "Done. We received your request. We'll reach out via WhatsApp.",
      error: 'Could not send right now. Try WhatsApp or retry.',
      note: 'No spam. Only to coordinate your diagnostic.',
      fields: {
        name: 'Name',
        company: 'Company',
        whatsapp: 'WhatsApp',
        email: 'Email',
        industry: 'Industry',
        goal: 'Primary goal',
        message: 'Context (optional)',
      },
      industries: ['Health', 'Services', 'Logistics', 'Restaurants', 'Retail', 'Other'],
      goals: ['Operational efficiency', 'Financial control', 'Automation', 'Data visibility', 'Other'],
    },
    footer: {
      title: 'VANTA SOLUTIONS',
      location: 'Aguascalientes, Mexico',
      email: 'VantaSolutions-Service@outlook.com',
      instagram: '@Vantasolutions',
    },
  },
} satisfies Record<Lang, unknown>

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const raw = localStorage.getItem('lang')
    if (raw === 'es' || raw === 'en') return raw
    const nav = navigator.language.toLowerCase()
    return nav.startsWith('es') ? 'es' : 'en'
  })

  const t = content[lang]

  const [form, setForm] = useState<FormState>({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    industry: '',
    goal: '',
    message: '',
    website: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const env = useMemo(() => {
    return {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
      leadTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_LEAD as string | undefined,
      autoTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY as string | undefined,
    }
  }, [])

  function onLang(next: Lang) {
    setLang(next)
    localStorage.setItem('lang', next)
    document.documentElement.lang = next
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (form.website.trim().length > 0) return

    if (!env.serviceId || !env.publicKey || !env.leadTemplateId || !env.autoTemplateId) {
      setStatus('error')
      return
    }

    if (!form.name || !form.company || !form.whatsapp || !form.email || !form.industry || !form.goal) {
      setStatus('error')
      return
    }

    setStatus('loading')

    const timestamp = new Date().toISOString()

    const baseParams = {
      from_name: 'VANTA SOLUTIONS',
      name: form.name,
      company: form.company,
      whatsapp: form.whatsapp,
      email: form.email,
      industry: form.industry,
      goal: form.goal,
      message: form.message,
      lang,
      timestamp,
      signature: SIGNATURE,
    }

    try {
      await emailjs.send(
        env.serviceId,
        env.leadTemplateId,
        {
          ...baseParams,
          subject: 'New request StrategicDiagnostic',
        },
        {
          publicKey: env.publicKey,
        },
      )

      await emailjs.send(
        env.serviceId,
        env.autoTemplateId,
        {
          ...baseParams,
          subject: lang === 'es' ? 'Recibimos tu solicitud' : 'We received your request',
          reply_body:
            lang === 'es'
              ? `Recibimos tu solicitud de diagnostico estrategico. Te contactamos por WhatsApp.\n\n${SIGNATURE}`
              : `We received your strategic diagnostic request. We'll reach out via WhatsApp.\n\n${SIGNATURE}`,
        },
        {
          publicKey: env.publicKey,
        },
      )

      setStatus('success')
      setForm({
        name: '',
        company: '',
        whatsapp: '',
        email: '',
        industry: '',
        goal: '',
        message: '',
        website: '',
      })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="brand" onClick={(e) => (e.preventDefault(), scrollToId('top'))}>
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-text">
              <span>VANTA</span>
              <small>SOLUTIONS</small>
            </span>
          </a>

          <nav className="nav" aria-label="Primary">
            <a href="#manifesto" onClick={(e) => (e.preventDefault(), scrollToId('manifesto'))}>
              {t.nav.manifesto}
            </a>
            <a href="#dna" onClick={(e) => (e.preventDefault(), scrollToId('dna'))}>
              {t.nav.dna}
            </a>
            <a href="#method" onClick={(e) => (e.preventDefault(), scrollToId('method'))}>
              {t.nav.method}
            </a>
            <a href="#cases" onClick={(e) => (e.preventDefault(), scrollToId('cases'))}>
              {t.nav.cases}
            </a>
            <a href="#contact" onClick={(e) => (e.preventDefault(), scrollToId('contact'))}>
              {t.nav.contact}
            </a>
          </nav>

          <div className="header-cta">
            <div className="lang" aria-label="Language">
              <button type="button" aria-pressed={lang === 'es'} onClick={() => onLang('es')}>
                ES
              </button>
              <button type="button" aria-pressed={lang === 'en'} onClick={() => onLang('en')}>
                EN
              </button>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => scrollToId('contact')}>
              {t.ctaPrimary}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="h-eyebrow">{t.hero.eyebrow}</span>
              <h1 className="h-title">{t.hero.title}</h1>
              <p>{t.hero.subtitle}</p>

              <div className="hero-actions">
                <button type="button" className="btn btn-primary" onClick={() => scrollToId('contact')}>
                  {t.ctaPrimary}
                </button>
                <a className="btn" href={WHATSAPP_LINK_ES} target="_blank" rel="noreferrer">
                  {t.ctaSecondary}
                </a>
              </div>
              <div className="note" style={{ marginTop: 10 }}>
                {t.pricingLine}
              </div>
            </div>

            <aside className="card hero-aside">
              <div className="hero-logo" aria-hidden="true" />
              <div className="kpi">
                <div className="label">{t.aside.kpi1Label}</div>
                <div className="value">{t.aside.kpi1Value}</div>
              </div>
              <div className="kpi">
                <div className="label">{t.aside.kpi2Label}</div>
                <div className="value">{t.aside.kpi2Value}</div>
              </div>
              <div className="kpi">
                <div className="label">{t.aside.kpi3Label}</div>
                <div className="value">{t.aside.kpi3Value}</div>
              </div>
              <div className="note">{SIGNATURE}</div>
            </aside>
          </div>
        </section>

        <section id="manifesto" className="section" aria-label="Manifesto">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.manifesto.title}</h2>
            </div>
            <div className="card manifesto-card">
              {t.manifesto.lines.map((line: string) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </section>

        <section id="dna" className="section" aria-label="Brand DNA">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.dna.title}</h2>
              <p>{t.dna.subtitle}</p>
            </div>
            <div style={{ height: 16 }} />
            <div className="grid grid-3">
              {t.dna.items.map((item: { title: string; body: string }) => (
                <div key={item.title} className="card card-pad">
                  <h3 className="h-title">{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-label="Applied engineering">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.capabilities.title}</h2>
              <p>{t.capabilities.subtitle}</p>
            </div>
            <div style={{ height: 16 }} />
            <div className="grid grid-3">
              {t.capabilities.items.map((item: { title: string; body: string }) => (
                <div key={item.title} className="card card-pad">
                  <h3 className="h-title">{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-label="Differentiator">
          <div className="container">
            <div className="card card-pad highlight-card">
              <div className="section-title">
                <h2 className="h-title">{t.differentiator.title}</h2>
                <p>{t.differentiator.subtitle}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="method" className="section" aria-label="Method">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.process.title}</h2>
              <p>{t.process.subtitle}</p>
            </div>
            <div style={{ height: 16 }} />
            <div className="grid grid-2">
              {t.process.steps.map((step: { title: string; body: string }) => (
                <div key={step.title} className="card card-pad">
                  <h3 className="h-title">{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cases" className="section" aria-label="Cases">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.cases.title}</h2>
              <p>{t.cases.subtitle}</p>
            </div>
            <div style={{ height: 16 }} />
            <div className="grid grid-2">
              {t.cases.items.map(
                (item: { title: string; body: string; status: string; phase?: string; metrics?: string[] }) => (
                  <div key={item.title} className="card card-pad case-card">
                    <div className="case-media" aria-hidden="true" />
                    <div className="case-header">
                      <h3 className="h-title">{item.title}</h3>
                      <span className="case-status">{item.status}</span>
                    </div>
                    <p>{item.body}</p>
                    {item.phase ? <p className="case-phase">{item.phase}</p> : null}
                    {item.metrics && item.metrics.length > 0 ? (
                      <div className="chips" aria-label="Case metrics">
                        {item.metrics.map((metric) => (
                          <span key={metric} className="chip">
                            {metric}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section id="faq" className="section" aria-label="FAQ">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.faq.title}</h2>
              <p>{t.faq.subtitle}</p>
            </div>
            <div style={{ height: 16 }} />
            <div className="grid">
              {t.faq.items.map((item: { q: string; a: string }) => (
                <details key={item.q} className="card card-pad faq-item">
                  <summary>{item.q}</summary>
                  <div style={{ height: 10 }} />
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section" aria-label="Contact">
          <div className="container grid grid-2">
            <div>
              <div className="section-title" style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h2 className="h-title" style={{ marginBottom: 6 }}>
                  {t.contact.title}
                </h2>
                <p>{t.contact.subtitle}</p>
              </div>
              <div style={{ height: 14 }} />
              <a className="btn" href={WHATSAPP_LINK_ES} target="_blank" rel="noreferrer">
                {t.ctaSecondary}
              </a>
              <div style={{ height: 10 }} />
              <div className="note">{t.footer.email}</div>
            </div>

            <form className="card form" onSubmit={onSubmit}>
              <h3 className="h-title" style={{ marginTop: 0 }}>
                {t.contact.formTitle}
              </h3>

              <div style={{ display: 'none' }}>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
                />
              </div>

              <div className="field-grid">
                <div>
                  <label htmlFor="name">{t.contact.fields.name}</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company">{t.contact.fields.company}</label>
                  <input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                    placeholder={lang === 'es' ? 'Nombre de tu empresa' : 'Company name'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp">{t.contact.fields.whatsapp}</label>
                  <input
                    id="whatsapp"
                    value={form.whatsapp}
                    onChange={(e) => setForm((s) => ({ ...s, whatsapp: e.target.value }))}
                    placeholder={lang === 'es' ? '+52...' : '+52...'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">{t.contact.fields.email}</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder={lang === 'es' ? 'tu@empresa.com' : 'you@company.com'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="industry">{t.contact.fields.industry}</label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(e) => setForm((s) => ({ ...s, industry: e.target.value }))}
                    required
                  >
                    <option value="">{lang === 'es' ? 'Selecciona' : 'Select'}</option>
                    {t.contact.industries.map((industry: string) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="goal">{t.contact.fields.goal}</label>
                  <select
                    id="goal"
                    value={form.goal}
                    onChange={(e) => setForm((s) => ({ ...s, goal: e.target.value }))}
                    required
                  >
                    <option value="">{lang === 'es' ? 'Selecciona' : 'Select'}</option>
                    {t.contact.goals.map((goal: string) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label htmlFor="message">{t.contact.fields.message}</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder={
                    lang === 'es'
                      ? 'Describe tu situacion en 1-2 lineas'
                      : 'Describe your situation in 1-2 lines'
                  }
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                  {status === 'loading' ? t.contact.submitting : t.contact.submit}
                </button>
                <a className="btn btn-quiet" href={WHATSAPP_LINK_ES} target="_blank" rel="noreferrer">
                  {t.ctaSecondary}
                </a>
                <span className="note">{t.pricingLine}</span>
                <span className="note">{t.contact.note}</span>
              </div>

              {status === 'success' ? <p className="note">{t.contact.success}</p> : null}
              {status === 'error' ? <p className="note">{t.contact.error}</p> : null}
            </form>
          </div>
        </section>

        <footer className="footer" aria-label="Footer">
          <div className="container footer-grid">
            <div>
              <div className="brand">
                <span>VANTA</span>
                <small>SOLUTIONS</small>
              </div>
              <div style={{ height: 10 }} />
              <div className="note">{t.footer.location}</div>
            </div>
            <div>
              <div className="note">{t.footer.email}</div>
              <div className="note">{t.footer.instagram}</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
