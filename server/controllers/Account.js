// import
const models = require('../models');

const { Account } = models;

// pages
const loginPage = (req, res) => res.render('login');
const errPage = async (req, res) => res.render('404');

// logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// pass change
const changePasswordPage = (req, res) => {
  res.render('changePassword');
};

// login
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/profile' });
  });
};

// sign up
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All feilds are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/profile' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

// Function to handle password change logic
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Check if the current password is correct
    const account = await Account.findById(req.session.account._id);
    const isValidPassword = await account.comparePassword(currentPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect current password!' });
    }

    // Update the password
    const hash = await Account.generateHash(newPassword);
    account.password = hash;
    await account.save();

    return res.json({ redirect: '/profile' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while updating password' });
  }
};

// exports
module.exports = {
  loginPage,
  errPage,
  login,
  logout,
  signup,
  changePasswordPage,
  changePassword,
};
