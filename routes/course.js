const express = require('express');
const {asyncHandler} = require('../middleware/async-handler');
const {authenticateUser} = require('../middleware/auth-user');
const {Course,User} = require('../models');
const router = express.Router();

// Returns all courses including the users associated with each courses
router.get('/', asyncHandler(async (req, res)=>{
    //Get course with exceed of removing createdAt and updatedAt from the result
    const courses = await Course.findAll({include: [{model:User, attributes: {exclude:['createdAt','updatedAt']}}], attributes:{exclude:['createdAt','updatedAt']}});
    
    //Get plain of courses
    const formatedCourse = courses.map(course=>course.get({plain:true}));
    res.status(200).json(formatedCourse);
}));

router.post("/", authenticateUser, asyncHandler(async (req,res)=>{
    try{
        const course = await Course.create(req.body);
        //set response with 201 status code and location of /api/courses/{course_id}
        res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (error){
        // Validation error and Unique Constraints
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

router.put("/:id", authenticateUser, asyncHandler(async (req,res)=>{      
    try {
        // get course by ID
        const course = await Course.findByPk(req.params.id,{include:User});
        
        // Exceeds match authenticated user is owner of the request course
        if (course.User.id === req.currentUser.id){
            // Updates the course with new content only if is the owner
            await course.update(req.body);
            res.status(204).end();
        } else {
            // Sends Forbidden if authenticated user is not the owner of the requested course
            res.status(403).end();
        }
    } catch(error) {
        // Validation error and Unique Constraints 
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            //Send 400 error and errors message
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
    
}));

router.delete("/:id", authenticateUser, asyncHandler(async (req,res)=>{
    // Get course by ID
    const course = await Course.findByPk(req.params.id, {include:User});

    // Exceeds match authenticated user is owner of the request course
    if (course.User.id === req.currentUser.id){
        // Delete the course and return status 204
        course.destroy();
        res.status(204).end();
    } else {
        // Sends Forbidden if authenticated user is not the owner of the requested course
        res.status(403).end();
    }
 
}));

router.get('/:id',asyncHandler(async (req,res)=>{
    // Get course by ID
    const course = await Course.findByPk(req.params.id,{attributes:{ exclude: ['createdAt','updatedAt',] },include: [{model:User, attributes:{exclude:['createdAt','updatedAt',]}}]});
    res.status(200).json(course);
}))

module.exports = router;