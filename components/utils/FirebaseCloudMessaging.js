// messagingService.js
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
}

async function getFCMToken() {
  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);
  return fcmToken;
}

function onMessageReceived(callback) {
  return messaging().onMessage(callback);
}

export { requestUserPermission, getFCMToken, onMessageReceived };
