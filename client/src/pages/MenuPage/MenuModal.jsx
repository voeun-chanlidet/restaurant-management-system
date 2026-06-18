import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const MenuModal = ({
  show,
  editingMenu,
  menuForm,
  setMenuForm,
  onSave,
  onClose,
  categories,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingMenu?.imageUrl) {
      setPreview(editingMenu.imageUrl);
    } else {
      setPreview(null);
    }
    setImageFile(null);
  }, [editingMenu, show]);

  if (!show) return null;

  const inputClass =
    "w-full px-3 py-2 rounded-lg text-sm outline-none bg-input text-heading border border-panel-border";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", menuForm.name);
      formData.append("price", parseFloat(menuForm.price));
      formData.append("categoryId", parseInt(menuForm.categoryId));
      formData.append("isAvailable", menuForm.isAvailable);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await onSave(formData);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl p-6 w-96 bg-panel border border-panel-border shadow-lg">
        <h2 className="text-base font-semibold text-heading mb-4">
          {editingMenu ? "Edit item" : "New menu item"}
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={menuForm.name}
            onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Price"
            value={menuForm.price}
            onChange={(e) =>
              setMenuForm({ ...menuForm, price: e.target.value })
            }
            className={inputClass}
          />
          <select
            value={menuForm.categoryId}
            onChange={(e) =>
              setMenuForm({ ...menuForm, categoryId: e.target.value })
            }
            className={inputClass}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Image upload */}
          <div className="flex flex-col gap-2">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-36 object-cover rounded-lg border border-panel-border"
              />
            )}
            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-dimmed border border-dashed border-panel-border cursor-pointer hover:border-brand hover:text-brand transition-colors">
              <span>{preview ? "Change image" : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-dimmed">
            <input
              type="checkbox"
              checked={menuForm.isAvailable}
              onChange={(e) =>
                setMenuForm({ ...menuForm, isAvailable: e.target.checked })
              }
            />
            Available
          </label>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-dimmed hover:text-heading transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
