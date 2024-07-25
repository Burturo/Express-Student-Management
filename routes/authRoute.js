const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { User, Person, sequelize, QueryTypes } = require('../models/model');

// Route pour afficher la page de login
router.get('/', (req, res) => {
  res.render('login');
});

// Route pour afficher la page d'inscription
router.get('/register', (req, res) => {
  res.render('register');
});

// Route pour afficher la page d'accueil
router.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('dashboard', { user: req.user });
});

// Route pour gérer l'inscription d'un utilisateur
router.post('/registration', async (req, res) => {
  const { nom, mail, password, confirme_pass, direction } = req.body;

  // Vérification si les mots de passe correspondent
  if (password !== confirme_pass) {
    return res.render('register', { error: 'Les mots de passe ne correspondent pas' });
  }

  // Vérification si la direction est sélectionnée
  if (!direction) {
    return res.render('register', { error: 'Veuillez sélectionner une direction' });
  }

  // Vérification si l'utilisateur existe déjà
  const existingUser = await User.findOne({ where: { username: mail } });
  if (existingUser) {
    return res.render('register', { error: 'Nom d\'utilisateur déjà utilisé' });
  }

  // Hashage du mot de passe
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) throw err;

    // Création d'un utilisateur et d'une personne associée
    try {
      const user = await User.create({ username: mail, password: hash });
      const person = await Person.create({ FirstName: nom, Email: mail, userId: user.userId, Type: direction });

      // Redirection vers la page de login après l'inscription réussie
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erreur lors de l\'inscription' });
    }
  });
});

// Route pour gérer la connexion d'un utilisateur
router.post('/authentification', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.render('login', { error: 'Échec de l\'authentification' }); }

    req.logIn(user, async (err) => {
      if (err) { return next(err); }

      try {
        // Récupérer les informations de la table Person en utilisant userId
        const person = await Person.findOne({ where: { userId: user.userId } });
        if (!person) {
          return res.render('login', { error: 'Erreur lors de la récupération des informations utilisateur' });
        }

        // Stocker des informations supplémentaires dans la session
        req.session.user = {
          id: user.userId,
          username: user.username,
          userType: person.Type // Stocker le type d'utilisateur
        };

        return res.redirect('/dashboard/dashboard');
      } catch (error) {
        console.error(error);
        return res.render('login', { error: 'Erreur lors de la récupération des informations utilisateur' });
      }
    });
  })(req, res, next);
});

// Route pour gérer la déconnexion
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(); // Détruire la session après la déconnexion
    res.redirect('/');
  });
});

module.exports = router;
