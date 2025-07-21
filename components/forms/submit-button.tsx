import React from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="text-center pt-8">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full text-white font-bold py-5 px-12 rounded-2xl text-xl
          transition-all duration-300 transform
          ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 hover:scale-105 active:scale-95"
          }
          shadow-lg hover:shadow-xl
        `}
      >
        <span className="flex items-center justify-center">
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sipariş Gönderiliyor...
            </>
          ) : (
            <>🎂 Siparişi Gönder</>
          )}
        </span>
      </button>
    </div>
  );
};
