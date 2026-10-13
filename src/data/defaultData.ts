import {
  HabitDefinition,
  DailyLog,
  WeeklyGoal,
  QuarterlyGoal,
  IoTProject,
  CCNATopic,
  MicrostockAsset,
  GoldHolding,
  ExpenseTransaction,
  FinancialSettings,
  KPICardConfig,
  QuranRecord
} from '../types/dashboard';

export const DEFAULT_HABITS: HabitDefinition[] = [
  // A. Ibadah dan Spiritual
  {
    id: 'h_quran_murojaah',
    name: "Mengulang Hafalan Al-Qur'an (Murojaah)",
    category: 'Ibadah & Spiritual',
    targetUnit: 'juz',
    targetValue: 0.25,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'High',
    description: "Mengulang hafalan minimal 1/4 juz setiap hari kerja"
  },
  {
    id: 'h_quran_tilawah',
    name: "Membaca Al-Qur'an (Tilawah)",
    category: 'Ibadah & Spiritual',
    targetUnit: 'lembar',
    targetValue: 2,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'High',
    description: "Membaca Al-Qur'an 2 lembar (4 halaman)"
  },
  {
    id: 'h_quran_ziyadah',
    name: "Menambah Hafalan Baru (Ziyadah)",
    category: 'Ibadah & Spiritual',
    targetUnit: 'halaman',
    targetValue: 0.25,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'High',
    description: "Menambah hafalan baru 1/4 halaman (terpisah dari murojaah)"
  },
  {
    id: 'h_infaq',
    name: 'Infaq Subuh / Harian',
    category: 'Ibadah & Spiritual',
    targetUnit: 'Rp',
    targetValue: 1000,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'Medium',
    description: "Sedekah harian minimal Rp1.000"
  },
  {
    id: 'h_duha',
    name: 'Salat Duha',
    category: 'Ibadah & Spiritual',
    targetUnit: 'rakaat',
    targetValue: 2,
    frequency: 'Fleksibel',
    isFlexible: true,
    requiresActualValue: false,
    isActive: true,
    priority: 'Medium',
    description: "Dilakukan fleksibel berdasarkan kesempatan waktu pagi"
  },
  {
    id: 'h_tahajud',
    name: 'Salat Tahajud',
    category: 'Ibadah & Spiritual',
    targetUnit: 'rakaat',
    targetValue: 2,
    frequency: 'Fleksibel',
    isFlexible: true,
    requiresActualValue: false,
    isActive: true,
    priority: 'Medium',
    description: "Salat malam berdasarkan kondisi istirahat"
  },
  {
    id: 'h_witir',
    name: 'Salat Witir',
    category: 'Ibadah & Spiritual',
    targetUnit: 'rakaat',
    targetValue: 1,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: false,
    isActive: true,
    priority: 'High',
    description: "Penutup salat malam minimal 1 atau 3 rakaat"
  },

  // B. Pengembangan Diri & Komunikasi
  {
    id: 'h_english_speaking',
    name: 'Latihan Speaking English',
    category: 'Pengembangan Diri',
    targetUnit: 'menit',
    targetValue: 10,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'High',
    description: "Latihan berbicara mandiri atau shadow speech 5-10 menit"
  },
  {
    id: 'h_english_reading',
    name: 'Membaca Buku Bahasa Inggris',
    category: 'Pengembangan Diri',
    targetUnit: 'menit',
    targetValue: 10,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'Medium',
    description: "Membaca artikel teknis atau buku 10 menit"
  },
  {
    id: 'h_call_parents',
    name: 'Menelepon Orang Tua',
    category: 'Pengembangan Diri',
    targetUnit: 'kali',
    targetValue: 1,
    frequency: 'Fleksibel',
    isFlexible: true,
    requiresActualValue: false,
    isActive: true,
    priority: 'High',
    description: "Menghubungi dan menyapa orang tua secara teratur"
  },

  // C. Akademik dan Keterampilan Teknis
  {
    id: 'h_math_physics',
    name: 'Konsep Matematika / Fisika',
    category: 'Akademik & Teknis',
    targetUnit: 'soal',
    targetValue: 1,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'Medium',
    description: "5-10 menit belajar konsep, 1 soal atau 1 pembahasan"
  },
  {
    id: 'h_ccna_study',
    name: 'Belajar CCNA & Jaringan',
    category: 'Akademik & Teknis',
    targetUnit: 'menit',
    targetValue: 60,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'High',
    description: "Belajar teori & Packet Tracer lab 60 menit per hari"
  },
  {
    id: 'h_microstock_upload',
    name: 'Upload Aset Microstock',
    category: 'Akademik & Teknis',
    targetUnit: 'foto',
    targetValue: 5,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'High',
    description: "Unggah 5 foto ke Shutterstock / stock platform pilihan"
  },

  // D. Kesehatan
  {
    id: 'h_pushup',
    name: 'Push-up',
    category: 'Kesehatan',
    targetUnit: 'reps',
    targetValue: 30,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'High',
    description: "Target 30 kali repetisi"
  },
  {
    id: 'h_situp',
    name: 'Sit-up',
    category: 'Kesehatan',
    targetUnit: 'reps',
    targetValue: 30,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'Medium',
    description: "Target 30 kali repetisi"
  },
  {
    id: 'h_backup',
    name: 'Back-up',
    category: 'Kesehatan',
    targetUnit: 'reps',
    targetValue: 30,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'Medium',
    description: "Target 30 kali repetisi"
  },
  {
    id: 'h_jogging',
    name: 'Jogging',
    category: 'Kesehatan',
    targetUnit: 'menit',
    targetValue: 30,
    frequency: 'Senin-Jumat',
    isFlexible: false,
    requiresActualValue: true,
    isActive: true,
    priority: 'Medium',
    description: "Lari santai / jogging durasi 30 menit"
  }
];

