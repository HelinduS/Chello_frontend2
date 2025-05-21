"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddProductModal from "@/components/ui/addProductModal";
import ProductSortDropdown from "@/components/ui/productSort"
import ProductGrid from "@/components/ui/productsGrid"
import { useMemo } from "react";

// Product type
interface Product {
  id?: number;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === "priceLowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighToLow") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "nameAZ") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "nameZA") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sorted;
  }, [products, sortBy]);

  // Load products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Add or update a product
  const handleSaveProduct = async (product: Product) => {
    try {
      let savedProduct = product;

      if (product.id) {
        const token = localStorage.getItem("token");
        console.log("Token used:", token);
        // Update product
        const response = await fetch(`http://localhost:8080/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" ,
          Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify(product),
          
        });

        if (!response.ok) throw new Error("Failed to update product");
        savedProduct = await response.json();

        // Replace product in state
        setProducts((prev) =>
          prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        );
        setSuccessMessage("Product successfully updated!");
      } else {
        const token = localStorage.getItem("token");
        console.log("Token used:", token);
        // Add new product
        const response = await fetch("http://localhost:8080/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
           },
          body: JSON.stringify(product),
        });

        if (!response.ok) throw new Error("Failed to add product");
        savedProduct = await response.json();

        // Add product to list
        setProducts((prev) => [...prev, savedProduct]);
        setSuccessMessage("Product successfully added!");
      }

      setProductToEdit(null); // Close modal
      setModalOpen(false); // Close modal after saving
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Set selected product for editing
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token used:", token);
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to delete product");
  
      // Remove product from state
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setSuccessMessage("Product successfully deleted!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Manage Products</h1>
        <AddProductModal
          trigger={
            <Button
              onClick={() => {
                setProductToEdit(null);
                setModalOpen(true);
              }}
            >
              Add Product
            </Button>
          }
          open={modalOpen}
          onOpenChange={setModalOpen}
          productToEdit={productToEdit || undefined}
          onSave={handleSaveProduct}
        />
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded shadow">
          {successMessage}
        </div>
      )}

      <ProductSortDropdown sortBy={sortBy} onSortChange={setSortBy} />

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <h2 className="text-lg font-bold">{product.name}</h2>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-contain mb-2 rounded"
              />
            )}
            <p className="text-md font-semibold">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleEditProduct(product)}>Edit</Button>
              <Button onClick={() => product.id && handleDeleteProduct(product.id)} variant="destructive">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;