importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Config is injected at runtime — replace with real values via env or build step.
// The service worker cannot access NEXT_PUBLIC_ env vars directly, so we use
// a self.__FIREBASE_CONFIG__ global set by the main app, or fall back to the
// values baked in here during the build.
const config = self.__FIREBASE_CONFIG__ || {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title = "Resortian", body = "" } = payload.notification ?? {};
  self.registration.showNotification(title, {
    body,
    icon: "/images/logo.png",
  });
});
