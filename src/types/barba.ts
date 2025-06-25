type BarbaHookFn = (data: any) => void;

const afterEnterHooks: BarbaHookFn[] = [];

export function registerAfterEnterHook(fn: BarbaHookFn) {
  afterEnterHooks.push(fn);
}

export function runAfterEnterHooks(data: any) {
  for (const fn of afterEnterHooks) {
    fn(data);
  }
}

// Make accessible globally
if (typeof window !== 'undefined') {
  (window as any).registerAfterEnterHook = registerAfterEnterHook;
}

