import { ActionNames } from "../constants/action_names";


export const SetCartInitialState = (products) => {
  return {
    type: ActionNames.SET_CART_INITIAL_STATE,
    payload: products
  };
};


export const AddToCart = (product,quantity) => {
  return {
    type: ActionNames.ADD_TO_CART,
    payload: {
        product,
        quantity
    }
  };
};

export const RemoveFromCart = (productId) => {
    return {
      type: ActionNames.REMOVE_FROM_CART,
      payload: {
          productId
      }
    };
  };

export const AddQuantity = (productId) => {
    return {
      type: ActionNames.ADD_QUANTITY,
      payload: {
          productId
      }
    };
  };

  export const SubtractQuantity = (productId) => {
    return {
      type: ActionNames.SUBTRACT_QUANTITY,
      payload: {
          productId
      }
    };
  };

// ---empty the cart after logout or checkout---
  export const EmptyTheCart = () => {
    return {
      type: ActionNames.EMPTY_THE_CART,

    };
  };