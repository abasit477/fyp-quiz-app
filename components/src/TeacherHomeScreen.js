import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getClassValues } from '../utils/database';
const TeacherHomeScreen = () => {
  const [classValues, setClassValues] = useState([]);

  useEffect(() => {
    const fetchClassValues = async () => {
      const values = await getClassValues();
      console.log("Teacher Home Screen", values)
      setClassValues(values);
    };

    fetchClassValues();
  }, []);

  const renderClassItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text>Hello</Text>
      <Text>{item}</Text>
    </View>
  );

  return (
    <View>
      {/* Your teacher dashboard UI */}
      <Text>Class Values:</Text>
      <FlatList
        data={classValues}
        keyExtractor={(item) => item}
        renderItem={renderClassItem}
      />
      {/* ... other UI elements */}
    </View>
  );
};

export default TeacherHomeScreen;
