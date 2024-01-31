import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState([]);

  useEffect(() => {
    // Function to fetch teacher data from Firestore
    const fetchTeacherData = async () => {
      try {
        const teachersCollection = firestore().collection('teachers');
        const snapshot = await teachersCollection.get();

        const teachersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTeacherData(teachersData);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    // Call the fetchTeacherData function
    fetchTeacherData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <View>
      <Text>Teacher Dashboard</Text>
      <FlatList
        data={teacherData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{`Name: ${item.name}`}</Text>
            <Text>{`Subject: ${item.subject}`}</Text>
            {/* Add more fields as needed */}
          </View>
        )}
      />
    </View>
  );
};

export default TeacherDashboard;
