import React from "react";
import CraftmanForm from "../../../components/craftman/craftmanForm";
import { getUsers } from "../../../graphql/querries";

getUsers().then((users) => console.log(users));
function AddCraftman() {
  return (
    <>
      <CraftmanForm />
    </>
  );
}

export default AddCraftman;
