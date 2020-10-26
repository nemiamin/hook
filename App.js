
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Navigator from './src/navigation/Navigation';
import store from "./src/store";
import { Provider } from "react-redux";
import Alert from './src/components/Alert'
// import { LocalNotification } from './src/services/LocalPushController';
// import PushNotification from 'react-native-push-notification';
// import RemotePushController from './src/services/RemotePushController';

const App = () => {
  useEffect(() => {
    console.log('Console fires for the notifications !');
    // LocalNotification()
  }, [])
  return (
    <>
    {/* <RemotePushController /> */}
    <Provider store={store}>
     
   <Navigator />
   <Alert />
   </Provider>
   </>
   );
};



export default App;
