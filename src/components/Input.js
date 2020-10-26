import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import colors from '../../assets/Colors';
const { width } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';

const Input = ({ placeholder,multiline,numberOfLines, secure, changeInput, name, value, keyboard_type, disable, logo, toggle }) => {
    return (
        <>
        {logo ? (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <TextInput keyboardType={keyboard_type ? keyboard_type : 'default'} name={name} value={value} onChangeText={(e) => changeInput(name, e)} placeholder={placeholder} style={{...styles.inputStyle, width: width * 0.65}} secureTextEntry={secure} editable={disable ? false : true}  />
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingHorizontal: 10 }} onPress={toggle}>
                <Icon name='eye' color={colors.purple_text} size={20} />
                </TouchableOpacity>
            </View>
        ) : (
             <TextInput multiline={multiline ? multiline : false} keyboardType={keyboard_type ? keyboard_type : 'default'} name={name} value={value} onChangeText={(e) => changeInput(name, e)} numberOfLines={numberOfLines?numberOfLines:1} placeholder={placeholder} style={styles.inputStyle} secureTextEntry={secure} editable={disable ? false : true}  />
        )}
        </>
      
    )
}


const styles = StyleSheet.create({
    inputStyle: {
        borderBottomWidth: 0.6,
        borderBottomColor: colors.purple_text,
        paddingHorizontal: 10,
        color: colors.purple_text,
        marginVertical: 15,
        fontSize: 16,
        marginTop:30
    }
})

export default Input

