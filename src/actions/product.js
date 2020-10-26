import { URL, GET_PRODUCTS } from './types';
import * as axios from 'axios';
import resolve from './resolveResponse';
import { toast } from './toast';
import { getUser} from './authHandler';

const config = {
    headers: {
        'Content-Type': 'application/json',
        
    }
}

export const newArrivals = () => async dispatch => {
    try {
    const { data } = await axios.get(`${URL}/product/new_arrivals`);
    const payload = await resolve(data);
    
    dispatch({
        type: GET_PRODUCTS,
        payload
    })

    // console.log(payload, 'new arrivals')
    return payload;
    } catch (error) {
        console.log(error, 'Error in getting user');
    }
    
}



export const fetchSingleProduct = (payload) => async dispatch => {
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`${URL}/product/product`, payload);
        return await resolve(data)
    } catch (error) {
        console.log(error, 'error')
    }
}


export const addWishlist = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/user/storeWishlist`, payload, config);
        const resp = await resolve(data);
        return resp;
    } catch (error) {
        console.log(error, 'error')
    }
}


export const search_product = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/product/searchProduct`, payload, config);
        const resp = await resolve(data);
        return resp;
    } catch (error) {
        console.log(error, 'error')
    }
}

export const fetch_special_products = () => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.get(`${URL}/product/special_products`);
        const resp = await resolve(data);
        return resp;
    } catch (error) {
        console.log(error, 'error')
    }
}


export const fetch_deal_of_the_day = () => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.get(`${URL}/product/daily_products`);
        const resp = await resolve(data);
        return resp;
    } catch (error) {
        console.log(error, 'error')
    }
}

export const storeSearch = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/user/storeSearch`, payload, config);
        const resp = await resolve(data);
        return resp;
    } catch (error) {
        console.log(error, 'Error in storing product ')
    }
}

export const fetch_similar_product = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/product/similarProducts`, payload, config);
        const resp = await resolve(data);
        return {success:true, data: resp};
    } catch (error) {
        console.log(error, 'Error in storing product ')
    }
}

export const remove_review = (payload) => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.post(`${URL}/product/deleteReview`, payload, config);
        const resp = await resolve(data);
        return {success:true, data: resp};
    } catch (error) {
        console.log(error, 'Error in deleting review ')
    }
}

export const fetch_recent_search = () => async dispatch => {
    try {
        const user = await getUser();
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-token': user.token
            }
        }
        const { data } = await axios.get(`${URL}/user/getRecent`, config);
        const resp = await resolve(data);
        return resp;
    } catch (error) {
        // console.log(error.response, 'Error in fetching recent product ')
        return []
    }
}