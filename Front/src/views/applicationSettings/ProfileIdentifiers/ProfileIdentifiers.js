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
import { cilPencil, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const columns = [
  { key: "username", label: "Nom d'utilisateur" },
  { key: "email", label: "E-mail" },
  { key: "cin", label: "CIN" },
  { key: "telephone", label: "Téléphone" },
  { key: "imageProcessed", label: "Traitement de l'image" },
  { key: "commands", label: "Liste des commandes des clients" },
  { key: "paymentCards", label: "Cartes de paiement" },
  { key: "actions", label: "Action" },
];

const Clients = () => {
  const [clientInfos, setClientInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClientInfo, setSelectedClientInfo] = useState(null);
  const [newClientInfo, setNewClientInfo] = useState({
    username: "",
    email: "",
    cin: "",
    telephone: "",
    imageProcessed: "",
    commands: [],
    paymentCards: [],
  });

  const fetchClientInfos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clientInfos/getClientInfos");
      setClientInfos(response.data || []);
    } catch (error) {
      setError(`Erreur lors de la récupération des clients: ${error.response?.data?.message || error.message}`);
      console.error("Erreur détaillée:", error.response?.data || error);
      setClientInfos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientInfos();
  }, []);

  const handleAddClientInfo = async () => {
    try {
      const response = await axios.post("http://localhost:5000/clientInfos/createClientInfo", newClientInfo);
      if (response.status === 201) {
        setShowAddModal(false);
        setNewClientInfo({
          username: "",
          email: "",
          cin: "",
          telephone: "",
          imageProcessed: "",
          commands: [],
          paymentCards: [],
        });
        fetchClientInfos();
      }
      alert("Client créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      alert("Échec de la création du client");
    }
  };

  const handleEditClientInfo = (clientInfo) => {
    setSelectedClientInfo(clientInfo);
    setShowEditModal(true);
  };

  const handleUpdateClientInfo = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/clientInfos/updateClientInfo/${selectedClientInfo._id}`, selectedClientInfo);
      if (response.status === 200) {
        setShowEditModal(false);
        fetchClientInfos();
      }
      alert("Client mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      alert("Échec de la mise à jour du client");
    }
  };

  const handleDeleteClientInfo = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/clientInfos/deleteClientInfo/${id}`);
        if (response.status === 200) {
          fetchClientInfos();
          alert("Client supprimé avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
        alert("Échec de la suppression du client");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClientInfo((prevClientInfo) => ({
      ...prevClientInfo,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedClientInfo((prevClientInfo) => ({
      ...prevClientInfo,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <CButton color="primary" onClick={() => setShowAddModal(true)}>
      Ajouter un client info
      </CButton>
      <h3>Liste des clients</h3>
      <CTable
        columns={columns}
        items={clientInfos.map((clientInfo) => ({
          ...clientInfo,
          imageProcessed: (
            <CButton color="pink" size="sm" disabled>
              <span style={{ fontSize: "1.2em" }}>⬆️</span>
            </CButton>
          ),
          commands: (
            <CButton color="info" size="sm" disabled>
              <span style={{ fontSize: "1.2em" }}>📄</span>
            </CButton>
          ),
          paymentCards: (
            <CButton color="success" size="sm" disabled>
              <span style={{ fontSize: "1.2em" }}>💳</span>
            </CButton>
          ),
          actions: (
            <div>
              <CButton
                color="secondary"
                size="sm"
                className="me-2"
                onClick={() => handleEditClientInfo(clientInfo)}
              >
                <CIcon icon={cilPencil} />
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleDeleteClientInfo(clientInfo._id)}
              >
                <CIcon icon={cilTrash} />
              </CButton>
            </div>
          ),
        }))}
        tableHeadProps={{ color: "light" }}
        striped
        bordered
        hover
      />

      {/* Modal pour ajouter un client */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Ajouter un client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom d'utilisateur</CFormLabel>
              <CFormInput
                type="text"
                name="username"
                value={newClientInfo.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>E-mail</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={newClientInfo.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>CIN</CFormLabel>
              <CFormInput
                type="text"
                name="cin"
                value={newClientInfo.cin}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Téléphone</CFormLabel>
              <CFormInput
                type="text"
                name="telephone"
                value={newClientInfo.telephone}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleAddClientInfo}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal pour modifier un client */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Modifier un client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom d'utilisateur</CFormLabel>
              <CFormInput
                type="text"
                name="username"
                value={selectedClientInfo?.username || ""}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>E-mail</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={selectedClientInfo?.email || ""}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>CIN</CFormLabel>
              <CFormInput
                type="text"
                name="cin"
                value={selectedClientInfo?.cin || ""}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Téléphone</CFormLabel>
              <CFormInput
                type="text"
                name="telephone"
                value={selectedClientInfo?.telephone || ""}
                onChange={handleEditInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleUpdateClientInfo}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Clients;