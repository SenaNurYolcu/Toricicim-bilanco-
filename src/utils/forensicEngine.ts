import {
  CompanyProfile,
  EvaluatedCompanyResult,
  FilterEvaluationDetail,
  FilterGroupCode,
  OverallOutcome,
  RelatedPartyQuestion,
  SixtyFilterDefinition,
} from '../types/forensic';

export const GROUP_DESCRIPTIONS: Record<FilterGroupCode, { code: FilterGroupCode; name: string; range: string }> = {
  A: { code: 'A', name: 'Fiyat ve hacim anomalisi', range: '1–7' },
  B: { code: 'B', name: 'Likidite ve piyasa mikro yapısı', range: '8–11' },
  C: { code: 'C', name: 'Sahiplik ve dolaşım', range: '12–15' },
  D: { code: 'D', name: 'Halka arz yaşam döngüsü', range: '16–18' },
  E: { code: 'E', name: 'Temel analiz ve kâr kalitesi', range: '19–25' },
  F: { code: 'F', name: 'Yönetişim ve içerden hareket', range: '26–30' },
  G: { code: 'G', name: 'Düzenleyici ve borsa tedbirleri', range: '31–36' },
  H: { code: 'H', name: 'KAP olay akışı', range: '37–45' },
  I: { code: 'I', name: 'Dikkat ve kalabalık', range: '46–49' },
  J: { code: 'J', name: 'Piyasa yapısı ve kaldıraç', range: '50–54' },
  K: { code: 'K', name: 'Fon ve halka arz yapısı', range: '55–59' },
  L: { code: 'L', name: 'Sektör ve düzenleme', range: '60' },
};

/**
 * Complete 60-Filter Catalog matching the uploaded spreadsheets:
 * - Filters 1–30: Hisse Risk Analizi – 30 Filtre (Grup A–F)
 * - Filters 31–60: Ek Bayrak Filtreler (31–60) (Grup G–L)
 */
