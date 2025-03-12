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
  CModalFooter,
  CFormSelect
} from "@coreui/react";

const columns = [
  { key: "name", label: "Nom" },
  { key: "description", label: "Description" },
  { key: "actions", label: "Action" },
];

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "", categoryId: "", kitId: "" });
  const [editItem, setEditItem] = useState(null);

  // Récupérer les items, catégories et kits
  const fetchData = async () => {
    try {
      const [itemsResponse, categoriesResponse, kitsResponse] = await Promise.all([
        axios.get("http://localhost:5000/getItems"),
        axios.get("http://localhost:5000/getCategories"),
        axios.get("http://localhost:5000/getKits"),
      ]);
      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
      setKits(kitsResponse.data);
    } catch (error) {
      setError("Erreur lors de la récupération des données");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ajouter un item
  const handleAddItem = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createItem", newItem);
      if (response.status === 201) {
        setShowModal(false);
        setNewItem({ name: "", description: "", categoryId: "", kitId: "" });
        fetchData();
      }
      alert("Item créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'item:", error);
    }
  };

  // Modifier un item
  const handleUpdateItem = async (name, updatedData) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await axios.put(`http://localhost:5000/updateItemByName/${encodedName}`, updatedData);
      if (response.status === 200) {
        alert("Item mis à jour avec succès");
        fetchData();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'item:", error);
      alert("Échec de la mise à jour de l'item");
    }
  };

  // Supprimer un item
  const handleDeleteItem = async (name) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await axios.delete(`http://localhost:5000/deleteItemByName/${encodedName}`);
      if (response.status === 200) {
        alert("Item supprimé avec succès");
        fetchData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'item:", error);
      alert("Échec de la suppression de l'item");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }));
    } else {
      setNewItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier un item
  const openEditModal = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <CButton color="primary" onClick={() => setShowModal(true)}>
        Ajouter un item
      </CButton>
      <h3>Tableau des Items</h3>
      <CTable
        columns={columns}
        items={items.map((item) => ({
          ...item,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(item)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteItem(item.name)}>
                <span style={{ fontSize: "1.2em" }}>🗑️</span>
              </CButton>
            </div>
          ),
        }))}
        tableHeadProps={{ color: "light" }}
        striped
        bordered
        hover
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{editItem ? "Modifier un item" : "Ajouter un item"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                value={editItem ? editItem.name : newItem.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editItem ? editItem.description : newItem.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Liste des catégories</CFormLabel>
              <CFormSelect
                name="categoryId"
                value={editItem ? editItem.categoryId : newItem.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>kits d'articles</CFormLabel>
              <CFormSelect
                name="kitId"
                value={editItem ? editItem.kitId : newItem.kitId}
                onChange={handleInputChange}
              >
                <option value="">Sélectionnez un kit d'article</option>
                {kits.map((kit) => (
                  <option key={kit._id} value={kit._id}>
                    {kit.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={editItem ? () => handleUpdateItem(editItem.name, editItem) : handleAddItem}>
            {editItem ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ItemList;