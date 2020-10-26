import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, AsyncStorage, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import colors from '../../../assets/Colors';
import { connect } from 'react-redux';
import { login, socialLogin, decodeToken } from '../../actions/auth';
import { toast } from '../../actions/toast';
import { useFocusEffect } from '@react-navigation/native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import OAuthManager from 'react-native-social-login';
import { WebView } from 'react-native-webview';


const Login = ({ login, navigation, toast, socialLogin, decodeToken }) => {
    
    const manager = new OAuthManager('firestackexample')
    manager.configure({
      google: {
        callback_url: `io.fullstack.FirestackExample:/oauth2redirect`,
        client_id: '848617878200-dcsdir0pc35s537e2s8rjuintadp852f.apps.googleusercontent.com',
        client_secret: 'IDB-kJP7xk_TBr_LiCAUU7aX'
      },
      facebook: {
        client_id: '3113798708713758',
        client_secret: '2d05dbca8ee90fba57dd98fd74d687e0'
      }
    });

    const [ loginForm, setLoginForm ] = useState({
        email: '',
        password: ''
    });

    
    const [ show, setShow ] = useState(true);
    const [ gmodal, setGmodal ] = useState(false);
    useFocusEffect(
        useCallback(() => {
            GoogleSignin.configure({
                scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
                webClientId: '848617878200-dcsdir0pc35s537e2s8rjuintadp852f.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
                offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
                hostedDomain: '', // specifies a hosted domain restriction
                loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
                forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
                accountName: '', // [Android] specifies an account name on the device that should be used
                iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
              });
        }, [])
    )

    const googleLogin = async () => {
        try {
            setGmodal(true)
// if(res.success) {
//     navigation.navigate('HomeStack');
//     navigation.navigate("ProfileScreen")
//     toast('success', 'Login Successfull')
// }
} catch (error) {
    console.log(error, 'error')
    alert(JSON.stringify(error))
}
            // 
    }

    const fbLogin = async () => {
        manager.authorize('facebook')
        .then(resp => {
            fetch(`https://graph.facebook.com/me?access_token=${resp.response.credentials.accessToken}&fields=id,name,email,picture.height(500)`)
                .then(response => response.json())
                .then(async data => {
                  console.log(data, 'fb data');
                  if(!data.email) {
              toast('err', 'Please Login with facebook on email !');
              return
                  }
                  const tok = await AsyncStorage.getItem('token')
                  const res = await socialLogin({
                    email: data.email, name: data.name, token: 'tok'
                });
                console.log(res, 'fbsl resp')
                if(res.success) {
                    navigation.navigate('HomeStack');
                    navigation.navigate("ProfileScreen");
                    toast('success', 'Login Successfull')
                }
                })
                .catch(e => console.log(e, 'fb err'))
           
        })
  .catch(err => console.log(err, 'err'));
        // try {
        //     const {
        //       type,
        //       token,
        //       expires,
        //       permissions,
        //       declinedPermissions,
        //     } = await Facebook.logInWithReadPermissionsAsync({
        //       permissions: ['public_profile', 'email', 'user_friends'],
        //     });
        //     // rRW++LUjmZZ+58EbN5DVhGAnkX4=
        //     if (type === 'success') {
        //       // Get the user's name using Facebook's Graph API
        //       fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
        //         .then(response => response.json())
        //         .then(async data => {
        //           console.log(data, 'fb data');
        //           if(!data.email) {
        //       toast('err', 'Please Login with facebook on email !');
        //       return
        //           }
        //           const tok = await AsyncStorage.getItem('token')
        //           const res = await socialLogin({
        //             email: data.email, name: data.name, token: tok
        //         });
        //         console.log(res, 'fbsl resp')
        //         if(res.success) {
        //             navigation.navigate('HomeStack');
        //             navigation.navigate("ProfileScreen");
        //             toast('success', 'Login Successfull')
        //         }
        //         })
        //         .catch(e => console.log(e, 'fb err'))
        //     } else {
        //       // type === 'cancel'
        //       toast('err', 'Facebook login error')
        //     }
        //   } catch ({ message }) {
        //       console.log(message, 'message')
        //     alert(`Facebook Login Error: ${message}`);
        //   }
    }

    const changeLoginInput = (name, e) => {
        setLoginForm({
            ...loginForm, [name]: e
        })
    }
    const submitLogin = async () => {
        const { email, password } = loginForm;
        if(!email) {
            toast('err','Email is required!')
            return;
        }

        if(!password) {
            toast('err','Password is required!')
            return;
        }
        const res = await login({email, password});
        console.log(res, 'login')
        if(res.success) {
            setLoginForm({
                email: '',
                password: ''
            })
            navigation.navigate('HomeStack');
        } else {
            toast('err',res.data)
        }
       
    }
    const togglePass = () => {
        setShow(!show)
    }
    return (
        <ScrollView style={{flexDirection:'column',}}>
          

          <View style={{marginTop: 50, marginHorizontal: 10}}>
          <View style={{flex:1, justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
                <Text style={{marginTop: 50,fontSize: 20, fontWeight: 'bold'}}>
                    Login
                </Text>
                
          </View>
                <View style={{marginHorizontal:30, marginTop:40}}>
                <Input placeholder='Email' name='email' value={loginForm.email} changeInput={changeLoginInput}/>
                <Input placeholder='Password' name='password' value={loginForm.password} secure={show} changeInput={changeLoginInput} logo={true} toggle={togglePass} />
                <View style={{ flex: 1, marginTop: 40 }}>
                    <TouchableOpacity style={{ backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6 }} onPress={submitLogin}>
                        <Text>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <View style={{ marginVertical: 15 , flexDirection: 'row', flex: 1 }}>
                    <TouchableOpacity style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                Login With :
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={googleLogin}>
                            <Image source={{
                                uri: 'https://blog.hubspot.com/hubfs/image8-2.jpg'
                            }} style={{ height: 40, width: 60 }} />
                        </TouchableOpacity>
                       
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={fbLogin}>
                            <Image height={100} width={undefined} source={{
                                uri: 'https://www.freepnglogos.com/uploads/facebook-icons/download-facebook-icon-vector-13.png'
                            }} style={{ height: 40, width: 60 }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{  justifyContent: 'center', alignItems: 'center', paddingTop: 25, borderRadius: 6 }} onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text style={{ color: colors.purple_text, letterSpacing: 6, fontSize: 16 }}>
                            Register
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{  justifyContent: 'center', alignItems: 'center', paddingTop: 13, borderRadius: 6 }} onPress={() => navigation.navigate('VerifyEmail')}>
                        <Text style={{ color: colors.purple_text, letterSpacing: 6, fontSize: 16 }}>
                            Forgot Password .?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{  justifyContent: 'center', alignItems: 'center', paddingTop: 13, borderRadius: 6 }} onPress={() => navigation.navigate('HomeStack')}>
                        <Text style={{ color: colors.purple_text, letterSpacing: 6, fontSize: 16 }}>
                            Back To Home
                        </Text>
                    </TouchableOpacity>
                </View>
                </View>

                
        </View>
                            <Modal visible={gmodal} onRequestClose={() => setGmodal(false)}>
                                    <WebView 
                                    userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/LMY48X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/608.2.11"
                                    onNavigationStateChange={async (data) => {
                                        console.log(data.url, 'this is gnav');
                                        // https://thefamilyshop.in/api/hooks/user/google/success/%7B%22i
                                        const splitted = data.url.split('success/');
                                        console.log(splitted, 'this is splitted')
                                        if(splitted.length > 1 && splitted[0] == 'https://thefamilyshop.in/api/hooks/user/google/') {
                                            console.log('Thereby login successfull !', splitted[1]);
                                        const { data } = await decodeToken(splitted[1]);
                                        console.log(data, 'this is resp')
                                            const res = await socialLogin({
                                                email: data.email, name: data.name, token: 'tok'
                                            });
                                            console.log(res, 'fbsl resp')
                                            if(res.success) {
                                                navigation.navigate('HomeStack');
                                                navigation.navigate("ProfileScreen");
                                                toast('success', 'Login Successfull')
                                            }
                                        }
                                    }}
                                    source={{ uri: 'https://thefamilyshop.in/api/hooks/user/auth/google' }} />
                            </Modal>
        </ScrollView>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})


export default connect(
    mapStateToProps, {
        login, toast, socialLogin, decodeToken
    }
) (Login)

