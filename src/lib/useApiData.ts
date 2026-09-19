import { useEffect, useState } from 'react';
import { api } from './api';

interface ApiDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Loads `path` from the backend. Pass `null` to skip (e.g. while the user isn't authorized). */
export function useApiData<T>(path: string | null) {
  const [state, setState] = useState<ApiDataState<T>>({ data: null, loading: path !== null, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (path === null) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get<T>(path)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Request failed' });
      });
    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}
