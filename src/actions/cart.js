import { URL, GET_CART } from './types';
import * as axios from 'axios';
import resolve from './resolveResponse';
import { toast } from './toast';
import { getUser} from './authHandler';

export const add_to_cart = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/cart`, payload, config);
        // console.log(' cart response =++++++> ',await resolve(data))
        dispatch({type: GET_CART, payload: await resolve(data)});
        return {success:true, data: await resolve(data)};
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



export const getCart = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/getCart`, payload, config);
        dispatch({type: GET_CART, payload: await resolve(data)});
        return await resolve(data);
    } catch (error) {
        console.log(error.response, 'get cart error', payload)
        return false
    }
}


export const remove_from_cart = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/deleteFromCart`, payload, config);
        dispatch({type: GET_CART, payload: await resolve(data)});
        return await resolve(data);
    } catch (error) {
        console.log(error, 'error')
    }
}

export const remove_promocode = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/user/removePromo`, payload, config);
        dispatch({type: GET_CART, payload: await resolve(data)});
        return await resolve(data);
    } catch (error) {
        console.log(error, 'error')
    }
}

export const remove_item_from_cart = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/deleteFromCart`, payload, config);
        dispatch({type: GET_CART, payload: await resolve(data)});
        return {success:true, data: await resolve(data)};
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


export const send_gift = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/toggleGift`, payload, config);
        dispatch({type: GET_CART, payload: await resolve(data)});
        return {success:true, data: await resolve(data)};
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

export const setDetail = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/details`, payload, config);
        // dispatch({type: GET_CART, payload: await resolve(data)});
        return {success:true, data: await resolve(data)};
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


export const fetch_shipping_data = () => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.get(`${URL}/user/shipping`, config);
        // dispatch({type: GET_CART, payload: await resolve(data)});
        return {success:true, data: await resolve(data)};
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

export const cod_pay = (payload) => async dispatch => {
    const user = await getUser();
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/cart/codCheckout`, payload, config);
        return {success:true, data: await resolve(data)};
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