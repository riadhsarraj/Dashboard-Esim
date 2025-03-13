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
  { key: "nom", label: "Nom" },
  { key: "description", label: "Description" },
  { key: "evenements", label: "Événements" },
  { key: "actions", label: "Action" },
];

const CommandeStatus = () => {
  const [commandeStatus, setCommandeStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCommandeStatus, setNewCommandeStatus] = useState({ nom: "", description: "", evenements: "" });
  const [editCommandeStatus, setEditCommandeStatus] = useState(null);

  // Récupérer les statuts des commandes
  const fetchCommandeStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getCommandeStatus");
      setCommandeStatus(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des statuts des commandes");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandeStatus();
  }, []);

  // Ajouter un statut de commande
  const handleAddCommandeStatus = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createCommandeStatus", newCommandeStatus);
      if (response.status === 201) {
        setShowModal(false);
        setNewCommandeStatus({ nom: "", description: "", evenements: "" });
        fetchCommandeStatus();
      }
      alert("Statut de commande créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du statut de commande:", error);
      alert("Échec de la création du statut de commande");
    }
  };

  // Modifier un statut de commande
  const handleUpdateCommandeStatus = async (nom, updatedData) => {
    try {
      const encodedNom = encodeURIComponent(nom);
      const response = await axios.put(`http://localhost:5000/updateCommandeStatusByNom/${encodedNom}`, updatedData);
      if (response.status === 200) {
        alert("Statut de commande mis à jour avec succès");
        fetchCommandeStatus();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de commande:", error);
      alert("Échec de la mise à jour du statut de commande");
    }
  };

  // Supprimer un statut de commande
  const handleDeleteCommandeStatus = async (nom) => {
    try {
      const encodedNom = encodeURIComponent(nom);
      const response = await axios.delete(`http://localhost:5000/deleteCommandeStatusByNom/${encodedNom}`);
      if (response.status === 200) {
        alert("Statut de commande supprimé avec succès");
        fetchCommandeStatus();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du statut de commande:", error);
      alert("Échec de la suppression du statut de commande");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editCommandeStatus) {
      setEditCommandeStatus((prevCommandeStatus) => ({
        ...prevCommandeStatus,
        [name]: value,
      }));
    } else {
      setNewCommandeStatus((prevCommandeStatus) => ({
        ...prevCommandeStatus,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier un statut de commande
  const openEditModal = (commandeStatus) => {
    setEditCommandeStatus(commandeStatus);
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
        Ajouter un statut à la commande
      </CButton>
      <h3>Liste des statuts des commandes</h3>
      <CTable
        columns={columns}
        items={commandeStatus.map((status) => ({
          ...status,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(status)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteCommandeStatus(status.nom)}>
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
          <CModalTitle>{editCommandeStatus ? "Modifier un statut à la commande" : "Ajouter un statut à la commande"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="nom"
                value={editCommandeStatus ? editCommandeStatus.nom : newCommandeStatus.nom}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editCommandeStatus ? editCommandeStatus.description : newCommandeStatus.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Événements</CFormLabel>
              <CFormInput
                type="number"
                name="evenements"
                value={editCommandeStatus ? editCommandeStatus.evenements : newCommandeStatus.evenements}
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
            onClick={editCommandeStatus ? () => handleUpdateCommandeStatus(editCommandeStatus.nom, editCommandeStatus) : handleAddCommandeStatus}
          >
            {editCommandeStatus ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CommandeStatus;