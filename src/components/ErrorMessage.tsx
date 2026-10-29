import { AlertCircle, RefreshCw } from "lucide-react";

import Button from "./Button";

type ErrorMessageProps = {
  message: string | null;
  onRetry: () => void;
};

/**  ErrorMessage component */
export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle size={28} className="text-red-500" aria-hidden="true" />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          Something went wrong
        </h2>

        <p className="mb-6 text-sm leading-6 text-slate-500">
          Unable to load your data. Please try again in a moment.
        </p>

        {message && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
          >
            {message}
          </div>
        )}

        <Button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 md:w-auto"
          onClick={onRetry}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </Button>
      </div>
    </div>
  );
}
