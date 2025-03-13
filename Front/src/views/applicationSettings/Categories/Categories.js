import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  CTable, 
  CButton, 
  CForm, 
  CFormInput, 
  CFormLabel, 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter 
} from "@coreui/react";

const columns = [
  { key: "id", label: "#" },
  { key: "name", label: "Nom" },
  { key: "description", label: "Description" },
  { key: "actions", label: "Action" },
  { key: "images", label: "Images" },
];

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editCategory, setEditCategory] = useState(null);

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories/getCategories");
      const indexedCategories = response.data.map((category, index) => ({
        ...category,
        id: index + 1,
      }));
      setCategories(indexedCategories);
    } catch (error) {
      setError("Erreur lors de la récupération des catégories");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Ajouter une catégorie
  const handleAddCategory = async () => {
    try {
      const response = await axios.post("http://localhost:5000/categories/createCategory", newCategory);
      if (response.status === 201) {
        setShowModal(false);
        setNewCategory({ name: "", description: "" });
        fetchCategories();
      }
      alert("Catégorie créée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      alert("Échec de la création de la catégorie");
    }
  };

  // Modifier une catégorie
  const handleUpdateCategory = async (name) => {
    try {
      const response = await axios.put(`http://localhost:5000/categories/updateCategoryByName/${name}`, editCategory);
      if (response.status === 200) {
        setShowModal(false);
        setEditCategory(null);
        fetchCategories();
      }
      alert("Catégorie mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      alert("Échec de la mise à jour de la catégorie");
    }
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (name) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/categories/deleteCategoryByName/${name}`);
        if (response.status === 200) {
          fetchCategories();
        }
        alert("Catégorie supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie:", error);
        alert("Échec de la suppression de la catégorie");
      }
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editCategory) {
      setEditCategory((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Ouvrir le modal pour ajouter ou modifier
  const openModal = (category = null) => {
    console.log("Opening modal, category:", category);
    setEditCategory(category);
    setShowModal(true);
  };

  if (loading) return <div style={{ color: "#fff" }}>Chargement en cours...</div>;
  if (error) return <div style={{ color: "#fff" }}>{error}</div>;

  return (
    <div >
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "20px" }}>
        <CButton 
          color="primary" 
          onClick={() => openModal()}
          style={{ 
            backgroundColor: "#6f42c1", 
            border: "none", 
            padding: "8px 16px", 
            borderRadius: "5px" 
          }}
        >
          Ajouter une catégorie
        </CButton>
      </div>

      <div>
        <h3>Tableau des catégories</h3>
        <CTable
          columns={columns}
          items={categories.map((category) => ({
            ...category,
            actions: (
              <div>
                <CButton 
                  color="warning" 
                  size="sm" 
                  onClick={() => openModal(category)} 
                  style={{ 
                    marginRight: "10px", 
                    backgroundColor: "#f39c12", 
                    border: "none", 
                    padding: "5px" 
                  }}
                >
                  <span role="img" aria-label="edit">✏️</span>
                </CButton>
                <CButton 
                  color="danger" 
                  size="sm" 
                  onClick={() => handleDeleteCategory(category.name)}
                  style={{ 
                    backgroundColor: "#e74c3c", 
                    border: "none", 
                    padding: "5px" 
                  }}
                >
                  <span role="img" aria-label="delete">🗑️</span>
                </CButton>
              </div>
            ),
            images: <div>🖼️</div>,
          }))}
          tableHeadProps={{ 
            color: "light", 
            style: { 
              backgroundColor: "#fff", 
              color: "#000", 
              fontWeight: "bold" 
            } 
          }}
          tableProps={{
            style: { 
              backgroundColor: "#2d2d44", 
              color: "#fff" 
            }
          }}
          striped
          bordered
          hover
        />
      </div>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{editCategory ? "Modifier une catégorie" : "Ajouter une catégorie"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel style={{ color: "#fff" }}>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                value={editCategory ? editCategory.name : newCategory.name}
                onChange={handleInputChange}
                disabled={editCategory !== null}
                
              />
            </div>
            <div className="mb-3">
              <CFormLabel style={{ color: "#fff" }}>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editCategory ? editCategory.description : newCategory.description}
                onChange={handleInputChange}
                
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter style={{ borderTop: "1px solid #4d4d6a" }}>
          <CButton 
            color="secondary" 
            onClick={() => setShowModal(false)}
          >
            Fermer
          </CButton>
          <CButton 
            color="primary" 
            onClick={editCategory ? () => handleUpdateCategory(editCategory.name) : handleAddCategory}
          >
            {editCategory ? "Enregistrer" : "Ajouter"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CategoryList;