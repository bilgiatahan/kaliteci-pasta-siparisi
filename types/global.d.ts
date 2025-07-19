declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY: string;
      ADMIN_EMAIL?: string;
      NODE_ENV: string;
    }
  }
}

export {};
