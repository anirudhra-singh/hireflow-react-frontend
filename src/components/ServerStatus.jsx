import { Alert } from './Alert.jsx';
import { useServerWaking } from '../hooks/useServerWaking.js';

export default function ServerStatus() {
  const waking = useServerWaking();
  return (
    <div aria-live="polite">
      {waking && <Alert tone="info">Waking up the server, this can take a minute</Alert>}
    </div>
  );
}