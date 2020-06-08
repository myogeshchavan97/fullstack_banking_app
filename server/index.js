const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(authRoute);
app.use(profileRoute);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
