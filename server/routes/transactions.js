const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getClient } = require('../db/connect');
const Router = express.Router();

Router.post('/deposit/:id', authMiddleware, async (req, res) => {
  const client = await getClient();
  try {
    await client.query('begin');
    const { transaction_date, deposit_amount } = req.body;
    const account_id = req.params.id;
    const result = await client.query(
      'select total_balance from account where account_id=$1',
      [account_id]
    );
    const total_balance = +result.rows[0].total_balance;
    const total = total_balance + deposit_amount;
    await client.query(
      'insert into transactions(transaction_date, deposit_amount, account_id, balance) values($1,$2,$3,$4) returning *',
      [transaction_date, deposit_amount, account_id, total]
    );
    await client.query(
      'update account set total_balance = total_balance + $1 where account_id=$2',
      [deposit_amount, account_id]
    );
    await client.query('commit');
    res.send();
  } catch (error) {
    await client.query('rollback');
    res.status(400).send({
      add_error: 'Error while depositing amount..Try again later.'
    });
  }
});

Router.post('/withdraw/:id', authMiddleware, async (req, res) => {
  const client = await getClient();
  try {
    await client.query('begin');
    const { transaction_date, withdraw_amount } = req.body;
    const account_id = req.params.id;
    const result = await client.query(
      'select total_balance from account where account_id=$1',
      [account_id]
    );
    const total_balance = +result.rows[0].total_balance;
    const total = total_balance - withdraw_amount;

    if (withdraw_amount <= total_balance) {
      await client.query(
        'insert into transactions(transaction_date, withdraw_amount, account_id, balance) values($1,$2,$3,$4) returning *',
        [transaction_date, withdraw_amount, account_id, total]
      );
      await client.query(
        'update account set total_balance = total_balance - $1 where account_id=$2',
        [withdraw_amount, account_id]
      );
      await client.query('commit');
    } else {
      return res.status(400).send({
        withdraw_error: "You don't have enough balance in your account"
      });
    }
    res.send();
  } catch (error) {
    await client.query('rollback');
    res.status(400).send({
      withdraw_error: 'Error while withdrawing amount..Try again later.'
    });
  }
});

module.exports = Router;
