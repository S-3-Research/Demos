"use client";

import { useState, useEffect } from "react";
import type { UserRole, ResponseStyle, UserIntent, IntakeData } from "@/lib/types/intake";
import { INTAKE_STORAGE_KEY } from "@/lib/types/intake";

interface IntakeFormModalProps {
  onComplete: (data: IntakeData) => void;
  onSkip?: () => void;
}

export function IntakeFormModal({ onComplete, onSkip }: IntakeFormModalProps) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [responseStyle, setResponseStyle] = useState<ResponseStyle | null>(null);
  const [intent, setIntent] = useState<UserIntent | null>(null);

  // Check if user has already completed intake
  useEffect(() => {
    const stored = localStorage.getItem(INTAKE_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as IntakeData;
        onComplete(data);
      } catch (error) {
        console.error('Failed to parse stored intake data:', error);
      }
    }
  }, [onComplete]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleStyleSelect = (selectedStyle: ResponseStyle) => {
    setResponseStyle(selectedStyle);
    setStep(3);
  };

  const handleIntentSelect = (selectedIntent: UserIntent) => {
    const data: IntakeData = {
      role,
      response_style: responseStyle,
      intent: selectedIntent,
      completed_at: new Date().toISOString(),
    };
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data));
    onComplete(data);
  };

  const handleSkipStep = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleSkipAll = () => {
    if (onSkip) {
      onSkip();
    } else {
      // Skip entire form — all fields null
      const data: IntakeData = {
        role: null,
        response_style: null,
        intent: null,
        completed_at: new Date().toISOString(),
      };
      localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data));
      onComplete(data);
    }
  };

  // Skip current step and complete with nulls for remaining steps
  const handleSkipFromStep2 = () => {
    const data: IntakeData = {
      role,
      response_style: null,
      intent: null,
      completed_at: new Date().toISOString(),
    };
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data));
    onComplete(data);
  };

  const handleSkipFromStep3 = () => {
    const data: IntakeData = {
      role,
      response_style: responseStyle,
      intent: null,
      completed_at: new Date().toISOString(),
    };
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data));
    onComplete(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 m-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Who are you looking for information for?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect('user')}
                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Myself
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  I&apos;m looking for clinical trials for myself
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('caregiver')}
                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Someone else
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  I&apos;m helping someone else to find information about clinical trials
                </div>
              </button>
            </div>

            <button
              onClick={handleSkipAll}
              className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 2: Response Style */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Communication Style
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                How would you prefer to receive information?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleStyleSelect('concise')}
                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Brief & Direct
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Get straight to the point with essential information
                </div>
              </button>

              <button
                onClick={() => handleStyleSelect('balanced')}
                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Balanced
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  A good mix of detail and clarity
                </div>
              </button>

              <button
                onClick={() => handleStyleSelect('verbose')}
                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Detailed & Comprehensive
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  In-depth explanations with context and examples
                </div>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSkipFromStep2}
                className="flex-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Intent */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Your Goal
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                What brings you here today?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleIntentSelect('trial_matching')}
                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Find Suitable Clinical Trials
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Help me search for and match with clinical trials
                </div>
              </button>

              <button
                onClick={() => handleIntentSelect('learn_about_trials')}
                className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Learn About Clinical Trials
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  I want to understand what clinical trials are
                </div>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSkipFromStep3}
                className="flex-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
