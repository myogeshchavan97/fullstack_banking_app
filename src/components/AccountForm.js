import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  initiateGetAccntDetails,
  initiateAddAccntDetails,
  initiateUpdateAccntDetails
} from '../actions/account';
import {
  initiateWithdrawAmount,
  initiateDepositAmount
} from '../actions/transactions';
import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
import { maskNumber } from '../utils/mask';
import AddAccountForm from './AddAccountForm';

const AccountForm = (props) => {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState(props.account);
  const [editAccount, setEditAccount] = useState(false);
  const [ifsc, setIfsc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const propsRef = useRef(false);

  const processOnMount = useCallback(() => {
    if (propsRef.current === false) {
      const { email } = props;
      if (email) {
        props.dispatch(initiateGetAccntDetails());
        propsRef.current = true;
      }
    }
    return () => props.dispatch(resetErrors());
  }, [props]);

  useEffect(() => {
    processOnMount();
  }, [processOnMount]);

  useEffect(() => {
    setAccount(props.account);
  }, [props, props.account]);

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  const handleUpdateAccount = (ifsc) => {
    const fieldsToValidate = [{ ifsc }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({
        update_error: 'Please enter ifsc code.'
      });
    } else {
      setErrorMsg('');
      props.dispatch(initiateUpdateAccntDetails(ifsc));
    }
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleEditAccount = (event) => {
    event.preventDefault();
    setEditAccount((prev) => !prev);
  };

  const handleInputChange = (event) => {
    setIfsc(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { selectedType } = props;
    const fieldsToValidate = [{ amount }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({
        [selectedType === 'withdraw'
          ? 'withdraw_error'
          : 'add_error']: 'Please enter an amount.'
      });
    } else {
      let { total_balance } = account;
      const selectedAmount = +amount;
      total_balance = +total_balance;
      if (selectedType === 'withdraw' && selectedAmount <= total_balance) {
        props.dispatch(
          initiateWithdrawAmount(account.account_id, selectedAmount)
        );
        setErrorMsg('');
      } else if (selectedType === 'deposit') {
        props.dispatch(
          initiateDepositAmount(account.account_id, selectedAmount)
        );
        setErrorMsg('');
      } else {
        setErrorMsg({
          [selectedType === 'withdraw'
            ? 'withdraw_error'
            : 'add_error']: "You don't have enough balance in your account"
        });
      }
    }
  };

  const handleAddAccount = (account) => {
    const { account_no, bank_name, ifsc } = account;
    props
      .dispatch(initiateAddAccntDetails(account_no, bank_name, ifsc))
      .then(() => props.dispatch(initiateGetAccntDetails()));
  };

  const { selectedType } = props;
  const account_no = account.account_no ? maskNumber(account.account_no) : '';
  const type = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
  return account_no ? (
    editAccount ? (
      <div className="edit-account-form  col-md-6 offset-md-3">
        <h3>
          Account details
          <a href="/#" className="edit-account" onClick={handleEditAccount}>
            Go Back
          </a>
        </h3>
        <hr />
        <Form>
          {errorMsg && errorMsg.update_error && (
            <p className="errorMsg">{errorMsg.update_error}</p>
          )}
          <Form.Group controlId="acc_no">
            <Form.Label>Account number:</Form.Label>
            <span className="label-value">{account && account_no}</span>
          </Form.Group>
          <Form.Group controlId="bank_name">
            <Form.Label>Bank name:</Form.Label>
            <span className="label-value">{account && account.bank_name}</span>
          </Form.Group>
          <Form.Group controlId="ifsc">
            <Form.Label>IFSC code:</Form.Label>
            <span className="label-value">{account && account.ifsc}</span>
            <Form.Control
              type="text"
              placeholder="Enter new IFSC code"
              value={ifsc}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={() => handleUpdateAccount(ifsc)}>
            Update details
          </Button>
        </Form>
      </div>
    ) : (
      <div className="account-form col-md-6 offset-md-3">
        {errorMsg && errorMsg.withdraw_error && (
          <p className="errorMsg">{errorMsg.withdraw_error}</p>
        )}
        {errorMsg && errorMsg.add_error && (
          <p className="errorMsg">{errorMsg.add_error}</p>
        )}
        <Form onSubmit={handleOnSubmit} className="account-form">
          <Form.Group controlId="type">
            <Form.Label>{type}</Form.Label>
            <a href="/#" className="edit-account" onClick={handleEditAccount}>
              Edit Account Details
            </a>
          </Form.Group>
          <hr />
          <Form.Group controlId="accnt_no">
            <Form.Label>Account number: </Form.Label>
            <span className="label-value">{account && account_no}</span>
          </Form.Group>
          <Form.Group controlId="accnt_no">
            <Form.Label>Available balance: </Form.Label>
            <span className="label-value">
              {account && account.total_balance}
            </span>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount:</Form.Label>
            <Form.Control
              type="number"
              placeholder={`Enter amount to ${selectedType}`}
              value={amount}
              onChange={handleAmountChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    )
  ) : (
    <AddAccountForm handleAddAccount={handleAddAccount} />
  );
};

const mapStateToProps = (state) => ({
  email: state.auth && state.auth.email,
  account: state.account,
  errors: state.errors
});

export default connect(mapStateToProps)(AccountForm);
