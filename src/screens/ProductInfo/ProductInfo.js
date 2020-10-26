import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Picker } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {fetchSingleProduct, addWishlist, fetch_similar_product} from '../../actions/product';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import Slider from '../../components/Slider';
import { add_to_cart } from '../../actions/cart';
import { loadUser } from '../../actions/auth';
import {getUser, storeUser, clearUser} from '../../actions/authHandler';
import { toast } from '../../actions/toast';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from '../../../assets/Colors';
import ReviewCard from '../../components/ReviewCard';
import HTMLView from 'react-native-htmlview';
// import MyWebView from 'react-native-webview-autoheight';

const ProductInfo = ({fetchSingleProduct, category, route, add_to_cart, loadUser, toast, navigation, addWishlist, fetch_similar_product}) => {
    const [productInfo, setProduct] = useState(null)
    const [variation, setVariation] = useState(null);
    const [products, setProducts] = useState(null)
    const [PickerValueHolder, setPickervalue] = useState('')
    const [loading, setLoading] = useState(true)
    const [ wishlist, setWishlist ] = useState([]);
    const [similar_products, setSimilarProducts] = useState([]);
    const [user, setUser] = useState(null)
    const [reviews, setReviews] = useState([])
    useFocusEffect(
        useCallback(() => {
            (async() => {
                const user = await getUser();
                console.log(user,'user')
                setUser(user);
                setWishlist(user.wishlist)
            })()
            fetchData(null);
        }, [])
    )

    async function fetchData(id) {
        const response = await fetchSingleProduct({product_id: id ? id : route.params.product_id});
        console.log(response, 'produc tresponse')
        const similarProductData = await fetch_similar_product({product_id: id ? id : route.params.product_id})
        if(response || similarProductData) {
            console.log(response[0], 'product info')
            setProduct(response[0]);
            setVariation(response[0].available_in[0])
            setProducts(response[0])
            setSimilarProducts(similarProductData.data)
            if(response[0].reviews) {
                setReviews(response[0].reviews);
            }
            setLoading(false);
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

    const AddToCart = async (shopNow) => {
        const user = await getUser();
       if(user && user.token) {
        const payload = {
            product_id: productInfo._id,
            variation_id: variation._id,
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
            console.log({...userData, token: user.token}, 'local updated from manage product info.js 1')   
            const userStored = await storeUser({...userData, token: user.token});
            toast('success','Product added to cart');
            if(shopNow) {
                navigation.navigate('CartScreen')
            }
        } else {
            toast('err',response.data)
        }
        
       } else {
        toast('err', 'Please login to add to cart!', true, navigation)
       }

    }

    const onChnageVariation = (id) => {
       const variationData = productInfo.available_in.find(v => v._id == id);
       if(variationData) {
        setVariation(variationData);
       }
    }

    const addToWishlist = async (id) => {
        const user = await getUser();
        if(user && user.token) {
            const response = await addWishlist({product_id: id});
            console.log({...response, token: user.token}, 'local updated from manage product info.js 2')   

            const resp = await storeUser({...response, token: user.token});
            setWishlist(resp.wishlist)
            const r = checkWishlist(productInfo._id);
            toast('success', r ? 'Removed from wishlist' : 'Added to wishlist!')
        } else {
            toast('err', 'Please login to add to wishlist!')
        }
    }
    
    const reloadInfo = (id) => {
        fetchData(id);
    }

    const ActualPrice = () => {
        if(variation && variation.discount_percentage > 0) {
            return (
                <Text style={{ fontSize: 15, textDecorationLine: 'line-through', color: 'silver' }}>
                MRP {'  '} {variation.rate}
                </Text>
            )
        }
    }

    const reload = () => {
        fetchData();
    }

    return (
        <>
        {loading && (
        <Loader />
          )}
          {!loading && (
        <View style={{flexDirection:'column', flex:1}}>
            <ScrollView style={{flex:3}}>
         <View style={{paddingHorizontal:20, paddingVertical:30}}>
             <Text style={{fontSize:18, fontWeight:'bold'}}>
                 {productInfo.name}, {variation.variation}{variation.variation_type}
             </Text>
         </View>
         <View style={{flexDirection:'row',paddingHorizontal:20}}>
            <View style={{flex:2}}>
            {ActualPrice()}
                <Text>
                    Our Price {variation.discounted_rate.toFixed(2)}
                </Text>
                <Text style={{color: variation.stock > 0 ? 'green' : 'red'}}>
                {variation.stock !== 0 ? 'Available' : 'Out Of Stock' }
                </Text>
            </View>
            <TouchableOpacity onPress={() => addToWishlist(productInfo._id)} style={{flex:1, justifyContent:'center', alignContent:'center', alignItems:'flex-end', }}>
                <Icon name="heart" size={22} color={checkWishlist(productInfo._id) ? colors.purple_text : colors.bac_black} />
            </TouchableOpacity>
         </View>
         <View style={{flex:1, paddingVertical:20}}>
            <Slider products={products} full={false} inInfo={true} />
        </View>
        <View style={{paddingHorizontal:20, paddingVertical:10}}>
            <Text style={{fontSize:18,fontWeight:'bold'}}>
                Pack Size
            </Text>

           <View style={{borderColor:'lightgrey', borderWidth:1, marginVertical:10}}>
                <Picker
                    selectedValue={variation._id}
        
                    onValueChange={(itemValue, itemIndex) => onChnageVariation(itemValue)} >
                    { productInfo.available_in && productInfo.available_in.length > 0 && productInfo.available_in.map((item, key)=>(
                       <Picker.Item label={item.discount_percentage > 0 ? item.variation +' '+item.variation_type+ ' - '+ item.discount_percentage+'% OFF' : item.variation +' '+item.variation_type} value={item._id} key={item._id} />
            )
            )}
                </Picker>
           </View>

           <Text style={{fontSize:18, marginVertical:10,fontWeight:'bold'}}>
               Description
           </Text>
                <HTMLView
                    value={productInfo.description}
                />
           

           <Text style={{fontSize:18, marginVertical:10,fontWeight:'bold'}}>
               Similar Products
           </Text>
            <View style={{flex:1, paddingVertical:10}}>
                <Slider products={similar_products} full={true} isSimilar={true} navigation={navigation} reloadInfo={reloadInfo} />
            </View>

            <Text style={{fontSize:18, marginVertical:10,fontWeight:'bold'}}>
               Reviews
            </Text>
            <ReviewCard reviews={reviews} product_id={productInfo._id} reload={reload} isDelete={user.is_admin ? true : false} />
           
        </View>
        
        </ScrollView>
        <View style={{flex:0.06, backgroundColor: colors.purple,flexDirection:'row', paddingHorizontal:20}}>
            <View style={{flex:1,justifyContent:'center', alignContent:'center', alignItems:'center', borderRightWidth:1, borderColor:'black'}}>
            <TouchableOpacity onPress={() => {AddToCart(null)}}>
                <Text>
                    Add To Cart
                </Text>
            </TouchableOpacity>
            </View>
            <View style={{flex:1, justifyContent:'center', alignContent:'center', alignItems:'center'}}>
            <TouchableOpacity onPress={() => {AddToCart(true)}}>
                <Text>
                    Shop Now
                </Text>
            </TouchableOpacity>
            </View>
            </View>
        </View>
          )}
          </>
    )
}

const mapStateToProps = state => ({
    category: state.category
})

export default connect(
    mapStateToProps, {
        fetchSingleProduct, add_to_cart, loadUser, toast, addWishlist, fetch_similar_product
    }
) (ProductInfo) 

