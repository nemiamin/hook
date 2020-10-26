import React, { Fragment } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
const { height, width } = Dimensions.get('window');
import { reset } from '../actions/toast';
import colors from '../../assets/Colors';

const Alert = ({ toasts, reset }) => {
    console.log(toasts, 'toasts')
    return (
       <Fragment>
        {toasts && (
            toasts.length > 0 && (
                toasts.map(toast => (
                    <TouchableOpacity key={toast.id} style={{ backgroundColor: toast.type !== 'err' ? colors.alert : colors.red, paddingVertical: 10, paddingHorizontal: 10, position: 'absolute', top: height * 0.9, width: width * 0.9, marginHorizontal: 15, alignItems: 'center' }} onPress={() => {
                        reset(toast.id)
                        console.log(toast.login, 'islogin')
                        if(toast.login) {
                            toast.navigation.navigate('AuthStack')
                        }
                    } }>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                          {toast.msg}
                          {/* Dharmik */}
                        </Text>
                      </TouchableOpacity>  
                ))
            )
        )}
       </Fragment>
    )
}
       

const mapStateToProps = state => ({
    toasts: state.toast
})

export default connect(
    mapStateToProps, {
        reset
    }
) (Alert)

