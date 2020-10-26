import React, { useEffect } from 'react'
import PushNotification from 'react-native-push-notification'
const RemotePushController = () => {
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      // onRegister: function(token) {
      //   console.log('TOKEN:', token)
      //   // alert(token.token + ' ==> This is the token ')
      // },
// (required) Called when a remote or local notification is opened or received
//       onNotification: function(notification) {
//         console.log('REMOTE NOTIFICATION ==>', notification);
//         // alert(JSON.stringify(notification))
// // process the notification here
//       },
      // Android only: GCM or FCM Sender ID
      senderID: '848617878200',
      // popInitialNotification: true,
      // requestPermissions: true
    })
  }, [])
return null
}
export default RemotePushController