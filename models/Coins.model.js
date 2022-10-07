const { Schema, model } = require("mongoose");


require('./User.model')

const coinSchema = new Schema(
  {
    coins: String,
    purchasedPrice: Number ,
    quanity: Number,
    userId : {
      type: Schema.Types.ObjectId,
      ref: "User"
    }

  }
);

const Coin = model("Coin", coinSchema);

module.exports = Coin;
