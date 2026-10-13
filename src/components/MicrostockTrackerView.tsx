import React, { useState } from 'react';
import { MicrostockAsset } from '../types/dashboard';
import { ConfirmModal } from './ConfirmModal';
import { getTodayDateStr } from '../utils/dateUtils';
import { Image, Plus, CheckCircle, XCircle, Clock, DollarSign, TrendingUp, Trash2, CheckCircle2 } from 'lucide-react';

interface MicrostockTrackerViewProps {
  assets: MicrostockAsset[];
  onAddAsset: (asset: MicrostockAsset) => void;
  onDeleteAsset: (id: string) => void;
  onClearAllAssets: () => void;
}

export const MicrostockTrackerView: React.FC<MicrostockTrackerViewProps> = ({
  assets,
  onAddAsset,
  onDeleteAsset,
  onClearAllAssets
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmClearModal, setConfirmClearModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [newAsset, setNewAsset] = useState<Partial<MicrostockAsset>>({
    date: getTodayDateStr(),
    platform: 'Shutterstock',
    title: '',
    assetType: 'Photo',
    uploadedCount: 5,
    approvedCount: 4,
    rejectedCount: 1,
    underReviewCount: 0,
    salesCount: 0,
    revenueUsd: 0
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.title) return;

    onAddAsset({
      id: `ms_${Date.now()}`,
      date: newAsset.date || getTodayDateStr(),
      platform: newAsset.platform as any || 'Shutterstock',
      title: newAsset.title || 'Batch Foto Microstock',
      assetType: newAsset.assetType as any || 'Photo',
      uploadedCount: newAsset.uploadedCount || 5,
      approvedCount: newAsset.approvedCount || 0,
      rejectedCount: newAsset.rejectedCount || 0,
      underReviewCount: newAsset.underReviewCount || 0,
      salesCount: newAsset.salesCount || 0,
      revenueUsd: newAsset.revenueUsd || 0
    });

    setShowAddModal(false);
    setNewAsset({
      date: getTodayDateStr(),
      platform: 'Shutterstock',
      title: '',
      assetType: 'Photo',
      uploadedCount: 5,
      approvedCount: 4,
      rejectedCount: 1,
      underReviewCount: 0,
      salesCount: 0,
      revenueUsd: 0
    });
  };

  // Pure dynamic calculation based on real user assets
  const totalUploaded = assets.reduce((acc, a) => acc + a.uploadedCount, 0);
  const totalApproved = assets.reduce((acc, a) => acc + a.approvedCount, 0);
  const totalRejected = assets.reduce((acc, a) => acc + a.rejectedCount, 0);
  const totalInReview = assets.reduce((acc, a) => acc + a.underReviewCount, 0);
  const totalRevenueUsd = assets.reduce((acc, a) => acc + a.revenueUsd, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Image className="w-4 h-4" />
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-800">Microstock Portfolio Tracker (1.000 Aset)</h2>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            Platform utama Shutterstock & Adobe Stock. Hitungan aset di bawah dihitung murni dari data aktual Anda.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {assets.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearModal(true)}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Dummy</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Batch Unggahan Real</span>
          </button>
        </div>
      </div>

      {/* In-App Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Terunggah</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {totalUploaded} <span className="text-xs text-slate-400 font-semibold">/ 1.000</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalUploaded / 1000) * 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Diterima (Approved)</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{totalApproved}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {totalApproved + totalRejected > 0
              ? `Penerimaan: ${Math.round((totalApproved / (totalApproved + totalRejected)) * 100)}%`
              : 'Belum ada data'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Ditolak (Rejected)</div>
          <div className="text-2xl font-extrabold text-rose-500 mt-1">{totalRejected}</div>
          <div className="text-[10px] text-slate-500 mt-1">Evaluasi noise/keywords</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Pendapatan Total</div>
          <div className="text-2xl font-extrabold text-teal-600 mt-1">${totalRevenueUsd.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 mt-1">≈ Rp{(totalRevenueUsd * 15800).toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Asset Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {assets.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Image className="w-8 h-8 mx-auto text-slate-300" />
            <div className="text-xs font-bold text-slate-700">Belum Ada Aset Microstock</div>
            <p className="text-[11px] max-w-sm mx-auto text-slate-500">
              Daftar microstock kosong. Silakan klik <strong>"Catat Batch Unggahan Real"</strong> untuk memasukkan riwayat foto nyata Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Judul / Deskripsi Aset</th>
                  <th className="py-3 px-3 text-center">Unggah</th>
                  <th className="py-3 px-3 text-center">Approved</th>
                  <th className="py-3 px-3 text-center">Rejected</th>
                  <th className="py-3 px-3 text-center">Review</th>
                  <th className="py-3 px-4 text-right">Pendapatan ($)</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-700">{a.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {a.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{a.title}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{a.uploadedCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">{a.approvedCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-500">{a.rejectedCount}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-400">{a.underReviewCount}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-teal-700">
                      ${a.revenueUsd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onDeleteAsset(a.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Catat Batch Unggahan Microstock Real</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal:</label>
                  <input
                    type="date"
                    value={newAsset.date}
                    onChange={(e) => setNewAsset({ ...newAsset, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Platform:</label>
                  <select
                    value={newAsset.platform}
                    onChange={(e) => setNewAsset({ ...newAsset, platform: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="Shutterstock">Shutterstock</option>
                    <option value="Adobe Stock">Adobe Stock</option>
                    <option value="Freepik">Freepik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul / Tema Aset:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modern Architectural Glass Building"
                  value={newAsset.title || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unggah:</label>
                  <input
                    type="number"
                    value={newAsset.uploadedCount}
                    onChange={(e) => setNewAsset({ ...newAsset, uploadedCount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Approved:</label>
                  <input
                    type="number"
                    value={newAsset.approvedCount}
                    onChange={(e) => setNewAsset({ ...newAsset, approvedCount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rejected:</label>
                  <input
                    type="number"
                    value={newAsset.rejectedCount}
                    onChange={(e) => setNewAsset({ ...newAsset, rejectedCount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pendapatan ($ USD):</label>
                <input
                  type="number"
                  step="0.05"
                  value={newAsset.revenueUsd}
                  onChange={(e) => setNewAsset({ ...newAsset, revenueUsd: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-teal-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Simpan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing All Dummy Microstock Assets */}
      <ConfirmModal
        isOpen={confirmClearModal}
        title="Kosongkan Semua Portofolio Microstock Dummy?"
        message="Semua data aset contoh akan dihapus agar Anda dapat memasukkan jumlah aset dan penghasilan riil Anda."
        confirmLabel="Ya, Kosongkan Semua"
        confirmVariant="danger"
        onConfirm={() => {
          onClearAllAssets();
          setConfirmClearModal(false);
          showToast('✅ Semua data microstock dummy berhasil dikosongkan!');
        }}
        onCancel={() => setConfirmClearModal(false)}
      />
    </div>
  );
};
