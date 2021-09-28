const express = require("express");
const { createSubscription, getAllSubscription } = require("./subscription.controller");
const router = express.Router();


router.post("/add", createSubscription);
router.get("/all", getAllSubscription);
// var currentDate = moment('2015-12-30');
// var futureMonth = moment(currentDate).add(1, 'M');
// var futureMonthEnd = moment(futureMonth).endOf('month');

// if(currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
//     futureMonth = futureMonth.add(1, 'd');
// }

// console.log(currentDate.format('DD-MM-YYYY'));
// console.log(futureMonth.format('DD-MM-YYYY'));

module.exports = router;