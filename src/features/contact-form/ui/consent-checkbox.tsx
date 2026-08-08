"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Link } from "@/shared/i18n";

type ConsentCheckboxProps = {
  consentBefore: string;
  consentLink: string;
  consentAfter: string;
  consentRequired: string;
};

export type ConsentCheckboxRef = {
  isConsented: () => boolean;
  touch: () => void;
  reset: () => void;
};

export const ConsentCheckbox = forwardRef<ConsentCheckboxRef, ConsentCheckboxProps>(
  function ConsentCheckbox(
    { consentBefore, consentLink, consentAfter, consentRequired },
    ref,
  ) {
    const [consented, setConsented] = useState(false);
    const [consentTouched, setConsentTouched] = useState(false);

    useImperativeHandle(ref, () => ({
      isConsented: () => consented,
      touch: () => setConsentTouched(true),
      reset: () => {
        setConsented(false);
        setConsentTouched(false);
      },
    }));

    return (
      <div className="space-y-1 pt-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => {
                setConsented(e.target.checked);
                setConsentTouched(true);
              }}
              className="sr-only peer"
            />
            <div className="size-4 rounded border border-foreground/25 bg-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent group-hover:border-foreground/50" />
            {consented && (
              <svg
                className="absolute inset-0 m-auto size-2.5 text-background pointer-events-none"
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
        <p className={`text-xs text-red-500 pl-7 ${consentTouched && !consented ? "" : "invisible"}`}>
          {consentRequired}
        </p>
      </div>
    );
  },
);
