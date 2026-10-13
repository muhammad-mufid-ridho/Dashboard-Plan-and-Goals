/**
 * Personal Growth Dashboard 2026 Types
 */

export type HabitCategory = 
  | 'Ibadah & Spiritual'
  | 'Pengembangan Diri'
  | 'Akademik & Teknis'
  | 'Kesehatan';

export type HabitStatus = 'Done' | 'Partial' | 'Not Done' | 'NA';

export interface HabitDefinition {
  id: string;
  name: string;
  category: HabitCategory;
  targetUnit: string; // e.g. '1/4 juz', '2 lembar', '30 reps', '60 menit'
  targetValue: number;
  frequency: 'Senin-Jumat' | 'Setiap Hari' | 'Fleksibel';
  isFlexible: boolean; // if true, won't penalize consistency if not logged
  requiresActualValue: boolean; // reps, duration, pages
  isActive: boolean;
  priority: 'High' | 'Medium' | 'Low';
  description?: string;
}

export interface DailyHabitEntry {
  habitId: string;
  status: HabitStatus;
  actualValue?: number;
  notes?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  isWeekend: boolean;
  notes?: string;
  entries: Record<string, DailyHabitEntry>; // habitId -> entry
}

export interface WeeklyGoal {
  id: string;
  weekNumber: number; // 1 to 12 (Q4 2026)
  startDate: string;
  endDate: string;
  iotBrainstormDays: number; // target 5 days
  iotBrainstormNotes: string;
  networkingTopicFocus: string;
  kajianOffline: {
    attended: boolean;
    date?: string;
    theme?: string;
    location?: string;
    speaker?: string;
    notes?: string;
  };
  hafalanZiyadahPages: number; // target 1.25 pages (0.25/day Mon-Fri)
  hafalanMurojaahJuz: number; // target 1.25 juz
  achievementRate: number; // percentage
  evalWhatAchieved: string;
  evalWhatMissed: string;
  evalObstacles: string;
  evalImprovementPlan: string;
  isRealisticForAnnual: boolean;
}

export interface QuarterlyGoal {
  id: string;
  title: string;
  category: string;
  baseline: string;
  target: string;
  actualResult: string;
  evidence: string;
  progressPercent: number;
  obstacles: string;
  actionPlan: string;
}

export interface IoTProject {
  id: string;
  name: string;
  problemStatement: string;
  solutionIdea: string;
  hardwareComponents: string[];
  communicationProtocol: string; // MQTT, HTTP/REST, WebSockets, Modbus, LoRaWAN
  networkingConcept: string; // VLAN, Subnetting, Port Forwarding, Static Routing
  phase: 'Brainstorming' | 'Perancangan' | 'Prototyping' | 'Pengujian' | 'Dokumentasi' | 'Selesai';
  targetDate: string;
  status: 'Planning' | 'In Progress' | 'Under Review' | 'Completed';
  progressPercent: number;
  githubUrl?: string;
  documentationUrl?: string;
  testProof?: string;
  finalEvaluation?: string;
  isAnnualCounted: boolean; // Only counted as 1 of 6 if has goal, prototype, docs, test, eval
}

export interface CCNATopic {
  id: string;
  moduleNumber: number;
  title: string;
  theoryLearned: boolean;
  labCompleted: boolean;
  quizScore: number; // 0 - 100
  understandingLevel: 'Belum Paham' | 'Pemula' | 'Menengah' | 'Mahir';
  studyDate?: string;
  studyMinutes: number;
  mistakesNotes?: string;
  masteryStatus: 'Belum Dikuasai' | 'Sedang Dipelajari' | 'Dikuasai';
}

export interface QuranRecord {
  id: string;
  date: string;
  type: 'Murojaah' | 'Ziyadah';
  surahFrom: string;
  surahTo?: string;
  juzOrPageAmount: number; // e.g., 0.25 juz or 0.25 page
  unit: 'juz' | 'halaman';
  quality: 'Lancar' | 'Perlu Diulang' | 'Kurang Lancar';
  notes?: string;
}

export interface MicrostockAsset {
  id: string;
  date: string;
  platform: 'Shutterstock' | 'Adobe Stock' | 'Freepik' | 'Lainnya';
  title: string;
  assetType: 'Photo' | 'Vector' | 'Illustration';
  uploadedCount: number;
  approvedCount: number;
  rejectedCount: number;
  underReviewCount: number;
  salesCount: number;
  revenueUsd: number;
}

export interface GoldHolding {
  id: string;
  date: string;
  grams: number;
  pricePerGram: number;
  totalCost: number;
  type: 'Tabungan Awal' | 'Pembelian Baru';
  notes?: string;
}

export interface ExpenseTransaction {
  id: string;
  timestamp: string;
  date: string;
  category: 'Jajan & Makanan' | 'Transportasi' | 'Kebutuhan Pribadi' | 'Infaq' | 'Pendidikan & Buku' | 'IoT & Komponen' | 'Lainnya';
  description: string;
  amount: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer Bank' | 'E-Wallet';
  notes?: string;
  source: 'Manual' | 'Google Sheets' | 'Excel Import';
}

export interface FinancialSettings {
  startingBalance: number;
  monthlyExpenseBudget: number;
  savingsTarget2027: number;
  goldTargetGrams: number;
  currentGoldMarketPrice: number;
  goldPriceLastUpdated: string;
}

export interface KPICardConfig {
  id: string;
  title: string;
  metricKey: string;
  isVisible: boolean;
  order: number;
}
