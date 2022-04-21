import { ActionNames } from "../constants/action_names";

export const LoginAction = (status,name) => {
    return {
      type: ActionNames.LOGIN,
      payload: {
         status,
         name
      }
    };
  };

  export const LogoutAction = (status) => {
    return {
      type: ActionNames.LOGOUT,
      payload: {
         status
      }
    };
  };


