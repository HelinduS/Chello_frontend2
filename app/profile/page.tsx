"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface User {
    username: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token || token === "undefined") {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data: User = await response.json();
                setUser(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleEdit = () => {
        if (user) {
            setEditUser({ ...user });
            setIsEditing(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (!token || !editUser) {
            setError("No token or user data available");
            return;
        }

        const updatePayload: Partial<User> = {
            username: editUser.username,
            email: editUser.email,
            phoneNumber: editUser.phoneNumber,
            address: editUser.address,
        };
        console.log("Update Payload:", updatePayload);

        try {
            const response = await fetch("http://localhost:8080/api/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatePayload),
            });

            console.log("Response Status:", response.status);
            const responseText = await response.text();
            console.log("Response Text:", responseText);

            if (!response.ok) {
                throw new Error(`Failed to update user: ${response.status} - ${responseText}`);
            }

            const updatedUser: User = JSON.parse(responseText);
            setUser(updatedUser);
            setIsEditing(false);
            setError("");

            if (user && updatedUser.username !== user.username) {
                localStorage.removeItem("token");
                router.push("/login");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Update failed";
            console.error("Update Error:", errorMessage);
            setError(errorMessage);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError("");
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-100">Loading...</div>;
    }

    if (!user) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-100">No user data</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex w-full items-center justify-center p-4 sm:p-8 md:w-1/2">
                <Card className="w-full max-w-lg rounded-lg border border-gray-200 shadow-sm">
                    <CardHeader className="relative space-y-2 pb-6 pt-4 px-6">
                        <Button
                            variant="ghost"
                            className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => router.push("/customer-dash")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </Button>
                        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
                            Your Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        {error && (
                            <Alert variant="destructive" className="mb-6 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-5">
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <Label className="text-sm font-medium text-gray-700 col-span-1">Username</Label>
                                <p className="text-base text-gray-900 col-span-2">{user.username}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <Label className="text-sm font-medium text-gray-700 col-span-1">Email</Label>
                                <p className="text-base text-gray-900 col-span-2">{user.email || "Not set"}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <Label className="text-sm font-medium text-gray-700 col-span-1">Phone</Label>
                                <p className="text-base text-gray-900 col-span-2">{user.phoneNumber || "Not set"}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <Label className="text-sm font-medium text-gray-700 col-span-1">Address</Label>
                                <p className="text-base text-gray-900 col-span-2">{user.address || "Not set"}</p>
                            </div>
                        </div>
                        <Button
                            className="w-full mt-6  hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {isEditing && editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md rounded-lg border border-gray-200 shadow-lg">
                        <CardHeader className="px-6 pt-6 pb-4">
                            <CardTitle className="text-xl font-semibold text-gray-800">Edit Profile</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleUpdate}>
                            <CardContent className="px-6 pb-6 space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={editUser.username || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your username"
                                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={editUser.email || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={editUser.phoneNumber || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={editUser.address || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your address"
                                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="px-6 pb-6 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-md transition-colors"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                                >
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}