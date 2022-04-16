'use strict';

const bcryptjs = require('bcryptjs');
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg:"First name is required.",
                },
                notEmpty:{
                    msg:"First name is required.",
                }
            }
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg:"Last name is required.",
                },
                notEmpty:{
                    msg:"Last name is required.",
                }
            }
          },
          emailAddress:{
              type:Sequelize.STRING,
              allowNull: false,
              unique: {
                  msg: 'The email you entered already exists.'
              },
              validate:{
                  notNull:{
                      msg: "A valid email address is required."
                  },
                  notEmpty:{
                      msg:"A valid email address is required.",
                  },
                  isEmail:{
                      msg:"A valid email address is required."
                  }
              }
          },
          password:{
              type:Sequelize.STRING,
              set(val){
                  if (val) {
                      const hashedPassword = bcryptjs.hashSync(val,10);
                      this.setDataValue('password',hashedPassword);
                  }
              },
              allowNull: false,
              validate:{
                  notNull:{
                      msg:"A password is required."
                  },
              }
          }
    }, { sequelize });
    User.associate = (models) =>{
        User.hasMany(models.Course, {
         /*   as: 'student', */
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        })
    }

    return User;
}