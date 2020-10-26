import { SET_ERROR, RESET_ERROR } from '../actions/types';

const initialState = [];

export default (state = initialState, action) => {
    const { payload, type } = action;
    console.log(payload, 'fires the toast')
    switch(type) {
        case SET_ERROR:
            return [...state, payload]
            case RESET_ERROR:
                return state.filter(alert => alert.id !== payload)
                    default:
                        return state
    }
}