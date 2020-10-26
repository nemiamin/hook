import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../../assets/Colors';

const Loader = ({ isLoading }) => {
    const _renderLoader = 
          <View style={styles.background}>
              
            <Image style={{height:150, width:150}} source={require('../../assets/logo.png')} />
            <Text>Loading...</Text>
          </View>
      
    return (
        _renderLoader
    )
}


const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 100
      }
})

export default Loader

