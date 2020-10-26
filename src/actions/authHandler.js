import { AsyncStorage } from 'react-native';
export const storeUser =  async (payload) => {
    AsyncStorage.setItem('user', JSON.stringify(payload));
    const user = await AsyncStorage.getItem('user');
    let resolved;
    if(user) {
        resolved = JSON.parse(user);
    }
    return user ? resolved : false 
}

// export const storeUser =  async (payload) => {
//     AsyncStorage.setItem('user', JSON.stringify(payload));
//     return true;
// }

export const clearUser = async () => {
    AsyncStorage.removeItem('user');
    return true;
}

export const getUser = async () => {
    const user = await AsyncStorage.getItem('user');
    let resolved;
    if(user) {
        resolved = JSON.parse(user);
    }
    return user ? resolved : false 
}