// Seed initial daily logs for 2026-10-12 (Today) and neighboring days
export const INITIAL_DAILY_LOGS: Record<string, DailyLog> = {
  '2026-10-12': {
    date: '2026-10-12',
    isWeekend: false,
    notes: 'Awal sprint kuartal 4! Semangat konsistensi tinggi.',
    entries: {
      'h_quran_murojaah': { habitId: 'h_quran_murojaah', status: 'Done', actualValue: 0.25, notes: 'Juz 29 Al-Mulk - Al-Qalam' },
      'h_quran_tilawah': { habitId: 'h_quran_tilawah', status: 'Done', actualValue: 2, notes: 'Surah Al-Baqarah hal 12-15' },
      'h_quran_ziyadah': { habitId: 'h_quran_ziyadah', status: 'Done', actualValue: 0.25, notes: 'Surah An-Naba ayat 1-15' },
      'h_infaq': { habitId: 'h_infaq', status: 'Done', actualValue: 2000, notes: 'Kotak amal subuh' },
      'h_duha': { habitId: 'h_duha', status: 'Done', actualValue: 2 },
      'h_tahajud': { habitId: 'h_tahajud', status: 'Done', actualValue: 2 },
      'h_witir': { habitId: 'h_witir', status: 'Done', actualValue: 3 },
      'h_english_speaking': { habitId: 'h_english_speaking', status: 'Done', actualValue: 10, notes: 'Shadowing podcast BBC' },
      'h_english_reading': { habitId: 'h_english_reading', status: 'Done', actualValue: 12, notes: 'Clean Architecture chapter 1' },
      'h_call_parents': { habitId: 'h_call_parents', status: 'Done', actualValue: 1, notes: 'Kabar sehat di rumah' },
      'h_math_physics': { habitId: 'h_math_physics', status: 'Done', actualValue: 1, notes: 'Latihan hukum Ohm & Kirchhoff' },
      'h_ccna_study': { habitId: 'h_ccna_study', status: 'Done', actualValue: 65, notes: 'Subnetting VLSM /26 & /27' },
      'h_microstock_upload': { habitId: 'h_microstock_upload', status: 'Done', actualValue: 5, notes: 'Batch arsitektur modern' },
      'h_pushup': { habitId: 'h_pushup', status: 'Done', actualValue: 35 },
      'h_situp': { habitId: 'h_situp', status: 'Done', actualValue: 30 },
      'h_backup': { habitId: 'h_backup', status: 'Done', actualValue: 30 },
      'h_jogging': { habitId: 'h_jogging', status: 'Partial', actualValue: 20, notes: 'Hujan rintik di menit ke-20' }
    }
  }
};

