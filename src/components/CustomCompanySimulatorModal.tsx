import React, { useState } from 'react';
import { Calculator, Play } from 'lucide-react';
import { CompanyProfile } from '../types/forensic';
import { evaluateCompany60Filters } from '../utils/forensicEngine';

interface CustomCompanySimulatorModalProps {
  weightsByNo: Record<number, number>;
  onAddCustomCompany: (company: CompanyProfile) => void;
}

export const CustomCompanySimulatorModal: React.FC<CustomCompanySimulatorModalProps> = ({
  weightsByNo,
  onAddCustomCompany,
}) => {
  const [symbol, setSymbol] = useState('SIĞT');
  const [name, setName] = useState('Örnek Sığ Tahta & Portföy A.Ş.');
  const [sector, setSector] = useState('Girişim Sermayesi & Yatırım');
  const [consecutiveCeilings, setConsecutiveCeilings] = useState(4);
  const [freeFloatPct, setFreeFloatPct] = useState(15.8);
  const [top1BrokerSharePct, setTop1BrokerSharePct] = useState(37.5);
  const [currentRatio, setCurrentRatio] = useState(1.12);
  const [debtToEquity, setDebtToEquity] = useState(2.85);
  const [peRatio, setPeRatio] = useState(64.0);
  const [pbRatio, setPbRatio] = useState(9.8);
  const [ocfToNetIncome, setOcfToNetIncome] = useState(-0.45);
  const [beneishMScore, setBeneishMScore] = useState(-1.38);
  const [auditorChanges3Y, setAuditorChanges3Y] = useState(2);
  const [cfoChanges12M, setCfoChanges12M] = useState(2);
  const [socialHypeZScore, setSocialHypeZScore] = useState(3.9);
  const [whaleNetOutflowMln, setWhaleNetOutflowMln] = useState(-185.0);
  const [errorMsg, setErrorMsg] = useState('');

  const buildCandidateProfile = (): CompanyProfile => {
    const measurements: Record<number, { triggered: boolean; valueText: string }> = {
      1: {
        triggered: consecutiveCeilings >= 3,
        valueText: `Son 20 günde ${consecutiveCeilings} ardışık tavan`,
      },
      2: {
        triggered: consecutiveCeilings >= 3,
        valueText: `20G getiri Z-skoru: +${(consecutiveCeilings * 0.95).toFixed(2)}σ`,
      },
      3: {
        triggered: top1BrokerSharePct >= 30,
        valueText: `Günlük hacim / 60G ort.: ${(top1BrokerSharePct / 6.2).toFixed(1)}x`,
      },
      4: {
        triggered: whaleNetOutflowMln <= -100,
        valueText: `Zirveden düşüş: -%34.2`,
      },
      6: {
        triggered: consecutiveCeilings >= 3,
        valueText: `PSY/BSADF istatistiği kritik eşiği aştı`,
      },
      8: {
        triggered: freeFloatPct < 20,
        valueText: `Amihud illikidite üst %10 diliminde`,
      },
      12: {
        triggered: freeFloatPct < 25,
        valueText: `Fiili dolaşım oranı: %${freeFloatPct.toFixed(1)}`,
      },
      14: {
        triggered: top1BrokerSharePct > 30,
        valueText: `İlk aracı kurum takas payı: %${top1BrokerSharePct.toFixed(1)}`,
      },
      15: {
        triggered: top1BrokerSharePct > 30,
        valueText: `Serbest fon sahipliği yoğunluğu yüksek`,
      },
      19: {
        triggered: peRatio < 0 || peRatio > 50 || pbRatio > 7.5,
        valueText: `F/K: ${peRatio.toFixed(1)}x; PD/DD: ${pbRatio.toFixed(1)}x`,
      },
      20: {
        triggered: ocfToNetIncome < 0.5 && currentRatio < 1.25,
        valueText: `Piotroski F-Skoru: 3 / 9 (Zayıf)`,
      },
      21: {
        triggered: beneishMScore > -1.78,
        valueText: `Beneish M-Skoru: ${beneishMScore.toFixed(2)} (> -1.78)`,
      },
      22: {
        triggered: ocfToNetIncome < 0.5,
        valueText: `Nakit akışı / Net kâr: ${ocfToNetIncome.toFixed(2)} (< 0.5)`,
      },
      24: {
        triggered: debtToEquity > 2.2,
        valueText: `Borç/Özsermaye (D/E): ${debtToEquity.toFixed(2)}x`,
      },
      26: {
        triggered: auditorChanges3Y >= 2,
        valueText: `Son 3 yılda ${auditorChanges3Y} denetçi değişimi`,
      },
      27: {
        triggered: cfoChanges12M >= 2,
        valueText: `Son 12 ayda ${cfoChanges12M} YK/CFO değişimi`,
      },
      28: {
        triggered: whaleNetOutflowMln <= -100,
        valueText: `Ortak satışı ve rehinli pay oranı yüksek`,
      },
      30: {
        triggered: auditorChanges3Y >= 2,
        valueText: `İlişkili taraf işlemleri / Varlıklar oranı yüksek`,
      },
      31: {
        triggered: consecutiveCeilings >= 3,
        valueText: `Son 60 günde VBTS tedbiri uygulandı`,
      },
      35: {
        triggered: auditorChanges3Y >= 2,
        valueText: `SPK idari para cezası / inceleme kaydı`,
      },
      36: {
        triggered: top1BrokerSharePct >= 35,
        valueText: `İşlem yasaklı fon/spekülatör grup bağlantısı şüphesi`,
      },
      42: {
        triggered: auditorChanges3Y >= 2,
        valueText: `KAP finansal tablo gecikme / düzeltme bildirimi`,
      },
      47: {
        triggered: socialHypeZScore > 3.0,
        valueText: `X/Telegram/YouTube anma Z-skoru: +${socialHypeZScore.toFixed(2)}σ`,
      },
      49: {
        triggered: socialHypeZScore > 3.0,
        valueText: `Hisse forumu yorum yoğunluğu medyanın 5.2 katı`,
      },
      50: {
        triggered: debtToEquity > 2.0,
        valueText: `Kredili işlem bakiyesi / Dolaşımdaki lot: %34.0`,
      },
      55: {
        triggered: top1BrokerSharePct > 30,
        valueText: `Tek portföy şirketi fonlarının payı yüksek`,
      },
      57: {
        triggered: whaleNetOutflowMln <= -150,
        valueText: `İlişkili fonlarda işlem durdurma / çıkış likiditesi krizi`,
      },
    };

    const govScore = Math.max(
      25,
      Math.round(90 - auditorChanges3Y * 15 - cfoChanges12M * 12)
    );

    return {
      symbol: symbol.trim().toUpperCase() || 'TEST',
      name: name.trim() || 'Test Şirketi A.Ş.',
      sector: sector.trim() || 'Karma Sektör',
      periodEnd: '2026-06-30',
      asOfDate: '2026-10-23',
      lastPriceTL: 42.5,
      priceChange1dPct: -8.4,
      caseSummaryTag: 'Canlı Senaryo Simülasyonu · Kritik Filtre & Makro/Balina Analizi',
      caseNarrative:
        'Canlı senaryo simülatöründen girilen finansal oranlar (Cari Oran, D/E, F/K, F/DD), KAP yönetici/denetçi değişimleri ve balina-duyarlılık parametreleriyle hesaplanan dinamik risk analizi.',
      whyItExploded: `Fiili dolaşım oranı %${freeFloatPct.toFixed(1)}, ardışık tavan sayısı ${consecutiveCeilings} ve F/K çarpanı ${peRatio.toFixed(1)}x ile sığ tahtada spekülatif balon oluşumu modellenmiştir.`,
      howWhalesOperated: `İlk aracı kurum takas payı %${top1BrokerSharePct.toFixed(1)} iken büyük balina katmanında ${whaleNetOutflowMln.toFixed(1)} Milyon TL net çıkış ve sosyal medyada +${socialHypeZScore.toFixed(1)}σ FOMO pompası simüle edilmiştir.`,
      filterMeasurements: measurements,
      financialRatioHistory: [
        {
          period: '2025/06',
          currentRatio: Number((currentRatio + 0.25).toFixed(2)),
          debtToEquity: Number(Math.max(0.4, debtToEquity - 0.6).toFixed(2)),
          peRatio: Number(Math.max(8, peRatio * 0.55).toFixed(1)),
          pbRatio: Number(Math.max(1.2, pbRatio * 0.55).toFixed(1)),
          sectorCurrentRatio: 1.48,
          sectorDebtToEquity: 1.45,
          sectorPeRatio: 14.2,
          sectorPbRatio: 2.5,
          cpiInflationPct: 58.2,
          policyInterestRatePct: 50.0,
          gdpGrowthPct: 3.2,
        },
        {
          period: '2025/12',
          currentRatio: Number((currentRatio + 0.12).toFixed(2)),
          debtToEquity: Number(Math.max(0.5, debtToEquity - 0.3).toFixed(2)),
          peRatio: Number(Math.max(10, peRatio * 0.78).toFixed(1)),
          pbRatio: Number(Math.max(1.5, pbRatio * 0.78).toFixed(1)),
          sectorCurrentRatio: 1.46,
          sectorDebtToEquity: 1.50,
          sectorPeRatio: 14.5,
          sectorPbRatio: 2.6,
          cpiInflationPct: 44.38,
          policyInterestRatePct: 50.0,
          gdpGrowthPct: 2.9,
        },
        {
          period: '2026/06',
          currentRatio,
          debtToEquity,
          peRatio,
          pbRatio,
          sectorCurrentRatio: 1.45,
          sectorDebtToEquity: 1.52,
          sectorPeRatio: 14.8,
          sectorPbRatio: 2.7,
          cpiInflationPct: 38.5,
          policyInterestRatePct: 47.5,
          gdpGrowthPct: 2.6,
        },
      ],
      macroCorrelations: [
        {
          metricName: 'Cari Oran & Borç/Özsermaye (D/E)',
          corrWithInflation: 0.94,
          corrWithInterestRate: -0.82,
          corrWithGdpGrowth: 0.96,
          statisticalInterpretation: `Cari oran (${currentRatio.toFixed(2)}) ve Borç/Özsermaye (${debtToEquity.toFixed(2)}x) yüksek faiz ortamında sektör ortalamasından negatif ayrışmaktadır.`,
        },
        {
          metricName: 'F/K ve F/DD (PD/DD) Değerleme Çarpanları',
          corrWithInflation: -0.97,
          corrWithInterestRate: 0.75,
          corrWithGdpGrowth: -0.93,
          statisticalInterpretation: `F/K (${peRatio.toFixed(1)}x) ve F/DD (${pbRatio.toFixed(1)}x) oranları makro büyümeyle ters yönde spekülatif olarak genişlemiştir.`,
        },
      ],
      governanceScorecard: {
        overallScore: govScore,
        boardIndependenceScore: govScore + 4,
        auditCommitteeEffectiveness: govScore - 5,
        kapDisclosureTransparency: govScore,
        minorityShareholderProtection: govScore - 2,
        auditorChanges3Y,
        boardAndCfoChanges12M: cfoChanges12M,
        estimatedPriceImpactOfChangesPct: -(auditorChanges3Y * 6.5 + cfoChanges12M * 3.2),
      },
      governanceEvents: [
        {
          date: '2026-10-23',
          category: 'auditor_change',
          title: `Simülasyon: Son 3 Yılda ${auditorChanges3Y} Denetçi ve 12 Ayda ${cfoChanges12M} YK/CFO Değişimi (#26, #27)`,
          actor: 'KAP Özel Durum & Genel Kurul Tescili',
          quoteOrEvidence:
            'Kullanıcı tarafından simüle edilen denetçi rotasyonu ve üst yönetim istifa sıklığı.',
          sourceUrl: 'https://www.kap.org.tr',
          priceImpact10dCarPct: -(auditorChanges3Y * 6.5),
          severity: auditorChanges3Y >= 2 ? 'critical' : 'context',
        },
      ],
      whaleTiers: [
        {
          tierName: 'Mega Balina (>25 Mn TL / Emir)',
          buyVolumeMlnTL: 90.0,
          sellVolumeMlnTL: 90.0 - whaleNetOutflowMln,
          netVolumeMlnTL: whaleNetOutflowMln,
          shareOfTotalVolumePct: top1BrokerSharePct,
          trendDirection:
            whaleNetOutflowMln < 0 ? 'Güçlü Dağıtım (Çıkış)' : 'Agresif Toplama (Giriş)',
        },
        {
          tierName: 'Perakende Kalabalık (<1 Mn TL)',
          buyVolumeMlnTL: 90.0 - whaleNetOutflowMln,
          sellVolumeMlnTL: 90.0,
          netVolumeMlnTL: -whaleNetOutflowMln,
          shareOfTotalVolumePct: 100 - top1BrokerSharePct,
          trendDirection: 'Zirvede Mal Devralma (FOMO)',
        },
      ],
      sentimentSynthesis: {
        newsSentimentScore: -45,
        economicReportScore: -50,
        socialMediaHypeScore: Math.min(99, Math.round(socialHypeZScore * 22)),
        combinedMarketSentimentScore: 74,
        whaleNetFlowScore: whaleNetOutflowMln < 0 ? -80 : 40,
        whaleVsSentimentDivergenceIndex: whaleNetOutflowMln < 0 && socialHypeZScore > 2.5 ? 88 : 24,
        predictedPriceImpactSummary:
          'Sosyal medya anma sıçraması yüksek iken büyük balina emirlerinin net satışta olması yüksek diverjans üretmektedir.',
      },
      brokerFlows: [
        {
          brokerName: 'Lider Aracı Kurum (Simülasyon Balinası)',
          brokerCode: 'BAL',
          netLots: -2100000,
          netVolumeTL: whaleNetOutflowMln * 1_000_000,
          shareOfTotalVolumePct: top1BrokerSharePct,
          averageCostTL: 42.5,
          role: 'whale_distributor',
        },
        {
          brokerName: 'Bireysel Yatırımcı (Perakende)',
          brokerCode: 'PER',
          netLots: 2100000,
          netVolumeTL: -whaleNetOutflowMln * 1_000_000,
          shareOfTotalVolumePct: 100 - top1BrokerSharePct,
          averageCostTL: 42.5,
          role: 'retail_crowd',
        },
      ],
      relatedPartyAssessment: {
        q1_execControlLink: auditorChanges3Y >= 2 ? 'yes' : 'no',
        q2_actualTransaction: 'yes',
        q3_sameCounterparty: 'yes',
        q4_financialImpactDisclosed: 'yes',
        q5_businessPurposeDisclosed: 'unknown',
        q6_independentControlOrApproval: 'no',
        counterpartyName: 'Simüle Edilen Grup İçi Danışmanlık A.Ş.',
        evidenceQuote: 'Simülasyon ilişkili taraf senaryosu.',
        sourceRef: 'Simülasyon Girdisi',
      },
      newsAndEconomists: [
        {
          id: `SIM-${Date.now()}`,
          date: '2026-10-23',
          sourceType: 'Ekonomist / Akademik Makale',
          authorOrInstitution: 'Kantitatif Risk Analiz Motoru',
          title: `${symbol.toUpperCase()} Senaryo Analizi`,
          excerpt: `Cari Oran ${currentRatio}, D/E ${debtToEquity}x, F/K ${peRatio}x, F/DD ${pbRatio}x ve ${auditorChanges3Y} denetçi değişimi ile çalıştırıldı.`,
          sentimentOrWarning: 'analytical_caution',
          relatedFilterNumbers: [1, 12, 14, 19, 21, 22, 26, 27, 47],
        },
      ],
      priceHistory: [
        { date: '2026-08-15', close: 18.0, xu100Close: 9900, volumeLots: 2500000, topBrokerConcentrationPct: 45, isLimitUpOrDown: 'normal' },
        { date: '2026-09-15', close: 48.0, xu100Close: 10100, volumeLots: 9800000, topBrokerConcentrationPct: 70, isLimitUpOrDown: 'tavan' },
        { date: '2026-10-23', close: 42.5, xu100Close: 10310, volumeLots: 8400000, topBrokerConcentrationPct: 68, isLimitUpOrDown: 'taban' },
      ],
      scrapedFundHoldings: [
        {
          fundCode: 'SIM-SRB',
          fundName: 'Simülasyon Serbest Hisse Senedi Fonu',
          founderInstitution: 'Simülasyon Portföy Yönetimi A.Ş.',
          fundType: 'Serbest Fon',
          weightInFundPct: Number((top1BrokerSharePct * 0.42).toFixed(1)),
          shareOfFreeFloatPct: Number((top1BrokerSharePct * 0.55).toFixed(1)),
          monthlyFlowLots: Math.round(whaleNetOutflowMln * 12000),
          riskFlagNote:
            top1BrokerSharePct > 30
              ? 'Yüksek Serbest Fon Yoğunlaşması ve Çıkış Likiditesi Riski (#15, #55)'
              : 'Normal Dağılım',
          sourceRef: 'KAP Portföy Dağılım Raporu / TEFAS Scraping',
        },
      ],
      scrapedSentimentChannels: [
        {
          channelName: 'X (Twitter) & Telegram VIP / Sinyal Grupları',
          scrapedPostCount30d: Math.round(socialHypeZScore * 4200),
          positiveRatioPct: 78,
          negativeRatioPct: 12,
          manipulationBotOrFomoIndex: Math.min(95, Math.round(socialHypeZScore * 20)),
          mediaScore100: Math.max(15, Math.round(85 - socialHypeZScore * 15)),
          sampleScrapedQuotes: [
            `#${symbol.toUpperCase()} tahtasında dolaşım sadece %${freeFloatPct.toFixed(1)}, tavan serisi devam ediyor!`,
          ],
          analyticalVerdict:
            'Sığ tahtada yüksek bot/sinyal grubu aktivitesi ile bireysel yatırımcıya FOMO pompalanmaktadır.',
        },
        {
          channelName: 'KAP & SPK Resmi Bülten Tonu',
          scrapedPostCount30d: 18,
          positiveRatioPct: 35,
          negativeRatioPct: 45,
          manipulationBotOrFomoIndex: 5,
          mediaScore100: govScore,
          sampleScrapedQuotes: [
            `Son 3 yılda ${auditorChanges3Y} bağımsız denetçi değişimi ve ${cfoChanges12M} üst düzey yönetici ayrılığı kaydedilmiştir.`,
          ],
          analyticalVerdict:
            'Resmi KAP açıklamalarında yönetişim ve denetçi rotasyonu uyarıları öne çıkmaktadır.',
        },
      ],
      balanceSheetHealth: {
        overallHealthScore100: Math.max(
          20,
          Math.min(
            95,
            Math.round(
              70 +
                (ocfToNetIncome > 0.5 ? 15 : -22) +
                (currentRatio >= 1.3 ? 10 : -12) -
                (debtToEquity > 2.2 ? 15 : 0)
            )
          )
        ),
        healthVerdictLabel:
          ocfToNetIncome < 0.3 || peRatio > 45
            ? 'Kritik Bilanço Bozulması / Spekülatif Fiyatlama'
            : 'Nakit Akışı Uyarılı / Karışık Görünüm',
        altmanZScore: Number((1.95 + currentRatio * 0.45 - debtToEquity * 0.25).toFixed(2)),
        piotroskiFScore: ocfToNetIncome > 0.5 && currentRatio >= 1.3 ? 7 : 3,
        beneishMScore,
        currentPriceImpliedGrowthPct: Number((peRatio * 1.85).toFixed(1)),
        fundamentalsSupportedGrowthPct: Number(
          Math.max(12, 45 + ocfToNetIncome * 25).toFixed(1)
        ),
        forwardPricingGapPct: Number(
          (peRatio * 1.85 - Math.max(12, 45 + ocfToNetIncome * 25)).toFixed(1)
        ),
        advisorPrincipleCommentary:
          'İyi bir şirket için anlamlı olan bilançodur. İyi şirket gelecek bilançosunu fiyatlar. Simüle edilen bu profilde nakit akışı ve çarpan uyumu test edilmektedir.',
        kapExtractedFacts: [
          {
            conceptLabel: 'Cari Oran & Kısa Vadeli Likidite',
            currentPeriodTL: `${currentRatio.toFixed(2)}x`,
            previousPeriodTL: `${(currentRatio + 0.15).toFixed(2)}x`,
            realChangePct: '-9.4%',
            kapFootnoteRef: 'Simülasyon Bilanço Girdisi',
            healthStatus: currentRatio < 1.2 ? 'critical' : 'healthy',
          },
          {
            conceptLabel: 'İşletme Nakit Akışı / Net Kâr (#22)',
            currentPeriodTL: `${ocfToNetIncome.toFixed(2)}x`,
            previousPeriodTL: '0.65x',
            realChangePct: ocfToNetIncome < 0 ? 'Negatif' : 'Pozitif',
            kapFootnoteRef: 'Simülasyon Nakit Akış Tablosu',
            healthStatus: ocfToNetIncome < 0.5 ? 'critical' : 'healthy',
          },
        ],
      },
    };
  };

  const livePreview = evaluateCompany60Filters(buildCandidateProfile(), weightsByNo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !name.trim()) {
      setErrorMsg('Lütfen geçerli bir Borsa kodu (sembol) ve şirket adı giriniz.');
      return;
    }
    setErrorMsg('');
    onAddCustomCompany(buildCandidateProfile());
  };

  return (
    <section className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-400" />
            Canlı Hisse Veri Girişi, Oran Hesaplayıcı ve 60 Filtre Simülatörü
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cari Oran, Borç/Özsermaye (D/E), F/K, F/DD (PD/DD), KAP Denetçi/Yönetici Değişimi ve Balina/Sosyal Medya verilerini girerek 60 filtreli risk motorunda canlı test edin.
          </p>
        </div>

        <div className="p-3 rounded-md bg-slate-900 border border-slate-700 font-mono tabular-nums shrink-0 text-right">
          <div className="text-[10px] text-slate-400">Canlı 60-Filtre Skoru</div>
          <div className="text-sm font-bold text-teal-300">
            {livePreview.outcome.toUpperCase()} ({livePreview.weightedRiskScore100}/100)
          </div>
          <div className="text-[11px] text-slate-400">
            {livePreview.totalTriggeredCount}/60 Bayrak · Σ Puan: {livePreview.triggeredWeightedSum}/{livePreview.totalActiveWeight}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 rounded bg-rose-950/50 border border-rose-800 text-xs text-rose-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sim-symbol" className="block text-xs font-medium text-slate-300 mb-1">
              BIST Hisse Kodu (Sembol)
            </label>
            <input
              id="sim-symbol"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-md text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="sim-name" className="block text-xs font-medium text-slate-300 mb-1">
              Şirket Unvanı
            </label>
            <input
              id="sim-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="sim-sector" className="block text-xs font-medium text-slate-300 mb-1">
              Sektör
            </label>
            <input
              id="sim-sector"
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-cr" className="block text-[11px] font-medium text-slate-300">
              Cari Oran
            </label>
            <input
              id="sim-cr"
              type="number"
              step="0.05"
              value={currentRatio}
              onChange={(e) => setCurrentRatio(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-de" className="block text-[11px] font-medium text-slate-300">
              Borç/Özkaynak (D/E)
            </label>
            <input
              id="sim-de"
              type="number"
              step="0.1"
              value={debtToEquity}
              onChange={(e) => setDebtToEquity(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-pe" className="block text-[11px] font-medium text-slate-300">
              F/K Oranı (#19)
            </label>
            <input
              id="sim-pe"
              type="number"
              step="1"
              value={peRatio}
              onChange={(e) => setPeRatio(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-pb" className="block text-[11px] font-medium text-slate-300">
              F/DD (PD/DD) (#19)
            </label>
            <input
              id="sim-pb"
              type="number"
              step="0.2"
              value={pbRatio}
              onChange={(e) => setPbRatio(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-float" className="block text-[11px] font-medium text-slate-300">
              Fiili Dolaşım % (#12)
            </label>
            <input
              id="sim-float"
              type="number"
              step="0.5"
              value={freeFloatPct}
              onChange={(e) => setFreeFloatPct(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-top1" className="block text-[11px] font-medium text-slate-300">
              İlk Kurum Takas % (#14)
            </label>
            <input
              id="sim-top1"
              type="number"
              step="0.5"
              value={top1BrokerSharePct}
              onChange={(e) => setTop1BrokerSharePct(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-ceil" className="block text-[11px] font-medium text-slate-300">
              Ardışık Tavan (#1)
            </label>
            <input
              id="sim-ceil"
              type="number"
              min="0"
              max="15"
              value={consecutiveCeilings}
              onChange={(e) => setConsecutiveCeilings(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-ocf" className="block text-[11px] font-medium text-slate-300">
              Nakit / Net Kâr (#22)
            </label>
            <input
              id="sim-ocf"
              type="number"
              step="0.1"
              value={ocfToNetIncome}
              onChange={(e) => setOcfToNetIncome(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-ben" className="block text-[11px] font-medium text-slate-300">
              Beneish M-Skoru (#21)
            </label>
            <input
              id="sim-ben"
              type="number"
              step="0.05"
              value={beneishMScore}
              onChange={(e) => setBeneishMScore(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-aud" className="block text-[11px] font-medium text-slate-300">
              Denetçi Değişimi (#26)
            </label>
            <input
              id="sim-aud"
              type="number"
              min="0"
              max="6"
              value={auditorChanges3Y}
              onChange={(e) => setAuditorChanges3Y(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-cfo" className="block text-[11px] font-medium text-slate-300">
              YK/CFO Değişimi (#27)
            </label>
            <input
              id="sim-cfo"
              type="number"
              min="0"
              max="8"
              value={cfoChanges12M}
              onChange={(e) => setCfoChanges12M(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <label htmlFor="sim-hype" className="block text-[11px] font-medium text-slate-300">
              Sosyal Medya Z (#47)
            </label>
            <input
              id="sim-hype"
              type="number"
              step="0.2"
              value={socialHypeZScore}
              onChange={(e) => setSocialHypeZScore(Number(e.target.value))}
              className="mt-1 w-full px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-100"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            Simülasyonu Karşılaştırma Tablosuna Ekle ve İncele
          </button>
        </div>
      </form>
    </section>
  );
};
