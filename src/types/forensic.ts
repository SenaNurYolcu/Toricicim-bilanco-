export type FilterGroupCode =
  | 'A' // Fiyat ve hacim anomalisi (1-7)
  | 'B' // Likidite ve piyasa mikro yapısı (8-11)
  | 'C' // Sahiplik ve dolaşım (12-15)
  | 'D' // Halka arz yaşam döngüsü (16-18)
  | 'E' // Temel analiz ve kâr kalitesi (19-25)
  | 'F' // Yönetişim ve içerden hareket (26-30)
  | 'G' // Düzenleyici ve borsa tedbirleri (31-36)
  | 'H' // KAP olay akışı (37-45)
  | 'I' // Dikkat ve kalabalık (46-49)
  | 'J' // Piyasa yapısı ve kaldıraç (50-54)
  | 'K' // Fon ve halka arz yapısı (55-59)
  | 'L'; // Sektör ve düzenleme (60)

export type SignalLevel = 'critical' | 'review' | 'context';

export type OverallOutcome =
  | 'dikkat_gerektiriyor'
  | 'sinirli_isaret'
  | 'yetersiz_veri'
  | 'belirgin_isaret_yok';

export type DataAccessType = 'Kamuya açık' | 'Doğrulanmalı' | 'Ücretli olabilir';

export interface SixtyFilterDefinition {
  no: number; // 1 to 60
  id: string; // e.g. 'F01' .. 'F60'
  groupCode: FilterGroupCode;
  moduleName: string;
  filterName: string;
  measurementAndThreshold: string;
  whyItMatters: string;
  sourceCode: string;
  dataAccess: DataAccessType;
  defaultWeight: number;
  severityIfTriggered: SignalLevel;
  isExtraFlag: boolean;
}

export interfaceFinancialRatioHistoryPoint {
  period: string;
  currentRatio: number;
  debtToEquity: number;
  peRatio: number;
  pbRatio: number;
  sectorCurrentRatio: number;
  sectorDebtToEquity: number;
  sectorPeRatio: number;
  sectorPbRatio: number;
  cpiInflationPct: number;
  policyInterestRatePct: number;
  gdpGrowthPct: number;
}

export type FinancialRatioHistoryPoint = interfaceFinancialRatioHistoryPoint;

export interface MacroCorrelationSummary {
  metricName: string;
  corrWithInflation: number;
  corrWithInterestRate: number;
  corrWithGdpGrowth: number;
  statisticalInterpretation: string;
}

export interface CorporateGovernanceScorecard {
  overallScore: number;
  boardIndependenceScore: number;
  auditCommitteeEffectiveness: number;
  kapDisclosureTransparency: number;
  minorityShareholderProtection: number;
  auditorChanges3Y: number;
  boardAndCfoChanges12M: number;
  estimatedPriceImpactOfChangesPct: number;
}

export interface WhaleTransactionTier {
  tierName: 'Mega Balina (>25 Mn TL / Emir)' | 'Kurumsal / Serbest Fon Balinası (5-25 Mn TL)' | 'Orta Ölçekli Spekülatif Grup (1-5 Mn TL)' | 'Perakende Kalabalık (<1 Mn TL)';
  buyVolumeMlnTL: number;
  sellVolumeMlnTL: number;
  netVolumeMlnTL: number;
  shareOfTotalVolumePct: number;
  trendDirection: 'Güçlü Dağıtım (Çıkış)' | 'Agresif Toplama (Giriş)' | 'Karşılıklı Paslaşma (Wash)' | 'Zirvede Mal Devralma (FOMO)';
}

export interface BrokerFlowEntry {
  brokerName: string;
  brokerCode: string;
  netLots: number;
  netVolumeTL: number;
  shareOfTotalVolumePct: number;
  averageCostTL: number;
  role: 'whale_accumulator' | 'whale_distributor' | 'retail_crowd' | 'institutional';
}

export interface GovernanceTimelineEvent {
  date: string;
  category: 'auditor_change' | 'cfo_change' | 'board_resignation' | 'spk_penalty' | 'kap_delay' | 'fund_exit' | 'paid_capital_change';
  title: string;
  actor: string;
  quoteOrEvidence: string;
  sourceUrl: string;
  priceImpact10dCarPct: number;
  severity: SignalLevel;
}

export interface RelatedPartyQuestion {
  q1_execControlLink: 'yes' | 'no' | 'unknown' | 'conflicting';
  q2_actualTransaction: 'yes' | 'no' | 'unknown' | 'conflicting';
  q3_sameCounterparty: 'yes' | 'no' | 'unknown' | 'conflicting';
  q4_financialImpactDisclosed: 'yes' | 'no' | 'unknown' | 'conflicting';
  q5_businessPurposeDisclosed: 'yes' | 'no' | 'unknown' | 'conflicting';
  q6_independentControlOrApproval: 'yes' | 'no' | 'unknown' | 'conflicting';
  counterpartyName: string;
  evidenceQuote: string;
  sourceRef: string;
}

export interface SentimentAndWhaleDivergence {
  newsSentimentScore: number; // -100 to +100
  economicReportScore: number; // -100 to +100
  socialMediaHypeScore: number; // 0 to 100
  combinedMarketSentimentScore: number; // 0 to 100 (Şirketin Medya Skoru)
  whaleNetFlowScore: number; // -100 to +100
  whaleVsSentimentDivergenceIndex: number; // 0 to 100
  predictedPriceImpactSummary: string;
}

