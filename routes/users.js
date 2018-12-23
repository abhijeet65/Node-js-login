// jshint node : true
"use strict";

const EXPRESS = require("express");
const USER_ROUTER = EXPRESS.Router();
const UserModel = require("../models/user");

const PASSPORT = require("passport"),
      BCRYPT_JS = require("bcryptjs");

// ! ============  GET ROUTES ============


USER_ROUTER.get('/signup', (req, res) => {
      let renderVar = {
            page_title: "signup-form",
            render_page: "./user_pages/user_signup",
            errors: undefined,
      };
      res.render("template", renderVar);
});


USER_ROUTER.get('/login', (req, res) => {
      let renderVar = {
            page_title: "login-form",
            render_page: "./user_pages/user_login",
            errors: undefined,
      };
      res.render("template", renderVar);
});


USER_ROUTER.get('/logout', (req, res) => {
      req.logOut();
      req.flash("success", "Successfully loged out");
      res.redirect("/users/login");
});

// ! ============  POST ROUTES ============


USER_ROUTER.post('/signup', (req, res) => {
      req.checkBody("user_name", "Name is required").notEmpty();
      req.checkBody("user_email", "Email is required").notEmpty();
      req.checkBody("user_password", "Password is required and should be:   min 5  & max 20  characters long.").isLength({
            min: 5,
            max: 20
      });
      req.checkBody("user_password_confirm", "Passwords do not match").equals(req.body.user_password);

      // req.checkBody("", "");    ----> not checking the radio button

      let errors = req.validationErrors();
      if (errors) {
            let renderVar = {
                  page_title: "signudafdasp-form",
                  render_page: "./user_pages/user_signup",
                  errors: errors,
            };
            res.render("template", renderVar);
      } else {
            //? genereat a secure password
            let salt = BCRYPT_JS.genSaltSync(10);
            let securePass = BCRYPT_JS.hashSync(req.body.user_password, salt);

            //! crate a new user and insert into collection
            let newUser = new UserModel({
                  username: req.body.user_name,
                  emal: req.body.user_email,
                  password: securePass
            });

            newUser.save((err) => {
                  if (err) {
                        req.flash("danger", " not able to register " + newUser.username);
                        console.log(err);
                  } else {
                        req.flash("success", newUser.username + " registered successfully.");
                        res.redirect("/users/login");
                  }
            });
      }
});




USER_ROUTER.post('/login', (req, res, next) => {

      req.checkBody("username", "Name is required.").notEmpty();
      req.checkBody("password", "Password is required and should be:   min 5  & max 20  characters long.").isLength({
            min: 5,
            max: 20
      });

      let errors = req.validationErrors();
      if (errors) {
            let renderVar = {
                  page_title: "login-form",
                  render_page: "./user_pages/user_login",
                  errors: errors,
            };
            res.render("template", renderVar);
      } else {
            //? authenticate the user
            PASSPORT.authenticate('local', {
                  successRedirect: "/",
                  failureRedirect: "/users/login",
                  failureFlash: true,
                  successFlash: "successfully loged in",
            })(req, res, next);

            //! NOTE :
            // ? WHEN WE ARE LOGGED IN : passport creates a req.user object --> and we can check for that do enable and disable certain things , like functionality
            // ? SO WE WANT TO ACCESS THIS   req.user object every where  : SO WE CAN create a GLOBAL variable

      }

});




// ! ============  DELETE ROUTES ============



// ? ============  export router ============
module.exports = USER_ROUTER;