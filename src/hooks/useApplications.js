import { useCallback, useEffect, useState } from 'react';
import { jobsApi } from '../api/endpoints.js';

// board, timeline and analytics all reuse it.
export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState('loading'); 
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    const data = await jobsApi.list();
    setApplications(data?.applications ?? []);
  }, []);

  const load = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      await fetchApplications();
      setStatus('ready');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [fetchApplications]);

  useEffect(() => {
    load();
  }, [load]);


  const create = useCallback(
    async (values) => {
      await jobsApi.create(values);
      try {
        await fetchApplications();
      } catch {
      }
    },
    [fetchApplications],
  );

  const update = useCallback(async (id, changes) => {
    await jobsApi.update(id, changes);
    const updatedAt = new Date().toISOString();
    setApplications((list) =>
      list.map((a) => (a.id === id ? { ...a, ...changes, updated_at: updatedAt } : a)),
    );
  }, []);

  const changeStatus = useCallback((id, newStatus) => update(id, { status: newStatus }), [update]);

  const remove = useCallback(async (id) => {
    await jobsApi.remove(id);
    setApplications((list) => list.filter((a) => a.id !== id));
  }, []);

  const fetchTip = useCallback(async (id) => {
    const data = await jobsApi.aiTip(id);
    setApplications((list) => list.map((a) => (a.id === id ? { ...a, ai_tip: data?.ai_tip ?? null } : a)));
  }, []);

  return { applications, status, error, reload: load, create, update, changeStatus, remove, fetchTip };
}