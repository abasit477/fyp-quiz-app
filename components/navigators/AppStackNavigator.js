import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import AddQuestionScreen from "../src/AddQuestionScreen";
import CreateQuizScreen from "../src/CreateQuizScreen";
import HomeScreen from "../src/HomeScreen";
import PlayQuizScreen from "../src/PlayQuizScreen";
import TeacherHomeScreen from "../src/TeacherHomeScreen";
import UserProfileScreen from "../src/UserProfileScreen";
import StudentHomeScreen from "../src/StudentHomeScreen";
import AssignQuizToClass from "../src/AssignQuiz";
import QuizList from "../src/AssignedQuizzes";
import TeacherDashboard from "../src/TeacherDashboard";
import AttemptedQuizzes from "../src/AttemptedQuizzes";
import AssignAchievements from "../src/AssignAchievements";
import AssignedAchievements from "../src/AssignedAchievements";
import QuizAssignModal from "../src/QuizAssignModal";
import DisplayAllClasses from "../src/DisplayAllClasses";
import DisplayAllStudents from "../src/DisplayAllStudents";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppStackNavigator = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // ... (your existing code for Firebase authentication)

    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        const userDocRef = firestore().collection("Users").doc(user.uid);

        userDocRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              setUserType(doc.data().role);
            } else {
              console.log("No user data");
            }
          })
          .catch((error) => {
            console.error("Error getting user data:", error);
          });
      } else {
        console.log("Null");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (userType === null) {
    return null;
  }

  const initialScreen =
    userType === "student" ? "StudentHomeScreen" : "HomeScreen";

    

  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false, // Hide the header for the entire Tab.Navigator
    }}>
      <Tab.Screen name="Home">
        {() => (
          <Stack.Navigator
            initialRouteName={initialScreen}
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
            />
            <Stack.Screen
              name="CreateQuizScreen"
              component={CreateQuizScreen}
            />
            <Stack.Screen
              name="AddQuestionScreen"
              component={AddQuestionScreen}
            />
            <Stack.Screen name="PlayQuizScreen" component={PlayQuizScreen} />
            <Stack.Screen
              name="TeacherHomeScreen"
              component={TeacherHomeScreen}
            />
            <Stack.Screen
              name="UserProfileScreen"
              component={UserProfileScreen}
            />
            <Stack.Screen
              name="StudentHomeScreen"
              component={StudentHomeScreen}
            />
            <Stack.Screen
              name="AssignQuizToClass"
              component={AssignQuizToClass}
            />
            <Stack.Screen
              name="AttemptedQuizzes"
              component={AttemptedQuizzes}
            />
            <Stack.Screen
              name="AssignAchievements"
              component={AssignAchievements}
            />
            <Stack.Screen
              name="DisplayAllClasses"
              component={DisplayAllClasses}
            />
            <Stack.Screen
              name="DisplayAllStudents"
              component={DisplayAllStudents}
            />
            <Stack.Screen
              name="AssignedAchievements"
              component={AssignedAchievements}
            />
            <Stack.Screen name="QuizAssignModal" component={QuizAssignModal} />

            <Stack.Screen name="QuizList" component={QuizList} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={UserProfileScreen} />
      {/* Add more Tab.Screen components for other tabs if needed */}
    </Tab.Navigator>
  );
};

export default AppStackNavigator;