export const INITIAL_WEEKLY_GOALS: WeeklyGoal[] = [
  {
    id: 'w1',
    weekNumber: 1,
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    iotBrainstormDays: 4,
    iotBrainstormNotes: 'Merancang arsitektur smart gateway ESP32 ke broker MQTT lokal dengan isolasi VLAN',
    networkingTopicFocus: 'Pemahaman OSI Layer, TCP vs UDP, dan simulasi topologi di Cisco Packet Tracer',
    kajianOffline: {
      attended: true,
      date: '2026-10-17',
      theme: 'Adab Penuntut Ilmu dan Keberkahan Waktu',
      location: 'Masjid Raya Al-Ikhlas',
      speaker: 'Ustaz Ahmad Syahrul, Lc.',
      notes: 'Pentingnya konsistensi dalam amal kecil daripada sporadis tetapi terputus.'
    },
    hafalanZiyadahPages: 1.25,
    hafalanMurojaahJuz: 1.25,
    achievementRate: 92,
    evalWhatAchieved: 'Sesi belajar CCNA teratur 5 hari, 5 foto microstock terunggah per hari.',
    evalWhatMissed: 'Jogging terpotong 1 hari karena cuaca hujan deras.',
    evalObstacles: 'Manajemen waktu malam hari antara belajar teknis dan istirahat.',
    evalImprovementPlan: 'Jadwalkan jogging lebih pagi jam 05.30 dan siapkan materi CCNA sehari sebelumnya.',
    isRealisticForAnnual: true
  },
  {
    id: 'w2',
    weekNumber: 2,
    startDate: '2026-10-19',
    endDate: '2026-10-25',
    iotBrainstormDays: 3,
    iotBrainstormNotes: 'Pemilihan komponen sensor suhu DHT22, current sensor SCT-013, dan protokol WebSockets',
    networkingTopicFocus: 'Subnetting IPv4 mendalam: FLSM, VLSM, dan perhitungan broadcast domain',
    kajianOffline: {
      attended: false,
      theme: 'Tadabbur Surah Al-Kahf',
      location: 'Masjid Kampus',
      speaker: 'Ustaz Ridwan',
      notes: 'Rencana hadir Sabtu sore'
    },
    hafalanZiyadahPages: 1.0,
    hafalanMurojaahJuz: 1.25,
    achievementRate: 85,
    evalWhatAchieved: 'Latihan subnetting mencapai skor 95%.',
    evalWhatMissed: 'Belum sempat menyusun skema wiring diagram IoT proyek 2.',
    evalObstacles: 'Kelelahan di tengah pekan.',
    evalImprovementPlan: 'Fokuskan brainstorming maksimal 45 menit agar tidak membebani.',
    isRealisticForAnnual: true
  }
];

export const INITIAL_QUARTERLY_GOALS: QuarterlyGoal[] = [
  {
    id: 'qg_iot',
    title: 'Penyelesaian Proyek Portofolio IoT Terintegrasi Jaringan',
    category: 'Proyek Teknis',
    baseline: '2 proyek selesai di awal 2026',
    target: 'Menghasilkan 4 proyek baru (total 6 proyek selesai) dengan dokumentasi lengkap',
    actualResult: '1 proyek selesai di Q4, 2 sedang tahap perancangan & prototyping',
    evidence: 'Repositori GitHub, skema Fritzing, pengujian MQTT packet capture di Wireshark',
    progressPercent: 65,
    obstacles: 'Ketersediaan modul transceiver LoRa dan debugging frame format',
    actionPlan: 'Selesaikan prototype Smart Hydroponics minggu ke-3 Oktober dan siapkan lab demo.'
  },
  {
    id: 'qg_ccna',
    title: 'Penguasaan Kurikulum CCNA 200-301 & Lab Hands-On',
    category: 'Sertifikasi & Belajar',
    baseline: 'Pemahaman dasar komputer',
    target: 'Menyelesaikan 15 modul CCNA, 60 jam belajar, dan lulus evaluasi simulasi',
    actualResult: '7 dari 15 modul dikuasai dengan nilai quiz rata-rata 88%',
    evidence: 'File simulasi .pkt Packet Tracer, ringkasan cheatsheet CLI Cisco IOS',
    progressPercent: 55,
    obstacles: 'Konsep Spanning Tree Protocol (STP) dan cost election memerlukan latihan visual',
    actionPlan: 'Tambah 2 sesi lab konfigurasi Rapid-STP dan multi-switch loop prevention.'
  },
  {
    id: 'qg_microstock',
    title: 'Portofolio Microstock Menembus 1.000 Aset',
    category: 'Kreatif & Pendapatan',
    baseline: '680 aset terunggah di awal Oktober 2026',
    target: 'Mencapai total 1.000 aset terunggah di Shutterstock (+320 aset)',
    actualResult: '785 aset terunggah (105 aset baru di bulan berjalan)',
    evidence: 'Dashboard kontributor Shutterstock, statistik penerimaan 85%',
    progressPercent: 68,
    obstacles: 'Penolakan foto karena noise ISO tinggi dan metadata keyword yang kurang relevan',
    actionPlan: 'Gunakan tripod untuk foto low-light dan riset 30 keyword teratas sebelum submit.'
  },
  {
    id: 'qg_gold_savings',
    title: 'Akumulasi Logam Mulia Emas 40 Gram',
    category: 'Finansial & Aset',
    baseline: '24 gram emas fisik',
    target: 'Menggenapkan 40 gram emas murni (+16 gram) sebelum 31 Des 2026',
    actualResult: '31 gram emas fisik telah tersimpan aman',
    evidence: 'Faktur pembelian Antam/UBS dan brankas penyimpanan',
    progressPercent: 77.5,
    obstacles: 'Fluktuasi harga emas per gram di pasaran',
    actionPlan: 'Beli bertahap tiap 2 minggu sesuai surplus kas tabungan.'
  },
  {
    id: 'qg_spiritual',
    title: 'Konsistensi Al-Qur\'an & Hafalan 1/4 Halaman Rutin',
    category: 'Spiritual',
    baseline: 'Hafalan belum teratur',
    target: 'Konsistensi 90%+ Murojaah 1/4 juz dan Ziyadah 1/4 halaman tiap hari kerja',
    actualResult: 'Rata-rata kepatuhan 93% sejak 12 Oktober',
    evidence: 'Buku mutabaah dan checklist audio rekaman murojaah',
    progressPercent: 93,
    obstacles: 'Waktu subuh yang sempit saat ada agenda bepergian',
    actionPlan: 'Murojaah dicicil sebelum tidur bila pagi hari padat.'
  }
];

