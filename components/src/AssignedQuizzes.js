import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";

import firestore from "@react-native-firebase/firestore";
import { COLORS } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "../utils/auth";

const QuizList = ({ navigation }) => {
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [classValue, setClassValue] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDocument = await firestore()
            .collection("Users")
            .doc(user.uid)
            .get();

          if (userDocument.exists) {
            const userClassValue = userDocument.data().classValue;
            setClassValue(userClassValue.toString());
          } else {
            console.log("User document does not exist.");
          }
        }

        const assignedQuizzesDoc = await firestore()
          .collection("Classes")
          .doc("allClasses")
          .collection(classValue)
          .doc("AssignedQuizes")
          .get();

        if (assignedQuizzesDoc.exists) {
          const assignedQuizzesData = assignedQuizzesDoc.data();
          const quizzes = assignedQuizzesData.quizzes || [];

          const quizPromises = quizzes.map(async (quizId) => {
            const quizDoc = await firestore()
              .collection("Quizzes")
              .doc(quizId)
              .get();

            if (quizDoc.exists) {
              const quizData = quizDoc.data();
              return {
                id: quizId,
                title: quizData.title,
                description: quizData.description,
              };
            }
          });

          const fetchedQuizzes = await Promise.all(quizPromises);
          setAssignedQuizzes(fetchedQuizzes);
        } else {
          console.log("Document 'AssignedQuizes' does not exist.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classValue]);
  const renderItem = ({ item }) => (
    <SafeAreaView>
      <View
        style={{
          padding: 20,
          borderRadius: 5,
          marginVertical: 5,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: COLORS.white,
          elevation: 2,
        }}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ fontSize: 18, color: COLORS.black }}>
            {item.title}
          </Text>
          {item.description != "" ? (
            <Text style={{ opacity: 0.5 }}>{item.description}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius: 50,
            backgroundColor: COLORS.primary + "20",
          }}
          onPress={() => {
            navigation.navigate("PlayQuizScreen", {
              quizId: item.id,
            });
          }}
        >
          <Text style={{ color: COLORS.primary }}>Play</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <View>
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
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={assignedQuizzes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default QuizList;
