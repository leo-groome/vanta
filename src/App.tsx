import { useMemo, useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import logo from './assets/logo.svg'
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

const content: Record<Lang, {
  nav: Record<string, string>
  ctaPrimary: string
  ctaSecondary: string
  pricingLine: string
  hero: Record<string, string>
  aside: Record<string, string>
  manifesto: { title: string; lines: string[] }
  dna: { title: string; subtitle: string; items: { title: string; body: string }[] }
  strategy: {
    title: string
    summary: { label: string; text: string }
    impact: { title: string; items: { value: string; label: string }[] }
    protocol: { title: string; steps: string[] }
    differentiator: { title: string; items: string[] }
  }
  capabilities: { title: string; subtitle: string; items: { title: string; body: string }[] }
  differentiator: { title: string; subtitle: string }
  process: { title: string; subtitle: string; steps: { title: string; body: string }[] }
  cases: { 
    title: string; 
    subtitle: string; 
    items: { 
      title: string; 
      body: string; 
      status: 'PRODUCTION' | 'DEVELOPMENT'; 
      phase?: string; 
      metrics?: string[];
      tech?: {
        users: string;
        modules: string;
        integrations: string;
      };
    }[] 
  }
  faq: { title: string; subtitle: string; items: { q: string; a: string }[] }
  contact: {
    title: string
    subtitle: string
    formTitle: string
    submit: string
    submitting: string
    success: string
    error: string
    note: string
    fields: Record<string, string>
    industries: string[]
    goals: string[]
  }
  footer: Record<string, string>
}> = {
  es: {
    nav: {
      manifesto: 'La Firma',
      dna: 'Capacidades',
      method: 'Arquitectura de Ejecución',
      cases: 'Proyectos',
      contact: 'Contacto Ejecutivo',
    },
    ctaPrimary: 'Agendar cita',
    ctaSecondary: 'WhatsApp',
    pricingLine: 'Diagnostico estrategico sin costo · Software 100% a medida',
    hero: {
      eyebrow: 'Aguascalientes, Mexico · Ingenieria de elite',
      title: 'Eficiencia absoluta para operaciones complejas',
      subtitle: 'Diseccionamos, automatizamos y convertimos procesos en sistemas precisos',
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
      title: 'Nuestro ADN',
      subtitle: 'Mision, vision y principios operativos.',
      items: [
        {
          title: 'MISIÓN ESTRATÉGICA',
          body:
            'Erradicar la ineficiencia empresarial mediante software a medida y automatizaciones de vanguardia que transforman procesos complejos en herramientas intuitivas y poderosas.',
        },
        {
          title: 'VISIÓN GLOBAL',
          body:
            'Convertirnos en el estandar global de infraestructura tecnologica para las empresas mas influyentes del mundo.',
        },
        {
          title: 'PRINCIPIOS OPERATIVOS',
          body:
            'Precisión, transparencia y disciplina estructural guían cada decisión. Construimos soluciones medibles, escalables y documentadas, priorizando control operativo y sostenibilidad a largo plazo.',
        },
      ],
    },
    capabilities: {
      title: 'ARQUITECTURA DE EJECUCIÓN',
      subtitle: 'Tres frentes, un sistema.',
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
      title: 'PROTOCOLO OPERATIVO',
      subtitle: 'Ejecución secuencial orientada a impacto real.',
      steps: [
        {
          title: 'Diagnóstico estructural',
          body: 'Auditamos procesos, roles y datos. Identificamos los cuellos reales.',
        },
        {
          title: 'Diseño de arquitectura operativa',
          body: 'Definimos arquitectura, automatizaciones y prioridades con impacto medible.',
        },
        {
          title: 'Implementación controlada',
          body: 'Entregas frecuentes con visibilidad total del avance.',
        },
        {
          title: 'Optimización continua',
          body: 'Soporte y optimización continua para mantener eficiencia.',
        },
      ],
    },
    strategy: {
      title: 'MÓDULO DE ARQUITECTURA DE SISTEMAS',
      summary: {
        label: 'Resumen Ejecutivo',
        text: 'Vanta Solutions es una firma de ingeniería tecnológica especializada en arquitectura operativa y automatización estructural para empresas que requieren precisión, escalabilidad y control absoluto sobre sus procesos.',
      },
      impact: {
        title: 'IMPACTO MEDIBLE',
        items: [
          { value: '+30%', label: 'eficiencia operativa promedio' },
          { value: '4', label: 'implementaciones activas' },
          { value: '100%', label: 'software a medida' },
          { value: '0', label: 'soluciones genéricas' },
        ],
      },
      protocol: {
        title: 'PROTOCOLO DE IMPLEMENTACIÓN',
        steps: [
          'Diagnóstico estructural',
          'Diseño de arquitectura operativa',
          'Implementación controlada',
          'Optimización continua',
        ],
      },
      differentiator: {
        title: 'DIFERENCIADOR',
        items: [
          'No usamos plantillas.',
          'No vendemos SaaS genérico.',
          'No tercerizamos arquitectura crítica.',
          'Diseñamos infraestructura desde cero.',
        ],
      },
    },
    cases: {
      title: 'SISTEMAS ACTIVOS',
      subtitle: 'Infraestructura tecnológica en operación y despliegue continuo.',
      items: [
        {
          title: 'RESTAURANTES: POS + SUPPLY',
          body: 'Arquitectura unificada para control de punto de venta, cocina e inventarios estructurales.',
          status: 'PRODUCTION',
          metrics: ['CONTROL DE INVENTARIO', 'GESTION DE COCINA', 'POS INTEGRADO'],
          phase: 'Prototipo funcional',
          tech: { users: '20+', modules: '12', integrations: '04' }
        },
        {
          title: 'CLÍNICA DENTAL: CORE',
          body: 'Sistema de arquitectura centralizada para gestión clínica, financiera y operativa.',
          status: 'DEVELOPMENT',
          metrics: ['AGENDA CENTRALIZADA', 'CONTROL FINANCIERO', 'PANEL OPERATIVO'],
          tech: { users: '12+', modules: '08', integrations: '03' }
        },
        {
          title: 'PROFESSIONAL SERVICES: ERP',
          body: 'Plataforma técnica para seguimiento de proyectos, tiempos y márgenes de rentabilidad.',
          status: 'DEVELOPMENT',
          metrics: ['TRACKING DE TIEMPOS', 'MARGENES POR PROYECTO', 'REPORTES REAL-TIME'],
          phase: 'Modelado de datos',
          tech: { users: '05+', modules: '06', integrations: '02' }
        },
        {
          title: 'CUSTOMER RELATIONSHIP MANAGEMENT: CRM',
          body: 'Sistema de inteligencia comercial centralizado diseñado para gestionar relaciones con clientes, embudos de ventas y rendimiento de ingresos en tiempo real.',
          status: 'DEVELOPMENT',
          metrics: ['CONTROL DE EMBUDO DE VENTAS','SEGUIMIENTO DE LEADS','SEGUIMIENTO AUTOMATIZADO'],
          phase: 'Modelado de arquitectura',
          tech: { users: '20+', modules: '08', integrations: '06' }
        },
        {
          title: 'RETAIL: STOCK CONTROL',
          body: 'Infraestructura de inventario y reposición automatizada para tiendas especializadas.',
          status: 'DEVELOPMENT',
          metrics: ['REPOSICION AUTOMATICA', 'CONTROL DE MERMAS', 'ALERTAS DE STOCK'],
          phase: 'Fase Discovery',
          tech: { users: '30+', modules: '09', integrations: '03' }
        },
      ],
    },
    faq: {
      title: 'BRIEF DE DECISIÓN',
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
      manifesto: 'The Firm',
      dna: 'Capabilities',
      method: 'Operational Architecture',
      cases: 'Projects',
      contact: 'Executive Contact',
    },
    ctaPrimary: 'Schedule appointment',
    ctaSecondary: 'WhatsApp',
    pricingLine: 'Strategic diagnostic at no cost · 100% custom software',
    hero: {
      eyebrow: 'Aguascalientes, Mexico · Elite engineering',
      title: 'Absolute efficiency for complex operations',
      subtitle: 'We dissect, automate, and turn processes into precise systems',
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
      title: 'Our DNA',
      subtitle: 'Mission, vision, and operational principles.',
      items: [
        {
          title: 'STRATEGIC MISSION',
          body:
            'Eradicate business inefficiency through custom software and cutting-edge automation that turns complex processes into intuitive, powerful tools.',
        },
        {
          title: 'GLOBAL VISION',
          body: 'Become the global standard for technological infrastructure in the most influential companies in the world.',
        },
        {
          title: 'OPERATIONAL PRINCIPLES',
          body:
            'While others deliver generic patches, we dissect your internal processes to build the engine that drives your growth.',
        },
      ],
    },
    capabilities: {
      title: 'EXECUTION ARCHITECTURE',
      subtitle: 'Three fronts, one system.',
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
      title: 'OPERATIONAL PROTOCOL',
      subtitle: 'Sequential execution oriented to real impact.',
      steps: [
        {
          title: 'Structural diagnostic',
          body: 'We audit processes, roles, and data. We identify the real bottlenecks.',
        },
        {
          title: 'Operational architecture design',
          body: 'We define architecture, automation, and priorities with measurable impact.',
        },
        {
          title: 'Controlled implementation',
          body: 'Frequent deliveries with full visibility on progress.',
        },
        {
          title: 'Continuous optimization',
          body: 'Continuous support and optimization to maintain efficiency.',
        },
      ],
    },
    strategy: {
      title: 'SYSTEM ARCHITECTURE MODULE',
      summary: {
        label: 'Executive Summary',
        text: 'Vanta Solutions is a technological engineering firm specialized in operational architecture and structural automation for companies requiring precision, scalability, and absolute control over their processes.',
      },
      impact: {
        title: 'MEASURABLE IMPACT',
        items: [
          { value: '+30%', label: 'average operational efficiency' },
          { value: '4', label: 'active implementations' },
          { value: '100%', label: 'custom software' },
          { value: '0', label: 'generic solutions' },
        ],
      },
      protocol: {
        title: 'IMPLEMENTATION PROTOCOL',
        steps: [
          'Structural diagnostic',
          'Operational architecture design',
          'Controlled implementation',
          'Continuous optimization',
        ],
      },
      differentiator: {
        title: 'DIFFERENTIATOR',
        items: [
          'No templates used.',
          'No generic SaaS sales.',
          'No critical architecture outsourcing.',
          'Custom infrastructure design from scratch.',
        ],
      },
    },
    cases: {
      title: 'ACTIVE SYSTEMS',
      subtitle: 'Technological infrastructure in continuous operation and deployment.',
      items: [
        {
          title: 'RESTAURANTS: POS + SUPPLY',
          body: 'Unified architecture for point of sale control, kitchen flow, and structural inventories.',
          status: 'PRODUCTION',
          metrics: ['INVENTORY CONTROL', 'KITCHEN MANAGEMENT', 'INTEGRATED POS'],
          phase: 'Functional prototype',
          tech: { users: '20+', modules: '12', integrations: '04' }
        },
        {
          title: 'DENTAL CLINIC: CORE',
          body: 'Centralized architecture system for clinical, financial, and operational management.',
          status: 'DEVELOPMENT',
          metrics: ['CENTRALIZED SCHEDULE', 'FINANCIAL CONTROL', 'OPERATIONAL PANEL'],
          tech: { users: '12+', modules: '08', integrations: '03' }
        },
        {
          title: 'PROFESSIONAL SERVICES: ERP',
          body: 'Technical platform for project tracking, time management, and profitability margins.',
          status: 'DEVELOPMENT',
          metrics: ['TIME TRACKING', 'PROJECT MARGINS', 'REAL-TIME REPORTING'],
          phase: 'Data modeling',
          tech: { users: '05+', modules: '06', integrations: '02' }
        },
        {
          title: 'CUSTOMER RELATIONSHIP MANAGEMENT: CRM',
          body: 'Centralized commercial intelligence system designed to manage client relationships, sales pipelines and revenue performance in real time.',
          status: 'DEVELOPMENT',
          metrics: ['SALES PIPELINE CONTROL','LEAD TRACKING','AUTOMATED FOLLOW-UPS'],
          phase: 'Architecture modeling',
          tech: {users: '20+',modules: '08',integrations: '06'}
        },
        {
          title: 'RETAIL: STOCK CONTROL',
          body: 'Inventory infrastructure and automated replenishment for specialized stores.',
          status: 'DEVELOPMENT',
          metrics: ['AUTO REPLENISHMENT', 'WASTE CONTROL', 'STOCK ALERTS'],
          phase: 'Discovery phase',
          tech: { users: '30+', modules: '09', integrations: '03' }
        },
      ],
    },
    faq: {
      title: 'DECISION BRIEF',
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
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [isDashboardActive, setIsDashboardActive] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [activeSystemIndex, setActiveSystemIndex] = useState(0)

  const [lang, setLang] = useState<Lang>(() => {
    const raw = localStorage.getItem('lang')
    if (raw === 'es' || raw === 'en') return raw
    const nav = navigator.language.toLowerCase()
    return nav.startsWith('es') ? 'es' : 'en'
  })

  const t = content[lang]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsDashboardActive(true)
        }
      },
      { threshold: 0.1 }
    )
    if (dashboardRef.current) observer.observe(dashboardRef.current)
    return () => observer.disconnect()
  }, [])

  function scrollProjects(dir: 'left' | 'right') {
    const total = t.cases.items.length
    if (dir === 'left') {
      setActiveSystemIndex((prev) => (prev - 1 + total) % total)
    } else {
      setActiveSystemIndex((prev) => (prev + 1) % total)
    }
  }

  // Automatic cycling of the Active Systems panel every 5 seconds
  useEffect(() => {
    if (!autoRotate) return
    const id = window.setInterval(() => {
      scrollProjects('right')
    }, 5000)
    return () => window.clearInterval(id)
  }, [autoRotate, t.cases.items.length])

  useEffect(() => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const item = container.children[activeSystemIndex] as HTMLElement
    if (item) {
      const target = item.offsetLeft - (container.clientWidth - item.clientWidth) / 2
      container.scrollTo({ left: target, behavior: 'smooth' })
    }
  }, [activeSystemIndex])

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
            <img src={logo} alt="Vanta Logo" className="brand-logo" />
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
            <button type="button" className="btn btn-nav" onClick={() => scrollToId('contact')}>
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
              <h1 className="h-title">
                {t.hero.title}
                <span className="h-accent">.</span>
              </h1>
              <p>{t.hero.subtitle}</p>

              <div className="hero-actions">
                <button type="button" className="btn btn-primary" onClick={() => scrollToId('contact')}>
                  {t.ctaPrimary}
                </button>
                <a className="btn btn-secondary" href={WHATSAPP_LINK_ES} target="_blank" rel="noreferrer">
                  {t.ctaSecondary}
                </a>
              </div>
              <div className="note" style={{ marginTop: 10 }}>
                {t.pricingLine}
              </div>
            </div>

            <div className="hero-separator" aria-hidden="true" />

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
              <h2 className="h-title" style={{ color: '#fff' }}>{t.manifesto.title}</h2>
            </div>
            <div className="card manifesto-card">
              {t.manifesto.lines.map((line: string) => (
                <p key={line} style={{ color: '#F2F2F2' }}>{line}</p>
              ))}
            </div>
          </div>
        </section>

        <section id="dna" className="section section-dna" aria-label="Brand DNA">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.dna.title}</h2>
              <p>{t.dna.subtitle}</p>
            </div>
            <div style={{ height: 64 }} />
            <div className="dna-balanced">
              <div className="dna-line" />
              {t.dna.items.map((item: { title: string; body: string }, index: number) => (
                <div key={item.title} className="dna-node">
                  <div className="dna-num">0{index + 1}</div>
                  <div className="dna-card">
                    <h3 className="h-title">{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                  <div className="dna-dot-central" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section 
          id="method"
          className="section section-capabilities" 
          aria-label="Execution architecture"
        >
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.capabilities.title}</h2>
              <p>{t.capabilities.subtitle}</p>
            </div>
            <div style={{ height: 48 }} />
            <div className="capabilities-grid">
              {t.capabilities.items.map((item: { title: string; body: string }, index: number) => (
                <div key={item.title} className="capability-block">
                  <span className="capability-num">0{index + 1}</span>
                  <div className="capability-content">
                    <h3 className="h-title">{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section 
          id="strategy" 
          className={`section section-dashboard ${isDashboardActive ? 'is-active' : ''}`} 
          ref={dashboardRef}
        >
          <div className="container">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <span className="panel-label">{t.strategy.title}</span>
                  <div className="panel-trace-line" />
                </div>
              
              <div className="panel-body">
                <div className="panel-col-left">
                  <div className="dashboard-module mod-01">
                    <div className="mod-header">
                      <span className="mod-num-bg">01</span>
                      <h3 className="mod-title">{t.strategy.summary.label.toUpperCase()}</h3>
                    </div>
                    <p className="mod-text">
                      {t.strategy.summary.text}
                    </p>
                  </div>

                  <div className="dashboard-data-list">
                    {t.strategy.impact.items.map((item: { value: string; label: string }) => (
                      <div key={item.label} className={`data-block ${item.value === '0' ? 'data-highlight' : ''}`}>
                        <span className="data-val">{item.value}</span>
                        <span className="data-label">{item.label.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel-col-right">
                  <div className="dashboard-module mod-02">
                    <div className="mod-header">
                      <h3 className="mod-title">{t.strategy.protocol.title.toUpperCase()}</h3>
                    </div>
                    <div className="pipeline-container">
                      <div className="pipeline-line" />
                      <div className="pipeline-steps">
                        {t.strategy.protocol.steps.map((step: string, idx: number) => (
                          <div key={step} className="pipeline-step">
                            <span className="step-num">0{idx + 1}</span>
                            <span className="step-text">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-module mod-diff">
                    <div className="mod-header">
                      <h3 className="mod-title">{t.strategy.differentiator.title.toUpperCase()}</h3>
                    </div>
                    <div className="diff-statement-list">
                      {t.strategy.differentiator.items.map((item: string) => (
                        <div key={item} className="diff-statement">{item.toUpperCase()}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cases" className="section section-systems" aria-label="Active Systems">
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.cases.title}</h2>
              <p>{t.cases.subtitle}</p>
            </div>
            <div style={{ height: 48 }} />
            
            <div className="systems-wrapper">
            <div className="systems-carousel" ref={scrollRef} onMouseEnter={() => setAutoRotate(false)} onMouseLeave={() => setAutoRotate(true)}>
                {t.cases.items.map(
                  (item: { 
                    title: string; 
                    body: string; 
                    status: 'PRODUCTION' | 'DEVELOPMENT'; 
                    phase?: string; 
                    metrics?: string[];
                    tech?: { users: string; modules: string; integrations: string };
                  }, index: number) => (
                    <div key={item.title} className={`system-panel ${index === activeSystemIndex ? 'is-active' : ''}`}>
                      <div className={`system-status-bar ${item.status === 'PRODUCTION' ? 'status-prod' : 'status-dev'}`} />
                      
                      <div className="system-header">
                        <div className="system-icon-bare" aria-hidden="true">
                          {item.title.includes('DENTAL') && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C12,2 12,2 12,2C10.6,2 9.4,2.5 8.4,3.4C7.4,4.3 6.9,5.5 6.9,6.9C6.9,8.3 7.4,9.5 8.4,10.4C8.7,10.7 9.1,11 9.5,11.2V14.5C9.5,15.3 10.2,16 11,16H13C13.8,16 14.5,15.3 14.5,14.5V11.2C14.9,11 15.3,10.7 15.6,10.4C16.6,9.5 17.1,8.3 17.1,6.9C17.1,5.5 16.6,4.3 15.6,3.4C14.6,2.5 13.4,2 12,2M12,4C12.8,4 13.5,4.3 14.1,4.9C14.7,5.5 15.1,6.2 15.1,7C15.1,7.8 14.7,8.5 14.1,9.1C13.8,9.4 13.4,9.6 13,9.8V14H11V9.8C10.6,9.6 10.2,9.4 9.9,9.1C9.3,8.5 8.9,7.8 8.9,7C8.9,6.2 9.3,5.5 9.9,4.9C10.5,4.3 11.2,4 12,4M11,18V20H13V18H11M10,21V22H14V21H10Z" /></svg>}
                          {item.title.includes('RESTAURANTES') || item.title.includes('RESTAURANTS') && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11,9H13V7H11M11,20H13V18H11M11,15H13V13H11M16,15H18V13H16M16,20H18V18H16M16,9H18V7H16M6,15H8V13H6M6,20H8V18H6M6,9H8V7H6M12,2L1,21H23L12,2Z" /></svg>}
                          {item.title.includes('SERVICES') && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" /></svg>}
                          {item.title.includes('CRM') && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,15C15.31,15 18,12.31 18,9C18,5.69 15.31,3 12,3C8.69,3 6,5.69 6,9C6,12.31 8.69,15 12,15M12,5C14.21,5 16,6.79 16,9C16,11.21 14.21,13 12,13C9.79,13 8,11.21 8,9C8,6.79 9.79,5 12,5M20,19C20,16.24 16.42,14 12,14C7.58,14 4,16.24 4,19V21H20V19M6.39,19C7.14,17.81 9.3,16 12,16C14.7,16 16.86,17.81 17.61,19H6.39Z" /></svg>}
                          {item.title.includes('RETAIL') && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,18H6V14H12M21,14H12V18H21M12,8V4H21V8M6,4V8H12V4M3,2H21A2,2 0 0,1 23,4V18A2,2 0 0,1 21,20H3A2,2 0 0,1 1,18V4A2,2 0 0,1 3,2Z" /></svg>}
                        </div>
                        <div className="system-id">
                          <span className="label">SYSTEM:</span>
                          <h3 className="value">{item.title}</h3>
                        </div>
                        <div className="system-status">
                          <span className="label">STATUS:</span>
                          <span className={`value ${item.status === 'PRODUCTION' ? 'text-prod' : 'text-dev'}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <div className="system-body">
                        <p className="system-description">{item.body}</p>
                        
                        {item.tech && (
                          <div className="system-tech-grid">
                            <div className="tech-item">
                              <span className="tech-label">USERS</span>
                              <span className="tech-val">{item.tech.users}</span>
                            </div>
                            <div className="tech-item">
                              <span className="tech-label">MODULES</span>
                              <span className="tech-val">{item.tech.modules}</span>
                            </div>
                            <div className="tech-item">
                              <span className="tech-label">INTEGRATIONS</span>
                              <span className="tech-val">{item.tech.integrations}</span>
                            </div>
                          </div>
                        )}

                        {item.metrics && item.metrics.length > 0 && (
                          <div className="system-tags">
                            {item.metrics.map((metric) => (
                              <span key={metric} className="system-tag">
                                {metric}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {item.phase && (
                          <div className="system-phase">
                            <span className="label">PHASE:</span>
                            <span className="value">{item.phase.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="systems-nav">
                <button 
                  type="button" 
                  className="nav-btn" 
                  onClick={() => scrollProjects('left')}
                  aria-label="Previous"
                >
                  PREV
                </button>
                <div className="nav-divider" />
                <button 
                  type="button" 
                  className="nav-btn" 
                  onClick={() => scrollProjects('right')}
                  aria-label="Next"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section section-brief" aria-label={t.faq.title}>
          <div className="container">
            <div className="section-title">
              <h2 className="h-title">{t.faq.title}</h2>
              <p>{t.faq.subtitle}</p>
            </div>
            <div style={{ height: 48 }} />
            <div className="brief-list">
              {t.faq.items.map((item: { q: string; a: string }) => (
                <div key={item.q} className="brief-item">
                  <div className="brief-theme">{item.q.toUpperCase()}</div>
                  <div className="brief-content">
                    <p className="brief-explanation">{item.a}</p>
                    <div className="brief-result">
                      <span className="result-arrow">→</span>
                      <span className="result-text">
                        {item.q.toLowerCase().includes('alcance') || item.q.toLowerCase().includes('scope') 
                          ? (lang === 'es' ? 'Previsibilidad financiera total.' : 'Total financial predictability.')
                          : item.q.toLowerCase().includes('codigo') || item.q.toLowerCase().includes('code')
                          ? (lang === 'es' ? 'Propiedad intelectual garantizada.' : 'Guaranteed intellectual property.')
                          : item.q.toLowerCase().includes('soporte') || item.q.toLowerCase().includes('support')
                          ? (lang === 'es' ? 'Escalabilidad sin friccion.' : 'Frictionless scalability.')
                          : (lang === 'es' ? 'Ejecucion de elite garantizada.' : 'Elite execution guaranteed.')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section" aria-label="Contact">
          <div className="container grid grid-2">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="section-title" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <h2 className="h-title" style={{ marginBottom: 6 }}>
                  {t.contact.title}
                </h2>
                <p>{t.contact.subtitle}</p>
              </div>
              <div style={{ height: 14 }} />
              <a className="btn btn-secondary" href={WHATSAPP_LINK_ES} target="_blank" rel="noreferrer">
                {t.ctaSecondary}
              </a>
              <div style={{ height: 10 }} />
              <div className="note">{t.footer.email}</div>
            </div>

            <form className="card form" onSubmit={onSubmit}>
              <div style={{ display: 'none' }}>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
                />
              </div>

              <div className="field-grid">
                <div className="form-group">
                  <label htmlFor="name">{t.contact.fields.name}</label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company">{t.contact.fields.company}</label>
                  <input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                    placeholder={lang === 'es' ? 'Nombre de tu empresa' : 'Company name'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="whatsapp">{t.contact.fields.whatsapp}</label>
                  <input
                    id="whatsapp"
                    value={form.whatsapp}
                    onChange={(e) => setForm((s) => ({ ...s, whatsapp: e.target.value }))}
                    placeholder={lang === 'es' ? '+52...' : '+52...'}
                    required
                  />
                </div>
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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

              <div className="form-group" style={{ marginTop: 24 }}>
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
                <span className="note">{t.pricingLine}</span>
              </div>

              {status === 'success' ? <p className="note">{t.contact.success}</p> : null}
              {status === 'error' ? <p className="note">{t.contact.error}</p> : null}
            </form>
          </div>
        </section>

        <footer className="footer" aria-label="Footer">
          <div className="container footer-inner">
            <div className="brand">
              <img src={logo} alt="" className="brand-logo" style={{ width: 30, height: 30 }} />
              <div className="brand-text">
                <span>VANTA</span>
                <small>SOLUTIONS</small>
              </div>
            </div>
            <div className="footer-info">
              <span className="note">{t.footer.location}</span>
              <span className="footer-dot" aria-hidden="true">•</span>
              <span className="note">{t.footer.email}</span>
              <span className="footer-dot" aria-hidden="true">•</span>
              <span className="note">{t.footer.instagram}</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
