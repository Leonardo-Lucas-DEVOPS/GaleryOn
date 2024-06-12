import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHMwgz5lPuVljx_zXUphhwp-rquswYqh0",
  authDomain: "galeryon-f5cdb.firebaseapp.com",
  projectId: "galeryon-f5cdb",
  storageBucket: "galeryon-f5cdb.appspot.com",
  messagingSenderId: "181834631158",
  appId: "1:181834631158:web:163b9d707b8ca4571469d7"
};


let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  app = getApps()[0];
}

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
export default firebaseConfig;