export const INITIAL_IOT_PROJECTS: IoTProject[] = [
  {
    id: 'iot_1',
    name: 'Smart Hydroponics LoRa-to-MQTT Gateway with VLAN Isolation',
    problemStatement: 'Monitoring nutrisi TDS, pH, dan suhu air pada greenhouse hidroponik di area terpencil tanpa kabel LAN langsung.',
    solutionIdea: 'Node sensor bertenaga baterai dengan modul LoRa SX1278 mengirim data ke Gateway ESP32, dipublish ke MQTT Broker lokal pada VLAN sensor tersendiri.',
    hardwareComponents: ['ESP32 DevKit', 'LoRa SX1278', 'Analog TDS Sensor', 'DS18B20 Temp', 'Relay 5V', 'Step-down Buck'],
    communicationProtocol: 'LoRaWAN / MQTT via Mosquitto',
    networkingConcept: 'VLAN Segmentation (IEEE 802.1Q), Private IP Subnetting /28, Port Forwarding 1883',
    phase: 'Selesai',
    targetDate: '2026-10-25',
    status: 'Completed',
    progressPercent: 100,
    githubUrl: 'https://github.com/pesawaran/iot-lora-mqtt-gateway',
    documentationUrl: 'https://docs.portfolio.dev/projects/lora-hydroponics',
    testProof: 'Uji transmisi 450m packet loss < 2%, dashboard Node-RED update interval 10 detik',
    finalEvaluation: 'Berhasil mengisolasi trafik broadcast IoT dari jaringan workstation utama via VLAN 20.',
    isAnnualCounted: true
  },
  {
    id: 'iot_2',
    name: 'Industrial Energy Monitoring Gateway with Modbus-TCP',
    problemStatement: 'Ketidaktahuan konsumsi daya per fasa pada panel distribusi listrik dan perlunya alert overload dini.',
    solutionIdea: 'ESP32 membaca sensor PZEM-004T via Modbus RTU, lalu mengonversi menjadi Modbus-TCP dan HTTP REST API ke monitoring server.',
    hardwareComponents: ['ESP32-S3', 'PZEM-004T Modbus', 'Current Transformer 100A', 'Ethernet W5500 SPI', 'OLED 0.96 inch'],
    communicationProtocol: 'Modbus-TCP / HTTP REST API',
    networkingConcept: 'Static IP Addressing, TCP Port 502, Subnetting /24, DHCP Reservation',
    phase: 'Prototyping',
    targetDate: '2026-11-15',
    status: 'In Progress',
    progressPercent: 60,
    githubUrl: 'https://github.com/pesawaran/modbus-energy-gateway',
    testProof: 'Data tegangan dan arus terbaca akurat pada serial monitor, sedang membangun web dashboard.',
    isAnnualCounted: false
  },
  {
    id: 'iot_3',
    name: 'Automated Cold-Storage Telemetry with CoAP & NAT Traversal',
    problemStatement: 'Suhu cold storage farmasi harus terpantau 24/7 dengan konsumsi bandwidth ultra-rendah dan toleransi latency.',
    solutionIdea: 'Node micro-controller STM32 + SIM7000G mengirim payload CoAP terenkripsi DTLS melewati firewall NAT ke cloud VPS.',
    hardwareComponents: ['STM32F401', 'SIM7000G NB-IoT/LTE-M', 'Dual PT100 RTD Sensor', 'LiFePO4 Backup Battery'],
    communicationProtocol: 'CoAP / UDP over Cellular',
    networkingConcept: 'Network Address Translation (NAT), UDP State Tracking, Firewall Pinholing',
    phase: 'Perancangan',
    targetDate: '2026-12-05',
    status: 'In Progress',
    progressPercent: 35,
    githubUrl: 'https://github.com/pesawaran/coap-coldstorage-tracker',
    isAnnualCounted: false
  },
  {
    id: 'iot_4',
    name: 'Office Environmental Mesh Node with Zigbee & Wi-Fi Bridge',
    problemStatement: 'Suhu, CO2, dan kelembapan di 6 ruangan kantor sulit dimonitor tanpa menarik puluhan kabel sensor.',
    solutionIdea: 'Mesh network Zigbee 3.0 mengumpulkan sensor nirkabel ke single coordinator bridge yang terkoneksi ke Access Point WPA2-Enterprise.',
    hardwareComponents: ['CC2530 Zigbee Coordinator', 'ESP32 Bridge', 'SCD40 CO2 Sensor', 'BME280', 'Custom 3D Enclosure'],
    communicationProtocol: 'Zigbee 3.0 / WebSocket',
    networkingConcept: 'Wireless Fundamentals (802.11 b/g/n, 2.4GHz interference handling, WPA2-Enterprise)',
    phase: 'Brainstorming',
    targetDate: '2026-12-20',
    status: 'Planning',
    progressPercent: 20,
    isAnnualCounted: false
  },
  {
    id: 'iot_5',
    name: 'Smart Access Control with RFID & Radius Server Authentication',
    problemStatement: 'Pintu lab membutuhkan autentikasi kartu RFID yang tersinkronisasi dengan database terpusat sekolah/kantor.',
    solutionIdea: 'ESP32 RC522 reader mengirim request autentikasi ke server melalui enkripsi TLS dengan logging IP terpusat.',
    hardwareComponents: ['ESP32', 'RC522 RFID Reader', 'Solenoid Door Lock 12V', 'Buzzer', 'Status LED'],
    communicationProtocol: 'HTTPS / TLS 1.3 / REST',
    networkingConcept: 'AAA / RADIUS Authentication Concept, Access Control Lists (ACL), NTP Time Sync',
    phase: 'Selesai',
    targetDate: '2026-08-30',
    status: 'Completed',
    progressPercent: 100,
    githubUrl: 'https://github.com/pesawaran/rfid-access-controller',
    testProof: 'Log akses tercatat di PostgreSQL, respon waktu buka pintu < 300ms',
    finalEvaluation: 'Implementasi ACL di router switch mencegah sniffing UID kartu.',
    isAnnualCounted: true
  },
  {
    id: 'iot_6',
    name: 'Server Rack Temperature & Acoustic Anomaly Detector',
    problemStatement: 'Deteksi dini overheating dan bearing fan server yang aus sebelum terjadi server down.',
    solutionIdea: 'Memproses frekuensi getaran mikrofon I2S dan suhu 4 titik di rak server, mengirim alert telegram jika threshold terlampaui.',
    hardwareComponents: ['Raspberry Pi Pico W', 'INMP441 MEMS Mic', '4x DS18B20', 'Buzzer Alarm'],
    communicationProtocol: 'MQTT / Telegram Bot API',
    networkingConcept: 'Syslog Logging, SNMP v3 Traps, Subnetting, NTP synchronization',
    phase: 'Brainstorming',
    targetDate: '2026-12-28',
    status: 'Planning',
    progressPercent: 15,
    isAnnualCounted: false
  }
];

