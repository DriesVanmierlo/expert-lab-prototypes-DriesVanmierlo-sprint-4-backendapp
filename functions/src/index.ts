/* eslint-disable quote-props */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {getDistance} from "geolib";
import fetch from "node-fetch";

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
      // eslint-disable-next-line prefer-const
      let allOutdatedLocationPushTokens: string[] = [];

      const db = admin.firestore();
      const query = await db.collection("users").get();

      query.forEach((doc) => {
        allUsers.push(doc.data());
        const userData = doc.data();
        const distance = getDistance({latitude: locationData.latitude, longitude: locationData.longitude}, {latitude: userData.user.location.latitude, longitude: userData.user.location.longitude});
        console.log("Distance of ", userData.user.firstname, ": ", distance);
        const timeDifference: number = locationData.timestamp - userData.user.location.timestamp;
        if (distance <= 750) {
          console.log("Relevant: ", userData.user.firstname);
          allRelevantPushTokens.push(userData.user.pushToken);
        } else if (distance <= 25000 && timeDifference > 1200) {
          console.log("Need to update locaiton: ", userData.user.firstname);
          allOutdatedLocationPushTokens.push(userData.user.pushToken);
        } else if (distance <= 50000 && timeDifference > 2400) {
          console.log("Need to update locaiton: ", userData.user.firstname);
          allOutdatedLocationPushTokens.push(userData.user.pushToken);
        } else if (distance <= 75000 && timeDifference > 7200) {
          console.log("Need to update locaiton: ", userData.user.firstname);
          allOutdatedLocationPushTokens.push(userData.user.pushToken);
        } else if (distance > 75000 && timeDifference > 18000) {
          console.log("Need to update locaiton: ", userData.user.firstname);
          allOutdatedLocationPushTokens.push(userData.user.pushToken);
        } else {
          console.log("Irrelevant: ", userData.user.firstname);
        }
      });

      allRelevantPushTokens.forEach((token: string) => {
        fetch("https://exp.host/--/api/v2/push/send/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: token,
            data: {},
            title: "Someone is in your range!",
            body: `${locationData.firstname} is nearby!`,
          }),
        });
      });

      allOutdatedLocationPushTokens.forEach((token: string) => {
        fetch("https://exp.host/--/api/v2/push/send/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: token,
            data: {},
            title: "Someone might be your range!",
            body: "Open the app to update your location",
          }),
        });
      });
    });


