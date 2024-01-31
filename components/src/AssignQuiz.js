// import React, { useState } from 'react';
// import { View, Text, Button } from 'react-native';
// import firestore from '@react-native-firebase/firestore';

// const AssignQuiz = ({ quizId, studentId, classId }) => {
//   const assignQuiz = async () => {
//     try {
//       // Reference to the quizzes collection
//       const quizzesCollection = firestore().collection('quizzes');

//       // Get the quiz document
//       const quizDoc = await quizzesCollection.doc(quizId).get();

//       if (!quizDoc.exists) {
//         console.error('Quiz not found');
//         return;
//       }

//       const quizData = quizDoc.data();

//       // Determine whether the assignment is for a student or a class
//       if (studentId) {
//         // Assign the quiz to a specific student
//         const studentRef = firestore().collection('students').doc(studentId);

//         // Update the student's assigned quizzes
//         await studentRef.update({
//           assignedQuizzes: firestore.FieldValue.arrayUnion({
//             quizId,
//             quizTitle: quizData.title,
//             // Add more details as needed
//           }),
//         });

//         console.log('Quiz assigned to student successfully');
//       } else if (classId) {
//         // Assign the quiz to an entire class
//         const classRef = firestore().collection('classes').doc(classId);

//         // Update the class's assigned quizzes
//         await classRef.update({
//           assignedQuizzes: firestore.FieldValue.arrayUnion({
//             quizId,
//             quizTitle: quizData.title,
//             // Add more details as needed
//           }),
//         });

//         console.log('Quiz assigned to class successfully');
//       }
//     } catch (error) {
//       console.error('Error assigning quiz:', error);
//     }
//   };

//   return (
//     <View>
//       <Text>Quiz Assignment</Text>
//       <Button title="Assign Quiz" onPress={assignQuiz} />
//     </View>
//   );
// };

// export default AssignQuiz;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AssignQuizToClass = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');

  useEffect(() => {
    const user = auth().currentUser;

    // Check if the user is authenticated
    if (user) {
      // Fetch classes for the current teacher
      firestore()
        .collection('Teachers')
        .doc(user.uid)
        .collection('Classes')
        .get()
        .then((snapshot) => {
          const classValues = snapshot.docs.map((doc) => doc.id);
          setClasses(classValues);
        });

      // Fetch all quizzes
      firestore().collection('Quizzes').get().then((snapshot) => {
        const quizValues = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setQuizzes(quizValues);
      });
    }
  }, []);

  const handleAssignQuiz = async () => {
    if (selectedClass && selectedQuiz) {
      await firestore()
        .collection('Classes')
        .doc(selectedClass)
        .collection('AssignedQuizzes')
        .doc(selectedQuiz.id)
        .set({ quizId: selectedQuiz.id });

      console.log('Quiz assigned to class successfully:', selectedQuiz.id, selectedClass);
      navigation.goBack();
    } else {
      alert('Please select a class and quiz');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Assign Quiz to Class</Text>

      <Picker
        selectedValue={selectedClass}
        onValueChange={(value) => setSelectedClass(value)}
        style={styles.picker}>
        {classes.map((className) => (
          <Picker.Item key={className} label={className} value={className} />
        ))}
      </Picker>

      <Picker
        selectedValue={selectedQuiz}
        onValueChange={(value) => setSelectedQuiz(value)}
        style={styles.picker}>
        {quizzes.map((quiz) => (
          <Picker.Item key={quiz.id} label={quiz.title} value={quiz} />
        ))}
      </Picker>

      <Button title="Assign Quiz" onPress={handleAssignQuiz} style={styles.button} />
    </View>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: 10,
  },
  picker: {
    width: '80%',
  },
  button: {
    backgroundColor: '#54C5F8',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AssignQuizToClass;