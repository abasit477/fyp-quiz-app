import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/theme";
import { getQuestionsByQuizId, getQuizById } from "../utils/database";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FormButton from "../shared/FormButton";
import ResultModal from "./ResultModal";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const PlayQuizScreen = ({ navigation, route }) => {
  const [currentQuizId, setCurrentQuizId] = useState(route.params.quizId);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);

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


  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate random number
      let j = Math.floor(Math.random() * (i + 1));

      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  const getQuizAndQuestionDetails = async () => {
    // Get Quiz
    let currentQuiz = await getQuizById(currentQuizId);
    currentQuiz = currentQuiz.data();
    setTitle(currentQuiz.title);

    // Get Questions for current quiz
    const questions = await getQuestionsByQuizId(currentQuizId);

    // Transform and shuffle options
    let tempQuestions = [];
    await questions.docs.forEach(async (res) => {
      let question = res.data();

      // Create Single array of all options and shuffle it
      question.allOptions = shuffleArray([
        ...question.incorrect_answers,
        question.correct_answer,
      ]);
      await tempQuestions.push(question);
    });

    setTotalQuestions(tempQuestions.length);
    console.log(tempQuestions.length);

    setQuestions([...tempQuestions]);
  };

  useEffect(() => {
    getQuizAndQuestionDetails();
  }, []);

  const getOptionBgColor = (currentQuestion, currentOption) => {
    if (currentQuestion.selectedOption) {
      if (currentOption == currentQuestion.selectedOption) {
        if (currentOption == currentQuestion.correct_answer) {
          return COLORS.success;
        } else {
          return COLORS.error;
        }
      } else {
        return COLORS.white;
      }
    } else {
      return COLORS.white;
    }
  };

  const getOptionTextColor = (currentQuestion, currentOption) => {
    if (currentQuestion.selectedOption) {
      if (currentOption == currentQuestion.selectedOption) {
        return COLORS.white;
      } else {
        return COLORS.black;
      }
    } else {
      return COLORS.black;
    }
  };

  // update selected option

  const updateSelectedOption = (questionIndex, option) => {
    let tempQuestions = [...questions];
    tempQuestions[questionIndex].selectedOption = option;
    setQuestions(tempQuestions);
  };

  //Store Quiz Result in Firebase

  const storeQuizResult = async () => {
    const user = auth().currentUser;

    if (user) {
      // Local variables to calculate correctCount and incorrectCount
      let localCorrectCount = 0;
      let localIncorrectCount = 0;

      const questionsData = questions.map((question) => {
        // Calculate counts for each question when submitting
        if (question.selectedOption === question.correct_answer) {
          localCorrectCount += 1;
        } else {
          localIncorrectCount += 1;
        }

        return {
          question: question.question,
          selectedOption: question.selectedOption,
        };
      });
    

      // Calculate the total score based on the correct answers
      const totalScore = localCorrectCount;

      const quizResult = {
        userId: user.uid,
        quizTitle: title,
        score: totalScore,
        quizId: currentQuizId,
        totalQuestions: totalQuestions,
        timestamp: firestore.FieldValue.serverTimestamp(),
        questions: questionsData,
        class: userData.class,
      };

      try {
        await firestore().collection("QuizAttempts").add(quizResult);

        // Log the local counts
        console.log("Correct Count:", localCorrectCount);
        console.log("Incorrect Count:", localIncorrectCount);

        // Optionally, you can update the state here if needed
        setCorrectCount(localCorrectCount);
        setIncorrectCount(localIncorrectCount);

        console.log("Quiz result stored successfully:", quizResult);
      } catch (error) {
        console.error("Error storing quiz result:", error.message);
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
      {/* Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: COLORS.white,
          elevation: 4,
        }}
      >
        {/* Back Icon */}
        <MaterialIcons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />

        {/* Title */}
        <Text style={{ fontSize: 16, marginLeft: 10 }}>{title}</Text>

        {/* Correct and incorrect count */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Correct */}
          <View
            style={{
              backgroundColor: COLORS.success,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          >
            <MaterialIcons
              name="check"
              size={14}
              style={{ color: COLORS.white }}
            />
            <Text style={{ color: COLORS.white, marginLeft: 6 }}>
              {correctCount}
            </Text>
          </View>

          {/* Incorrect */}
          <View
            style={{
              backgroundColor: COLORS.error,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <MaterialIcons
              name="close"
              size={14}
              style={{ color: COLORS.white }}
            />
            <Text style={{ color: COLORS.white, marginLeft: 6 }}>
              {incorrectCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Questions and Options list */}
      <FlatList
        data={questions}
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.question}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginTop: 14,
              marginHorizontal: 10,
              backgroundColor: COLORS.white,
              elevation: 2,
              borderRadius: 2,
            }}
          >
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 16 }}>
                {index + 1}. {item.question}
              </Text>
            </View>
            {/* Options */}
            {item.allOptions.map((option, optionIndex) => {
              return (
                <TouchableOpacity
                  key={optionIndex}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderTopWidth: 1,
                    borderColor: COLORS.border,
                    backgroundColor: getOptionBgColor(item, option),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                  onPress={() => {
                    if (item.selectedOption === option) {
                      updateSelectedOption(index, null); // Deselect the option
                    } else {
                      updateSelectedOption(index, option);
                    }
                  }}
                >
                  <Text
                    style={{
                      width: 25,
                      height: 25,
                      padding: 2,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      textAlign: "center",
                      marginRight: 16,
                      borderRadius: 25,
                      color: getOptionTextColor(item, option),
                    }}
                  >
                    {optionIndex + 1}
                  </Text>
                  <Text style={{ color: getOptionTextColor(item, option) }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        ListFooterComponent={() => (
          <FormButton
            labelText="Submit"
            style={{ margin: 10 }}
            handleOnPress={() => {
              // Show Result modal
              storeQuizResult();
              setIsResultModalVisible(true);
            }}
          />
        )}
      />

      {/* Result Modal */}
      <ResultModal
        isModalVisible={isResultModalVisible}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        totalCount={questions.length}
        handleOnClose={() => {
          storeQuizResult();
          setIsResultModalVisible(false);
        }}
        handleRetry={() => {
          setCorrectCount(0);
          setIncorrectCount(0);
          getQuizAndQuestionDetails();
          setIsResultModalVisible(false);
        }}
        handleHome={() => {
          storeQuizResult();

          navigation.goBack();
          setIsResultModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default PlayQuizScreen;
