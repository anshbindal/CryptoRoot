const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// router.get('/signup', (req, res) => {
//   res.render('auth/signup.hbs')
// })

module.exports = router;
