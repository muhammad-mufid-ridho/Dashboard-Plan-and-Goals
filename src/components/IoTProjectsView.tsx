import React, { useState } from 'react';
import { IoTProject } from '../types/dashboard';
import { ConfirmModal } from './ConfirmModal';
import {
  Cpu,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
  Radio,
  Network,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface IoTProjectsViewProps {
  projects: IoTProject[];
  onAddProject: (project: IoTProject) => void;
  onUpdateProject: (project: IoTProject) => void;
  onDeleteProject: (id: string) => void;
  onClearAllProjects: () => void;
}

export const IoTProjectsView: React.FC<IoTProjectsViewProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onClearAllProjects
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterPhase, setFilterPhase] = useState<string>('Semua');
  const [confirmClearModal, setConfirmClearModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [newProject, setNewProject] = useState<Partial<IoTProject>>({
    name: '',
    problemStatement: '',
    solutionIdea: '',
    hardwareComponents: [],
    communicationProtocol: 'MQTT / Mosquitto',
    networkingConcept: 'VLAN Segmentation / Subnetting',
    phase: 'Brainstorming',
    status: 'Planning',
    progressPercent: 10,
    targetDate: '2026-12-15'
  });

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;

    const project: IoTProject = {
      id: `iot_${Date.now()}`,
      name: newProject.name || 'Proyek IoT Baru',
      problemStatement: newProject.problemStatement || '',
      solutionIdea: newProject.solutionIdea || '',
      hardwareComponents: typeof newProject.hardwareComponents === 'string'
        ? (newProject.hardwareComponents as string).split(',').map(s => s.trim())
        : newProject.hardwareComponents || ['ESP32'],
      communicationProtocol: newProject.communicationProtocol || 'MQTT',
      networkingConcept: newProject.networkingConcept || 'Subnetting',
      phase: newProject.phase as any || 'Brainstorming',
      targetDate: newProject.targetDate || '2026-12-31',
      status: newProject.status as any || 'Planning',
      progressPercent: newProject.progressPercent || 10,
      isAnnualCounted: false
    };

    onAddProject(project);
    setShowAddModal(false);
    setNewProject({
      name: '',
      problemStatement: '',
      solutionIdea: '',
      hardwareComponents: [],
      communicationProtocol: 'MQTT / Mosquitto',
      networkingConcept: 'VLAN Segmentation',
      phase: 'Brainstorming',
      status: 'Planning',
      progressPercent: 10
    });
  };

  const filteredProjects = filterPhase === 'Semua'
    ? projects
    : projects.filter(p => p.phase === filterPhase || p.status === filterPhase);

  const completedCount = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-800">IoT and Networking Project Manager</h2>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            Menghubungkan mikrokontroler dengan konsep jaringan komputer. Anda dapat menghapus proyek dummy dan memasukkan proyek nyata Anda.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {projects.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearModal(true)}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Dummy</span>
            </button>
          )}

          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
            {completedCount} dari 6 Proyek Selesai
          </span>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek IoT Real</span>
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Semua', 'Brainstorming', 'Perancangan', 'Prototyping', 'Pengujian', 'Selesai'].map((ph) => (
          <button
            key={ph}
            onClick={() => setFilterPhase(ph)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterPhase === ph
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {ph}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
          <Cpu className="w-8 h-8 mx-auto text-slate-300" />
          <div className="text-xs font-bold text-slate-700">Belum Ada Proyek IoT</div>
          <p className="text-[11px] max-w-sm mx-auto text-slate-500">
            Daftar proyek telah dikosongkan. Silakan klik tombol <strong>"Tambah Proyek IoT Real"</strong> untuk menambahkan rencana proyek nyata Anda.
          </p>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProjects.map((p) => {
            const isDone = p.status === 'Completed';

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-5 border shadow-xs space-y-4 hover:shadow-md transition-all ${
                  isDone ? 'border-purple-200 ring-1 ring-purple-100' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {p.phase}
                      </span>
                      <span className="text-[10px] text-slate-400">Target: {p.targetDate}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{p.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-purple-700">{p.progressPercent}%</div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        isDone ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title="Hapus proyek ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Problem & Solution */}
                <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-500 text-[10px] uppercase block">Masalah:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{p.problemStatement}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="font-bold text-purple-700 text-[10px] uppercase block">Ide Solusi:</span>
                    <p className="text-slate-800 mt-0.5 leading-relaxed">{p.solutionIdea}</p>
                  </div>
                </div>

                {/* Technical Specifications Chips */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Radio className="w-3 h-3 text-purple-600" />
                      <span>Protokol:</span>
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
                      {p.communicationProtocol}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Network className="w-3 h-3 text-blue-600" />
                      <span>Konsep Jaringan:</span>
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
                      {p.networkingConcept}
                    </span>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-500">Tahapan:</label>
                    <select
                      value={p.phase}
                      onChange={(e) =>
                        onUpdateProject({
                          ...p,
                          phase: e.target.value as any,
                          status: e.target.value === 'Selesai' ? 'Completed' : 'In Progress',
                          progressPercent: e.target.value === 'Selesai' ? 100 : p.progressPercent
                        })
                      }
                      className="p-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="Brainstorming">Brainstorming</option>
                      <option value="Perancangan">Perancangan</option>
                      <option value="Prototyping">Prototyping</option>
                      <option value="Pengujian">Pengujian</option>
                      <option value="Dokumentasi">Dokumentasi</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>

                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <span>GitHub Repo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tambah Proyek IoT & Jaringan Baru</h3>
            <form onSubmit={handleSaveNew} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Proyek IoT:</label>
                <input
                  type="text"
                  required
                  value={newProject.name || ''}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Contoh: ESP32 LoRa Gateway with VLAN Segmentation"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Protokol Komunikasi:</label>
                  <input
                    type="text"
                    value={newProject.communicationProtocol || ''}
                    onChange={(e) => setNewProject({ ...newProject, communicationProtocol: e.target.value })}
                    placeholder="MQTT, CoAP, WebSockets, Modbus"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Konsep Jaringan:</label>
                  <input
                    type="text"
                    value={newProject.networkingConcept || ''}
                    onChange={(e) => setNewProject({ ...newProject, networkingConcept: e.target.value })}
                    placeholder="VLAN, Subnetting, NAT, ACL"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rumusan Masalah:</label>
                <textarea
                  rows={2}
                  value={newProject.problemStatement || ''}
                  onChange={(e) => setNewProject({ ...newProject, problemStatement: e.target.value })}
                  placeholder="Masalah yang ingin diselesaikan..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ide Solusi:</label>
                <textarea
                  rows={2}
                  value={newProject.solutionIdea || ''}
                  onChange={(e) => setNewProject({ ...newProject, solutionIdea: e.target.value })}
                  placeholder="Solusi teknis..."
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing All Dummy IoT Projects */}
      <ConfirmModal
        isOpen={confirmClearModal}
        title="Kosongkan Semua Proyek IoT Dummy?"
        message="Semua proyek IoT simulasi akan dihapus bersih agar Anda dapat mendokumentasikan proyek mikrokontroler dan jaringan riil Anda."
        confirmLabel="Ya, Kosongkan Semua"
        confirmVariant="danger"
        onConfirm={() => {
          onClearAllProjects();
          setConfirmClearModal(false);
          showToast('✅ Semua proyek IoT dummy berhasil dikosongkan! Siap untuk proyek riil Anda.');
        }}
        onCancel={() => setConfirmClearModal(false)}
      />
    </div>
  );
};
