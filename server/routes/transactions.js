const path = require('path');
const fs = require('fs');
const express = require('express');
const moment = require('moment');
const ejs = require('ejs');
const func = require('./account');
const authMiddleware = require('../middleware/auth');
const { getTransactions, generatePDF } = require('../utils/common');
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
  } finally {
    client.release();
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
  } finally {
    client.release();
  }
});

Router.get('/transactions/:id', authMiddleware, async (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    const result = await getTransactions(req.params.id, start_date, end_date);
    res.send(result.rows);
  } catch (error) {
    res.status(400).send({
      transactions_error:
        'Error while getting transactions list..Try again later.'
    });
  }
});

Router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const account_id = req.params.id;
    const result = await getTransactions(account_id, start_date, end_date);
    const basePath = path.join(__dirname, '..', 'views');
    const templatePath = path.join(basePath, 'transactions.ejs');
    const templateString = ejs.fileLoader(templatePath, 'utf-8');
    const template = ejs.compile(templateString, { filename: templatePath });
    const accountData = await func.getAccountByAccountId(account_id);
    accountData.account_no = accountData.account_no
      .slice(-4)
      .padStart(accountData.account_no.length, '*');
    const output = template({
      start_date: moment(start_date).format('Do MMMM YYYY'),
      end_date: moment(end_date).format('Do MMMM YYYY'),
      account: accountData,
      transactions: result.rows
    });
    fs.writeFileSync(
      path.join(basePath, 'transactions.html'),
      output,
      (error) => {
        if (error) {
          throw new Error();
        }
      }
    );
    const pdfSize = await generatePDF(basePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfSize
    });
    res.sendFile(path.join(basePath, 'transactions.pdf'));
  } catch (error) {
    res.status(400).send({
      transactions_error: 'Error while downloading..Try again later.'
    });
  }
});

module.exports = Router;