export const INITIAL_CCNA_TOPICS: CCNATopic[] = [
  {
    id: 'ccna_1',
    moduleNumber: 1,
    title: 'Dasar Jaringan & Komponen Jaringan (Routers, Switches, Endpoints)',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 95,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-05',
    studyMinutes: 180,
    mistakesNotes: 'Mengingat perbedaan fungsi collision domain dan broadcast domain pada bridge vs switch',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_2',
    moduleNumber: 2,
    title: 'Model OSI 7 Layer dan TCP/IP Protocol Suite',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 92,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-07',
    studyMinutes: 150,
    mistakesNotes: 'PDU naming: Data, Segment, Packet, Frame, Bits',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_3',
    moduleNumber: 3,
    title: 'Ethernet, Kabel & Switching Fundamentals (MAC Address Table)',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 90,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-09',
    studyMinutes: 120,
    mistakesNotes: 'Switch flooding behavior saat MAC tujuan belum ada di CAM table',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_4',
    moduleNumber: 4,
    title: 'Pengalamatan IPv4, Subnetting VLSM & CIDR Calculations',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 94,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-12',
    studyMinutes: 210,
    mistakesNotes: 'Latihan cepat menghitung subnet mask prefix /27, /28, /29, /30 tanpa kalkulator',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_5',
    moduleNumber: 5,
    title: 'Pengalamatan IPv6 (Global Unicast, Link-Local, EUI-64)',
    theoryLearned: true,
    labCompleted: false,
    quizScore: 82,
    understandingLevel: 'Menengah',
    studyDate: '2026-10-13',
    studyMinutes: 90,
    mistakesNotes: 'SLAAC dan DAD (Duplicate Address Detection) perlu praktik Packet Tracer',
    masteryStatus: 'Sedang Dipelajari'
  },
  {
    id: 'ccna_6',
    moduleNumber: 6,
    title: 'Routing Fundamentals & Static Routing (Default, Floating Static)',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 88,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-14',
    studyMinutes: 140,
    mistakesNotes: 'Administrative Distance untuk floating static route (misal AD 10 untuk backup)',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_7',
    moduleNumber: 7,
    title: 'VLAN, Trunking (802.1Q) dan Inter-VLAN Routing (Router-on-a-Stick / SVI)',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 89,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-16',
    studyMinutes: 160,
    mistakesNotes: 'Pastikan encapsulation dot1Q sub-interface sesuai dengan VLAN ID',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_8',
    moduleNumber: 8,
    title: 'Spanning Tree Protocol (STP, PVST+, Rapid-PVST+)',
    theoryLearned: true,
    labCompleted: false,
    quizScore: 78,
    understandingLevel: 'Menengah',
    studyDate: '2026-10-18',
    studyMinutes: 120,
    mistakesNotes: 'Kriteria Root Bridge election: Bridge Priority terendah lalu MAC address terendah',
    masteryStatus: 'Sedang Dipelajari'
  },
  {
    id: 'ccna_9',
    moduleNumber: 9,
    title: 'Wireless Fundamentals (WLAN, AP Modes, WLC & SSID Security)',
    theoryLearned: false,
    labCompleted: false,
    quizScore: 65,
    understandingLevel: 'Pemula',
    studyMinutes: 60,
    mistakesNotes: 'Arsitektur Split-MAC dan CAPWAP tunneling antara Lightweight AP dan WLC',
    masteryStatus: 'Sedang Dipelajari'
  },
  {
    id: 'ccna_10',
    moduleNumber: 10,
    title: 'Network Services (DHCP Snooping, DNS, NTP, SNMP, Syslog)',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 85,
    understandingLevel: 'Menengah',
    studyDate: '2026-10-20',
    studyMinutes: 130,
    mistakesNotes: 'DHCP Snooping trust port pada uplink ke server DHCP',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_11',
    moduleNumber: 11,
    title: 'Access Control Lists (Standard & Extended IPv4 ACL)',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 90,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-22',
    studyMinutes: 150,
    mistakesNotes: 'Standard ACL diletakkan dekat tujuan, Extended ACL diletakkan dekat sumber',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_12',
    moduleNumber: 12,
    title: 'Network Address Translation (Static NAT, Dynamic NAT, PAT / Overload)',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 92,
    understandingLevel: 'Mahir',
    studyDate: '2026-10-24',
    studyMinutes: 140,
    mistakesNotes: 'Definisi ip nat inside dan ip nat outside pada antarmuka router',
    masteryStatus: 'Dikuasai'
  },
  {
    id: 'ccna_13',
    moduleNumber: 13,
    title: 'Network Security Fundamentals (Port Security, DAI, VPNs)',
    theoryLearned: false,
    labCompleted: false,
    quizScore: 0,
    understandingLevel: 'Belum Paham',
    studyMinutes: 0,
    masteryStatus: 'Belum Dikuasai'
  },
  {
    id: 'ccna_14',
    moduleNumber: 14,
    title: 'Network Automation & Programmability (REST APIs, JSON, Python, Ansible)',
    theoryLearned: false,
    labCompleted: false,
    quizScore: 0,
    understandingLevel: 'Belum Paham',
    studyMinutes: 0,
    masteryStatus: 'Belum Dikuasai'
  },
  {
    id: 'ccna_15',
    moduleNumber: 15,
    title: 'Network Troubleshooting & Cisco IOS CLI Diagnostics',
    theoryLearned: true,
    labCompleted: true,
    quizScore: 88,
    understandingLevel: 'Menengah',
    studyDate: '2026-10-25',
    studyMinutes: 120,
    mistakesNotes: 'show ip interface brief, show ip route, show mac address-table, ping, traceroute',
    masteryStatus: 'Sedang Dipelajari'
  }
];

