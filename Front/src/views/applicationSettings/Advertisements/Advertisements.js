import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CTable,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const columns = [
  { key: "nom", label: "Nom" },
  { key: "contenu", label: "Contenu" },
  { key: "type", label: "Type" },
  { key: "popup", label: "Popup" },
  { key: "actions", label: "Action" },
];

const Publicites = () => {
  const [publicites, setPublicites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPublicite, setNewPublicite] = useState({ nom: "", contenu: "", type: "", popup: "Popup" });
  const [editPublicite, setEditPublicite] = useState(null);

  // Récupérer les publicités
  const fetchPublicites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getPublicites");
      setPublicites(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des publicités");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicites();
  }, []);

  // Ajouter une publicité
  const handleAddPublicite = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createPublicite", newPublicite);
      if (response.status === 201) {
        setShowModal(false);
        setNewPublicite({ nom: "", contenu: "", type: "", popup: "Popup" });
        fetchPublicites();
      }
      alert("Publicité créée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la publicité:", error);
      alert("Échec de la création de la publicité");
    }
  };

  // Modifier une publicité
  const handleUpdatePublicite = async (nom, updatedData) => {
    try {
      const encodedNom = encodeURIComponent(nom);
      const response = await axios.put(`http://localhost:5000/updatePubliciteByNom/${encodedNom}`, updatedData);
      if (response.status === 200) {
        alert("Publicité mise à jour avec succès");
        fetchPublicites();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la publicité:", error);
      alert("Échec de la mise à jour de la publicité");
    }
  };

  // Supprimer une publicité
  const handleDeletePublicite = async (nom) => {
    try {
      const encodedNom = encodeURIComponent(nom);
      const response = await axios.delete(`http://localhost:5000/deletePubliciteByNom/${encodedNom}`);
      if (response.status === 200) {
        alert("Publicité supprimée avec succès");
        fetchPublicites();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la publicité:", error);
      alert("Échec de la suppression de la publicité");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editPublicite) {
      setEditPublicite((prevPublicite) => ({
        ...prevPublicite,
        [name]: value,
      }));
    } else {
      setNewPublicite((prevPublicite) => ({
        ...prevPublicite,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier une publicité
  const openEditModal = (publicite) => {
    setEditPublicite(publicite);
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
        Ajouter une publicité
      </CButton>
      <h3>Liste des publicités</h3>
      <CTable
        columns={columns}
        items={publicites.map((publicite) => ({
          ...publicite,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(publicite)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeletePublicite(publicite.nom)}>
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
          <CModalTitle>{editPublicite ? "Modifier une publicité" : "Ajouter une publicité"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="nom"
                value={editPublicite ? editPublicite.nom : newPublicite.nom}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Contenu</CFormLabel>
              <CFormInput
                type="text"
                name="contenu"
                value={editPublicite ? editPublicite.contenu : newPublicite.contenu}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Type</CFormLabel>
              <CFormInput
                type="text"
                name="type"
                value={editPublicite ? editPublicite.type : newPublicite.type}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Popup</CFormLabel>
              <CFormSelect
                name="popup"
                value={editPublicite ? editPublicite.popup : newPublicite.popup}
                onChange={handleInputChange}
              >
                <option value="Popup">Popup</option>
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="Première bannière">Première bannière</option>
                <option value="Deuxième bannière">Deuxième bannière</option>
                <option value="Troisième bannière">Troisième bannière</option>
                <option value="Bannière centrale">Bannière centrale</option>
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton
            color="primary"
            onClick={editPublicite ? () => handleUpdatePublicite(editPublicite.nom, editPublicite) : handleAddPublicite}
          >
            {editPublicite ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Publicites;