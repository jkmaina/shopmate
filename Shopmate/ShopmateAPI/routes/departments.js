const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const db = require('../startup/database');
const _ = require('lodash');

async function GetDepartments() {
  
    let departments = await db.query('CALL catalog_get_departments', {
        model: Department,
        mapToModel: true
    });
    let departmentsFormatted = _.map(departments[0], function (department) {
        var dept = {
            "\"department_id\"": department.department_id,
            "\"name\"": department.name,
            "\"description\"": department.description
        };
        return dept;
    });
    return departmentsFormatted;    
}

async function GetDepartmentsById(dep_id) {    

    let dept = await db.query('CALL catalog_get_department_details(:department_id)', {
        replacements: { department_id: dep_id },
        model: Department,
        mapToModel: true
    });
    var department_detail = {
        "department_id": 0,
        "name": "",
        "description": ""
    };
    department_detail.department_id = dep_id;
    department_detail.name = dept[0][0].name;
    department_detail.description = dept[0][0].description;

    return await department_detail;
}

router.get("/", async (req, res) => {
    //Returns a List of departments
    const departments = await GetDepartments();
    res.send(departments);
});



router.get("/:department_id", async (req, res) => {    
    //Returns a department by its ID    
    const pk = parseInt(req.params.department_id); 
    
    const department = await GetDepartmentsById(pk);

    if (department === null) return res.status(400).send({
        "code": "DEP_02",
        "message": "There doesnt exist a department with this ID.",
        "field": "department_id",
        "status": "400"
    });

    res.send(department);        
   
});

module.exports = router;