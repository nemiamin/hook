import React, { useState, useCallback  } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Modal, CheckBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../../assets/Colors';
const { height, width } = Dimensions.get('window');
import {getUser, storeUser} from '../../actions/authHandler';
import {getCart, add_to_cart, remove_from_cart, remove_promocode, send_gift, setDetail,fetch_shipping_data, cod_pay} from '../../actions/cart';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import {toast} from '../../actions/toast'
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from 'react-native-vector-icons/EvilIcons'
import PromocodeModal from '../../components/PromocodeModal';
import ManageAddress from '../../components/ManageAddress';
import Input from '../../components/Input';
import { loadUser, updateUser } from '../../actions/auth';
import Pay from '../../components/Pay';

const Checkout = ({getCart, add_to_cart, remove_promocode, toast, navigation, send_gift, setDetail,fetch_shipping_data, cod_pay, updateUser, loadUser}) => {
    const [carts, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [promocodeModal, setPromocodeModal] = useState(false);
    const [user, setUser] = useState(null);
    const [addressModal, setAddressModal] = useState(false);
    const [useraddress, setUserAddress] = useState(null);
    const [isSelected, setSelection] = useState(false);
    const [phone, setUserPhone] = useState(null)
    const [isGift, setGift] = useState(false)
    const [ cod, setCod ] = useState(false);
    const [shipping, setShippingCharge] = useState(null);
    const [ note, setNote ] = useState('');
    const [ payModel, setPayModel ] = useState(false);

    useFocusEffect(
      useCallback(() => {
          fetchData();
      }, [])
  )

  async function fetchData() {
    const user = await getUser();
    if(user && user.token) {
      setUser(user);
      if(user && user.address.length > 0) {
        setUserAddress(user.address[0]);
      }
      setUserPhone(user.phone)
      const response = await getCart({cart_id: user.cart_id});
      const fetchShippingData = await fetch_shipping_data();
      console.log(fetchShippingData, 'shippng data')
      if(fetchShippingData.success) {
        setShippingCharge(fetchShippingData.data.length > 0 ? fetchShippingData.data[0] : null);
      }
      if(response) {
        console.log(response, 'cart detail')
        setCart(response);
        setGift(response.gift)
        setSelection(response.gift)
        setLoading(false);
      } else {
        setLoading(false);
        toast('err', 'Invalid request')
      }
    } else {
      setLoading(false);
      toast('err', 'Please login to see cart')
    }
  }

  const showPrice = (available_data, id, quantity) => {
    const variation = available_data.find(v => v._id == id);
    if(variation) {
      return (variation.discounted_rate * quantity).toFixed(2);
    }
  }

  const asCod = () => {
    setCod(!cod)
  }

  const reload = () => {
    fetchData();
    setPromocodeModal(false)
  }

  const RemovePromocode = async () => {
    const response = await remove_promocode({_id: carts._id});
    fetchData();
  }

  const addressSet = (address,phone) => {
    setAddressModal(false)
    setUserPhone(phone)
    setUserAddress(address);
  }

  const SendGift = async (val) => {
    setSelection(!isSelected)
    const response = await send_gift({_id: carts._id})
    if(response.success) {
      setGift(response.data.gift);
    } else {
      toast('err', response.data);
    }
  }


  const Promocode = () => {
    if(carts.promo_code && carts.promo_discount > 0) {
      return (
        <TouchableOpacity style={{backgroundColor: colors.purple, marginHorizontal:10, marginVertical:10, padding:10, borderRadius:10}}>
        <View>
          <Text style={{fontSize:18, fontWeight:'bold'}}>
           Promocode Applied
          </Text>
        </View>

       <View style={{flexDirection:'row'}}>
       <View style={{marginTop:10, flex:1}}>
          <Text style={{fontSize:16}}>
            {carts.promo_code}
          </Text>
        </View>
        <TouchableOpacity onPress={() => RemovePromocode()} style={{flex:1, justifyContent:'center', alignItems:'flex-end', marginRight:10, marginTop:10}}>
        <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>

        
       </View>
       <View style={{marginTop:10}}>
          <Text>
            Promocode Discount: Rs. {(carts.promo_discount).toFixed(2)}
          </Text>
        </View>

      </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => setPromocodeModal(true)} style={{backgroundColor: colors.purple, marginHorizontal:10, marginVertical:10, padding:10, borderRadius:10, flexDirection:'row'}}>
        <View style={{flex:3}}>
          <Text style={{fontSize:18, fontWeight:'bold'}}>
           Apply Promocode
          </Text>
        </View>

        <View style={{flex:1, alignItems:'flex-end', marginRight:10}}>
          <Text>
            {"=>>"}
          </Text>
        </View>

      </TouchableOpacity>
      )
    }
  }

  const openPayment = async (online) => {
    console.log(online, 'gets called')
    if(useraddress && phone) {
      const response = await setDetail({address: useraddress.address, phone: phone, _id: carts._id, note})
   
      if(response.success){
        setPayModel(false)
        if(!online) {
          console.log('cod api called')
            const makeCodPayment = await cod_pay({cart_id: carts._id});
            console.log(makeCodPayment, 'cod pay')
            if(makeCodPayment.success) {
              const user = await loadUser({user_id: makeCodPayment.data.user_id});
              if(user.success) {
                const loggedUser = await getUser();
                if(loggedUser && loggedUser.token) {
                    const stored = await storeUser({...user, token: loggedUser.token});
                    const update = await updateUser({...user, token: loggedUser.token})
                    navigation.navigate('PaymentSuccess');
                }
              }
            }
        }
        else {
          navigation.navigate('PaymentScreen', {
            total_price: isGift ? carts.discounted_price + carts.shipping_price + 10 : carts.discounted_price + carts.shipping_price ,
            cart: carts._id, promocode_discount: carts.promo_discount
          });
        }
       
      } else {
        toast('err', response.data)
      }
    } else {
      toast('err', 'Please select delivery address & phone')
    }
  }

  const loadNote = (name, e) => {
    setNote(e);
    // console.log(e, 'e')
  }

  const giftDiscount = () => {
    if(isGift) {
      return (
        <View style={{flexDirection:'row', marginBottom:10}}>
      <View style={{flex:1}}>
                    <Text>
                        Gift Wrap charges
                    </Text>
                </View>
                <View style={{flex:1, justifyContent:'flex-end', alignContent:'flex-end',alignItems:'flex-end'}}>
                    <Text>
                    Rs. 10
                    </Text>
                </View>
      </View>
      )
    } else {}
      return (
        <View>

        </View>
      )
      
  }

  const ShowShippingChargeNote  = () => {
    if(carts.shipping_price > 0) {
      return (
        <View style={{marginHorizontal:10}}>
          <Text>
            <Text style={{fontWeight:'bold'}}>Note:</Text> If Item total is less than Rs. {shipping.rate}, shipping charge will be added.
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
          <View style={{ flex: 1 }}>
          <ScrollView style={{ height: height * 0.3 }}>
            <View style={{ flex: 1 }}>
            <View style={{backgroundColor: colors.purple, marginHorizontal:10, marginVertical:10, padding:10, borderRadius:10}}>
                <View>
                  <Text style={{fontSize:18, fontWeight:'bold'}}>
                    Your Cart
                  </Text>
                </View>
                <View style={{marginTop:20}}>
              {carts.products && (
                carts.products.map(product => (
                    product.exist && (
<View key={product._id} style={{flexDirection:'row'}}>
  <View style={{flex:2}}>
    <Text style={{fontSize:16}}>
      {product.product.name}
    </Text>
    </View>
    <View style={{flex:1, alignItems:'flex-end'}}>
      <Text>
        Qty: {product.quantity}
      </Text>
      </View>
    <View style={{flex:1, alignItems:'flex-end'}}>
      <Text>
      Rs. {showPrice(product.product.available_in, product.variation_id, product.quantity)}
      </Text>
      </View>
  </View>
                    )
                    )))}
              </View>
              </View>

              {/* Promo code modal starts */}
               {Promocode()}
              {/* Promo code modal ends */}
            {/* Billing details starts */}
            <View style={{backgroundColor: colors.purple, marginHorizontal:10, marginVertical:10, padding:10, borderRadius:10}}>
                <View>
                  <Text style={{fontSize:18, fontWeight:'bold'}}>
                   Billing Details
                  </Text>
                </View>
                <View>
                <View style={{flexDirection:'row', marginTop:20,marginBottom:10}}>
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
            <View style={{flexDirection:'row', marginBottom:10}}>
      <View style={{flex:1}}>
                    <Text>
                        Shipping
                    </Text>
                </View>
                <View style={{flex:1, justifyContent:'flex-end', alignContent:'flex-end',alignItems:'flex-end'}}>
                    <Text>
                    Rs. {carts.shipping_price}
                    </Text>
                </View>
      </View>
      <View style={{flexDirection:'row', marginBottom:10}}>
      <View style={{flex:1}}>
                    <Text>
                        Discount
                    </Text>
                </View>
                <View style={{flex:1, justifyContent:'flex-end', alignContent:'flex-end',alignItems:'flex-end'}}>
                    <Text>
                    {carts.promo_discount > 0 ? 'Rs.' + (carts.promo_discount).toFixed(2) : 'Rs. 0'}
                    </Text>
                </View>
      </View>
      {giftDiscount()}
      <View style={{flexDirection:'row', marginBottom:10}}>
      <View style={{flex:1}}>
                    <Text>
                        Grand Total
                    </Text>
                </View>
                <View style={{flex:1, justifyContent:'flex-end', alignContent:'flex-end',alignItems:'flex-end'}}>
                    <Text>
                    Rs. { isGift ? ((carts.discounted_price + carts.shipping_price + 10) - carts.promo_discount).toFixed(2) : ((carts.discounted_price + carts.shipping_price) - carts.promo_discount).toFixed(2) }
                    </Text>
                </View>
      </View>
              </View>
              </View>
            {/* Billing details ends */}
            </View>
            {ShowShippingChargeNote()}
          {isGift ? (
            <View style={{ marginHorizontal: 15 }}>
           <Input name='note' value={note} changeInput={loadNote} placeholder='Gift Note' />
           </View>
          ) : (
            <View style={{ marginVertical: height * 0.07 }}></View>
          )}
           <View style={{ flex: 1 }}>
         
         <View style={{
         backgroundColor: colors.white,
     borderTopRightRadius: 15,
     borderTopLeftRadius: 15,
     elevation: 4,
     width: width,
     padding:10,
     flex: 1
 }}>
                                 <View style={{flexDirection: 'row', flex: 1}}>
                                   <View style={{justifyContent:'center'}}>
                                     <Icons name="location" size={38} color="black" />
                                   </View>
                                   <View style={{flex: 1.5, marginLeft:5}}>
                                   <Text style={{fontWeight:'bold'}}>
                                     Deliver to {(useraddress) ? useraddress.name : 'Address'}
                                     </Text>
                                     <Text style={{}}>
                                     {(useraddress) ? useraddress.address : 'Please select address'}
                                     </Text>
                                   </View>
                                   <TouchableOpacity onPress={() => setAddressModal(true)} style={{flex: 1, alignContent:'flex-end', alignItems:'flex-end'}}>
                                     <Text style={{color: colors.purple_text}}>
                                     {(useraddress) ? 'Change' : 'Select'}
                                     </Text>
                                   </TouchableOpacity>
                                 </View>
                                 <View style={{flexDirection:'row', marginTop: 5,flex: 1.5}}>
                                     <TouchableOpacity style={{ justifyContent: 'center', marginHorizontal: 10, alignItems: 'center' }} onPress={() => SendGift(isSelected)}>
                                       {!isSelected ? (
                                         <Icon name='square-o' size={20} />
                                       ) : (
                                         <Icon name='check-square-o' size={20} color={colors.purple_text} />
                                       )}
                                     </TouchableOpacity>
                                     <View style={{padding:5, justifyContent:'center'}}>
                                     <Text style={{ fontSize: 16 }}>Send as a Gift</Text>
                                     </View>
                             
                                 </View>
                                 <View style={{flexDirection:'row', marginTop: 5,flex: 1}}>
                                     {/* <TouchableOpacity style={{ justifyContent: 'center', marginHorizontal: 10, alignItems: 'center' }} onPress={() => asCod(cod)}>
                                       {!cod ? (
                                         <Icon name='square-o' size={20} />
                                       ) : (
                                         <Icon name='check-square-o' size={20} color={colors.purple_text} />
                                       )}
                                     </TouchableOpacity>
                                     <View style={{padding:5, justifyContent:'center'}}>
                                     <Text style={{ fontSize: 17 }}>C.O.D</Text>
                                     </View>
                                */}
                                 </View>
                                
                                 {/* openPayment */}
                                 <TouchableOpacity onPress={() => {
                                   if(useraddress && phone) {
                                   setPayModel(true)
                                   }
                                   else {
                                     if(!useraddress) {
                                      toast('err', 'Please select delivery  address')
                                     }
                                     if(!phone) {
                                      toast('err', 'Please enter phone')
                                     }
                                   }
                                   }} style={{ backgroundColor: colors.purple, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, marginVertical: 15 }}>
                                     <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                                             PROCEED
                                         </Text>
                                     </TouchableOpacity>
                         </View>
                         <Pay show={payModel} close={() => setPayModel(false)} payment={openPayment} />
                         <Modal visible={promocodeModal} transparent={false} animationType={'slide'} onRequestClose={()=>{setPromocodeModal(false)}}>
       <View style={{flexDirection:'row', paddingHorizontal:30}}>
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
           <PromocodeModal close={() => setPromocodeModal(false)} total_price={carts.discounted_price} cart_id={carts._id} reloadData={reload}  />
       </Modal>
       <Modal visible={addressModal} transparent={false} animationType={'slide'} onRequestClose={()=>{setAddressModal(false)}}>
                 <View style={{flexDirection:'row', paddingHorizontal:30}}>
                 <View style={{flex:2}}>
                     <View style={{justifyContent:'center', alignItems:'center'}}>
                         <Text style={{fontSize: 20,marginTop: 50, fontWeight: 'bold'}}>
                             Manage Address
                         </Text>
                     </View>
                     </View>
                     <TouchableOpacity onPress={()=>{setAddressModal(false)}} style={{justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end', marginTop:20}}>
                     <Icon name="times" size={25} style={{ fontWeight: 'bold' }} color={'black'} />
                     </TouchableOpacity>
                 </View>
                 <ManageAddress chekout={true} setUserAddress={addressSet} />
                
             </Modal>
         </View>
       
          </ScrollView>
          </View>
        )}
         </>
    )
}


const mapStateToProps = state => ({
})

export default connect(
  mapStateToProps, {
     getCart, add_to_cart, remove_promocode, toast, send_gift, setDetail,fetch_shipping_data, cod_pay, updateUser, loadUser
  }
) (Checkout) 

