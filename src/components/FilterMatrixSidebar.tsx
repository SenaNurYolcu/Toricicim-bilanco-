import React, { useState } from 'react';
import {
  CheckSquare,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Square,
  Star,
} from 'lucide-react';
import {
  CompanyProfile,
  FilterGroupCode,
  SixtyFilterDefinition,
} from '../types/forensic';
import {
  CORE_20_METADATA,
  GROUP_DESCRIPTIONS,
  isCore20Filter,
} from '../utils/forensicEngine';

interface FilterMatrixSidebarProps {
  filters: SixtyFilterDefinition[];
  selectedCompany: CompanyProfile;
  weightsByNo: Record<number, number>;
  onChangeWeight: (no: number, weight: number) => void;
  onBatchSetWeights: (nextWeights: Record<number, number>) => void;
  onEnableTop20EssentialOnly: () => void;
  onResetAllWeightsToOne: () => void;
  onClearAllFilters: () => void;
  onEnableCore30Only: () => void;
  onCalibrateWhaleAndGovernanceFocus: () => void;
}

const ALL_GROUPS: FilterGroupCode[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const FilterMatrixSidebar: React.FC<FilterMatrixSidebarProps> = ({
  filters,
  selectedCompany,
  weightsByNo,
  onChangeWeight,
  onBatchSetWeights,
  onEnableTop20EssentialOnly,
  onResetAllWeightsToOne,
  onClearAllFilters,
  onEnableCore30Only,
  onCalibrateWhaleAndGovernanceFocus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<
    FilterGroupCode | 'all' | 'selected_only' | 'triggered_on_stock' | 'core30' | 'extra30' | 'top20'
  >('all');

  const totalWeight = filters.reduce((acc, f) => acc + (weightsByNo[f.no] ?? 0), 0);
  const activeCount = filters.filter((f) => (weightsByNo[f.no] ?? 0) > 0).length;

  const filteredList = filters.filter((f) => {
    const weight = weightsByNo[f.no] ?? 0;
    const isActive = weight > 0;
    const stockMeasurement = selectedCompany.filterMeasurements[f.no];
    const isTriggeredOnStock = Boolean(stockMeasurement?.triggered);

    const matchGroup =
      selectedGroup === 'all'
        ? true
        : selectedGroup === 'selected_only'
        ? isActive
        : selectedGroup === 'triggered_on_stock'
        ? isTriggeredOnStock
        : selectedGroup === 'top20'
        ? isCore20Filter(f.no)
        : selectedGroup === 'core30'
        ? !f.isExtraFlag
        : selectedGroup === 'extra30'
        ? f.isExtraFlag
        : f.groupCode === selectedGroup;

    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      q === '' ||
      f.filterName.toLowerCase().includes(q) ||
      f.moduleName.toLowerCase().includes(q) ||
      f.measurementAndThreshold.toLowerCase().includes(q) ||
      `#${f.no}` === q ||
      `${f.no}` === q;

    return matchGroup && matchSearch;
  });

  const handleToggleSingleFilter = (f: SixtyFilterDefinition) => {
    const current = weightsByNo[f.no] ?? 0;
    if (current > 0) {
      onChangeWeight(f.no, 0);
    } else {
      const recommended = CORE_20_METADATA[f.no]?.recommendedWeight ?? (f.defaultWeight || 1);
      onChangeWeight(f.no, recommended);
    }
  };

  const handleSelectVisibleFilters = (enable: boolean) => {
    const next = { ...weightsByNo };
    for (const f of filteredList) {
      if (enable) {
        next[f.no] = next[f.no] > 0 ? next[f.no] : f.defaultWeight || 1;
      } else {
        next[f.no] = 0;
      }
    }
    onBatchSetWeights(next);
  };

  const handleSelectGroupsOnly = (groups: FilterGroupCode[]) => {
    const next: Record<number, number> = {};
    for (const f of filters) {
      next[f.no] = groups.includes(f.groupCode) ? 2 : 0;
    }
    onBatchSetWeights(next);
  };

  return (
    <aside
      aria-label="Hissenin Yanında 60 Filtre Seçim ve Ağırlık Paneli"
      className="w-full shrink-0 bg-[#0F172A] border border-slate-800 flex flex-col rounded-lg overflow-hidden"
    >
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-teal-400 shrink-0" />
            <h2 className="text-sm font-semibold text-slate-100 tracking-tight">
              60 Filtre Seçimi ({selectedCompany.symbol})
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-amber-300 font-semibold">
            Seçili: {activeCount}/60 · Σ: {totalWeight}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Hiçbir filtre gizli değildir. <strong>{selectedCompany.symbol}</strong> hissesi için istediğiniz filtreleri tek tek veya grup halinde işaretleyin; sağdaki risk skoru ve yorumlar anında seçiminize göre güncellenir.
        </p>

        {/* Primary Select All / Clear All Controls */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <button
            type="button"
            onClick={onResetAllWeightsToOne}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-teal-950 bg-teal-400 hover:bg-teal-300 rounded-md transition-colors whitespace-nowrap"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Tüm 60 Filtreyi Seç
          </button>
          <button
            type="button"
            onClick={onClearAllFilters}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-rose-200 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-700/60 rounded-md transition-colors whitespace-nowrap"
          >
            <Square className="w-3.5 h-3.5" />
            Tüm Seçimi Temizle (0)
          </button>
        </div>

        {/* Thematic Filter Packs */}
        <div className="mb-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Hızlı Filtre Paketleri (Tek Tıkla Seç):
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectGroupsOnly(['D', 'H'])}
              className="px-2 py-1.5 text-[11px] font-medium text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 rounded text-left truncate"
            >
              Sadece Bilanço & Nakit
            </button>
            <button
              type="button"
              onClick={() => handleSelectGroupsOnly(['C', 'K'])}
              className="px-2 py-1.5 text-[11px] font-medium text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 rounded text-left truncate"
            >
              Sadece Balina & TEFAS Fon
            </button>
            <button
              type="button"
              onClick={() => handleSelectGroupsOnly(['A', 'B', 'J'])}
              className="px-2 py-1.5 text-[11px] font-medium text-rose-200 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 rounded text-left truncate"
            >
              Fiyat Patlaması & Medya
            </button>
            <button
              type="button"
              onClick={() => handleSelectGroupsOnly(['E', 'F', 'G', 'I'])}
              className="px-2 py-1.5 text-[11px] font-medium text-sky-200 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/50 rounded text-left truncate"
            >
              KAP, Denetçi & SPK/VBTS
            </button>
            <button
              type="button"
              onClick={onEnableCore30Only}
              className="px-2 py-1.5 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left truncate"
            >
              1–30 Ana Filtreler
            </button>
            <button
              type="button"
              onClick={onEnableTop20EssentialOnly}
              className="px-2 py-1.5 text-[11px] font-medium text-teal-200 bg-teal-950/50 hover:bg-teal-900/60 border border-teal-700/50 rounded text-left truncate"
            >
              ★ Önerilen 20 Kritik Filtre
            </button>
          </div>
        </div>

        {/* Search & Group Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="60 filtre içinde ara (örn. 14, Takas, F/K, Denetçi)..."
              aria-label="Filtreler içinde ara"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as any)}
            aria-label="Filtre grubu seç"
            className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="all">Tüm 60 Filtreyi Listele (Grup A–L)</option>
            <option value="selected_only">Sadece Seçtiğim Filtreler ({activeCount})</option>
            <option value="triggered_on_stock">
              {selectedCompany.symbol} Hissesinde Bayrak Açanlar
            </option>
            <option value="core30">Tablo 1: Ana Risk Filtreleri (1–30 · Grup A–F)</option>
            <option value="extra30">Tablo 2: Ek Bayrak Filtreler (31–60 · Grup G–L)</option>
            <option value="top20">★ Önerilen 20 Kritik Filtre</option>
            {ALL_GROUPS.map((g) => (
              <option key={g} value={g}>
                Grup {g} ({GROUP_DESCRIPTIONS[g].range}): {GROUP_DESCRIPTIONS[g].name}
              </option>
            ))}
          </select>

          {/* Batch toggle for currently visible list */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-400 font-mono">
              Listelenen: <strong className="text-slate-200">{filteredList.length} filtre</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectVisibleFilters(true)}
                className="text-teal-400 hover:underline font-medium"
              >
                Listelenenleri Seç
              </button>
              <span className="text-slate-600">·</span>
              <button
                type="button"
                onClick={() => handleSelectVisibleFilters(false)}
                className="text-rose-400 hover:underline font-medium"
              >
                Listelenenleri Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable 60-Filter List with Checkbox + Live Stock Status + Editable Weight */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/70 max-h-[650px] lg:max-h-[calc(100vh-310px)]">
        {filteredList.map((f) => {
          const weight = weightsByNo[f.no] ?? 0;
          const isActive = weight > 0;
          const coreMeta = CORE_20_METADATA[f.no];
          const stockMeasurement = selectedCompany.filterMeasurements[f.no] || {
            triggered: false,
            valueText: 'Normal aralıkta',
          };

          return (
            <div
              key={f.no}
              className={`p-3 transition-colors ${
                isActive
                  ? stockMeasurement.triggered
                    ? 'bg-rose-950/20 hover:bg-rose-950/30'
                    : 'bg-slate-900/80 hover:bg-slate-900'
                  : 'bg-slate-950/50 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                {/* Left Checkbox + Filter Info */}
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    id={`filter-check-${f.no}`}
                    checked={isActive}
                    onChange={() => handleToggleSingleFilter(f)}
                    aria-label={`Filtre ${f.no} ${f.filterName} seç`}
                    className="mt-1 w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500 cursor-pointer shrink-0 accent-teal-400"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <label
                        htmlFor={`filter-check-${f.no}`}
                        className="font-bold text-teal-300 cursor-pointer"
                      >
                        #{f.no}
                      </label>
                      <span>·</span>
                      <span>Grup {f.groupCode}</span>
                      {coreMeta && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                          <Star className="w-2.5 h-2.5" />
                          Kritik
                        </span>
                      )}
                      <span
                        className={`ml-auto px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          stockMeasurement.triggered
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {selectedCompany.symbol}: {stockMeasurement.triggered ? 'BAYRAK' : 'Temiz'}
                      </span>
                    </div>

                    <label
                      htmlFor={`filter-check-${f.no}`}
                      className="block text-xs font-semibold text-slate-100 mt-0.5 leading-snug cursor-pointer"
                    >
                      {f.filterName}
                    </label>

                    <div className="text-[11px] font-mono text-slate-200 mt-1 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded">
                      <span className="text-slate-400">{selectedCompany.symbol} Ölçümü: </span>
                      {stockMeasurement.valueText}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {f.measurementAndThreshold}
                    </div>
                  </div>
                </div>

                {/* Right Weight Selector */}
                <div className="shrink-0 flex flex-col items-end">
                  <label
                    htmlFor={`weight-select-${f.no}`}
                    className="text-[10px] font-mono text-slate-400 mb-0.5"
                  >
                    Ağırlık
                  </label>
                  <select
                    id={`weight-select-${f.no}`}
                    aria-label={`Filtre ${f.no} ${f.filterName} ağırlığı`}
                    value={weight}
                    onChange={(e) => onChangeWeight(f.no, Number(e.target.value))}
                    className={`w-14 px-1.5 py-1 text-xs font-mono font-bold text-center rounded border cursor-pointer tabular-nums ${
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
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400">
            Arama kriterine uygun filtre bulunamadı.
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedGroup('all');
              }}
              className="mt-2 inline-flex items-center gap-1 text-teal-400 hover:underline block mx-auto"
            >
              <RotateCcw className="w-3 h-3" /> Tüm 60 filtreyi göster
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

