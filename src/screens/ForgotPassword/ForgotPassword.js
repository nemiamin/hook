import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import colors from '../../../assets/Colors';
import { connect } from 'react-redux';
import { login, forgot_password } from '../../actions/auth';
import { toast } from '../../actions/toast';
import { useFocusEffect } from '@react-navigation/native';
import RNOtpVerify from 'react-native-otp-verify';

const ForgotPassword = ({ login,route, navigation, toast, forgot_password }) => {
    const [ forgotPasswordForm, setForgotPasswordForm ] = useState({
        otp: '',
        password: '',
        confirm_password: '',
        email: ''
    });
    const [ show, setShow ] = useState(true);
    const [show2, setShow2] = useState(true);
    const [ otp, setOtp ] = useState('')
    useFocusEffect(
        useCallback(() => {
            (async() => {
                console.log(route.params.email, 'email')
                setForgotPasswordForm({
                    email: route.params.email ? route.params.email : ''
                });
                // setOtp(route.params.otp)
            })();
            RNOtpVerify.getOtp()
            .then(p => RNOtpVerify.addListener(otpHandler))
            .catch(x => console.log(x));
        
        }, [])
    )
    // 1st step and then bookmarked tutorial// react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/build/intermediates/assets/debug/index.android.bundle --assets-dest ./android/app/build/intermediates/res/merged/debug


//    .
    

const otpHandler = (d) => {
    console.log(d, d.split('>'));
    const res = d.split('>')[2];
    
    // alert(`This is otp ${d} and ${JSON.stringify(res)}`);
    setForgotPasswordForm({
        ...forgotPasswordForm, otp: res
    })
}
    const changeForgotPasswordInput = (name, e) => {
        setForgotPasswordForm({
            ...forgotPasswordForm, [name]: e
        })
    }
    const submit = async () => {
        const { otp, password, confirm_password } = forgotPasswordForm;
        if(!otp) {
            toast('err','Otp is required!')
            return;
        }

        if(!password) {
            toast('err','Password is required!')
            return;
        }

        if(confirm_password != password) {
            toast('err', 'Confirm password does not match!')
        }

        const res = await forgot_password(forgotPasswordForm);
        console.log(res, 'login')
        if(res.success) {
            setForgotPasswordForm({
                otp: '',
                password: '',
                confirm_password: ''
            })
            navigation.navigate('LoginScreen');
            toast('success', 'Password changed successfully !')
        } else {
            toast('err',res.data)
        }
       
    }
    const togglePass = () => {
        setShow(!show)
    }
    const togglePass2 = () => {
        setShow2(!show2)
    }
    return (
        <ScrollView style={{flexDirection:'column',}}>
          

          <View style={{marginTop: 50, marginHorizontal: 10}}>
          <View style={{flex:1, justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
                <Text style={{marginTop: 50,fontSize: 20, fontWeight: 'bold'}}>
                    Reset Password
                </Text>
                
          </View>
                <View style={{marginHorizontal:30, marginTop:40}}>
                <Input placeholder='Otp' name='otp' value={forgotPasswordForm.otp} changeInput={changeForgotPasswordInput}/>
                <Input placeholder='Password' name='password' value={forgotPasswordForm.password} secure={show} changeInput={changeForgotPasswordInput} logo={true} toggle={togglePass} />

                <Input placeholder='Confirm Password' name='confirm_password' value={forgotPasswordForm.confirm_password} secure={show2} changeInput={changeForgotPasswordInput} logo={true} toggle={togglePass2} />
                <View>
                <Text>
                    <Text style={{fontWeight:'bold'}}>Note:</Text> Password should contain minimum 8 characters
                </Text>
            </View>

                <View style={{ flex: 1, marginTop: 40 }}>
                    <TouchableOpacity style={{ backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6 }} onPress={submit}>
                        <Text>
                            Submit
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{  justifyContent: 'center', alignItems: 'center', paddingTop: 25, borderRadius: 6 }} onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={{ color: colors.purple_text, letterSpacing: 6, fontSize: 16 }}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
                </View>

                
        </View>

        </ScrollView>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})


export default connect(
    mapStateToProps, {
        login, toast, forgot_password
    }
) (ForgotPassword)

