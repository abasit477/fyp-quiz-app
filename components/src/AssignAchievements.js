import React, { useState } from "react";
import { View, Text, SafeAreaView, ToastAndroid } from "react-native";
import { COLORS } from "../constants/theme";
import FormInput from "../shared/FormInput";
import FormButton from "..//shared/FormButton";
import { createQuiz } from "../utils/database";
import { createAchievement } from "../utils/database";
import { signOut } from "../utils/auth";

const AssignAchievements = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [achievementsClass, setAchievementsClass] = useState("");

  const handleAchievementSave = async () => {
    const achievementId = Math.floor(100000 + Math.random() * 9000).toString();
    // Save to firestore
    await createAchievement(
      achievementId,
      title,
      description,
      achievementsClass
    );

    // Reset
    setTitle("");
    setDescription("");
    ToastAndroid.show("Achievement Assigned", ToastAndroid.SHORT);
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
          padding:20.
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
        Assign Achievement
      </Text>

      <FormInput
        labelText="Title"
        placeholderText="enter Achievement title"
        onChangeText={(val) => setTitle(val)}
        value={title}
      />
      <FormInput
        labelText="Description"
        placeholderText="enter Achievement description"
        onChangeText={(val) => setDescription(val)}
        value={description}
      />
      <FormInput
        labelText="Class"
        placeholderText="enter class to assign Achievement"
        onChangeText={(value) => {
          const intValue = parseInt(value);

          // Check if the entered value is within the range 1 to 10
          if (!isNaN(intValue) && intValue >= 1 && intValue <= 10) {
            // Set the state with the valid value
            setAchievementsClass(intValue.toString());
          }
          // If the entered value is not within the range, you can choose to show an error message or take other actions.
          else {
            // You can handle invalid input here, such as showing an error message.
            ToastAndroid.show(
              "Please enter a value between 1 and 10",
              ToastAndroid.SHORT
            );
            console.log("Please enter a value between 1 and 10");
          }
        }}
        value={achievementsClass}
      />

      <FormButton
        labelText="Save & Assign"
        handleOnPress={handleAchievementSave}
      />
      </View>
      
    </SafeAreaView>
  );
};

export default AssignAchievements;
