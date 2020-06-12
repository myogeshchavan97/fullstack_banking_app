import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { validateFields } from '../utils/common';

const AddAccountForm = (props) => {
  const [state, setState] = useState({
    account_no: '',
    bank_name: '',
    ifsc: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const handleAddAccount = (event) => {
    event.preventDefault();
    const { account_no, bank_name, ifsc } = state;
    const fieldsToValidate = [{ account_no }, { bank_name }, { ifsc }];
    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({ add_error: 'Please enter all the fields.' });
    } else {
      props.handleAddAccount(state);
    }
  };

  return (
    <div className="edit-account-form  col-md-6 offset-md-3">
      <Form onSubmit={handleAddAccount} className="account-form">
        {errorMsg && errorMsg.add_error && (
          <p className="errorMsg centered-message">{errorMsg.add_error}</p>
        )}
        <Form.Group controlId="type">
          <Form.Label>Add account</Form.Label>
        </Form.Group>
        <hr />
        <Form.Group controlId="accnt_no">
          <Form.Label>Account number: </Form.Label>
          <Form.Control
            type="text"
            name="account_no"
            placeholder="Enter your account number"
            value={state.account_no}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="accnt_no">
          <Form.Label>Bank name: </Form.Label>
          <Form.Control
            type="text"
            name="bank_name"
            placeholder="Enter your bank name"
            value={state.bank_name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="ifsc">
          <Form.Label>IFSC Code:</Form.Label>
          <Form.Control
            type="text"
            name="ifsc"
            placeholder="Enter new IFSC code"
            value={state.ifsc}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddAccountForm;
