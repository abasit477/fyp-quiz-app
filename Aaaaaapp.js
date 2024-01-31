import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
 import { firebase } from "./FirebaseConfig";
// import Login from "./components/src/Login";
// import Registration from "./components/src/Registration";
import SignInScreen from "./components/src/SignInScreen"
import SignUpScreen from "./components/src/SignUpScreen"
import Dashboard from "./components/src/Dashboard";
import Header from "./components/Header";
import CreateQuizScreen from "./components/src/CreateQuizScreen";
import AddQuestionScreen from "./components/src/AddQuestionScreen";
const Stack = createStackNavigator();

function App() {
  const [initalizing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initalizing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initalizing) return null;

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={SignInScreen}
          options={{
            headerTitle: () => <Header name="Online Quiz App"></Header>,
            headerStyle: {
              height: 150,
              backgroundColor: "yellow",
              shadowColor: "#000",
              elevation: 25,
            },
          }}
        ></Stack.Screen>

        <Stack.Screen
          name="Registration"
          component={SignUpScreen}
          options={{
            headerTitle: () => <Header name="Online Quiz App"></Header>,
            headerStyle: {
              height: 150,
              backgroundColor: "yellow",
              shadowColor: "#000",
              elevation: 25,
            },
          }}
        ></Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Login}
        options={{
          headerTitle: () => <Header name="Dashboard"></Header>,
          headerStyle: {
            height: 150,
            backgroundColor: "yellow",
            shadowColor: "#000",
            elevation: 25,
          },
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App></App>
    </NavigationContainer>
  );
};

