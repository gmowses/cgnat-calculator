import { useState, useEffect } from 'react'
import { Sun, Moon, Languages, Server, Info } from 'lucide-react'

const translations = {
  en: {
    title: 'CGNAT Dimensioning Calculator',
    subtitle: 'Calculate public IPs, port blocks, and subscriber ratios for CGNAT deployments. RFC 6888 & 7857.',
    config: 'Parameters',
    configDesc: 'Set your CGNAT dimensioning inputs',
    subscribers: 'Total subscribers',
    portsPerSub: 'Ports per subscriber',
    portRangeStart: 'Port range start',
    portRangeEnd: 'Port range end',
    mode: 'Mapping mode',
    eim: 'EIM - Endpoint Independent Mapping',
    eif: 'EIF - Endpoint Independent Filtering',
    adf: 'ADF - Address Dependent Filtering',
    results: 'Results',
    resultsDesc: 'CGNAT dimensioning output',
    usablePorts: 'Usable ports per public IP',
    subsPerIp: 'Subscribers per public IP',
    publicIpsNeeded: 'Public IPs needed',
    totalPortBlocks: 'Total port blocks',
    portBlockSize: 'Port block size',
    reservedPorts: 'Reserved (0-1023)',
    utilizationRate: 'Port utilization rate',
    recommendation: 'RFC 6888 recommends at least 1000 ports per subscriber for most applications.',
    warning: 'Warning: ports per subscriber below RFC 6888 minimum of 1000.',
    note100_64: 'Use 100.64.0.0/10 (RFC 6598) for private subscriber addresses in CGNAT.',
    rfcNote: 'RFC 6888 (CGNAT requirements), RFC 7857 (CGNAT updates), RFC 6598 (shared address space)',
    builtBy: 'Built by',
    ports: 'ports',
    ips: 'IPs',
  },
  pt: {
    title: 'Calculadora de Dimensionamento CGNAT',
    subtitle: 'Calcule IPs publicos, blocos de portas e ratios de assinantes para CGNAT. RFC 6888 & 7857.',
    config: 'Parametros',
    configDesc: 'Defina os parametros de dimensionamento CGNAT',
    subscribers: 'Total de assinantes',
    portsPerSub: 'Portas por assinante',
    portRangeStart: 'Inicio do range de portas',
    portRangeEnd: 'Fim do range de portas',
    mode: 'Modo de mapeamento',
    eim: 'EIM - Mapeamento Independente de Endpoint',
    eif: 'EIF - Filtragem Independente de Endpoint',
    adf: 'ADF - Filtragem Dependente de Endereco',
    results: 'Resultados',
    resultsDesc: 'Saida do dimensionamento CGNAT',
    usablePorts: 'Portas utilizaveis por IP publico',
    subsPerIp: 'Assinantes por IP publico',
    publicIpsNeeded: 'IPs publicos necessarios',
    totalPortBlocks: 'Total de blocos de portas',
    portBlockSize: 'Tamanho do bloco de portas',
    reservedPorts: 'Reservadas (0-1023)',
    utilizationRate: 'Taxa de utilizacao de portas',
    recommendation: 'RFC 6888 recomenda pelo menos 1000 portas por assinante para a maioria das aplicacoes.',
    warning: 'Atencao: portas por assinante abaixo do minimo de 1000 recomendado pela RFC 6888.',
    note100_64: 'Use 100.64.0.0/10 (RFC 6598) para enderecos privados de assinantes no CGNAT.',
    rfcNote: 'RFC 6888 (requisitos CGNAT), RFC 7857 (atualizacoes CGNAT), RFC 6598 (espaco de enderecos compartilhado)',
    builtBy: 'Criado por',
    ports: 'portas',
    ips: 'IPs',
  },
} as const

type Lang = keyof typeof translations
type MappingMode = 'eim' | 'eif' | 'adf'

