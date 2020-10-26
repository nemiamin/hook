import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import colors from '../../../assets/Colors';
import { connect } from 'react-redux';
import { login, send_otp } from '../../actions/auth';
import { toast } from '../../actions/toast';
import { useFocusEffect } from '@react-navigation/native';
import RNOtpVerify from 'react-native-otp-verify';

const EmailVerify = ({ login, navigation, toast, send_otp }) => {
    const [ emailForm, setEmailForm ] = useState({
        email: ''
    });
    const changeEmailInput = (name, e) => {
        setEmailForm({
            ...emailForm, [name]: e
        })
    }
    const [ token, setToken ] = useState('');
    useFocusEffect(
        useCallback(
            () => {
                getHash();
                console.log()
            },
            []
        )
    )

    const getHash = () =>
    RNOtpVerify.getHash()
    .then(data => {
        console.log(data, 'token');
        // alert(data)
        setToken(data)
        // alert(data)
    })
    .catch(console.log);

    const submit = async () => {
        const { email } = emailForm;
        if(!email) {
            toast('err','Otp is required!')
            return;
        }
        const res = await send_otp({email, token});
        console.log(res, 'otp resp')
        if(res.success) {
            navigation.navigate('ForgotScreen', {email: emailForm.email, otp: res.data});
            setEmailForm({
                email: ''
            });
            toast('success', 'OTP sent successfully !');
        } else {
            toast('err',res.data)
        }
    }

    return (
        <ScrollView style={{flexDirection:'column',}}>
          

          <View style={{marginTop: 50, marginHorizontal: 10}}>
          <View style={{flex:1, justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
                <Text style={{marginTop: 50,fontSize: 20, fontWeight: 'bold'}}>
                    Submit your email
                </Text>
                
          </View>
                <View style={{marginHorizontal:30, marginTop:40}}>
                <Input placeholder='Email' name='email' value={emailForm.email} changeInput={changeEmailInput}/>
                
                <View style={{ flex: 1, marginTop: 40 }}>
                    <TouchableOpacity style={{ backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6 }} onPress={submit}>
                        <Text>
                            Send Otp
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
        login, toast, send_otp
    }
) (EmailVerify)

