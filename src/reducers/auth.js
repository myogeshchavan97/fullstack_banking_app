import { SIGN_IN, SIGN_OUT } from '../utils/constants';

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGN_IN:
      return action.user;
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
};

export default authReducer;
