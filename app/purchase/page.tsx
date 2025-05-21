"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Truck, X, RefreshCw, ArrowLeft } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [address, setAddress] = useState("");
  const [availability, setAvailability] = useState("9am - 5pm");
  const [deliveryStatus, setDeliveryStatus] = useState("Preparing for shipment");
  const [orderCancelled, setOrderCancelled] = useState(false);
  // Add the missing username state
  const [username, setUsername] = useState(""); // You can set a default value if needed

  const cancelOrder = () => {
    if (deliveryStatus === "Preparing for shipment") {
      setOrderCancelled(true);
      setDeliveryStatus("Order Cancelled");
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/delivery/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, // Now username is properly defined
          deliveryMethod,
          address,
          availability,
        }),
      });
  
      if (res.ok) {
        alert("Delivery details updated successfully.");
      } else {
        alert("Failed to update delivery details.");
      }
    } catch (error) {
      console.error("Error updating delivery details:", error);
      alert("Something went wrong while saving changes.");
    }
  };

  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
     
      <div className="flex justify-between items-center mt-6">
        <Button onClick={() => router.push("/customer-dash")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-4xl font-bold">Set Delivery</h1>
      </div>
    
      <Card>
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-medium">Delivery Method</span>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={deliveryMethod === "delivery"}
                onChange={() => setDeliveryMethod("delivery")}
              />
              Home Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
              />
              Store Pickup
            </label>
          </div>
          <div>
            <strong>Current:</strong> {deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}
          </div>
        </CardContent>
      </Card>

      {deliveryMethod === "delivery" && (
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <label className="font-medium">Delivery Address</label>
            <Input
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={deliveryStatus !== "Preparing for shipment"}
            />
          </CardContent>
        </Card>
      )}

      {deliveryMethod === "delivery" ? (
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <label className="font-medium">Home Availability</label>
            <Textarea
              placeholder="E.g., Mon–Fri, 9am to 5pm"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <label className="font-medium">Pickup Date & Time</label>
            <Input
              type="datetime-local"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Order Status</span>
            <span>{deliveryStatus}</span>
          </div>
          {!orderCancelled && (
            <div className="flex gap-2">
              <Button variant="destructive" onClick={cancelOrder}>
                <X className="mr-2 h-4 w-4" /> Cancel Order
              </Button>

            </div>
          )}
        </CardContent>
      </Card>

      {deliveryMethod === "delivery" && deliveryStatus !== "Order Cancelled" && (
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Live Tracking: Vehicle is 4 stops away</span>
            </div>
            <div className="h-48 w-full bg-gray-200 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 mr-2" /> Map placeholder
            </div>
          </CardContent>
        </Card>
      )}
      <Button
        className="w-full"
        onClick={handleSave}
        disabled={orderCancelled}
      >   
        Save Changes
      </Button>
    </div>
  );
}