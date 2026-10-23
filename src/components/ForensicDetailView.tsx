import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Globe,
  HeartPulse,
  MessageSquareWarning,
  Scale,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  EvaluatedCompanyResult,
  FilterGroupCode,
  OverallOutcome,
} from '../types/forensic';
import {
  CORE_20_METADATA,
  generateActionableTakeaways,
  GROUP_DESCRIPTIONS,
  isCore20Filter,
} from '../utils/forensicEngine';

interface ForensicDetailViewProps {
  evaluated: EvaluatedCompanyResult;
  onDownloadJson: (evaluated: EvaluatedCompanyResult) => void;
  onChangeWeight: (no: number, weight: number) => void;
}

const OUTCOME_LABELS: Record<
  OverallOutcome,
  { title: string; subtitle: string; colorClass: string; borderClass: string }
> = {
  dikkat_gerektiriyor: {
    title: 'DİKKAT GEREKTİRİYOR (Seçili Filtrelerde Çoklu / Kritik Bayrak)',
    subtitle:
      'Seçtiğiniz filtreler arasında en az bir doğrudan kritik bulgu veya ≥2 bağımsız modülde eşzamanlı risk sinyali tespit edildi.',
    colorClass: 'text-rose-300',
    borderClass: 'border-rose-800/80 bg-rose-950/30',
  },
  sinirli_isaret: {
    title: 'SINIRLI İŞARET (Seçili Filtrelerde Tek Modül Bulgusu)',
    subtitle:
      'Seçtiğiniz filtrelerde yalnızca tek bir modülde sinyal mevcut; çoklu alan çakışması oluşmadı.',
    colorClass: 'text-amber-300',
    borderClass: 'border-amber-800/80 bg-amber-950/30',
  },
  yetersiz_veri: {
    title: 'FİLTRE SEÇİLMEDİ (Analiz İçin Sol Panelden Filtre İşaretleyin)',
    subtitle: 'Şu anda aktif filtre seçilmedi (Ağırlık = 0). Sol panelden veya tablodan istediğiniz filtreleri seçtiğinizde analiz anında hesaplanır.',
    colorClass: 'text-slate-300',
    borderClass: 'border-slate-700 bg-slate-900',
  },
  belirgin_isaret_yok: {
    title: 'BELİRGİN İŞARET YOK (Seçili Filtrelerde Temiz / İstikrarlı Görünüm)',
    subtitle: 'Seçtiğiniz adli finans, sığ tahta ve yönetişim filtrelerinde risk eşiği aşılmadı.',
    colorClass: 'text-emerald-300',
    borderClass: 'border-emerald-800/80 bg-emerald-950/25',
  },
};

