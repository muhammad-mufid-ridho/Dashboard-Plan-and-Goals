import React, { useState } from 'react';
import {
  IoTProject,
  MicrostockAsset,
  GoldHolding,
  CCNATopic,
  FinancialSettings
} from '../types/dashboard';
import {
  Trophy,
  Cpu,
  Image,
  Coins,
  Network,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { AddGoldModal } from './AddGoldModal';
import { ConfirmModal } from './ConfirmModal';

interface AnnualGoalsViewProps {
  iotProjects: IoTProject[];
  microstockAssets: MicrostockAsset[];
  goldHoldings: GoldHolding[];
  ccnaTopics: CCNATopic[];
  settings: FinancialSettings;
  onNavigateTab: (tab: any) => void;
  onAddGold?: (gold: GoldHolding) => void;
  onDeleteGold?: (id: string) => void;
  onClearAllGold?: () => void;
}

export const AnnualGoalsView: React.FC<AnnualGoalsViewProps> = ({
  iotProjects,
  microstockAssets,
  goldHoldings,
  ccnaTopics,
  settings,
  onNavigateTab,
  onAddGold,
  onDeleteGold,
  onClearAllGold
}) => {
  const [isAddGoldOpen, setIsAddGoldOpen] = useState(false);
  const [confirmClearGoldModal, setConfirmClearGoldModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Pilar 1: IoT Projects (6 targets) - Dihitung murni dari data aktual
  const completedIotProjects = iotProjects.filter(p => p.status === 'Completed');
  const iotProgressPct = Math.round((completedIotProjects.length / 6) * 100);

  // Pilar 2: Microstock (1000 targets) - Dihitung murni dari data aktual
  const totalUploadedStock = microstockAssets.reduce((acc, a) => acc + a.uploadedCount, 0);
  const totalApprovedStock = microstockAssets.reduce((acc, a) => acc + a.approvedCount, 0);
  const totalRejectedStock = microstockAssets.reduce((acc, a) => acc + a.rejectedCount, 0);
  const totalInReviewStock = microstockAssets.reduce((acc, a) => acc + a.underReviewCount, 0);
  const stockProgressPct = Math.min(100, Math.round((totalUploadedStock / 1000) * 100));

  // Pilar 3: Gold (40g targets) - Dihitung murni dari data aktual
  const totalGrams = goldHoldings.reduce((acc, g) => acc + g.grams, 0);
  const totalCost = goldHoldings.reduce((acc, g) => acc + g.totalCost, 0);
  const marketValue = totalGrams * settings.currentGoldMarketPrice;
  const profitLoss = marketValue - totalCost;
  const goldProgressPct = Math.min(100, Math.round((totalGrams / Math.max(1, settings.goldTargetGrams)) * 100));

  // Pilar 4: CCNA (60 hours target) - Dihitung murni dari data aktual
  const totalMinutes = ccnaTopics.reduce((acc, t) => acc + t.studyMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const ccnaProgressPct = Math.min(100, Math.round((parseFloat(totalHours) / 60) * 100));
  const masteredCount = ccnaTopics.filter(t => t.masteryStatus === 'Dikuasai').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Trophy className="w-4 h-4" />
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-800">
              Annual Goals 2026 — 4 Pilar Target Utama
            </h2>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            Penilaian pencapaian tahunan dihitung murni dari data aktual Anda. Hapus dummy dan sesuaikan dengan aset nyata.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200">
            Target Berakhir 31 Des 2026
          </span>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PILAR 1: IoT PROJECTS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Pilar 1: Portofolio</span>
                <h3 className="text-base font-bold text-slate-800">6 Proyek IoT Selesai</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-purple-600">{completedIotProjects.length} / 6</span>
              <div className="text-[10px] text-slate-400">{iotProgressPct}% Tercapai</div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${iotProgressPct}%` }}></div>
          </div>

          <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>5 Syarat Wajib Proyek Dihitung Selesai:</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
              <li>Tujuan & rumusan masalah yang jelas</li>
              <li>Implementasi prototipe fisik / simulasi berfungsi</li>
              <li>Dokumentasi teknis & skema wiring</li>
              <li>Bukti pengujian & metrik packet capture/kinerja</li>
              <li>Hasil evaluasi dan tautan repositori GitHub</li>
            </ul>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">
              {iotProjects.length} proyek terdaftar saat ini
            </span>
            <button
              onClick={() => onNavigateTab('iot')}
              className="text-purple-600 font-bold hover:underline cursor-pointer"
            >
              Kelola Proyek &rarr;
            </button>
          </div>
        </div>

        {/* PILAR 2: MICROSTOCK PORTFOLIO */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pilar 2: Kreatif & Aset</span>
                <h3 className="text-base font-bold text-slate-800">1.000 Portofolio Microstock</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-amber-600">{totalUploadedStock} / 1.000</span>
              <div className="text-[10px] text-slate-400">{stockProgressPct}% Tercapai</div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stockProgressPct}%` }}></div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <div className="text-[10px] text-slate-400">Diterima</div>
              <div className="font-bold text-emerald-600 mt-0.5">{totalApprovedStock} Aset</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Ditolak</div>
              <div className="font-bold text-rose-500 mt-0.5">{totalRejectedStock} Aset</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Review</div>
              <div className="font-bold text-amber-600 mt-0.5">{totalInReviewStock} Aset</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Platform: Shutterstock & Adobe Stock</span>
            <button
              onClick={() => onNavigateTab('microstock')}
              className="text-amber-600 font-bold hover:underline cursor-pointer"
            >
              Lihat Detail &rarr;
            </button>
          </div>
        </div>

        {/* PILAR 3: GOLD SAVINGS (DENGAN TOMBOL INPUT & HAPUS DUMMY) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">Pilar 3: Aset Finansial</span>
                <h3 className="text-base font-bold text-slate-800">40 Gram Emas Logam Mulia</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-yellow-600">{totalGrams.toFixed(1)} / 40.0g</span>
              <div className="text-[10px] text-slate-400">{goldProgressPct}% Tercapai</div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${goldProgressPct}%` }}></div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Biaya Pembelian (Cost):</div>
              <div className="font-bold text-slate-800 mt-0.5">Rp{totalCost.toLocaleString('id-ID')}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Estimasi Nilai Pasar:</div>
              <div className="font-bold text-emerald-700 mt-0.5">Rp{marketValue.toLocaleString('id-ID')}</div>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200/60 flex justify-between">
              <span className="text-slate-500">Unrealized Profit/Loss:</span>
              <span className={`font-bold ${profitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {profitLoss >= 0 ? '+' : ''}Rp{profitLoss.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Gold Holdings List with Delete */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            <div className="text-[11px] font-bold text-slate-700 flex justify-between items-center">
              <span>Daftar Tabungan & Pembelian Emas:</span>
              <div className="flex gap-2">
                {goldHoldings.length > 0 && onClearAllGold && (
                  <button
                    type="button"
                    onClick={() => setConfirmClearGoldModal(true)}
                    className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Kosongkan Dummy
                  </button>
                )}
                <button
                  onClick={() => setIsAddGoldOpen(true)}
                  className="text-[10px] font-bold text-yellow-700 hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Emas Real</span>
                </button>
              </div>
            </div>

            {goldHoldings.length === 0 ? (
              <div className="p-3 text-center text-[11px] text-slate-400 bg-slate-50 rounded-lg">
                Belum ada data emas. Klik "Tambah Emas Real" di atas.
              </div>
            ) : (
              goldHoldings.map((gh) => (
                <div
                  key={gh.id}
                  className="p-2 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs group"
                >
                  <div>
                    <div className="font-bold text-slate-800">{gh.grams}g — {gh.notes || gh.type}</div>
                    <div className="text-[10px] text-slate-400">
                      {gh.date} • Rp{gh.pricePerGram.toLocaleString('id-ID')}/g
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">
                      Rp{gh.totalCost.toLocaleString('id-ID')}
                    </span>
                    {onDeleteGold && (
                      <button
                        onClick={() => onDeleteGold(gh.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                        title="Hapus data emas ini"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PILAR 4: CCNA & NETWORKING */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Pilar 4: Sertifikasi & Ilmu</span>
                <h3 className="text-base font-bold text-slate-800">Kurikulum CCNA (60 Jam)</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-blue-600">{totalHours} / 60 Jam</span>
              <div className="text-[10px] text-slate-400">{ccnaProgressPct}% Tercapai</div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${ccnaProgressPct}%` }}></div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Modul Dikuasai:</div>
              <div className="font-bold text-slate-800 mt-0.5">{masteredCount} dari 15 Modul</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Jadwal Belajar:</div>
              <div className="font-bold text-blue-700 mt-0.5">60 Menit/Hari, 5 Hari/Pekan</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Mencakup Teori + Lab Packet Tracer</span>
            <button
              onClick={() => onNavigateTab('ccna')}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Buka Silabus CCNA &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Add Gold Modal */}
      <AddGoldModal
        isOpen={isAddGoldOpen}
        onClose={() => setIsAddGoldOpen(false)}
        onSave={(newG) => {
          if (onAddGold) onAddGold(newG);
        }}
      />

      {/* Confirmation Modal for Clearing All Dummy Gold */}
      <ConfirmModal
        isOpen={confirmClearGoldModal}
        title="Kosongkan Semua Data Emas Dummy?"
        message="Semua catatan gram dan pembelian emas contoh akan dihapus bersih agar Anda dapat mencatat gram emas riil Anda."
        confirmLabel="Ya, Kosongkan Emas"
        confirmVariant="danger"
        onConfirm={() => {
          if (onClearAllGold) onClearAllGold();
          setConfirmClearGoldModal(false);
          showToast('✅ Semua data emas dummy berhasil dikosongkan!');
        }}
        onCancel={() => setConfirmClearGoldModal(false)}
      />
    </div>
  );
};
