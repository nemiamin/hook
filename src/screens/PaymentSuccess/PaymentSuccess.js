import React, { useCallback } from 'react';
import { View, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const PaymentSuccess = ({ navigation}) => {
  useFocusEffect(
    useCallback(() => {
        setTimeout(() => {
          navigation.navigate('HomeScreen')
        }, 2000)
    }, [])
)

    return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center', alignContent:'center'}}>
          <Image source={{uri: 'https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-size_restricted.gif'}}
            style={{height:100, width:100}}
          />
          <Text style={{fontWeight:'bold', marginTop:10, fontSize:18}}>
              Order Placed Successfully!
          </Text>
        </View>
  

    )
}

const mapStateToProps = state => ({
    
})

export default connect(
    mapStateToProps, {
        
    }
) (PaymentSuccess) 

