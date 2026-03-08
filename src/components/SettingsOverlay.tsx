// ─── SettingsOverlay ─── Volume, text speed, accessibility ───

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import type { GameSettings } from '../stores/gameStore'

const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function SettingsOverlay({
  open,
  settings,
  onClose,
  onChange,
}: {
  open: boolean
  settings: GameSettings
  onClose: () => void
  onChange: (settings: GameSettings) => void
}) {
  const [local, setLocal] = useState(settings)

  useEffect(() => {
    if (open) setLocal(settings)
  }, [open, settings])

  const update = useCallback(
    (patch: Partial<GameSettings>) => {
      const next = { ...local, ...patch }
      setLocal(next)
      onChange(next)
    },
    [local, onChange],
  )

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="settings-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_SOFT }}
        >
          <motion.div
            className="settings-overlay__panel"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            <h2 className="settings-overlay__title">Settings</h2>

            <div className="settings-overlay__group">
              <label className="settings-overlay__label">
                Volume
                <span className="settings-overlay__value">{Math.round(local.masterVolume * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(local.masterVolume * 100)}
                onChange={(e) => update({ masterVolume: Number(e.target.value) / 100 })}
                className="settings-overlay__slider"
              />
            </div>

            <div className="settings-overlay__group">
              <label className="settings-overlay__label">Text Speed</label>
              <div className="settings-overlay__options">
                {(['slow', 'normal', 'fast', 'instant'] as const).map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    className={`settings-overlay__option${local.textSpeed === speed ? ' settings-overlay__option--active' : ''}`}
                    onClick={() => update({ textSpeed: speed })}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-overlay__group">
              <label className="settings-overlay__label">
                <input
                  type="checkbox"
                  checked={local.reduceMotion}
                  onChange={(e) => update({ reduceMotion: e.target.checked })}
                  className="settings-overlay__checkbox"
                />
                Reduce motion
              </label>
            </div>

            <button type="button" className="settings-overlay__close" onClick={onClose}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
