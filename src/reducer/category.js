import { GET_CATEGORY, GET_MAIN_CATEGORY, GET_SUB_CATEGORY_PRODUCT } from '../actions/types';

const initialState = {
    home_categories: null, loading: true, main_category: [], sub_category_products: []
}

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch(type) {
        case GET_CATEGORY:
            return {
               ...state, home_categories: payload, loading: false
            }
            case GET_MAIN_CATEGORY:
            return {
               ...state, main_category: payload, loading: false
            }
            case GET_SUB_CATEGORY_PRODUCT:
            return {
               ...state, sub_category_products: payload, loading: false
            }
        default:
            return state
    }
}