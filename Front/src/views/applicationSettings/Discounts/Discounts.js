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
  { key: "description", label: "Description" },
  { key: "type", label: "Type" },
  { key: "valeur", label: "Valeur" },
  { key: "dateDebut", label: "Date de début" },
  { key: "dateFin", label: "Date de fin" },
  { key: "actions", label: "Action" },
];

const Reductions = () => {
  const [reductions, setReductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newReduction, setNewReduction] = useState({
    nom: "",
    description: "",
    type: "pourcentage",
    valeur: "",
    dateDebut: "",
    dateFin: "",
    actif: "Actif",
  });
  const [editReduction, setEditReduction] = useState(null);

  // Récupérer les réductions
  const fetchReductions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/discounts/getReductions");
      setReductions(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des réductions");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReductions();
  }, []);

  // Ajouter une réduction
  const handleAddReduction = async () => {
    try {
      const response = await axios.post("http://localhost:5000/discounts/createReduction", newReduction);
      if (response.status === 201) {
        setShowModal(false);
        setNewReduction({
          nom: "",
          description: "",
          type: "pourcentage",
          valeur: "",
          dateDebut: "",
          dateFin: "",
          actif: "Actif",
        });
        fetchReductions();
      }
      alert("Réduction créée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réduction:", error);
      alert("Échec de la création de la réduction");
    }
  };

  // Modifier une réduction
  const handleUpdateReduction = async (nom, updatedData) => {
    try {
      const encodedNom = encodeURIComponent(nom);
      const response = await axios.put(`http://localhost:5000/discounts/updateReductionByNom/${encodedNom}`, updatedData);
      if (response.status === 200) {
        alert("Réduction mise à jour avec succès");
        fetchReductions();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réduction:", error);
      alert("Échec de la mise à jour de la réduction");
    }
  };

  // Supprimer une réduction
  const handleDeleteReduction = async (nom) => {
    try {
      const encodedNom = encodeURIComponent(nom);
      const response = await axios.delete(`http://localhost:5000/discounts/deleteReductionByNom/${encodedNom}`);
      if (response.status === 200) {
        alert("Réduction supprimée avec succès");
        fetchReductions();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la réduction:", error);
      alert("Échec de la suppression de la réduction");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editReduction) {
      setEditReduction((prevReduction) => ({
        ...prevReduction,
        [name]: value,
      }));
    } else {
      setNewReduction((prevReduction) => ({
        ...prevReduction,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier une réduction
  const openEditModal = (reduction) => {
    setEditReduction(reduction);
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
        Ajouter une réduction
      </CButton>
      <h3>Liste des réductions</h3>
      <CTable
        columns={columns}
        items={reductions.map((reduction) => ({
          ...reduction,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(reduction)}>
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteReduction(reduction.nom)}>
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
          <CModalTitle>{editReduction ? "Modifier une réduction" : "Ajouter une réduction"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="nom"
                value={editReduction ? editReduction.nom : newReduction.nom}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editReduction ? editReduction.description : newReduction.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Type</CFormLabel>
              <CFormSelect
                name="type"
                value={editReduction ? editReduction.type : newReduction.type}
                onChange={handleInputChange}
              >
                <option value="pourcentage">Pourcentage</option>
                <option value="montant">Montant</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Valeur</CFormLabel>
              <CFormInput
                type="number"
                name="valeur"
                value={editReduction ? editReduction.valeur : newReduction.valeur}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Date de début</CFormLabel>
              <CFormInput
                type="datetime-local"
                name="dateDebut"
                value={editReduction ? editReduction.dateDebut : newReduction.dateDebut}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Date de fin</CFormLabel>
              <CFormInput
                type="datetime-local"
                name="dateFin"
                value={editReduction ? editReduction.dateFin : newReduction.dateFin}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Actif</CFormLabel>
              <CFormSelect
                name="actif"
                value={editReduction ? editReduction.actif : newReduction.actif}
                onChange={handleInputChange}
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
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
            onClick={editReduction ? () => handleUpdateReduction(editReduction.nom, editReduction) : handleAddReduction}
          >
            {editReduction ? "Modifier" : "Enregistrer"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Reductions;