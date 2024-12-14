const controllers = require('./controllers');
const mid = require('./middleware');

// middleware
const middleLogger = (req, res, next) => {
  console.log(`user is: ${req.session.account.username}`);
  next();
};

// paths
const router = (app) => {
  // get login pages
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // posts for login/signup data
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // get logout page
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // gt main pages
  app.get('/profile', mid.requiresLogin, middleLogger, controllers.Pokemon.profilePage);
  app.get('/search', mid.requiresLogin, middleLogger, controllers.Pokemon.searchPage);

  // get
  app.get('/getPokemon', mid.requiresLogin, controllers.Pokemon.getPokemon);
  app.get('/getProfile', mid.requiresLogin, controllers.Pokemon.getProfile);
  app.get('/passChange', mid.requiresLogin, controllers.Account.changePasswordPage);

  // post for password change
  app.post('/passChange', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  // get the pokemon data for search
  app.get('/all-pokemon', controllers.Pokemon.getAllPokemon);
  app.get('/pokemon', controllers.Pokemon.getPokemonByName);

  // post for adding pokemon data
  app.post('/add-pokemon', mid.requiresSecure, mid.requiresLogin, controllers.Pokemon.addPokemon);

  // delete
  app.delete('/Pokemon/:id', mid.requiresLogin, controllers.Pokemon.deletePokemon);

  // 404 page
  app.get('/*', controllers.Account.errPage);
};

// exports
module.exports = router;
