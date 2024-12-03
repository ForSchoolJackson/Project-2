const controllers = require('./controllers');
const mid = require('./middleware');

// middleware
const middleLogger = (req, res, next) => {
  console.log(`user is: ${req.session.account.username}`);
  next();
};

// paths
const router = (app) => {
  // login page
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // posts
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // logout
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // main page
  app.get('/collector', mid.requiresLogin, middleLogger, controllers.Pokemon.profilePage);

  // app.get('/getPokemon', mid.requiresLogin, controllers.Pokemon.getPokemon);
  // app.post('/home', mid.requiresLogin, controllers.Pokemon.makePokemon);

  // app.delete('/Pokemon/:id', mid.requiresLogin, controllers.Pokemon.deletePokemon);
};

// exports
module.exports = router;
