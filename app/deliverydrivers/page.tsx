'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

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

const mockDrivers: Driver[] = [
  { id: "1", name: "John Diggle", status: "Available", region: "North", rating: 4.5, completedDeliveries: 120 },
  { id: "2", name: "Oliver Queen", status: "Busy", region: "East", rating: 4.8, completedDeliveries: 200 },
  { id: "3", name: "Demian Dark", status: "Available", region: "South", rating: 4.3, completedDeliveries: 95 },
];

const mockDeliveries: Delivery[] = [
  { id: "d1", customer: "Barry Allen", region: "North", status: "Unassigned" },
  { id: "d2", customer: "Iris West", region: "South", status: "Unassigned" },
  { id: "d3", customer: "Cisco Ramon", region: "East", status: "Assigned", assignedDriver: "Oliver Queen" },
];

export default function DeliveryDriversDashboard() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    setDrivers(mockDrivers);
    setDeliveries(mockDeliveries);
  }, []);

  const filteredDrivers = filterStatus
    ? drivers.filter((driver) => driver.status === filterStatus)
    : drivers;

  const handleAssign = (deliveryId: string, driverName: string) => {
    setDeliveries((prev) =>
      prev.map((del) =>
        del.id === deliveryId
          ? {
              ...del,
              status: "Assigned",
              assignedDriver: driverName,
            }
          : del
      )
    );
  };

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

                {driver.status === "Available" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Assign Delivery</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h3 className="text-lg font-semibold mb-2">Assign a Delivery</h3>
                      <ul className="space-y-2">
                        {deliveries.filter((d) => d.status === "Unassigned").map((delivery) => (
                          <li key={delivery.id} className="flex justify-between items-center border p-2 rounded-md">
                            <div>
                              <p className="font-medium">{delivery.customer}</p>
                              <p className="text-sm text-muted-foreground">Region: {delivery.region}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAssign(delivery.id, driver.name)}
                            >
                              Assign
                            </Button>
                          </li>
                        ))}
                        {deliveries.filter((d) => d.status === "Unassigned").length === 0 && (
                          <p className="text-sm text-muted-foreground">No unassigned deliveries.</p>
                        )}
                      </ul>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button size="sm" disabled>
                    Assign Delivery
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