export const ForensicDetailView: React.FC<ForensicDetailViewProps> = ({
  evaluated,
  onDownloadJson,
  onChangeWeight,
}) => {
  const {
    company,
    evaluatedFilters,
    outcome,
    relatedPartyClassification,
    triggeredCoreCount,
    triggeredExtraCount,
    totalTriggeredCount,
    totalActiveWeight,
    triggeredWeightedSum,
    weightedRiskScore100,
  } = evaluated;

  const outcomeMeta = OUTCOME_LABELS[outcome];
  const latestRatio =
    company.financialRatioHistory[company.financialRatioHistory.length - 1];
  const health = company.balanceSheetHealth;
  const takeaways = generateActionableTakeaways(company, evaluated);

  const [tableSlice, setTableSlice] = useState<
    'all60' | 'selected_only' | 'core30' | 'extra30' | 'triggered'
  >('all60');
  const [groupFilter, setGroupFilter] = useState<FilterGroupCode | 'all'>('all');

  const selectedFilterCount = evaluatedFilters.filter((ef) => ef.weight > 0).length;

  const visibleFilterRows = evaluatedFilters.filter((ef) => {
    const matchSlice =
      tableSlice === 'all60'
        ? true
        : tableSlice === 'selected_only'
        ? ef.weight > 0
        : tableSlice === 'core30'
        ? !ef.filter.isExtraFlag
        : tableSlice === 'extra30'
        ? ef.filter.isExtraFlag
        : ef.triggered;

    const matchGroup = groupFilter === 'all' || ef.filter.groupCode === groupFilter;
    return matchSlice && matchGroup;
  });

  return (
    <div className="space-y-6">
      {/* Executive Header & Decision Summary */}
      <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="font-semibold text-teal-300">{company.symbol}.IS</span>
              <span aria-hidden="true">·</span>
              <span>{company.sector}</span>
              <span aria-hidden="true">·</span>
              <span>KAP Bilanço Dönemi: {company.periodEnd}</span>
              <span aria-hidden="true">·</span>
              <span>Gözlem: {company.asOfDate}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1 tracking-tight">
              {company.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{company.caseSummaryTag}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="text-right font-mono tabular-nums px-3 py-2 rounded-md bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Son Fiyat / Günlük</div>
              <div className="text-sm font-semibold text-slate-100">
                {company.lastPriceTL.toFixed(2)} TL{' '}
                <span
                  className={
                    company.priceChange1dPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }
                >
                  ({company.priceChange1dPct >= 0 ? '+' : ''}
                  {company.priceChange1dPct.toFixed(2)}%)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDownloadJson(evaluated)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              analysis.json İndir
            </button>
          </div>
        </div>

        {/* Outcome Decision Box */}
        <div className={`mt-4 p-4 rounded-md border space-y-3 ${outcomeMeta.borderClass}`}>
          <div>
            <div className={`text-sm font-bold tracking-tight ${outcomeMeta.colorClass}`}>
              {outcomeMeta.title}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {outcomeMeta.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono tabular-nums text-xs">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">60-Filtre Risk Skoru</span>
                <span className="text-base font-bold text-slate-100">
                  {weightedRiskScore100} / 100
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Bilanço Sağlık Skoru</span>
                <span
                  className={`text-base font-bold ${
                    health.overallHealthScore100 < 50
                      ? 'text-rose-400'
                      : health.overallHealthScore100 < 75
                      ? 'text-amber-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {health.overallHealthScore100} / 100
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Medya Skoru (Sentimentil)</span>
                <span
                  className={`text-base font-bold ${
                    company.sentimentSynthesis.combinedMarketSentimentScore < 40
                      ? 'text-rose-400'
                      : company.sentimentSynthesis.combinedMarketSentimentScore < 70
                      ? 'text-amber-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {company.sentimentSynthesis.combinedMarketSentimentScore} / 100
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">1–30 Ana / 31–60 Ek</span>
                <span className="text-base font-bold text-teal-300">
                  {triggeredCoreCount} + {triggeredExtraCount}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Ağırlık Puanı</span>
                <span className="text-base font-bold text-rose-300">
                  {triggeredWeightedSum} / {totalActiveWeight}
                </span>
              </div>
            </div>
        </div>

        {/* Automated "Bundan Ne Çıkarmalıyım?" 4-Pillar Synthesis + Live Selected Filters Commentary */}
        <div className="mt-4 p-4 rounded-md bg-slate-900/95 border border-teal-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 bg-teal-950/70 border border-teal-800/60 px-2 py-0.5 rounded">
                Seçtiğiniz Filtrelere Göre Canlı Analist Yorumu ({selectedFilterCount}/60 Filtre Seçili)
              </span>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                {takeaways.overallVerdictTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              {takeaways.overallVerdictShort}
            </p>
          </div>

          {/* Dynamic commentary specifically computed from the user's checked filters */}
          <div className="p-3 rounded-md bg-slate-950 border border-teal-500/30">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-teal-300">
                Seçtiğiniz Filtrelerin ({selectedFilterCount} Adet) {company.symbol} Üzerindeki Anlık Sonucu:
              </span>
              <span className="text-[11px] font-mono text-amber-300">
                Tetiklenen Bayrak: {totalTriggeredCount} / {selectedFilterCount}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {takeaways.selectedFilterDynamicCommentary}
            </p>
            {takeaways.selectedTriggeredNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-rose-300 self-center mr-1">
                  Seçiminizde Yakalanan İhlaller:
                </span>
                {takeaways.selectedTriggeredNames.slice(0, 8).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/70 text-rose-200 border border-rose-800/60"
                  >
                    {item}
                  </span>
                ))}
                {takeaways.selectedTriggeredNames.length > 8 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                    +{takeaways.selectedTriggeredNames.length - 8} diğer filtre
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="p-3 rounded bg-slate-950/90 border border-slate-800">
              <div className="text-[11px] font-mono font-bold text-emerald-300 mb-1">
                1. Bilanço Sağlığından Ne Çıkarmalıyım?
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {takeaways.balanceSheetTakeaway}
              </p>
            </div>
            <div className="p-3 rounded bg-slate-950/90 border border-slate-800">
              <div className="text-[11px] font-mono font-bold text-amber-300 mb-1">
                2. TEFAS Fon Akışından Ne Çıkarmalıyım?
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {takeaways.fundFlowTakeaway}
              </p>
            </div>
            <div className="p-3 rounded bg-slate-950/90 border border-slate-800">
              <div className="text-[11px] font-mono font-bold text-teal-300 mb-1">
                3. Gelecek Bilançodan Ne Çıkarmalıyım?
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {takeaways.forwardBalanceSheetTakeaway}
              </p>
            </div>
            <div className="p-3 rounded bg-slate-950/90 border border-slate-800">
              <div className="text-[11px] font-mono font-bold text-rose-300 mb-1">
                4. Medya Skorundan Ne Çıkarmalıyım?
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {takeaways.sentimentMediaTakeaway}
              </p>
            </div>
          </div>
        </div>

        {/* Why It Exploded & How Whales Operated */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              01. Neden ve Nasıl Patladı? (Sığ Tahta & Fiyat Mekanizması)
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {company.whyItExploded}
            </p>
          </div>

          <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              02. Balinalar, Serbest Fonlar ve Aracı Kurumlar Giriş-Çıkışı Nasıl Yönetti?
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {company.howWhalesOperated}
            </p>
          </div>
        </div>
      </section>

      {/* MODULE A: Bilanço Sağlık Durumu & "İyi Şirket Gelecek Bilançosunu Fiyatlar" + KAP Tablo Kalemleri */}
      <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              Bilanço Sağlık Durumu & Temel İlke: “İyi Bir Şirket İçin Anlamlı Olan Bilançodur; İyi Şirket Gelecek Bilançosunu Fiyatlar”
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              KAP finansal raporlarından çekilen gerçek tablo kalemleri, Altman Z / Piotroski F / Beneish M sağlık testleri ve mevcut fiyatın ima ettiği gelecek bilanço beklentisi analizi.
            </p>
          </div>
          <div className="font-mono tabular-nums text-xs shrink-0">
            <span className="text-slate-400">Sağlık Teşhisi: </span>
            <strong
              className={
                health.overallHealthScore100 < 50
                  ? 'text-rose-400'
                  : health.overallHealthScore100 < 75
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }
            >
              {health.healthVerdictLabel} ({health.overallHealthScore100}/100)
            </strong>
          </div>
        </div>

        {/* Advisor Principle Box & Forward Pricing Gap */}
        <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 font-mono tabular-nums text-xs">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-sans text-slate-400 block">Bilanço Sağlık Skoru</span>
              <span
                className={`text-sm font-bold ${
                  health.overallHealthScore100 < 50
                    ? 'text-rose-400'
                    : health.overallHealthScore100 < 75
                    ? 'text-amber-300'
                    : 'text-emerald-400'
                }`}
              >
                {health.overallHealthScore100} / 100
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-sans text-slate-400 block">Piotroski F-Skoru (#20)</span>
              <span className="text-sm font-bold text-slate-100">
                {health.piotroskiFScore} / 9
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-sans text-slate-400 block">Altman Z-Skoru</span>
              <span className="text-sm font-bold text-slate-100">
                {health.altmanZScore.toFixed(2)}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-sans text-slate-400 block">Beneish M-Skoru (#21)</span>
              <span
                className={`text-sm font-bold ${
                  health.beneishMScore > -1.78 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {health.beneishMScore.toFixed(2)}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-sans text-slate-400 block">Fiyatlanan Büyüme</span>
              <span className="text-sm font-bold text-amber-300">
                +%{health.currentPriceImpliedGrowthPct.toFixed(1)}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-sans text-slate-400 block">Bilanço Destekli Büyüme</span>
              <span className="text-sm font-bold text-teal-300">
                +%{health.fundamentalsSupportedGrowthPct.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {health.advisorPrincipleCommentary}
          </p>
        </div>

        {/* KAP Extracted Balance Sheet & Cash Flow Facts Table */}
        <div className="overflow-x-auto">
          <div className="text-xs font-semibold text-slate-200 mb-2">
            KAP Finansal Tablolardan ve Dipnotlardan Çekilen Kritik Bilanço & Nakit Kalemleri
          </div>
          <table className="w-full text-xs border-collapse font-mono tabular-nums">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-sans">
                <th className="py-2 pr-2 text-left">KAP Finansal Tablo Kalemi</th>
                <th className="py-2 px-2 text-right">Son Dönem</th>
                <th className="py-2 px-2 text-right">Önceki Dönem</th>
                <th className="py-2 px-2 text-right">Reel Değişim / Yorum</th>
                <th className="py-2 px-2 text-left">KAP Kaynak & Dipnot İzi</th>
                <th className="py-2 pl-2 text-center">Sağlık Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {health.kapExtractedFacts.map((fact, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="py-2.5 pr-2 font-sans font-semibold text-slate-100">
                    {fact.conceptLabel}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-100 font-semibold">
                    {fact.currentPeriodTL}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {fact.previousPeriodTL}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    {fact.realChangePct}
                  </td>
                  <td className="py-2.5 px-2 font-sans text-[11px] text-slate-400">
                    {fact.kapFootnoteRef}
                  </td>
                  <td className="py-2.5 pl-2 text-center font-sans text-[11px] font-semibold">
                    {fact.healthStatus === 'healthy' ? (
                      <span className="text-emerald-400">Sağlıklı</span>
                    ) : fact.healthStatus === 'warning' ? (
                      <span className="text-amber-300">İnceleme Uyarısı</span>
                    ) : (
                      <span className="text-rose-400">Kritik Risk</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADVISOR MODULE B: Web Scraping - Fondaki Hisse Senetleri (TEFAS & KAP Fon Portföy Dağılım Raporları) */}
      <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Web Scraping Modülü 1: Fondaki Hisse Senetleri Analizi (TEFAS & KAP Portföy Dağılım Raporları)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {company.symbol} paylarını portföyünde taşıyan yatırım fonları, serbest fon yoğunlaşmaları (#15, #55, #56, #57) ve aylık fon giriş/çıkış lotları.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-300 shrink-0">
            Taranan Fon Grubu: {company.scrapedFundHoldings.length} Kayıt
          </span>
        </div>

        <div className="p-3 rounded-md bg-slate-900/90 border border-amber-500/30 text-xs text-slate-200 leading-relaxed">
          <strong className="text-amber-300 font-mono">FON AKIŞINDAN NE ÇIKARMALIYIM? </strong>
          {takeaways.fundFlowTakeaway}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse font-mono tabular-nums">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-sans">
                <th className="py-2 pr-2 text-left">Fon Kodu</th>
                <th className="py-2 px-2 text-left">Fon Unvanı & Portföy Şirketi</th>
                <th className="py-2 px-2 text-left">Fon Türü</th>
                <th className="py-2 px-2 text-right">Fon İçi Ağırlık</th>
                <th className="py-2 px-2 text-right">Fiili Dolaşım Payı</th>
                <th className="py-2 px-2 text-right">Aylık Net Lot Akımı</th>
                <th className="py-2 pl-2 text-left">Adli Risk / Sığlık Değerlendirmesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {company.scrapedFundHoldings.map((fh) => (
                <tr key={fh.fundCode} className="hover:bg-slate-900/60">
                  <td className="py-2.5 pr-2 font-bold text-teal-300">{fh.fundCode}</td>
                  <td className="py-2.5 px-2 font-sans">
                    <div className="font-semibold text-slate-100">{fh.fundName}</div>
                    <div className="text-[11px] text-slate-400">{fh.founderInstitution} · {fh.sourceRef}</div>
                  </td>
                  <td className="py-2.5 px-2 font-sans text-slate-300">{fh.fundType}</td>
                  <td className="py-2.5 px-2 text-right font-semibold text-amber-300">
                    %{fh.weightInFundPct.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    %{fh.shareOfFreeFloatPct.toFixed(1)}
                  </td>
                  <td
                    className={`py-2.5 px-2 text-right font-semibold ${
                      fh.monthlyFlowLots < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {fh.monthlyFlowLots > 0 ? '+' : ''}
                    {fh.monthlyFlowLots.toLocaleString('tr-TR')}
                  </td>
                  <td className="py-2.5 pl-2 font-sans text-[11px] text-slate-300">
                    {fh.riskFlagNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADVISOR MODULE C: Web Scraping Duygu Analizi (Sentimentil) & Şirketin Medya Skoru (Güvenilmez Firma vs Sağlam Bilanço) */}
      <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" />
              Web Scraping Modülü 2: “Sentimentil” Duygu Analizi & Şirketin Medya Skoru (İnsanlar Firma Hakkında Ne Düşünüyor?)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              X/Telegram sinyal grupları, yatırımcı forumları, ekonomi basını ve KAP bildirimlerinin doğal dil işleme (NLP) ile taranması ve balina işlemleriyle karşılaştırılması.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono tabular-nums text-xs shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700">
              Şirketin Medya Skoru:{' '}
              <strong
                className={
                  company.sentimentSynthesis.combinedMarketSentimentScore < 40
                    ? 'text-rose-400'
                    : company.sentimentSynthesis.combinedMarketSentimentScore < 70
                    ? 'text-amber-300'
                    : 'text-emerald-400'
                }
              >
                {company.sentimentSynthesis.combinedMarketSentimentScore} / 100
              </strong>
            </span>
          </div>
        </div>

        {/* Scraped Sentiment Channels Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {company.scrapedSentimentChannels.map((ch) => (
            <div
              key={ch.channelName}
              className="p-4 rounded-md bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-teal-300 font-semibold font-sans">{ch.channelName}</span>
                  <span className="text-slate-400 shrink-0">{ch.scrapedPostCount30d.toLocaleString('tr-TR')} İleti</span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 font-mono tabular-nums text-[11px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Pozitif/Negatif</span>
                    <span className="text-emerald-400">%{ch.positiveRatioPct}</span> /{' '}
                    <span className="text-rose-400">%{ch.negativeRatioPct}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Bot/FOMO Riski</span>
                    <span
                      className={
                        ch.manipulationBotOrFomoIndex > 70 ? 'text-rose-400 font-bold' : 'text-slate-200'
                      }
                    >
                      {ch.manipulationBotOrFomoIndex}/100
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Kanal Skoru</span>
                    <span className="text-amber-300 font-bold">{ch.mediaScore100}/100</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  {ch.sampleScrapedQuotes.map((q, i) => (
                    <blockquote
                      key={i}
                      className="p-2 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 italic leading-relaxed"
                    >
                      {q}
                    </blockquote>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-slate-100">Analitik Sonuç: </strong>
                {ch.analyticalVerdict}
              </div>
            </div>
          ))}
        </div>

        {/* Whale Transaction Size Tiers + Broker AKD Flows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div className="overflow-x-auto">
            <div className="text-xs font-semibold text-slate-200 mb-2">
              İşlem Büyüklüğüne Göre Balina Katmanları (Alım / Satım Trendi)
            </div>
            <table className="w-full text-xs border-collapse font-mono tabular-nums">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans">
                  <th className="py-2 pr-2 text-left">Balina / İşlem Büyüklüğü</th>
                  <th className="py-2 px-2 text-right">Alım (Mn)</th>
                  <th className="py-2 px-2 text-right">Satım (Mn)</th>
                  <th className="py-2 px-2 text-right">Net (Mn TL)</th>
                  <th className="py-2 pl-2 text-left">Trend Yönü</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {company.whaleTiers.map((wt) => (
                  <tr key={wt.tierName} className="hover:bg-slate-900/60">
                    <td className="py-2.5 pr-2 font-sans font-medium text-slate-200">
                      {wt.tierName}
                    </td>
                    <td className="py-2.5 px-2 text-right text-emerald-300">
                      {wt.buyVolumeMlnTL.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-rose-300">
                      {wt.sellVolumeMlnTL.toFixed(1)}
                    </td>
                    <td
                      className={`py-2.5 px-2 text-right font-semibold ${
                        wt.netVolumeMlnTL < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {wt.netVolumeMlnTL > 0 ? '+' : ''}
                      {wt.netVolumeMlnTL.toFixed(1)}
                    </td>
                    <td className="py-2.5 pl-2 font-sans text-[11px] text-slate-300">
                      {wt.trendDirection}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <div className="text-xs font-semibold text-slate-200 mb-2">
              Aracı Kurum Dağılımı (AKD) ve Takas Saklama Giriş-Çıkışları (#14, #54)
            </div>
            <table className="w-full text-xs border-collapse font-mono tabular-nums">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans">
                  <th className="py-2 pr-2 text-left">Aracı Kurum</th>
                  <th className="py-2 px-2 text-right">Net Lot</th>
                  <th className="py-2 px-2 text-right">Net TL</th>
                  <th className="py-2 pl-2 text-right">Hacim Payı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {company.brokerFlows.map((b) => (
                  <tr key={b.brokerCode} className="hover:bg-slate-900/60">
                    <td className="py-2.5 pr-2 font-sans font-medium text-slate-200">
                      {b.brokerName}
                    </td>
                    <td
                      className={`py-2.5 px-2 text-right font-semibold ${
                        b.netLots < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {b.netLots > 0 ? '+' : ''}
                      {b.netLots.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-300">
                      {(b.netVolumeTL / 1_000_000).toFixed(1)} Mn
                    </td>
                    <td className="py-2.5 pl-2 text-right font-semibold text-amber-300">
                      %{b.shareOfTotalVolumePct.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MODULE 1: Temel Finansal Oranlar (Cari Oran, D/E, F/K, F/DD), Sektör Karşılaştırması & Makro Korelasyon (TÜFE, Faiz, GSYİH) */}
      <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-400" />
              Temel Finansal Oranlar (Cari Oran, D/E, F/K, F/DD), Sektör Ortalamaları ve Makroekonomik Korelasyon Analizi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Şirket finansal oranlarının zaman içindeki değişimi, sektör medyanıyla kıyaslanması ve TÜFE Enflasyon, TCMB Politika Faizi ve GSYİH Büyümesi ile Pearson korelasyonu (r).
            </p>
          </div>
          {latestRatio && (
            <div className="flex items-center gap-3 font-mono tabular-nums text-xs text-slate-300 shrink-0">
              <span>Cari: <strong className="text-teal-300">{latestRatio.currentRatio.toFixed(2)}</strong></span>
              <span>·</span>
              <span>D/E: <strong className="text-amber-300">{latestRatio.debtToEquity.toFixed(2)}x</strong></span>
              <span>·</span>
              <span>F/K: <strong className="text-slate-100">{latestRatio.peRatio.toFixed(1)}x</strong></span>
              <span>·</span>
              <span>PD/DD: <strong className="text-slate-100">{latestRatio.pbRatio.toFixed(2)}x</strong></span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="overflow-x-auto">
            <div className="text-xs font-semibold text-slate-200 mb-2">
              Dönemsel Finansal Oranlar vs. Sektör Ortalaması & Makro Göstergeler
            </div>
            <table className="w-full text-xs border-collapse font-mono tabular-nums">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans">
                  <th className="py-2 pr-2 text-left">Dönem</th>
                  <th className="py-2 px-2 text-right">Cari (Şirket/Sektör)</th>
                  <th className="py-2 px-2 text-right">Borç/Özk. (D/E)</th>
                  <th className="py-2 px-2 text-right">F/K (Şirket/Sektör)</th>
                  <th className="py-2 px-2 text-right">F/DD (PD/DD)</th>
                  <th className="py-2 pl-2 text-right">TÜFE / Faiz / GSYİH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {company.financialRatioHistory.map((pt) => (
                  <tr key={pt.period} className="hover:bg-slate-900/60">
                    <td className="py-2.5 pr-2 font-semibold text-teal-300">{pt.period}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={pt.currentRatio < pt.sectorCurrentRatio ? 'text-amber-300 font-semibold' : 'text-emerald-300'}>
                        {pt.currentRatio.toFixed(2)}
                      </span>{' '}
                      <span className="text-slate-500">/ {pt.sectorCurrentRatio.toFixed(2)}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={pt.debtToEquity > pt.sectorDebtToEquity * 1.2 ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                        {pt.debtToEquity.toFixed(2)}x
                      </span>{' '}
                      <span className="text-slate-500">/ {pt.sectorDebtToEquity.toFixed(2)}x</span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={pt.peRatio > 50 || pt.peRatio > pt.sectorPeRatio * 2 ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                        {pt.peRatio.toFixed(1)}
                      </span>{' '}
                      <span className="text-slate-500">/ {pt.sectorPeRatio.toFixed(1)}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={pt.pbRatio > pt.sectorPbRatio * 3 ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                        {pt.pbRatio.toFixed(1)}x
                      </span>{' '}
                      <span className="text-slate-500">/ {pt.sectorPbRatio.toFixed(1)}x</span>
                    </td>
                    <td className="py-2.5 pl-2 text-right text-[11px] text-slate-300">
                      %{pt.cpiInflationPct.toFixed(0)} · %{pt.policyInterestRatePct.toFixed(1)} · %{pt.gdpGrowthPct.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200 mb-2">
                Makroekonomik Göstergelerle İstatistiksel Korelasyon Matrisi (Pearson r)
              </div>
              <div className="space-y-2.5">
                {company.macroCorrelations.map((mc) => (
                  <div
                    key={mc.metricName}
                    className="p-3 rounded-md bg-slate-900/90 border border-slate-800"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-100">
                        {mc.metricName}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums">
                        <span>
                          Enflasyon r:{' '}
                          <strong className="text-amber-300">
                            {mc.corrWithInflation > 0 ? '+' : ''}
                            {mc.corrWithInflation.toFixed(2)}
                          </strong>
                        </span>
                        <span>
                          Faiz r:{' '}
                          <strong className="text-rose-300">
                            {mc.corrWithInterestRate > 0 ? '+' : ''}
                            {mc.corrWithInterestRate.toFixed(2)}
                          </strong>
                        </span>
                        <span>
                          GSYİH r:{' '}
                          <strong className="text-teal-300">
                            {mc.corrWithGdpGrowth > 0 ? '+' : ''}
                            {mc.corrWithGdpGrowth.toFixed(2)}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                      {mc.statisticalInterpretation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE 2: KAP Yönetim Kurulu, Denetçi Şefi & Üst Düzey Yönetici Değişim Takibi + Kurumsal Yönetim Puanlama Sistemi */}
      <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              KAP Denetçi Şefi, CFO ve Yönetim Kurulu Değişim Takibi & Kurumsal Yönetim İlkeleri Uyum Puanı
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Denetçi/YK/CFO rotasyonlarının hisse senedi performansı üzerindeki 10 günlük kümülatif anormal getiri (CAR) etkisi ve SPK Kurumsal Yönetim Uyum Derecelendirmesi.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono tabular-nums text-xs shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200">
              Kurumsal Yönetim Uyum Puanı:{' '}
              <strong
                className={
                  company.governanceScorecard.overallScore < 55
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }
              >
                {company.governanceScorecard.overallScore} / 100
              </strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono tabular-nums">
          <div className="p-3 rounded-md bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-sans text-slate-400">Toplam Uyum Puanı</div>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {company.governanceScorecard.overallScore} / 100
            </div>
          </div>
          <div className="p-3 rounded-md bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-sans text-slate-400">YK Bağımsızlığı</div>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {company.governanceScorecard.boardIndependenceScore} / 100
            </div>
          </div>
          <div className="p-3 rounded-md bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-sans text-slate-400">Denetim Komitesi Etkinliği</div>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {company.governanceScorecard.auditCommitteeEffectiveness} / 100
            </div>
          </div>
          <div className="p-3 rounded-md bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-sans text-slate-400">KAP Şeffaflık & Zamanlama</div>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {company.governanceScorecard.kapDisclosureTransparency} / 100
            </div>
          </div>
          <div className="p-3 rounded-md bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-sans text-slate-400">3 Yılda Denetçi Değişimi</div>
            <div className="text-base font-bold text-rose-300 mt-0.5">
              {company.governanceScorecard.auditorChanges3Y} Kez
            </div>
          </div>
          <div className="p-3 rounded-md bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] font-sans text-slate-400">Değişimlerin 10G Fiyat Etkisi</div>
            <div
              className={`text-base font-bold mt-0.5 ${
                company.governanceScorecard.estimatedPriceImpactOfChangesPct < 0
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}
            >
              {company.governanceScorecard.estimatedPriceImpactOfChangesPct > 0 ? '+' : ''}
              {company.governanceScorecard.estimatedPriceImpactOfChangesPct.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-200">
              KAP Yönetici / Denetçi Değişimleri ve Hisse Performansı Etkisi (10G CAR)
            </div>
            {company.governanceEvents.map((ev, idx) => (
              <div
                key={`${ev.date}-${idx}`}
                className="p-3 rounded-md bg-slate-900/90 border border-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                  <span>{ev.date}</span>
                  <span>·</span>
                  <span className="text-slate-300 font-sans font-medium truncate">
                    {ev.actor}
                  </span>
                  <span
                    className={`ml-auto font-mono font-semibold ${
                      ev.priceImpact10dCarPct < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    10G Fiyat Etkisi: {ev.priceImpact10dCarPct > 0 ? '+' : ''}
                    {ev.priceImpact10dCarPct.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-100 mt-1">{ev.title}</div>
                <blockquote className="mt-1.5 p-2 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                  “{ev.quoteOrEvidence}”
                </blockquote>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-xs font-semibold text-slate-200">
                  PCAOB AS 2410 İlişkili Taraf 6 Soruluk Denetim Matrisi
                </div>
                <span className="text-[11px] font-mono text-teal-300">
                  {relatedPartyClassification.ruleId}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Karşı Taraf: <strong className="text-slate-100">{company.relatedPartyAssessment.counterpartyName}</strong> —{' '}
                {relatedPartyClassification.explanation}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  1. Yönetici Bağı: <strong className="text-teal-300 uppercase">{company.relatedPartyAssessment.q1_execControlLink}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  2. Gerçek İşlem: <strong className="text-teal-300 uppercase">{company.relatedPartyAssessment.q2_actualTransaction}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  3. Aynı Taraf: <strong className="text-teal-300 uppercase">{company.relatedPartyAssessment.q3_sameCounterparty}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  4. Finansal Etki: <strong className="text-slate-200 uppercase">{company.relatedPartyAssessment.q4_financialImpactDisclosed}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  5. Ticari Amaç: <strong className="text-amber-300 uppercase">{company.relatedPartyAssessment.q5_businessPurposeDisclosed}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  6. Bağımsız Onay: <strong className="text-rose-300 uppercase">{company.relatedPartyAssessment.q6_independentControlOrApproval}</strong>
                </div>
              </div>
            </div>
            <blockquote className="mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              Kanıt Alıntısı ({company.relatedPartyAssessment.sourceRef}): “{company.relatedPartyAssessment.evidenceQuote}”
            </blockquote>
          </div>
        </div>
      </section>

      {/* COMPLETE 60-FILTER INTERACTIVE SELECTION & SPREADSHEET MATRIX */}
      <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">
                Tam 60 Filtre Seçim ve Risk Analiz Matrisi (1–30 Ana Filtreler & 31–60 Ek Bayraklar)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Seçili: {selectedFilterCount}/60 · Tetiklenen: {totalTriggeredCount}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tablodaki onay kutularından (`Seç`) veya ağırlık sütunundan istediğiniz filtreleri açıp kapatabilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-md">
              <button
                type="button"
                onClick={() => setTableSlice('all60')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  tableSlice === 'all60'
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Tüm 60 Filtre
              </button>
              <button
                type="button"
                onClick={() => setTableSlice('selected_only')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  tableSlice === 'selected_only'
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Seçtiğim Filtreler ({selectedFilterCount})
              </button>
              <button
                type="button"
                onClick={() => setTableSlice('core30')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  tableSlice === 'core30'
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                1–30 Ana Filtreler
              </button>
              <button
                type="button"
                onClick={() => setTableSlice('extra30')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  tableSlice === 'extra30'
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                31–60 Ek Bayraklar
              </button>
              <button
                type="button"
                onClick={() => setTableSlice('triggered')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  tableSlice === 'triggered'
                    ? 'bg-rose-500 text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Tetiklenenler ({totalTriggeredCount})
              </button>
            </div>

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value as any)}
              aria-label="Tablo modül grubu seç"
              className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200"
            >
              <option value="all">Tüm Gruplar (A–L)</option>
              {Object.values(GROUP_DESCRIPTIONS).map((g) => (
                <option key={g.code} value={g.code}>
                  Grup {g.code}: {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#1E3A5F] text-white font-semibold border-b border-slate-700">
                <th className="py-2.5 px-2 text-center w-12">Seç</th>
                <th className="py-2.5 px-2 text-center w-10">No</th>
                <th className="py-2.5 px-2 text-center w-14">Grup</th>
                <th className="py-2.5 px-2.5 text-left">Modül</th>
                <th className="py-2.5 px-2.5 text-left">Filtre / Bayrak</th>
                <th className="py-2.5 px-2.5 text-left">Hesap / Örnek Eşik / Nasıl Ölçülür</th>
                <th className="py-2.5 px-2.5 text-left">Şirket Ölçümü & Neden Önemli</th>
                <th className="py-2.5 px-2 text-center">Kaynak</th>
                <th className="py-2.5 px-2 text-center">Durum</th>
                <th className="py-2.5 px-2 text-center w-20">Ağırlık</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {visibleFilterRows.map(({ filter, triggered, measuredValueText, weight }) => {
                const isSelected = weight > 0;
                const rawStockTriggered = Boolean(
                  company.filterMeasurements[filter.no]?.triggered
                );
                return (
                  <tr
                    key={filter.no}
                    className={
                      !isSelected
                        ? 'bg-slate-950/50 opacity-55 hover:opacity-90'
                        : triggered
                        ? 'bg-rose-950/20 hover:bg-rose-950/35'
                        : 'bg-slate-900/40 hover:bg-slate-900/80'
                    }
                  >
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          onChangeWeight(filter.no, isSelected ? 0 : filter.defaultWeight || 1)
                        }
                        aria-label={`Tablo Filtre ${filter.no} seç`}
                        className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500 cursor-pointer accent-teal-400"
                      />
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-slate-300 tabular-nums">
                      #{filter.no}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-semibold text-teal-300">
                      {filter.groupCode}
                    </td>
                    <td className="py-2 px-2.5 text-slate-300">{filter.moduleName}</td>
                    <td className="py-2 px-2.5 font-semibold text-slate-100">
                      {filter.filterName}
                    </td>
                    <td className="py-2 px-2.5 text-slate-300">
                      {filter.measurementAndThreshold}
                    </td>
                    <td className="py-2 px-2.5">
                      <div className="font-mono text-[11px] text-slate-100 font-medium">
                        {measuredValueText}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {filter.whyItMatters}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-slate-300">
                      {filter.sourceCode}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-[11px]">
                      {!isSelected ? (
                        <span className="text-slate-500">Devre Dışı ({rawStockTriggered ? 'Bayrak' : 'Temiz'})</span>
                      ) : triggered ? (
                        <span className="text-rose-400 font-bold">BAYRAK</span>
                      ) : (
                        <span className="text-emerald-400">Temiz</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <select
                        aria-label={`Tablo Filtre ${filter.no} ağırlığı`}
                        value={weight}
                        onChange={(e) => onChangeWeight(filter.no, Number(e.target.value))}
                        className={`w-14 px-1 py-0.5 text-xs font-mono font-bold text-center border rounded cursor-pointer tabular-nums ${
                          weight > 0
                            ? 'bg-yellow-300 text-blue-900 border-yellow-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 border-t-2 border-slate-700 font-mono font-bold text-xs">
                <td colSpan={8} className="py-2.5 px-3 text-right text-slate-200">
                  Seçili Filtre ({selectedFilterCount}/60) Toplam Aktif Ağırlık ve Tetiklenen Puan:
                </td>
                <td className="py-2.5 px-2 text-center text-rose-300">
                  {triggeredWeightedSum} Puan
                </td>
                <td className="py-2.5 px-2 text-center bg-yellow-300 text-blue-950">
                  {totalActiveWeight}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};
