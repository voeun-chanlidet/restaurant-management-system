const User = require("./user.model");
const Menu = require("./menu.model");
const Category = require("./category.model");

Category.hasMany(Menu, {
  foreignKey: "categoryId",
});

Menu.belongsTo(Category, { foreignKey: "categoryId" });
module.exports = { User, Category, Menu };