export const SIXTY_FILTERS: SixtyFilterDefinition[] = [
  // GRUP A: Fiyat ve hacim anomalisi (1-7)
  {
    no: 1,
    id: 'F01',
    groupCode: 'A',
    moduleName: 'Fiyat ve hacim anomalisi',
    filterName: 'Ardışık tavan sayısı',
    measurementAndThreshold: 'Son 20 günde ≥3 ardışık tavan',
    whyItMatters: 'Sığ tahtada serbest fiyat keşfinin kilitlenmesi ve organize alım dalgası.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 2,
    id: 'F02',
    groupCode: 'A',
    moduleName: 'Fiyat ve hacim anomalisi',
    filterName: 'Getiri z-skoru',
    measurementAndThreshold: '20 günlük getiri, 1 yıllık dağılıma göre z > 3',
    whyItMatters: 'Normal dağılımda >3σ (p < 0.0013) aşırı uç istatistiksel fiyat sapması.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 3,
    id: 'F03',
    groupCode: 'A',
    moduleName: 'Fiyat ve hacim anomalisi',
    filterName: 'Hacim şoku',
    measurementAndThreshold: 'Günlük hacim / 60 günlük ortalama > 5',
    whyItMatters: 'Olağandışı işlem hacmi patlaması; tahtaya spekülatif grup girişi veya mal dağıtımı.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 4,
    id: 'F04',
    groupCode: 'A',
    moduleName: 'Fiyat ve hacim anomalisi',
    filterName: 'Zirveden düşüş (drawdown)',
    measurementAndThreshold: 'Son 6 ay zirvesinden > %30',
    whyItMatters: 'Balina çıkışı sonrası tahtanın çökmesi ve bireysel yatırımcının içeride kalması.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 5,
    id: 'F05',
    groupCode: 'A',
    moduleName: 'Fiyat ve hacim anomalisi',
    filterName: 'Volatilite sıçraması',
    measurementAndThreshold: '10 günlük / 60 günlük volatilite > 2',
    whyItMatters: 'Kısa vadeli oynaklığın tarihsel ortalamayı ikiye katlaması (rejimsel kırılma).',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 6,
    id: 'F06',
    groupCode: 'A',
    moduleName: 'Fiyat ve hacim anomalisi',
    filterName: 'Balon testi',
    measurementAndThreshold: 'PSY/BSADF istatistiği kritik değeri aşıyor',
    whyItMatters: 'Phillips-Shi-Yu (PSY) Backward Sup ADF testi ile patlayıcı balon (explosive bubble) tespiti.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 7,
    id: 'F07',
    groupCode: 'A',
    moduleName: 'Fiyat ve hacim anomalisi',
    filterName: 'Fiyat–hacim ayrışması',
    measurementAndThreshold: 'Fiyat yeni zirvede ama hacim düşüyor (negatif diverjans)',
    whyItMatters: 'Alıcı iştahı tükenirken az lotla fiyatın yukarıda tutulması (dağıtım öncesi tuzak).',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },

  // GRUP B: Likidite ve piyasa mikro yapısı (8-11)
  {
    no: 8,
    id: 'F08',
    groupCode: 'B',
    moduleName: 'Likidite ve piyasa mikro yapısı',
    filterName: 'Amihud illikidite',
    measurementAndThreshold: '|getiri| / TL hacim, evrenin üst %20\'si',
    whyItMatters: 'Birim işlem hacminin fiyatı aşırı hareket ettirmesi; çıkış anında likidite buharlaşması.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 9,
    id: 'F09',
    groupCode: 'B',
    moduleName: 'Likidite ve piyasa mikro yapısı',
    filterName: 'Corwin-Schultz spread',
    measurementAndThreshold: 'High-Low tahmini > %1',
    whyItMatters: 'Gün içi Yüksek-Düşük fiyatlardan tahmin edilen etkin alış-satış makası genişliği.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 10,
    id: 'F10',
    groupCode: 'B',
    moduleName: 'Likidite ve piyasa mikro yapısı',
    filterName: 'Günlük ortalama TL hacim',
    measurementAndThreshold: 'Alt sınır (örn. < 10 milyon TL)',
    whyItMatters: 'Sığ işlem hacmi nedeniyle küçük sermayeli gruplarca tahtanın kolayca domine edilmesi.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 11,
    id: 'F11',
    groupCode: 'B',
    moduleName: 'Likidite ve piyasa mikro yapısı',
    filterName: 'Hacim yoğunlaşması',
    measurementAndThreshold: 'Son 5 günün hacmi, 60 günlük hacmin > %40\'ı',
    whyItMatters: 'Tüm dönem hacminin birkaç güne sıkışması (panik çıkış veya zirve devri).',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },

  // GRUP C: Sahiplik ve dolaşım (12-15)
  {
    no: 12,
    id: 'F12',
    groupCode: 'C',
    moduleName: 'Sahiplik ve dolaşım',
    filterName: 'Fiili dolaşım oranı',
    measurementAndThreshold: '< %25 veya 3 ayda belirgin düşüş',
    whyItMatters: 'Dolaşımdaki lot sayısının azlığı, köşe sıkıştırma (cornering) operasyonlarını kolaylaştırır.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 13,
    id: 'F13',
    groupCode: 'C',
    moduleName: 'Sahiplik ve dolaşım',
    filterName: 'Piyasa değeri',
    measurementAndThreshold: 'Küçük şirket bandı (örn. < 5 milyar TL)',
    whyItMatters: 'Düşük piyasa değerli yan tahtaların spekülatif portföy saldırılarına açık olması.',
    sourceCode: 'Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'context',
    isExtraFlag: false,
  },
  {
    no: 14,
    id: 'F14',
    groupCode: 'C',
    moduleName: 'Sahiplik ve dolaşım',
    filterName: 'Tek aracı kurum takas payı',
    measurementAndThreshold: 'İlk kurum > %30',
    whyItMatters: 'Tek aracı kurum (örn. A1 Capital, Tera, İnfo) üzerinden tahta hakimiyeti.',
    sourceCode: 'Ü',
    dataAccess: 'Ücretli olabilir',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 15,
    id: 'F15',
    groupCode: 'C',
    moduleName: 'Sahiplik ve dolaşım',
    filterName: 'Fon sahipliği yoğunluğu',
    measurementAndThreshold: 'Tek fon/portföy şirketi payı yüksek',
    whyItMatters: 'Serbest fonlar üzerinden toplanan sığ payların fon çıkışı anında taban serisi yaratması.',
    sourceCode: 'K, TEFAS',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },

  // GRUP D: Halka arz yaşam döngüsü (16-18)
  {
    no: 16,
    id: 'F16',
    groupCode: 'D',
    moduleName: 'Halka arz yaşam döngüsü',
    filterName: 'Halka arzdan bu yana gün',
    measurementAndThreshold: '< 365 gün',
    whyItMatters: 'Yeni halka arzlarda fiyat geçmişi ve kurumsal yatırımcı derinliğinin henüz oturmamış olması.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'context',
    isExtraFlag: false,
  },
  {
    no: 17,
    id: 'F17',
    groupCode: 'D',
    moduleName: 'Halka arz yaşam döngüsü',
    filterName: 'Arz fiyatına göre getiri',
    measurementAndThreshold: '> %200',
    whyItMatters: 'Halka arz fiyatından kopuk, temel verilerle desteklenmeyen aşırı primlenme.',
    sourceCode: 'Y, K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 18,
    id: 'F18',
    groupCode: 'D',
    moduleName: 'Halka arz yaşam döngüsü',
    filterName: 'Lock-up bitişine kalan gün',
    measurementAndThreshold: 'Önümüzdeki 30 gün içinde',
    whyItMatters: 'Ortak/fon satmama taahhüdü (lock-up) bitişi öncesi borsada toplu pay satışı baskısı.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },

  // GRUP E: Temel analiz ve kâr kalitesi (19-25)
  {
    no: 19,
    id: 'F19',
    groupCode: 'E',
    moduleName: 'Temel analiz ve kâr kalitesi',
    filterName: 'Değerleme uç değerleri',
    measurementAndThreshold: 'F/K negatif veya > 50; PD/DD sektör medyanının 3 katı',
    whyItMatters: 'Sektör çarpanlarından tamamen kopmuş rasyolar (spekülatif fiyatlama kanıtı).',
    sourceCode: 'Y, K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 20,
    id: 'F20',
    groupCode: 'E',
    moduleName: 'Temel analiz ve kâr kalitesi',
    filterName: 'Piotroski F-skoru',
    measurementAndThreshold: '≤ 3 (zayıf)',
    whyItMatters: '9 kriterli Piotroski finansal sağlık testinde kârlılık, kaldıraç ve verimlilik zayıflığı.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 21,
    id: 'F21',
    groupCode: 'E',
    moduleName: 'Temel analiz ve kâr kalitesi',
    filterName: 'Beneish M-skoru',
    measurementAndThreshold: '> -1,78 (kâr manipülasyonu şüphesi)',
    whyItMatters: 'Tahakkuk, alacak süresi ve aktif kalitesi üzerinden bilanço makyajlama olasılığı.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 22,
    id: 'F22',
    groupCode: 'E',
    moduleName: 'Temel analiz ve kâr kalitesi',
    filterName: 'Nakit akışı / net kâr',
    measurementAndThreshold: '< 0,5',
    whyItMatters: 'Adli Muhasebe F01 Kuralı: Raporlanan kârın kasaya gerçek nakit olarak girmemesi.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 23,
    id: 'F23',
    groupCode: 'E',
    moduleName: 'Temel analiz ve kâr kalitesi',
    filterName: 'Net parasal pozisyon payı',
    measurementAndThreshold: 'Net kârın büyük kısmı TMS 29 kazancından geliyor',
    whyItMatters: 'Adli Muhasebe F04 Kuralı: Enflasyon muhasebesi kaynaklı nakit dışı kağıt kârı.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 24,
    id: 'F24',
    groupCode: 'E',
    moduleName: 'Temel analiz ve kâr kalitesi',
    filterName: 'Borç yükü',
    measurementAndThreshold: 'Net borç/FAVÖK > 4 veya faiz karşılama < 1,5',
    whyItMatters: 'Yüksek faiz ortamında finansman giderlerinin faaliyet kârını eritmesi ve temerrüt riski.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 25,
    id: 'F25',
    groupCode: 'E',
    moduleName: 'Temel analiz ve kâr kalitesi',
    filterName: 'Gelir–kâr ayrışması',
    measurementAndThreshold: 'Satışlar artarken brüt kâr/FAVÖK düşüyor',
    whyItMatters: 'Fiktif ciro şişirme veya marj erimesine rağmen hacim gösterme çabası.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },

  // GRUP F: Yönetişim ve içerden hareket (26-30)
  {
    no: 26,
    id: 'F26',
    groupCode: 'F',
    moduleName: 'Yönetişim ve içerden hareket',
    filterName: 'Denetçi değişimi / görüş',
    measurementAndThreshold: '3 yılda ≥2 değişim veya şartlı/olumsuz görüş',
    whyItMatters: 'Denetim şefi sürekli değişiyorsa (opinion shopping) veya şartlı görüş varsa muhasebe uyuşmazlığı vardır.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 27,
    id: 'F27',
    groupCode: 'F',
    moduleName: 'Yönetişim ve içerden hareket',
    filterName: 'Yönetici değişimi',
    measurementAndThreshold: '12 ayda YK/CFO değişim sayısı ≥2',
    whyItMatters: 'Finans direktörü (CFO) ve yönetim kurulu istifaları bilanço öncesi erken uyarı sinyalidir.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 28,
    id: 'F28',
    groupCode: 'F',
    moduleName: 'Yönetişim ve içerden hareket',
    filterName: 'İçeriden satış ve rehin',
    measurementAndThreshold: 'Ortak/yönetici satışı veya rehinli pay oranı yüksek',
    whyItMatters: 'Hisse yükselirken patronun pay satması veya paylarını kredi teminatına rehin vermesi.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },
  {
    no: 29,
    id: 'F29',
    groupCode: 'F',
    moduleName: 'Yönetişim ve içerden hareket',
    filterName: 'Sermaye hareketi sıklığı',
    measurementAndThreshold: '24 ayda sermaye artırımı/bedelsiz ≥3',
    whyItMatters: 'Sürekli bedelli/bedelsiz sermaye artırımı hikayesiyle tahtada spekülatif beklenti yaratılması.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: false,
  },
  {
    no: 30,
    id: 'F30',
    groupCode: 'F',
    moduleName: 'Yönetişim ve içerden hareket',
    filterName: 'İlişkili taraf işlemleri',
    measurementAndThreshold: 'Gelir veya varlıklara oranı yüksek',
    whyItMatters: 'PCAOB AS 2410 Denetim Standardı: Şirket kaynaklarının ilişkili grup şirketlerine aktarılması.',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: false,
  },

  // EK BAYRAK FİLTRELER (31-60)
  // GRUP G: Düzenleyici ve borsa tedbirleri (31-36)
  {
    no: 31,
    id: 'F31',
    groupCode: 'G',
    moduleName: 'Düzenleyici ve borsa tedbirleri',
    filterName: 'Volatilite bazlı tedbir (VBTS) kademesi',
    measurementAndThreshold: 'Son 60 günde tedbir alındı mı, kaç gün sürdü',
    whyItMatters: 'Borsa, anormal hareketi sizden önce görür',
    sourceCode: 'B',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 32,
    id: 'F32',
    groupCode: 'G',
    moduleName: 'Düzenleyici ve borsa tedbirleri',
    filterName: 'Tedbir sonrası performans',
    measurementAndThreshold: 'Tedbirin kalktığı günden sonraki 10 günlük getiri',
    whyItMatters: 'Tedbir bitince çıkış başlıyor mu?',
    sourceCode: 'B, Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 33,
    id: 'F33',
    groupCode: 'G',
    moduleName: 'Düzenleyici ve borsa tedbirleri',
    filterName: 'Pay bazında devre kesici sayısı',
    measurementAndThreshold: 'Son 30 günde tetiklenme adedi',
    whyItMatters: 'Aşırı fiyat hareketinin doğrudan kanıtı',
    sourceCode: 'B',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 34,
    id: 'F34',
    groupCode: 'G',
    moduleName: 'Düzenleyici ve borsa tedbirleri',
    filterName: 'İşlem sırası kapatma / tek fiyata geçiş',
    measurementAndThreshold: 'Son 90 günde adet',
    whyItMatters: 'Düzenleyici müdahale sinyali',
    sourceCode: 'B',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 35,
    id: 'F35',
    groupCode: 'G',
    moduleName: 'Düzenleyici ve borsa tedbirleri',
    filterName: 'SPK idari para cezası geçmişi',
    measurementAndThreshold: 'Şirket, ortak veya yöneticiler adına son 3 yılda',
    whyItMatters: 'Tekrarlayan uyumsuzluk',
    sourceCode: 'S',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 36,
    id: 'F36',
    groupCode: 'G',
    moduleName: 'Düzenleyici ve borsa tedbirleri',
    filterName: 'İşlem yasaklı kişi–şirket bağlantısı',
    measurementAndThreshold: 'SPK listesindeki kişilerin ortak/yönetici/fon yöneticisi olup olmadığı',
    whyItMatters: 'Katılımevim\'de yasaklılar arasında fon yöneticileri de vardı',
    sourceCode: 'S, K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },

  // GRUP H: KAP olay akışı (37-45)
  {
    no: 37,
    id: 'F37',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Özel durum açıklaması yoğunluğu',
    measurementAndThreshold: 'Son 30 günde bildirim sayısı, evren medyanına göre',
    whyItMatters: 'Haber akışıyla fiyat şişirme',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 38,
    id: 'F38',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Habersiz hareket / haber öncesi fiyat',
    measurementAndThreshold: 'Haberden önceki 5 günde anormal getiri (CAR)',
    whyItMatters: 'Bilgi sızıntısı veya içeriden öğrenen işlemi göstergesi',
    sourceCode: 'K, Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 39,
    id: 'F39',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Faaliyet alanı veya unvan değişikliği',
    measurementAndThreshold: 'Esas sözleşme / ticaret unvanı değişikliği, trend bir temaya geçiş',
    whyItMatters: 'Klasik "tema" pump sinyali',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 40,
    id: 'F40',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Kontrol değişimi / pay devri / pay alım teklifi',
    measurementAndThreshold: 'Pay devri, muafiyet talebi, görüşme duyurusu',
    whyItMatters: 'Yüksek volatilite ve spekülasyon ortamı',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 41,
    id: 'F41',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Sermaye operasyonu duyurusu öncesi hareket',
    measurementAndThreshold: 'Bedelsiz/bedelli açıklamasından önceki 20 gün getirisi',
    whyItMatters: 'Beklenti ve dedikodu üzerinden oyun',
    sourceCode: 'K, Y',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 42,
    id: 'F42',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Finansal tablo gecikmesi / yeniden düzenleme',
    measurementAndThreshold: 'Son tarihten sonra yayın, düzeltme bildirimi',
    whyItMatters: 'Muhasebe kalitesi sorunu',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 43,
    id: 'F43',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Pay geri alım programı zamanlaması',
    measurementAndThreshold: 'Program ilanı sonrası içeriden satış var mı',
    whyItMatters: 'Geri alım ile satış çelişkisi',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 44,
    id: 'F44',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Temerrüt / konkordato / kredi notu izlemesi',
    measurementAndThreshold: 'Bu başlıkların KAP\'ta geçmesi',
    whyItMatters: 'Karşı taraf riski (A1 Capital tipi)',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 45,
    id: 'F45',
    groupCode: 'H',
    moduleName: 'KAP olay akışı',
    filterName: 'Dava, soruşturma, vergi incelemesi',
    measurementAndThreshold: 'Hukuki başlıklı özel durum açıklamaları',
    whyItMatters: 'Operasyon haberi sonrası ani taban riski',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },

  // GRUP I: Dikkat ve kalabalık (46-49)
  {
    no: 46,
    id: 'F46',
    groupCode: 'I',
    moduleName: 'Dikkat ve kalabalık',
    filterName: 'Arama ilgisi sıçraması',
    measurementAndThreshold: 'Google Trends son 7 gün / son 90 gün oranı',
    whyItMatters: 'Bireysel yatırımcı ilgisi (Barber-Odean)',
    sourceCode: 'Ü',
    dataAccess: 'Ücretli olabilir',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 47,
    id: 'F47',
    groupCode: 'I',
    moduleName: 'Dikkat ve kalabalık',
    filterName: 'Sosyal medya anma sıçraması',
    measurementAndThreshold: 'X/Telegram/YouTube anma sayısı z-skoru',
    whyItMatters: 'Organize tanıtım göstergesi',
    sourceCode: 'Ü',
    dataAccess: 'Ücretli olabilir',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 48,
    id: 'F48',
    groupCode: 'I',
    moduleName: 'Dikkat ve kalabalık',
    filterName: 'Yatırımcı sayısı artışı',
    measurementAndThreshold: 'Hisse bazında ortak sayısında ani artış',
    whyItMatters: 'Bireysel kalabalık oluşumu (veri erişimini doğrulayın)',
    sourceCode: 'MKK, Ü',
    dataAccess: 'Doğrulanmalı',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 49,
    id: 'F49',
    groupCode: 'I',
    moduleName: 'Dikkat ve kalabalık',
    filterName: 'Hisse forumu yorum yoğunluğu',
    measurementAndThreshold: 'Forum/yorum sayısı, evren medyanına göre',
    whyItMatters: 'Heyecan ve FOMO ölçütü',
    sourceCode: 'Ü',
    dataAccess: 'Ücretli olabilir',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },

  // GRUP J: Piyasa yapısı ve kaldıraç (50-54)
  {
    no: 50,
    id: 'F50',
    groupCode: 'J',
    moduleName: 'Piyasa yapısı ve kaldıraç',
    filterName: 'Kredili işlem payı',
    measurementAndThreshold: 'Kredili alım bakiyesi / dolaşımdaki lot',
    whyItMatters: 'Kaldıraç düşüşü hızlandırır (veri erişimini doğrulayın)',
    sourceCode: 'B, Ü',
    dataAccess: 'Doğrulanmalı',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 51,
    id: 'F51',
    groupCode: 'J',
    moduleName: 'Piyasa yapısı ve kaldıraç',
    filterName: 'Açığa satış oranı',
    measurementAndThreshold: 'Açığa satış pozisyonu / dolaşım',
    whyItMatters: 'Fiyat baskısı veya sıkışma riski',
    sourceCode: 'B, Ü',
    dataAccess: 'Doğrulanmalı',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 52,
    id: 'F52',
    groupCode: 'J',
    moduleName: 'Piyasa yapısı ve kaldıraç',
    filterName: 'Endeks giriş/çıkış olayı',
    measurementAndThreshold: 'Katılım endeksi, BIST100, halka arz endeksi değişimi',
    whyItMatters: 'Fon kaynaklı zorunlu alım/satım',
    sourceCode: 'B',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'context',
    isExtraFlag: true,
  },
  {
    no: 53,
    id: 'F53',
    groupCode: 'J',
    moduleName: 'Piyasa yapısı ve kaldıraç',
    filterName: 'Kapanış seansı hareketi',
    measurementAndThreshold: 'Son 10 dakika getirisi (gün içi veri gerekir)',
    whyItMatters: 'Kapanış fiyatını oynatma',
    sourceCode: 'Ü',
    dataAccess: 'Doğrulanmalı',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 54,
    id: 'F54',
    groupCode: 'J',
    moduleName: 'Piyasa yapısı ve kaldıraç',
    filterName: 'Yeni aracı kurum girişi',
    measurementAndThreshold: 'Takas listesinde yeni ve baskın aracı kurum',
    whyItMatters: 'Organize alım göstergesi',
    sourceCode: 'Ü',
    dataAccess: 'Doğrulanmalı',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },

  // GRUP K: Fon ve halka arz yapısı (55-59)
  {
    no: 55,
    id: 'F55',
    groupCode: 'K',
    moduleName: 'Fon ve halka arz yapısı',
    filterName: 'Fon yoğunlaşması',
    measurementAndThreshold: 'Tek portföy şirketi fonlarının toplam payı',
    whyItMatters: 'Tek elde toplanan pay, fiili dolaşımı düşürür',
    sourceCode: 'K, T',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 56,
    id: 'F56',
    groupCode: 'K',
    moduleName: 'Fon ve halka arz yapısı',
    filterName: 'Grup içi fon–hisse bağlantısı',
    measurementAndThreshold: 'Fonun kurucusu ile şirketin aynı gruptan olması',
    whyItMatters: 'Çıkar çatışması',
    sourceCode: 'K, T',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 57,
    id: 'F57',
    groupCode: 'K',
    moduleName: 'Fon ve halka arz yapısı',
    filterName: 'Fon işlem durdurma / tasfiye',
    measurementAndThreshold: 'TEFAS\'ta alım-satımın kapatılması',
    whyItMatters: 'A1 Capital örneği',
    sourceCode: 'T, S',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
  {
    no: 58,
    id: 'F58',
    groupCode: 'K',
    moduleName: 'Fon ve halka arz yapısı',
    filterName: 'Halka arz tahsisat yapısı',
    measurementAndThreshold: 'Bireysel/kurumsal pay, katılımcı sayısı, talep/arz oranı',
    whyItMatters: 'Dar dağıtım ve ön belirlenmiş hesap iddiaları',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },
  {
    no: 59,
    id: 'F59',
    groupCode: 'K',
    moduleName: 'Fon ve halka arz yapısı',
    filterName: 'Fiyat tespit raporu farkı',
    measurementAndThreshold: 'Arz fiyatı ile rapordaki değer arasındaki fark',
    whyItMatters: 'Aşırı iskonto fiyat sıçramasını besler',
    sourceCode: 'K',
    dataAccess: 'Kamuya açık',
    defaultWeight: 1,
    severityIfTriggered: 'review',
    isExtraFlag: true,
  },

  // GRUP L: Sektör ve düzenleme (60)
  {
    no: 60,
    id: 'F60',
    groupCode: 'L',
    moduleName: 'Sektör ve düzenleme',
    filterName: 'Sektör düzenleme belirsizliği',
    measurementAndThreshold: 'Düzenleyici kurum açıklaması veya haber sayısı',
    whyItMatters: 'Evim sistemi sektöründe BDDK düzenlemeleri ve TMSF el koyma riskleri',
    sourceCode: 'Ü',
    dataAccess: 'Ücretli olabilir',
    defaultWeight: 1,
    severityIfTriggered: 'critical',
    isExtraFlag: true,
  },
];

/**
 * 6-question PCAOB AS 2410 related-party classifier.
 */
export function classifyRelatedParty(rel: RelatedPartyQuestion): {
  priority: 'first_review' | 'additional_review' | 'context' | 'unassessed';
  ruleId: string;
  explanation: string;
} {
  const coreAnswers = [rel.q1_execControlLink, rel.q2_actualTransaction, rel.q3_sameCounterparty];
  const controlAnswers = [
    rel.q4_financialImpactDisclosed,
    rel.q5_businessPurposeDisclosed,
    rel.q6_independentControlOrApproval,
  ];

  if (coreAnswers.includes('conflicting')) {
    return {
      priority: 'unassessed',
      ruleId: 'related-party-2/conflicting',
      explanation:
        'Temel bağlantı veya işlem sorularında çelişkili kanıt var; otomatik öncelik ataması yapılmadı (Değerlendirilemedi).',
    };
  }

  if (coreAnswers.every((a) => a === 'yes')) {
    const missingGovernance = controlAnswers.some((a) => a !== 'yes');
    if (missingGovernance) {
      return {
        priority: 'first_review',
        ruleId: 'related-party-2/first-review',
        explanation:
          'Yönetici kontrol bağı, gerçekleşmiş işlem ve aynı karşı taraf doğrulandı; ticari amaç veya bağımsız değerleme/onay açıklaması eksik (PCAOB AS 2410 Öncelikli İnceleme).',
      };
    }
    return {
      priority: 'additional_review',
      ruleId: 'related-party-2/additional-review-documented',
      explanation:
        'Yönetici bağlantılı ilişkili taraf işlemi mevcut; finansal etki ve onay süreçleri beyan edilmiş olsa da bağımsız teyit için ek inceleme önerilir.',
    };
  }

  if (rel.q2_actualTransaction === 'yes') {
    return {
      priority: 'additional_review',
      ruleId: 'related-party-2/additional-review',
      explanation: 'İlişkili tarafla gerçekleşmiş işlem mevcut ancak doğrudan yönetici kontrol bağı belirsiz.',
    };
  }

  return {
    priority: 'context',
    ruleId: 'related-party-2/context',
    explanation: 'Sıradan sözleşme veya tek başına pasif ortaklık bağlamı; gerçekleşmiş kritik işlem sinyali yok.',
  };
}

/**
 * Pure Pearson correlation coefficient r between two numeric arrays.
 */
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  if (den === 0) return 0;
  return Number((num / den).toFixed(2));
}

/**
 * Evaluates a CompanyProfile against all 60 filters with user-customizable weights (0 to 5).
 */
export function evaluateCompany60Filters(
  company: CompanyProfile,
  weightsByNo: Record<number, number>
): EvaluatedCompanyResult {
  const evaluatedFilters: FilterEvaluationDetail[] = [];
  let triggeredCoreCount = 0;
  let triggeredExtraCount = 0;
  let totalActiveWeight = 0;
  let triggeredWeightedSum = 0;
  const activeGroups = new Set<FilterGroupCode>();

  for (const def of SIXTY_FILTERS) {
    const weight = weightsByNo[def.no] !== undefined ? weightsByNo[def.no] : def.defaultWeight;
    const measurement = company.filterMeasurements[def.no] || {
      triggered: false,
      valueText: 'Veri normal aralıkta',
    };
    const isActive = weight > 0;
    const isTriggered = isActive && measurement.triggered;

    if (isActive) {
      totalActiveWeight += weight;
    }

    if (isTriggered) {
      if (def.no <= 30) {
        triggeredCoreCount += 1;
      } else {
        triggeredExtraCount += 1;
      }
      triggeredWeightedSum += weight;
      if (def.severityIfTriggered !== 'context') {
        activeGroups.add(def.groupCode);
      }
    }

    evaluatedFilters.push({
      filter: def,
      triggered: isTriggered,
      measuredValueText: measurement.valueText,
      weight,
      weightedContribution: isTriggered ? weight : 0,
    });
  }

  const totalTriggeredCount = triggeredCoreCount + triggeredExtraCount;
  const weightedRiskScore100 =
    totalActiveWeight > 0
      ? Math.min(100, Math.round((triggeredWeightedSum / totalActiveWeight) * 100))
      : 0;

  const hasCriticalTriggered = evaluatedFilters.some(
    (ef) => ef.triggered && ef.filter.severityIfTriggered === 'critical'
  );

  let outcome: OverallOutcome;
  if (totalActiveWeight === 0) {
    outcome = 'yetersiz_veri';
  } else if (hasCriticalTriggered || activeGroups.size >= 2) {
    outcome = 'dikkat_gerektiriyor';
  } else if (activeGroups.size === 1 || totalTriggeredCount > 0) {
    outcome = 'sinirli_isaret';
  } else {
    outcome = 'belirgin_isaret_yok';
  }

  return {
    company,
    evaluatedFilters,
    triggeredCoreCount,
    triggeredExtraCount,
    totalTriggeredCount,
    totalActiveWeight,
    triggeredWeightedSum,
    weightedRiskScore100,
    activeGroupCount: activeGroups.size,
    outcome,
    relatedPartyClassification: classifyRelatedParty(company.relatedPartyAssessment),
  };
}

export interface ActionableTakeaways {
  overallVerdictTitle: string;
  overallVerdictShort: string;
  balanceSheetTakeaway: string;
  fundFlowTakeaway: string;
  forwardBalanceSheetTakeaway: string;
  sentimentMediaTakeaway: string;
  selectedFilterDynamicCommentary: string;
  selectedActiveCount: number;
  selectedTriggeredNames: string[];
  netFundFlowLots: number;
  freeFundFloatSharePct: number;
}

/**
 * Automatically synthesizes short, actionable plain-Turkish takeaways ("Bundan Ne Çıkarmalıyım?")
 * from a company's Balance Sheet Health, TEFAS Fund Flows, Forward Pricing Gap, Sentimentil Media Score,
 * AND the exact subset of filters currently selected by the user.
 */
export function generateActionableTakeaways(
  company: CompanyProfile,
  evaluated?: EvaluatedCompanyResult
): ActionableTakeaways {
  const health = company.balanceSheetHealth;
  const netFundFlowLots = company.scrapedFundHoldings.reduce(
    (sum, item) => sum + item.monthlyFlowLots,
    0
  );
  const freeFundFloatSharePct = Number(
    company.scrapedFundHoldings
      .reduce((sum, item) => sum + item.shareOfFreeFloatPct, 0)
      .toFixed(1)
  );
  const maxBotIndex = company.scrapedSentimentChannels.reduce(
    (max, ch) => Math.max(max, ch.manipulationBotOrFomoIndex),
    0
  );
  const mediaScore = company.sentimentSynthesis.combinedMarketSentimentScore;
  const gap = health.forwardPricingGapPct;

  // 1. Balance sheet health takeaway
  let balanceSheetTakeaway: string;
  if (health.overallHealthScore100 < 45) {
    balanceSheetTakeaway = `Kağıt üzerinde kâr görünse de kasaya nakit girmiyor (Piotroski ${health.piotroskiFScore}/9, Beneish M: ${health.beneishMScore.toFixed(
      2
    )}). Kârın ana kaynağı enflasyon muhasebesi veya tahsil edilmemiş alacaklar; bilanço kalitesi zayıf.`;
  } else if (health.overallHealthScore100 < 72) {
    balanceSheetTakeaway = `Şirketin maddi varlıkları ve özkaynak temeli gerçek (Altman Z: ${health.altmanZScore.toFixed(
      2
    )}), ancak kısa vadeli nakit akışı sıkışık. Alınan işlerin nakit tahsilata dönüp dönmediği bir sonraki bilançoda mutlaka kontrol edilmeli.`;
  } else {
    balanceSheetTakeaway = `Açıklanan kâr doğrudan kasaya nakit olarak giriyor (Sağlık: ${health.overallHealthScore100}/100, Piotroski ${health.piotroskiFScore}/9). Kısa vadeli borç çevirme gücü yüksek, muhasebe makyajı sinyali yok.`;
  }

  // 2. Fund flow takeaway
  let fundFlowTakeaway: string;
  if (netFundFlowLots < -1_000_000 && freeFundFloatSharePct >= 20) {
    fundFlowTakeaway = `Dolaşımdaki payın %${freeFundFloatSharePct}'ini tutan fonlar son ayda ${(
      Math.abs(netFundFlowLots) / 1_000_000
    ).toFixed(2)} Mn lot net satış yapmış. Fonlar sığ tahtada bireysel yatırımcıyı "çıkış likiditesi" olarak kullanıyor; taban serisi ve satış baskısı riski yüksek.`;
  } else if (netFundFlowLots < 0) {
    fundFlowTakeaway = `Fon tarafında son ayda ${(
      Math.abs(netFundFlowLots) / 1_000_000
    ).toFixed(2)} Mn lot net azalış var. Tahtadaki fon yoğunlaşması çözülene kadar kademelerde satış baskısı sürebilir; acele alımdan kaçınılmalı.`;
  } else {
    fundFlowTakeaway = `Emeklilik, yabancı ve kurumsal hisse yoğun fonlar (dolaşımdaki payı %${freeFundFloatSharePct}) son ayda +${(
      netFundFlowLots / 1_000_000
    ).toFixed(2)} Mn lot net alım yapmış. Spekülatif serbest fon sıkıştırması yok; kurumsal yatırımcı uzun vadeli biriktiriyor.`;
  }

  // 3. Forward balance sheet pricing takeaway
  let forwardBalanceSheetTakeaway: string;
  if (gap > 40) {
    forwardBalanceSheetTakeaway = `Hisse fiyatı +%${health.currentPriceImpliedGrowthPct.toFixed(
      0
    )} büyüme fiyatlıyor ama bilançonun gerçek kapasitesi sadece +%${health.fundamentalsSupportedGrowthPct.toFixed(
      0
    )}. Fiyat gelecek bilançodan tamamen kopmuş durumda (+${gap.toFixed(0)} puan köpük); balon riski taşıyor.`;
  } else if (gap > 8) {
    forwardBalanceSheetTakeaway = `Fiyat (+%${health.currentPriceImpliedGrowthPct.toFixed(
      0
    )}) mevcut bilanço kapasitesinin (+%${health.fundamentalsSupportedGrowthPct.toFixed(
      0
    )}) biraz önünde gidiyor. KAP'ta açıklanan yeni siparişlerin gelecek çeyreklerde kasaya nakit olarak girmesi şart.`;
  } else {
    forwardBalanceSheetTakeaway = `"İyi şirket gelecek bilançosunu fiyatlar" kuralı çalışıyor: Bilanço ve sipariş kapasitesi (+%${health.fundamentalsSupportedGrowthPct.toFixed(
      0
    )}), mevcut fiyatın beklentisini (+%${health.currentPriceImpliedGrowthPct.toFixed(
      0
    )}) rahatlıkla karşılıyor; çarpanlar temel açıdan ucuz/makul.`;
  }

  // 4. Sentimentil media score takeaway
  let sentimentMediaTakeaway: string;
  if (maxBotIndex >= 70 && mediaScore < 40) {
    sentimentMediaTakeaway = `Sosyal medyada %${maxBotIndex} oranında bot/sinyal grubu FOMO'su var. Telegram/X'te "uçacak" denirken büyük oyuncular mal çıkıyor; sosyal medya gazına gelinmemeli.`;
  } else if (mediaScore >= 70 && maxBotIndex < 35) {
    sentimentMediaTakeaway = `Medya skoru (${mediaScore}/100) sosyal medya dedikodusuna değil, resmi KAP iş sözleşmelerine ve kurumsal analist raporlarına dayanıyor; haber akışı güvenilir.`;
  } else {
    sentimentMediaTakeaway = `Medya skoru (${mediaScore}/100) dengeli/temkinli: Şirketin reel faaliyetleri olumlu konuşulsa da nakit döngüsü veya sektörel marj baskısı yatırımcıyı ikiye bölmüş durumda.`;
  }

  const activeFilters = evaluated
    ? evaluated.evaluatedFilters.filter((ef) => ef.weight > 0)
    : [];
  const triggeredActiveFilters = activeFilters.filter((ef) => ef.triggered);
  const selectedActiveCount = activeFilters.length;
  const selectedTriggeredNames = triggeredActiveFilters.map(
    (ef) => `#${ef.filter.no} ${ef.filter.filterName} (${ef.measuredValueText})`
  );

  let selectedFilterDynamicCommentary: string;
  if (selectedActiveCount === 0) {
    selectedFilterDynamicCommentary =
      'Şu anda hiçbir filtre seçili değil (0 / 60). Hissenin solundaki filtre listesinden veya tablodan istediğiniz filtreleri işaretleyin; seçtiğiniz kriterlere göre risk skoru ve analiz yorumu anında güncellenecektir.';
  } else if (triggeredActiveFilters.length === 0) {
    selectedFilterDynamicCommentary = `Seçtiğiniz ${selectedActiveCount} filtrenin tamamında ${company.symbol} temiz görünüm verdi (0 risk bayrağı, Risk Skoru: 0/100). İşaretlediğiniz kriterler açısından hissede manipülasyon, sığ tahta tuzağı veya bilanço bozulması tespit edilmedi.`;
  } else {
    const topExamples = triggeredActiveFilters
      .slice(0, 4)
      .map((ef) => `#${ef.filter.no} ${ef.filter.filterName}`)
      .join(', ');
    selectedFilterDynamicCommentary = `Seçtiğiniz ${selectedActiveCount} filtrenin ${triggeredActiveFilters.length} tanesinde risk bayrağı tetiklendi (Seçili Filtre Risk Skoru: ${evaluated?.weightedRiskScore100 ?? 0}/100). Öne çıkan ihlaller: ${topExamples}. Seçtiğiniz bu kriterler, hissede ${
      (evaluated?.weightedRiskScore100 ?? 0) >= 60
        ? 'yüksek spekülatif baskı ve bilanço-fiyat uyumsuzluğu'
        : 'dikkatle izlenmesi gereken kısmi uyarı sinyalleri'
    } bulunduğunu gösteriyor.`;
  }

  const riskScore = evaluated ? evaluated.weightedRiskScore100 : 50;
  let overallVerdictTitle: string;
  let overallVerdictShort: string;
  if (selectedActiveCount === 0) {
    overallVerdictTitle = 'FİLTRE SEÇİMİ BEKLENİYOR (SOL PANELDEN FİLTRE SEÇİN)';
    overallVerdictShort =
      'Analizi başlatmak için hissenin solundaki panelden incelemek istediğiniz filtreleri işaretleyin.';
  } else if (riskScore >= 60 || (selectedActiveCount >= 10 && health.overallHealthScore100 < 45 && riskScore >= 40)) {
    overallVerdictTitle = 'YÜKSEK SPEKÜLASYON & BİLANÇO KOPUKLUĞU UYARISI';
    overallVerdictShort =
      'Seçtiğiniz filtrelerde fiyat hareketinin gelecek bilançoyu değil, sığ dolaşımdaki fon/balina giriş-çıkışını fiyatladığı görülüyor. Fon çıkışı ve negatif nakit akışı nedeniyle yüksek risk içerir.';
  } else if (riskScore >= 25 || triggeredActiveFilters.length >= 2) {
    overallVerdictTitle = 'SEÇİLİ FİLTRELERDE KISMİ RİSK & İZLEME UYARISI';
    overallVerdictShort =
      'Seçtiğiniz filtre kümesinde belirli risk bayrakları tetiklendi. Şirketin reel faaliyetleri olsa da tetiklenen nakit akışı, takas veya fon kriterleri yakından takip edilmelidir.';
  } else {
    overallVerdictTitle = 'SEÇİLİ FİLTRELERDE SAĞLAM GÖRÜNÜM (RİSK BAYRAĞI YOK)';
    overallVerdictShort =
      'Seçtiğiniz filtre kriterleri bazında hissede manipülasyon veya sığ tahta tuzağı saptanmadı; bilanço ve fon göstergeleri sağlıklı aralıkta.';
  }

  return {
    overallVerdictTitle,
    overallVerdictShort,
    balanceSheetTakeaway,
    fundFlowTakeaway,
    forwardBalanceSheetTakeaway,
    sentimentMediaTakeaway,
    selectedFilterDynamicCommentary,
    selectedActiveCount,
    selectedTriggeredNames,
    netFundFlowLots,
    freeFundFloatSharePct,
  };
}

/**
 * Top 20 Most Critical Forensic Filters (distinguished out of the 60 filters, hiding the remaining 40 by default).
 * Grouped across 4 primary analytical pillars:
 * 1. Bilanço & Nakit Kalitesi (6): #19, #20, #21, #22, #23, #24
 * 2. Sığ Tahta, Balina & TEFAS Fon Yapısı (5): #8, #12, #14, #15, #55
 * 3. Fiyat/Hacim Patlaması & Sosyal Medya FOMO (5): #1, #3, #4, #6, #47
 * 4. KAP Yönetişim, Denetçi & SPK/VBTS (4): #26, #27, #30, #31
 */
export const CORE_20_FILTER_NUMBERS: number[] = [
  1, 3, 4, 6, 8, 12, 14, 15, 19, 20, 21, 22, 23, 24, 26, 27, 30, 31, 47, 55,
];

export const CORE_20_METADATA: Record<
  number,
  { pillarTitle: string; selectionReason: string; recommendedWeight: number }
> = {
  1: {
    pillarTitle: 'Fiyat/Hacim & FOMO',
    selectionReason: 'Sığ tahtada yapay tavan serisiyle fiyat keşfinin kilitlenmesini yakalar.',
    recommendedWeight: 2,
  },
  3: {
    pillarTitle: 'Fiyat/Hacim & FOMO',
    selectionReason: 'Operasyon başlangıcındaki anormal hacim patlamasını tespit eder.',
    recommendedWeight: 2,
  },
  4: {
    pillarTitle: 'Fiyat/Hacim & FOMO',
    selectionReason: 'Balina ve serbest fon çıkışı sonrası yaşanan sert çöküşü (drawdown) ölçer.',
    recommendedWeight: 2,
  },
  6: {
    pillarTitle: 'Fiyat/Hacim & FOMO',
    selectionReason: 'PSY/BSADF ekonometrik testiyle fiyatın temel değerden kopup balonlaştığını kanıtlar.',
    recommendedWeight: 3,
  },
  8: {
    pillarTitle: 'Sığ Tahta & Fon Yapısı',
    selectionReason: 'Amihud illikidite oranıyla az parayla tahtanın ne kadar kolay sürüldüğünü gösterir.',
    recommendedWeight: 2,
  },
  12: {
    pillarTitle: 'Sığ Tahta & Fon Yapısı',
    selectionReason: 'Düşük fiili dolaşım oranı (%25 altı) köşe sıkıştırma (cornering) için birincil ön koşuldur.',
    recommendedWeight: 3,
  },
  14: {
    pillarTitle: 'Sığ Tahta & Fon Yapısı',
    selectionReason: 'Tek aracı kurumun takasta %30+ paya ulaşarak tahta kontrolünü ele geçirmesini yakalar.',
    recommendedWeight: 3,
  },
  15: {
    pillarTitle: 'Sığ Tahta & Fon Yapısı',
    selectionReason: 'Dolaşımdaki payların belirli serbest/hisse yoğun fonlarda toplanma riskini ölçer.',
    recommendedWeight: 3,
  },
  19: {
    pillarTitle: 'Bilanço & Nakit Kalitesi',
    selectionReason: 'F/K ve PD/DD çarpanlarının gelecek bilanço kapasitesinden kopuşunu gösterir.',
    recommendedWeight: 3,
  },
  20: {
    pillarTitle: 'Bilanço & Nakit Kalitesi',
    selectionReason: 'Piotroski F-Skoru (0-9) ile şirketin içsel bilanço sağlığını tek sayıda özetler.',
    recommendedWeight: 3,
  },
  21: {
    pillarTitle: 'Bilanço & Nakit Kalitesi',
    selectionReason: 'Beneish M-Skoru (>-1.78) ile bilançoda muhasebe makyajı olasılığını tespit eder.',
    recommendedWeight: 3,
  },
  22: {
    pillarTitle: 'Bilanço & Nakit Kalitesi',
    selectionReason: 'Kağıt üzerinde net kâr yazılırken esas faaliyet nakit akışının negatif olmasını (F01) yakalar.',
    recommendedWeight: 3,
  },
  23: {
    pillarTitle: 'Bilanço & Nakit Kalitesi',
    selectionReason: 'TMS 29 enflasyon muhasebesi kaynaklı nakit dışı parasal pozisyon kârını ayrıştırır.',
    recommendedWeight: 2,
  },
  24: {
    pillarTitle: 'Bilanço & Nakit Kalitesi',
    selectionReason: 'Kısa vadeli finansal borçların eldeki nakitle karşılanamama (likidite krizi) riskini ölçer.',
    recommendedWeight: 3,
  },
  26: {
    pillarTitle: 'KAP Yönetişim & Denetim',
    selectionReason: 'Sık bağımsız denetçi değişimi ve şartlı görüş (opinion shopping) riskini işaretler.',
    recommendedWeight: 3,
  },
  27: {
    pillarTitle: 'KAP Yönetişim & Denetim',
    selectionReason: 'CFO ve yönetim kurulu üyelerinin peş peşe istifasını erken uyarı olarak yakalar.',
    recommendedWeight: 2,
  },
  30: {
    pillarTitle: 'KAP Yönetişim & Denetim',
    selectionReason: 'PCAOB AS 2410 çerçevesinde şirket kaynaklarının ilişkili taraflara aktarılmasını denetler.',
    recommendedWeight: 3,
  },
  31: {
    pillarTitle: 'KAP Yönetişim & Denetim',
    selectionReason: 'Borsa İstanbul VBTS brüt takas ve kredili işlem yasağı geçmişini doğrudan bayraklar.',
    recommendedWeight: 2,
  },
  47: {
    pillarTitle: 'Fiyat/Hacim & FOMO',
    selectionReason: 'X ve Telegram sinyal gruplarındaki organize bot/pazarlama sıçramasını ölçer.',
    recommendedWeight: 2,
  },
  55: {
    pillarTitle: 'Sığ Tahta & Fon Yapısı',
    selectionReason: 'Tek portföy yönetim şirketi fonlarının tahtadaki çıkış likiditesi krizini yakalar.',
    recommendedWeight: 3,
  },
};

export function isCore20Filter(no: number): boolean {
  return CORE_20_FILTER_NUMBERS.includes(no);
}

/**
 * Returns default weights where the 20 Most Important Filters are active (with their recommended weights)
 * and the remaining 40 secondary filters are hidden/disabled (weight = 0).
 */
export function getCore20DefaultWeights(): Record<number, number> {
  const weights: Record<number, number> = {};
  for (const f of SIXTY_FILTERS) {
    const meta = CORE_20_METADATA[f.no];
    weights[f.no] = meta ? meta.recommendedWeight : 0;
  }
  return weights;
}


