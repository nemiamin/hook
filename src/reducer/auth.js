import { LOAD_USER, LOAD_ERROR, USER_DATA } from '../actions/types';

const initialState = {
    token: null, isAuthenticated: false, user: null, loading: true
}

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch(type) {
        case LOAD_USER:
            return {
               ...state,isAuthenticated: true, user: payload, loading: false
            }
            case USER_DATA:
                console.log(payload, 'in reducer for updating')
                return {
                    ...state, isAuthenticated: true, user: payload, loading: false
                }
            case LOAD_ERROR:
                return {
                    ...state, isAuthenticated: false, user: null, loading: false
                }
        default:
            return state
    }
}