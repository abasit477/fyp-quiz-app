import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../../FirebaseConfig";

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>Hello</Text>
      <TouchableOpacity onPress={() => firebase.auth().signOut()}
      style={styles.button}>
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Dashboard;

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