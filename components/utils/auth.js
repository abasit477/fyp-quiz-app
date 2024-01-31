import auth from '@react-native-firebase/auth';
import {ToastAndroid} from 'react-native';
import firestore from '@react-native-firebase/firestore';


export const signIn = (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      ToastAndroid.show('Logged in', ToastAndroid.SHORT);
    })
    .catch(err => {
      console.log(err);
    });
};

export const signUp = (email, password, role, classValue, userName) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async () => {
      const userDoc = {
        uid: auth().currentUser.uid,
        email,
        role,
        userName,
        classValue,
      };

      if (role.toLowerCase() === 'student') {
        userDoc.class = classValue;

        // Create or update the Student document under the specified Class
        await firestore().collection('Classes').doc('allClasses').collection(classValue).doc('Students').set({
          uid: auth().currentUser.uid,
          email,
          userName,
        });
        // await firestore().collection('Classes').doc('allClasses').collection(classValue).set({
        //   assignedQuizes:[]
        // })

      } else if (role.toLowerCase() === 'teacher') {
        // Create or update the Teacher document
        await firestore().collection('Teachers').doc(auth().currentUser.uid).set({
          uid: auth().currentUser.uid,
          email,
        });
      }

      // Update the User document
      await firestore().collection('Users').doc(auth().currentUser.uid).set(userDoc);
    })
    .catch((error) => {
      // Handle errors here
      console.error('Sign Up Error:', error.message);
    });
};


export const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      ToastAndroid.show('Signed Out', ToastAndroid.SHORT);
    });
};
