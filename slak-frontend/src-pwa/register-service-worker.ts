import { register } from 'register-service-worker';
import { api } from 'lib/axios';

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  async ready(registration) {
    console.log('Service worker is active.', registration);

    // Setup push notifications
    try {
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const vapidPublicKey = (
          await api.get<string>('/web-push/vapid-public-key')
        ).data;

        subscription = await registration.pushManager.subscribe({
          applicationServerKey: vapidPublicKey,
          userVisibleOnly: true,
        });
      }

      await api.post('/web-push/subscribe', { subscription });
    } catch (err) {
      console.error("Couldn't subscribe to push notifications", err);
    }
  },

  registered(/* registration */) {
    console.log('Service worker has been registered.');
  },

  cached(/* registration */) {
    console.log('Content has been cached for offline use.');
  },

  updatefound(/* registration */) {
    console.log('New content is downloading.');
  },

  updated(/* registration */) {
    console.log('New content is available; please refresh.');
  },

  offline() {
    console.log(
      'No internet connection found. App is running in offline mode.'
    );
  },

  error(err) {
    console.error('Error during service worker registration:', err);
  },
});
