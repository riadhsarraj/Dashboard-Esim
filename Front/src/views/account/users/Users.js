import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable, CButton, CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";

const columns = [
  { key: "id", label: "#" }, // Compteur
  { key: "username", label: "Nom d'utilisateur" },
  { key: "email", label: "E-mail" },
  { key: "actions", label: "Action" },
];

const ExampleTable = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [editUser, setEditUser] = useState(null);

  // Récupérer les administrateurs
  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/getAdmins");
      const adminsWithId = response.data.map((admin, index) => ({
        ...admin,
        id: index + 1, // Compteur pour l'affichage
      }));
      setAdmins(adminsWithId);
    } catch (error) {
      setError("Erreur lors de la récupération des administrateurs");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Ajouter un administrateur
  const handleAddUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/admin/createAdmin", newUser);
      if (response.status === 200) {
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "" });
        fetchAdmins();
      }
      alert("Administrateur créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  // Modifier un administrateur
  const handleUpdateUser = async (email, updatedData) => {
    try {
      const encodedEmail = encodeURIComponent(email); // Encoder l'email
      const response = await axios.put(`http://localhost:5000/admin/updateAdminByEmail/${encodedEmail}`, updatedData);
      if (response.status === 200) {
        alert("Administrateur mis à jour avec succès");
        fetchAdmins(); // Rafraîchir la liste des administrateurs
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      alert("Échec de la mise à jour de l'administrateur");
    }
  };

  // Supprimer un administrateur
  const handleDeleteUser = async (email) => {
    try {
      const encodedEmail = encodeURIComponent(email); // Encoder l'email
      const response = await axios.delete(`http://localhost:5000/admin/deleteAdminByEmail/${encodedEmail}`);
      if (response.status === 200) {
        alert("Administrateur supprimé avec succès");
        fetchAdmins(); // Rafraîchir la liste des administrateurs
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      alert("Échec de la suppression de l'administrateur");
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    } else {
      setNewUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  // Ouvrir le modal pour modifier un administrateur
  const openEditModal = (admin) => {
    setEditUser(admin);
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
        Ajouter un utilisateur
      </CButton>
      <h3>Liste des Utilisateurs</h3>
      <CTable
        columns={columns}
        items={admins.map((admin) => ({
          ...admin,
          actions: (
            <div>
            <CButton color="warning" size="sm" onClick={() => openEditModal(admin)}>
            <span style={{ fontSize: "1.2em" }}>✏️</span>
            </CButton>
            <CButton color="danger" size="sm" onClick={() => handleDeleteUser(admin.email)}>
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
          <CModalTitle>{editUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom d'utilisateur</CFormLabel>
              <CFormInput
                type="text"
                name="username"
                value={editUser ? editUser.username : newUser.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>E-mail</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={editUser ? editUser.email : newUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Mot de passe</CFormLabel>
              <CFormInput
                type="password"
                name="password"
                value={editUser ? editUser.password : newUser.password}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={editUser ? handleUpdateUser : handleAddUser}>
            {editUser ? "Modifier" : "Ajouter"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ExampleTable;