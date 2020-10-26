import React from 'react';
import { View, TouchableOpacity, Text, ImageBackground, Dimensions } from 'react-native'

// const { height, width } = Dimensions.get('window');
const HomeGrid = ({ category, screen, param, navigation, height }) => {
    return (
     <TouchableOpacity onPress={() => navigation.navigate(screen, param)} style={{ flex: 1, backgroundColor: 'white', elevation: 4, marginHorizontal: 3, marginVertical: 4 }}>
         <ImageBackground source={{ uri: category.image }} style={{ height: height, width: undefined, justifyContent: 'flex-end' }}>
             
         </ImageBackground>
         <View style={{ borderWidth: 1, borderColor: 'lightgrey', marginTop: 5, marginBottom: 5 }}></View>
         <View style={{ alignItems: 'center', paddingVertical: 3, paddingHorizontal: 6, justifyContent: 'center' }}>
                 <Text style={{ fontWeight: 'bold', paddingBottom:5 }}>
                    {category.name}
                 </Text>
             </View>
     </TouchableOpacity>
    )
}

HomeGrid.propTypes = {

}

export default HomeGrid

