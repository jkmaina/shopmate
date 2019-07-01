const express = require('express');
const router = express.Router();
const _ = require('lodash');

const Category = require('../models/Category');
const db = require('../startup/database');


async function GetCategories(limit, page, sort) {            
    offset = limit * (page - 1);
    let categories = await Category.findAndCountAll({
        order: sort,
        limit: limit,
        offset: offset
    });
    let categoriesFormatted = _.map(categories.rows, function (category) {
        var attr = {
                    "\"category_id\"": category.category_id,
                    "\"department_id\"": category.department_id,
                    "\"name\"": category.name,
                    "\"description\"": category.description             
        };
        return attr;
    });    
    
    var categoriesFormattedSummary = {
        "\"count\"": categories.count,
        "\"rows\"": categoriesFormatted
    };
    return categoriesFormattedSummary;
}

async function GetCategoryByID(category_id) {
    return categories = await Category.findByPk(category_id);   
}

async function GetCategoryByProductID(prod_id) {
    let category = await db.query('CALL catalog_get_categories_for_product(:product_id)', {
        replacements: { product_id: prod_id },
        model: Category,
        mapToModel: true
    });
    return category;
}

async function GetCategoryByDepartmentID(dept_id) {
    let category = await db.query('CALL catalog_get_department_categories(:department_id)', {
        replacements: { department_id: dept_id },
        model: Category,
        mapToModel: true
    });
    return category;
}

router.get("/",  async (req, res) => {

    //Returns a List of categories
    var limit = parseInt(req.query.limit);
    var page = parseInt(req.query.page);
    var sort = [];
    var presort = [];
    
    let x = req.query.order;
    if (x) {
        
        let index = x.indexOf(",");
        let name;
        if (index === -1) {
           name = x;
        } else {
           name = x.substr(0, index);
        }
        
        let desc = x.substr(index + 1);

        if (name !== 'name' && name !=='category_id') {
            return res.status(400).send({
                "code": "PAG_02",
                "message": "The order field specified does not allow sorting." + index,                
                "status": "400"
            });
        }

        if (desc !== 'DESC' && desc !== 'ASC') {
            return res.status(400).send({
                "code": "PAG_01",
                "message": "The order field specified does not match the format 'field,(DESC|ASC)'",
                "status": "400"
            });
        }
        presort.push(name);
        presort.push(desc);
        sort[0] = presort;
    }
    
    if (!limit) limit = 20;    
    if (!page) page = 1;
    if (!sort) sort = ['category_id', 'name'];
        
    const categories = await GetCategories(limit,page,sort);
    res.send(categories);            
});

router.get("/:category_id", async (req, res) => {
    //Returns a category by ID    
    const pk = parseInt(req.params.category_id);
    
    if (isNaN(pk)) {
        return res.status(400).send({
            "code": "CAT_01",
            "message": "There doesn't exist a category with this ID.",
            "field": "category_id",
            "status": "400"
        });
    }

    const category = await GetCategoryByID(pk);
    if (category === null) return res.status(400).send({
        "code": "CAT_01",
        "message": "There doesn't exist a category with this ID.",
        "field": "category_id",
        "status": "400"
    });    
        
    res.send(category);

});


router.get("/inProduct/:product_id", async (req, res) => {
    //Returns a category by Product ID    
    const pk = parseInt(req.params.product_id);

    if (isNaN(pk)) {
        return res.status(400).send({
            "code": "CAT_01",
            "message": "There doesn't exist a category with this ID.",
            "field": "category_id",
            "status": "400"
        });
    }

    const category = await GetCategoryByProductID(pk);
    if (category[0].length === 0) return res.status(400).send({
        "code": "CAT_01",
        "message": "There doesn't exist a category with this ID.",
        "field": "product_id",
        "status": "400"
    });

    var category_detail = {
        "category_id": 0,
        "department_id": 0,
        "name": ""
    };
    category_detail.category_id = category[0][0].category_id;
    category_detail.department_id = category[0][0].department_id;
    category_detail.name = category[0][0].name;

    res.send(category_detail);

});

router.get("/inDepartment/:department_id", async (req, res) => {
    //Returns a category by Department ID    
    const pk = parseInt(req.params.department_id);

    if (isNaN(pk)) {
        return res.status(400).send({
            "code": "CAT_01",
            "message": "There doesn't exist a category with this ID.",
            "field": "category_id",
            "status": "400"
        });
    }

    const category = await GetCategoryByDepartmentID(pk);
    if (category[0].length === 0) return res.status(400).send({
        "code": "CAT_01",
        "message": "There doesn't exist a category with this ID.",
        "field": "product_id",
        "status": "400"
    });

    var category_detail = {
        "category_id": 0,
        "department_id": 0,
        "name": "",
        "description": ""
    };
    category_detail.category_id = category[0][0].category_id;
    category_detail.department_id = category[0][0].department_id;
    category_detail.name = category[0][0].name;
    category_detail.description = category[0][0].description;

    res.send(category_detail);

});

module.exports = router;