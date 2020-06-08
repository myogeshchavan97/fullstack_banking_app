import { GET_ERRORS, RESET_ERRORS } from '../utils/constants';

const errorsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return action.errors;
    case RESET_ERRORS:
      return {};
    default:
      return state;
  }
};

export default errorsReducer;
