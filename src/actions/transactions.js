import { BASE_API_URL } from '../utils/constants';
import { getErrors } from './errors';
import { ADD_TRANSACTION } from '../utils/constants';
import { updateAccountBalance } from './account';
import { post } from '../utils/api';

export const addTransaction = (transaction) => ({
  type: ADD_TRANSACTION,
  transaction
});

export const initiateDepositAmount = (account_id, amount) => {
  return async (dispatch) => {
    try {
      const transaction = {
        transaction_date: new Date(),
        deposit_amount: amount
      };
      await post(`${BASE_API_URL}/deposit/${account_id}`, transaction);
      dispatch(
        addTransaction({
          ...transaction,
          withdraw_amount: null
        })
      );
      dispatch(updateAccountBalance(amount, 'deposit'));
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};

export const initiateWithdrawAmount = (account_id, amount) => {
  return async (dispatch) => {
    try {
      const transaction = {
        transaction_date: new Date(),
        withdraw_amount: amount
      };
      await post(`${BASE_API_URL}/withdraw/${account_id}`, transaction);
      dispatch(
        addTransaction({
          ...transaction,
          deposit_amount: null
        })
      );
      dispatch(updateAccountBalance(amount, 'withdraw'));
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};
