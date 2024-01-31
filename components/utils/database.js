import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// Create New Quiz
export const createQuiz = async (currentQuizId, title, description) => {
  return firestore().collection("Quizzes").doc(currentQuizId).set({
    title,
    description,
  });
};

// Create New Achievement
export const createAchievement = async (
  achievementId,
  title,
  description,
  achievementsClass
) => {
  const classRef = firestore()
    .collection("Classes")
    .doc("allClasses")
    .collection(achievementsClass)
    .doc("AssignedAchievements");

  // Assuming quizStringValue is the string you want to add to the 'assignedQuizes' array
  const achievementStringValue = achievementId;

  // Use arrayUnion to add the quizStringValue to the 'assignedQuizes' array
  classRef
    .update({
      achievements: firestore.FieldValue.arrayUnion(achievementStringValue),
    })
    .then(() => {
      console.log("Quiz string value added to the array successfully.");
    })
    .catch((error) => {
      console.error("Error adding quiz string value to the array:", error);
    });

  return firestore().collection("Achievements").doc(achievementId).set({
    title,
    description,
    achievementsClass,
  });
};

// Create new question for current quiz
export const createQuestion = (currentQuizId, currentQuestionId, question) => {
  return firestore()
    .collection("Quizzes")
    .doc(currentQuizId)
    .collection("QNA")
    .doc(currentQuestionId)
    .set(question);
};

// Get All Quizzes
export const getQuizzes = () => {
  return firestore().collection("Quizzes").get();
};

// Get All Classes

// Get Quiz Details by id
export const getQuizById = (currentQuizId) => {
  return firestore().collection("Quizzes").doc(currentQuizId).get();
};

// Get Questions by currentQuizId
export const getQuestionsByQuizId = (currentQuizId) => {
  return firestore()
    .collection("Quizzes")
    .doc(currentQuizId)
    .collection("QNA")
    .get();
};

// Store Quiz Result in Firebase
export const storeQuizResult = async () => {
  const user = auth().currentUser;

  // Check if the user is authenticated
  if (user) {
    const quizResult = {
      userId: user.uid,
      quizId: currentQuizId,
      timestamp: firestore.FieldValue.serverTimestamp(),
      questions: questions.map((question) => ({
        question: question.question,
        selectedOption: question.selectedOption,
      })),
    };

    try {
      await firestore().collection("QuizAttempts").add(quizResult);
      console.log("Quiz result stored successfully:", quizResult);
    } catch (error) {
      console.error("Error storing quiz result:", error.message);
    }
  }
};

// export const getClasses = () => {
//   try {
//     const classesRef = firestore().collection("Classes");
//     const classesSnapshot = classesRef.get();

//     for (const doc of classesSnapshot.docs) {
//       const classValue = doc.data().classValue;
//       console.log("ClassValue:", classValue);
//     }
//   } catch (error) {
//     console.error("Error getting classes:", error.message);
//   }
// };

// export const GetAllClassesTry = () => {
//   classValueCollection = firestore()
//     .collection("Classes")
//     .doc("allClasses")
//     .collection(classValue);

//   classValueCollection.onSnapshot((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, " => ", doc.data());
//     });
//   });
// };

export const QuizAssignment = async (currentQuizId, classValue) => {
  await firestore()
    .collection("Classes")
    .doc("allClasses")
    .collection(classValue)
    .doc("AssignedQuizes")
    .set({
      quizzes: [currentQuizId],
    });
};

// Get Attempted Quizes
export const getQuizAttempts = async (userId) => {
  try {
    const quizAttemptsSnapshot = await firestore()
      .collection("QuizAttempts")
      .where("userId", "==", userId)
      .get();

    const quizAttempts = quizAttemptsSnapshot.docs.map((doc) => doc.data());
    return quizAttempts;
  } catch (error) {
    console.error("Error fetching quiz attempts:", error.message);
    throw error;
  }
};
export const getClassQuizAttempts = async (classValue) => {
  try {
    const quizAttemptsSnapshot = await firestore()
      .collection("QuizAttempts")
      .where("class", "==", classValue)
      .get();

    const quizAttempts = quizAttemptsSnapshot.docs.map((doc) => doc.data());
    
    return quizAttempts;
  } catch (error) {
    console.error("Error fetching quiz attempts:", error.message);
    throw error;
  }
};
