import React, { useState } from 'react';
import { QuranRecord } from '../types/dashboard';
import { ConfirmModal } from './ConfirmModal';
import { getTodayDateStr } from '../utils/dateUtils';
import { BookOpen, Plus, CheckCircle, RefreshCw, Calendar, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';

interface QuranTrackerViewProps {
  records: QuranRecord[];
  onAddRecord: (record: QuranRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAllRecords: () => void;
}

export const QuranTrackerView: React.FC<QuranTrackerViewProps> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onClearAllRecords
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'Semua' | 'Murojaah' | 'Ziyadah'>('Semua');
  const [confirmClearModal, setConfirmClearModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [newRec, setNewRec] = useState<Partial<QuranRecord>>({
    date: getTodayDateStr(),
    type: 'Murojaah',
    surahFrom: '',
    surahTo: '',
    juzOrPageAmount: 0.25,
    unit: 'juz',
    quality: 'Lancar',
    notes: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRec.surahFrom) return;

    onAddRecord({
      id: `qr_${Date.now()}`,
      date: newRec.date || getTodayDateStr(),
      type: newRec.type as any || 'Murojaah',
      surahFrom: newRec.surahFrom || '',
      surahTo: newRec.surahTo || '',
      juzOrPageAmount: newRec.juzOrPageAmount || 0.25,
      unit: newRec.type === 'Murojaah' ? 'juz' : 'halaman',
      quality: newRec.quality as any || 'Lancar',
      notes: newRec.notes || ''
    });

    setShowAddModal(false);
    setNewRec({
      date: getTodayDateStr(),
      type: 'Murojaah',
      surahFrom: '',
      surahTo: '',
      juzOrPageAmount: 0.25,
      unit: 'juz',
      quality: 'Lancar',
      notes: ''
    });
  };

  const murojaahRecords = records.filter(r => r.type === 'Murojaah');
  const ziyadahRecords = records.filter(r => r.type === 'Ziyadah');

  const totalMurojaahJuz = murojaahRecords.reduce((acc, r) => acc + r.juzOrPageAmount, 0);
  const totalZiyadahPages = ziyadahRecords.reduce((acc, r) => acc + r.juzOrPageAmount, 0);

  const filtered = filterType === 'Semua' ? records : records.filter(r => r.type === filterType);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-800">Hafalan & Mutabaah Al-Qur'an</h2>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            Target Murojaah (1/4 juz) dan Ziyadah (1/4 halaman) dipisahkan secara ketat. Anda dapat menghapus data contoh kapan saja.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {records.length > 0 && (
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
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Mutabaah Real</span>
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

      {/* Two Pillars Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pilar Murojaah */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Indikator 1</span>
                <h3 className="text-sm font-bold text-slate-900">Mengulang Hafalan (Murojaah)</h3>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              Target: 1/4 Juz / Hari
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalMurojaahJuz.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-semibold">Juz terulang di Q4</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Menjaga kelancaran ayat-ayat yang sudah dihafal (target 1.25 juz per pekan).
          </p>
        </div>

        {/* Pilar Ziyadah */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase">Indikator 2</span>
                <h3 className="text-sm font-bold text-slate-900">Menambah Hafalan Baru (Ziyadah)</h3>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
              Target: 1/4 Hal / Hari
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalZiyadahPages.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-semibold">Halaman hafalan baru di Q4</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Akumulasi penambahan hafalan baru (target 1.25 halaman per pekan).
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['Semua', 'Murojaah', 'Ziyadah'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === t
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* History Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {records.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
            <div className="text-xs font-bold text-slate-700">Belum Ada Catatan Mutabaah</div>
            <p className="text-[11px] max-w-sm mx-auto text-slate-500">
              Silakan klik <strong>"Catat Mutabaah Real"</strong> untuk mulai mencatat hafalan Al-Qur'an Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4">Surah / Ayat</th>
                  <th className="py-3 px-4">Jumlah</th>
                  <th className="py-3 px-4">Kelancaran</th>
                  <th className="py-3 px-4">Catatan</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-700">{r.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        r.type === 'Murojaah' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {r.surahFrom} {r.surahTo ? `s/d ${r.surahTo}` : ''}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {r.juzOrPageAmount} {r.unit}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.quality === 'Lancar'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.quality}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{r.notes || '-'}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Hapus rekaman ini"
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
            <h3 className="text-base font-bold text-slate-900">Catat Mutabaah Al-Qur'an Real</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal:</label>
                  <input
                    type="date"
                    value={newRec.date}
                    onChange={(e) => setNewRec({ ...newRec, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Kegiatan:</label>
                  <select
                    value={newRec.type}
                    onChange={(e) => {
                      const t = e.target.value as 'Murojaah' | 'Ziyadah';
                      setNewRec({
                        ...newRec,
                        type: t,
                        unit: t === 'Murojaah' ? 'juz' : 'halaman'
                      });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="Murojaah">Murojaah (Mengulang)</option>
                    <option value="Ziyadah">Ziyadah (Menambah Baru)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Surah / Ayat Mulai:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Al-Mulk ayat 1-30"
                  value={newRec.surahFrom || ''}
                  onChange={(e) => setNewRec({ ...newRec, surahFrom: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Jumlah ({newRec.type === 'Murojaah' ? 'Juz' : 'Halaman'}):
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={newRec.juzOrPageAmount}
                    onChange={(e) => setNewRec({ ...newRec, juzOrPageAmount: parseFloat(e.target.value) || 0.25 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kualitas Kelancaran:</label>
                  <select
                    value={newRec.quality}
                    onChange={(e) => setNewRec({ ...newRec, quality: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Lancar">Lancar</option>
                    <option value="Perlu Diulang">Perlu Diulang</option>
                    <option value="Kurang Lancar">Kurang Lancar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan:</label>
                <input
                  type="text"
                  placeholder="Catatan..."
                  value={newRec.notes || ''}
                  onChange={(e) => setNewRec({ ...newRec, notes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Simpan Mutabaah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing All Dummy Quran Records */}
      <ConfirmModal
        isOpen={confirmClearModal}
        title="Kosongkan Semua Catatan Hafalan Dummy?"
        message="Semua riwayat mutabaah murojaah dan ziyadah contoh akan dikosongkan agar Anda dapat mencatat hafalan riil harian Anda."
        confirmLabel="Ya, Kosongkan Semua"
        confirmVariant="danger"
        onConfirm={() => {
          onClearAllRecords();
          setConfirmClearModal(false);
          showToast('✅ Semua catatan mutabaah dummy berhasil dikosongkan!');
        }}
        onCancel={() => setConfirmClearModal(false)}
      />
    </div>
  );
};
