const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class ProductCategories extends Model {

    static async searchProductCategories(name){
        try {
            const productCategories = await ProductCategories.findByPk(category)
            return productCategories;
        } catch (error) {
            console.log(error)
            return null
        }
    }

}

ProductCategories.init({
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
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
  modelName: 'ProductCategories'
});

module.exports = ProductCategories