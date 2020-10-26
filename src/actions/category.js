import { URL, GET_CATEGORY, GET_MAIN_CATEGORY, GET_SUB_CATEGORY_PRODUCT, BANNERS } from './types';
import * as axios from 'axios';
import resolve from './resolveResponse';
import { toast } from './toast';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const shopByCategory = () => async dispatch => {
    try {
        console.log('^&^&^&starts &^&^&^', `${URL}/category/limited_cat`)
    const { data } = await axios.get(`${URL}/category/limited_cat`);
    const payload = await resolve(data);
    console.log(payload, '^&%^*&^')
    dispatch({
        type: GET_CATEGORY,
        payload
    });
    return payload;
    } catch (error) {
        console.log(error.response, 'Error in getting categories');
    }
    
}


export const fetchMainCategory = (payload) => async dispatch => {
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`${URL}/category/mainCategory`, payload);
        console.log(await resolve(data), 'data of main category')
        return await resolve(data)
    } catch (error) {
        console.log(error, 'error')
    }
}

export const fetchSubCategoryProducts = (payload) => async dispatch => {
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`${URL}/product/products`, payload);
        return await resolve(data);
    } catch (error) {
        console.log(error.response, 'error')
    }
}

export const fetchHomeMainCategory = () => async dispatch => {
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.get(`${URL}/category/homeCategory`);
        // console.log(await resolve(data), 'main home catfegories')
        return await resolve(data)
    } catch (error) {
        console.log(error, 'error')
    }
} 


export const fetch_all_category = (payload) => async dispatch => {
    try {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`${URL}/category/allCategories`, payload);
        // console.log(await resolve(data), 'main home catfegories')
        return await resolve(data)
    } catch (error) {
        console.log(error, 'error')
    }
}

export const getBanners = () => async dispatch => {
    try {
        const { data } = await axios.get(`${URL}/category/banner`);
        const res = await resolve(data);
        return res;
    } catch (error) {
        console.log(error, 'Error in getting banners !');
        return []
    }
}