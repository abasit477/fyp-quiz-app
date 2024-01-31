import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { signOut } from "../utils/auth";
import FormButton from "../shared/FormButton";
import { COLORS } from "../constants/theme";
import {
  GetAllClassesTry,
  createQuiz,
  getClasses,
  getQuizzes,
  QuizAssignment,
} from "../utils/database";

const HomeScreen = ({ navigation }) => {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAllQuizzes = async () => {
    setRefreshing(true);
    const quizzes = await getQuizzes();
    // console.log("Frome Home Screen:", quizzes)

    // Transform quiz data
    let tempQuizzes = [];
    await quizzes.docs.forEach(async (quiz) => {
      await tempQuizzes.push({ id: quiz.id, ...quiz.data() });
    });
    await setAllQuizzes([...tempQuizzes]);

    setRefreshing(false);
  };

  useEffect(() => {
    getAllQuizzes();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle={"light-content"} />
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
        backgroundColor: COLORS.white,
        alignItems: "center",
        padding: 20
      }}>
      <Text style={styles.welcome}>Welcome, Teacher!</Text>
      </View>

      {/* Quiz list */}

      {/* <View style={styles.container}>
        <View style={styles.widgetContainer}>
          <View style={styles.widget}>
            <Text style={styles.label}>Students</Text>
            <Text style={styles.value}>50</Text>
          </View>
        </View>
        <View style={styles.widgetContainer}>
          <View style={styles.widget}>
            <Text style={styles.label}>Classes</Text>
            <Text style={styles.value}>10</Text>
          </View>
        </View>
      </View> */}

      {/* Button */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormButton
          labelText="Create Quiz"
          style={{
            borderRadius: 5,
            width: "90%",
          }}
          handleOnPress={() => navigation.navigate("CreateQuizScreen")}
        />
        <FormButton
          labelText="Assign Achievement"
          style={{
            borderRadius: 5,
            width: "90%",
            marginTop: 20,
          }}
          handleOnPress={() => navigation.navigate("AssignAchievements")}
        />
        <FormButton
          labelText="See All Classes"
          style={{
            borderRadius: 5,
            width: "90%",
            marginTop: 20,
          }}
          handleOnPress={() => navigation.navigate("DisplayAllClasses")}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 20,
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
    borderWidth: 1,
    borderColor: "#5362FB",
    shadowColor: "5362FB",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android
  },
  label: {
    color: "#5362FB",
    fontSize: 18,
    marginBottom: 5,
  },
  value: {
    color: "#5362FB",
    fontSize: 24,
    fontWeight: "bold",
  },
  welcome: {
    color: '#5362FB',
    fontSize: 24,
    marginBottom: 10,
  },
});

export default HomeScreen;
