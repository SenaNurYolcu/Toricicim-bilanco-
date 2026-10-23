import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePearsonCorrelation,
  classifyRelatedParty,
  CORE_20_FILTER_NUMBERS,
  evaluateCompany60Filters,
  generateActionableTakeaways,
  getCore20DefaultWeights,
  isCore20Filter,
  SIXTY_FILTERS,
} from './forensicEngine';
import { BIST_FORENSIC_COMPANIES } from '../data/bistForensicData';

test('SIXTY_FILTERS contains all 60 numbered filters (1-30 Core + 31-60 Extra Flags) across groups A-L', () => {
  assert.equal(SIXTY_FILTERS.length, 60);
  const coreFilters = SIXTY_FILTERS.filter((f) => !f.isExtraFlag);
  const extraFilters = SIXTY_FILTERS.filter((f) => f.isExtraFlag);
  assert.equal(coreFilters.length, 30);
  assert.equal(extraFilters.length, 30);

  // Verify specific filter names
  const f1 = SIXTY_FILTERS.find((f) => f.no === 1)!;
  assert.equal(f1.filterName, 'Ardışık tavan sayısı');
  const f14 = SIXTY_FILTERS.find((f) => f.no === 14)!;
  assert.equal(f14.filterName, 'Tek aracı kurum takas payı');
  const f26 = SIXTY_FILTERS.find((f) => f.no === 26)!;
  assert.equal(f26.filterName, 'Denetçi değişimi / görüş');
  const f36 = SIXTY_FILTERS.find((f) => f.no === 36)!;
  assert.equal(f36.filterName, 'İşlem yasaklı kişi–şirket bağlantısı');
  const f44 = SIXTY_FILTERS.find((f) => f.no === 44)!;
  assert.equal(f44.filterName, 'Temerrüt / konkordato / kredi notu izlemesi');
  const f57 = SIXTY_FILTERS.find((f) => f.no === 57)!;
  assert.equal(f57.filterName, 'Fon işlem durdurma / tasfiye');
  const f60 = SIXTY_FILTERS.find((f) => f.no === 60)!;
  assert.equal(f60.filterName, 'Sektör düzenleme belirsizliği');
});

test('CORE_20_FILTER_NUMBERS distinguishes the 20 most important filters and sets 40 secondary filters to weight 0 by default', () => {
  assert.equal(CORE_20_FILTER_NUMBERS.length, 20);
  const defaultWeights = getCore20DefaultWeights();
  const nonZeroCount = Object.values(defaultWeights).filter((w) => w > 0).length;
  const zeroCount = Object.values(defaultWeights).filter((w) => w === 0).length;
  assert.equal(nonZeroCount, 20);
  assert.equal(zeroCount, 40);

  for (const no of CORE_20_FILTER_NUMBERS) {
    assert.equal(isCore20Filter(no), true);
    assert.ok(defaultWeights[no] >= 2);
  }
});

test('KTLEV and A1CAP trigger high weighted risk scores and dikkat_gerektiriyor across both 20-Core and 60-All modes', () => {
  const core20Weights = getCore20DefaultWeights();

  const ktlev = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'KTLEV')!;
  const resKtlev = evaluateCompany60Filters(ktlev, core20Weights);
  assert.equal(resKtlev.outcome, 'dikkat_gerektiriyor');
  assert.ok(resKtlev.weightedRiskScore100 >= 80);

  const a1cap = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'A1CAP')!;
  const resA1 = evaluateCompany60Filters(a1cap, core20Weights);
  assert.equal(resA1.outcome, 'dikkat_gerektiriyor');
  assert.ok(resA1.weightedRiskScore100 >= 65);
});

test('THYAO, EREGL, and ASELS produce low risk scores and actionable plain-Turkish takeaways', () => {
  const core20Weights = getCore20DefaultWeights();

  const thyao = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'THYAO')!;
  const resThyao = evaluateCompany60Filters(thyao, core20Weights);
  assert.equal(resThyao.totalTriggeredCount, 0);
  assert.equal(resThyao.weightedRiskScore100, 0);
  const tkThyao = generateActionableTakeaways(thyao, resThyao);
  assert.ok(tkThyao.balanceSheetTakeaway.includes('doğrudan kasaya nakit olarak giriyor'));
  assert.ok(tkThyao.fundFlowTakeaway.includes('kurumsal yatırımcı uzun vadeli biriktiriyor'));

  const eregl = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'EREGL')!;
  const resEregl = evaluateCompany60Filters(eregl, core20Weights);
  assert.equal(resEregl.weightedRiskScore100, 0);
  const tkEregl = generateActionableTakeaways(eregl, resEregl);
  assert.ok(tkEregl.forwardBalanceSheetTakeaway.includes('İyi şirket gelecek bilançosunu fiyatlar'));

  const asels = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'ASELS')!;
  const resAsels = evaluateCompany60Filters(asels, core20Weights);
  assert.equal(resAsels.totalTriggeredCount, 0);
  assert.equal(resAsels.weightedRiskScore100, 0);
  assert.equal(resAsels.outcome, 'belirgin_isaret_yok');
});

test('Pearson correlation and PCAOB AS 2410 classifier behave deterministically', () => {
  const rPos = calculatePearsonCorrelation([10, 20, 30, 40], [15, 30, 45, 60]);
  assert.equal(rPos, 1);

  const rNeg = calculatePearsonCorrelation([10, 20, 30, 40], [80, 60, 40, 20]);
  assert.equal(rNeg, -1);

  const rp = classifyRelatedParty({
    q1_execControlLink: 'yes',
    q2_actualTransaction: 'yes',
    q3_sameCounterparty: 'yes',
    q4_financialImpactDisclosed: 'yes',
    q5_businessPurposeDisclosed: 'unknown',
    q6_independentControlOrApproval: 'no',
    counterpartyName: 'Test A.Ş.',
    evidenceQuote: 'Dipnot 24',
    sourceRef: '2026/06',
  });
  assert.equal(rp.priority, 'first_review');
});

test('KTLEV and OZATD include TEFAS scraped fund holdings, Sentimentil media scores, and Balance Sheet Health models', () => {
  const ktlev = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'KTLEV')!;
  const ozatd = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'OZATD')!;

  assert.ok(ktlev.scrapedFundHoldings.length >= 5);
  assert.ok(ktlev.scrapedFundHoldings.some((f) => f.fundCode === 'PHE'));
  assert.ok(ktlev.scrapedSentimentChannels.length >= 3);
  assert.equal(ktlev.balanceSheetHealth.overallHealthScore100, 34);
  assert.ok(
    ktlev.balanceSheetHealth.currentPriceImpliedGrowthPct >
      ktlev.balanceSheetHealth.fundamentalsSupportedGrowthPct
  );

  assert.ok(ozatd.scrapedFundHoldings.length >= 3);
  assert.ok(ozatd.scrapedSentimentChannels.length >= 3);
  assert.equal(ozatd.balanceSheetHealth.overallHealthScore100, 61);
  assert.ok(ozatd.balanceSheetHealth.kapExtractedFacts.length >= 4);

  const thyao = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'THYAO')!;
  const eregl = BIST_FORENSIC_COMPANIES.find((c) => c.symbol === 'EREGL')!;
  assert.ok(thyao);
  assert.ok(eregl);
  assert.equal(thyao.balanceSheetHealth.overallHealthScore100, 88);
  assert.equal(eregl.balanceSheetHealth.overallHealthScore100, 78);
});
