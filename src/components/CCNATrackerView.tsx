import React, { useState } from 'react';
import { CCNATopic } from '../types/dashboard';
import {
  Network,
  BookOpen,
  Terminal,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface CCNATrackerViewProps {
  topics: CCNATopic[];
  onUpdateTopic: (topic: CCNATopic) => void;
}

export const CCNATrackerView: React.FC<CCNATrackerViewProps> = ({
  topics,
  onUpdateTopic
}) => {
  const [filterMastery, setFilterMastery] = useState<string>('Semua');

  const totalMinutes = topics.reduce((acc, t) => acc + (t.studyMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const masteredCount = topics.filter(t => t.masteryStatus === 'Dikuasai').length;
  const inProgressCount = topics.filter(t => t.masteryStatus === 'Sedang Dipelajari').length;
  const avgQuizScore = Math.round(
    topics.filter(t => t.quizScore > 0).reduce((acc, t) => acc + t.quizScore, 0) /
    Math.max(1, topics.filter(t => t.quizScore > 0).length)
  );

  const filteredTopics = filterMastery === 'Semua'
    ? topics
    : topics.filter(t => t.masteryStatus === filterMastery);

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Network className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">CCNA 200-301 & Computer Networking Tracker</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Program belajar intensif 3 bulan (1 jam/hari, 5 hari/minggu = 60 jam). Penguasaan dinilai dari Teori + Lab Packet Tracer + Kuis.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{totalHours} / 60 Jam</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>{masteredCount} / 15 Dikuasai</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Rata-rata Kuis: {avgQuizScore}%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Semua', 'Dikuasai', 'Sedang Dipelajari', 'Belum Dikuasai'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterMastery(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterMastery === status
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Topics Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Modul</th>
                <th className="py-3 px-4">Nama Materi Silabus CCNA</th>
                <th className="py-3 px-3 text-center">Teori</th>
                <th className="py-3 px-3 text-center">Lab Praktik</th>
                <th className="py-3 px-3 text-center">Skor Kuis</th>
                <th className="py-3 px-3">Tingkat Pemahaman</th>
                <th className="py-3 px-3">Durasi</th>
                <th className="py-3 px-4">Status Penguasaan</th>
                <th className="py-3 px-4">Catatan Kesalahan & Troubleshooting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTopics.map((top) => {
                const isMastered = top.masteryStatus === 'Dikuasai';
                const isStudying = top.masteryStatus === 'Sedang Dipelajari';

                return (
                  <tr
                    key={top.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isMastered ? 'bg-emerald-50/20' : isStudying ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-500">
                      M{top.moduleNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 leading-snug">{top.title}</div>
                      {top.studyDate && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Terakhir dipelajari: {top.studyDate}
                        </div>
                      )}
                    </td>

                    {/* Theory Studied Check */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={top.theoryLearned}
                        onChange={(e) =>
                          onUpdateTopic({
                            ...top,
                            theoryLearned: e.target.checked,
                            masteryStatus:
                              e.target.checked && top.labCompleted && top.quizScore >= 80
                                ? 'Dikuasai'
                                : 'Sedang Dipelajari'
                          })
                        }
                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                      />
                    </td>

                    {/* Lab Practice Check */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={top.labCompleted}
                        onChange={(e) =>
                          onUpdateTopic({
                            ...top,
                            labCompleted: e.target.checked,
                            masteryStatus:
                              top.theoryLearned && e.target.checked && top.quizScore >= 80
                                ? 'Dikuasai'
                                : 'Sedang Dipelajari'
                          })
                        }
                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                      />
                    </td>

                    {/* Quiz Score Input */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={top.quizScore || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          onUpdateTopic({
                            ...top,
                            quizScore: val,
                            masteryStatus:
                              top.theoryLearned && top.labCompleted && val >= 80
                                ? 'Dikuasai'
                                : val > 0
                                ? 'Sedang Dipelajari'
                                : top.masteryStatus
                          });
                        }}
                        className="w-14 px-1.5 py-1 text-center bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                        placeholder="0"
                      />
                    </td>

                    {/* Understanding Level */}
                    <td className="py-3.5 px-3">
                      <select
                        value={top.understandingLevel}
                        onChange={(e) =>
                          onUpdateTopic({
                            ...top,
                            understandingLevel: e.target.value as any
                          })
                        }
                        className="p-1 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700 cursor-pointer"
                      >
                        <option value="Belum Paham">Belum Paham</option>
                        <option value="Pemula">Pemula</option>
                        <option value="Menengah">Menengah</option>
                        <option value="Mahir">Mahir</option>
                      </select>
                    </td>

                    {/* Study Minutes */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="15"
                          min="0"
                          value={top.studyMinutes}
                          onChange={(e) =>
                            onUpdateTopic({
                              ...top,
                              studyMinutes: parseInt(e.target.value) || 0
                            })
                          }
                          className="w-16 px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                        />
                        <span className="text-[10px] text-slate-400">mnt</span>
                      </div>
                    </td>

                    {/* Mastery Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isMastered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isStudying
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {top.masteryStatus}
                      </span>
                    </td>

                    {/* Mistakes Notes */}
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={top.mistakesNotes || ''}
                        onChange={(e) =>
                          onUpdateTopic({
                            ...top,
                            mistakesNotes: e.target.value
                          })
                        }
                        placeholder="Troubleshooting / catatan..."
                        className="w-full max-w-[240px] px-2 py-1 bg-transparent border-b border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
