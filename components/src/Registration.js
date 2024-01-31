import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../FirebaseConfig";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  registerUser = async (email, password, name, role) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .firestore()
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            uid: firebase.auth().currentUser.uid,
            name,
            email,
            role,
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 23 }}>Register Now!!</Text>
      <View style={{ marginTop: 40 }}>
        <TextInput
          style={styles.textInput}
          placeholder="Name"
          onChangeText={(name) => setName(name)}
          autoCorrect={false}
        ></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Teacher OR Student"
          onChangeText={(role) => setRole(role)}
          autoCorrect={false}
        ></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCorrect={false}
          keyboardType="email-address"
        ></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
        ></TextInput>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => registerUser(email, password, role, name)}
          style={styles.button}
        >
          <Text style={{ fontWeight: "bold", fontSize: 22 }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  textInput: {
    paddingTop: 20,
    paddingBottom: 10,
    width: 400,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});
