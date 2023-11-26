import React from "react";
import CategoryForm from "../../../components/categories/categoryForm";
import { getClient } from "../../../app/lib/client";
import { GET_CATEGORIES } from "../../../graphql/querries";

async function AddCategory() {
  const client = getClient();
  // Use the client instance to query data for occasions
  const { data: categoryData } = await client.query({
    query: GET_CATEGORIES,
    fetchPolicy: "network-only",
    context: {
      fetchOptions: {
        next: { revalidate: 5 },
      },
    },
  });

  console.log(categoryData);
  if (categoryData.categories.length === 0) {
    return <p>Loading categories...</p>;
  }
  return (
    <div
      className="flex fle-row mx-auto justify-start 
  items-start space-x-5 p-2 w-screen h-screen mt-8"
    >
      <div className=" w-3/4 p-4">
        <CategoryForm />
      </div>
      <div className="  w-1/4 h-full py-4  bg-lightGray px-8 ">
        <p className="font-bold">The Available Categories :</p>

        <table className="table-fixed w-full">
          <thead>
            <tr>
              <th>Category</th>
              <th>Parent Category</th>
            </tr>
          </thead>
          <tbody className="mt-1">
            {categoryData.categories.map((category) => (
              <tr key={category.category_id}>
                <td>{category.category_name}</td>
                <td>{category.parent_category_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddCategory;
