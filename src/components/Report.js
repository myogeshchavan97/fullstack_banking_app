import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const Report = ({ transactions }) => {
  return (
    <div className="report-table">
      <BootstrapTable data={transactions} striped hover pagination>
        <TableHeaderColumn isKey dataField="formatted_date">
          Date
        </TableHeaderColumn>
        <TableHeaderColumn dataField="deposit_amount">
          Deposits
        </TableHeaderColumn>
        <TableHeaderColumn dataField="withdraw_amount">
          Withdrawals
        </TableHeaderColumn>
        <TableHeaderColumn dataField="balance">Balance</TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
};

export default Report;
