import { SET_ERROR, RESET_ERROR } from './types';

export const toast = (type, msg, login, navigation, timeout = 2500) => async dispatch => {
    const id = Math.random().toString();
dispatch({
    type: SET_ERROR, payload: {
        msg, type, id, login, navigation
    }
});

setTimeout(() => {
    dispatch({
        type: RESET_ERROR, payload: id
    });
}, timeout)
}

export const reset = (id) => async dispatch => {
    dispatch({
        type: RESET_ERROR, payload: id
    });
}