import 'vite'

declare module 'vite' {
  interface UserConfig {
    test?: Record<string, unknown>
  }
}
