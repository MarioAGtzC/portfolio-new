import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Mexico_City',
});

/** Current time in Mexico City, refreshed every 30 seconds. */
function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <time dateTime={now.toISOString()}>{formatter.format(now)}</time>;
}

export default LiveClock;
