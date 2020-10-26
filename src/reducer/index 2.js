import { combineReducers } from "redux";
import auth from './auth';
import toast from './toast';
import category from './category';
import product from './product';
export default combineReducers({
    auth, 
    toast,
    category,
    product
});
