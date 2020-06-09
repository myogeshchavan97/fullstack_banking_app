CREATE DATABASE bank_account;

\c bank_account;

CREATE TABLE bank_user(
  userid BIGSERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(32) NOT NULL,
  last_name VARCHAR(32) NOT NULL,
  email VARCHAR(32) NOT NULL,
  password VARCHAR(255) NOT NULL,
  unique(email)
);

CREATE TABLE TOKENS(
  id BIGSERIAL PRIMARY KEY NOT NULL,
  access_token VARCHAR(500) NOT NULL,
  userid BIGSERIAL NOT NULL,
  FOREIGN KEY(userid) REFERENCES bank_user(userid)
);

CREATE TABLE account(
  account_id BIGSERIAL PRIMARY KEY NOT NULL,
  account_no BIGINT NOT NULL,
  bank_name VARCHAR(50) NOT NULL,
  ifsc VARCHAR(32) NOT NULL,
  userid INTEGER NOT NULL,
  total_balance BIGINT NOT NULL DEFAULT 0,
  FOREIGN KEY(userid) REFERENCES bank_user(userid)
);

CREATE TABLE transactions(
  tr_id BIGSERIAL PRIMARY KEY NOT NULL,
  transaction_date TIMESTAMP NOT NULL,
  withdraw_amount DECIMAL NULL,
  deposit_amount DECIMAL NULL,
  balance DECIMAL NOT NULL DEFAULT 0,
  account_id BIGINT NOT NULL,
  FOREIGN KEY(account_id) REFERENCES account(account_id)
);