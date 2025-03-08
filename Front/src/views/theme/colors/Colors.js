import React from "react";
import { CTable } from "@coreui/react";

const columns = [
  { key: "id", label: "#" },
  { key: "name", label: "Nom" },
  { key: "email", label: "Email" },
];

const items = [
  { id: 1, name: "John Doe", email: "john@example.com"},
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
];

const footer = ["Total", "", "3 utilisateurs"];

const ExampleTable = () => {
  return (
    <CTable 
      columns={columns} 
      items={items} 
      footer={footer} 
      tableHeadProps={{ color: "light" }} 
      striped 
      bordered 
      hover 
    />
  );
};

export default ExampleTable;
