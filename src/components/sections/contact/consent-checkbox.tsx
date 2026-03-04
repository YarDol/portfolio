"use client";

import { Link } from "@/i18n/navigation";

type ConsentCheckboxProps = {
  consented: boolean;
  consentTouched: boolean;
  onConsentChange: (checked: boolean) => void;
  consentBefore: string;
  consentLink: string;
  consentAfter: string;
  consentRequired: string;
};

export function ConsentCheckbox({
  consented,
  consentTouched,
  onConsentChange,
  consentBefore,
  consentLink,
  consentAfter,
  consentRequired,
}: ConsentCheckboxProps) {
  return (
    <div className="space-y-1 pt-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="size-4 rounded border border-border/60 bg-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent group-hover:border-accent/50" />
          {consented && (
            <svg
              className="absolute inset-0 m-auto size-2.5 text-white pointer-events-none"
              viewBox="0 0 12 10"
              fill="none"
            >
              <path
                d="M1 5l3.5 3.5L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="text-xs text-muted/70 leading-relaxed">
          {consentBefore}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-accent transition-colors"
          >
            {consentLink}
          </Link>
          {consentAfter}
        </span>
      </label>
      {consentTouched && !consented && (
        <p className="text-xs text-red-500 pl-7">{consentRequired}</p>
      )}
    </div>
  );
}
