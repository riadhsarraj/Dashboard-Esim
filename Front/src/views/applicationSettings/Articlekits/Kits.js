import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable, CButton, CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";

const columns = [
  { key: "name", label: "Nom" },
  { key: "description", label: "Description" },
  { key: "actions", label: "Action" },
];

const KitList = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newKit, setNewKit] = useState({ name: "", description: "", categoryId: "" });
  const [editKit, setEditKit] = useState(null);

  // Récupérer les kits
  const fetchKits = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getKits");
      setKits(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des kits");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  // Ajouter un kit
  const handleAddKit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createKit", newKit);
      if (response.status === 201) {
        setShowModal(false);
        setNewKit({ name: "", description: "", categoryId: "" });
        fetchKits();
      }
      alert("Kit créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du kit:", error);
    }
  };

  // Modifier un kit
  const handleUpdateKit = async (name, updatedData) => {
    try {
      const encodedName = encodeURIComponent(name); // Encoder le nom
      const response = await axios.put(`http://localhost:5000/updateKitByName/${encodedName}`, updatedData);
      if (response.status === 200) {
        alert("Kit mis à jour avec succès");
        fetchKits(); // Rafraîchir la liste des kits
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du kit:", error);
      alert("Échec de la mise à jour du kit");
    }
  };

  // Supprimer un kit
  const handleDeleteKit = async (name) => {
    try {
      const encodedName = encodeURIComponent(name); // Encoder le nom
      const response = await axios.delete(`http://localhost:5000/deleteKitByName/${encodedName}`);
      if (response.status === 200) {
        alert("Kit supprimé avec succès");
        fetchKits(); // Rafraîchir la liste des kits
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du kit:", error);
      alert("Échec de la suppression du kit");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editKit) {
      setEditKit((prevKit) => ({
        ...prevKit,
        [name]: value,
      }));
    } else {
      setNewKit((prevKit) => ({
        ...prevKit,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier un kit
  const openEditModal = (kit) => {
    setEditKit(kit);
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
        Ajouter un kit d'article
      </CButton>
      <h3>Tableau des kits d'articles</h3>
      <CTable
        columns={columns}
        items={kits.map((kit) => ({
          ...kit,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(kit)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteKit(kit.name)}>
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
          <CModalTitle>{editKit ? "Modifier un kit" : "Ajouter un kit d'article"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                value={editKit ? editKit.name : newKit.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editKit ? editKit.description : newKit.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Liste des catégories</CFormLabel>
              <CFormInput
                type="text"
                name="categoryId"
                value={editKit ? editKit.categoryId : newKit.categoryId}
                onChange={handleInputChange}
                placeholder="Sélectionnez une catégorie"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={editKit ? () => handleUpdateKit(editKit.name, editKit) : handleAddKit}>
            {editKit ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default KitList;