export interface NewsAndEconomistNote {
  id: string;
  date: string;
  sourceType: 'KAP Özel Durum' | 'SPK Bülteni' | 'Ekonomist / Akademik Makale' | 'Aracı Kurum Raporu' | 'Sosyal Medya / Forum Taraması';
  authorOrInstitution: string;
  title: string;
  excerpt: string;
  sentimentOrWarning: 'critical_warning' | 'analytical_caution' | 'neutral_disclosure' | 'social_fomo_hype';
  relatedFilterNumbers: number[];
}

export interface PriceBar {
  date: string;
  close: number;
  xu100Close: number;
  volumeLots: number;
  topBrokerConcentrationPct: number;
  isLimitUpOrDown: 'tavan' | 'taban' | 'normal';
}

// NEW: Web Scraping TEFAS / KAP Fund Holdings Entry
export interface FundHoldingScrapedItem {
  fundCode: string; // e.g., 'PHE', 'PUK', 'KHA'
  fundName: string;
  founderInstitution: string;
  fundType: 'Serbest Fon' | 'Katılım Hisse Yoğun' | 'Hisse Senedi Yoğun' | 'Değişken / Karma Fon' | 'Algoritmik Strateji';
  weightInFundPct: number; // Fon içindeki ağırlık (%)
  shareOfFreeFloatPct: number; // Dolaşımdaki payın kaçta kaçını tuttuğu (%)
  monthlyFlowLots: number; // Son ay net lot değişimi
  riskFlagNote: string;
  sourceRef: string; // e.g. 'KAP Portföy Dağılım Raporu / TEFAS Scraping'
}

// NEW: Web Scraping Media & Public Sentiment (Sentimentil - Şirketin Medya Skoru)
export interface ScrapedSentimentChannel {
  channelName: string; // e.g., 'X (Twitter) & Finansal Furkan/Üstat Hesapları', 'Telegram VIP / Sinyal Grupları', 'Ekonomi Basını & Köşe Yazarları', 'KAP & SPK Resmi Bülten Tonu', 'Hisse Forumları (Investing / Mynet / TradingView)'
  scrapedPostCount30d: number;
  positiveRatioPct: number;
  negativeRatioPct: number;
  manipulationBotOrFomoIndex: number; // 0-100
  mediaScore100: number; // 0-100 (Şirketin Medya Skoru)
  sampleScrapedQuotes: string[];
  analyticalVerdict: string;
}

// NEW: Balance Sheet Health & Forward Balance Sheet Pricing ("İyi şirket gelecek bilançosunu fiyatlar")
export interface BalanceSheetHealthAndForwardPricing {
  overallHealthScore100: number; // 0-100 Bilanço Sağlık Puanı
  healthVerdictLabel: 'Kritik Bilanço Bozulması / Spekülatif Fiyatlama' | 'Nakit Akışı Uyarılı / Karışık Görünüm' | 'Sağlam Bilanço / Gelecek Bilançosunu Fiyatlıyor';
  altmanZScore: number;
  piotroskiFScore: number; // 0-9
  beneishMScore: number;
  currentPriceImpliedGrowthPct: number; // Mevcut hisse fiyatının ima ettiği yıllık kâr büyümesi (%)
  fundamentalsSupportedGrowthPct: number; // Bilanço ve siparişlerin (backlog) desteklediği gerçek büyüme (%)
  forwardPricingGapPct: number; // Fiyatlanan vs Gerçek Bilanço Beklentisi Sapması (%)
  advisorPrincipleCommentary: string; // "İyi bir şirket için anlamlı olan bilançodur. İyi şirket gelecek bilançosunu fiyatlar." açıklaması
  kapExtractedFacts: {
    conceptLabel: string;
    currentPeriodTL: string;
    previousPeriodTL: string;
    realChangePct: string;
    kapFootnoteRef: string;
    healthStatus: 'healthy' | 'warning' | 'critical';
  }[];
}

export interface FilterEvaluationDetail {
  filter: SixtyFilterDefinition;
  triggered: boolean;
  measuredValueText: string;
  weight: number;
  weightedContribution: number;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  sector: string;
  periodEnd: string;
  asOfDate: string;
  lastPriceTL: number;
  priceChange1dPct: number;
  caseSummaryTag: string;
  caseNarrative: string;
  whyItExploded: string;
  howWhalesOperated: string;
  filterMeasurements: Record<number, { triggered: boolean; valueText: string }>;
  financialRatioHistory: FinancialRatioHistoryPoint[];
  macroCorrelations: MacroCorrelationSummary[];
  governanceScorecard: CorporateGovernanceScorecard;
  governanceEvents: GovernanceTimelineEvent[];
  whaleTiers: WhaleTransactionTier[];
  sentimentSynthesis: SentimentAndWhaleDivergence;
  brokerFlows: BrokerFlowEntry[];
  relatedPartyAssessment: RelatedPartyQuestion;
  newsAndEconomists: NewsAndEconomistNote[];
  priceHistory: PriceBar[];
  // Advisor requested deep-dive modules:
  scrapedFundHoldings: FundHoldingScrapedItem[];
  scrapedSentimentChannels: ScrapedSentimentChannel[];
  balanceSheetHealth: BalanceSheetHealthAndForwardPricing;
}

export interface EvaluatedCompanyResult {
  company: CompanyProfile;
  evaluatedFilters: FilterEvaluationDetail[];
  triggeredCoreCount: number;
  triggeredExtraCount: number;
  totalTriggeredCount: number;
  totalActiveWeight: number;
  triggeredWeightedSum: number;
  weightedRiskScore100: number;
  activeGroupCount: number;
  outcome: OverallOutcome;
  relatedPartyClassification: {
    priority: 'first_review' | 'additional_review' | 'context' | 'unassessed';
    ruleId: string;
    explanation: string;
  };
}
