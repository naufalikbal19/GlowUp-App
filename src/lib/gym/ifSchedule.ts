import type { Goal } from "../calc";

export interface IFSchedule {
  protocol: string;
  fastingHours: number;
  eatingHours: number;
  eatingWindowStart: string;
  eatingWindowEnd: string;
  description: string;
  tips: string[];
}

const BASE_TIPS = [
  "Minum air putih yang cukup selama jendela puasa, boleh air putih, teh/kopi tanpa gula.",
  "Buka jendela makan dengan porsi wajar, jangan langsung porsi besar agar pencernaan nyaman.",
  "Utamakan protein dan serat di setiap sesi makan agar kenyang lebih lama.",
  "Boleh disesuaikan jam nya asal durasi puasa & makan tetap konsisten setiap hari.",
];

export function buildIfSchedule(goal: Goal): IFSchedule {
  if (goal === "LOSE_FAT") {
    return {
      protocol: "16:8",
      fastingHours: 16,
      eatingHours: 8,
      eatingWindowStart: "12:00",
      eatingWindowEnd: "20:00",
      description:
        "Puasa 16 jam, makan dalam jendela 8 jam. Protokol paling efektif untuk defisit kalori dan menurunkan lemak tubuh tanpa terlalu membatasi jenis makanan.",
      tips: BASE_TIPS,
    };
  }
  if (goal === "GAIN_MUSCLE") {
    return {
      protocol: "12:12",
      fastingHours: 12,
      eatingHours: 12,
      eatingWindowStart: "08:00",
      eatingWindowEnd: "20:00",
      description:
        "Puasa 12 jam (kebanyakan saat tidur), makan dalam jendela 12 jam agar lebih mudah mengejar surplus kalori dan frekuensi makan untuk mendukung pertumbuhan otot.",
      tips: [
        ...BASE_TIPS,
        "Tambahkan camilan tinggi protein/kalori di antara waktu makan besar untuk membantu mengejar target kalori surplus.",
      ],
    };
  }
  return {
    protocol: "14:10",
    fastingHours: 14,
    eatingHours: 10,
    eatingWindowStart: "10:00",
    eatingWindowEnd: "20:00",
    description:
      "Puasa 14 jam, makan dalam jendela 10 jam. Cocok untuk menjaga berat badan sambil tetap mendapat manfaat metabolik dari puasa intermiten.",
    tips: BASE_TIPS,
  };
}
