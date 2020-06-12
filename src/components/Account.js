import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import AccountForm from './AccountForm';
import Summary from './Summary';

const Account = () => {
  const [selectedType, setSelectedType] = useState('withdraw');

  const handleOnChange = (selectedType) => {
    setSelectedType(selectedType);
  };

  return (
    <div>
      <div className="account">
        <Button
          variant="primary"
          className={`${
            selectedType === 'withdraw' ? 'active account-btn' : 'account-btn'
          }`}
          onClick={() => handleOnChange('withdraw')}
        >
          Withdraw
        </Button>
        <Button
          variant="secondary"
          className={`${
            selectedType === 'deposit' ? 'active account-btn' : 'account-btn'
          }`}
          onClick={() => handleOnChange('deposit')}
        >
          Deposit
        </Button>
        <Button
          variant="info"
          className={`${
            selectedType === 'summary' ? 'active account-btn' : 'account-btn'
          }`}
          onClick={() => handleOnChange('summary')}
        >
          Summary
        </Button>
      </div>
      <div>
        {selectedType === 'withdraw' || selectedType === 'deposit' ? (
          <AccountForm selectedType={selectedType} />
        ) : (
          <Summary />
        )}
      </div>
    </div>
  );
};

export default connect()(Account);
