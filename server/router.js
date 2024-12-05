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
  app.get('/profile', mid.requiresLogin, middleLogger, controllers.Pokemon.profilePage);

  // get
  app.get('/getPokemon', mid.requiresLogin, controllers.Pokemon.getPokemon);
  app.get('/getProfile', mid.requiresLogin, controllers.Pokemon.getProfile);
  // app.post('/home', mid.requiresLogin, controllers.Pokemon.makePokemon);

  // delete
  app.delete('/Pokemon/:id', mid.requiresLogin, controllers.Pokemon.deletePokemon);

  // 404 page
  app.get('/*', controllers.Account.errPage);
};

// exports
module.exports = router;
