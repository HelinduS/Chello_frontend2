"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OrderStatistics {
    completedOrders: number;
    totalRevenue: number;
    avgDeliveryTime: number;
}

interface DeliveryStatusStatistics {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    canceled: number;
}

const DashboardPage = () => {
    const [stats, setStats] = useState<OrderStatistics | null>(null);
    const [deliveryStats, setDeliveryStats] = useState<DeliveryStatusStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<string>(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // 30 days ago
    );
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]); // Today

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const statsResponse = await fetch(
                    `http://localhost:8080/api/orders/statistics?startDate=${startDate}&endDate=${endDate}`,
                    { method: "GET", headers: { "Content-Type": "application/json" } }
                );
                if (!statsResponse.ok) throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
                const statsData = await statsResponse.json();

                const deliveryStatsResponse = await fetch(
                    `http://localhost:8080/api/orders/delivery-statistics?startDate=${startDate}&endDate=${endDate}`,
                    { method: "GET", headers: { "Content-Type": "application/json" } }
                );
                if (!deliveryStatsResponse.ok) throw new Error(`Failed to fetch delivery stats: ${deliveryStatsResponse.status}`);
                const deliveryStatsData = await deliveryStatsResponse.json();

                setStats(statsData);
                setDeliveryStats(deliveryStatsData);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    const chartOptions = { scales: { y: { beginAtZero: true } } };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full p-4 lg:p-6">
            <h1 className="text-3xl font-bold mb-6 text-left">Admin Dashboard</h1>

            <div className="flex gap-4 mb-6">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 w-full">
                    <h2 className="text-2xl font-semibold mb-4">General Statistics</h2>
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div><p className="font-bold">Completed Orders</p><p>{stats.completedOrders}</p></div>
                            <div><p className="font-bold">Total Revenue</p><p>${stats.totalRevenue.toFixed(2)}</p></div>
                            <div><p className="font-bold">Avg Delivery Time</p><p>{stats.avgDeliveryTime.toFixed(2)} hrs</p></div>
                        </div>
                    )}
                    <div className="w-full max-w-full overflow-x-auto">
                        <Bar data={{
                            labels: ["Completed Orders", "Total Revenue ($)", "Avg Delivery Time (hrs)"],
                            datasets: [{
                                label: "Order Statistics",
                                data: stats ? [stats.completedOrders, stats.totalRevenue, stats.avgDeliveryTime] : [0, 0, 0],
                                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                            }],
                        }} options={chartOptions} />
                    </div>
                </Card>

                <Card className="p-6 w-full">
                    <h2 className="text-2xl font-semibold mb-4">Delivery Status Statistics</h2>
                    {deliveryStats && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div><p className="font-bold">Pending</p><p>{deliveryStats.pending}</p></div>
                            <div><p className="font-bold">Processing</p><p>{deliveryStats.processing}</p></div>
                            <div><p className="font-bold">Shipped</p><p>{deliveryStats.shipped}</p></div>
                            <div><p className="font-bold">Delivered</p><p>{deliveryStats.delivered}</p></div>
                            <div><p className="font-bold">Canceled</p><p>{deliveryStats.canceled}</p></div>
                        </div>
                    )}
                    <div className="w-full max-w-full overflow-x-auto">
                        <Bar data={{
                            labels: ["Pending", "Processing", "Shipped", "Delivered", "Canceled"],
                            datasets: [{
                                label: "Delivery Status",
                                data: deliveryStats ? [deliveryStats.pending, deliveryStats.processing, deliveryStats.shipped, deliveryStats.delivered, deliveryStats.canceled] : [0, 0, 0, 0, 0],
                                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                            }],
                        }} options={chartOptions} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;