const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Product extends Model {

    static async searchProduct(name){
        try {
            const product = await Product.findByPk(name)
            return product;
        } catch (error) {
            console.log(error)
            return null
        }
    }

}

Product.init({
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guideUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, 
  modelName: 'Product'
});

module.exports = Product