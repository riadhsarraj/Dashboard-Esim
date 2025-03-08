import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable, CButton, CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";

const columns = [
  { key: "username", label: "Nom d’utilisateur" },
  { key: "email", label: "E-mail" },
  { key: "cin", label: "CIN" },
  { key: "phone", label: "Téléphone" },
  { key: "actions", label: "Action" },
];

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ username: "", email: "", cin: "", phone: "" });
  const [editClient, setEditClient] = useState(null);

  // Récupérer les clients
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getClients");
      setClients(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des clients");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Ajouter un client
  const handleAddClient = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createClient", newClient);
      if (response.status === 200) {
        setShowModal(false);
        setNewClient({ username: "", email: "", cin: "", phone: "" });
        fetchClients();
      }
      alert("Client créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
    }
  };

  // Modifier un client
  const handleUpdateClient = async (email, updatedData) => {
    try {
      const encodedEmail = encodeURIComponent(email); // Encoder l'email
      const response = await axios.put(`http://localhost:5000/updateClientByEmail/${encodedEmail}`, updatedData);
      if (response.status === 200) {
        alert("Client mis à jour avec succès");
        fetchClients(); // Rafraîchir la liste des clients
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      alert("Échec de la mise à jour du client");
    }
  };

  // Supprimer un client
  const handleDeleteClient = async (email) => {
    try {
      const encodedEmail = encodeURIComponent(email); // Encoder l'email
      const response = await axios.delete(`http://localhost:5000/deleteClientByEmail/${encodedEmail}`);
      if (response.status === 200) {
        alert("Client supprimé avec succès");
        fetchClients(); // Rafraîchir la liste des clients
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      alert("Échec de la suppression du client");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editClient) {
      setEditClient((prevClient) => ({
        ...prevClient,
        [name]: value,
      }));
    } else {
      setNewClient((prevClient) => ({
        ...prevClient,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier un client
  const openEditModal = (client) => {
    setEditClient(client);
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
        Ajouter un client
      </CButton>

      <CTable
        columns={columns}
        items={clients.map((client) => ({
          ...client,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => openEditModal(client)}>
                Modifier
              </CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteClient(client.email)}>
                Supprimer
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
          <CModalTitle>{editClient ? "Modifier un client" : "Ajouter un client"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom d’utilisateur</CFormLabel>
              <CFormInput
                type="text"
                name="username"
                value={editClient ? editClient.username : newClient.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>E-mail</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={editClient ? editClient.email : newClient.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>CIN</CFormLabel>
              <CFormInput
                type="text"
                name="cin"
                value={editClient ? editClient.cin : newClient.cin}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Téléphone</CFormLabel>
              <CFormInput
                type="text"
                name="phone"
                value={editClient ? editClient.phone : newClient.phone}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={editClient ? handleUpdateClient : handleAddClient}>
            {editClient ? "Modifier" : "Ajouter"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ClientList;