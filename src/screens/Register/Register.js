import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Input from '../../components/Input';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../../assets/Colors';
import { connect } from 'react-redux';
import { register } from '../../actions/auth'
import { toast } from '../../actions/toast';

const Register = ({ navigation, register, toast }) => {
  const [ registerForm, setRegisterForm ] = useState({
    email: '',
    password: '',
    name: '',
    confirm_password: '',
    phone: '',
    referal_id: ''
});
const [ show, setShow ] = useState(true)
const [ c_show, c_setShow ] = useState(true)
const changeRegisterInput = (name, e) => {
  setRegisterForm({
        ...registerForm, [name]: e
    })
}

const registerClick = async () => {
    if(!registerForm.name) {
        toast('err','Name is required!');
        return;
    }

    if(!registerForm.email) {
        toast('err','Email is required!');
        return;
    }

    // if(!registerForm.phone) {
    //     toast('err','Phone is required!');
    //     return;
    // }

    if(!registerForm.password) {
        toast('err','Password is required!');
        return;
    }

    if(registerForm.confirm_password != registerForm.password) {
        toast('err','Confirm password does not match!');
        return;
    }

    
    const res = await register(registerForm);
    if(res.success) {
        // toast('success','Registered Successfully!')
        navigation.navigate('LoginScreen');
    } else {
        toast('err',res.data);
    }
    
}

const togglePass = () => {
    setShow(!show)
}
const togglePass_c = () => {
    c_setShow(!c_show)
}

    return (
      <ScrollView style={{flexDirection:'column',}}>
          

      <View style={{marginTop: 50, marginHorizontal: 10}}>
      <View style={{flex:1, justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
            <Text style={{marginTop: 50,fontSize: 20, fontWeight: 'bold'}}>
                Register
            </Text>
            
      </View>
            <View style={{marginHorizontal:30, marginTop:40}}>
            
            <Input placeholder='Name' name='name' value={registerForm.name} changeInput={changeRegisterInput}/>
            <Input placeholder='Email' name='email' value={registerForm.email} changeInput={changeRegisterInput}/>
            <Input placeholder='Phone' name='phone' value={registerForm.phone} changeInput={changeRegisterInput}/>
            <Input placeholder='Password' name='password' value={registerForm.password} secure={show} logo={true} toggle={togglePass} changeInput={changeRegisterInput}/>
            
            <Input placeholder='Confirm Password' name='confirm_password' value={registerForm.confirm_password} secure={c_show} logo={true} toggle={togglePass_c} changeInput={changeRegisterInput}/>

            <View>
                <Text>
                    <Text style={{fontWeight:'bold'}}>Note:</Text> Password should contain minimum 8 characters
                </Text>
            </View>
            <Input placeholder='Referal id' name='referal_id' value={registerForm.referal_id} changeInput={changeRegisterInput}/>

            <View style={{ flex: 1, marginTop: 40 }}>
                    <TouchableOpacity style={{ backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6 }} onPress={registerClick}>
                        <Text>
                            Register
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{  justifyContent: 'center', alignItems: 'center', paddingTop: 25, borderRadius: 6 }} onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={{ color: colors.purple_text, fontSize: 16, letterSpacing: 6 }}>
                            Back To Login
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
        register, toast
    }
) (Register)

