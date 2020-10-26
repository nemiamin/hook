import PushNotification from 'react-native-push-notification';

PushNotification.configure({
    onNotification: (notification) => {
        console.log(notification, 'Local Notification')
    },
    // popInitialNotification: true,
    // requestPermissions: true
})

export const LocalNotification = () => {
    PushNotification.localNotification({
        autoCancel: true,
        bigText: 'This is the big text which will be displayed when the notification is expanded !',
        subText: 'First Notification',
        title: 'VDV',
        message: 'Expand to see more',
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
        actions: ['Yes', 'No']
    })
}