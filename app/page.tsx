"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Phone, Star, Heart, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: boolean
  category: string
  rating: number
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem("rama-toys-products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Default products
      const defaultProducts: Product[] = [
        {
          id: "1",
          name: "Robot Transformer Deluxe",
          price: 299000,
          image: "/placeholder.svg?height=300&width=300",
          stock: true,
          category: "robot",
          rating: 4.8,
        },
        {
          id: "2",
          name: "Boneka Teddy Bear Jumbo",
          price: 150000,
          image: "/placeholder.svg?height=300&width=300",
          stock: true,
          category: "boneka",
          rating: 4.9,
        },
        {
          id: "3",
          name: "Lego Building Set Castle",
          price: 450000,
          image: "/placeholder.svg?height=300&width=300",
          stock: false,
          category: "lego",
          rating: 4.7,
        },
        {
          id: "4",
          name: "Remote Control Car Racing",
          price: 350000,
          image: "/placeholder.svg?height=300&width=300",
          stock: true,
          category: "mobil",
          rating: 4.6,
        },
        {
          id: "5",
          name: "Puzzle 1000 Pieces",
          price: 85000,
          image: "/placeholder.svg?height=300&width=300",
          stock: true,
          category: "puzzle",
          rating: 4.5,
        },
        {
          id: "6",
          name: "Action Figure Superhero",
          price: 125000,
          image: "/placeholder.svg?height=300&width=300",
          stock: false,
          category: "action-figure",
          rating: 4.8,
        },
      ]
      setProducts(defaultProducts)
      localStorage.setItem("rama-toys-products", JSON.stringify(defaultProducts))
    }
  }, [])

  const categories = [
    { id: "all", name: "Semua" },
    { id: "SOON", name: "SOON" },
    { id: "robot", name: "Robot" },
    { id: "boneka", name: "Boneka" },
    { id: "lego", name: "Lego" },
    { id: "mobil", name: "Mobil RC" },
    { id: "puzzle", name: "Puzzle" },
    { id: "action-figure", name: "Action Figure" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleWhatsAppOrder = (product: Product) => {
    const message = `Halo! Saya tertarik dengan produk:\n\n*${product.name}*\nHarga: ${formatPrice(product.price)}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/6285964362781?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Rama Toys Center
                </h1>
                <p className="text-sm text-gray-600">Mainan Berkualitas untuk Si Kecil</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors">
                Beranda
              </Link>
              <button
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Produk
              </button>
              <button
                onClick={() => window.open("https://wa.me/6285964362781", "_blank")}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Kontak
              </button>
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors">
                    Beranda
                  </Link>
                  <button
                    onClick={() => {
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                      setIsMenuOpen(false)
                    }}
                    className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                  >
                    Produk
                  </button>
                  <button
                    onClick={() => {
                      window.open("https://wa.me/6285964362781", "_blank")
                      setIsMenuOpen(false)
                    }}
                    className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                  >
                    Kontak
                  </button>
                  <Link href="/admin/login">
                    <Button variant="outline" size="sm" className="w-fit bg-transparent">
                      Admin
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Dunia Mainan Terlengkap
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Temukan mainan berkualitas tinggi untuk mengembangkan kreativitas dan kecerdasan anak-anak tercinta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              Lihat Produk
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open("https://wa.me/6285964362781", "_blank")}>
              <Phone className="w-4 h-4 mr-2" />
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section id="products" className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari mainan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      {product.stock ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Tersedia</Badge>
                      ) : (
                        <Badge variant="destructive">Stok Habis</Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="absolute top-2 left-2 bg-white/80 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                    </div>

                    <p className="text-2xl font-bold text-purple-600 mb-4">{formatPrice(product.price)}</p>

                    <Button
                      className={`w-full ${
                        product.stock
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!product.stock}
                      onClick={() => product.stock && handleWhatsAppOrder(product)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {product.stock ? "Pesan via WhatsApp" : "Stok Habis"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-white/50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Hubungi Kami
          </h3>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-6">
              Punya pertanyaan atau butuh bantuan? Jangan ragu untuk menghubungi kami!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => window.open("https://wa.me/6285964362781", "_blank")}
              >
                <Phone className="w-5 h-5 mr-2" />
                WhatsApp: 085964362781
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-800 to-pink-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold">Rama Toys Center</h4>
          </div>
          <p className="text-purple-200 mb-4">Mainan Berkualitas untuk Masa Depan Cerah Si Kecil</p>
          <p className="text-sm text-purple-300">.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-50 animate-pulse"
        onClick={() => window.open("https://wa.me/6285964362781", "_blank")}
      >
        <Phone className="w-6 h-6" />
      </Button>
    </div>
  )
}
