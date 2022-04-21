import { ActionNames } from "../constants/action_names";

const intialState = {
  Allproducts:[],
  cart: []
};

// action destructured as {type,payload}

export const CartReducer = (state = intialState, { type, payload }) => {
// console.log("type is >>>",type);
// console.log("payload is >>>",payload)
// console.log("state isssssssss >>>",state)

  switch (type) {

    case ActionNames.SET_CART_INITIAL_STATE:
      return { ...state,Allproducts: payload };


    case ActionNames.ADD_TO_CART:

      const inCart=state.cart.filter((item)=> item._id===payload.product._id)

      if(inCart[0]){
return state;
      }
else{
return {...state,cart:[...state.cart,{...payload.product,quantity:payload.quantity}]}
}
      
    case ActionNames.REMOVE_FROM_CART:
      return {...state,cart:state.cart.filter((item)=>item._id!==payload.productId)}

    case ActionNames.ADD_QUANTITY:
      return {...state,cart:state.cart.map((item)=>{ return item._id===payload.productId?{...item,quantity:+item.quantity+1}:item})}
    
    case ActionNames.SUBTRACT_QUANTITY:
      return {...state,cart:state.cart.map((item)=>{ return item._id===payload.productId&&(+item.quantity)>1?{...item,quantity:+item.quantity-1}:item})}
  
    case ActionNames.EMPTY_THE_CART:
      return {...state,cart:[]}
  
    default:
      return state;
  }
};