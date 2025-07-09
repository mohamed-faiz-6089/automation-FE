import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface RunnerLog { msg: string; type: 'info' | 'error'; }

const RunnerWindow: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  /* Listen report channel (simple broadcastChannel) */
  useEffect(() => {
    const channel = new BroadcastChannel('automation-log');
    channel.onmessage = (e) => {
      const log = e.data as RunnerLog;
      toast[log.type === 'error' ? 'error' : 'info'](log.msg);
    };
    return () => channel.close();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Automation Runner"
      style={{ width: '100%', height: '100%', border: 0 }}
      src="/runner-placeholder.html"
    />
  );
};
export default RunnerWindow;
