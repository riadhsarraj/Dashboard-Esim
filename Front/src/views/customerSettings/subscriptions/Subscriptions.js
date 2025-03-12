import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable, CButton, CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";

const columns = [
  { key: "_id", label: "ID Client" },
  { key: "profileId", label: "ID Profil" },
  { key: "note", label: "Note" },
  { key: "actions", label: "Action" },
];

const ListSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newSubscription, setNewSubscription] = useState({ profileId: "", note: "default" });
  const [editSubscription, setEditSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getSubscriptions");
      setSubscriptions(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des abonnements");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createSubscription", newSubscription);
      if (response.status === 200) {
        setNewSubscription({ profileId: "", note: "default" });
        setShowModal(false);
        fetchSubscriptions();
        
      }
      alert("Abonnement créé avec succès");
    } catch (error) {
      alert("Échec de la création de l'abonnement");
    }
  };

  const handleUpdateSubscription = async (profileId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/updateSubscription/${profileId}`, updatedData);
      if (response.status === 200) {
        setShowModal(false);
        fetchSubscriptions();
        alert("Abonnement mis à jour avec succès");
      }
    } catch (error) {
      alert("Échec de la mise à jour de l'abonnement");
    }
  };

  const handleDeleteSubscription = async (profileId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteSubscription/${profileId}`);
      if (response.status === 200) {
        fetchSubscriptions();
        alert("Abonnement supprimé avec succès");
      }
    } catch (error) {
      alert("Échec de la suppression de l'abonnement");
    }
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <CButton color="primary" onClick={() => setShowModal(true)}>Ajouter un abonnement</CButton>
      <h3>Liste des Abonnement</h3>
      <CTable
        columns={columns}
        items={subscriptions.map((subscription) => ({
          ...subscription,
          actions: (
            <div>
              <CButton color="warning" size="sm" onClick={() => { setEditSubscription(subscription); setShowModal(true); }}><span style={{ fontSize: "1.2em" }}>✏️</span></CButton>
              <CButton color="danger" size="sm" onClick={() => handleDeleteSubscription(subscription.profileId)}><span style={{ fontSize: "1.2em" }}>🗑️</span></CButton>
            </div>
          ),
        }))}
        tableHeadProps={{ color: "light" }}
        striped
        bordered
        hover
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader><CModalTitle>{editSubscription ? "Modifier un abonnement" : "Ajouter un abonnement"}</CModalTitle></CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>ID Profil</CFormLabel>
            <CFormInput type="text" name="profileId" value={editSubscription?.profileId || newSubscription.profileId} onChange={(e) => setNewSubscription({ ...newSubscription, profileId: e.target.value })} />
            <CFormLabel>Note</CFormLabel>
            <CFormInput type="text" name="note" value={editSubscription?.note || newSubscription.note} onChange={(e) => setNewSubscription({ ...newSubscription, note: e.target.value })} />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fermer</CButton>
          <CButton color="primary" onClick={editSubscription ? () => handleUpdateSubscription(editSubscription.profileId, newSubscription) : handleAddSubscription}>
            {editSubscription ? "Modifier" : "Ajouter"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ListSubscriptions;
