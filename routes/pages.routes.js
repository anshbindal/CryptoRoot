const router = require("express").Router();

const UserModel = require('../models/User.model')
const CoinModel = require('../models/Coins.model')
const axios = require("axios");

const Coin = require("../models/Coins.model");

// 123Abc!!

function checkUser(req, res, next){
    if (req.session.loggedInUser ) {
        next()
    }
    else {
        res.redirect('/login')
    }
}



    




// pulls info from profile form, in to req. get by using req.body

router.post('/profile', (req, res, next) => {
    console.log(req.body)
    const {coins, purchasedPrice, quanity } = req.body
    const {_id} = req.session.loggedInUser
    console.log(coins, purchasedPrice, quanity)
    CoinModel.create({coins, purchasedPrice, quanity, userId: _id})
    .then(() => {
        console.log("coin selected sucessfully")
        res.redirect('/profile');
    })
    .catch((err) => {
        next(err)
    })
})


//maybe if we need to populate full user info

// router.get('/profile', (req, res, next) => {
//     CoinModel.find().populate('userId')
//       .then(( data) => {
//         console.log(data)
//           res.json(data)
//       })
//       .catch((err) => {
//         next(err)
//       })
// })


router.get('/wallet', () => {
    CoinModel.find({userId: req.session.loggedInUser._id})
        .then((coins) => {
            let coinSymbols = coins.map(obj => obj.coins)
            let apires = axios.request()
            apires.data.forEach(() => {

            })
        })
})


//  news api

const options = {
    method: 'GET',
    url: 'https://crypto-news-live3.p.rapidapi.com/news',
    headers: {
      'X-RapidAPI-Key': '8784912ff7msh059048cc966813ap157d9fjsnfd45ffdcab31',
      'X-RapidAPI-Host': 'crypto-news-live3.p.rapidapi.com'
    }
  };

  router.get("/news", (req, res) => {
    axios.request(options, { limit: 10})
    .then(function (response) {
    res.render("news.hbs", {news: response.data})
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});
})





module.exports = router;
