const controllers = require('./controllers');
const mid = require('./middleware');

// middleware
// const middleLogger = (req, res, next) => {
//   console.log('middleLogger!');
//   console.log(`user is: ${req.session.account.username}`);
//   next();
// };

// paths
const router = (app) => {
  // app.get('/getDPokemon', mid.requiresLogin, controllers.Pokemon.getPokemon);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  
  // app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  //  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // app.get('/maker', mid.requiresLogin, middleLogger, controllers.Pokemon.makerPage);
  // app.post('/maker', mid.requiresLogin, controllers.Pokemon.makePokemon);

  // app.delete('/Pokemon/:id', mid.requiresLogin, controllers.Pokemon.deletePokemon);

  // app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

// exports
module.exports = router;
