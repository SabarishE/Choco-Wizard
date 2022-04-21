import { ActionNames } from "../constants/action_names";
const intialState = {
  products: [],
};

// action destructured as {type,payload}

export const AllProductsReducer = (state = intialState, { type, payload }) => {

  console.log("product reducer fire !!!",payload)

  switch (type) {
    case ActionNames.SET_ALL_PRODUCTS:
      return { ...state, products: payload };
    default:
      return state;
  }
};

export const ProductDetailsReducer = (state = {}, { type, payload }) => {
    // console.log(type);
    switch (type) {
      case ActionNames.SELECTED_PRODUCT_DETAILS:
        localStorage.setItem("selectedproduct",JSON.stringify(payload));
        return state
      case ActionNames.REMOVE_SELECTED_PRODUCT_DETAILS:
        return {};
      default:
        return state;
    }
  };
