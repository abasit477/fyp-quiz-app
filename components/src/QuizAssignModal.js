import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { storeQuizResult } from "../utils/database";
import FormInput from "../shared/FormInput";
import { useState } from "react";
import FormButton from "../shared/FormButton";
import { ToastAndroid } from "react-native";
import firestore from "@react-native-firebase/firestore";

const QuizAssignModal = ({ isModalVisible, currentQuizId, navigation }) => {
  const [classValue, setClassValue] = useState(""); // Added state for class
  console.log(currentQuizId);

  const AssigntoClass = () => {
    const classRef = firestore()
      .collection("Classes")
      .doc("allClasses")
      .collection(classValue)
      .doc("AssignedQuizes");

    // Assuming quizStringValue is the string you want to add to the 'assignedQuizes' array
    const quizStringValue = currentQuizId;

    // Use arrayUnion to add the quizStringValue to the 'assignedQuizes' array
    classRef
      .update({
        quizzes: firestore.FieldValue.arrayUnion(quizStringValue),
      })
      .then(() => {
        console.log("Quiz string value added to the array successfully.");
      })
      .catch((error) => {
        console.error("Error adding quiz string value to the array:", error);
      });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeaderText}>Assign Quiz</Text>

          <FormInput
            labelText=""
            placeholderText="Enter your class to assign Quiz"
            onChangeText={(value) => {
              const intValue = parseInt(value);
              if (!isNaN(intValue) && intValue >= 1 && intValue <= 10) {
                setClassValue(intValue.toString());
              } else {
                ToastAndroid.show(
                  "Please enter a value between 1 and 10",
                  ToastAndroid.SHORT
                );
              }
            }}
            value={classValue}
          />

          <FormButton
            labelText="Assign Quiz"
            isPrimary={false}
            handleOnPress={AssigntoClass}
            style={styles.buttonStyle}
          />

          <FormButton
            labelText="Done"
            isPrimary={false}
            handleOnPress={() => {
              navigation.navigate("HomeScreen");
            }}
            style={styles.buttonStyle}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.black + "90",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: "90%",
    borderRadius: 5,
    padding: 40,
    alignItems: "center",
  },
  modalHeaderText: {
    fontSize: 28,
    color: COLORS.black,
    marginBottom: 20,
  },
  buttonStyle: {
    marginVertical: 10,
    width: "100%",
  },
};

export default QuizAssignModal;
