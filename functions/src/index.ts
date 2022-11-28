/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {getDistance} from "geolib";

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
      // eslint-disable-next-line prefer-const
      let allRelevantPushTokens: string[] = [];

      const db = admin.firestore();
      const query = await db.collection("users").get();

      query.forEach((doc) => {
        allUsers.push(doc.data());
        const userData = doc.data();
        const distance = getDistance({latitude: locationData.latitude, longitude: locationData.longitude}, {latitude: userData.user.location.latitude, longitude: userData.user.location.longitude});
        console.log("Distance of ", userData.user.firstname, ": ", distance);
        if (distance <= 750) {
          console.log("Relevant: ", userData.user.firstname);
          allRelevantPushTokens.push(userData.user.pushToken);
        } else {
          console.log("Irrelevant: ", userData.user.firstname);
        }
      });
    });

