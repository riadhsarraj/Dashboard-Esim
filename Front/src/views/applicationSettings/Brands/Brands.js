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
} from "@coreui/react";

const columns = [
  { key: "name", label: "Nom" },
  { key: "description", label: "Description" },
  { key: "actions", label: "Action" },
];

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
  const [editBrand, setEditBrand] = useState(null);

  // Récupérer les marques
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getBrands");
      setBrands(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des marques");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Ajouter une marque
  const handleAddBrand = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createBrand", newBrand);
      if (response.status === 201) {
        setShowModal(false);
        setNewBrand({ name: "", description: "" });
        fetchBrands();
      }
      alert("Marque créée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la marque:", error);
      alert("Échec de la création de la marque");
    }
  };

  // Modifier une marque
  const handleUpdateBrand = async (name, updatedData) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await axios.put(`http://localhost:5000/updateBrandByName/${encodedName}`, updatedData);
      if (response.status === 200) {
        alert("Marque mise à jour avec succès");
        fetchBrands();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la marque:", error);
      alert("Échec de la mise à jour de la marque");
    }
  };

  // Supprimer une marque
  const handleDeleteBrand = async (name) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await axios.delete(`http://localhost:5000/deleteBrandByName/${encodedName}`);
      if (response.status === 200) {
        alert("Marque supprimée avec succès");
        fetchBrands();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la marque:", error);
      alert("Échec de la suppression de la marque");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editBrand) {
      setEditBrand((prevBrand) => ({
        ...prevBrand,
        [name]: value,
      }));
    } else {
      setNewBrand((prevBrand) => ({
        ...prevBrand,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier une marque
  const openEditModal = (brand) => {
    setEditBrand(brand);
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
        Ajouter une marque
      </CButton>
      <h3>Tableau des marques</h3>
      <CTable
        columns={columns}
        items={brands.map((brand) => ({
          ...brand,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(brand)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteBrand(brand.name)}>
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
          <CModalTitle>{editBrand ? "Modifier une marque" : "Ajouter une marque"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                value={editBrand ? editBrand.name : newBrand.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editBrand ? editBrand.description : newBrand.description}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton
            color="primary"
            onClick={editBrand ? () => handleUpdateBrand(editBrand.name, editBrand) : handleAddBrand}
          >
            {editBrand ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default BrandList;