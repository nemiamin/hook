import React, { useCallback, useState } from 'react';
import { View, Text , Modal, TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from '@react-navigation/native';
import Loading from '../components/Loader';
import colors from '../../assets/Colors';
import { connect } from 'react-redux';
import { loadUser, clearUser, updateUser } from '../actions/auth';
import { getUser, storeUser } from '../actions/authHandler';

const Payment = ({ navigation, route, loadUser, updateUser }) => {
    const [ pay, setPay ] = useState({
        amount: 0, _id: null, url: null
    });
    const [ user, setUser ] = useState(null);
    useFocusEffect(
        useCallback(() => {
            const { total_price, cart, promocode_discount } = route.params;
            setPay({
                amount: (total_price - promocode_discount), _id: cart, url: `https://thefamilyshop.in/api/hooks/cart/createPayment/${(total_price - promocode_discount)}/${cart}`
            });
           (async () => {
            const u = await getUser();
            setUser(u);
           })()

        }, [])
        // `http://thefamilyshop.in/api/hooks/cart/createPayment/${total_price}/${cart}`
    );
    const { amount, _id, url } = pay;
    return (  
       <>
           {(amount && _id && url) ? (
               <>
               <TouchableOpacity style={{
                   paddingHorizontal: 13, paddingVertical: 13, alignItems: 'center', marginVertical: 10, backgroundColor: colors.purple
               }} onPress={() => {
                   navigation.navigate('HomeScreen')
               }}>
                   <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                       Go Back To Shopping
                   </Text>
               </TouchableOpacity>
               <WebView source={{ uri: url }}
                onNavigationStateChange={async (data) => {
                    if(data.url === 'http://192.168.0.105:3080/cart/checkStatus'  || data.url == 'http://192.168.43.124:3080/cart/checkStatus' || data.url === 'https://thefamilyshop.in/api/hooks/cart/checkStatus' || data.url === 'http://thefamilyshop.in/api/hooks/cart/checkStatus') {
                        const res = await loadUser({ user_id: user._id });
                        // if(!res.success) {
                        //     // clearUser();
                        //     return
                        // }
                        console.log({...res, token: user.token}, 'local updated from manage payment.js 1')   

                        const store = await storeUser({ ...res, token: user.token,cart_id: null });
                        const update = await updateUser({...res, token: user.token, cart_id: null })
                    // setTimeout(() => {
                        navigation.navigate('PaymentSuccess')
                    // }, 100)
                    }   
                }}
               />
               </>
           ) : (
                <Loading />
           ) }
       </>
            )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(
    mapStateToProps, {
        loadUser,updateUser
    }
) (Payment)

