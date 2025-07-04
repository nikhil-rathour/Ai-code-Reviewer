const express = require("express")
const aiController =  require("../controllers/ai.controler")
const router  =  express.Router()

router.post("/get-review" , aiController.getReview )

router.get("/get-review", (req, res) => {
    res.send("Welcome to the AI Code Reviewer API Server")
})



module.exports = router;
