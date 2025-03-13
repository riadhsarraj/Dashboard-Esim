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
  { key: "intention", label: "Intention" },
  { key: "etat", label: "État" },
  { key: "statutPayeur", label: "Statut du payeur" },
  { key: "montantTotal", label: "Montant total" },
  { key: "numeroFacture", label: "Numéro de facture" },
  { key: "liensPaiement", label: "Liens de paiement" },
  { key: "actions", label: "Action" },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    numeroCommande: "",
    intention: "",
    etat: "",
    statutPayeur: "",
    montantTotal: "",
    numeroFacture: "",
    liensPaiement: "",
  });

  // Récupérer toutes les transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/transactions/getAllTransactions");
      setTransactions(response.data);
    } catch (error) {
      setError(`Erreur lors de la récupération des transactions: ${error.response?.data?.message || error.message}`);
      console.error("Erreur détaillée:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Ajouter une transaction
  const handleAddTransaction = async () => {
    try {
      const response = await axios.post("http://localhost:5000/transactions/createTransaction", newTransaction);
      if (response.status === 201) {
        setShowAddModal(false);
        setNewTransaction({
          numeroCommande: "",
          intention: "",
          etat: "",
          statutPayeur: "",
          montantTotal: "",
          numeroFacture: "",
          liensPaiement: "",
        });
        fetchTransactions();
      }
      alert("Transaction créée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error);
      alert("Échec de la création de la transaction");
    }
  };

  // Gérer les changements dans les champs du formulaire d'ajout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prevTransaction) => ({
      ...prevTransaction,
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
        Ajouter une transaction
      </CButton>
      <h3>Liste des transactions</h3>
      <CTable
        columns={columns}
        items={transactions.map((transaction) => ({
          ...transaction,
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

      {/* Modal pour ajouter une transaction */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader>
          <CModalTitle>Ajouter une transaction</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Numéro de commande</CFormLabel>
              <CFormInput
                type="text"
                name="numeroCommande"
                value={newTransaction.numeroCommande}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Intention</CFormLabel>
              <CFormInput
                type="text"
                name="intention"
                value={newTransaction.intention}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>État</CFormLabel>
              <CFormInput
                type="text"
                name="etat"
                value={newTransaction.etat}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Statut du payeur</CFormLabel>
              <CFormInput
                type="text"
                name="statutPayeur"
                value={newTransaction.statutPayeur}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Montant total</CFormLabel>
              <CFormInput
                type="number"
                name="montantTotal"
                value={newTransaction.montantTotal}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Numéro de facture</CFormLabel>
              <CFormInput
                type="text"
                name="numeroFacture"
                value={newTransaction.numeroFacture}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Liens de paiement</CFormLabel>
              <CFormInput
                type="text"
                name="liensPaiement"
                value={newTransaction.liensPaiement}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleAddTransaction}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Transactions;