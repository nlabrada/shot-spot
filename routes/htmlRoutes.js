// var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/home", function(req, res) {
    res.render("home");
  });

  //Load home page
  app.get("/cheap", function(req, res) {
    res.render("cheap");
  });

  app.get("/happyhour", function(req, res) {
    res.render("happyhour");
  });

  app.get("/unique", function(req, res) {
    res.render("unique");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
