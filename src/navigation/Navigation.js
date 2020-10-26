import React, { Profiler } from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/Home';
import LoginScreen from '../screens/Login';
import MainCategoryScreen from '../screens/MainCategory';
import RegisterScreen from '../screens/Register';
import SubCategoryScreen from '../screens/SubCategory';
import DrawerContent from '../components/DrawerContent';
import ProfileScreen from '../screens/Profile';
import CartScreen from '../screens/Cart';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductInfo from '../screens/ProductInfo';
import Wishlist from '../screens/Wishlist';
import Checkout from '../screens/Checkout/Checkout';
import Payment from '../components/Payment';
import OrderScreen from '../screens/Orders';
import AllCategory from '../screens/AllCategory';
import ForgotPassword from '../screens/ForgotPassword';
import EmailVerify from '../screens/EmailVerify';
import PaymentSucess from '../screens/PaymentSuccess';
import ContactScreen from '../screens/Contact';
// User stack navigation
const UserStack = createStackNavigator();
const UserNavigator = ({ navigation }) => (
    <UserStack.Navigator screenOptions={({ route }) => ({
       header: () => (
           <SafeAreaView>
        <Header navigation={navigation} />
        </SafeAreaView>
       )
    })}>
        <UserStack.Screen name='HomeScreen' component={HomeScreen} />
        <UserStack.Screen name='ProfileScreen' component={ProfileScreen} />
        <UserStack.Screen name='CartScreen' component={CartScreen} />
        <UserStack.Screen name='MainCategoryScreen' component={MainCategoryScreen} />
        <UserStack.Screen name='SubCategoryScreen' component={SubCategoryScreen} />
        <UserStack.Screen name='ProductInfoScren' component={ProductInfo} />
        <UserStack.Screen name='WishlistScreen' component={Wishlist} />
        <UserStack.Screen name='CheckoutScreen' component={Checkout} />
        <UserStack.Screen name='PaymentScreen' component={Payment} />
        <UserStack.Screen name='OrderScreen' component={OrderScreen} />
        <UserStack.Screen name='AllCategory' component={AllCategory} />
        <UserStack.Screen name='PaymentSuccess' component={PaymentSucess} />
        <UserStack.Screen name='ContactScreen' component={ContactScreen} />
    </UserStack.Navigator>
)

const AuthStack = createStackNavigator();
const AuthNavigator = ({ navigation }) => (
    <AuthStack.Navigator headerMode='none'>
        <AuthStack.Screen name='LoginScreen' component={LoginScreen} />
        <AuthStack.Screen name='RegisterScreen' component={RegisterScreen} />
        <AuthStack.Screen name='ForgotScreen' component={ForgotPassword} />
        <AuthStack.Screen name='VerifyEmail' component={EmailVerify} />
        </AuthStack.Navigator>
)

// Drawer Navigation
const Drawer = createDrawerNavigator();

const Navigation = () => (
<NavigationContainer>
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name='HomeStack' component={UserNavigator} />
        <Drawer.Screen name='AuthStack' component={AuthNavigator} />
    </Drawer.Navigator>
</NavigationContainer>
)

Navigation.propTypes = {

}

export default Navigation

