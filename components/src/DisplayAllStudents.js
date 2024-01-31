import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { COLORS } from "../constants/theme";
import { signOut } from "../utils/auth";
import auth from "@react-native-firebase/auth";
import { getQuizAttempts } from "../utils/database";
import { getClassQuizAttempts } from "../utils/database";

const Stack = createStackNavigator();

const DisplayAllStudents = ({ route, navigation }) => {
  const { collectionName } = route.params;
  const [collectionData, setCollectionData] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const { userId } = route.params;
  const [totalMarks, setTotalMarks] = useState();
  const [obtainedMarks, setObtainedMarks] = useState();
  const [totalAttempts, setTotalAttempts] = useState();

  const user = auth().currentUser;

  const [quizAttempts, setQuizAttempts] = useState([]);
  useEffect(() => {
    if (user) {
      const fetchQuizAttempts = async () => {
        try {
          const userQuizAttempts = await getClassQuizAttempts(
            collectionName.toString()
          );
          setQuizAttempts(userQuizAttempts);
          setTotalAttempts(userQuizAttempts.length);

          // Calculate total marks and obtained marks
          let totalMarks = 0;
          let obtainedMarks = 0;

          userQuizAttempts.forEach((attempt) => {
            totalMarks += attempt.totalQuestions;
            obtainedMarks += attempt.score;
          });
          setTotalMarks(totalMarks);
          setObtainedMarks(obtainedMarks);
        } catch (error) {
          console.log(error);
        }
      };

      fetchQuizAttempts();
    }
  }, [user]);

  useEffect(() => {
    // Display the quiz attempts when the quizAttempts state changes
  }, [quizAttempts]);

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const collectionSnapshot = await firestore()
          .collection("Classes")
          .doc("allClasses")
          .collection(collectionName.toString())
          .doc("Students")
          .get();

        const students = collectionSnapshot.data().allStudents;
        console.log(students);

        const userDataPromises = students.map(async (uid) => {
          const userSnapshot = await firestore()
            .collection("Users")
            .doc(uid)
            .get();
          return { ...userSnapshot.data(), uid }; // Include uid in the user data
        });

        const userData = await Promise.all(userDataPromises);
        setCollectionData(userData || []);
      } catch (error) {
        console.error("Error fetching collection data:", error.message);
      }
    };

    fetchCollectionData();
  }, [collectionName]);

  return (
    <View>
      {/* Header */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: COLORS.primary,
          elevation: 4,
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomEndRadius: 10,
          borderBottomStartRadius: 10,
        }}
      >
        <Text style={{ fontSize: 24, color: COLORS.white }}>Quiz App</Text>
        <Text
          style={{
            fontSize: 18,
            padding: 10,
            color: COLORS.white,
          }}
          onPress={signOut}
        >
          Logout
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          borderRadius: 5,
          marginVertical: 5,
          marginHorizontal: 10,
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: COLORS.white,
          elevation: 2,
        }}
      >
        <View style={styles.container}>
          <View style={styles.widgetContainer}>
            <View style={styles.widget}>
              <Text style={styles.label}>Total Attempts</Text>
              <Text style={styles.value}>{totalAttempts}</Text>
            </View>
          </View>
          <View style={styles.widgetContainer}>
            <View style={styles.widgetResult}>
              <Text style={styles.label}>Result</Text>
              <Text style={styles.value}>
                {obtainedMarks}/{totalMarks}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={collectionData}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 20,
              borderRadius: 5,
              marginVertical: 5,
              marginHorizontal: 10,
              flexDirection: "column",
              alignItems: "stretch",
              backgroundColor: COLORS.white,
              elevation: 2,
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 18, color: COLORS.black }}>
                Name: {item.userName}
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 18, color: COLORS.black }}>
                Email: {item.email}
              </Text>
            </View>

            

            {/* Button to see attempted quizzes */}
            <TouchableOpacity
              style={{
                marginTop: 10,
                padding: 15,
                backgroundColor: COLORS.primary,
                borderRadius: 5,
              }}
              onPress={() =>
                navigation.navigate("AttemptedQuizzes", { userId: item.uid })
              }
            >
              <Text style={{ color: COLORS.white }}>See Attempted Quizzes</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Display attempted quizzes */}
      {attemptedQuizzes.length > 0 && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
            Attempted Quizzes
          </Text>
          <FlatList
            data={attemptedQuizzes}
            keyExtractor={(item) => item.quizId}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 20,
                  borderRadius: 5,
                  marginVertical: 5,
                  marginHorizontal: 10,
                  backgroundColor: COLORS.lightGray,
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 16, color: COLORS.black }}>
                  Quiz Title: {item.quizTitle}
                </Text>
                <Text style={{ opacity: 0.5 }}>
                  Total Marks: {item.totalQuestions}, Obtained Marks:{" "}
                  {item.score}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  widgetContainer: {
    flex: 1,
    margin: 5,
  },
  widget: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  widgetResult: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderLeftColor: "black",
    borderLeftWidth: 1,
  },
  label: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
  },
  value: {
    color: "black",
    fontSize: 24,
  },
  divider: {
    borderWidth: 1,
  },
});

export default DisplayAllStudents;
