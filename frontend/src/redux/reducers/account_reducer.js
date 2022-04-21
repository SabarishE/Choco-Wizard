
import { ActionNames } from "../constants/action_names";

const intialState = {
    UserStatus:false,
    UserName:"",
  };
  
  // action destructured as {type,payload}
  
  export const AccountReducer = (state = intialState, { type, payload }) => {

    // console.log("account status >>>",state)
    // console.log("account action >>>",type)
    // console.log("account payload >>>",payload)

    switch (type) {

        case ActionNames.LOGIN:
          return { ...state,UserStatus:payload.status,UserName:payload.name };

        case ActionNames.LOGOUT:
           return { ...state,UserStatus:payload.status };

        default:
            return state;
    }

  }