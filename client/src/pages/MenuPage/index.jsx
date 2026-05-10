import { useState, useEffect } from "react";
import categoryService from "../../services/category";
import menuService from "../../services/menu";
import CategoryModal from "./CategoryModal";
import MenuModal from "./MenuModal";
import CategorySidebar from "./CategorySidebar";
import MenuGrid from "./MenuGrid";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [menuForm, setMenuForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catData, menuData] = await Promise.all([
        categoryService.getAllCategories(),
        menuService.getAllMenus(),
      ]);
      setCategories(catData.categories);
      setMenus(menuData.menus);
      if (catData.categories.length > 0) {
        setSelectedCategory(catData.categories[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter((m) => m.categoryId === selectedCategory);

  // Category handlers
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, {
          name: categoryName,
        });
      } else {
        await categoryService.createCategory({ name: categoryName });
      }
      setCategoryName("");
      setEditingCategory(null);
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await categoryService.deleteCategory(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setShowCategoryModal(true);
  };

  // Menu handlers
  const handleSaveMenu = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...menuForm,
        price: parseFloat(menuForm.price),
        categoryId: parseInt(menuForm.categoryId),
      };
      if (editingMenu) {
        await menuService.updateMenu(editingMenu.id, data);
      } else {
        await menuService.createMenu(data);
      }
      setMenuForm({
        name: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        isAvailable: true,
      });
      setEditingMenu(null);
      setShowMenuModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await menuService.deleteMenu(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditMenu = (menu) => {
    setEditingMenu(menu);
    setMenuForm({
      name: menu.name,
      price: menu.price,
      categoryId: menu.categoryId,
      imageUrl: menu.imageUrl || "",
      isAvailable: menu.isAvailable,
    });
    setShowMenuModal(true);
  };

  const openAddMenu = () => {
    setEditingMenu(null);
    setMenuForm({
      name: "",
      price: "",
      categoryId: selectedCategory || "",
      imageUrl: "",
      isAvailable: true,
    });
    setShowMenuModal(true);
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: "var(--color-dimmed)" }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="flex-col md:flex-row overflow-hidden flex h-full"
      style={{ color: "var(--color-heading)" }}
    >
      {/* Category sidebar */}
      <CategorySidebar
        onAdd={() => {
          setEditingCategory(null);
          setCategoryName("");
          setShowCategoryModal(true);
        }}
        onEdit={openEditCategory}
        onDelete={handleDeleteCategory}
        onSelect={setSelectedCategory}
        categories={categories}
        selectedCategory={selectedCategory}
      />

      {/* Menu items */}

      <MenuGrid
        categories={categories}
        selectedCategory={selectedCategory}
        filteredMenus={filteredMenus}
        onAdd={openAddMenu}
        onEdit={openEditMenu}
        onDelete={handleDeleteMenu}
      />

      {/* Category modal */}

      <CategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
      />

      {/* Menu modal */}

      <MenuModal
        show={showMenuModal}
        editingMenu={editingMenu}
        menuForm={menuForm}
        setMenuForm={setMenuForm}
        onSave={handleSaveMenu}
        onClose={() => setShowMenuModal(false)}
        categories={categories}
      />
    </div>
  );
}
