const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {}

// define table columns and configuration
User.init(
  {
    //define an id column
    id: {
        type: DataTypes.INTEGER,
        //this the equivalent of sqls's not null option
        allowNull: false,
        //instruct that this is the primary key
        primaryKey: true,
        //turn on auto increment
        autoIncrement: true
    },
    //define a user column
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
      }
    
    },
    //define a password column
    password: {
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            //this means that the password must be 4 characters long
            len:[4]
        }
    }

  },
  

  
  {
    //hooks:{
        //sets up beforeCreate lifecycle "hook" funtionality
        //beforeCreate(userData) {
            //return bcrypt.hash(userData.password, 10).then(newUserData => {
                //return newUserData
            //});
        //}
    hooks:{
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
        //set up before update life cycle "hook" functionality
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
    },      

    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;