export const INITIAL_MICROSTOCK_ASSETS: MicrostockAsset[] = [
  {
    id: 'ms_1',
    date: '2026-10-12',
    platform: 'Shutterstock',
    title: 'Geometric Modern Office Facade and Blue Sky',
    assetType: 'Photo',
    uploadedCount: 5,
    approvedCount: 4,
    rejectedCount: 1,
    underReviewCount: 0,
    salesCount: 2,
    revenueUsd: 1.80
  },
  {
    id: 'ms_2',
    date: '2026-10-11',
    platform: 'Shutterstock',
    title: 'Minimalist Indonesian Street Coffee Culture',
    assetType: 'Photo',
    uploadedCount: 5,
    approvedCount: 5,
    rejectedCount: 0,
    underReviewCount: 0,
    salesCount: 3,
    revenueUsd: 3.25
  },
  {
    id: 'ms_3',
    date: '2026-10-10',
    platform: 'Adobe Stock',
    title: 'Circuit Board Close-up IoT Sensor Components',
    assetType: 'Photo',
    uploadedCount: 6,
    approvedCount: 5,
    rejectedCount: 0,
    underReviewCount: 1,
    salesCount: 4,
    revenueUsd: 5.60
  },
  {
    id: 'ms_4',
    date: '2026-10-09',
    platform: 'Shutterstock',
    title: 'Green Hydroponic Vegetables Nutrient Film Technique',
    assetType: 'Photo',
    uploadedCount: 5,
    approvedCount: 4,
    rejectedCount: 1,
    underReviewCount: 0,
    salesCount: 1,
    revenueUsd: 0.95
  }
];

