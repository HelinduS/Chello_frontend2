"use client";

import React, { useEffect, useState } from "react";
import UserCard from "@/components/ui/userCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Customer {
    id: number;
    username: string;
    email: string;
    phoneNumber?: string;
    address: string;
    role: "ADMIN" | "USER";
}

interface Message {
    id: number;
    customerId: number;
    message: string;
}

const CustomersPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState<"username" | "address" | "phoneNumber">("username");
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [showNotifyPopup, setShowNotifyPopup] = useState(false);
    const [showHistoryPopup, setShowHistoryPopup] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8080/api/users", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) throw new Error(`Failed to fetch customers: ${response.status}`);
                const data = await response.json();
                setCustomers(data);
                setFilteredCustomers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const fetchMessages = async (customerId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${customerId}/messages`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = () => {
        const lowerCaseTerm = searchTerm.toLowerCase();
        const filtered = customers.filter((customer) => {
            const field = customer[searchBy] || "";
            return field.toLowerCase().includes(lowerCaseTerm);
        });
        setFilteredCustomers(filtered);
    };

    const handleToggleSearchBy = () => {
        if (searchBy === "username") setSearchBy("address");
        else if (searchBy === "address") setSearchBy("phoneNumber");
        else setSearchBy("username");
        setSearchTerm("");
        setFilteredCustomers(customers);
    };

    const handleNotifyClick = (id: number) => {
        setSelectedCustomerId(id);
        setShowNotifyPopup(true);
        fetchMessages(id); // Fetch messages when popup opens
    };

    const handleHistoryClick = (id: number) => {
        setSelectedCustomerId(id);
        setShowHistoryPopup(true);
    };

    const closePopup = () => {
        setShowNotifyPopup(false);
        setShowHistoryPopup(false);
        setSelectedCustomerId(null);
        setMessageInput("");
        setMessages([]);
    };

    const handleSendMessage = async () => {
        if (!selectedCustomerId || !messageInput.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/users/${selectedCustomerId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageInput }),
            });
            if (!response.ok) throw new Error("Failed to send message");
            const newMessage = await response.json();
            setMessages([...messages, newMessage]);
            setMessageInput(""); // Clear input after sending
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/messages/${messageId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to delete message");
            setMessages(messages.filter((msg) => msg.id !== messageId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="w-full p-4 lg:p-6">
                <h1 className="text-3xl font-bold mb-6 text-left">Customers</h1>
                <div>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 lg:p-6">
                <h1 className="text-3xl font-bold mb-6 text-left">Customers</h1>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 lg:p-6 relative">
            <h1 className="text-3xl font-bold mb-6 text-left">Customers</h1>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded w-full sm:w-64"
                />
                <button onClick={handleSearch} className="p-2 bg-blue-950 text-white rounded">
                    Search
                </button>
                <button onClick={handleToggleSearchBy} className="p-2 border rounded">
                    Search by: {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
                </button>
            </div>

            {/* Customer Cards */}
            <div className="space-y-4">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <UserCard
                            key={customer.id}
                            username={customer.username}
                            email={customer.email}
                            phoneNumber={customer.phoneNumber}
                            address={customer.address}
                            role={customer.role}
                            onNotifyClick={() => handleNotifyClick(customer.id)}
                            onHistoryClick={() => handleHistoryClick(customer.id)}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No customers found matching your search.</p>
                )}
            </div>

            {/* Notify Popup */}
            {showNotifyPopup && selectedCustomerId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="p-6 w-full max-w-md flex flex-col h-96">
                        {/* Upper Half: Message Input */}
                        <div className="flex-1 border-b pb-4">
                            <h2 className="text-xl font-bold mb-4">Notify Customer</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter message"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className="p-2 border rounded flex-1"
                                />
                                <Button variant="default" onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </div>
                        </div>

                        {/* Lower Half: Old Messages */}
                        <div className="flex-1 pt-4 overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-2">Previous Messages</h3>
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div key={msg.id} className="flex justify-between items-center mb-2">
                                        <p className="text-gray-700">{msg.message}</p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteMessage(msg.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No messages yet.</p>
                            )}
                        </div>

                        {/* Back Button */}
                        <Button className="mt-4" variant="outline" onClick={closePopup}>
                            Back
                        </Button>
                    </Card>
                </div>
            )}

            {/* History Popup (Unchanged for now) */}
            {showHistoryPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Customer History</h2>
                        <p className="text-gray-500">This is a placeholder for history content.</p>
                        <Button className="mt-4" variant="outline" onClick={closePopup}>
                            Back
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CustomersPage;