"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail,Truck, PackageOpen, ArrowRight, MapPin, MessageSquareText } from "lucide-react"
import { Caveat } from 'next/font/google'


const caveat = Caveat({ subsets: ['latin'] })

const decodeJwt = (token: string) => {
    if (!token || typeof token !== "string" || token === "undefined" || !token.includes(".")) {
        console.error("Invalid JWT token:", token)
        return null
    }
    try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        )
        const decoded = JSON.parse(jsonPayload)
        console.log("Decoded JWT:", decoded)
        return decoded
    } catch (e) {
        console.error("Failed to decode JWT:", e)
        return null
    }
}

function DeliveryCard({ title, products, total }: {
    title: string;
    products: { name: string; quantity: number; image: string; totalPrice: number }[];
    total: number;
}) {
    return (
        <Card className="w-full max-w-2xl bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <CardHeader className=" bg-gray-100 px-6 py-4 border-b border-gray-100">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                    <Truck className="w-6 h-6 mr-2 text-black-600" />
                    {title}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <PackageOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No deliveries scheduled</p>
                        <Button className="mt-4" variant="outline">
                            <Link href="/schedule-delivery" className="flex items-center">
                                Schedule a Delivery <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <ul className="space-y-4 divide-y divide-gray-100">
                            {products.map((product, index) => (
                                <li 
                                    key={`${product.name}-${index}`} 
                                    className="flex items-center gap-4 py-4 animate-fade-in"
                                >
                                    <div className="relative flex-shrink-0">
                                        <Image
                                            src={product.image || "/images/placeholder.jpg"}
                                            alt={product.name}
                                            width={120}
                                            height={120}
                                            className="object-cover rounded-lg border border-gray-200 bg-white p-1"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                            {product.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-semibold text-gray-900 truncate">{product.name}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-sm text-gray-500">${(product.totalPrice / product.quantity).toFixed(2)} each</p>
                                            <p className="text-base font-medium text-gray-900">${product.totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            
                           
                            <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button 
                                variant="outline" 
                                className="py-3 text-base font-medium text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                               <MessageSquareText className="w-5 h-5" />
                                Contact
                            </Button>
                            <Button 
                                className="py-3 text-base font-medium text-white bg-gray-800 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <Link href="/change-location" className="flex items-center">
                                
                                    Change Location
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}



export default function Dashboard() {
    const router = useRouter()
    const [user, setUser] = useState<{ username?: string } | null>(null)
    const [deliveries, setDeliveries] = useState<{
        wednesday: { name: string; quantity: number; image: string; totalPrice: number }[];
        sunday: { name: string; quantity: number; image: string; totalPrice: number }[];
        wednesdayTotal: number;
        sundayTotal: number;
    } | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        console.log("Token from localStorage:", token)
        if (!token || token === "undefined") {
            router.push("/login")
            return
        }
        const decoded = decodeJwt(token)
        const username = decoded?.sub || "User"
        setUser({ username })
        fetch("http://localhost:8080/api/customer/deliveries", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("token")
                    router.push("/login")
                    throw new Error("Unauthorized")
                }
                return res.json()
            })
            .then(setDeliveries)
            .catch((err) => {
                console.error("Failed to fetch deliveries:", err)
                router.push("/login")
            })
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    if (!user) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b p-4">
                <div className="flex items-center space-x-4">
                    <p className={`font-bold text-7xl ${caveat.className}`}>chello.dairy</p>
                </div>
                <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
                    Dashboard
                </h1>
                <Button variant="outline" onClick={handleLogout}>
                    Logout
                </Button>
            </header>
            <div className="flex flex-1">
                <aside className="w-30 border-r p-4 bg-muted">
                    <nav className="space-y-2">
                        <Link href="/profile" className="flex flex-col items-center space-y-1 text-primary hover:underline">
                            <User className="w-8 h-20" />
                            <span></span>
                        </Link>
                        <Link href="/profile" className="flex flex-col items-center space-y-1 text-primary hover:underline">
                            <Mail className="w-8 h-20" />
                            <span></span>
                        </Link>
                        <Link href="/purchase" className="flex flex-col items-center space-y-1 text-primary hover:underline">
                            <Truck className="w-8 h-20" />
                            <span></span>
                        </Link>
                    </nav>
                </aside>
                <main className="flex-1 p-8 flex flex-col gap-20">
                    <div className="flex items-center mb-6">
                        <div className="w-1/2">
                            <Card className="w-full max-w-md border-none shadow-none">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-3xl font-bold">Welcome, {user.username}!</CardTitle>
                                    <p>You have successfully logged in to your account.</p>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="w-1/2 flex justify-center">
                            <Button variant="default" className="text-lg px-10 py-6 hover:bg-blue-600">
                                <Link href="/browseProducts" className="block w-full h-full flex items-center justify-center">
                                    + Purchase
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Your Deliveries</h2>
                        {deliveries ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DeliveryCard
                                    title="Wednesday"
                                    products={deliveries.wednesday}
                                    total={deliveries.wednesdayTotal}
                                />
                                <DeliveryCard
                                    title="Sunday"
                                    products={deliveries.sunday}
                                    total={deliveries.sundayTotal}
                                />
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}