const router = require("express").Router();
const CoinModel = require("../models/Coin.model");
const axios = require("axios");

function checkUser(req, res, next) {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.redirect("/login");
  }
}




// renders profile.hbs

router.get("/profile", checkUser, (req, res) => {
  res.render("auth/profile.hbs", { loggedInUser: req.session.loggedInUser });
});

// pulls info from profile form, in to req. get by using req.body

router.post("/profile", (req, res, next) => {
  //   console.log(req.body);
  const { coin, purchasedPrice, quantity } = req.body;
  const { _id } = req.session.loggedInUser;
  //   console.log(coin, purchasedPrice, quantity);
  CoinModel.create({
    coin,
    purchasedPrice,
    quantity,
    purchaseValue: purchasedPrice * quantity,
    userId: _id,
  })
    .then(() => {
      console.log("coin selected sucessfully");
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
    });
});
function priceApi() {
  let response = null;
  return new Promise(async (resolve, reject) => {
    try {
      response = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        {
          headers: {
            "X-CMC_PRO_API_KEY": "824bbdd4-d5e7-4ae8-85e2-358de206f1fa",
          },
        }
      );
    } catch (ex) {
      response = null;
      // error
      console.log(ex);
      reject(ex);
    }
    if (response) {
      // success
      const json = response.data;
      //   console.log(json);
      resolve(json);
    }
  });
}

router.get("/wallet", async (req, res, next) => {
  const { _id } = req.session.loggedInUser;
  const apiResult = await priceApi();
  const apiData = apiResult.data;

  // console.log(apiResult.data);

  CoinModel.find({ userId: _id })
    .then((data) => {
      console.log("This is the list of coins this user has :=======> ", data);

      let finalData = data.map((ele) => {
        console.log("Ele :=====> ", ele);

        let filteredData = apiData.filter((element) => {
          return element.symbol === ele.coin;
        });

        console.log(
          "This is the coin that matched ele.coin :=====> ",
          filteredData
        );

        const price = filteredData[0].quote.USD.price;
        console.log("price of that coin :========> ", price);

        return {
          coin: ele.coin,
          quantity: ele.quantity,
          purchaseValue: ele.purchaseValue,
          currentValue: (ele.quantity * price).toFixed(0),
          price : price,
        };
      });

      //   console.log("finalData", finalData);

      res.render("wallet.hbs", { finalData });
    })
    .catch((err) => {
      next(err);
    });
});





router.get("/edit", (req, res, next) => {
    const { _id } = req.session.loggedInUser;
console.log(_id)
  
    // console.log(apiResult.data);
  
    CoinModel.find({ userId: _id })
      .then((data) => {
        console.log("This is the list of coins this user has :=======> ", data);
        

 
        //   console.log("finalData", finalData);
  
        res.render("edit.hbs", {data});
      })
      .catch((err) => {
        next(err);
      });
  });


  router.post('/edit', (req, res) => {
    let= { _id } = req.session.loggedInUser;
    userId = _id
    console.log(req.body)
    CoinModel.findOneAndUpdate({ _id: userId }, req.body)
        .then(() => {
          res.redirect(`/wallet`)
        })
        .catch((err) => {
          console.log('Some error in finding', err)
        })
    // Iteration #4: Update the drone
    // ... your code here
  });




  router.post('/delete', (req, res, next) => {
    const { _id } = req.session.loggedInUser;
    
    
    CoinModel.findOneAndDelete({ _id : id })
      .then(() => {
        res.redirect(`/wallet`) // redirects to HOME PAG
      })
      .catch((err) => {
        console.log('Some error in finding', err)
      })
    // Iteration #5: Delete the drone
    // ... your code here
  });



//   router.post("/wallet", async (req, res, next) => {
//     const { _id } = req.session.loggedInUser;


 // news api

const options = {
  method: "GET",
  url: "https://crypto-news-live3.p.rapidapi.com/news",
  headers: {
    "X-RapidAPI-Key": "8784912ff7msh059048cc966813ap157d9fjsnfd45ffdcab31",
    "X-RapidAPI-Host": "crypto-news-live3.p.rapidapi.com",
  },
};

router.get("/news", (req, res) => {
  axios
    .request(options, { limit: 10 })
    .then(function (response) {
      res.render("news.hbs", { news: response.data });
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = router;
