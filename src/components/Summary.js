import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import moment from 'moment';
import {
  initiateGetTransactions,
  downloadReport
} from '../actions/transactions';
import { initiateAddAccntDetails } from '../actions/account';
import Report from './Report';
import { maskNumber } from '../utils/mask';
import { resetErrors } from '../actions/errors';
import AddAccountForm from './AddAccountForm';

class Summary extends React.Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
    transactions: [],
    isDownloading: false,
    formSubmitted: false,
    errorMsg: ''
  };

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.transactions, this.props.transactions)) {
      this.setState({
        transactions: this.props.transactions
      });
    }
    if (!_.isEqual(prevProps.errors, this.props.errors)) {
      this.setState({
        errorMsg: this.props.errors
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetErrors());
  }

  handleStartDateChange = (date) => {
    this.setState({
      startDate: date
    });
  };

  handleEndDateChange = (date) => {
    this.setState({
      endDate: date
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ formSubmitted: true });
    const { startDate, endDate } = this.state;
    const convertedStartDate = moment(startDate).format('YYYY-MM-DD');
    const convertedEndDate = moment(endDate).format('YYYY-MM-DD');

    const { account } = this.props;
    this.props.dispatch(
      initiateGetTransactions(
        account.account_id,
        convertedStartDate,
        convertedEndDate
      )
    );
  };

  downloadReport = (account_id, start_date, end_date) => {
    start_date = moment(start_date).format('YYYY-MM-DD');
    end_date = moment(end_date).format('YYYY-MM-DD');
    this.setState({ isDownloading: true, errorMsg: '' });
    this.props
      .dispatch(downloadReport(account_id, start_date, end_date))
      .then(() => this.setState({ isDownloading: false }));
  };

  handleAddAccount = (account) => {
    const { account_no, bank_name, ifsc } = account;
    this.props.dispatch(initiateAddAccntDetails(account_no, bank_name, ifsc));
  };

  render() {
    const { account } = this.props;
    const {
      startDate,
      endDate,
      transactions,
      isDownloading,
      formSubmitted,
      errorMsg
    } = this.state;
    const account_no = account.account_no ? maskNumber(account.account_no) : '';

    return account_no ? (
      <div className="summary-form">
        <p>Transaction History</p>
        {errorMsg && errorMsg.transactions_error && (
          <p className="errorMsg" style={{ maxWidth: 'unset' }}>
            {errorMsg.transactions_error}
          </p>
        )}
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="acc_no">
            <Form.Label>Account number:</Form.Label>
            <span className="label-value">{account && account_no}</span>
          </Form.Group>
          <Form.Group controlId="bank_name">
            <Form.Label className="label">Start date</Form.Label>
            <DatePicker
              selected={startDate}
              name="start_date"
              value={startDate}
              className="form-control datepicker"
              onChange={this.handleStartDateChange}
            />
          </Form.Group>
          <Form.Group controlId="bank_name">
            <Form.Label className="label">End date</Form.Label>
            <DatePicker
              selected={endDate}
              name="end_date"
              value={endDate}
              className="form-control"
              onChange={this.handleEndDateChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="btn-report">
            Generate Report
          </Button>
        </Form>

        {transactions.length > 0 ? (
          <div className="transactions-section">
            {isDownloading ? (
              <p className="loading">Downloading...</p>
            ) : (
              <React.Fragment>
                <div className="main-info">
                  <p>Account number: {account_no}</p>
                  <p>Bank name: {account.bank_name}</p>
                  <p>IFSC code: {account.ifsc}</p>
                  <p>Total available balance: {account.total_balance}</p>
                </div>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() =>
                    this.downloadReport(account.account_id, startDate, endDate)
                  }
                >
                  Download Report
                </Button>
                <h5>
                  Detailed transactions between{' '}
                  {moment(startDate).format('Do MMMM YYYY')} and{' '}
                  {moment(endDate).format('Do MMMM YYYY')}
                </h5>
                <Report transactions={transactions} />
              </React.Fragment>
            )}
          </div>
        ) : (
          formSubmitted &&
          _.isEmpty(errorMsg) && (
            <p>No transactions found within selected date range.</p>
          )
        )}
      </div>
    ) : (
      <AddAccountForm handleAddAccount={this.handleAddAccount} />
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  transactions: state.transactions,
  errors: state.errors
});

export default connect(mapStateToProps)(Summary);
