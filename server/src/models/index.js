const User = require("./user.model");
const Category = require("./category.model");
const Menu = require("./menu.model");
const Table = require("./table.model");
const Order = require("./order.model");
const OrderItem = require("./order_item.model");
const Payment = require("./payment.model");
const Table_Session = require("./table_session.model");

Category.hasMany(Menu, { foreignKey: "categoryId" });
Menu.belongsTo(Category, { foreignKey: "categoryId" });

// Table.hasMany(Order, { foreignKey: "tableId" });
// Order.belongsTo(Table, { foreignKey: "tableId" });

User.hasMany(Order, { foreignKey: "createdBy" });
Order.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Menu.hasMany(OrderItem, { foreignKey: "menuId" });
OrderItem.belongsTo(Menu, { foreignKey: "menuId" });

// Order.hasOne(Payment, { foreignKey: "orderId" });
// Payment.belongsTo(Order, { foreignKey: "orderId" });

User.hasMany(Payment, { foreignKey: "processedBy" });
Payment.belongsTo(User, { foreignKey: "processedBy", as: "processor" });

Table.hasMany(Table_Session, { foreignKey: "tableId" });
Table_Session.belongsTo(Table, { foreignKey: "tableId" });

Table_Session.hasMany(Order, { foreignKey: "sessionId" });
Order.belongsTo(Table_Session, { foreignKey: "sessionId" });

Table_Session.hasMany(Payment, { foreignKey: "sessionId" });
Payment.belongsTo(Table_Session, { foreignKey: "sessionId", as: "session" });

module.exports = {
  User,
  Category,
  Menu,
  Table,
  Order,
  OrderItem,
  Payment,
  Table_Session,
};
