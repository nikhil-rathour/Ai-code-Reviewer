const express = require("express")
const aiController =  require("../controllers/ai.controler")
const router  =  express.Router()

router.post("/get-review" , aiController.getReview )

router.get("/get-review", (req, res) => {
    res.send("Api route")
})



module.exports = router;
