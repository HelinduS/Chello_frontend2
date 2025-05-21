'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Driver = {
  id: string;
  name: string;
  status: "Available" | "Busy" | "Offline";
  region: string;
  rating: number;
  completedDeliveries: number;
};

type Delivery = {
  id: string;
  customer: string;
  region: string;
  status: "Unassigned" | "Assigned";
  assignedDriver?: string;
};

export default function CustomerDashboard() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    // Fetch drivers data from your API
    const fetchDrivers = async () => {
      try {
        const response = await fetch("/api/drivers"); // Replace with your actual API endpoint
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    // Fetch deliveries data from your API
    const fetchDeliveries = async () => {
      try {
        const response = await fetch("/api/deliveries"); // Replace with your actual API endpoint
        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDrivers();
    fetchDeliveries();
  }, []);

  const filteredDrivers = filterStatus
    ? drivers.filter((driver) => driver.status === filterStatus)
    : drivers;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Delivery Drivers</h1>

      <div className="flex items-center gap-4">
        <Input placeholder="Search drivers..." />
        <Select onValueChange={(value) => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Busy">Busy</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h2 className="text-lg font-semibold">{driver.name}</h2>
                <p className="text-sm text-gray-500">Region: {driver.region}</p>
                <p className="text-sm">Deliveries: {driver.completedDeliveries}</p>
                <p className="text-sm">Rating: ⭐ {driver.rating}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant={
                    driver.status === "Available"
                      ? "default"
                      : driver.status === "Busy"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {driver.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}