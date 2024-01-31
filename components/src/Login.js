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

const Login = () => {
  const Navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 26 }}>Login</Text>
      <View style={{ marginTop: 40 }}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Your Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
        ></TextInput>

        <TextInput
          style={styles.textInput}
          placeholder="Enter Your Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        ></TextInput>
      </View>
      <TouchableOpacity
        onPress={() => loginUser(email, password)}
        style={styles.button}
      >
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Navigation.navigate('Registration')}
        style={{marginTop:20}}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        marginTop: 100
    },
    textInput:{
        paddingTop:20,
        paddingBottom:10,
        width:400,
        fontSize:20,
        borderBottomWidth:1,
        borderBottomColor:'#000',
        marginBottom:10,
        textAlign:'center'
    }, 
    button:{
        marginTop:50,
        height:70,
        width:250,
        backgroundColor:'yellow',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50,
    }
})
