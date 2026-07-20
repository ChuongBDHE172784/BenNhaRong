import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; setLoading(true); fetchApi<{ data: T }>(path).then((r) => active && setData(r.data)).catch((e: Error) => active && setError(e.message)).finally(() => active && setLoading(false)); return () => { active = false; }; }, [path]);
  return { data, error, loading };
}
