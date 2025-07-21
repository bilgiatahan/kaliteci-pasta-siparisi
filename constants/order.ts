import {
  IcerikType,
  PandispanyaType,
  KremaType,
  TeslimatType,
  KatSayisiType,
  FormOption,
  ShapeOption,
  SekilType,
} from "@/types/order";

// Form validation constants
export const VALIDATION_RULES = {
  PHONE: {
    PATTERN: /^5[0-9]{9}$/,
    LENGTH: 10,
    PREFIX: "+90",
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PERSON_COUNT: {
    MIN: 1,
    MAX: 50,
    MULTI_LAYER_THRESHOLD: 10,
  },
} as const;

// Rate limiting constants
export const RATE_LIMIT = {
  COOLDOWN_HOURS: 6,
  COOLDOWN_MS: 6 * 60 * 60 * 1000,
} as const;

// Business hours and delivery constraints
export const DELIVERY_CONSTRAINTS = {
  MIN_HOURS_ADVANCE: 9,
  MAX_HOURS_ADVANCE: 18,
  TIME_INTERVAL_MINUTES: 60,
} as const;

// Form options
export const PANDISPANYA_OPTIONS: FormOption<PandispanyaType>[] = [
  { value: "Kakaolu", label: "Kakaolu" },
  { value: "Vanilya/Sade", label: "Vanilya/Sade" },
] as const;

export const KREMA_OPTIONS: FormOption<KremaType>[] = [
  { value: "Çikolata Krema", label: "Çikolata Krema" },
  { value: "Beyaz Krema", label: "Beyaz Krema" },
] as const;

export const ICERIK_OPTIONS: FormOption<IcerikType>[] = [
  { value: "Çikolata", label: "Çikolata" },
  { value: "Çilek", label: "Çilek" },
  { value: "Muz", label: "Muz" },
  { value: "Frambuaz", label: "Frambuaz" },
  { value: "Böğürtlen", label: "Böğürtlen" },
  { value: "Oreo", label: "Oreo" },
  { value: "Lotus", label: "Lotus" },
  { value: "Krokan", label: "Krokan" },
  { value: "Kestane", label: "Kestane" },
  { value: "Vişne", label: "Vişne" },
] as const;

export const SEKIL_OPTIONS: ShapeOption[] = [
  {
    value: "Kalp",
    label: "Kalp",
    emoji: "❤️",
    className: "shape-heart",
  },
  {
    value: "Yuvarlak",
    label: "Yuvarlak",
    emoji: "⭕",
    className: "shape-circle",
  },
  {
    value: "Yıldız",
    label: "Yıldız",
    emoji: "⭐",
    className: "shape-star",
  },
  {
    value: "Özel Şekil",
    label: "Özel Şekil",
    emoji: "🎨",
    className: "shape-custom",
  },
] as const;

export const TESLIMAT_OPTIONS: FormOption<TeslimatType>[] = [
  { value: "Şubeden Teslim", label: "Şubeden Teslim" },
  { value: "Adrese Teslim", label: "Adrese Teslim" },
] as const;

export const KAT_SAYISI_OPTIONS: FormOption<KatSayisiType>[] = [
  { value: "tek", label: "Tek Katlı" },
  { value: "çift", label: "Çift Katlı" },
] as const;

// UI Constants
export const UI_CONSTANTS = {
  POPUP_AUTO_CLOSE_DELAY: 5000,
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/gif"],
  DATE_FORMAT: "dd/MM/yyyy",
  TIME_FORMAT: "HH:mm",
  LOCALE: "tr",
} as const;

// API Constants
export const API_ENDPOINTS = {
  ORDERS: "/api/siparis",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: "❌ Lütfen geçerli bir e-posta adresi girin!",
  INVALID_PHONE:
    "❌ Lütfen geçerli bir telefon numarası girin! (5XX XXX XX XX formatında)",
  SUBMIT_ERROR:
    "❌ Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
  CONNECTION_ERROR: "❌ Bağlantı hatası. Lütfen tekrar deneyin.",
  RATE_LIMIT_ERROR:
    "Bu telefon numarası ile çok yakın zamanda sipariş verilmiş",
  MAIL_ERROR: "Mail gönderilirken hata oluştu",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_SUBMITTED:
    "✅ Siparişiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.",
  FORM_VALIDATION_PASSED: "Form validation passed successfully",
} as const;

// Default form values
export const DEFAULT_FORM_VALUES = {
  pandispanya: "",
  krema: "",
  icerikler: [] as IcerikType[],
  sekil: "" as SekilType,
  ozelSekil: "",
  kisiSayisi: 0,
  katSayisi: "tek" as KatSayisiType,
  teslimat: "" as TeslimatType,
  adres: "",
  teslimatTarihi: "",
  teslimatSaati: "",
  name: "",
  phone: "+90",
  email: "",
  ozelNotlar: "",
  referansGorsel: null,
} as const;
