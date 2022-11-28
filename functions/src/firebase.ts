/* eslint-disable linebreak-style */
// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFGiabw3T5F3tPw3dYBw7QZ2Y0YXe21oM",
  authDomain: "careerlaunch-4-aabf9.firebaseapp.com",
  databaseURL: "https://careerlaunch-4-aabf9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "careerlaunch-4-aabf9",
  storageBucket: "careerlaunch-4-aabf9.appspot.com",
  messagingSenderId: "654422240311",
  appId: "1:654422240311:web:c829281cdccbe3795623b2",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// eslint-disable-next-line require-jsdoc
export async function getAllUsers(): Promise<object[]> {
  const snapshot = await db.collection("users").get();
  return snapshot.docs.map((doc) => doc.data());
}
