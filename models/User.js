'use strict';


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users',{
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });
  return User;
};