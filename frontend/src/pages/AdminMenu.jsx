import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Plus, Image, Utensils, Edit2, Trash2, X, Upload } from "lucide-react";
import toast from "react-hot-toast";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    description: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      imageUrl: "",
      description: "",
    });
    setEditingId(null);
    setPreviewImage(null);
  };

  const getBackendImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const baseUrl =
      api.defaults?.baseURL?.replace(/\/api$/, "") || "http://localhost:8080";
    return `${baseUrl}${url}`;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      // Create FormData for file upload
      const formDataFile = new FormData();
      formDataFile.append("file", file);

      // Upload file to backend
      const response = await api.post("/menu/upload", formDataFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.imageUrl) {
        setFormData({ ...formData, imageUrl: response.data.imageUrl });
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Failed to upload file", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/menu", {
        ...formData,
        price: parseFloat(formData.price),
      });
      setShowAddForm(false);
      resetForm();
      toast.success("Item added successfully");
      fetchMenu();
    } catch (err) {
      console.error("Failed to add menu item", err);
      toast.error("Failed to add item");
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || "",
      description: item.description || "",
    });
    setPreviewImage(
      getBackendImageUrl(item.imageUrl) ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
    );
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/menu/${editingId}`, {
        ...formData,
        price: parseFloat(formData.price),
      });
      setShowEditForm(false);
      resetForm();
      toast.success("Item updated successfully");
      fetchMenu();
    } catch (err) {
      console.error("Failed to update menu item", err);
      toast.error("Failed to update item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/menu/${id}`);
        toast.success("Item deleted successfully");
        fetchMenu();
      } catch (err) {
        console.error("Failed to delete menu item", err);
        toast.error("Failed to delete item");
      }
    }
  };

  if (loading)
    return <div className="text-center mt-4">Loading menu items...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 m-0">
          <Utensils /> Manage Menu
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowEditForm(false);
            resetForm();
          }}
        >
          {showAddForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={18} /> Add Item
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div
          className="card mb-4"
          style={{ borderLeft: "4px solid var(--primary)" }}
        >
          <h3>Add New Menu Item</h3>
          <form
            onSubmit={handleAddSubmit}
            className="grid grid-cols-2 mt-3"
            style={{ gap: "1rem" }}
          >
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description of this dish"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-muted flex items-center gap-1">
                <Image size={16} /> Image URL
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label className="form-label text-muted flex items-center gap-1">
                <Upload size={16} /> Or Upload Image
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && <small className="text-muted">Uploading...</small>}
            </div>
            {previewImage && !showEditForm && (
              <div
                style={{
                  gridColumn: "span 2",
                  marginTop: "1rem",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  maxHeight: "200px",
                }}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              </div>
            )}
            <div style={{ gridColumn: "span 2" }}>
              <button type="submit" className="btn btn-primary mt-2">
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && (
        <div
          className="card mb-4"
          style={{ borderLeft: "4px solid var(--primary)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>Edit Menu Item</h3>
            <button
              className="btn btn-sm"
              onClick={() => {
                setShowEditForm(false);
                resetForm();
              }}
            >
              <X size={18} />
            </button>
          </div>
          <form
            onSubmit={handleEditSubmit}
            className="grid grid-cols-2 mt-3"
            style={{ gap: "1rem" }}
          >
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description of this dish"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-muted flex items-center gap-1">
                <Image size={16} /> Image URL
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label className="form-label text-muted flex items-center gap-1">
                <Upload size={16} /> Or Upload New Image
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && <small className="text-muted">Uploading...</small>}
            </div>
            {previewImage && showEditForm && (
              <div
                style={{
                  gridColumn: "span 2",
                  marginTop: "1rem",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  maxHeight: "200px",
                }}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              </div>
            )}
            <div style={{ gridColumn: "span 2" }}>
              <button type="submit" className="btn btn-primary mt-2">
                Update Item
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-3">
        {menuItems.map((item) => (
          <div key={item.id} className="card flex flex-col justify-between">
            <div>
              <img
                src={
                  getBackendImageUrl(item.imageUrl) ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
                }
                alt={item.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "1rem",
                }}
              />
              <div className="flex justify-between items-start">
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <span className="font-bold text-lg text-primary">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <span className="badge badge-warning mt-2 inline-block">
                {item.category}
              </span>
              {item.description && (
                <p className="text-sm text-muted mt-2" style={{ margin: 0 }}>
                  {item.description}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                className="btn btn-sm btn-outline flex-1"
                onClick={() => handleEditClick(item)}
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                className="btn btn-sm btn-danger flex-1"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <p className="text-center text-muted mt-4">
          No menu items found. Add some!
        </p>
      )}
    </div>
  );
};

export default AdminMenu;