export const INITIAL_GOLD_HOLDINGS: GoldHolding[] = [
  {
    id: 'gh_1',
    date: '2026-01-15',
    grams: 20.0,
    pricePerGram: 1180000,
    totalCost: 23600000,
    type: 'Tabungan Awal',
    notes: 'Tabungan emas fisik awal tahun 2026 (Batangan Antam CertiCard)'
  },
  {
    id: 'gh_2',
    date: '2026-06-20',
    grams: 4.0,
    pricePerGram: 1290000,
    totalCost: 5160000,
    type: 'Tabungan Awal',
    notes: 'Pembelian kuartal 2 (UBS Gold)'
  },
  {
    id: 'gh_3',
    date: '2026-09-10',
    grams: 5.0,
    pricePerGram: 1380000,
    totalCost: 6900000,
    type: 'Pembelian Baru',
    notes: 'Pembelian emas batangan sebelum Q4'
  },
  {
    id: 'gh_4',
    date: '2026-10-10',
    grams: 2.0,
    pricePerGram: 1420000,
    totalCost: 2840000,
    type: 'Pembelian Baru',
    notes: 'Akumulasi awal Oktober 2026'
  }
];

export const INITIAL_TRANSACTIONS: ExpenseTransaction[] = [
  {
    id: 'tx_1',
    timestamp: '2026-10-12 07:15:00',
    date: '2026-10-12',
    category: 'Jajan & Makanan',
    description: 'Jajan pagi kue basah & kopi',
    amount: 5000,
    paymentMethod: 'Tunai',
    notes: 'Warung Bu Sri',
    source: 'Manual'
  },
  {
    id: 'tx_2',
    timestamp: '2026-10-12 09:30:00',
    date: '2026-10-12',
    category: 'Jajan & Makanan',
    description: 'Membeli makanan ringan di halte',
    amount: 2000,
    paymentMethod: 'Tunai',
    notes: 'Biskuit',
    source: 'Manual'
  },
  {
    id: 'tx_3',
    timestamp: '2026-10-12 11:45:00',
    date: '2026-10-12',
    category: 'Infaq',
    description: 'Infaq harian / kotak amal',
    amount: 2000,
    paymentMethod: 'Tunai',
    notes: 'Masjid Al-Muhajirin',
    source: 'Manual'
  },
  {
    id: 'tx_4',
    timestamp: '2026-10-12 12:30:00',
    date: '2026-10-12',
    category: 'Jajan & Makanan',
    description: 'Makan siang nasi padang telur dadar',
    amount: 15000,
    paymentMethod: 'QRIS',
    notes: 'RM Sederhana',
    source: 'Manual'
  },
  {
    id: 'tx_5',
    timestamp: '2026-10-12 16:40:00',
    date: '2026-10-12',
    category: 'Transportasi',
    description: 'Tarif KRL Commuter Line',
    amount: 8000,
    paymentMethod: 'E-Wallet',
    notes: 'Stasiun Juanda ke Depok',
    source: 'Manual'
  },
  {
    id: 'tx_6',
    timestamp: '2026-10-11 14:00:00',
    date: '2026-10-11',
    category: 'IoT & Komponen',
    description: 'Modul jumper wires dan sensor DHT22',
    amount: 45000,
    paymentMethod: 'QRIS',
    notes: 'Toko Elektronik Digital',
    source: 'Manual'
  },
  {
    id: 'tx_7',
    timestamp: '2026-10-10 10:00:00',
    date: '2026-10-10',
    category: 'Pendidikan & Buku',
    description: 'Print latihan materi CCNA VLSM',
    amount: 12000,
    paymentMethod: 'Tunai',
    notes: 'Fotokopi Kampus',
    source: 'Manual'
  }
];

