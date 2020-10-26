import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import colors from '../../../assets/Colors';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import Loader from '../../components/Loader';
import { storeUser, getUser } from '../../actions/authHandler';
import { loadUser , update_profile, add_address} from '../../actions/auth'
import { useFocusEffect } from '@react-navigation/native';
import { toast } from '../../actions/toast';
const { height, width } = Dimensions.get('window');
import ManageAddress from '../../components/ManageAddress';
import Icon from "react-native-vector-icons/FontAwesome";

const Profile = ({ loadUser, update_profile, toast, add_address, navigation }) => {
    const [ profileForm, setprofileForm ] = useState({
        email: '',
        name: '',
        phone: ''
    });

    const [ addressForm, setAddressForm ] = useState({
        address: '',
        name: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)
    const [ address, setAddress ] = useState([])
    const [ addressModal, setAddressModal ] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
              const resp = await getUser();
            if(resp && resp.token) {
                setUser(resp);
                const response = await loadUser({user_id: resp._id});
                if(response) {
                    setprofileForm({
                        email: response.email,
                        name: response.name,
                        phone: response.phone
                    });
                    setUser({...response, token: resp.token});
                    setLoading(false);
                }
            } else {
                toast('err', 'Please login to see profile detail')
            }
            }
            fetchData();
        }, [])
    )


    const changeLoginInput = (name, e) => {
        setprofileForm({
            ...profileForm, [name]: e
        })
    }
    const UpdateProfile = async () => {
        const { name, phone } = profileForm;
        const payload = {
            name, phone
        }
        const response = await update_profile(payload);
        // if(!response.success) {
        //     // clearUser();
        //     return
        // }
        console.log({...response, token: user.token}, 'local updated from manage profiel.js 1')   

        await storeUser({...response,token: user.token})
        setUser(response);
        if(response) {
            toast('success', 'Profile updated!')
        } else {
            toast('err', 'Invalid request!')
        }
    }

    

    return (
        <>
      {loading && (
      <Loader />
        )}
        {!loading && (
        <ScrollView style={{flexDirection:'column',}}>
          

          <View style={{ marginHorizontal: 10}}>
          <View style={{flex:1, justifyContent:'center',alignContent:'center', alignItems:'center'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Profile
                </Text>
                
          </View>
                <View style={{marginHorizontal:30, marginTop:40}}>
                <Input placeholder='Name' name='name' value={profileForm.name} changeInput={changeLoginInput}/>
                <Input placeholder='Email' name='email' value={profileForm.email} changeInput={changeLoginInput} disable={true}/>
                <Input placeholder='Phone' name='phone' value={profileForm.phone} changeInput={changeLoginInput}/>
                <View style={{ flex: 1, marginTop: 40 }}>
                    <TouchableOpacity onPress={UpdateProfile} style={{ backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6 }}>
                        <Text>
                            Update Profile
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setAddressModal(true)}} style={{ backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6, marginTop: 30 }}>
                        <Text>
                            Manage Address
                        </Text>
                    </TouchableOpacity>
                </View>
                </View>

         
                
                <Modal visible={addressModal} transparent={false} animationType={'slide'} onRequestClose={()=>{setAddressModal(false)}}>
                    <View style={{flexDirection:'row', paddingHorizontal:30}}>
                    <View style={{flex:2}}>
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize: 20,marginTop: 50, fontWeight: 'bold'}}>
                                Manage Address
                            </Text>
                        </View>
                        </View>
                        <TouchableOpacity onPress={()=>{setAddressModal(false)}} style={{justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end', marginTop:20}}>
                        <Icon name="times" size={25} style={{ fontWeight: 'bold' }} color={'black'} />
                        </TouchableOpacity>
                        
                        
                    </View>
                    <ManageAddress />
                </Modal>
                
        </View>

        </ScrollView>
        )}
        </>
    )
}

const mapStateToProps = state => ({
})


export default connect(
    mapStateToProps, {
        loadUser, update_profile, toast, add_address
    }
) (Profile)

