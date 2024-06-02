const{Category}=require('../models/category');
const{Category}=require('MYHERITAGE\resources\js\category.js');
const express=require('express');
const router=express.Router();

router.get('/',async(req,res)=>{
    const categoryList=await Category.find();

    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.send(categoryList);
})


router.post('/',async(req,res)=>{
    let category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
    
})

module.exports=router;