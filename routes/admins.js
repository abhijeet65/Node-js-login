// jshint node : true
"use strict";

const EXPRESS = require("express");
const ADMIN_ROUTER = EXPRESS.Router();
const AdminModel = require("../models/admin");

// ! ============  GET ROUTES ============

ADMIN_ROUTER.get('/signup', (req, res) => {
      let renderVar = {
            page_title: "signup-form",
            render_page: "./admin_pages/admin_signup",
            errors: undefined,
      };
      res.render("template", renderVar);
});


ADMIN_ROUTER.get('/login', (req, res) => {
      let renderVar = {
            page_title: "ADMIN-Login",
            render_page: "./admin_pages/admin_login",
            errors: undefined,
      };
      res.render("template", renderVar);
});


// ! ============  POST ROUTES ============



// ! ============  DELETE ROUTES ============



// ? ============  export router ============
module.exports = ADMIN_ROUTER;