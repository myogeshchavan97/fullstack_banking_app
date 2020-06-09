import { SET_TRANSACTIONS, ADD_TRANSACTION } from '../utils/constants';

const transactionsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return [...action.transactions];
    case ADD_TRANSACTION:
      return [...state, action.transaction];
    default:
      return state;
  }
};

export default transactionsReducer;
