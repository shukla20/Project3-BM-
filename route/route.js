const express=require('express')
const router=express.Router()
const bookController = require("../controller/bookController")
// const {getBookDetails}= require("../controller/bookController")
const {createUser,loginUser}= require("../controller/userController")
const {updateReview,createReview,deleteReview} = require("../controller/reviewController")
const {Authentication,Authorization} = require("../middleware/MW")





router.post("/register",createUser )
router.post("/login",loginUser )
router.post("/books",Authentication,bookController.createBook )
router.get("/books",Authentication, bookController.getBookDetails)
router.get("/books/:bookId",Authentication,bookController.getBookbyId )

router.put("/books/:bookId",Authentication,Authorization, bookController.updateBookDataById)
router.delete("/books/:bookId",Authentication,Authorization, bookController.deleteBooksById)
router.post("/books/:bookId/review",createReview )
router.put("/books/:bookId/review/:reviewId", updateReview)
router.delete("/books/:bookId/review/:reviewId", deleteReview)






module.exports=router
