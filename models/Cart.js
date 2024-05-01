const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');
const Product = require('./Product');

class Cart extends Model {}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false, // Ensure this constraint to avoid notNull errors
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Cart',
  timestamps: false, // Disable timestamps if not needed
});

// Relationship with Product
Cart.belongsTo(Product, { foreignKey: 'productName', targetKey: 'name' });

module.exports = Cart;
