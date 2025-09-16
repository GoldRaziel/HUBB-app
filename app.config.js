const fs = require('fs');

function readFirebaseLocal() {
  try {
    const raw = fs.readFileSync('./config/firebase.local.json', 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

module.exports = () => {
  // carica la base da app.json se presente
  let base = {};
  try { base = require('./app.json').expo || {}; } catch {}

  const firebase = readFirebaseLocal();

  return {
    ...base,
    extra: {
      ...(base.extra || {}),
      firebase,
      // anche come EXPO_PUBLIC_* per compatibilità
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || firebase.apiKey,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || firebase.authDomain,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || firebase.projectId,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || firebase.storageBucket,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebase.messagingSenderId,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || firebase.appId,
    },
  };
};
