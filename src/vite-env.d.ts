/// <reference types="vite/client" />

declare module '*.po' {
  const messages: Record<string, string>
  export { messages }
}
