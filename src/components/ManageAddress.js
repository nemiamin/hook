import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Picker } from 'react-native';
import colors from '../../assets/Colors';
const { height, width } = Dimensions.get('window');
import { connect } from 'react-redux';
import {getUser, storeUser, clearUser} from '../actions/authHandler';
import { toast } from '../actions/toast';
import { loadUser , add_address, delete_address} from '../actions/auth';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Input from './Input';
import Loader from './Loader';
import Icon from "react-native-vector-icons/FontAwesome";

const ManageAddress = ({toast, loadUser ,add_address, delete_address, chekout, setUserAddress}) => {
    const [user, setUser] = useState(null)
    const [ address, setAddress ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ addressForm, setAddressForm ] = useState({
        address: '',
        name: '',
        pincode: ''
    });
    const [ phoneForm, setPhoneForm ] = useState({
        phone: ''
    });

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
              const resp = await getUser();
            if(resp) {
                setUser(resp);
                const response = await loadUser({user_id: resp._id});
                if(response) {
                    setUser(response);
                    setPhoneForm({
                        phone: response.phone
                    })
                    setLoading(false);
                }
            }
            }
            fetchData();
        }, [])
    )

const changeAddressInput = (name, e) => {
    setAddressForm({
        ...addressForm, [name]: e
    })
}
const changePhoneInput = (name, e) => {
    setPhoneForm({
        ...phoneForm, [name]: e
    })
}

const AddAddress = async () => {
    const { address, name, pincode } = addressForm;
    const payload = {
        address, name, pincode
    }
    const response = await add_address(payload)
    const tok = await getUser();
    console.log(user, 'from add 1')
    console.log({...response, token: tok.token}, 'local updated from manage address.js 1')   
     await storeUser({...response,token: tok.token});
    setUser(response);
    setAddressForm({
        name: '',
        address: '',
        pincode: ''
    })
    if(response) {
        toast('success', 'Address added!')
    } else {
        toast('err', 'Invalid request!')
    }
}

    const DeleteAddress = async (id) => {
        const payload = {
            _id: id
        }

        const response = await delete_address(payload);
        console.log(response, 'del add resp');
        const tok = await getUser();
        // if(!response.success) {
        //     // clearUser();
        //     return
        // }
        if(response) {
            // console.log('response ', response);
            console.log(user, 'from add 2')
            console.log({...response, token: tok.token}, 'local updated from manage address.js 2')   
            await storeUser({...response,token: tok.token})
            setUser(response);
            toast('success', 'Address deleted!');
        } else {
            toast('err', 'Invalid request!');
        }
    }

    const AddressList = () => {
        if(!chekout) {
            return (
                <View style={{marginTop: 30}}>
                {user && user.address.length > 0 && (
                    user.address.map(address => (
                        <View key={address._id} style={{backgroundColor:'whitesmoke', marginTop:10, padding:20, borderRadius: 10, flexDirection:'row'}}>
                            <View style={{flex: 1}}>
                            <Text>
                                {address.name}
                            </Text>
                            <Text>
                                {address.address}
                            </Text>
                            <Text>
                                {address.pincode}
                            </Text>
                        </View>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={() => {DeleteAddress(address._id)}} style={{justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
                            <Icon name="trash" size={16} color="red" />
                        </TouchableOpacity>
</View>
</View>
                    ))
                )}
                </View>
            )
        } else {
            return (
                <View style={{marginTop: 30}}>
                {user.address.length > 0 && (
                    user.address.map(address => (
                        <TouchableOpacity style={{backgroundColor:'whitesmoke', marginTop:10, padding:20, borderRadius: 10, flexDirection:'row', flexDirection: 'row'}}>
                           
                            <View style={{flex: 1}}>
                            <Text>
                                {address.name}
                            </Text>
                            <Text>
                                {address.address}
                            </Text>
                            <Text>
                                {address.pincode}
                            </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => {setUserAddress(address, phoneForm.phone)}} style={{ alignItems: 'center', paddingVertical: 6, paddingHorizontal: 15, backgroundColor: colors.purple, borderRadius: 6 }}>
                                <Text>
                                    Select
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
</TouchableOpacity>

                    ))
                )}
                </View>
            )
        }
    }

       return (
        <>
        {loading && (
        <Loader />
          )}
          {!loading && (
        <ScrollView>
            
                <View style={{marginHorizontal:30, flex:1}}>
                <Input placeholder='Name' name='name' value={addressForm.name} changeInput={changeAddressInput}/>
                <Input placeholder='Address' name='address' value={addressForm.address} changeInput={changeAddressInput}/>
                <Input placeholder='Pincode' name='pincode' value={addressForm.pincode} changeInput={changeAddressInput}/>

                <View style={{justifyContent:'flex-end', alignItems:'flex-end', alignContent:'flex-end'}}>
                <TouchableOpacity onPress={AddAddress} style={{ backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6, width:width*0.2 }}>
                        <Text>
                            Add
                        </Text>
                    </TouchableOpacity>

                    
                </View>
                <View style={{marginTop:20}}>
                    <Text style={{fontSize:16}}>
                        Delivery Contact Number
                    </Text>
                    <Input placeholder='Phone' name='phone' value={phoneForm.phone} changeInput={changePhoneInput}/>
                </View>

                {AddressList()}
                </View>
        </ScrollView>
         )}
         </>
    )
}

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: colors.silver,
        marginTop:20
    }
})

const mapStateToProps = (state) => ({
    
})

export default connect(
    mapStateToProps, {
        loadUser, toast, add_address, delete_address
    }
) (ManageAddress)

