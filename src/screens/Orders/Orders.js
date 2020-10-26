import React, { useState, useCallback  } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, Share, ToastAndroid, PermissionsAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { fetch_orders, fetch_timer_config, fetch_order_info, re_order, loadUser, updateUser, add_review , invoice} from '../../actions/auth';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import {toast} from '../../actions/toast';
import {getUser, storeUser} from '../../actions/authHandler';
const { height, width } = Dimensions.get('window');
import { WebView } from 'react-native-webview';
import Icon from "react-native-vector-icons/FontAwesome";
import Input from '../../components/Input';
import { Rating, AirbnbRating } from 'react-native-ratings';
import RNFetchBlob from 'rn-fetch-blob';
// import { FileSystem } from 'expo';
// import * as FileSystem from 'expo-file-system';
// import PDFReader from 'rn-pdf-reader-js'
// import * as WebBrowser from 'expo-web-browser';

// 

const Orders = ({ login, navigation, fetch_orders, fetch_timer_config, fetch_order_info, re_order, loadUser, updateUser, add_review, toast, invoice }) => {
    
    const [ orders, setOrders ] = useState([])
    const [ timer, setTimer ] = useState(null)
    const [ orderInfo, setOrderInfo] = useState({});
    const [orderModal, setOrderModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState({});
    const [ product_id, setProductId ] = useState(null);
    const [ reviewModal, setReviewModal ] = useState(false);
    const [ reviewForm, setReviewForm ] = useState({
      drescription: '',
      _id: '',
      user_id: '',
      rating: 0
  });
  const [ count, setCount ] = useState('')
  const [rating, setRating] = useState(0);
  const [ url, setUrl ] = useState('')
  const [ pdf, setPdf ] = useState(false);
    useFocusEffect(
        useCallback(() => {
          (async() => {
          })()
            fetchData();
        }, [])
    )

    const download = async (_id) => {
      try {
      console.log('get called ?? !!!');
      ToastAndroid.show('Downloading Invoice !', ToastAndroid.SHORT);
      const res = await invoice({ _id });
      console.log(res, 'this is the pdf data')
      if(res.success) {
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob
        .config({
          //In case of android only addAndroidDownloads will be used
          addAndroidDownloads : {
          useDownloadManager : true, // this is the required parameter
          notification : true,
          //this mime parameter is optional in case of pdf extension file downloading
          //mime : 'image/jpeg',// tis type is mandatory in case of image file downloading
          title : _id,
          path : dirs.DownloadDir + `/hooks/Invoice_${_id}.pdf`, // File will be downloaded in downloads directory
          mediaScannable : true,
          fileCache : true,
          description : `Invoice for ${_id}`,
          appendExt: 'pdf'
          },
          
          
          })
  .fetch('GET', res.data, {
    //some headers ..
  })
  .then((res) => {
    // the temp file path
    ToastAndroid.show('Invoice Downloaded !', ToastAndroid.SHORT);
    console.log('The file saved to ', res.path())
  })
  .catch(err => {
    ToastAndroid.show('Error in Downloading Invoice !', ToastAndroid.SHORT);
    console.log(err, 'download error')
  })
        // let result = await WebBrowser.openBrowserAsync(res.data);
      }
      else {
        toast('err', 'Error in downloading pdf')
      }
        
    } catch (error) {
      console.log(error, 'This is error')
    }
      // console.log(res, 'download resp')
    }

    

const Reorder = async () => {
  if(orderInfo && orderInfo._id) {
    const response = await re_order({cart_id: orderInfo._id});
    if(response.success) {
      const user = await loadUser({user_id: response.data.user_id});
      if(user.success) {
        const loggedUser = await getUser();
        if(loggedUser && loggedUser.token) {
            const stored = await storeUser({...user, token: loggedUser.token});
            console.log(stored, 'stored')
            const update = await updateUser({...user, token: loggedUser.token})
         setOrderModal(false);
            navigation.navigate('CartScreen')
        }
      }
    } else {
      toast('err', response.data)
    }
  }
}

const fetchData =  async() => {
    const user = await getUser();
    if(user && user.token) {
        const timerConfig = await fetch_timer_config();
       
      const response = await fetch_orders({cart_id: user.cart_id});
      let timer = 0, current = new Date().getTime();
        if(timerConfig.success) {
            setTimer(timerConfig.data);
            // timer = (timerConfig.data.timer * 60 * 1000);
        }
      if(response.success) {
        const f = await countDown(response.data.carts, timerConfig.data)
        setOrders(f);
        // setInterval(async () => {
        //   const data = response.data.carts
        //   console.log('execs')
        //   const g = await countDown(data, timerConfig.data);
        //   // console.log(g, 'gvdvg')
        //   setOrders(g);
        // }, 60000)
        
      } else {
        toast('err', 'Invalid request')
      }
    } else {
      toast('err', 'Please login to see cart')
    }
  }
  

  const countDown = async (carts, timer) => {
    for(const cart of carts) {
      // if(cart.time)
      const current = new Date().getTime();
      let end = 0, hour = 0, minute = 0, secs = 0, comp = -1;
      if(timer && timer.timer) {
        end = cart.time + (timer.timer * 60000)
      }
      // console.log(end, current, 'end and current', timer)
      if(end > current) {
        // console.log(start, end, current, 'checks')
        const diff = end - current;
        hour = (diff / 3600000) > 1 ? (diff / 3600000).toString() : 0;
        minute = (diff / 60000).toString().split('.')[0];
        secs = (Math.round(((diff / 1000) / 60) * 100) / 100);
        comp = ((diff / 1000) / 60);
        if(secs.toString() & secs.toString().split('.') && secs.toString().split('.')[1]) {
          secs = (secs.toString().split('.')[1]).toString();
        }
        
        let final = `${hour}:${minute}`
        cart.timer = final;
      }
     else {
       cart.timer = ''
     }
    }
    // console.log(carts, 'carts returning')
    return carts
  }


  const ShowOrderInfo = async (id) => {
      const response = await fetch_order_info({cart_id: id});
      console.log(response.data, 'order info', timer.timer, id);
    //  t(response.data.time);

      if(response.success) {
        setOrderInfo(response.data.resp);
        console.log(response.data.resp, 'check out this order resp for gift')
        setOrderModal(true);
      } else {
          toast('err', response.data);
      }
  }

  const showPrice = (available_data, id, quantity) => {
    const variation = available_data.find(v => v._id == id);
    if(variation) {
      return (variation.discounted_rate * quantity).toFixed(2);
    }
  }

  const Promocode = () => {
    if(orderInfo.promo_code && orderInfo.promo_discount > 0) {
      return (
        <TouchableOpacity>
        <View style={{alignItems:'center'}}>
          <Text style={{fontSize:18, fontWeight:'bold'}}>
           Promocode Applied
          </Text>
        </View>

       <View style={{flexDirection:'row'}}>
       <View style={{marginTop:10, flex:1}}>
          <Text style={{fontSize:16}}>
            {orderInfo.promo_code}
          </Text>
        </View>
        
       </View>
       <View style={{marginTop:10}}>
          <Text>
            Promocode Discount: Rs. {(orderInfo.promo_discount).toFixed(2)}
          </Text>
        </View>

      </TouchableOpacity>
      )
    }
  }

  const AddReview = (_id) => {
    setProductId(_id);
    setOrderModal(false);
    setReviewModal(true);
  }



  const GiftDiscount = () => {
      if(orderInfo.gift) {
          return (
            <View style={{flexDirection:'row', marginBottom:10}}>
            <View style={{flex:1}}>
                          <Text>
                              Gift Discount
                          </Text>
                      </View>
                      <View style={{flex:1, justifyContent:'flex-end', alignContent:'flex-end',alignItems:'flex-end'}}>
                          <Text>
                          Rs. 10
                          </Text>
                      </View>
            </View>
          )
      }
  }

  const OpenOrderModal = () => {
      return (
        <Modal visible={orderModal} transparent={false} animationType={'slide'} onRequestClose={()=>{setOrderModal(false)
          setPdf(false)
        }}>
        <ScrollView>
        <View style={{flexDirection:'row', paddingHorizontal:30}}>
        <View style={{flex:2}}>
            <View style={{justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize: 20,marginTop: 50, fontWeight: 'bold'}}>
                    Order Information
                </Text>
            </View>
            </View>
            <TouchableOpacity onPress={()=>{
              // t('', true)
              setOrderModal(false)
              setPdf(false)
              }} style={{justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end', marginTop:20}}>
                <Icon name="times" size={25} style={{ fontWeight: 'bold' }} color={'black'} />
            </TouchableOpacity>
            
            
        </View>
              {pdf ? (
                <View style={{ flex: 1, height: height * 0.8, width, marginTop: 25 }}>
               <WebView onFileDownload={file => {
                 console.log(file, 'file')
               }} onError={err => {
                 console.log(err, 'err');
                //  alert(err)
               }} source={{
                //  uri: `http://docs.google.com/gview?embedded=true&url=http://www.africau.edu/images/default/sample.pdf`
                uri: `http://192.168.0.105:3080/cart/invoice/${url}`
               }} style={{ flex: 1 }} javaScriptEnabled={true} domStorageEnabled={true} onLoadEnd={data => {
                //  console.log(data, 'load end')
               }} />
                {/* <PDFReader
        source={{
          uri: url
        }}
      /> */}
               </View>
              ) : (
                <>
                        <View style={{backgroundColor:'rgba(255, 182, 193, 0.3)', marginHorizontal:10, marginVertical:10, padding:10, borderRadius:10}}>
                
                        <View style={{alignItems:'center'}}>
                        {orderInfo.products && (
                        orderInfo.products.map(product => (
                            product.exist && (
                                // <View style={{flexDirection:'column'}}>
        <View key={product._id} style={{flexDirection:'row', marginTop:10, marginBottom:10}}>
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
        
            <View style={{flex:2, alignItems:'flex-end'}}>
              <Text>
              Rs. {showPrice(product.product.available_in, product.variation_id, product.quantity)}
              </Text>
              </View>
        
        <TouchableOpacity onPress={() => AddReview(product.product_id)}>
        <Text style={{fontWeight:'bold', marginLeft: 20}}>
          Review
        </Text>
        </TouchableOpacity>
        
              
              
          </View>
          
        //   </View>
          
                            )
                            )))}
                        </View>
                        {Promocode()}
        
        
        
        
                        <View>
                          {orderInfo.gift && (
 <View>
   <Text style={{ fontSize: 16 }}>
     Gift Note:
   </Text>
   <Text style={{ fontSize: 14, color: 'grey' }}>
                            {orderInfo.note}
   </Text>
 </View>
                          )}
                         

                        <View style={{marginTop:20, alignItems:'center'}}>
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
                            Rs. {orderInfo.discounted_price ? (orderInfo.discounted_price).toFixed(2) : 0}
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
                            Rs. {orderInfo.shipping_price}
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
                            {orderInfo.promo_discount > 0 ? 'Rs.' + (orderInfo.promo_discount).toFixed(2) : 'Rs. 0'}
                            </Text>
                        </View>
              </View>
        
              {GiftDiscount()}
              <View style={{flexDirection:'row', marginBottom:10}}>
              <View style={{flex:1}}>
                            <Text>
                                Grand Total
                            </Text>
                        </View>
                        <View style={{flex:1, justifyContent:'flex-end', alignContent:'flex-end',alignItems:'flex-end'}}>
                            <Text>
                            Rs. { orderInfo.gift ? (orderInfo.discounted_price + orderInfo.shipping_price + 10) - orderInfo.promo_discount : (orderInfo.discounted_price + orderInfo.shipping_price) - orderInfo.promo_discount }
                            </Text>
                        </View>
              </View>
        
              
        </View>
        </View>
                        </View>
                         <View style={{flexDirection:'row', margin:20}}>
                         {orderInfo && <TouchableOpacity style={{flex:1, alignItems:'center', backgroundColor:'pink', padding:10, marginRight:10}} onPress={() => download(orderInfo._id)}>
                <Text>
                    Download Invoice
                </Text>
            </TouchableOpacity>}
        
            <TouchableOpacity onPress={() => Reorder()} style={{flex:1, alignItems:'center', backgroundColor:'pink', padding:10}}>
                <Text>
                    Re-Order
                </Text>
            </TouchableOpacity>
        </View>
             </>
              )}

        </ScrollView>
    </Modal>
      )
  }

  const changeReviewInput = (name, e) => {
    setReviewForm({
          ...reviewForm, [name]: e
      })
  }

  const SubmitReview = async () => {
    if(!reviewForm.description) {
      toast('err', 'Review message is required!')
    }
    const user = await getUser();
    const payload = {
      _id: product_id,
      rating: rating,
      description: reviewForm.description,
      user_id: user._id,
      date: new Date()
    }
    const response = await add_review(payload);
    if(response.success) {
      closeReviewModal();
        toast('success', 'Review added successfully!');
    } else {
      toast('err',response.data)
    }
  }

  const closeReviewModal = () => {
    setReviewForm({
      _id: '',
      product_id: '',
      description: '',
      rating: 0
    });
    setReviewModal(false)
  }

  const OpenReviewModal = () => {
    return (
      <Modal useNativeDriver={true} visible={reviewModal} transparent={false} animationType={'slide'} onRequestClose={()=>{setOrderModal(false)}}>
           <ScrollView>
        <View style={{flexDirection:'row', paddingHorizontal:30}}>
        <View style={{flex:2}}>
            <View style={{justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize: 20,marginTop: 50, fontWeight: 'bold'}}>
                    Add Review
                </Text>
            </View>
            </View>
            <TouchableOpacity onPress={()=>{closeReviewModal()}} style={{justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end', marginTop:20}}>
                <Icon name="times" size={25} style={{ fontWeight: 'bold' }} color={'black'} />
            </TouchableOpacity>
            
            
        </View>

        <View style={{marginHorizontal:20}}>
        <AirbnbRating
                count={5}
                defaultRating={0}
                size={26}
                onFinishRating={setRating}
                useNativeDriver={true}
                />
        <Input multiline={true}
numberOfLines={6} placeholder='Add your review' name='description' value={reviewForm.description} changeInput={changeReviewInput}/>
        </View>
        <TouchableOpacity onPress={() => {SubmitReview()}} style={{justifyContent:'center', alignItems:'center'}}>
          <Text style={{backgroundColor:'pink', justifyContent:'center', alignItems:'center', borderRadius:8, padding:15, marginVertical:20}}>
            Submit
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </Modal>
    )
  }

  const OrdersList = () => {
      if(orders && orders.length > 0) {
          return (
                orders.map(order => (
            <TouchableOpacity onPress={() => ShowOrderInfo(order._id)} key={order._id} style={{borderColor:'lightgrey',
                borderWidth:1, backgroundColor:'white', marginHorizontal: 10, marginVertical:4, borderRadius:8, padding:10}}>
                    <Text>
                {new Date(order.time).getDate() + '/' + (new Date(order.time).getMonth() + 1) + '/' + new Date(order.time).getFullYear()}
                </Text>
                    <Text>{order.timer ? order.timer + '  Minutes Left' : ''}</Text>
             </TouchableOpacity>
                ))
          )
      } else {
          return (<View style={{marginTop:20, alignItems:'center'}}>
              <Text style={{fontSize:16, fontWeight:'bold'}}>
                  No orders to display!
              </Text>
          </View>)
      }
  }
   
    return (
        <ScrollView style={{flexDirection:'column',}}>
            <View style={{justifyContent:'center', alignContent:'center', alignItems:'center', marginBottom:30}}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>
                    Your Orders
                </Text>
            </View>
          {OrdersList()}

          {OpenOrderModal()}

          {OpenReviewModal()}
        </ScrollView>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})


export default connect(
    mapStateToProps, {
        fetch_orders, fetch_timer_config, fetch_order_info, re_order, loadUser, updateUser, add_review, toast, invoice
    }
) (Orders)

