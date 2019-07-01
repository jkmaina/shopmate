const express = require('express');
const router = express.Router();
const winston = require('winston');
const _ = require('lodash');

const Attribute = require('../models/Attribute');
const AttributeValue = require('../models/AttributeValue');
const db = require('../startup/database');


async function GetAttributes(limit, page, sort) {            
    let attributes = await db.query('CALL catalog_get_attributes', {
        model: Attribute,
        mapToModel: true
    });
    let attributesFormatted = _.map(attributes[0], function (attribute) {
        let attr = {
            "\"attribute_id\"": attribute.attribute_id,
            "\"name\"": attribute.name
        };
        return attr;
    });
    return attributesFormatted;
}

async function GetAttributesByID(attr_id) {
    attribute = await Attribute.findByPk(attr_id);
    if (attribute === null) return null;
    let attr = {
        "\"attribute_id\"": attribute.attribute_id,
        "\"name\"": attribute.name
    };
    return attr;    
}

async function GetAttributeValuesByAttributeID(attr_id) {
    let attributeValues = await db.query('CALL catalog_get_attribute_values(:attribute_id)', {
        replacements: { attribute_id: attr_id },
        model: AttributeValue,
        mapToModel: true
    });
    let attributesFormatted = _.map(attributeValues[0], function (attributeValue) {
        let attr = {
            "\"attribute_value_id\"": attributeValue.attribute_value_id,
            "\"value\"": attributeValue.value
        };
        return attr;
    });
    return attributesFormatted;
}

async function GetAttributesByProductID(prod_id) {
    let attributesVP = await db.query('CALL catalog_get_product_attributes(:product_id)', {
        replacements: { product_id: prod_id },
        model: Attribute,
        mapToModel: false
    });

    let attributesFormatted = _.map(attributesVP[0], function (attributeP) {
        let attr = {
            "\"attribute_name\"": attributeP.attribute_name//,
            //"\"attribute_value_id\"": attributeP.attribute_value_id,
            //"\"attribute_value\"": attributeP.attribute_value
        };
        return attr;
    });
    return attributesFormatted;
    
}

router.get("/",  async (req, res) => {
    //Returns a List of attributes    
    const attributes = await GetAttributes();
    res.send(attributes);
});

router.get("/:attribute_id", async (req, res) => {
    //Returns an attribute by ID    
    const pk = parseInt(req.params.attribute_id);
    
    if (isNaN(pk)) {
        return res.status(400).send({
            "code": "ATR_01",
            "message": "There doesn't exist an attribute with this ID.",
            "field": "attribute_id",
            "status": "400"
        });
    }

    const attribute = await GetAttributesByID(pk);
    if (attribute === null) return res.status(400).send({
        "code": "ATR_01",
        "message": "There doesn't exist an attribute with this ID.",
        "field": "attribute_id",
        "status": "400"
    });    
        
    res.send(attribute);

});


router.get("/values/:attribute_id", async (req, res) => {
    //Returns a category by Product ID    
    const pk = parseInt(req.params.attribute_id);

    if (isNaN(pk)) {
        return res.status(400).send({
            "code": "ATR_01",
            "message": "There doesn't exist an attribute with this ID.",
            "field": "attribute_id",
            "status": "400"
        });
    }

    const attrValue = await GetAttributeValuesByAttributeID(pk);
    if (attrValue[0].length === 0) return res.status(400).send({
        "code": "ATR_01",
        "message": "There doesn't exist a category with this ID.",
        "field": "product_id",
        "status": "400"
    });

    
    res.send(attrValue);

});

router.get("/inProduct/:product_id", async (req, res) => {
    //Returns attributes and attribute values by Product ID    
    const pk = parseInt(req.params.product_id);

    if (isNaN(pk)) {
        return res.status(400).send({
            "code": "ATR_01",
            "message": "There doesn't exist a category with this ID.",
            "field": "category_id",
            "status": "400"
        });
    }

    const attributes = await GetAttributesByProductID(pk);
    if (attributes[0].length === 0) return res.status(400).send({
        "code": "ATR_01",
        "message": "There doesn't exist a category with this ID.",
        "field": "product_id",
        "status": "400"
    });
  
    res.send(attributes);

});

module.exports = router;