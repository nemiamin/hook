import { LOGIN, REGISTER, URL, LOAD_USER, LOAD_ERROR, USER_DATA } from './types';
import * as axios from 'axios';
import resolve from './resolveResponse';
import { storeUser, getUser, clearUser } from './authHandler';
import { toast } from './toast';
import { AsyncStorage } from 'react-native';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const decodeToken = (payload) => async dispatch => {
    try {
        console.log('comes in decode')
        const { data } = await axios.get(`${URL}/user/decodeToken/${payload}`, config);
        const res = await resolve(data);
     console.log('resolved')
        return {
            success: true, data: res
        }
    } catch (error) {
        console.log('Error in decoding token', errro)
    }
}

export const login = (payload) => async dispatch => {
    try {
        // console.log('API clled')
        const { data } = await axios.post(`${URL}/user/login`, payload, config);
        const res = await resolve(data);
        // console.log(res, 'login data')
        await storeUser(res);
        dispatch(toast('success', 'Logged in successfully'));
        dispatch({
            type: LOAD_USER,
            payload: res
        });
     
        return {
            success: true, data: res
        }
    } catch (error) {
     if(error.response) {
        dispatch(toast('err', error.response.data.data[0].msg[0].msg));
         return {
             success: false, data: error.response.data.data[0].msg[0].msg
         }
     }
     else {
        dispatch(toast('err', 'Error in login'));
         return {
             success: false, data: 'Error in login'
         }
     }
    }
}

export const socialLogin = (payload) => async dispatch => {
    try {
        // console.log('API clled')
        const { data } = await axios.post(`${URL}/user/socialLogin`, payload, config);
        const res = await resolve(data);
        // console.log(res, 'login data')
        await storeUser(res);
        dispatch(toast('success', 'Logged in successfully'));
        dispatch({
            type: LOAD_USER,
            payload: res
        });
     
        return {
            success: true, data: res
        }
    } catch (error) {
     if(error.response) {
         console.log(error.response.data.data[0], 'error')
        dispatch(toast('err', error.response.data.data[0].msg[0].msg));
         return {
             success: false, data: error.response.data.data[0].msg[0].msg
         }
     }
     else {
        dispatch(toast('err', 'Error in login'));
         return {
             success: false, data: 'Error in login'
         }
     }
    }
}

export const loadUser = (payload) => async dispatch => {
    try {
        const { data } = await axios.post(`${URL}/user/getUser`, payload, config);
        const res = await resolve(data);
        return {
            ...res, success: true
        };
    } catch (error) {
     if(error.response) {
         return {
             success: false, data: error.response.data.data[0].msg[0].msg
         }
     }
     else {
         return {
             success: false, data: 'Error in login'
         }
     }
    }
}

export const register = (payload) => async dispatch => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log({...payload, token}, 'with token')
        const { data } = await axios.post(`${URL}/user/register`, {...payload, token});
        const resolved = await resolve(data);
        // console.log(resolved , 'registred scuess')
        dispatch(toast('success', 'Registration Successfull'))
        console.log(resolved)
        return {
            success: true, data: resolved
        }
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
    }
}


export const logout = () => async dispatch => {
    try {
        await clearUser();
        dispatch(toast('success', 'Successfully Logged Out !'))
        dispatch({
            type: LOAD_ERROR,
            payload: {}
        })
    } catch (error) {
        
    }
}

export const get_wishlist = (payload) => async dispatch => {
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': payload.token
            }
        }
        const { data } = await axios.get(`${URL}/user/getWishlist`, config);
        const resolved = await resolve(data);
        return resolved
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const update_profile = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/user/editProfile`, payload, config);
        const resolved = await resolve(data);
        return resolved
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}


export const add_address = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/user/address`, payload, config);
        const resolved = await resolve(data);
        return {
            ...resolved, success: true
        }
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}


export const delete_address = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        console.log(user.token , 'user token')
        const { data } = await axios.post(`${URL}/user/deleteAddress`, payload, config);
        const resolved = await resolve(data);
        return {...resolved, success: true}
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}


export const fetch_promocode = () => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/user/userPromo`,{}, config);
        const resolved = await resolve(data);
        // console.log(resolved,' => promocode')
        return {success:true, data: resolved}
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const apply_promocode = (payload) => async dispatch => {
    try {
        // console.log('API caleld')
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/user/applyPromo`, payload, config);
        const resolved = await resolve(data);
        // console.log(resolved, 'applied promo')
        return {success: true, data: resolved}
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}



export const fetch_orders = (payload) => async dispatch => {
    try {
        // console.log('API caleld')
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/checkouts`, payload, config);
        const resolved = await resolve(data);
        // console.log(resolved, 'orders list')
        return {success: true, data: resolved}
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const fetch_timer_config = () => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.get(`${URL}/user/timer`, config);
        const resolved = await resolve(data);
        // console.log(resolved, 'timer list')
        return {success: true, data: resolved}
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const updateUser = (payload) => async dispatch => {
    try {
        console.log(payload, 'for updating user')
        dispatch({
            type: USER_DATA,
            payload
        })
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const fetch_order_info = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/getCheckout`,payload, config);
        const resolved = await resolve(data);
        // console.log(resolved, 'timer list')
        return {success: true, data: resolved}
    } catch (error) {
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const send_otp = (payload) => async dispatch => {
    try {
        const { data } = await axios.post(`${URL}/user/generateOtp`,payload);
        const resolved = await resolve(data);
        return {success: true, data: resolved}
    } catch (error) {
        console.log(error.response,'error');
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}


export const forgot_password = (payload) => async dispatch => {
    try {
        const { data } = await axios.post(`${URL}/user/changePassword`,payload);
        const resolved = await resolve(data);
        return {success: true, data: resolved}
    } catch (error) {
        console.log(error.response,'error');
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const re_order = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/reorder`,payload, config);
        const resolved = await resolve(data);
        return {success: true, data: resolved}
    } catch (error) {
        console.log(error.response,'error');
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}


export const add_review = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/product/addReview`,payload, config);
        const resolved = await resolve(data);
        return {success: true, data: resolved}
    } catch (error) {
        console.log(error.response,'error');
        if(error.response) {
            return {
                success: false, data: error.response.data.data[0].msg[0].msg
            }
        }
        else {
            return {
                success: false, data: 'Error in login'
            }
        }
       
    }
}

export const fireToast = (payload) => async dispatch => {
    try {
        dispatch(toast('err', 'Please Login', true, payload))
    } catch (error) {
        
    }
}



export const invoice = (payload) => async dispatch => {
try {
    const user = await getUser();
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'access-token': user.token
        }
    }
    const { data } = await axios.post(`${URL}/cart/invoice`, payload, config);
    const res = await resolve(data);
    console.log(res, 'download data')
    return {
        success: true, data: res
    }
} catch (error) {
    console.log(payload, 'this is payload')
    console.log(error.response, 'Error in downloading invoice')
    return {
        success: false, data: JSON.stringify(error)
    }
}
}