"use client";

import { useState, useEffect } from "react";

const MATCH_PROFILE_KEY = "match_profile_data";

export interface MatchProfile {
  age: string;
  gender: string;
  zipcode: string;
}

interface MatchProfileModalProps {
  onConfirm: (profile: MatchProfile, message: string) => void;
  onClose: () => void;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export function MatchProfileModal({ onConfirm, onClose }: MatchProfileModalProps) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [errors, setErrors] = useState<Partial<MatchProfile>>({});

  // Pre-fill from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(MATCH_PROFILE_KEY);
    if (stored) {
      try {
        const profile = JSON.parse(stored) as MatchProfile;
        if (profile.age) setAge(profile.age);
        if (profile.gender) setGender(profile.gender);
        if (profile.zipcode) setZipcode(profile.zipcode);
      } catch {
        // ignore
      }
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<MatchProfile> = {};
    if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
      newErrors.age = "Please enter a valid age (1–120)";
    }
    if (!gender) {
      newErrors.gender = "Please select a gender";
    }
    if (!zipcode || !/^\d{5}(-\d{4})?$/.test(zipcode.trim())) {
      newErrors.zipcode = "Please enter a valid US ZIP code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    const profile: MatchProfile = { age: age.trim(), gender, zipcode: zipcode.trim() };

    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(MATCH_PROFILE_KEY, JSON.stringify(profile));
    }

    const genderLabel = GENDER_OPTIONS.find((g) => g.value === gender)?.label ?? gender;
    const message = `I am a ${age}-year-old ${genderLabel.toLowerCase()}, living in ZIP code ${zipcode.trim()}. Please help me find matching clinical trials.`;

    onConfirm(profile, message);
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200/60 dark:border-slate-700/60">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔬</span>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Find Your Match
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tell us a bit about yourself to find the most relevant clinical trials.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Age
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 45"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.age && (
              <p className="mt-1 text-xs text-red-500">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(opt.value)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                    gender === opt.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder="e.g. 10001"
              maxLength={10}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.zipcode && (
              <p className="mt-1 text-xs text-red-500">{errors.zipcode}</p>
            )}
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-600 hover:to-violet-600 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Find Matching Trials →
        </button>
      </div>
    </div>
  );
}
