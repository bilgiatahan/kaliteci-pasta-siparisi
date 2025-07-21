// Error handling utilities

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  originalError?: Error;
}

export class CustomError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class RateLimitError extends CustomError {
  public remainingTime?: number;

  constructor(message: string, remainingTime?: number) {
    super(message, 429, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
    this.remainingTime = remainingTime;
  }
}

export class EmailError extends CustomError {
  constructor(message: string) {
    super(message, 500, "EMAIL_ERROR");
    this.name = "EmailError";
  }
}

// Error handler utility functions
export const errorHandler = {
  // Log error with context
  logError: (error: Error, context?: string) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${context ? `[${context}] ` : ""}Error:`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  },

  // Convert unknown error to AppError
  normalizeError: (error: unknown): AppError => {
    if (error instanceof CustomError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        originalError: error,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        statusCode: 500,
        originalError: error,
      };
    }

    return {
      message: "An unknown error occurred",
      statusCode: 500,
    };
  },

  // Check if error is retryable
  isRetryable: (error: AppError): boolean => {
    const retryableCodes = [500, 502, 503, 504];
    return retryableCodes.includes(error.statusCode || 500);
  },

  // Create user-friendly error message
  getUserMessage: (error: AppError): string => {
    switch (error.code) {
      case "VALIDATION_ERROR":
        return error.message;
      case "RATE_LIMIT_ERROR":
        return "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.";
      case "EMAIL_ERROR":
        return "E-posta gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
      default:
        return "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
    }
  },
};

// React error handling hook
export const useErrorHandler = () => {
  const handleError = (error: unknown, context?: string) => {
    const normalizedError = errorHandler.normalizeError(error);
    errorHandler.logError(
      normalizedError.originalError || new Error(normalizedError.message),
      context
    );

    return {
      userMessage: errorHandler.getUserMessage(normalizedError),
      isRetryable: errorHandler.isRetryable(normalizedError),
      error: normalizedError,
    };
  };

  return { handleError };
};
