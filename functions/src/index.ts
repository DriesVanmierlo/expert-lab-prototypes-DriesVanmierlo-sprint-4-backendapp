/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
// import {getAllUsers} from "./firebase";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const onLocationAdded = functions.database
    .ref("/location/{uid}")
    .onCreate(async (snapshot, context) => {
      const uid = context.params.uid;
      console.log(`New location added by user with uid: ${uid}`);

      const locationData = snapshot.val();
      console.log(`Location data: ${locationData.latitude}`);

      // eslint-disable-next-line prefer-const
      let allUsers: admin.firestore.DocumentData[] = [];

      const db = admin.firestore();
      const query = await db.collection("users").get();
      query.forEach((doc) => {
        console.log("USER DATA: ", doc.data());
        allUsers.push(doc.data());
      });
      console.log("ALL USERS: ", allUsers);
    });

