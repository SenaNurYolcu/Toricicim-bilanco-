import React, { useMemo, useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Scale,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { BIST_FORENSIC_COMPANIES } from './data/bistForensicData';
import { CompanyProfile, EvaluatedCompanyResult } from './types/forensic';
import {
  evaluateCompany60Filters,
  generateActionableTakeaways,
  getCore20DefaultWeights,
  isCore20Filter,
  SIXTY_FILTERS,
} from './utils/forensicEngine';
import { FilterMatrixSidebar } from './components/FilterMatrixSidebar';
import { ForensicDetailView } from './components/ForensicDetailView';
import { CustomCompanySimulatorModal } from './components/CustomCompanySimulatorModal';

function createInitialWeights(): Record<number, number> {
  const initial: Record<number, number> = {};
  for (const f of SIXTY_FILTERS) {
    initial[f.no] = f.defaultWeight || 1;
  }
  return initial;
}

export default function App() {
  const [companies, setCompanies] = useState<CompanyProfile[]>(BIST_FORENSIC_COMPANIES);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('KTLEV');
  const [weightsByNo, setWeightsByNo] = useState<Record<number, number>>(createInitialWeights);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState<boolean>(true);
  const [exportSuccessText, setExportSuccessText] = useState<string>('');

  const selectedCompany = useMemo(
    () => companies.find((c) => c.symbol === selectedSymbol) || companies[0],
    [companies, selectedSymbol]
  );

  const evaluationsBySymbol = useMemo(() => {
    const map: Record<string, EvaluatedCompanyResult> = {};
    for (const c of companies) {
      map[c.symbol] = evaluateCompany60Filters(c, weightsByNo);
    }
    return map;
  }, [companies, weightsByNo]);

  const currentEvaluation = evaluationsBySymbol[selectedCompany.symbol];
  const selectedFilterCount = useMemo(
    () => SIXTY_FILTERS.filter((f) => (weightsByNo[f.no] ?? 0) > 0).length,
    [weightsByNo]
  );

  const comparisonSymbols = ['KTLEV', 'OZATD', 'THYAO', 'EREGL'];
  const comparisonCompanies = useMemo(
    () =>
      comparisonSymbols
        .map((sym) => companies.find((c) => c.symbol === sym))
        .filter((c): c is CompanyProfile => Boolean(c)),
    [companies]
  );

  const handleWeightChange = (no: number, weight: number) => {
    setWeightsByNo((prev) => ({
      ...prev,
      [no]: weight,
    }));
  };

  const handleBatchSetWeights = (nextWeights: Record<number, number>) => {
    setWeightsByNo(nextWeights);
  };

  const handleEnableTop20EssentialOnly = () => {
    setWeightsByNo(getCore20DefaultWeights());
  };

  const handleResetAllWeightsToOne = () => {
    const allOnes: Record<number, number> = {};
    for (const f of SIXTY_FILTERS) {
      allOnes[f.no] = 1;
    }
    setWeightsByNo(allOnes);
  };

  const handleClearAllFilters = () => {
    const allZeros: Record<number, number> = {};
    for (const f of SIXTY_FILTERS) {
      allZeros[f.no] = 0;
    }
    setWeightsByNo(allZeros);
  };

  const handleEnableCore30Only = () => {
    const next: Record<number, number> = {};
    for (const f of SIXTY_FILTERS) {
      next[f.no] = f.isExtraFlag ? 0 : 1;
    }
    setWeightsByNo(next);
  };

  const handleCalibrateWhaleAndGovernanceFocus = () => {
    const next: Record<number, number> = {};
    for (const f of SIXTY_FILTERS) {
      const isFocus = ['A', 'C', 'F', 'G', 'I', 'K'].includes(f.groupCode);
      next[f.no] = isFocus ? 3 : 1;
    }
    setWeightsByNo(next);
  };

  const handleAddCustomCompany = (newCompany: CompanyProfile) => {
    setCompanies((prev) => {
      const filtered = prev.filter((c) => c.symbol !== newCompany.symbol);
      return [newCompany, ...filtered];
    });
    setSelectedSymbol(newCompany.symbol);
    setShowSimulator(false);
  };

  const handleDownloadJson = (evaluated: EvaluatedCompanyResult) => {
    const takeaways = generateActionableTakeaways(evaluated.company, evaluated);
    const payload = {
      schemaVersion: 'bilanco-v2-core20-1.2',
      generatedAt: new Date().toISOString(),
      corePrinciple:
        'İyi bir şirket için anlamlı olan bilançodur. İyi şirket gelecek bilançosunu fiyatlar.',
      selectedCompany: {
        symbol: evaluated.company.symbol,
        name: evaluated.company.name,
        periodEnd: evaluated.company.periodEnd,
        asOfDate: evaluated.company.asOfDate,
      },
      actionableTakeaways: takeaways,
      evaluationSummary: {
        outcome: evaluated.outcome,
        weightedRiskScore100: evaluated.weightedRiskScore100,
        totalTriggeredCount: evaluated.totalTriggeredCount,
        triggeredCoreCount: evaluated.triggeredCoreCount,
        triggeredExtraCount: evaluated.triggeredExtraCount,
      },
      balanceSheetHealth: evaluated.company.balanceSheetHealth,
      scrapedFundHoldings: evaluated.company.scrapedFundHoldings,
      sentimentilMediaScore: {
        channels: evaluated.company.scrapedSentimentChannels,
        synthesis: evaluated.company.sentimentSynthesis,
      },
      evaluated60Filters: evaluated.evaluatedFilters,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evaluated.company.symbol.toLowerCase()}-bilanco-60filtre-analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccessText(`${evaluated.company.symbol} analysis.json indirildi`);
    setTimeout(() => setExportSuccessText(''), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] flex flex-col">
      {/* Top Bar Contract: Single top bar with Brand, Primary Actions */}
      <header className="sticky top-0 z-30 bg-[#0B0F17]/95 backdrop-blur border-b border-slate-800 px-4 lg:px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Institutional Positioning */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-300 font-mono font-bold text-sm shrink-0">
              B60
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-100">
                  BIST Adli Finans, Sığ Tahta & Bilanço Risk Platformu
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-teal-300 border border-slate-700 whitespace-nowrap shrink-0">
                  <SlidersHorizontal className="w-3 h-3" />
                  Seçili Filtre: {selectedFilterCount} / 60
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Bilanço Kalitesi, TEFAS Fon Akışı, Kurumsal Yönetişim ve Sentimentil Medya Karar Sistemi
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {exportSuccessText && (
              <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded whitespace-nowrap shrink-0">
                {exportSuccessText}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowComparisonMatrix((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                showComparisonMatrix
                  ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Hızlı Yorum & Karşılaştırma Paneli
            </button>
            <button
              type="button"
              onClick={() => setShowSimulator((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                showSimulator
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-semibold'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              {showSimulator ? 'Simülatörü Kapat' : 'Yeni Hisse / Oran Simülatörü'}
            </button>
            <button
              type="button"
              onClick={() => handleDownloadJson(currentEvaluation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-teal-400 hover:bg-teal-300 text-slate-950 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              analysis.json İndir
            </button>
          </div>
        </div>
      </header>

      {/* Company Selector Bar */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-4 lg:px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 whitespace-nowrap shrink-0 mr-1">
              İncelenen Tahtalar ({companies.length}):
            </span>
            {companies.map((company) => {
              const evalItem = evaluationsBySymbol[company.symbol];
              const isSelected = company.symbol === selectedCompany.symbol;

              const scoreBadgeColor =
                evalItem.outcome === 'dikkat_gerektiriyor'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                  : evalItem.outcome === 'sinirli_isaret'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';

              return (
                <button
                  key={company.symbol}
                  type="button"
                  onClick={() => setSelectedSymbol(company.symbol)}
                  className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-slate-800/95 border-teal-400 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold text-xs text-slate-100">
                      {company.symbol}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[84px]">
                      {company.name}
                    </div>
                  </div>
                  <div
                    className={`px-1.5 py-0.5 rounded border font-mono text-[11px] font-bold tabular-nums ${scoreBadgeColor}`}
                  >
                    {evalItem.weightedRiskScore100}/100
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono tabular-nums shrink-0">
            <span>
              Seçili Filtre:{' '}
              <strong className="text-teal-300">
                {selectedFilterCount} / 60
              </strong>
            </span>
            <span>
              Toplam Ağırlık:{' '}
              <strong className="text-amber-300">
                {currentEvaluation.totalActiveWeight}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleResetAllWeightsToOne}
              className="inline-flex items-center gap-1 text-teal-400 hover:underline whitespace-nowrap shrink-0"
            >
              Tüm 60 Filtreyi Seç
            </button>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="inline-flex items-center gap-1 text-rose-400 hover:underline whitespace-nowrap shrink-0"
            >
              Seçimi Temizle (0)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1600px] w-full mx-auto px-4 lg:px-6 py-5 space-y-5 flex-1">
        {/* Optional Live Simulator Drawer */}
        {showSimulator && (
          <CustomCompanySimulatorModal
            weightsByNo={weightsByNo}
            onAddCustomCompany={handleAddCustomCompany}
          />
        )}

        {/* Automated Multi-Stock Comparison & "Bundan Ne Çıkarmalıyım?" Panel (KTLEV, OZATD, THYAO, EREGL) */}
        {showComparisonMatrix && (
          <section
            aria-label="Hızlı Yorum ve Bilanço Karşılaştırma Matrisi"
            className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    Otomatik Bilanço & Fon Yorumlayıcı
                  </span>
                  <h2 className="text-base font-bold text-slate-100">
                    Sığ Tahta / Fon Çıkışı Vakaları (KTLEV, OZATD) vs. BIST-30 Sanayi & Nakit Devleri (THYAO, EREGL)
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  “İyi bir şirket için anlamlı olan bilançodur. İyi şirket gelecek bilançosunu fiyatlar.” Her metrik kutusunun altında <strong>“Ne Çıkarmalıyım?”</strong> kısa yorumu yer almaktadır.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {comparisonCompanies.map((comp) => {
                const evalRes = evaluationsBySymbol[comp.symbol];
                const tk = generateActionableTakeaways(comp, evalRes);
                const isSelected = selectedSymbol === comp.symbol;
                const isHighRisk = evalRes.weightedRiskScore100 >= 60;
                const isMediumRisk =
                  evalRes.weightedRiskScore100 >= 25 && evalRes.weightedRiskScore100 < 60;

                const latestRatios =
                  comp.financialRatioHistory[comp.financialRatioHistory.length - 1];

                return (
                  <div
                    key={comp.symbol}
                    onClick={() => setSelectedSymbol(comp.symbol)}
                    className={`cursor-pointer p-4 rounded-lg border transition-all flex flex-col justify-between ${
                      isSelected
                        ? isHighRisk
                          ? 'bg-rose-950/20 border-rose-500/60'
                          : isMediumRisk
                          ? 'bg-amber-950/20 border-amber-500/60'
                          : 'bg-emerald-950/20 border-emerald-500/60'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                              isHighRisk
                                ? 'text-rose-300 bg-rose-950/70 border-rose-800/60'
                                : isMediumRisk
                                ? 'text-amber-300 bg-amber-950/70 border-amber-800/60'
                                : 'text-emerald-300 bg-emerald-950/70 border-emerald-800/60'
                            }`}
                          >
                            {isHighRisk ? (
                              <ShieldAlert className="w-3 h-3" />
                            ) : isMediumRisk ? (
                              <FileSpreadsheet className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {tk.overallVerdictTitle}
                          </span>
                          <h3 className="text-base font-bold text-slate-100 mt-1.5">
                            {comp.symbol} — {comp.name}
                          </h3>
                        </div>
                        <div className="text-right font-mono tabular-nums shrink-0">
                          <div className="text-xs text-slate-400">60-Filtre Risk</div>
                          <div
                            className={`text-lg font-bold ${
                              isHighRisk
                                ? 'text-rose-400'
                                : isMediumRisk
                                ? 'text-amber-300'
                                : 'text-emerald-400'
                            }`}
                          >
                            {evalRes.weightedRiskScore100}/100 ({evalRes.totalTriggeredCount} Bayrak)
                          </div>
                        </div>
                      </div>

                      {/* 4 Metric Boxes with Short "Ne Çıkarmalıyım?" Takeaways */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                        {/* Box 1: Bilanço Sağlığı */}
                        <div className="p-2.5 rounded bg-slate-950/85 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between font-mono tabular-nums">
                            <span className="text-[10px] text-slate-400">1. Bilanço Sağlığı</span>
                            <span
                              className={`text-xs font-bold ${
                                comp.balanceSheetHealth.overallHealthScore100 < 50
                                  ? 'text-rose-400'
                                  : comp.balanceSheetHealth.overallHealthScore100 < 75
                                  ? 'text-amber-300'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {comp.balanceSheetHealth.overallHealthScore100}/100 · F/K:{' '}
                              {latestRatios.peRatio.toFixed(1)}x
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            <strong className="text-teal-300">Yorum: </strong>
                            {tk.balanceSheetTakeaway}
                          </p>
                        </div>

                        {/* Box 2: TEFAS Fon Akışı */}
                        <div className="p-2.5 rounded bg-slate-950/85 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between font-mono tabular-nums">
                            <span className="text-[10px] text-slate-400">2. TEFAS Fon Akışı</span>
                            <span
                              className={`text-xs font-bold ${
                                tk.netFundFlowLots < 0 ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {tk.netFundFlowLots > 0 ? '+' : ''}
                              {(tk.netFundFlowLots / 1_000_000).toFixed(2)} Mn Lot
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            <strong className="text-amber-300">Yorum: </strong>
                            {tk.fundFlowTakeaway}
                          </p>
                        </div>

                        {/* Box 3: Gelecek Bilanço Fiyatlaması */}
                        <div className="p-2.5 rounded bg-slate-950/85 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between font-mono tabular-nums">
                            <span className="text-[10px] text-slate-400">3. Gelecek Bilanço</span>
                            <span
                              className={`text-xs font-bold ${
                                comp.balanceSheetHealth.forwardPricingGapPct > 30
                                  ? 'text-rose-400'
                                  : comp.balanceSheetHealth.forwardPricingGapPct > 5
                                  ? 'text-amber-300'
                                  : 'text-emerald-400'
                              }`}
                            >
                              Fiyat +%{comp.balanceSheetHealth.currentPriceImpliedGrowthPct.toFixed(0)} vs Kapasite +%{comp.balanceSheetHealth.fundamentalsSupportedGrowthPct.toFixed(0)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            <strong className="text-teal-300">Yorum: </strong>
                            {tk.forwardBalanceSheetTakeaway}
                          </p>
                        </div>

                        {/* Box 4: Sentimentil Medya Skoru */}
                        <div className="p-2.5 rounded bg-slate-950/85 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between font-mono tabular-nums">
                            <span className="text-[10px] text-slate-400">4. Sentimentil Medya</span>
                            <span
                              className={`text-xs font-bold ${
                                comp.sentimentSynthesis.combinedMarketSentimentScore < 40
                                  ? 'text-rose-400'
                                  : comp.sentimentSynthesis.combinedMarketSentimentScore < 70
                                  ? 'text-amber-300'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {comp.sentimentSynthesis.combinedMarketSentimentScore}/100 Skor
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            <strong className="text-rose-300">Yorum: </strong>
                            {tk.sentimentMediaTakeaway}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 truncate pr-2">
                        <strong className="text-slate-200">Özet Karar:</strong> {tk.overallVerdictShort}
                      </span>
                      <span className="font-mono text-[11px] text-teal-300 font-semibold whitespace-nowrap shrink-0">
                        {comp.symbol} Tam Raporu Aç →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Main 2-Column Analytical Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: All 60 Filters Interactive Selection Sidebar Next to the Stock */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20">
            <FilterMatrixSidebar
              filters={SIXTY_FILTERS}
              selectedCompany={selectedCompany}
              weightsByNo={weightsByNo}
              onChangeWeight={handleWeightChange}
              onBatchSetWeights={handleBatchSetWeights}
              onEnableTop20EssentialOnly={handleEnableTop20EssentialOnly}
              onResetAllWeightsToOne={handleResetAllWeightsToOne}
              onClearAllFilters={handleClearAllFilters}
              onEnableCore30Only={handleEnableCore30Only}
              onCalibrateWhaleAndGovernanceFocus={handleCalibrateWhaleAndGovernanceFocus}
            />
          </div>

          {/* Right Column: Comprehensive Forensic Detail View */}
          <div className="lg:col-span-8 xl:col-span-9 min-w-0">
            <ForensicDetailView
              evaluated={currentEvaluation}
              onDownloadJson={handleDownloadJson}
              onChangeWeight={handleWeightChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
