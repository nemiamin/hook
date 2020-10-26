import { GET_CART } from '../actions/types';

const initialState = {
    carts: null, loading: true
}

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch(type) {
        case GET_CART:
            return {
               ...state, carts: payload, loading: false
            }
        default:
            return state
    }
}