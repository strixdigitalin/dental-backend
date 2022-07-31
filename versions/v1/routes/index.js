var express = require("express");
var router = express.Router();
const authRoute = require("../api/auth/auth.route");
const SubjectRoute = require("../api/subjects/subject.route");
const PackageRoute = require("../api/package/subject.route");
const PackageQuestion = require("../api/packageQuestion/question.route");
const TestResult = require("../api/package_test_result/test_result.route");
const questionRoute = require("../api/question/question.route");
const subcategoryRoute = require("../api/topics/topics.route");
const subscriptionRoute = require("../api/subscription/subscription.route");
const testResultRoute = require("../api/test_results/test_result.route");
const SubTopicRoute = require("../api/subtopics/subtopics.route");
const ProfileRoute = require("../api/profile/profile.route");
const adminAuthRoute = require("../api/adminAuth/adminAuth.route");
const uploadImgRoute = require("../api/upload/uploadImage");
const dashboardRoute = require("../api/dashboard/dashboard.route");
const paymentRoute = require("../api/payments/payment.route");
// @route - https://dworld-backend.herokuapp.com/api/v1

router.use("/auth", authRoute);
router.use("/subject", SubjectRoute);
router.use("/package", PackageRoute);
router.use("/package-question", PackageQuestion);
router.use("/package-test-result", TestResult);
router.use("/question", questionRoute);
router.use("/topic", subcategoryRoute);
router.use("/subscription", subscriptionRoute);
router.use("/testResult", testResultRoute);
router.use("/subtopic", SubTopicRoute);
router.use("/profile", ProfileRoute);
router.use("/adminAuth", adminAuthRoute);
router.use("/upload", uploadImgRoute);
router.use("/dashboard", dashboardRoute);
router.use("/payment", paymentRoute);
// router.use("/test", testRoute);

module.exports = router;
