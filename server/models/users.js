'use strict';
const {
  Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users.init({
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    birth: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    mobile: DataTypes.STRING,
    email: DataTypes.STRING,
    region: DataTypes.STRING,
    exp: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};