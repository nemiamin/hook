import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
const { height, width } = Dimensions.get('window');

const Grid = ({ products, number, showViewAll, navigate }) => {
  // console.log(products, 'products')
  const [catgoryRow, setCategoryRows] = useState([])
 






    return (
        <View space="between" style={styles.categories}>
          {catgoryRow}
            {products.map((product, index) => (
              <View key={Math.random().toString()}>
              { index != (products.length - 1) || !showViewAll ? (<TouchableOpacity
                key={product._id}
                onPress={() => navigate(product._id)}
              >
                <View style={{minWidth: (width - 1 * 2.1 - 16) / number,
                maxWidth: (width - 1 * 2.4 - 16) / number,
                maxHeight: (width - 1 * 2.4 - 16) / number,
                borderRadius: 6,
               marginVertical:4
                }}>
                  <ImageBackground resizeMode={'cover'} style={{ width: '100%',justifyContent:'flex-end',
                        height: undefined,
                        aspectRatio: 1,
                    }} source={{uri: product.image}} >
                  <View style={{justifyContent: 'center',backgroundColor:'rgba(211,211,211,0.7)',paddingVertical:4,
                
                alignItems:'center', }}>
                    <Text style={{fontWeight:'bold'}}>
                    {product.name}
                    </Text>
                  </View>
                  </ImageBackground>
                 
                </View>
              </TouchableOpacity> ) : (
                <TouchableOpacity key={'random'} style={{minWidth: (width - 1 * 2.4 - 16) / number,
                  maxWidth: (width - 1 * 2.4 - 16) / number,
                  maxHeight: (width - 1 * 2.4 - 16) / number,
                  borderRadius: 6,
                  
                  }}>
                <View style={{backgroundColor:'lightgrey', width:'100%', height:'100%', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                <Text>
View All
                </Text>
                </View>
                </TouchableOpacity>
              ) }
              </View> 
            ))}
          </View>
    )
}
       

const mapStateToProps = state => ({
    toasts: state.toast
})

export default connect(
    mapStateToProps, {
    }
) (Grid)

const styles = StyleSheet.create({
    itemText:{
        
    },
    categories: {
        flexWrap: "wrap",
        marginBottom: 5 * 3.5,
        flexDirection: "row",
        justifyContent: 'space-between',
      },
      category: {
        
      }
})