import { GET_PRODUCTS } from '../actions/types';

const initialState = {
    new_arrivals: null, loading: true
}

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch(type) {
        case GET_PRODUCTS:
            return {
               ...state, new_arrivals: payload, loading: false
            }
        default:
            return state
    }
}