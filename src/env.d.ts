declare module "@barba/core" {
  const barba: any;
  export default barba;
}

declare module "@barba/prefetch" {
  const barbaPrefetch: any;
  export default barbaPrefetch;
}

declare global {
  interface Window {
    barba: any;
    __barba_initialized?: boolean;
  }
}

export {};