export const INITIAL_FINANCIAL_SETTINGS: FinancialSettings = {
  startingBalance: 4500000, // Rp4.500.000 saldo kas awal
  monthlyExpenseBudget: 1500000, // Budget pengeluaran bulanan Rp1.500.000
  savingsTarget2027: 15000000, // Target tabungan biaya 2027 Rp15.000.000
  goldTargetGrams: 40, // Target tahunan 40 gram emas
  currentGoldMarketPrice: 1465000, // Harga pasar emas manual per gram
  goldPriceLastUpdated: '2026-10-12'
};

export const INITIAL_KPI_CARDS: KPICardConfig[] = [
  { id: 'kpi_habits_today', title: 'Kebiasaan Hari Ini', metricKey: 'habitsToday', isVisible: true, order: 1 },
  { id: 'kpi_habits_week', title: 'Konsistensi Pekan Ini', metricKey: 'habitsWeek', isVisible: true, order: 2 },
  { id: 'kpi_streak', title: 'Rangkaian Hari Konsisten', metricKey: 'streakDays', isVisible: true, order: 3 },
  { id: 'kpi_quran', title: 'Hafalan & Murojaah', metricKey: 'quranProgress', isVisible: true, order: 4 },
  { id: 'kpi_ccna_hours', title: 'Jam Belajar CCNA', metricKey: 'ccnaHours', isVisible: true, order: 5 },
  { id: 'kpi_ccna_mastery', title: 'Penguasaan Jaringan', metricKey: 'ccnaMastery', isVisible: true, order: 6 },
  { id: 'kpi_iot_projects', title: 'Proyek IoT Portofolio', metricKey: 'iotProjects', isVisible: true, order: 7 },
  { id: 'kpi_microstock', title: 'Aset Microstock', metricKey: 'microstockAssets', isVisible: true, order: 8 },
  { id: 'kpi_gold_grams', title: 'Akumulasi Emas Fisik', metricKey: 'goldGrams', isVisible: true, order: 9 },
  { id: 'kpi_expense_month', title: 'Pengeluaran Bulan Ini', metricKey: 'monthlyExpenses', isVisible: true, order: 10 },
  { id: 'kpi_savings_balance', title: 'Saldo Tabungan Kas', metricKey: 'actualSavings', isVisible: true, order: 11 },
  { id: 'kpi_annual_progress', title: 'Progres Target 2026', metricKey: 'annualProgress', isVisible: true, order: 12 }
];

export const INITIAL_QURAN_RECORDS: QuranRecord[] = [
  {
    id: 'qr_1',
    date: '2026-10-12',
    type: 'Murojaah',
    surahFrom: 'Al-Mulk (1-30)',
    surahTo: 'Al-Qalam (1-52)',
    juzOrPageAmount: 0.25,
    unit: 'juz',
    quality: 'Lancar',
    notes: 'Murojaah juz 29 pembuka'
  },
  {
    id: 'qr_2',
    date: '2026-10-12',
    type: 'Ziyadah',
    surahFrom: 'An-Naba',
    juzOrPageAmount: 0.25,
    unit: 'halaman',
    quality: 'Lancar',
    notes: 'Ayat 1-16 hafalan baru'
  },
  {
    id: 'qr_3',
    date: '2026-10-11',
    type: 'Murojaah',
    surahFrom: 'Al-Haqqah',
    surahTo: 'Al-Ma\'arij',
    juzOrPageAmount: 0.25,
    unit: 'juz',
    quality: 'Perlu Diulang',
    notes: 'Beberapa ayat di surah Al-Ma\'arij perlu disimak kembali'
  },
  {
    id: 'qr_4',
    date: '2026-10-11',
    type: 'Ziyadah',
    surahFrom: 'An-Nazi\'at',
    juzOrPageAmount: 0.25,
    unit: 'halaman',
    quality: 'Lancar',
    notes: 'Ayat 1-14 ziyadah sore'
  }
];
