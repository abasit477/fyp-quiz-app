import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./components/navigators/AuthStackNavigator";
import auth from "@react-native-firebase/auth";
import AppStackNavigator from "./components/navigators/AppStackNavigator";
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission, getFCMToken } from "./components/utils/FirebaseCloudMessaging"


const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState("teacher"); // Set this based on your login logic


  const onAuthStateChanged = async (user) => {
    await setCurrentUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    requestUserPermission();
    getFCMToken();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {currentUser ? (
        <AppStackNavigator userType={userType} />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;
