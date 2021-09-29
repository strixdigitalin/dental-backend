var express = require("express");
var router = express.Router();
const authRoute = require("../api/auth/auth.route");
const categoryRoute = require("../api/functional_knowledge/category.route");
const questionRoute = require("../api/question/question.route");
const subcategoryRoute = require("../api/topics/subcategory.route");
const subscriptionRoute = require("../api/subscription/subscription.route");
const testResultRoute = require("../api/test_results/test_result.route");
const SubTopicRoute = require("../api/subtopics/subtopics.route");
const ProfileRoute = require("../api/profile/profile.route");
// @route - https://dworld-backend.herokuapp.com/api/v1

router.use("/auth", authRoute);
router.use("/functionalKnowledge", categoryRoute);
router.use("/question", questionRoute);
router.use("/topic", subcategoryRoute);
router.use("/subscription", subscriptionRoute);
router.use("/testResult", testResultRoute);
router.use("/subtopic", SubTopicRoute);
router.use("/profile", ProfileRoute);
// router.use("/test", testRoute);

module.exports = router;
