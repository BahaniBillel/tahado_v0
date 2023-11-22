"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddGift } from "../../app/api/giftsAPIs";
import { addCategoryAPI } from "../../app/api/categoriesAPIs";
import { addOccasionAPI } from "../../app/api/occasionAPIs";
import { toast } from "react-toastify";
import { FetchAllOcassions } from "../../app/api/occasionAPIs";
import { FetchAllCategories } from "../../app/api/categoriesAPIs";

const productSchema = z.object({
  giftname: z.string().max(100),
  craftman_id: z.number().optional(),
  description: z.string(),
  price: z.number(),
  category: z.string().max(50),
  url: z.string(),
  occasion: z.union([z.string(), z.array(z.string())]), // Changed to an array of strings
  sku: z.string().max(100), // SKU field added
});

const AddNewGiftForm = () => {
  // Logic for Fetching and Handling data from database
  const [occasions, setOccasions] = React.useState([]);
  const [selectedOccasions, setSelectedOccasions] = React.useState([]);

  // Fetch occasions from the API when the component mounts
  React.useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const fetchedOccasions = await FetchAllOcassions();
        // Make sure that fetchedOccasions is an array before setting it
        if (Array.isArray(fetchedOccasions)) {
          setOccasions(fetchedOccasions);
        } else {
          throw new Error("Fetched occasions is not an array");
        }
      } catch (error) {
        console.error("Error fetching occasions:", error);
        toast.error("Failed to fetch occasions.");
      }
    };

    fetchOccasions();
  }, []);

  // Checkbox change handler
  const handleOccasionChange = (event) => {
    if (event.target.checked) {
      setSelectedOccasions([...selectedOccasions, event.target.value]);
    } else {
      setSelectedOccasions(
        selectedOccasions.filter((o) => o !== event.target.value)
      );
    }
  };

  // ..........................................................................................................
  // Fetching Categories data from database using api
  const [categories, setCategories] = React.useState([]);
  // Logic for selecting Categories and Occasions as IDs
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  console.log(categories);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await FetchAllCategories();

        if (Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories);
        } else {
          throw new Error("Fetched categories is not an array");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  React.useEffect(() => {
    console.log(selectedCategories); // This will log the updated state after changes
  }, [selectedCategories]);

  // Logic for Handling Form inputs

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      occasion: [], // Provide default values for occasions
    },
    shouldUseNativeValidation: true,
  });

  const onSubmit = async (data) => {
    // Find the category ID based on the selected category name
    const selectedCategory = categories.find(
      (c) => c.category_name === data.category
    );
    const categoryId = selectedCategory ? selectedCategory.category_id : null;
    // console.log(selectedCategory.category_id);

    // Map the selected occasion names to their IDs
    const occasionIds = occasions
      .filter((occasion) => data.occasion.includes(occasion.name))
      .map((occasion) => occasion.id);
    console.log(occasionIds);

    // Prepare the data for the API
    const apiData = {
      ...data,
      categoryId, // Include the category ID
      occasionIds, // Include the occasion IDs
    };

    // Remove the occasion names array from apiData since we now have occasionIds
    delete apiData.occasion;
    delete apiData.category;

    console.log("data to be sent", apiData.categoryId);
    try {
      // const response = await AddGift(submitData);* // Assuming that category and occasion selections have been collected as IDs
      const response = await AddGift(apiData);
      await notify(apiData.giftname);
      console.log("API Response:", response);
      reset();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const notify = (input) => {
    toast(`${input} has been added to your database`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar text-xs font-light",
    });
  };
  return (
    <div className="max-w-lg w-full  mx-auto p-6 bg-white rounded shadow">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-gray-700">Gift Name</label>
          <input
            type="text"
            {...register("giftname")}
            className="w-full p-2 border rounded"
          />
          {errors.giftname && (
            <p className="text-red-500">{errors.giftname.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Craftman ID</label>
          <input
            type="number"
            {...register("craftman_id", {
              setValueAs: (value) => parseFloat(value),
            })}
            className="w-full p-2 border rounded"
          />
          {errors.craftman_id && (
            <p className="text-red-500">{errors.craftman_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            {...register("description")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              setValueAs: (value) => parseFloat(value),
            })}
            className="w-full p-2 border rounded"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-charcoal">Category</label>
          <select
            {...register("category")}
            className="w-full p-2 border rounded"
            onChange={(e) => {
              // For multiple selections, you would use something like:
              // const selected = Array.from(e.target.selectedOptions, (option) => option.value);
              // console.log(selected);
              // But for single selection, it's just:
              console.log(e.target.value); // Log the selected category value
              // Other handling code here...
            }}
          >
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_name}>
                {category.category_name}
              </option>
            ))}
          </select>

          {/* Handle potential errors for categoryIds here */}
        </div>

        <div>
          <label className="block text-gray-700">URL</label>
          <input
            type="text"
            {...register("url")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">SKU</label>
          <input
            type="text"
            {...register("sku")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Occasion</label>
          {occasions.length > 0 ? (
            occasions.map((occasion) => (
              <Controller
                control={control}
                name="occasion"
                key={occasion.id}
                render={({ field }) => (
                  <div key={occasion.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={occasion.name}
                        onChange={(e) => {
                          handleOccasionChange(e);
                          if (e.target.checked) {
                            field.onChange([...field.value, e.target.value]);
                          } else {
                            field.onChange(
                              field.value.filter((v) => v !== e.target.value)
                            );
                          }
                        }}
                        checked={field.value.includes(occasion.name)}
                      />
                      {occasion.name}
                    </label>
                  </div>
                )}
              />
            ))
          ) : (
            <p>Loading occasions...</p>
          )}
          {errors.occasion && (
            <p className="text-red-500">{errors.occasion.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="bg-charcoal text-white p-2 rounded hover:scale-95"
            onClick={() => console.log("Button clicked")}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewGiftForm;
