const express = require('express');
const router = express.Router();

const Category = require('../models/Category');

async function GetCategories() {
    return await Category.findAll({ order: ['category_id', 'name'] });
}

async function GetCategoryByID(category_id) {
    return categories = await Category.findByPk(category_id);   
}

router.get("/",  async (req, res) => {
    //Returns a List of categories   
    const categories = await GetCategories();
    res.send(categories);            
});

router.get("/:category_id", async (req, res) => {
    //Returns a category by ID    
    const pk = parseInt(req.params.category_id);
    
    const category = await GetCategoryByID(pk);
    if (category === null) return res.status(400).send({
        "code": "CAT_01",
        "message": "There doesn't exist a category with this ID.",
        "field": "category_id",
        "status": "400"
    });    
        
    res.send(category);

});

module.exports = router;