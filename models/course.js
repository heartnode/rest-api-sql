'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    class Course extends Sequelize.Model {}
    Course.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg:"Title is required.",
                },
                notEmpty:{
                    msg:"Title is required.",
                }
            }
        },
        description:{
            type: Sequelize.TEXT,
            allowNull: false,
            validate:{
                notNull:{
                    msg:"Description is required.",
                },
                notEmpty:{
                    msg:"Description is required.",
                }
            }
        },
        estimatedTime:{
            type: Sequelize.STRING,
        },
        materialsNeeded:{
            type: Sequelize.STRING,
        }
    },{ sequelize });

    Course.associate = (models) =>{
        Course.belongsTo(models.User,{
           /* as: 'student',*/
            foreignKey:{
                fieldName: 'userId',/*
                allowNull: false,
                validate:{
                    notNull:{
                        msg:"UserId is required",
                    }
                }*/
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })
    };

    return Course;
}