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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync local state when overlay opens
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
                Master Volume
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
              <label className="settings-overlay__label">
                Soundtrack
                <span className="settings-overlay__value">{Math.round(local.soundtrackVolume * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(local.soundtrackVolume * 100)}
                onChange={(e) => update({ soundtrackVolume: Number(e.target.value) / 100 })}
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
              <label className="settings-overlay__label">Font Size</label>
              <div className="settings-overlay__options">
                {(['small', 'normal', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`settings-overlay__option${local.fontSize === size ? ' settings-overlay__option--active' : ''}`}
                    onClick={() => update({ fontSize: size })}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="settings-overlay__section">Accessibility</h3>

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

            <div className="settings-overlay__group">
              <label className="settings-overlay__label">
                <input
                  type="checkbox"
                  checked={local.enableDistortion}
                  onChange={(e) => update({ enableDistortion: e.target.checked })}
                  className="settings-overlay__checkbox"
                />
                Text distortion effects
              </label>
              <span className="settings-overlay__hint">Shimmer, word shifts, and gaslighting text</span>
            </div>

            <div className="settings-overlay__group">
              <label className="settings-overlay__label">
                <input
                  type="checkbox"
                  checked={local.enableScreenEffects}
                  onChange={(e) => update({ enableScreenEffects: e.target.checked })}
                  className="settings-overlay__checkbox"
                />
                Screen effects
              </label>
              <span className="settings-overlay__hint">Psychedelic overlays, vignettes, visual distortion</span>
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
