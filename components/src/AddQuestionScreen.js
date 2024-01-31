import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/theme";
import FormInput from "../shared/FormInput";
import FormButton from "../shared/FormButton";
import { createQuestion } from "../utils/database";
import QuizAssignModal from "./QuizAssignModal";
import { signOut } from "../utils/auth";

const AddQuestionScreen = ({ navigation, route }) => {
  const [currentQuizId, setCurrentQuizId] = useState(
    route.params.currentQuizId
  );
  const [currentQuizTitle, setCurrentQuizTitle] = useState(
    route.params.currentQuizTitle
  );

  const [IsQuizAssignModalVisible, setIsQuizAssignModalVisible] =
    useState(false);

  const [question, setQuestion] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState("");
  const [optionTwo, setOptionTwo] = useState("");
  const [optionThree, setOptionThree] = useState("");
  const [optionFour, setOptionFour] = useState("");

  const handleQuestionSave = async () => {
    if (
      question == "" ||
      correctAnswer == "" ||
      optionTwo == "" ||
      optionThree == "" ||
      optionFour == ""
    ) {
      return;
    }

    let currentQuestionId = Math.floor(
      100000 + Math.random() * 9000
    ).toString();

    // Add question to db
    await createQuestion(currentQuizId, currentQuestionId, {
      question: question,
      correct_answer: correctAnswer,
      incorrect_answers: [optionTwo, optionThree, optionFour],
    });
    ToastAndroid.show("Question saved", ToastAndroid.SHORT);

    // Reset
    setQuestion("");
    setCorrectAnswer("");
    setOptionTwo("");
    setOptionThree("");
    setOptionFour("");
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
    >
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
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={{ padding: 20 }}>
          <Text
            style={{ fontSize: 20, textAlign: "center", color: COLORS.black }}
          >
            Add Question
          </Text>

          <FormInput
            labelText="Question"
            placeholderText="enter question"
            onChangeText={(val) => setQuestion(val)}
            value={question}
          />

          {/* Options */}
          <View style={{ marginTop: 30 }}>
            <FormInput
              labelText="Correct Answer"
              onChangeText={(val) => setCorrectAnswer(val)}
              value={correctAnswer}
            />
            <FormInput
              labelText="Option 2"
              onChangeText={(val) => setOptionTwo(val)}
              value={optionTwo}
            />
            <FormInput
              labelText="Option 3"
              onChangeText={(val) => setOptionThree(val)}
              value={optionThree}
            />
            <FormInput
              labelText="Option 4"
              onChangeText={(val) => setOptionFour(val)}
              value={optionFour}
            />
          </View>
          <FormButton
            labelText="Save Question"
            handleOnPress={handleQuestionSave}
          />
          <FormButton
            labelText="Assign Quiz"
            isPrimary={false}
            handleOnPress={() => {
              setIsQuizAssignModalVisible(true);
            }}
            style={{
              marginVertical: 20,
            }}
          />
        </View>

        {/* Quiz Assign Modal */}
        <QuizAssignModal
          isModalVisible={IsQuizAssignModalVisible}
          currentQuizId={currentQuizId}
          navigation={navigation}
          AssignQuiz={() => {
            storeQuizResult();
            navigation.goBack();
            setIsQuizAssignModalVisible(false);
          }}
        ></QuizAssignModal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddQuestionScreen;
