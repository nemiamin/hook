import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Picker } from 'react-native';
import colors from '../../assets/Colors';
const { height, width } = Dimensions.get('window');
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from 'react-redux';
import {add_to_cart} from '../actions/cart';
import {addWishlist} from '../actions/product';
import {getUser, storeUser,clearUser} from '../actions/authHandler';
import { toast } from '../actions/toast';
import { loadUser, updateUser } from '../actions/auth';

const List = ({data, add_to_cart, navigation, addWishlist, toast, is_wishlist, reloadList, loadUser, updateUser , isSimilar, reloadProductInfo}) => {
    const [PickerValueHolder, setPickervalue] = useState('')
    const [rate, setCost] = useState(0)
    const [discounted_rate, setDiscountedRate] = useState(0);
    const [ wishlist, setWishlist ] = useState([]);
    const [ productName, setProductName ] = useState(null);

useEffect(() => {
    setPickervalue(data.available_in[0]._id)
    setProductName(data.name+', '+data.available_in[0].variation+data.available_in[0].variation_type)
    setCost((data.available_in[0].rate).toFixed(2))
    setDiscountedRate((data.available_in[0].discounted_rate).toFixed(2));
    (async() => {
        const user = await getUser();
        setWishlist(user.wishlist)
    })()
    
    let i = 0;
}, [])
const onChnageVariation = (id) => {
    setPickervalue(id)
    const variation = data.available_in.find(v => v._id == id);
    setProductName(data.name+', '+variation.variation+variation.variation_type)
    setCost(variation.rate)
    setDiscountedRate(variation.discounted_rate)
}
    const addToCart = async() => {
        const user = await getUser();
        if(user && user.token) {
            const payload = {
                product_id: data._id,
                variation_id: PickerValueHolder,
                quantity: 1
            }
            if(user.cart_id) {
                payload.cart_id = user.cart_id;
            }
            const response = await add_to_cart(payload);
            if(response.success) {
                const userData = await loadUser({user_id: user._id});
                if(!userData.success) {
                    // clearUser();
                    return
                }
                updateUser(userData);
                console.log({...userData, token: user.token}, 'local updated from list.js')
                await storeUser({...userData, token: user.token});
                toast('success','Product added to cart')
            } else {
                    toast('err', response.data)
            }
        } else {
            toast('err', 'Please login to add to cart!', true, navigation)
        }
    }

    const addToWishlist = async (id) => {
        const user = await getUser();
        
        if(user && user.token) {
            const response = await addWishlist({product_id: id});
            // console.log(response, 'fires the wishlist')
            if(!response) {
                // clearUser();
                return
            }
            console.log({...response, token: user.token}, 'local updated from list.js 2')
            const resp = await storeUser({...response, token: user.token});
            if(is_wishlist) {
                reloadList();
            }
            setWishlist(resp.wishlist)
            toast('success', checkWishlist(data._id) ? 'Removed from wishlist' : 'Added to wishlist!')
        } else {
            toast('err', 'Please login to add to wishlist!', true, navigation)
        }
    }

    const checkWishlist = (_id) => {
        if(wishlist && wishlist.length > 0) {
            const exist = wishlist.find(id => id.product_id === _id);
            return exist;
        } else {
            return false;
        }
    }

    const redirectProductInfo = () => {
        if(isSimilar) {
            reloadProductInfo(data._id)
        } else {
            navigation.navigate('ProductInfoScren', {product_id: data._id})   
        }
    }
    
       return (
    <View style={styles.list}>
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={redirectProductInfo}>
            <ImageBackground style={{ height: height * 0.15, width: width * 0.25 }} source={{uri: data.image_urls ? data.image_urls[0] : data.images[0].url}}>

            </ImageBackground>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ flex: 2, marginLeft: isSimilar ? 0 : 13, paddingRight: isSimilar ? width*0.1 : 0 }}>
            <View style={{ flex: 1.2, flexDirection: 'row' }}>
                <TouchableOpacity onPress={redirectProductInfo} style={{ flex: 1, justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: colors.heading }}>
                {data ? productName : 'Nemi'}
            </Text>
                </TouchableOpacity>
                <View style={{ flex: 0.2, justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => addToWishlist(data._id)}>
                <Icon name="heart" size={22} color={checkWishlist(data._id) ? colors.purple_text : colors.bac_black} />
                </TouchableOpacity>
                </View>
            
            </View>
            <View style={{ flex: 1, justifyContent: 'center', borderWidth: 0.4, marginBottom: 8, borderColor: colors.silver }}>
            <Picker
            selectedValue={PickerValueHolder}
 
            onValueChange={(itemValue, itemIndex) => onChnageVariation(itemValue)} >
 
            { data.available_in && data.available_in.length > 0 && data.available_in.map((item, key)=>(
            <Picker.Item label={item.discount_percentage > 0 ? item.variation +' '+item.variation_type+ ' - '+ item.discount_percentage+'% OFF' : item.variation +' '+item.variation_type} value={item._id} value={item._id} key={item._id} />)
            )}
    
          </Picker>
            </View>
           
             
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 3 }}>
                <Text style={{ fontSize: colors.content, textDecorationLine: 'line-through', color: colors.silver }}>
                MRP: {'  '} {rate}
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: colors.content }}>
                Rs {'  '} {discounted_rate}
            </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity  onPress={addToCart} style={{ backgroundColor: 'lightgreen', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6 }}>
                        <Text>
                            ADD
                        </Text>
                    </TouchableOpacity>
                </View>
           
      
            </View>
          
          </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: colors.silver,
        marginTop:20
    }
})

const mapStateToProps = (state) => ({
    
})

export default connect(
    mapStateToProps, {
      add_to_cart, addWishlist, toast, loadUser, updateUser
    }
) (List)

