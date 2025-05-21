"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Order {
    id: number;
    customerName: string;
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Canceled";
    driverId?: string;
    orderDate?: string;
    items: string; // JSON string from backend
    total: number;
}

interface Driver {
    id: number;
    name: string;
    status: "Available" | "Busy";
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("All");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const ordersResponse = await fetch("http://localhost:8080/api/orders", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!ordersResponse.ok) throw new Error(`Failed to fetch orders: ${ordersResponse.status}`);
                const ordersData = await ordersResponse.json();
                const parsedOrders = ordersData.map((order: Order) => ({
                    ...order,
                    items: JSON.parse(order.items),
                }));

                const driversResponse = await fetch("http://localhost:8080/api/drivers", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!driversResponse.ok) throw new Error(`Failed to fetch drivers: ${driversResponse.status}`);
                const driversData = await driversResponse.json();

                setOrders(parsedOrders);
                setDrivers(driversData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateOrderStatus = async (orderId: number, newStatus: Order["status"]) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error("Failed to update status");
            const updatedOrder = await response.json();
            setOrders(orders.map(order => (order.id === orderId ? updatedOrder : order)));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const assignDriver = async (orderId: number, driverId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/assign-driver`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ driverId: driverId || null }),
            });
            if (!response.ok) throw new Error("Failed to assign driver");
            const updatedOrder = await response.json();
            setOrders(orders.map(order => (order.id === orderId ? updatedOrder : order)));
        } catch (error) {
            console.error("Error assigning driver:", error);
        }
    };

    const filteredOrders = filter === "All" ? orders : orders.filter(order => order.status === filter);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full p-4 lg:p-6">
            <h1 className="text-3xl font-bold mb-6 text-left">Order Management</h1>

            <div className="mb-6 flex gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded w-[180px]"
                >
                    <option value="All">All Orders</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                </select>
            </div>

            <Card className="p-6">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Order ID</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Items</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Driver</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{order.id}</td>
                            <td className="px-4 py-2">{order.customerName}</td>
                            <td className="px-4 py-2">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
                            <td className="px-4 py-2">{Array.isArray(order.items) ? order.items.length : "N/A"}</td>
                            <td className="px-4 py-2">${order.total.toFixed(2)}</td>
                            <td className="px-4 py-2">
                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                                    className="p-2 border rounded w-[120px]"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                            </td>
                            <td className="px-4 py-2">
                                <select
                                    value={order.driverId || ""}
                                    onChange={(e) => assignDriver(order.id, e.target.value)}
                                    disabled={order.status === "Delivered" || order.status === "Canceled"}
                                    className="p-2 border rounded w-[150px]"
                                >
                                    <option value="">Not Assigned</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} ({driver.status})
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-2">
                                <Button variant="outline" size="sm">
                                    View Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default OrdersPage;