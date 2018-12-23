// jshint node : true
"use strict";


const LOCAL_STRATEGY = require("passport-local").Strategy,
      BCRYPT_JS = require("bcryptjs");

const UserModel = require("../models/user");


let passport_authentication_functionality = function (PASSPORT) { //  implemeting the local strategy

      PASSPORT.use(new LOCAL_STRATEGY((username, password, done) => {
            // ? match username
            let query = {
                  username: username
            };
            UserModel.findOne(query, (err, user) => {
                  if (err) {
                        return done(err);
                  }
                  if (!user) {
                        return done(null, false, {
                              message: 'No such user.'
                        });
                  }
                  //? compare password hashes
                  let matched = BCRYPT_JS.compareSync(password, user.password);
                  if (!matched) {
                        return done(null, false, {
                              message: 'Wrong password.'
                        });
                  }
                  //? password matched
                  return done(null, user);
            });
      }));


      //* to support user login  sessions. PASSPORT will serialize & deserialize user instances to and from the sesssion

      // serialize user
      PASSPORT.serializeUser((user, done) => {
            done(null, user.id);
      });

      // de-serialize user
      PASSPORT.deserializeUser((id, done) => {
            UserModel.findById(id, (err, user) => {
                  done(err, user);
            });
      });

};


module.exports = passport_authentication_functionality;