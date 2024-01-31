import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import firestore from "@react-native-firebase/firestore";
import FormButton from "../shared/FormButton";
import {COLORS} from '../constants/theme';
import { signOut } from '../utils/auth';




const DisplayAllCollections = ({ navigation }) => {
  const [collectionNames, setCollectionNames] = useState([]);

  useEffect(() => {
    const fetchCollectionNames = async () => {
      try {
        const collectionNamesDoc = await firestore()
          .collection('Classes')
          .doc('allClasses')
          .get();

        const names = collectionNamesDoc.data().collectionNames;
        setCollectionNames(names);
      } catch (error) {
        console.error('Error fetching collection names:', error.message);
      }
    };

    fetchCollectionNames();
  }, []);

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
      <View>
        <Text style={{
          fontSize:24,
          color:"black",
          fontWeight:"bold",
          paddingTop:10,
          paddingLeft:10
        }}>All classes</Text>
        <Text style={{
          fontSize:16,
          color:"grey",
          fontWeight:"light",
          paddingBottom:10,
          paddingLeft:10
        }}>Click on any class to see details</Text>
      </View>
      <FlatList
        data={collectionNames}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <FormButton
            labelText={item}
            onPress={() => navigation.navigate('DisplayAllStudents', { collectionName: item })}
            style={{ marginVertical:10, marginHorizontal:10, paddingVertical:15 }} // Add additional styles here

          />
        )}
      />
    </View>
  );
};

export default DisplayAllCollections;
