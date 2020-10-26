import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Text, Image } from 'react-native';
const { height, width } = Dimensions.get('window');
import Icons from "react-native-vector-icons/FontAwesome5";
import Iconss from "react-native-vector-icons/EvilIcons";
import colors from '../../assets/Colors';
import SearchModal from './SearchModal';
import { connect } from 'react-redux';
import { toast } from '../actions/toast';
import { getUser } from '../actions/authHandler';

const Header = ({ navigation, toast, auth }) => {
    const [ user, setUser ] = useState(null);
    useEffect(() => {
        (async() => {
         const user = await getUser();
        //  console.log(user, 'what is the user')
         if(user && user.token) {
            setUser(auth.user)
         }
        })()
    }, []);


    useEffect(() => {
        (async() => {
         const user = await getUser();
         if(user && user.token) {
            setUser(auth.user)
         }
         else {
             setUser(null)
         }
        })()
    }, [auth, auth.loading, auth.user])
    const [ search, setSearch ] = useState(false);
    const closeModal = () => {
        setSearch(false);
    }
    const openCart = async () => {
        const user = await getUser();
       
        if(!user || !user._id) {
            toast('err', 'Login to view your cart', true, navigation);
        }
        else {
            navigation.navigate('CartScreen')
        }
        return user;
    }
    return (
       <View style={{ flexDirection: 'row', elevation: 2, backgroundColor: 'white', paddingHorizontal: width * 0.06 }}>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.toggleDrawer()} >
        <Icons name="bars" size={20} color={colors.purple_text} />
        </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => {
            navigation.navigate('HomeScreen')
        }} >
        <Image style={{ height: 40, width: 40 }} source={require('../../assets/logo.png')} />
        </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
        <TouchableOpacity style={{ padding: 10 }} onPress={() => setSearch(true)}>
        <Iconss name="search" size={25} style={{ fontWeight: 'bold' }} color={colors.purple_text} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }} onPress={openCart}>
            <View style={{ backgroundColor: colors.purple_text, width: 13, alignItems: 'center', borderRadius: 6, position: 'absolute', left: width * 0.08, top: 6, zIndex: 6 }}>
            <Text style={{ color: 'white' }}>
                {user ? user.cart_count : 0}
            </Text>
            </View>
        <Icons name="opencart" size={25} color={colors.purple_text} />
        </TouchableOpacity>
        </View>
        <SearchModal search={search} close={closeModal} navigation={navigation} />
       </View>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(
    mapStateToProps, {
        toast
    }
) (Header)

