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
  { key: "numeroCommande", label: "Numéro de commande" },
  { key: "prix", label: "Prix" },
  { key: "quantite", label: "Quantité" },
  { key: "fournisseur", label: "Fournisseur" },
  { key: "detailsClient", label: "Détails du client" },
  { key: "updateStatus", label: "Mettre à jour le statut des commandes" },
  { key: "detailsCommande", label: "Détails de la commande" },
  { key: "transactions", label: "Transactions des commandes" },
  { key: "actions", label: "Action" },
];

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [commandeDetails, setCommandeDetails] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [newCommande, setNewCommande] = useState({
    numeroCommande: "",
    prix: "",
    quantite: "",
    fournisseur: "",
    detailsClient: "",
  });

  // Récupérer les commandes, statuts, détails et transactions
  const fetchData = async () => {
    try {
      const [commandesResponse, statusResponse] = await Promise.all([
        axios.get("http://localhost:5000/getCommandes"),
        axios.get("http://localhost:5000/getCommandeStatus"),
      ]);
      setCommandes(commandesResponse.data);
      setStatusList(statusResponse.data);
    } catch (error) {
      setError("Erreur lors de la récupération des données");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ajouter une commande
  const handleAddCommande = async () => {
    try {
      const response = await axios.post("http://localhost:5000/createCommande", newCommande);
      if (response.status === 201) {
        setShowAddModal(false);
        setNewCommande({ numeroCommande: "", prix: "", quantite: "", fournisseur: "", detailsClient: "" });
        fetchData();
      }
      alert("Commande créée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande:", error);
      alert("Échec de la création de la commande");
    }
  };

  // Mettre à jour le statut d'une commande
  const handleUpdateStatus = async (numeroCommande, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/updateCommandeStatus/${numeroCommande}`, { status: newStatus });
      if (response.status === 200) {
        alert("Statut mis à jour avec succès");
        fetchData();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Échec de la mise à jour du statut");
    }
  };

  // Récupérer les détails d'une commande
  const handleShowDetails = async (numeroCommande) => {
    try {
      const response = await axios.get(`http://localhost:5000/getCommandeDetails/${numeroCommande}`);
      setCommandeDetails(response.data);
      setSelectedCommande(numeroCommande);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      alert("Échec de la récupération des détails");
    }
  };

  // Récupérer les transactions d'une commande
  const handleShowTransactions = async (numeroCommande) => {
    try {
      const response = await axios.get(`http://localhost:5000/getCommandeTransactions/${numeroCommande}`);
      setTransactionDetails(response.data);
      setSelectedCommande(numeroCommande);
      setShowTransactionModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
      alert("Échec de la récupération des transactions");
    }
  };

  // Gérer les changements dans les champs du formulaire d'ajout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommande((prevCommande) => ({
      ...prevCommande,
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
        Ajouter une commande
      </CButton>
      <h3>Liste des commandes</h3>
      <CTable
        columns={columns}
        items={commandes.map((commande) => ({
          ...commande,
          updateStatus: (
            <CButton color="warning" size="sm" onClick={() => { setSelectedCommande(commande.numeroCommande); setShowStatusModal(true); }}>
              <span style={{ fontSize: "1.2em" }}>⚙️</span>
            </CButton>
          ),
          detailsCommande: (
            <CButton color="success" size="sm" onClick={() => handleShowDetails(commande.numeroCommande)}>
              <span style={{ fontSize: "1.2em" }}>📝</span>
            </CButton>
          ),
          transactions: (
            <CButton color="info" size="sm" onClick={() => handleShowTransactions(commande.numeroCommande)}>
              <span style={{ fontSize: "1.2em" }}>💳</span>
            </CButton>
          ),
          actions: (
            <CButton color="primary" size="sm" onClick={() => { /* Logique de modification */ }}>
              <span style={{ fontSize: "1.2em" }}>✏️</span>
            </CButton>
          ),
        }))}
        tableHeadProps={{ color: "light" }}
        striped
        bordered
        hover
      />

      {/* Modal pour ajouter une commande */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Ajouter une commande</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Numéro de commande</CFormLabel>
              <CFormInput
                type="text"
                name="numeroCommande"
                value={newCommande.numeroCommande}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Prix</CFormLabel>
              <CFormInput
                type="number"
                name="prix"
                value={newCommande.prix}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Quantité</CFormLabel>
              <CFormInput
                type="number"
                name="quantite"
                value={newCommande.quantite}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Fournisseur</CFormLabel>
              <CFormInput
                type="text"
                name="fournisseur"
                value={newCommande.fournisseur}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Détails du client</CFormLabel>
              <CFormInput
                type="text"
                name="detailsClient"
                value={newCommande.detailsClient}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleAddCommande}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal pour mettre à jour le statut */}
      <CModal visible={showStatusModal} onClose={() => setShowStatusModal(false)}>
        <CModalHeader>
          <CModalTitle>Mettre à jour le statut des commandes</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Type de statut</CFormLabel>
              <CFormSelect
                name="status"
                onChange={(e) => handleUpdateStatus(selectedCommande, e.target.value)}
              >
                <option value="">Sélectionnez un statut</option>
                {statusList.map((status) => (
                  <option key={status.nom} value={status.nom}>
                    {status.nom}: {status.description}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowStatusModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal pour les détails de la commande */}
      <CModal visible={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <CModalHeader>
          <CModalTitle>Liste des détails des commandes</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable>
            <thead>
              <tr>
                <th>Article</th>
                <th>Prix</th>
                <th>Quantité</th>
              </tr>
            </thead>
            <tbody>
              {commandeDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.article}</td>
                  <td>{detail.prix}</td>
                  <td>{detail.quantite}</td>
                </tr>
              ))}
            </tbody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal pour les transactions */}
      <CModal visible={showTransactionModal} onClose={() => setShowTransactionModal(false)}>
        <CModalHeader>
          <CModalTitle>Détails des transactions des commandes</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable>
            <thead>
              <tr>
                <th># Intention</th>
                <th>État</th>
                <th>Statut du payeur</th>
                <th>Montant total</th>
                <th>Liens de paiement</th>
              </tr>
            </thead>
            <tbody>
              {transactionDetails.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.intention}</td>
                  <td>{transaction.etat}</td>
                  <td>{transaction.statutPayeur}</td>
                  <td>{transaction.montantTotal}</td>
                  <td>{transaction.liensPaiement}</td>
                </tr>
              ))}
            </tbody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowTransactionModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Commandes;