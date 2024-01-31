import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import FormButton from "../shared/FormButton";
import FormInput from "../shared/FormInput";
import { COLORS } from "../constants/theme";
import { signUp } from "../utils/auth";
import { ToastAndroid } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [userName, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Added state for role
  const [classValue, setClassValue] = useState(""); // Added state for class

  const handleOnSubmit = () => {
    let currentClassId = Math.floor(100000 + Math.random() * 9000).toString();

    if (
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      role !== ""
    ) {
      if (password === confirmPassword) {
        // SignUp
        signUp(email, password, role, classValue, userName, currentClassId);
      } else {
        Alert.alert("Password did not match");
      }
    } else {
      Alert.alert("Please fill in all the fields");
    }
  };

  return (
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //     backgroundColor: COLORS.white,
    //     padding: 20,
    //   }}
    // >
    //   <KeyboardAvoidingView
    //     style={{
    //       flex: 1,
    //     }}
    //   >
    //     <ScrollView
    //       style={{
    //         flex: 1,
    //       }}
    //     >
    //       {/* Header */}
    //       <Text
    //         style={{
    //           fontSize: 24,
    //           color: COLORS.black,
    //           fontWeight: "bold",
    //           marginVertical: 32,
    //         }}
    //       >
    //         Register
    //       </Text>

    //       {/* Email */}
    //       <FormInput
    //         labelText="Name"
    //         placeholderText="enter your Name"
    //         onChangeText={(value) => setName(value)}
    //         value={userName}
    //       />

    //       <FormInput
    //         labelText="Email"
    //         placeholderText="enter your email"
    //         onChangeText={(value) => setEmail(value)}
    //         value={email}
    //         keyboardType={"email-address"}
    //       />

    //       {/* Password */}
    //       <FormInput
    //         labelText="Password"
    //         placeholderText="enter your password"
    //         onChangeText={(value) => setPassword(value)}
    //         value={password}
    //         secureTextEntry={true}
    //       />

    //       {/* Confirm Password */}
    //       <FormInput
    //         labelText="Confirm Password"
    //         placeholderText="enter your password again"
    //         onChangeText={(value) => setConfirmPassword(value)}
    //         value={confirmPassword}
    //         secureTextEntry={true}
    //       />

    //       {/* Role */}
    //       <FormInput
    //         labelText="Role"
    //         placeholderText="enter your role (Teacher/Student)"
    //         onChangeText={(value) => setRole(value)}
    //         value={role}
    //       />

    //       {/* Class (only for Student role) */}
    //       {role.toLowerCase() === "student" && (
    //         <FormInput
    //           labelText="Class"
    //           placeholderText="enter your class"
    //           onChangeText={(value) => {
    //             const intValue = parseInt(value);

    //             // Check if the entered value is within the range 1 to 5
    //             if (!isNaN(intValue) && intValue >= 1 && intValue <= 10) {
    //               // Set the state with the valid value
    //               setClassValue(intValue.toString());
    //             }
    //             // If the entered value is not within the range, you can choose to show an error message or take other actions.
    //             else {
    //               // You can handle invalid input here, such as showing an error message.
    //               ToastAndroid.show(
    //                 "Please enter a value between 1 and 5",
    //                 ToastAndroid.SHORT
    //               );
    //               console.log("Please enter a value between 1 and 5");
    //             }
    //           }}
    //           value={classValue}
    //         />
    //       )}

    //       {/* Submit button */}
    //       <FormButton
    //         labelText="Sign up"
    //         handleOnPress={handleOnSubmit}
    //         style={{ width: "100%" }}
    //       />

    //       {/* Footer */}
    //       <View
    //         style={{
    //           flexDirection: "row",
    //           alignItems: "center",
    //           marginTop: 20,
    //         }}
    //       >
    //         <Text>Already have an account?</Text>
    //         <Text
    //           style={{ marginLeft: 4, color: COLORS.primary }}
    //           onPress={() => navigation.navigate("SignInScreen")}
    //         >
    //           Sign in
    //         </Text>
    //       </View>
    //     </ScrollView>
    //   </KeyboardAvoidingView>
    // </SafeAreaView>

    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 20,
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 24,
          color: COLORS.black,
          fontWeight: "bold",
          marginVertical: 32,
        }}
      >
        Register
      </Text>

      {/* Email */}
      <FormInput
        labelText="Name"
        placeholderText="enter your Name"
        onChangeText={(value) => setName(value)}
        value={userName}
      />

      <FormInput
        labelText="Email"
        placeholderText="enter your email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        keyboardType={"email-address"}
      />

      {/* Password */}
      <FormInput
        labelText="Password"
        placeholderText="enter your password"
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry={true}
      />

      {/* Confirm Password */}
      <FormInput
        labelText="Confirm Password"
        placeholderText="enter your password again"
        onChangeText={(value) => setConfirmPassword(value)}
        value={confirmPassword}
        secureTextEntry={true}
      />

      {/* Role */}
      <FormInput
        labelText="Role"
        placeholderText="enter your role (Teacher/Student)"
        onChangeText={(value) => setRole(value)}
        value={role}
      />

      {/* Class (only for Student role) */}
      {role.toLowerCase() === "student" && (
        <FormInput
          labelText="Class"
          placeholderText="enter your class"
          onChangeText={(value) => {
            const intValue = parseInt(value);

            // Check if the entered value is within the range 1 to 5
            if (!isNaN(intValue) && intValue >= 1 && intValue <= 10) {
              // Set the state with the valid value
              setClassValue(intValue.toString());
            }
            // If the entered value is not within the range, you can choose to show an error message or take other actions.
            else {
              // You can handle invalid input here, such as showing an error message.
              ToastAndroid.show(
                "Please enter a value between 1 and 5",
                ToastAndroid.SHORT
              );
              console.log("Please enter a value between 1 and 5");
            }
          }}
          value={classValue}
        />
      )}

      {/* Submit button */}
      <FormButton
        labelText="Sign up"
        handleOnPress={handleOnSubmit}
        style={{ width: "100%" }}
      />

      {/* Footer */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text>Already have an account?</Text>
        <Text
          style={{ marginLeft: 4, color: COLORS.primary }}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          Sign in
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
