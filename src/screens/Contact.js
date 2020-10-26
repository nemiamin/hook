import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity, ScrollView } from 'react-native';
import Input from '../components/Input';
import colors from '../../assets/Colors';

const Contact = (props) => {

    const fbLink = () => {
        // alert('clicked')
        // 
        Linking.openURL('https://www.facebook.com/HooK-626004488030755/');
    }

    const instaLink = () => {
        Linking.openURL('https://www.instagram.com/p/CDb267CFvje/?igshid=117k4aubixz1i')
    }

    return (
       <View style={{ backgroundColor: 'white', flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
           <ScrollView>
           <View style={{ paddingVertical: 15, flex: 1 }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                Get in Touch With Us !
            </Text>
            <Text style={{ marginVertical: 10 }}>
            The Surfing House, Lamta Road, Near Chakraborty School Baihar, 481111
            </Text>
            <Text >
            Touch us - 8889888528
            
            
            </Text>
           
           </View>

<View style={{ flex: 0.9, flexDirection: 'row' }}>
        <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={fbLink}>
            <Image source={{
                uri: 'https://www.freepnglogos.com/uploads/facebook-icons/download-facebook-icon-vector-13.png'
            }} style={{ width: 40, height: 60 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={instaLink}>
            <Image source={{
                uri: 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2016/05/instagram-logo-796x404.png'
            }} style={{ width: 50, height: 60 }} />
        </TouchableOpacity>
</View>

<View style={{ flex: 5 }}>
            <Input placeholder='Name' name='name' />
            <Input placeholder='Contact' name='contact' />
            <Input placeholder='Message' name='msg' />
            <TouchableOpacity style={{ 
                paddingVertical: 15, paddingHorizontal: 20, backgroundColor: colors.purple, alignItems: 'center', borderRadius: 10
             }}>
                 <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                Submit
                </Text>
            </TouchableOpacity>
</View>
</ScrollView>
       </View>
    )
}

export default Contact

