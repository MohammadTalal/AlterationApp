import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCqMGfgzRc4S_e7fpPXaOX7q8mbBlgAxU8",
    authDomain: "altered-image-c13ed.firebaseapp.com",
    projectId: "altered-image-c13ed",
    storageBucket: "altered-image-c13ed.appspot.com",
    messagingSenderId: "878730456552",
    appId: "1:878730456552:web:17a7075140a30421b6085d"
};


// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()


// timestamp 
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectFirestore, projectAuth, timestamp }