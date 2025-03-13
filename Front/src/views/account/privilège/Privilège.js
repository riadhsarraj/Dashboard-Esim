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
  { key: "label", label: "Label du champ privilège" },
  { key: "description", label: "Description" },
  { key: "actions", label: "Action" },
];

const Privileges = () => {
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState(null);
  const [newPrivilege, setNewPrivilege] = useState({
    label: "",
    description: "",
  });

  // Récupérer tous les privilèges
  const fetchPrivileges = async () => {
    try {
      const response = await axios.get("http://localhost:5000/privileges/getPrivileges");
      setPrivileges(response.data);
    } catch (error) {
      setError(`Erreur lors de la récupération des privilèges: ${error.response?.data?.message || error.message}`);
      console.error("Erreur détaillée:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivileges();
  }, []);

  // Ajouter un privilège
  const handleAddPrivilege = async () => {
    try {
      const response = await axios.post("http://localhost:5000/privileges/createPrivilege", newPrivilege);
      if (response.status === 201) {
        setShowAddModal(false);
        setNewPrivilege({ label: "", description: "" });
        fetchPrivileges();
      }
      alert("Privilège créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du privilège:", error);
      alert("Échec de la création du privilège");
    }
  };

  // Modifier un privilège
  const handleEditPrivilege = (privilege) => {
    setSelectedPrivilege(privilege);
    setShowEditModal(true);
  };

  const handleUpdatePrivilege = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/privileges/updatePrivilege/${selectedPrivilege._id}`, selectedPrivilege);
      if (response.status === 200) {
        setShowEditModal(false);
        fetchPrivileges();
      }
      alert("Privilège mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du privilège:", error);
      alert("Échec de la mise à jour du privilège");
    }
  };

  // Supprimer un privilège
  const handleDeletePrivilege = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce privilège ?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/privileges/deletePrivilege/${id}`);
        if (response.status === 200) {
          fetchPrivileges();
          alert("Privilège supprimé avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du privilège:", error);
        alert("Échec de la suppression du privilège");
      }
    }
  };

  // Gérer les changements dans les champs du formulaire d'ajout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrivilege((prevPrivilege) => ({
      ...prevPrivilege,
      [name]: value,
    }));
  };

  // Gérer les changements dans les champs du formulaire de modification
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPrivilege((prevPrivilege) => ({
      ...prevPrivilege,
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
      Ajouter un privilège
      </CButton>
      <h3>Liste des privilèges</h3>
      <CTable
        columns={columns}
        items={privileges.map((privilege) => ({
          ...privilege,
          actions: (
            <div>
              <CButton
                color="secondary"
                size="sm"
                className="me-2"
                onClick={() => handleEditPrivilege(privilege)}
              >
                <span style={{ fontSize: "1.2em" }}>✏️</span>
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleDeletePrivilege(privilege._id)}
              >
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

      {/* Modal pour ajouter un privilège */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Ajouter un privilège</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Label du champ privilège</CFormLabel>
              <CFormInput
                type="text"
                name="label"
                value={newPrivilege.label}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={newPrivilege.description}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleAddPrivilege}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal pour modifier un privilège */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Modifier un privilège</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Label du champ privilège</CFormLabel>
              <CFormInput
                type="text"
                name="label"
                value={selectedPrivilege?.label || ""}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={selectedPrivilege?.description || ""}
                onChange={handleEditInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleUpdatePrivilege}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Privileges;