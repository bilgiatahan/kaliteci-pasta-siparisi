// Global type declarations

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY: string;
      ADMIN_EMAIL: string;
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_APP_URL?: string;
    }
  }
}

// Utility types for better type safety
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export {};
