const express = require('express');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const accountRoute = require('./routes/account');
const transactionsRoute = require('./routes/transactions');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.set('view engine', 'ejs');
app.use(authRoute);
app.use(accountRoute.Router);
app.use(profileRoute);
app.use(transactionsRoute);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
