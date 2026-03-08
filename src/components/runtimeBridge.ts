export interface RuntimeBridge {
  advanceTime: (ms: number) => void
  snapshot: () => string
}
