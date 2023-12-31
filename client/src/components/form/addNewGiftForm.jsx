"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CATEGORIES,
  GET_OCCASIONS,
  GET_PRODUCTS,
} from "../../graphql/querries"; // Import your queries
import { GraphQLClient } from "graphql-request";

// AWS S3 IMPORTS

import { useEffect, useState } from "react";
import fetchImagesFromS3 from "../../utils/fetchImagesFromS3";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  giftname: z.string().max(100),
  craftman_id: z.number().optional(),
  description: z.string(),
  price: z.number(),
  category: z.string().max(50),
  url: z.string(),
  occasion: z.union([z.string(), z.array(z.string())]),
  sku: z.string().max(100),
});

const AddNewGiftForm = () => {
  const router = useRouter();
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(GET_CATEGORIES);
  const {
    data: occasionData,
    loading: occasionLoading,
    error: occasionError,
  } = useQuery(GET_OCCASIONS);

  const {
    data: productsData,
    loading: oproductsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery(GET_PRODUCTS);

  console.log(productsData);

  //.......................... LOGIC FOR FETCHING IMAGES FROM AWS S3
  // FETCHING IMAGES FROM AMAEZON S3

  const [giftImageMap, setGiftImageMap] = useState({}); // New state to map gift_ids to their images
  const [productsLength, setProductsLength] = useState(0);
  const [giftNum, setGiftNum] = useState(0);
  const [images, setImages] = useState([]);
  // Fetching the length of the products from database
  const giftId = giftNum;

  useEffect(() => {
    if (productsData && productsData.products) {
      const ProductsLength = productsData.products.length;
      setGiftNum(ProductsLength + 1);
      setProductsLength(ProductsLength);
    }
  }, [productsData]); // Add productsData to the dependency array
  // Fetch all images

  useEffect(() => {
    const AllImages = async () => {
      const images = await fetchImagesFromS3();
      setImages(images);
    };

    AllImages();
  }, []);

  // Fetch images relevant to giftId
  useEffect(() => {
    const loadImages = async () => {
      const images = await fetchImagesFromS3(giftId);

      if (images && images.length > 0) {
        setGiftImageMap((prevMap) => ({ ...prevMap, [giftId]: images }));
      }
    };

    if (giftId) {
      loadImages();
    }
  }, [giftId]);

  const relevantImages = giftImageMap[giftId] || [];

  // The first image in the array of the relevant product images
  const MainImage = relevantImages[0];

  console.log("logging  the main image", relevantImages, giftId);

  //..................................  THE END OF LOGIC

  const categories = categoryData?.categories || [];
  const occasions = occasionData?.occasions || [];
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
      occasion: [],
    },
    shouldUseNativeValidation: true,
  });

  const [selectedOccasions, setSelectedOccasions] = React.useState([]);
  const handleOccasionChange = (event) => {
    if (event.target.checked) {
      setSelectedOccasions([...selectedOccasions, event.target.value]);
    } else {
      setSelectedOccasions(
        selectedOccasions.filter((o) => o !== event.target.value)
      );
    }
  };

  //GRAPHQL SETUP
  const createGift = async (giftData) => {
    const client = new GraphQLClient("http://localhost:3001/graphql");

    const mutation = `mutation CreateGift($giftData: GiftInput!) {
  createGift(giftData: $giftData) {
    craftman_id
    sku
    giftname
    description
    price
    url
    main_image
    occasions {
      occasion {
        id
      }
    }
    productCategory {
      category {
        category_id
      }
    }
  }
}`;

    try {
      // Convert categoryId to integer before sending
      const categoryIdInt = parseInt(giftData.category_id, 10);

      // Modify the giftData to use the converted categoryId
      const modifiedGiftData = {
        ...giftData,
        category_id: categoryIdInt,
      };

      const data = await client.request(mutation, {
        giftData: modifiedGiftData,
      });
      console.log("Gift created successfully:", data.createGift);
      toast.success("Gift created successfully");
    } catch (error) {
      console.error("Error creating gift:", error);
      toast.error("Something went wrong while creating the gift");
    }
  };

  const onSubmit = async (data) => {
    console.log("the data  about to be  addeed for  new gift", data);
    const selectedCategory = categories.find(
      (c) => c.category_name === data.category
    );
    const category_id = selectedCategory
      ? parseInt(selectedCategory.category_id)
      : null;

    const occasionIds = occasions
      .filter((occasion) => data.occasion.includes(occasion.name))
      .map((occasion) => parseInt(occasion.id));

    const apiData = {
      ...data,
      category_id: category_id,
      occasionIds,
      main_image: MainImage || images[0], //TODO: temporary solution untill i get the aws s3 bucket filled with images
    };

    console.log("before deleting cat", apiData);

    delete apiData.occasion;
    delete apiData.category;
    console.log("after deleting cat", apiData);
    try {
      await createGift(apiData);
      toast.success(`${data.giftname} was successfully added to the database`);
      reset();
      refetchProducts();

      setTimeout(() => {
        router.push(`/admin/addgift/inventory_info/${giftId}`);
      }, 2000);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  console.log("logging images fetched from aws s3 ", images);
  return (
    <div className="max-w-lg w-full  mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl text-charcoal font-bold mb-1">
        <span className="text-turquoise ">First Page : </span>
        Initial Gift Informations :
      </h1>
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
            <option value="">Select a category</option>
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
