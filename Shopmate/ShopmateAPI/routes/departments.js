const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

async function GetDepartments(){
    return await Department.findAll();
}

async function GetDepartmentsById(department_id) {
    return await Department.findByPk(department_id);    
}

router.get("/", async (req, res) => {
    //Returns a List of departments
    const departments = await GetDepartments();
    res.send(departments);
});



router.get("/:department_id", async (req, res) => {    
    //Returns a department by its ID    
    const pk = parseInt(req.params.department_id); 

    try {
        const department = await GetDepartmentsById(pk);

        if (department === null) return res.status(400).send({
            "code": "DEP_02",
            "message": "There doesnt exist a department with this ID.",
            "field": "department_id",
            "status": "400"
        });

        res.send(department);        

    } catch (err) {
        res.status(400).send({
            "code": "USR_02",
            "message": "The field department_id is empty.",
            "field": "department_id",
            "status": "500"
        });
    }
    
});

module.exports = router;