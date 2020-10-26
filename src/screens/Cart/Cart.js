import React, { useState, useCallback  } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions,Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../../assets/Colors';
const { height, width } = Dimensions.get('window');
import {getUser} from '../../actions/authHandler';
import {getCart, add_to_cart, remove_from_cart, remove_promocode, remove_item_from_cart, fetch_shipping_data} from '../../actions/cart';
import { loadUser,updateUser } from '../../actions/auth';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import {toast} from '../../actions/toast';
import PromocodeModal from '../../components/PromocodeModal';
import Icon from "react-native-vector-icons/FontAwesome";

const Cart = ({getCart, add_to_cart, remove_from_cart, toast, navigation, remove_promocode, remove_item_from_cart, loadUser, updateUser, fetch_shipping_data}) => {
    const [carts, setCart] = useState(null)
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [promocodeModal, setPromocodeModal] = useState(false);
    const [ payment, setPayment ] = useState(false);
    const [shipping, setShippingCharge] = useState(null);
    useFocusEffect(
      useCallback(() => {
          fetchData();
      }, [])
  )


  async function fetchData() {
    const user = await getUser();
    if(user && user.token) {
    const resp = await loadUser({ user_id: user._id });
    updateUser({ ...resp, token: user.token })
      setLoggedInUser(user);
      const response = await getCart({cart_id: resp.cart_id});
      // console.log(response, 'cart resp', resp)
      const fetchShippingData = await fetch_shipping_data();
      if(fetchShippingData.success) {
        setShippingCharge(fetchShippingData.data.length > 0 ? fetchShippingData.data[0] : null);
      }
      if(response) {
        // delete response.products
        console.log(response, 'cart dats')
        setCart(response);
        setLoading(false);
      } else {
        setLoading(false);
        toast('err', 'Please add items to see your cart')
      }
      
    } else {
      setLoading(false);
      toast('err', 'Please login to see cart')
    }
  }


  const openPayment = (state) => {
    navigation.navigate('PaymentScreen', {
      total_price: carts.discounted_price + carts.shipping_price,
      cart: carts._id, promocode_discount: carts.promo_discount
    });
  }

  const AddToCart = async (product_id, variation_id) => {
    const user = await getUser();
   if(user && user.token) {
    const payload = {
        product_id: product_id,
        variation_id: variation_id,
        quantity: 1
    }
    if(user.cart_id) {
        payload.cart_id = user.cart_id;
    }
    const response = await add_to_cart(payload);
    if(response.success) {
      setCart(response.data);
    } else {
      toast('err',response.data)
    }
    
   } else {
    toast('err', 'Please login to add to cart!')
   }

}



const RemoveFromCart = async (product_id, variation_id, isGreaterThan1) => {
  const user = await getUser();
   if(user && user.token) {
     if(isGreaterThan1) {
      const payload = {
        product_id: product_id,
        variant_id: variation_id,
        by_quantity: true
    }
    if(user.cart_id) {
        payload.cart_id = user.cart_id;
    }
    const response = await remove_from_cart(payload);
    setCart(response);
     }
   } else {
    toast('err', 'Please login to add to cart!')
   }
}

const RedirectToCheckout = () => {
  navigation.navigate('CheckoutScreen')
}

const reload = () => {
  fetchData();
  setPromocodeModal(false)
}

const RemovePromocode = async () => {
  const response = await remove_promocode({_id: carts._id});
  fetchData();
}

const showPrice = (available_data, id, quantity) => {
  const variation = available_data.find(v => v._id == id);
  if(variation) {
    return (variation.discounted_rate * quantity).toFixed(2);
  }
}

const RemoveItem = async (payload) => {
  const removeData = await remove_item_from_cart(payload);
  if(removeData.success) {
    toast('success', 'Item removed from cart!')
    fetchData()
  } else {
    toast('err', removeData.data);
  }
}

const ContinueShopping = () => {
  navigation.navigate('HomeScreen')
}

const ShowShippingChargeNote  = () => {
  if(carts.discounted_price < shipping.kms) {
    return (
      <View style={{marginHorizontal:10}}>
        <Text>
          <Text style={{fontWeight:'bold'}}>Note:</Text> If total amount is less than Rs. {shipping.rate}, shipping charge will be added.
          </Text>
      </View>
    )
  }
}

    return (
      <>
      {loading && (
      <Loader />
        )}
        {!loading && carts && (
        <View style={{minHeight:height, backgroundColor: 'white'}}>
          <View style={{backgroundColor:'white', padding: 10, flexDirection:'row',flex:0.04}}>
              <Text style={{flex:1}}>
                Your Cart
              </Text>
              <View style={{flex:1, justifyContent:'flex-end', alignItems:'flex-end', alignContent:'flex-end'}}>
                <Text>
                {carts.total_quantity} Item
                </Text>
              </View>
          </View>
            <ScrollView style={{flex:1}}>
            {carts.products && (
                carts.products.map(product => (
                    product.exist && (
                      <View key={product._id}>
                      <View style={{backgroundColor:'white', flexDirection:'row',padding: 20, elevation: 4}}>
                        <View style={{flex:1}}>
                            <Image 
                                style={{height:100, width:100}} 
                                source={{uri: product.product.images[0].url}} 
                            />
                        </View>
            
                        <View style={{flex:2,}}>
                            
                            
                            <View style={{flexDirection:'row'}}>
                              <View style={{flex:3}}>
                              <Text>
                                {product.product.name}
                            </Text>
                              </View>

                              <TouchableOpacity onPress={()=>RemoveItem({product_id: product._id, cart_id:carts._id, by_quantity: false, variant_id: product.variation_id})} style={{flex:0.7, alignItems:'flex-end'}}>
                              <Icon name="trash" size={23} color="red" />
                              </TouchableOpacity>
                            </View>
                           
                              
                            
                            
                            <View style={{flexDirection:'row',flex:1}}>
                                <View style={{flex:1}}>
                                <Text>
                                {product.product.available_in[0].variation} {product.product.available_in[0].variation_type}
                                </Text>
                                <Text style={{marginTop: 50}}>
                                    Rs. {showPrice(product.product.available_in, product.variation_id, product.quantity)}
                                </Text>
                                </View>


                                <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end'}}>
                            <TouchableOpacity onPress={() => RemoveFromCart(product.product_id, product.variation_id, (product.quantity) >1 ? true : false)} style={{flex:0.7,backgroundColor: colors.purple,justifyContent:'center', 
                                    alignItems:'center', 
                                    alignContent:'center', elevation:6, padding:3, borderRadius: 25}}>
                                <Text>
                                    -
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex:0.9,justifyContent:'center', 
                                    alignItems:'center', 
                                    alignContent:'center'}}>
                                <Text>
                                    {product.quantity}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => AddToCart(product.product_id, product.variation_id)} style={{flex:0.7,backgroundColor: colors.purple,justifyContent:'center', 
                                    alignItems:'center', 
                                    alignContent:'center', elevation:6, padding:3, borderRadius: 25}}>
                                <Text>
                                    +
                                </Text>
                            </TouchableOpacity>
                        </View>
                            </View>
                            
                        </View>
                        
                       
                      </View>
                     </View>
                    )
                ))  
            )}
         </ScrollView>
          <View style={{    backgroundColor: colors.white,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        elevation: 4,
        width: width,
        padding:4,
        position:'relative',
        flex:0.45
    }}>
      <ScrollView>

        {ShowShippingChargeNote()}
          <View style={{flexDirection:'row', marginTop:20,marginHorizontal:10, marginBottom:5}}>
                <View style={{flex:1}}>
                    <Text>
                        Item total
                    </Text>
                </View>
                <View style={{flex:1, justifyContent:'flex-end', alignContent:'flex-end',alignItems:'flex-end'}}>
                    <Text>
                    Rs. {(carts.discounted_price).toFixed(2)}
                    </Text>
                </View>
            </View>
      <View style={{flexDirection: 'row',marginTop:10}}>
                                      <View style={{flex: 1}}>
                                      </View>
                                    </View>
                                    <View style={{flexDirection:'row'}}>

                                        <TouchableOpacity onPress={() => RedirectToCheckout()} style={{flex:1, backgroundColor: colors.purple_text, justifyContent:'center',alignItems:'center',alignContent:'center',padding:10, marginHorizontal: 10, }}>
                                            <Text>
                                               Buy
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => ContinueShopping()} style={{flex:1, backgroundColor: colors.purple_text, justifyContent:'center',alignItems:'center',alignContent:'center',padding:10,marginHorizontal: 10, }}>
                                        <Text>
                                                Continue shopping
                                            </Text>
                                        </TouchableOpacity> 
                                    </View>
                                    </ScrollView>
                            </View>
    
          <Modal visible={promocodeModal} transparent={false} animationType={'slide'}>
          <View style={{flexDirection:'row', paddingHorizontal:30}} onRequestClose={()=>{setPromocodeModal(false)}}>
                    <View style={{flex:2}}>
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize: 20,marginTop: 50, fontWeight: 'bold'}}>
                                Apply Promocode
                            </Text>
                        </View>
                        </View>
                        <TouchableOpacity onPress={()=>{setPromocodeModal(false)}} style={{justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end', marginTop:20}}>
                        <Icon name="times" size={25} style={{ fontWeight: 'bold' }} color={'black'} />
                        </TouchableOpacity>
                        
                        
                    </View>
              <PromocodeModal total_price={carts.discounted_price} cart_id={carts._id} reloadData={reload}  />
          </Modal>
       
        </View>
         )}
         </>
    )
}


const mapStateToProps = state => ({
})

export default connect(
  mapStateToProps, {
     getCart, add_to_cart, remove_from_cart, toast, remove_promocode, remove_item_from_cart, loadUser, updateUser, fetch_shipping_data
  }
) (Cart) 

