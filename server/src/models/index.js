const User = require("./user.model");
const Category = require("./category.model");
const Menu = require("./menu.model");
const Table = require("./table.model");
const Order = require("./order.model");
const OrderItem = require("./order_item.model");

Category.hasMany(Menu, { foreignKey: "categoryId" });
Menu.belongsTo(Category, { foreignKey: "categoryId" });

Table.hasMany(Order, { foreignKey: "tableId" });
Order.belongsTo(Table, { foreignKey: "tableId" });

User.hasMany(Order, { foreignKey: "createdBy" });
Order.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Menu.hasMany(OrderItem, { foreignKey: "menuId" });
OrderItem.belongsTo(Menu, { foreignKey: "menuId" });

module.exports = { User, Category, Menu, Table, Order, OrderItem };
