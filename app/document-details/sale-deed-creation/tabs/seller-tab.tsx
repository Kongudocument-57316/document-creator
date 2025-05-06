"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserDetailDialog } from "../components/user-detail-dialog"
import { UserSearchDialog } from "../components/user-search-dialog"
import { User, UserPlus, Edit, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface SellerTabProps {
  data: any[]
  updateData: (data: any[]) => void
}

export function SellerTab({ data, updateData }: SellerTabProps) {
  const [sellers, setSellers] = useState<any[]>(Array.isArray(data) ? data : [])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddSeller = (seller: any) => {
    const newSellers = [...sellers, { ...seller, id: Date.now() }]
    setSellers(newSellers)
    updateData(newSellers)
    setIsSearchOpen(false)
  }

  const handleEditSeller = (seller: any) => {
    setSelectedSeller(seller)
    setIsEditing(true)
    setIsDetailOpen(true)
  }

  const handleDeleteSeller = (sellerId: number) => {
    const newSellers = sellers.filter((seller) => seller.id !== sellerId)
    setSellers(newSellers)
    updateData(newSellers)
  }

  const handleUpdateSeller = (updatedSeller: any) => {
    const newSellers = sellers.map((seller) =>
      seller.id === updatedSeller.id ? { ...seller, ...updatedSeller } : seller,
    )
    setSellers(newSellers)
    updateData(newSellers)
    setIsDetailOpen(false)
    setIsEditing(false)
  }

  const handleViewSeller = (seller: any) => {
    setSelectedSeller(seller)
    setIsEditing(false)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <User className="h-5 w-5 mr-2 text-purple-600" />
          விற்பனையாளர் விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsSearchOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="h-4 w-4 mr-2" />
            விற்பனையாளரைச் சேர்க்க
          </Button>
        </div>

        {sellers.length === 0 ? (
          <Card className="border-dashed border-2 border-purple-200 bg-purple-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <UserPlus className="h-12 w-12 text-purple-400 mb-2" />
              <p className="text-purple-600 text-center">விற்பனையாளர் விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
              <p className="text-purple-500 text-sm text-center mt-1">
                விற்பனையாளரைச் சேர்க்க மேலே உள்ள பொத்தானைக் கிளிக் செய்யவும்
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellers.map((seller) => (
              <Card key={seller.id} className="border-purple-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-800">{seller.name}</h4>
                      <p className="text-sm text-gray-600">{seller.address1}</p>
                      {seller.phoneNo && <p className="text-sm text-gray-600">தொலைபேசி: {seller.phoneNo}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSeller(seller)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <User className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSeller(seller)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <Edit className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSeller(seller.id)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <UserSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleAddSeller}
        title="விற்பனையாளரைத் தேடு"
      />

      <UserDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedSeller}
        isEditing={isEditing}
        onUpdate={handleUpdateSeller}
        title={isEditing ? "விற்பனையாளர் விவரங்களைத் திருத்து" : "விற்பனையாளர் விவரங்கள்"}
      />
    </div>
  )
}
