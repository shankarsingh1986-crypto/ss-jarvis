// SS JARVIS Service Worker
const CACHE = 'ss-jarvis-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Listen for scheduled notification messages from main app
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleAll(e.data.schedule);
  }
  if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
    showNotif(e.data.title, e.data.body, e.data.tag);
  }
});

function showNotif(title, body, tag) {
  self.registration.showNotification(title, {
    body: body,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230A0A08"/><text y=".9em" font-size="80" x="10">⚡</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23C9A84C"/></svg>',
    tag: tag || 'jarvis',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { url: self.registration.scope }
  });
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      if (list.length > 0) {
        list[0].focus();
      } else {
        clients.openWindow(e.notification.data.url || '/');
      }
    })
  );
});

// Periodic sync if supported
self.addEventListener('periodicsync', e => {
  if (e.tag === 'jarvis-check') {
    e.waitUntil(doPeriodicCheck());
  }
});

async function doPeriodicCheck() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  
  // These are approximate — exact timing handled by main app
  if (h === 3 && m < 15) showNotif('⚡ JARVIS | 3:00 AM', 'Shankar. Meditation time. Your Shiva is waiting. Do not negotiate with the alarm.', 'morning');
  else if (h === 8 && m < 15) showNotif('⚡ JARVIS | Office Mode', 'You are entering office hours. Top priority today — confirm it before you sit down.', 'office');
  else if (h === 13 && m < 15) showNotif('⚡ JARVIS | Midday Check', 'Half the day is gone. Open JARVIS. Account for the morning.', 'midday');
  else if (h === 19 && m < 15) showNotif('⚡ JARVIS | You Are Home', 'Office hours over. Open JARVIS now. Evening review begins.', 'home');
  else if (h === 22 && m < 15) showNotif('⚡ JARVIS | Before You Sleep', 'Did you do what you said? Open JARVIS. Honest answer required.', 'sleep');
}
