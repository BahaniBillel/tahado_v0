import { gql } from "@apollo/client";
export const CREATE_CRAFTSMAN = gql`
  mutation CreateCraftman($craftmanData: CraftmanInput!) {
    createCraftman(data: $craftmanData) {
    
      name
      # Include other fields you want to retrieve after creation
    }
  }


  
`;
