import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const onLocationAdded = functions.database
    .ref("/location/{uid}")
    .onCreate((snapshot, context) => {
      const uid = context.params.uid;
      console.log(`New location added by user with uid: ${uid}`);

      const locationData = snapshot.val();
      console.log(`Location data: ${locationData.latitude}`);
    });
