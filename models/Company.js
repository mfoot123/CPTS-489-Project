const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Company extends Model {

    static async searchCompany(name){
        try {
            const company = await Company.findByPk(name)
            return company;
        } catch (error) {
            console.log(error)
            return null
        }
    }

}

Company.init({
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, 
  modelName: 'Company'
});

module.exports = Company