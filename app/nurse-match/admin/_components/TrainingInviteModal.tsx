'use client'

import { useState } from 'react'
import { X, Send, ExternalLink } from 'lucide-react'
import type { NurseApplication } from './types'

interface Props {
  nurse: NurseApplication
  onClose: () => void
  onSuccess: (updated: NurseApplication) => void
}

const PLACEHOLDER_URL = 'https://training.achieve.org/cohort-4'

export function TrainingInviteModal({ nurse, onClose, onSuccess }: Props) {
  const [trainingUrl, setTrainingUrl] = useState(nurse.training_invitation_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/nurse-match/admin/training-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nurse.id, trainingUrl: trainingUrl || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send invite')

      onSuccess({
        ...nurse,
        training_status: 'invited',
        training_invited_at: new Date().toISOString(),
        training_invitation_url: data.trainingUrl,
      })
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const previewUrl = trainingUrl.trim() || PLACEHOLDER_URL
  const isReinvite = nurse.training_status === 'invited' || nurse.training_status === 'in_progress'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-800 text-base">
              {isReinvite ? 'Resend Training Invite' : 'Send Training Invite'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {nurse.first_name} {nurse.last_name} · {nurse.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
                       hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {isReinvite && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700">
              This nurse was previously invited on{' '}
              {nurse.training_invited_at
                ? new Date(nurse.training_invited_at).toLocaleDateString()
                : 'an unknown date'}.
              Sending again will overwrite the existing invite URL.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Training URL
            </label>
            <input
              type="url"
              value={trainingUrl}
              onChange={(e) => setTrainingUrl(e.target.value)}
              placeholder={PLACEHOLDER_URL}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700
                         placeholder:text-slate-300 outline-none focus:border-blue-300 transition-colors"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Leave blank to use the default placeholder URL.
            </p>
          </div>

          {/* Email preview card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Email Preview</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>To:</strong> {nurse.email}<br />
              <strong>Subject:</strong> Your ACHIEVE Training Has Been Scheduled<br />
              <strong>CTA:</strong>{' '}
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {previewUrl.length > 50 ? previewUrl.slice(0, 50) + '…' : previewUrl}
                <ExternalLink size={10} />
              </a>
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600
                       hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm
                       font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={14} />
            {loading ? 'Sending…' : isReinvite ? 'Resend Invite' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  )
}
