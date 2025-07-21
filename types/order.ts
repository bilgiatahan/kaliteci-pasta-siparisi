// Order related types and interfaces

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface CakeSpecifications {
  pandispanya: PandispanyaType;
  krema: KremaType;
  icerikler: IcerikType[];
  sekil: SekilType;
  ozelSekil?: string;
  kisiSayisi: number;
  katSayisi: KatSayisiType;
}

export interface DeliveryInfo {
  teslimat: TeslimatType;
  adres?: string;
  teslimatTarihi: string;
  teslimatSaati: string;
}

export interface OrderFormData
  extends CustomerInfo,
    CakeSpecifications,
    DeliveryInfo {
  ozelNotlar?: string;
  referansGorsel?: File | null;
}

// Enum-like types for better type safety
export type PandispanyaType = "Kakaolu" | "Vanilya/Sade";
export type KremaType = "Çikolata Krema" | "Beyaz Krema";
export type IcerikType =
  | "Çikolata"
  | "Çilek"
  | "Muz"
  | "Frambuaz"
  | "Böğürtlen"
  | "Oreo"
  | "Lotus"
  | "Krokan"
  | "Kestane"
  | "Vişne";
export type SekilType = "Kalp" | "Yuvarlak" | "Yıldız" | "Özel Şekil";
export type KatSayisiType = "tek" | "çift";
export type TeslimatType = "Şubeden Teslim" | "Adrese Teslim";

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Form state types
export interface FormState {
  data: OrderFormData;
  isSubmitting: boolean;
  errors: ValidationError[];
  isSuccess: boolean;
  submitMessage: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OrderSubmissionResponse {
  message: string;
  businessEmailId?: string;
  remainingTimeMs?: number;
  warning?: string;
}

// Rate limiting types
export interface RateLimitInfo {
  isAllowed: boolean;
  remainingTime?: number;
  remainingHours?: number;
  remainingMinutes?: number;
}

// Configuration types for options
export interface FormOption<T> {
  value: T;
  label: string;
  emoji?: string;
  description?: string;
}

export interface ShapeOption extends FormOption<SekilType> {
  className?: string;
}
