import React, { useEffect, useState } from "react";
import axios from "axios";
import { CTable } from "@coreui/react";

const columns = [
  { key: "id", label: "#" },
  { key: "username", label: "Nom" },
  { key: "email", label: "Email" },
];

const ExampleTable = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getAdmins");
        
        // Ajouter un compteur `id` à chaque administrateur
        const adminsWithId = response.data.map((admin, index) => ({
          ...admin,
          id: index + 1, // Commence à 1 au lieu de 0
        }));

        setAdmins(adminsWithId);
      } catch (error) {
        setError("Erreur lors de la récupération des administrateurs");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const footer = ["Total", "", `${admins.length} utilisateurs`];

  return (
    <CTable 
      columns={columns} 
      items={admins} 
      footer={footer} 
      tableHeadProps={{ color: "light" }} 
      striped 
      bordered 
      hover 
    />
  );
};

export default ExampleTable;