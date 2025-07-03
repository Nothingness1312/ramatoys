"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, LogOut, ShoppingCart, Package, TrendingUp, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: boolean
  category: string
  rating: number
  description?: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: true,
    description: "",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState("")
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" })
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("rama-admin-logged-in")
    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }

    // Load products
    const savedProducts = localStorage.getItem("rama-toys-products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [router])

  const categories = [
    { value: "robot", label: "Robot" },
    { value: "boneka", label: "Boneka" },
    { value: "lego", label: "Lego" },
    { value: "mobil", label: "Mobil RC" },
    { value: "puzzle", label: "Puzzle" },
    { value: "action-figure", label: "Action Figure" },
  ]

  const showAlert = (message: string, type: "success" | "error" = "success") => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("rama-admin-logged-in")
    router.push("/admin/login")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: true,
      description: "",
      image: "",
    })
    setImagePreview("")
  }

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      showAlert("Mohon lengkapi semua field yang wajib diisi!", "error")
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: Number.parseInt(formData.price),
      category: formData.category,
      stock: formData.stock,
      image: formData.image || "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      description: formData.description,
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem("rama-toys-products", JSON.stringify(updatedProducts))

    setIsAddDialogOpen(false)
    resetForm()
    showAlert("Produk berhasil ditambahkan!")
  }

  const handleEditProduct = () => {
    if (!editingProduct || !formData.name || !formData.price || !formData.category) {
      showAlert("Mohon lengkapi semua field yang wajib diisi!", "error")
      return
    }

    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            name: formData.name,
            price: Number.parseInt(formData.price),
            category: formData.category,
            stock: formData.stock,
            image: formData.image || product.image,
            description: formData.description,
          }
        : product,
    )

    setProducts(updatedProducts)
    localStorage.setItem("rama-toys-products", JSON.stringify(updatedProducts))

    setIsEditDialogOpen(false)
    setEditingProduct(null)
    resetForm()
    showAlert("Produk berhasil diperbarui!")
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const updatedProducts = products.filter((product) => product.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem("rama-toys-products", JSON.stringify(updatedProducts))
      showAlert("Produk berhasil dihapus!")
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock,
      description: product.description || "",
      image: product.image,
    })
    setImagePreview(product.image)
    setIsEditDialogOpen(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const stats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.stock).length,
    outOfStock: products.filter((p) => !p.stock).length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
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
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Rama Toys Center</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Alert */}
        {alert.show && (
          <Alert
            className={`mb-6 ${alert.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
          >
            <AlertDescription className={alert.type === "error" ? "text-red-800" : "text-green-800"}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stok Tersedia</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalValue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manajemen Produk</CardTitle>
                <CardDescription>Kelola produk mainan Anda</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                    <DialogDescription>Lengkapi informasi produk mainan baru</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Produk *</Label>
                        <Input
                          id="name"
                          placeholder="Masukkan nama produk"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Harga *</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="Masukkan harga"
                          value={formData.price}
                          onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        placeholder="Masukkan deskripsi produk"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="stock"
                        checked={formData.stock}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, stock: checked }))}
                      />
                      <Label htmlFor="stock">Stok Tersedia</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Gambar Produk</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="flex-1"
                        />
                        {imagePreview && (
                          <div className="relative">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                              onClick={() => {
                                setImagePreview("")
                                setFormData((prev) => ({ ...prev, image: "" }))
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Batal
                      </Button>
                      <Button onClick={handleAddProduct}>Tambah Produk</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {product.stock ? (
                          <Badge className="bg-green-500">Tersedia</Badge>
                        ) : (
                          <Badge variant="destructive">Habis</Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-purple-600 mb-4">{formatPrice(product.price)}</p>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Belum ada produk</p>
                <p className="text-gray-400">Tambahkan produk pertama Anda!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Produk</DialogTitle>
              <DialogDescription>Perbarui informasi produk</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nama Produk *</Label>
                  <Input
                    id="edit-name"
                    placeholder="Masukkan nama produk"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Harga *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    placeholder="Masukkan harga"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Masukkan deskripsi produk"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-stock"
                  checked={formData.stock}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, stock: checked }))}
                />
                <Label htmlFor="edit-stock">Stok Tersedia</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Gambar Produk</Label>
                <div className="flex items-center space-x-4">
                  <Input id="edit-image" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                  {imagePreview && (
                    <div className="relative">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                        onClick={() => {
                          setImagePreview("")
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                >
                  Batal
                </Button>
                <Button onClick={handleEditProduct}>Simpan Perubahan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
