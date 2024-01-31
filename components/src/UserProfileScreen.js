import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { getQuizAttempts } from "../utils/database";
import { COLORS } from "../constants/theme";
import FormButton from "../shared/FormButton";
import { signOut } from "../utils/auth";

const UserProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const user = auth().currentUser;

  const [quizAttempts, setQuizAttempts] = useState([]);
  useEffect(() => {
    if (user) {
      const fetchQuizAttempts = async () => {
        try {
          const userQuizAttempts = await getQuizAttempts(user.uid);
          setQuizAttempts(userQuizAttempts);
        } catch (error) {
          console.log(error);
        }
      };

      fetchQuizAttempts();
    }
  }, [user]);

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        position: "relative",
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
      {userData ? (
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{userData.userName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{userData.role}</Text>
          </View>
          {userData.role.toLowerCase() === "student" && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Class:</Text>
              <Text style={styles.infoValue}>{userData.class}</Text>
            </View>
          )}
          {userData.role.toLowerCase() === "student" && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>No. of Attempted Quizzes:</Text>
              <Text style={styles.infoValue}>{quizAttempts.length}</Text>
            </View>
          )}
          
        </View>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
    elevation:1,
    backgroundColor:"white",
    padding:15,
    borderRadius:10
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize:16,
  },
  infoValue: {
    marginTop: 5,
    fontSize:18,

  },
});

export default UserProfileScreen;
