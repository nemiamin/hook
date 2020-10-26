import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
const { height, width } = Dimensions.get('window');
import Carousel,{ Pagination } from 'react-native-snap-carousel';
import List from './List';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import product from '../reducer/product';
import colors from '../../assets/Colors';

const Slider = ({ products, full, navigation, isSimilar, reloadInfo, inInfo, banner, isBanner }) => {
    const [ prods, setProds ] = useState(0)

    const reloadProductInfo = (id) => {
        reloadInfo(id);
    }
    useEffect(() => {
        {!isBanner && setProds(products.length)}
        console.log(banner, 'these are the banner in slider')
       
    }, [])

    const _renderItem = ({item, index}) => {
        // console.log(item, 'item', index)
        if(full && !isSimilar) {
            return (
                <View style={styles.slide}>
                            <TouchableOpacity style={{flexDirection:'row'}} onPress={() => navigation.navigate('ProductInfoScren', {product_id: item._id})}>
                            <View style={{flex:1}}>
                                <Image style={{height: height*0.25, width: undefined}} source={{uri: item.image_urls[0]}} />
                            </View>
                            <View style={{backgroundColor:'white', alignItems:'center',flex:1, justifyContent:'center'}}>
                                
                                <Text style={{fontWeight:'bold', fontSize:18}}>
                                    Special {item.available_in[0].discount_percentage}% Off
                                 </Text>
                                <Text style={{fontWeight:'bold', fontSize:16}}>
                                    Only on {item.name}
                                </Text>
                                
                                </View>
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', backgroundColor: 'white', flexDirection: 'row', marginVertical: 6 }}>
                             
                                {products && products.length > 0 && products.map(prod => (

                                    item._id === prod._id ? (

   <Icon key={Math.random().toString()} name='checkbox-blank-circle' color={colors.purple_text} size={10} />
                                    ) : (

   <Icon key={Math.random().toString()} name='checkbox-blank-circle-outline' color={colors.purple_text} size={10} />
                                    )
                                ))}
                            </View>
                        </View>
            )
        } else if (isSimilar) {
            return (
                <List isSimilar={isSimilar ? isSimilar : false} key={item._id} data={item} navigation={navigation} reloadProductInfo={reloadProductInfo} />
                )
        } else if(isBanner) {
            console.log(item, 'these are the banner items');
            // return;
            return (
                <View style={styles.slide}>
                            <TouchableOpacity style={{flexDirection:'row'}} onPress={() => navigation.navigate(item.type === 'category' ? 'MainCategoryScreen' : item.type === 'sub-category' ? 'SubCategoryScreen' : 'ProductInfoScren', item.type === 'category' ? { mainCategoryId: item.id } : item.type === 'sub-category' ? { category_id: item.id } : { product_id: item.id } )}>
                            <View style={{flex:1}}>
                                <Image style={{height: height*0.25, width}} source={{uri: item.image}} />
                            </View>
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', backgroundColor: 'white', flexDirection: 'row', marginVertical: 6 }}>
                             
                                {banner && banner.length > 0 && banner.map(prod => (

                                    item._id === prod._id ? (

   <Icon key={Math.random().toString()} name='checkbox-blank-circle' color={colors.purple_text} size={10} />
                                    ) : (

   <Icon key={Math.random().toString()} name='checkbox-blank-circle-outline' color={colors.purple_text} size={10} />
                                    )
                                ))}
                            </View>
                        </View>
            )
        }
        else {
            console.log(item,'=> product')
            return (
                <Image source={{uri: item}} style={{ height: inInfo ? height * 0.3 : height*0.42, width:'100%'}} />
            )
        }
    }
      

    return (
        <View>
            {isBanner ? (
              <Carousel
              layout={'default'}
              data={banner}
              renderItem={_renderItem}
              sliderWidth={width}
              itemWidth={width}
              autoplay={true}
          />
            ) : (
            <Carousel
            layout={'default'}
            data={full ? products : products.image_urls}
            renderItem={_renderItem}
            sliderWidth={width}
            itemWidth={full ? width : width*0.6}
            autoplay={true}
        />
            )}
        </View>
    )
}
       

const mapStateToProps = state => ({
    toasts: state.toast
})

export default connect(
    mapStateToProps, {
    }
) (Slider)

const styles = StyleSheet.create({
    slide: {
        minHeight: height*0.15,
        backgroundColor: 'white'
    },
    title: {
        height:height*0.35,
        justifyContent:'flex-end'
    },

})