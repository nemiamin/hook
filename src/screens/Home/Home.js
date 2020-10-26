import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect, createNavigatorFactory } from '@react-navigation/native';
import { View, Text, AsyncStorage, Image, Dimensions } from 'react-native';
import List from '../../components/List';
import Slider from '../../components/Slider';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { shopByCategory,fetchHomeMainCategory, getBanners } from '../../actions/category';
import { connect } from 'react-redux';
import { newArrivals, fetch_special_products, fetch_deal_of_the_day, fetch_recent_search } from '../../actions/product';
import { toast } from '../../actions/toast';
import Loader from '../../components/Loader';
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
// import Constants from 'expo-constants';
import HomeGrid from '../../components/HomeGrid';
import colors from '../../../assets/Colors';
const { width, height } = Dimensions.get('window')

// Notification controller
// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: false,
//       shouldSetBadge: false,
//     }),
//   });

const Home = ({shopByCategory,category,newArrivals,fetchHomeMainCategory, product, navigation, toast, fetch_special_products, fetch_deal_of_the_day, fetch_recent_search, getBanners }) => {

    // NOtification controller starts
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

//    const registerForPushNotificationsAsync = async () => {
//     let token;
//     if (Constants.isDevice) {
//       const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//       let finalStatus = existingStatus;
//       if (existingStatus !== 'granted') {
//         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//         finalStatus = status;
//       }
//       if (finalStatus !== 'granted') {
//         alert('Failed to get push token for push notification!');
//         return;
//       }
//       token = (await Notifications.getExpoPushTokenAsync()).data;
//     } else {
//       alert('Must use physical device for Push Notifications');
//     }
  
//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
//     return token;
//   }

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => 
//         {
//             AsyncStorage.setItem('token', token);
//             setExpoPushToken(token)
//         });

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//     };
//   }, []);
    // Notification controller ends

    const [shopByCategories, setShopByCategories] = useState([]);
    const [NewArrivals, setNewArrivals] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [special, setSpecial] = useState([]);
    const [dealOfTheDay, setDealOfTheDay] = useState([])
    const [catgoryRow, setCategoryRows] = useState([])
    const [ recentSearch, setRecentSearch ] = useState([]);
    const [ banners, setBanners ] = useState([]);

        useFocusEffect(
            useCallback(() => {
              setLoading(true)
                async function fetchData() {
                    const fetchShopCategory = await shopByCategory();
                    const fetchNewArrivals = await newArrivals();
                    const fetchHomeCategory = await fetchHomeMainCategory();
                    const banner = await getBanners();
                    setBanners(banner);
                    let specialData = await fetch_special_products();
                    let dailyDealData = await fetch_deal_of_the_day();
                    const fetchRecentSearch = await fetch_recent_search();
                    console.log(fetchRecentSearch, 'recent search data')
                    if(fetchShopCategory || fetchNewArrivals || fetchHomeCategory || specialData || dailyDealData || fetchRecentSearch || banner) {
                        setShopByCategories([...fetchShopCategory, {name:'nemi'}])
                        setNewArrivals(fetchNewArrivals)
                        setMainCategories(fetchHomeCategory);
                        setRecentSearch(fetchRecentSearch);
                       
                        console.log(banner, 'these are the banners', banner[0]._id)
                        const specialArray = [];
                        if(specialData && specialData.length > 0) {
                            for(let specialD of specialData) {
                                specialD.available_in = specialD.available_in.filter(v => v.discount_type == 'special');
                                specialD.available_in.forEach((variation, index) => {
                                specialArray.push({...specialD, available_in: [variation]})
                              });
                            }
                            setSpecial(specialArray)
                        }


                        if(dailyDealData && dailyDealData.length > 0) {
                            const dealArray = [];
                        for(let deal of dailyDealData) {
                          deal.available_in = deal.available_in.filter(v => v.discount_type == 'daily');
                          deal.available_in.forEach((variation, index) => {
                            dealArray.push({...deal, available_in: [variation]})
                          });
                        } 
                        setDealOfTheDay(dealArray)
                        }
                        
                        categoryGrid(fetchShopCategory)
                        
                        setLoading(false)
                    }
                }
                fetchData();
            }, [])
        )

        const categoryGrid = (shopByCategories) => {
         
          const gridItems = [];
          let i = 0, j = 0, len = shopByCategories.length;
          for(const cat of shopByCategories) {
              console.log(i % 3, 'see the difference')
              if(i % 3 == 0) {
                  if(j <= i) {

                  gridItems.push(
                    <View key={i} style={{ flex: 1, width }}>
                      <View style={{ flexDirection: 'row' }}>
      <HomeGrid category={shopByCategories[j]} height={height * 0.17} screen={'MainCategoryScreen'} param={{mainCategoryId: shopByCategories[j]._id }} navigation={navigation} />
      
      {shopByCategories[j+1] ? (
  <HomeGrid category={shopByCategories[j+1]} height={height * 0.17} screen={'MainCategoryScreen'} param={{mainCategoryId: shopByCategories[j+1]._id }} navigation={navigation} />
                        ) : <View style={{ flex: 1, backgroundColor:'lightgrey', justifyContent:'center', alignItems:'center'}}>
                              
                        <TouchableOpacity onPress={() => navigation.navigate('AllCategory')}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            View All
                          </Text>
                        </TouchableOpacity>
                        </View>}
                        
{shopByCategories[j+2] ? (
    <HomeGrid fromHome={true} category={shopByCategories[j+2]} height={height * 0.17} screen={'MainCategoryScreen'} param={{mainCategoryId: shopByCategories[j+2]._id }} navigation={navigation} />
                          ) : <View style={{ flex: 1, backgroundColor:'lightgrey', justifyContent:'center', alignItems:'center', elevation: 4, marginVertical: 2}}>
                              
                              <TouchableOpacity onPress={() => navigation.navigate('AllCategory')}>
                              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            View All
                          </Text>
                              </TouchableOpacity>
                              </View>}
                 
                      
                      </View>
                      {len % 3 === 0 && (
                        <TouchableOpacity onPress={() => navigation.navigate('AllCategory')} style={{ alignItems: 'center', marginTop: 20, backgroundColor: colors.purple, paddingVertical: 10 }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            View All
                          </Text>
                        </TouchableOpacity>
                      )}
                      </View>
                  )
                      }
                  j += 3;
              }
              i++;
          }
          setCategoryRows(gridItems);
      }

      const category3Grid = (shopByCategories) => {
         
        const gridItems = [];
        let i = 0, j = 0;
        for(const cat of shopByCategories) {
            if(i % 2 == 0) {
                if(j <= i) {
                gridItems.push(
                    <View key={i} style={{ flexDirection: 'row' }}>
    <HomeGrid category={shopByCategories[j]} height={height * 0.2} screen={'SubCategoryScreen'} param={{category_id: shopByCategories[j]._id }} navigation={navigation} />
   
  
{shopByCategories[j+1] ? (
  <HomeGrid category={shopByCategories[j+1]} height={height * 0.2} screen={'SubCategoryScreen'} param={{category_id: shopByCategories[j]._id }} navigation={navigation} />
                        ) : <View style={{ flex: 1 }}></View>}
               
                    
                    </View>
                )
                    }
                j += 2;
            }
            i++;
        }
        return gridItems;
    }

        const toMainCategory = (id) => {
            navigation.navigate('MainCategoryScreen', {
                mainCategoryId: id
            })
        }


        const SpecialOffer = () => {
            if(special && special.length > 0) {
                return (<View style={{flex:0}}>
                    <Slider products={special} full={true} navigation={navigation} />
                    </View>)
            }
        }

        const ShopByCategory = () => {
        if(catgoryRow && catgoryRow.length > 0) {
            return (
                <View style={{justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
                    <TouchableOpacity style={{ backgroundColor: colors.purple, width, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                    <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.purple_text}}>
                        Shop By Category
                    </Text> 
                    </TouchableOpacity>
                    {catgoryRow}
                </View>
            )
        } else {
            return (<View style={{justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
            <Text style={{fontSize: 23, fontWeight: 'bold', marginBottom: 15, color: colors.purple_text}}>
                Shop By Category
            </Text> 
                <Text>
                    No Categories to display!
                </Text>
            </View>)
        }
        }


        const NewProducts = () => {
            if(NewArrivals.length > 0) {
                return (
                    <View style={{marginTop: 20,marginBottom: 20}}>
                        <View style={{justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
                        <TouchableOpacity style={{ backgroundColor: colors.purple, width, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                            <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.purple_text}}>
                                    New Arrivals
                                </Text>
                            </TouchableOpacity>
                            </View>
                        <View style={{marginTop: 20, marginHorizontal: 10}}>
                                {!loading && (
                                            NewArrivals.map(product => (
                                                <List key={product._id} data={product} navigation={navigation} />
                                            ))
                                )}
                        </View> 
                    </View>
                )
            } else {
                return (<View style={{marginTop: 20,marginBottom: 20, justifyContent:'center', alignItems:'center'}}>
                        <View style={{justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
                            <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.purple_text}}>
                                    New Arrivals
                                </Text>
                            
                            </View>
                        <View style={{marginTop: 20, marginHorizontal: 10}}>
                                <Text>
                                    No Products to display!
                                </Text>
                        </View> 
                    </View>)
            }
        }

        const UserRecentSearch = () => {
            if(recentSearch && recentSearch.length > 0) {
                return (
                    <View>
                        <View style={{ marginTop: 20, alignItems: 'center'}}>
                        <TouchableOpacity style={{ backgroundColor: colors.purple, width, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                    <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.purple_text}}>
                        Recent Search
                    </Text>
                    </TouchableOpacity>
                    </View>
                    <View>
                    {!loading && (
                            recentSearch.map(product => (
                                <List key={product._id} data={product} navigation={navigation} />
                            ))
                        )}
                    </View>
                    </View>
                )
            }
        }

        const DailyDeal = () => {
            if(dealOfTheDay && dealOfTheDay.length > 0) {
                return (
                    <View style={{marginTop: 20,marginBottom: 20}}>
    <View style={{justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
    <TouchableOpacity style={{ backgroundColor: colors.purple, width, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
    <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.purple_text}}>
            Deals Of The Day
        </Text>
        </TouchableOpacity>
    </View> 
    <View style={{marginTop: 20, marginHorizontal: 10}}>
    {!loading && dealOfTheDay.length > 0 && (
                dealOfTheDay.map((product,index) => (
                    <List key={product._id+index} data={product} navigation={navigation} />
                ))
            )}
    </View>
    </View>
                )
            } else {
                return (
                    <View style={{marginTop: 20,marginBottom: 20}}>
    <View style={{justifyContent:'center',alignContent:'center', alignItems:'center', marginTop: 20}}>
    <TouchableOpacity style={{ backgroundColor: colors.purple, width, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
    <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.purple_text}}>
            Deals Of The Day
        </Text>
        </TouchableOpacity>
    </View> 
    <View style={{marginTop: 20, marginHorizontal: 10, alignItems:'center'}}>
                    <Text>
                        No Product to display!
                    </Text>
    </View>
    </View>
                )
            }
        }

        const MainCategoryData = () => {
            if(mainCategories && mainCategories.length > 0) {
                return (
                    <View>
            {!loading && mainCategories.length > 0 && (
                mainCategories.map(category => (
                    <View key={Math.random().toString()} style={{justifyContent:'center', marginTop: 6, marginBottom:10}}>
                          <TouchableOpacity style={{ backgroundColor: colors.purple, width, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                        <Text style={{fontSize: 23, fontWeight: 'bold', color: colors.purple_text, marginHorizontal: 15}}>
                            {category.category_name}
                        </Text>
                        </TouchableOpacity>
                        {category3Grid(category.sliced)}
                        <TouchableOpacity style={{marginTop:15, alignItems: 'center', paddingVertical: 10, backgroundColor: colors.purple}} onPress={() => {
                            category.is_parent ? navigation.navigate('MainCategoryScreen', {mainCategoryId: category.cat_id}) :navigation.navigate('SubCategoryScreen', {category_id: category.cat_id})
                        }}>
                           <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                            View All
                          </Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
    </View>

                )
            } else {
                return (
                    <View style={{alignItems:'center'}}>
                        <Text>
                            No Main Category to display!
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
        
        {!loading && (
    
    <ScrollView style={{flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 5}}>
        {SpecialOffer()}
    
        {ShopByCategory()}
        {banners && banners.length > 0 && banners.map(banner => (
            banner._id === 1 && (
                <Slider navigation={navigation} isBanner={true} banner={banner.details} />
            )
        ))}
        
            {/* <TouchableOpacity style={{ marginTop: 30, alignItems: 'center'}}>
                <Image style={{
                    width: width, height: 200
                }} source={{
                    uri: 'https://i.ibb.co/s6J1qSw/1.jpg'
                }} />
            </TouchableOpacity> */}
        {NewProducts()}

        {UserRecentSearch()}
        {/* <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }}>
                <Image style={{
                    width: width, height: 200
                }} source={require('../../../assets/2.jpeg')} />
            </TouchableOpacity> */}
             {banners && banners.length > 0 && banners.map(banner => (
            banner._id === 2 && (
                <Slider navigation={navigation} isBanner={true} banner={banner.details} />
            )
        ))}
        {DailyDeal()}
        {/* <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }}>
                <Image style={{
                    width: width, height: 200
                }} source={require('../../../assets/3.jpeg')} />
            </TouchableOpacity> */}
             {banners && banners.length > 0 && banners.map(banner => (
            banner._id === 3 && (
                <Slider navigation={navigation} isBanner={true} banner={banner.details} />
            )
        ))}
        {MainCategoryData()}
</ScrollView>
   
 )}
     </>    
        )
}



const mapStateToProps = state => ({
    category: state.category,
    product: state.product
})


export default connect(
    mapStateToProps, {
        shopByCategory, newArrivals, fetchHomeMainCategory, toast, fetch_special_products, fetch_deal_of_the_day, fetch_recent_search, getBanners
    }
) (Home)

