import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import WaitlistModal from '../components/WaitlistModal';

const Services = ({ isSpecialEvent = false }: { isSpecialEvent?: boolean }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<'basic' | 'standard' | 'pro'>('basic');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] relative font-sans selection:bg-violet-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-900/20 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wIDAuNXY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] mask-[linear-gradient(to_bottom,transparent,black,transparent)]"></div>
      </div>

      <div className="pt-32 pb-24 relative z-10 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 mb-24">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-xl animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3B82F6] animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-violet-300 uppercase tracking-[0.2em]">{t('crm_promo.badge')}</span>
          </div>
          
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black leading-tight uppercase tracking-tighter bg-linear-to-br from-white via-violet-400 to-violet-600 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {t('crm_promo.title')}
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-gray-300 font-light max-w-4xl mx-auto italic tracking-wide animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {t('crm_promo.subtitle')}
          </h2>
          
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {t('crm_promo.description')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <a href="https://wa.me/524494401613?text=Hola%2C%20quiero%20agendar%20una%20demo%20de%20VANTA%20CRM" target="_blank" rel="noopener noreferrer" className="btn-primary-gradient px-8 py-4 rounded-full text-white font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_rgba(139,92,246,0.8)] transition-all transform hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center">
              {t('crm_promo.cta_primary')}
              <span className="material-symbols-outlined text-xl">calendar_month</span>
            </a>

          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 z-20">
          <div className="text-center mb-16">
            <h3 className="text-sm font-mono tracking-[0.3em] text-violet-400 mb-6">{t('crm_promo.plans_title')}</h3>
            
            <div className="inline-block relative mb-8 animate-fade-in-up">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 via-blue-500/20 to-violet-500/20 blur-xl rounded-full"></div>
              <div className="relative px-6 py-3 border border-emerald-500/30 bg-emerald-950/40 rounded-full flex items-center gap-3 backdrop-blur-sm">
                <span className="material-symbols-outlined text-emerald-400 text-xl">redeem</span>
                <span className="text-sm md:text-base font-medium text-emerald-100 cursor-default">
                  {isSpecialEvent ? '¡Oferta única para asistentes al evento! Doblemente rebajado.' : t('crm_promo.discount_banner')}
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse absolute -top-1 -right-1"></span>
              </div>
            </div>

            <div className="w-24 h-1 bg-linear-to-r from-transparent via-violet-500/50 to-transparent mx-auto opacity-50"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {['basic', 'standard', 'pro'].map((plan, i) => {
              const isStandard = plan === 'standard';
              const isPro = plan === 'pro';
              
              const highlights = [
                { border: 'border-white/10 hover:border-white/20', bg: 'bg-white/2 bg-gradient-to-br from-white/5 to-transparent', btn: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white' },
                { border: 'border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/30 lg:scale-105 z-10', bg: 'bg-[#0b0514] bg-gradient-to-br from-violet-900/20 to-black', btn: 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] font-black' },
                { border: 'border-white/10 hover:border-amber-500/30', bg: 'bg-white/2 bg-gradient-to-br from-amber-900/5 to-transparent', btn: 'bg-white/5 hover:bg-amber-500/20 border border-white/10 text-white' }
              ];
              
              const style = highlights[i];
              const featuresList = t(`crm_promo.plans.${plan}.features`, { returnObjects: true }) as string[];
              const missList = t(`crm_promo.plans.${plan}.miss`, { returnObjects: true, defaultValue: [] }) as string[];
              const includesText = t(`crm_promo.plans.${plan}.includes`, { defaultValue: '' }) as string;
              const planTitle = t(`crm_promo.plans.${plan}.title`);
              const originalPrice = t(`crm_promo.plans.${plan}.original_price`, { defaultValue: '' }) as string;
              
              const displayPrice = isSpecialEvent 
                ? (plan === 'basic' ? '99' : plan === 'standard' ? '299' : '999')
                : t(`crm_promo.plans.${plan}.price`);

              return (
                <div key={plan} className={`relative rounded-3xl border ${style.border} ${style.bg} p-8 flex flex-col transition-all duration-300 group`}>
                  {isStandard && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full z-20 shadow-lg shadow-violet-500/20">
                      {isSpecialEvent ? 'MÁS POPULAR' : t(`crm_promo.plans.${plan}.price_note`)}
                    </div>
                  )}
                  
                  <div className="mb-8 text-center">
                    <h4 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-widest">{planTitle}</h4>
                    <div className="flex items-baseline justify-center gap-1 mb-4 flex-wrap">
                      {originalPrice && (
                        <span className={`text-xl font-medium line-through mr-1 ${isSpecialEvent ? 'text-gray-600/50' : 'text-gray-500/70 mr-2'}`}>
                          {originalPrice}
                        </span>
                      )}
                      {isSpecialEvent && (
                        <span className="text-xl text-emerald-500/70 font-medium line-through mr-2">
                          {t(`crm_promo.plans.${plan}.price`)}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-white">{displayPrice}</span>
                      <span className="text-sm text-gray-500">{t(`crm_promo.plans.${plan}.price_suffix`)}</span>
                    </div>
                    <p className="text-sm text-gray-400 font-light max-w-xs mx-auto leading-relaxed px-2">
                      {t(`crm_promo.plans.${plan}.description`)}
                    </p>
                  </div>

                  <div className="w-full h-px bg-white/5 mb-6"></div>

                  <div className="flex-1 mb-8">
                    {includesText && (
                      <p className="text-xs font-bold text-gray-300 mb-5">{includesText}</p>
                    )}
                    <ul className="space-y-4">
                      {featuresList.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className={`material-symbols-outlined ${isStandard ? 'text-violet-400' : isPro ? 'text-amber-400' : 'text-blue-400'} text-lg shrink-0`}>check_circle</span>
                          <span className={`text-sm ${isStandard ? 'text-gray-200' : 'text-gray-300'} font-light leading-snug`}>{feature}</span>
                        </li>
                      ))}
                      
                      {missList.length > 0 && missList.map((miss, j) => (
                        <li key={`miss-${j}`} className="flex items-start gap-3 opacity-40 group-hover:opacity-80 transition-opacity">
                          <span className="material-symbols-outlined text-gray-500 text-lg shrink-0">cancel</span>
                          <span className="text-sm text-gray-500 font-light leading-snug line-through">{miss}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                     onClick={() => {
                        setSelectedPlan(planTitle);
                        setSelectedPlanId(plan as 'basic' | 'standard' | 'pro');
                        setIsModalOpen(true);
                     }} 
                     className={`w-full py-4 rounded-xl font-bold tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-2 ${style.btn}`}>
                    {t(`crm_promo.plans.${plan}.cta`)}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* HIGH-END MOCKUP VISUALIZATION */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 z-20">
          <div className="relative rounded-2xl md:rounded-3xl border border-white/10 bg-black/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(139,92,246,0.15)] overflow-hidden transform hover:-translate-y-2 transition-transform duration-700">
            
            {/* Window Controls Base */}
            <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="ml-4 px-4 py-1 rounded bg-black/50 border border-white/5 text-[10px] text-gray-500 font-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                app.vantacrm.com
              </div>
            </div>

            {/* App Layout */}
            <div className="flex flex-col md:flex-row h-[500px] md:h-[600px]">
              {/* Sidebar Mini */}
              <div className="hidden md:flex flex-col w-20 border-r border-white/5 bg-black/40 items-center py-6 gap-8">
                <div className="w-10 h-10 rounded bg-linear-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="material-symbols-outlined text-white">blur_on</span>
                </div>
                <div className="flex flex-col gap-6 text-gray-500">
                  <span onClick={() => setActiveTab('dashboard')} className={`material-symbols-outlined cursor-pointer transition-all duration-300 ${activeTab === 'dashboard' ? 'text-violet-400 scale-110' : 'hover:text-white'}`}>grid_view</span>
                  <span onClick={() => setActiveTab('leads')} className={`material-symbols-outlined cursor-pointer transition-all duration-300 ${activeTab === 'leads' ? 'text-violet-400 scale-110' : 'hover:text-white'}`}>group</span>
                  <span onClick={() => setActiveTab('insights')} className={`material-symbols-outlined cursor-pointer transition-all duration-300 ${activeTab === 'insights' ? 'text-violet-400 scale-110' : 'hover:text-white'}`}>insights</span>
                  <span onClick={() => setActiveTab('campaign')} className={`material-symbols-outlined cursor-pointer transition-all duration-300 ${activeTab === 'campaign' ? 'text-violet-400 scale-110' : 'hover:text-white'}`}>extension</span>
                </div>
              </div>

              {/* Main Workspace */}
              <div className="flex-1 flex flex-col p-6 md:p-10 gap-8 overflow-hidden relative">
                
                {/* View: Dashboard */}
                {activeTab === 'dashboard' && (
                  <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{t('crm_promo.dashboard.welcome')}</h3>
                        <p className="text-sm text-gray-400">Total pipeline: $1.24M USD</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4">
                        <div className="flex -space-x-3">
                          {[1,2,3].map(user => (
                            <div key={user} className="w-8 h-8 rounded-full border-2 border-[#111] bg-gray-700"></div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-[#111] bg-violet-600 flex items-center justify-center text-xs text-white pb-0.5">+3</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: t('crm_promo.dashboard.kpi1'), value: '68%',  trend: '+12%', color: 'text-emerald-400' },
                        { label: t('crm_promo.dashboard.kpi2'), value: '142',  trend: '+24', color: 'text-violet-400' },
                        { label: t('crm_promo.dashboard.kpi3'), value: '$840k', trend: '+15%', color: 'text-blue-400' },
                        { label: 'Time to Close', value: '14d', trend: '-2d', color: 'text-emerald-400' }
                      ].map((kpi, i) => (
                        <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/5 transition-colors">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{kpi.label}</span>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-2xl font-display font-medium text-white">{kpi.value}</span>
                            <span className={`text-[10px] font-bold ${kpi.color}`}>{kpi.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 flex gap-4 overflow-x-auto pb-4 hide-scrollbar mask-edges">
                      {[
                        { name: t('crm_promo.dashboard.stage1'), count: 24, border: 'border-blue-500/30' },
                        { name: t('crm_promo.dashboard.stage2'), count: 12, border: 'border-amber-500/30' },
                        { name: t('crm_promo.dashboard.stage3'), count: 8, border: 'border-emerald-500/30' }
                      ].map((col, i) => (
                        <div key={i} className={`min-w-[280px] rounded-xl bg-white/2 border-t-2 ${col.border} flex flex-col gap-4 p-4`}>
                          <div className="flex justify-between items-center px-1">
                            <span className="text-sm font-bold text-gray-300">{col.name}</span>
                            <span className="text-xs py-1 px-2 rounded-full bg-white/5 text-gray-400">{col.count}</span>
                          </div>
                          <div className="bg-[#111] border border-white/5 rounded-lg p-4 cursor-grab hover:border-violet-500/50 transition-all hover:scale-[1.02]">
                            <div className="text-[10px] text-gray-600 mb-2 font-mono tracking-wider">REF. #VNT-102{i}</div>
                            <div className="text-sm font-bold text-white mb-4">{t('crm_promo.dashboard.deal')} {i === 0 ? 'Enterprise' : i === 1 ? 'Startup' : 'Corporate'}</div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] py-1 px-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-widest">High Probability</span>
                              <div className="w-6 h-6 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 shrink-0 shadow-lg shadow-violet-500/20"></div>
                            </div>
                          </div>
                          <div className="bg-[#111]/60 border border-white/5 rounded-lg p-4 opacity-40">
                            <div className="w-1/3 h-2 bg-white/10 rounded mb-4"></div>
                            <div className="w-2/3 h-3 bg-white/20 rounded mb-4"></div>
                            <div className="flex justify-between items-center mt-2">
                               <div className="w-1/4 h-3 bg-white/5 rounded"></div>
                               <div className="w-5 h-5 rounded-full bg-white/5 shrink-0"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View: Leads */}
                {activeTab === 'leads' && (
                  <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-white">Gestión de Leads</h3>
                      <button className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2 px-6 rounded-lg transition-all">+ Nuevo Lead</button>
                    </div>
                    <div className="bg-white/2 border border-white/5 rounded-2xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-4">Nombre / Empresa</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Prioridad</th>
                            <th className="px-6 py-4">Último Contacto</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {[
                            { name: 'Ricardo Mendez', co: 'TechFlow Solutions', status: 'Nuevo', prio: 'Alta', date: 'Hace 2 horas', color: 'bg-blue-500' },
                            { name: 'Ana Garcia', co: 'Vanta Corp', status: 'En Proceso', prio: 'Media', date: 'Hace 5 horas', color: 'bg-amber-500' },
                            { name: 'Jaime Escalera', co: 'Escalera SC', status: 'Calificado', prio: 'Alta', date: 'Ayer', color: 'bg-violet-500' },
                            { name: 'Laura Solis', co: 'Nexus Web', status: 'Esperando', prio: 'Baja', date: 'Hace 2 días', color: 'bg-gray-500' }
                          ].map((lead, i) => (
                            <tr key={i} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                              <td className="px-6 py-6">
                                <div className="font-bold text-white">{lead.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{lead.co}</div>
                              </td>
                              <td className="px-6 py-6 text-xs font-medium text-gray-300">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${lead.color}`}></div>
                                  {lead.status}
                                </div>
                              </td>
                              <td className="px-6 py-6">
                                <span className={`text-[10px] font-bold py-1 px-3 rounded-full ${lead.prio === 'Alta' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-gray-400'}`}>
                                  {lead.prio}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-xs text-gray-500">{lead.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* View: Analytics */}
                {activeTab === 'insights' && (
                  <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-700 h-full overflow-hidden">
                    <div className="flex justify-between items-center shrink-0">
                      <h3 className="text-xl font-bold text-white tracking-tight">Reportes y Estadísticas</h3>
                      <div className="flex bg-white/5 p-1 rounded-lg">
                        <button className="px-3 py-1 text-[10px] font-bold text-white bg-violet-600 rounded-md">MES</button>
                        <button className="px-3 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-300">AÑO</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 shrink-0">
                      {[
                        { label: 'Revenue Bruto', val: '$1.2M', trend: '+15.4%', up: true },
                        { label: 'Eficiencia Op.', val: '94.2%', trend: '+2.1%', up: true },
                        { label: 'Costo Adquisición', val: '$14.2', trend: '-8.5%', up: true }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-4">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.label}</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-bold text-white">{item.val}</span>
                            <span className={`text-[8px] font-bold ${item.trend.startsWith('+') ? 'text-emerald-400' : 'text-blue-400'}`}>{item.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                      {/* Main Chart Card */}
                      <div className="lg:col-span-2 bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden h-full">
                        <div className="flex justify-between items-start mb-4 shrink-0">
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Flujo de Ingresos</h4>
                            <p className="text-[10px] text-gray-600 mt-1">Comparativa de ingresos mensuales proyectados vs reales.</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                              <span className="text-[9px] text-gray-400 font-medium">REAL</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                              <span className="text-[9px] text-gray-400 font-medium">OBJETIVO</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 relative mt-4">
                          {/* Y-Axis labels */}
                          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[8px] text-gray-700 font-mono">
                            <span>100K</span><span>75K</span><span>50K</span><span>25K</span><span>0</span>
                          </div>
                          
                          {/* Main Chart Area */}
                          <div className="absolute inset-x-8 top-0 bottom-8">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                              {[1,2,3,4].map(l => <div key={l} className="w-full h-px bg-white/5 select-none"></div>)}
                            </div>
                            
                            {/* Simulated Line Chart with SVG */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartGradient" x1="0" y2="1">
                                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path 
                                d="M0,80 Q25,40 50,60 T100,20 T150,55 T200,10 T250,45 T300,30 L300,100 L0,100 Z" 
                                fill="url(#chartGradient)" 
                                className="transition-all duration-1000"
                              />
                              <path 
                                d="M0,80 Q25,40 50,60 T100,20 T150,55 T200,10 T250,45 T300,30" 
                                fill="none" 
                                stroke="#8b5cf6" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                              />
                            </svg>
                          </div>
                          
                          {/* X-Axis Labels */}
                          <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[8px] text-gray-700 font-mono">
                            <span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span><span>DOM</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary Stats Card */}
                      <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col h-full shrink-0 lg:shrink">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Performance</h4>
                        <div className="space-y-5 flex-1 overflow-auto hide-scrollbar">
                          {[
                            { label: 'Velocidad de Cierre', val: '4.2 días', color: 'text-violet-400' },
                            { label: 'Valor Promedio Deal', val: '$12,400', color: 'text-emerald-400' },
                            { label: 'Source: LinkedIn', val: '42.5%', color: 'text-blue-400' },
                            { label: 'Source: Referidos', val: '28.1%', color: 'text-indigo-400' }
                          ].map((stat, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-white/2">
                              <div>
                                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
                                <div className={`text-sm font-bold mt-0.5 ${stat.color}`}>{stat.val}</div>
                              </div>
                              <div className="w-12 h-6 bg-white/2 rounded p-1 flex items-end gap-1">
                                {[3,6,4,8,5].map((h, i) => <div key={i} className="flex-1 bg-white/10 rounded-t" style={{height: `${h*10}%`}}></div>)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-bold text-gray-400 transition-colors uppercase tracking-[0.2em]">DESCARGAR PDF</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* View: Implementation Modules */}
                {activeTab === 'campaign' && (
                  <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <h3 className="text-2xl font-bold text-white">Módulos de Implementación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: 'Workflows de Ventas', desc: 'Automatización de procesos operativos y flujos de trabajo personalizados.', type: 'Eficiencia', status: '85%', icon: 'account_tree', color: 'text-violet-400' },
                        { title: 'Integraciones API', desc: 'Conexión robusta con servicios externos y bases de datos unificadas.', type: 'Latencia', status: '< 200ms', icon: 'api', color: 'text-blue-400' },
                        { title: 'Seguridad y Accesos', desc: 'Control granular de permisos y protocolos de seguridad avanzada.', type: 'Disponibilidad', status: '99.9%', icon: 'admin_panel_settings', color: 'text-emerald-400' }
                      ].map((mod, i) => (
                        <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all group">
                          <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <span className={`material-symbols-outlined ${mod.color}`}>{mod.icon}</span>
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">{mod.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed mb-6">{mod.desc}</p>
                          <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{mod.type}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${mod.color}`}>{mod.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ambient Glow from the bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-violet-600/20 blur-[80px] pointer-events-none"></div>
          </div>
        </section>



        {/* CORE FEATURES GRID */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-violet-900/10 blur-[120px] rounded-[100%]"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-20 relative z-10">
              <h3 className="text-sm font-mono tracking-[0.3em] text-violet-400 mb-4">{t('crm_promo.benefits_title')}</h3>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-white max-w-2xl mx-auto">
                Diseñado para escalar <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400 italic">sin límites</span>.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  key: 'capture', 
                  icon: 'filter_alt', 
                  styles: { glow: 'from-violet-500/30', iconBg: 'from-violet-500/20', iconBorder: 'border-violet-500/30', text: 'text-violet-400' } 
                },
                { 
                  key: 'pipeline', 
                  icon: 'view_kanban', 
                  styles: { glow: 'from-blue-500/30', iconBg: 'from-blue-500/20', iconBorder: 'border-blue-500/30', text: 'text-blue-400' } 
                },
                { 
                  key: 'scoring', 
                  icon: 'query_stats', 
                  styles: { glow: 'from-indigo-500/30', iconBg: 'from-indigo-500/20', iconBorder: 'border-indigo-500/30', text: 'text-indigo-400' } 
                },
                { 
                  key: 'analytics', 
                  icon: 'donut_large', 
                  styles: { glow: 'from-emerald-500/30', iconBg: 'from-emerald-500/20', iconBorder: 'border-emerald-500/30', text: 'text-emerald-400' } 
                }
              ].map((obj) => (
                <div key={obj.key} className="relative group cursor-default h-full">
                  <div className={`absolute -inset-px bg-linear-to-br ${obj.styles.glow} to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px]`}></div>
                  <div className="relative h-full flex flex-col p-8 rounded-3xl border border-white/5 bg-[#0a0a0f] hover:bg-[#0f0f16] group-hover:border-white/20 transition-all duration-500 overflow-hidden transform group-hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                    <div className={`shrink-0 w-16 h-16 mb-8 rounded-2xl bg-linear-to-br ${obj.styles.iconBg} to-black/50 border ${obj.styles.iconBorder} flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                      <span className={`material-symbols-outlined ${obj.styles.text} text-3xl group-hover:scale-110 transition-transform duration-500`}>{obj.icon}</span>
                    </div>
                    <div className="mt-auto">
                      <h4 className="text-xl font-bold text-white mb-3 tracking-wide">{t(`crm_promo.features.${obj.key}.title`)}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-light">
                        {t(`crm_promo.features.${obj.key}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-block p-1 rounded-2xl bg-linear-to-r from-violet-600/30 via-blue-600/30 to-violet-600/30 mb-8 backdrop-blur-md">
            <div className="bg-black/80 px-6 py-2 rounded-xl text-sm font-bold text-gray-300 shadow-xl">
              {t('crm_promo.integrations')} ⚡
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-white mb-6">
            {t('crm_promo.cta_bottom.title')}
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            {t('crm_promo.cta_bottom.subtitle')}
          </p>
          
          <a href="https://wa.me/524494401613?text=Me%20interesa%20transformar%20mis%20ventas%20con%20VANTA%20CRM" target="_blank" rel="noopener noreferrer" className="btn-primary-gradient px-12 py-5 rounded-full text-white font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:shadow-[0_0_60px_rgba(139,92,246,0.8)] transition-all transform hover:scale-105 inline-flex items-center gap-3">
             {t('crm_promo.cta_bottom.button')}
             <span className="material-symbols-outlined font-light">rocket_launch</span>
          </a>
          
          <div className="mt-20">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white uppercase text-xs font-mono tracking-widest border-b border-white/10 hover:border-white pb-1 transition-all">
              {t('crm_promo.cta_bottom.back')}
            </Link>
          </div>
        </section>

      </div>
      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planName={selectedPlan} 
        planId={selectedPlanId} 
        endpointUrl={isSpecialEvent ? 'https://waiting-lists-production.up.railway.app/api/v1/waiting-list/exclusive' : undefined}
      />
    </div>
  );
};

export default Services;
