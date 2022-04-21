
import { combineReducers } from "redux";
import { AllProductsReducer, ProductDetailsReducer } from "./product_reducer";
import {CartReducer} from "./cart_reducer"
import { AccountReducer } from "./account_reducer";
const reducers = combineReducers({
  allProducts: AllProductsReducer,
  cart:CartReducer,
  productDetails: ProductDetailsReducer,
  account:AccountReducer

});
export default reducers;