export default function CGNATCalculator() {
  const [lang, setLang] = useState<Lang>(() => (navigator.language.startsWith('pt') ? 'pt' : 'en'))
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [subscribers, setSubscribers] = useState(10000)
  const [portsPerSub, setPortsPerSub] = useState(1024)
  const [portStart, setPortStart] = useState(1024)
  const [portEnd, setPortEnd] = useState(65535)
  const [mappingMode, setMappingMode] = useState<MappingMode>('eim')

  const t = translations[lang]

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const usablePorts = portEnd - portStart + 1
  const subsPerIp = Math.floor(usablePorts / portsPerSub)
  const publicIpsNeeded = Math.ceil(subscribers / subsPerIp)
  const totalPortBlocks = publicIpsNeeded * Math.floor(usablePorts / portsPerSub)
  const utilizationRate = ((subscribers * portsPerSub) / (publicIpsNeeded * usablePorts) * 100).toFixed(1)
  const belowRfc = portsPerSub < 1000

  const modes: { key: MappingMode; label: string; desc: string }[] = [
    { key: 'eim', label: t.eim, desc: 'Same external mapping for same internal address/port' },
    { key: 'eif', label: t.eif, desc: 'Allows inbound sessions from any external endpoint' },
    { key: 'adf', label: t.adf, desc: 'Restricts inbound by external address, best security' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Server size={18} className="text-white" />
            </div>
            <span className="font-semibold">CGNAT Calculator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/cgnat-calculator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Config */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
              <div>
                <h2 className="font-semibold">{t.config}</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.configDesc}</p>
              </div>

              {[
                { label: t.subscribers, value: subscribers, set: setSubscribers, min: 100, max: 1000000, step: 100 },
                { label: t.portsPerSub, value: portsPerSub, set: setPortsPerSub, min: 64, max: 4096, step: 64 },
                { label: t.portRangeStart, value: portStart, set: setPortStart, min: 1024, max: 10000, step: 1 },
                { label: t.portRangeEnd, value: portEnd, set: setPortEnd, min: 32768, max: 65535, step: 1 },
              ].map(({ label, value, set, min, max, step }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{label}</label>
                    <span className="text-sm font-bold text-red-500 tabular-nums">{value.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={e => set(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>{min.toLocaleString()}</span>
                    <span>{max.toLocaleString()}</span>
                  </div>
                </div>
              ))}

              {belowRfc && (
                <div className="rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-300 flex gap-2">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  {t.warning}
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium">{t.mode}</p>
                {modes.map(m => (
                  <label key={m.key} className="flex items-start gap-3 cursor-pointer p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <input type="radio" name="mapping" value={m.key} checked={mappingMode === m.key} onChange={() => setMappingMode(m.key)} className="accent-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
              <div>
                <h2 className="font-semibold">{t.results}</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.resultsDesc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t.usablePorts, value: usablePorts.toLocaleString() },
                  { label: t.reservedPorts, value: '1024' },
                  { label: t.subsPerIp, value: subsPerIp.toLocaleString(), accent: true },
                  { label: t.publicIpsNeeded, value: publicIpsNeeded.toLocaleString(), accent: true },
                  { label: t.portBlockSize, value: `${portsPerSub} ${t.ports}` },
                  { label: t.totalPortBlocks, value: totalPortBlocks.toLocaleString() },
                  { label: t.utilizationRate, value: `${utilizationRate}%`, accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-zinc-400 mb-0.5">{label}</p>
                    <p className={`text-sm font-bold tabular-nums ${accent ? 'text-red-500' : ''}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Visual ratio bar */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500">Subscribers : Public IPs ratio</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subsPerIp / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-red-500 tabular-nums w-20 text-right">{subsPerIp}:1</span>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 px-4 py-3">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{t.recommendation}</p>
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-4 py-3">
                <p className="text-xs text-blue-700 dark:text-blue-300">{t.note100_64}</p>
              </div>

              <p className="text-[10px] text-zinc-400">{t.rfcNote}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-red-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
