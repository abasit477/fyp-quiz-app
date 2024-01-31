import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

import firestore from "@react-native-firebase/firestore";
import { COLORS } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "../utils/auth";

const AssignedAchievementList = ({ navigation }) => {
  const [assignedAchievements, setAssignedAchievements] = useState([]);

  useEffect(() => {
    const fetchAssignedAchievements = async () => {
      try {
        const assignedAchievementsDoc = await firestore()
          .collection("Classes")
          .doc("allClasses")
          .collection("10") // Assuming classValue is accessible in the component
          .doc("AssignedAchievements")
          .get();

        if (assignedAchievementsDoc.exists) {
          const assignedAchievementsData = assignedAchievementsDoc.data();
          console.log(assignedAchievementsDoc.data());
          const achievements = assignedAchievementsData.achievements || [];

          const achievementPromises = achievements.map(
            async (achievementId) => {
              const achievementDoc = await firestore()
                .collection("Achievements")
                .doc(achievementId)
                .get();

              if (achievementDoc.exists) {
                const achievementData = achievementDoc.data();
                return {
                  id: achievementId,
                  title: achievementData.title,
                  description: achievementData.description,
                };
              }
            }
          );

          const fetchedAchievements = await Promise.all(achievementPromises);
          setAssignedAchievements(fetchedAchievements);
          console.log(fetchedAchievements);
        } else {
          console.log("Document 'AssignedAchievements' does not exist.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch assigned achievements when the component mounts
    fetchAssignedAchievements();
  }, []);

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
          justifyContent: "center",
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
      <FlatList
        data={assignedAchievements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default AssignedAchievementList;
