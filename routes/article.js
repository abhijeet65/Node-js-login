// jshint node : true
"use strict";

const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();

const ArticleModel = require("../models/article");
const UserModel = require("../models/user");


// ! ============  GET ROUTES ============

// ? GET
ROUTER.get('/add', ensureAuthenticated, (req, res) => {
      let renderVar = {
            render_page: "./article_pages/add_article", // index.ejs
            page_title: "Add Articles",
            errors: undefined,
      };
      res.render("template", renderVar);
});


// ? GET
ROUTER.get('/:_id', ensureAuthenticated, (req, res) => {
      let article_id = req.params._id;


      ArticleModel.findById(article_id, (err, article) => {
            if (err) {
                  throw new Error("ERROR : finding article in DB, So, can't read the article ");
            }

            let user_id = article.author;
            UserModel.findById(user_id, (err, user) => {
                  if (err) {
                        throw new Error("ERROR : finding article's author name in DB");
                  }

                  // console.log(user);
                  article.name_of_writer = user.username;
                  let renderVar = {
                        render_page: "article_pages/read_article", // looks in views
                        page_title: article.title,
                        article: article,
                        errors: undefined,
                  };

                  res.render("template", renderVar);
            });
      });
});


// ! ============  POST ROUTES ============


// ? POST
ROUTER.post('/add', ensureAuthenticated, (req, res) => {
      // ! validate the changes
      req.checkBody('article_title', 'Article title required').notEmpty();
      // req.checkBody('article_author_name', 'Author Name required').notEmpty();
      req.checkBody('article_body', 'Content is required').notEmpty();

      var errors = req.validationErrors();

      if (errors) {
            let renderVar = {
                  render_page: "./article_pages/add_article", // index.ejs
                  page_title: "Add Articles",
                  errors: errors,
            };
            res.render("template", renderVar);
      } else {
            let article = new ArticleModel();
            article.title = req.body.article_title;
            article.author = req.user._id; // ? as we will be loged in  when writting this article
            article.body = req.body.article_body;

            article.save((err) => {
                  if (err) {
                        let errorMessage = "Article could NOT be SAVED in database";
                        req.flash("danger", errorMessage);
                        console.log(err);
                  } else {
                        req.flash('success', "Article added");
                  }
                  res.redirect('/');
            });
      }
});


// ? POST
ROUTER.post('/update', ensureAuthenticated, (req, res) => {
      let article_id = req.body.article_id; // ! getting _id to update  ---> hidden attribute in html

      // ! validate the changes
      req.checkBody('article_title', 'Article title required').notEmpty();
      req.checkBody('article_author_name', 'Author Name required').notEmpty();
      req.checkBody('article_body', 'Content is required').notEmpty();

      var errors = req.validationErrors();

      if (errors) {
            res.errors = errors; //! CURRENTLY doesn't work righ now, --> resolves to be undefined
            console.log("resolve this errors in the page-error");
            console.log(errors);
            res.redirect("/article/edit/" + article_id);
      } else {
            let article = {};
            article.title = req.body.article_title;
            article.author = req.body.article_author_name;
            article.body = req.body.article_body;

            let query = {
                  _id: article_id
            };

            ArticleModel.updateOne(query, article, (err) => {
                  if (err) {
                        let errorMessage = "Article could not be UPDATED in database";
                        throw new Error(errorMessage);
                  }
                  req.flash('success', "Article updated");
                  res.redirect('/article/' + article_id);
            });
      }
});


// ? POST
ROUTER.get('/edit/:_id', ensureAuthenticated, (req, res) => {
      let article_id = req.params._id;

      ArticleModel.findById(article_id, (err, article) => {
            if (err) {
                  throw new Error("ERROR : finding article in DB, So, can't read the article ");
            }
            if (article.author !== req.user.id) {
                  req.flash("danger", "Not authorized");
                  res.redirect("/");
            } else {
                  let renderVar = {
                        render_page: "./article_pages/edit_article", // index.ejs
                        page_title: "Edit Article",
                        article: article,
                        errors: res.errors
                  };
                  // console.log(renderVar.errors);
                  res.render("template", renderVar);
            }
      });
});


// ! ============  DELETE ROUTES ============

// ? DELETE
ROUTER.delete('/:_id', (req, res) => { //  ensureAuthenticated  ---> will not work, as the DELETE reques is generated by AJAX
      // ? CHECK if user is loged in
      if (req.user === null) {
            res.status(500).send();
      } else {
            let article_id = req.params._id;

            //? check if the article belongs to this user or not
            ArticleModel.findById(article_id, (err, article) => {
                  if (article.author === req.user.id) {
                        let query = {
                              _id: article_id
                        };
                        ArticleModel.deleteOne(query, function (err) {
                              if (err) {
                                    throw new Error(`Article could not be deleted`);
                              } else {
                                    req.flash("danger", "Article deleted");
                                    res.send("success");
                              }
                        });
                  } else {
                        res.status(500).send(); // ? not  deleted
                  }
            });

      }
});



// ! ============  DELETE ROUTES ============
function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
            next();
      } else {
            req.flash("danger", "plz login");
            res.redirect("/users/login");
      }
}

// ? ============  export router ============
module.exports = ROUTER;