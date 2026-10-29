import { useEffect, useState } from 'react';
import { subscribeToSlowRequests } from '../api/client.js';

export function useServerWaking() {
  const [waking, setWaking] = useState(false);
  useEffect(() => subscribeToSlowRequests(setWaking), []);
  return waking;
}