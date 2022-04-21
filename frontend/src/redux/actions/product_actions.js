import { ActionNames } from "../constants/action_names";

export const setProducts = (products) => {
  return {
    type: ActionNames.SET_ALL_PRODUCTS,
    payload: products,
  };
};

export const selectedProduct = (product) => {
  return {
    type: ActionNames.SELECTED_PRODUCT_DETAILS,
    payload: product,
  };
};
export const removeSelectedProduct = () => {
  return {
    type: ActionNames.REMOVE_SELECTED_PRODUCT_DETAILS,
  };
};
