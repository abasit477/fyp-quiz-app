import React, { useState } from "react";
import { View, Text, SafeAreaView, ToastAndroid } from "react-native";
import { COLORS } from "../constants/theme";
import FormInput from "../shared/FormInput";
import FormButton from "..//shared/FormButton";
import { createQuiz } from "../utils/database";
import { signOut } from "../utils/auth";

const CreateQuizScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quizClass, setQuizClass] = useState("");

  const handleQuizSave = async () => {
    const currentQuizId = Math.floor(100000 + Math.random() * 9000).toString();
    // Save to firestore
    await createQuiz(currentQuizId, title, description, quizClass);

    // Navigate to Add Question string
    navigation.navigate("AddQuestionScreen", {
      currentQuizId: currentQuizId,
      currentQuisTitle: title,
    });

    // Reset
    setTitle("");
    setDescription("");
    ToastAndroid.show("Quiz Saved", ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
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
      <View style={{
          padding:20,
        }}>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginVertical: 20,
          fontWeight: "bold",
          color: COLORS.black,
        }}
      >
        Create Quiz
      </Text>

      <FormInput
        labelText="Title"
        placeholderText="enter quiz title"
        onChangeText={(val) => setTitle(val)}
        value={title}
      />
      <FormInput
        labelText="Description"
        placeholderText="enter quiz description"
        onChangeText={(val) => setDescription(val)}
        value={description}
      />

      <FormButton labelText="Save Quiz" handleOnPress={handleQuizSave} />
      </View>

    </SafeAreaView>
  );
};

export default CreateQuizScreen;
