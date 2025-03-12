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
  CModalFooter 
} from "@coreui/react";

const columns = [
  { key: "name", label: "Nom" },
  { key: "description", label: "Description" },
  { key: "secretId", label: "ID secret" },
  { key: "userId", label: "ID utilisateur" },
  { key: "accountId", label: "ID compte" },
  { key: "actions", label: "Action" },
  { key: "images", label: "Images" },
];

const PaymentMethodList = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: "",
    description: "",
    secretId: "",
    userId: "",
    accountId: "",
    token: "",
    auth: "",
    attributionId: "",
    requestId: "",
  });
  const [editPaymentMethod, setEditPaymentMethod] = useState(null);

  // Récupérer les modes de paiement
  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getPaymentMethods");
      setPaymentMethods(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des modes de paiement");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Ajouter un mode de paiement
  const handleAddPaymentMethod = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createPaymentMethod", newPaymentMethod);
      if (response.status === 201) {
        setShowModal(false);
        setNewPaymentMethod({
          name: "",
          description: "",
          secretId: "",
          userId: "",
          accountId: "",
          token: "",
          auth: "",
          attributionId: "",
          requestId: "",
        });
        fetchPaymentMethods();
      }
      alert("Mode de paiement créé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du mode de paiement:", error);
      alert("Échec de la création du mode de paiement");
    }
  };

  // Modifier un mode de paiement
  const handleUpdatePaymentMethod = async (name) => {
    try {
      const response = await axios.put(`http://localhost:5000/updatePaymentMethodByName/${name}`, editPaymentMethod);
      if (response.status === 200) {
        setShowModal(false);
        setEditPaymentMethod(null);
        fetchPaymentMethods();
      }
      alert("Mode de paiement mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mode de paiement:", error);
      alert("Échec de la mise à jour du mode de paiement");
    }
  };

  // Supprimer un mode de paiement
  const handleDeletePaymentMethod = async (name) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mode de paiement ?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/deletePaymentMethodByName/${name}`);
        if (response.status === 200) {
          fetchPaymentMethods();
        }
        alert("Mode de paiement supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression du mode de paiement:", error);
        alert("Échec de la suppression du mode de paiement");
      }
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editPaymentMethod) {
      setEditPaymentMethod((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewPaymentMethod((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Ouvrir le modal pour ajouter ou modifier
  const openModal = (paymentMethod = null) => {
    setEditPaymentMethod(paymentMethod);
    setShowModal(true);
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      
        
        <CButton color="primary" onClick={() => openModal()}>
           Ajouter un mode de paiement
        </CButton>
      

      <div>
        <h3>Liste des modes de paiement</h3>
        <CTable
          columns={columns}
          items={paymentMethods.map((method) => ({
            ...method,
            actions: (
              <div>
                <CButton color="warning" size="sm" onClick={() => openModal(method)}>
                  <span style={{ fontSize: "1.2em" }}>✏️</span>
                </CButton>
                <CButton color="danger" size="sm" onClick={() => handleDeletePaymentMethod(method.name)}>
                  <span style={{ fontSize: "1.2em" }}>🗑️</span>
                </CButton>
              </div>
            ),
            images: <div>🖼️</div>, // Placeholder pour les images (peut être remplacé par un composant d'image)
          }))}
          tableHeadProps={{ color: "light" }}
          striped
          bordered
          hover
        />
      </div>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{editPaymentMethod ? "Modifier un mode de paiement" : "Ajouter un mode de paiement"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Nom</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                value={editPaymentMethod ? editPaymentMethod.name : newPaymentMethod.name}
                onChange={handleInputChange}
                disabled={editPaymentMethod !== null} // Désactiver pour éviter la modification du nom
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormInput
                type="text"
                name="description"
                value={editPaymentMethod ? editPaymentMethod.description : newPaymentMethod.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>ID secret</CFormLabel>
              <CFormInput
                type="text"
                name="secretId"
                value={editPaymentMethod ? editPaymentMethod.secretId : newPaymentMethod.secretId}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>ID utilisateur</CFormLabel>
              <CFormInput
                type="text"
                name="userId"
                value={editPaymentMethod ? editPaymentMethod.userId : newPaymentMethod.userId}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>ID compte</CFormLabel>
              <CFormInput
                type="text"
                name="accountId"
                value={editPaymentMethod ? editPaymentMethod.accountId : newPaymentMethod.accountId}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Token</CFormLabel>
              <CFormInput
                type="text"
                name="token"
                value={editPaymentMethod ? editPaymentMethod.token : newPaymentMethod.token}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Authentification</CFormLabel>
              <CFormInput
                type="text"
                name="auth"
                value={editPaymentMethod ? editPaymentMethod.auth : newPaymentMethod.auth}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>ID d'attribution</CFormLabel>
              <CFormInput
                type="text"
                name="attributionId"
                value={editPaymentMethod ? editPaymentMethod.attributionId : newPaymentMethod.attributionId}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>ID de requête</CFormLabel>
              <CFormInput
                type="text"
                name="requestId"
                value={editPaymentMethod ? editPaymentMethod.requestId : newPaymentMethod.requestId}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={editPaymentMethod ? () => handleUpdatePaymentMethod(editPaymentMethod.name) : handleAddPaymentMethod}>
            {editPaymentMethod ? "Enregistrer" : "Ajouter"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PaymentMethodList;