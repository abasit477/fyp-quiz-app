import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const StudentProfile = ({ studentId }) => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Function to fetch student data from Firestore
    const fetchStudentData = async () => {
      try {
        const studentDoc = await firestore().collection('students').doc(studentId).get();

        if (studentDoc.exists) {
          setStudentData(studentDoc.data());
        } else {
          console.error('Student not found');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    // Call the fetchStudentData function
    fetchStudentData();
  }, [studentId]); // Re-run the effect when the studentId changes

  if (!studentData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Student Profile</Text>
      <Text>{`Name: ${studentData.name}`}</Text>
      <Text>{`Class: ${studentData.class}`}</Text>
      {/* Add more fields as needed */}
    </View>
  );
};

export default StudentProfile;
