declare module 'react' {
  export type ReactNode = any;
  export type ChangeEvent<T = any> = { target: { value: any } };
  export function useState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(fn: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(fn: () => T, deps?: any[]): T;
  export const Fragment: any;
  export const Toaster: any;
  export const ChangeEvent: any;
  export const useMemo: any;
  const React: any;
  export default React;
}

declare module 'react-hot-toast' {
  const toast: any;
  export default toast;
  export const Toaster: any;
}

declare namespace React {
  type ChangeEvent<T = any> = any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
