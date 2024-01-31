import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { getQuizAttempts } from "../utils/database";
import { COLORS } from "../constants/theme";
import { signOut } from "../utils/auth";

const AttemptedQuizzes = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalMarks, setTotalMarks] = useState();
  const [obtainedMarks, setObtainedMarks] = useState();
  const [totalAttempts, setTotalAttempts] = useState();
  const { userId } = route.params;
  console.log(userId);

  const user = auth().currentUser;

  const [quizAttempts, setQuizAttempts] = useState([]);
  useEffect(() => {
    if (user) {
      const fetchQuizAttempts = async () => {
        try {
          const userQuizAttempts = await getQuizAttempts(userId);
          setQuizAttempts(userQuizAttempts);
          console.log(userQuizAttempts);
          setTotalAttempts(userQuizAttempts.length);

          // Calculate total marks and obtained marks
          let totalMarks = 0;
          let obtainedMarks = 0;

          userQuizAttempts.forEach((attempt) => {
            console.log(attempt.totalQuestions);
            totalMarks += attempt.totalQuestions || 0;
            obtainedMarks += attempt.score || 0;
          });
          setTotalMarks(totalMarks);
          setObtainedMarks(obtainedMarks);
        } catch (error) {
          console.log(error);
        } finally {
          // Set loading to false when data is loaded or an error occurs
          setLoading(false);
        }
      };

      fetchQuizAttempts();
    }
  }, [user]);

  useEffect(() => {}, [quizAttempts]);

  const renderQuizAttempt = ({ item }) => (
    <View
      style={{
        padding: 20,
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 10,
        flexDirection: "column", // Set flexDirection to column
        alignItems: "stretch", // Adjust alignItems to stretch
        backgroundColor: COLORS.white,
        elevation: 2,
      }}
    >
      {/* First Row: Quiz Title */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 18, color: COLORS.black }}>
          Quiz Title: {item.quizTitle}
        </Text>
      </View>

      {/* Second Row: Total Marks and Obtained Marks */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ opacity: 0.5 }}>Total Marks: {item.totalQuestions}</Text>
        <Text style={{ opacity: 0.5 }}>Obtained Marks: {item.score}</Text>
      </View>
    </View>
  );
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore()
          .collection("Users")
          .doc(auth().currentUser.uid)
          .get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        } else {
          console.error("User document not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        position: "relative",
      }}
    >
      {userData ? (
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
      ) : (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      ) : quizAttempts.length === 0 ? (
        <Text>No attempted quizzes available</Text>
      ) : (
        <View>
          {/* Summary Information */}
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
        <View style={styles.containerResult}>
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

          {/* Quiz Attempts List */}
          <FlatList
            data={quizAttempts}
            renderItem={renderQuizAttempt}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerResult: {
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
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
});

export default AttemptedQuizzes;
