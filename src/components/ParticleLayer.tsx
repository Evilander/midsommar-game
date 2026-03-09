// ─── ParticleLayer ─── Nature is alive and watching ───

import { useEffect, useRef, useState } from 'react'

type ParticlePreset = 'flowers' | 'embers' | 'pollen' | 'snow' | 'none'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
}

const PRESETS: Record<Exclude<ParticlePreset, 'none'>, {
  color: string
  minSize: number
  maxSize: number
  count: number
  speed: number
  direction: 'down' | 'up' | 'float'
  shape: 'circle' | 'petal' | 'dot'
}> = {
  flowers: {
    color: 'rgba(232, 196, 196, 0.6)',
    minSize: 3,
    maxSize: 8,
    count: 18,
    speed: 0.3,
    direction: 'down',
    shape: 'petal',
  },
  embers: {
    color: 'rgba(255, 140, 40, 0.7)',
    minSize: 2,
    maxSize: 5,
    count: 25,
    speed: 0.5,
    direction: 'up',
    shape: 'dot',
  },
  pollen: {
    color: 'rgba(196, 163, 90, 0.4)',
    minSize: 1,
    maxSize: 3,
    count: 15,
    speed: 0.15,
    direction: 'float',
    shape: 'circle',
  },
  snow: {
    color: 'rgba(255, 255, 255, 0.5)',
    minSize: 1,
    maxSize: 4,
    count: 12,
    speed: 0.2,
    direction: 'down',
    shape: 'circle',
  },
}

function createParticle(preset: typeof PRESETS[keyof typeof PRESETS], w: number, h: number): Particle {
  const size = preset.minSize + Math.random() * (preset.maxSize - preset.minSize)
  const maxLife = 300 + Math.random() * 400

  const x = Math.random() * w
  let y: number
  let vx: number
  let vy: number

  switch (preset.direction) {
    case 'down':
      y = -size
      vx = (Math.random() - 0.5) * preset.speed
      vy = preset.speed + Math.random() * preset.speed * 0.5
      break
    case 'up':
      y = h + size
      vx = (Math.random() - 0.5) * preset.speed * 2
      vy = -(preset.speed + Math.random() * preset.speed)
      break
    case 'float':
    default:
      y = Math.random() * h
      vx = (Math.random() - 0.5) * preset.speed
      vy = (Math.random() - 0.5) * preset.speed
      break
  }

  return {
    x,
    y,
    vx,
    vy,
    size,
    opacity: 0,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    life: 0,
    maxLife,
  }
}

export function ParticleLayer({
  preset,
  intensity = 0.5,
  enabled = true,
}: {
  preset: ParticlePreset
  intensity?: number
  enabled?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef(0)
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const update = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!enabled || preset === 'none' || dimensions.w === 0) {
      particlesRef.current = []
      cancelAnimationFrame(frameRef.current)
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, dimensions.w, dimensions.h)
      return
    }

    const config = PRESETS[preset]
    if (!config) return

    const maxCount = Math.round(config.count * Math.min(1, intensity))
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = dimensions.w
    canvas.height = dimensions.h
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const tick = () => {
      ctx.clearRect(0, 0, dimensions.w, dimensions.h)

      // Spawn new particles
      while (particlesRef.current.length < maxCount) {
        particlesRef.current.push(createParticle(config, dimensions.w, dimensions.h))
      }

      // Update and draw
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        // Fade in/out
        const lifeRatio = p.life / p.maxLife
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio / 0.1
        } else if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) / 0.2
        } else {
          p.opacity = 1
        }

        // Float drift
        if (config.direction === 'float') {
          p.vx += (Math.random() - 0.5) * 0.02
          p.vy += (Math.random() - 0.5) * 0.02
        }

        // Draw
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity * intensity

        if (config.shape === 'petal') {
          ctx.fillStyle = config.color
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2)
          ctx.fill()
        } else if (config.shape === 'dot') {
          ctx.fillStyle = config.color
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = config.color
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()

        // Remove if dead or offscreen
        if (p.life >= p.maxLife) return false
        if (p.y < -20 || p.y > dimensions.h + 20) return false
        if (p.x < -20 || p.x > dimensions.w + 20) return false
        return true
      })

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameRef.current)
  }, [preset, intensity, enabled, dimensions])

  if (!enabled || preset === 'none') return null

  return (
    <canvas
      ref={canvasRef}
      className="particle-layer"
      width={dimensions.w}
      height={dimensions.h}
      aria-hidden="true"
    />
  )
}
