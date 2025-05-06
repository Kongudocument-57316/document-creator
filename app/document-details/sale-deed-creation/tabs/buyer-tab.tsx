"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserDetailDialog } from "../components/user-detail-dialog"
import { UserSearchDialog } from "../components/user-search-dialog"
import { User, UserPlus, Edit, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface BuyerTabProps {
  data: any[]
  updateData: (data: any[]) => void
}

export function BuyerTab({ data, updateData }: BuyerTabProps) {
  const [buyers, setBuyers] = useState<any[]>(Array.isArray(data) ? data : [])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddBuyer = (buyer: any) => {
    const newBuyers = [...buyers, { ...buyer, id: Date.now() }]
    setBuyers(newBuyers)
    updateData(newBuyers)
    setIsSearchOpen(false)
  }

  const handleEditBuyer = (buyer: any) => {
    setSelectedBuyer(buyer)
    setIsEditing(true)
    setIsDetailOpen(true)
  }

  const handleDeleteBuyer = (buyerId: number) => {
    const newBuyers = buyers.filter((buyer) => buyer.id !== buyerId)
    setBuyers(newBuyers)
    updateData(newBuyers)
  }

  const handleUpdateBuyer = (updatedBuyer: any) => {
    const newBuyers = buyers.map((buyer) => (buyer.id === updatedBuyer.id ? { ...buyer, ...updatedBuyer } : buyer))
    setBuyers(newBuyers)
    updateData(newBuyers)
    setIsDetailOpen(false)
    setIsEditing(false)
  }

  const handleViewBuyer = (buyer: any) => {
    setSelectedBuyer(buyer)
    setIsEditing(false)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 flex items-center">
          <User className="h-5 w-5 mr-2 text-purple-600" />
          வாங்குபவர் விவரங்கள்
        </h3>
        <Separator className="my-4 bg-purple-200" />

        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsSearchOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="h-4 w-4 mr-2" />
            வாங்குபவரைச் சேர்க்க
          </Button>
        </div>

        {buyers.length === 0 ? (
          <Card className="border-dashed border-2 border-purple-200 bg-purple-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <UserPlus className="h-12 w-12 text-purple-400 mb-2" />
              <p className="text-purple-600 text-center">வாங்குபவர் விவரங்கள் எதுவும் சேர்க்கப்படவில்லை</p>
              <p className="text-purple-500 text-sm text-center mt-1">வாங்குபவரைச் சேர்க்க மேலே உள்ள பொத்தானைக் கிளிக் செய்யவும்</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyers.map((buyer) => (
              <Card key={buyer.id} className="border-purple-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-800">{buyer.name}</h4>
                      <p className="text-sm text-gray-600">{buyer.address1}</p>
                      {buyer.phoneNo && <p className="text-sm text-gray-600">தொலைபேசி: {buyer.phoneNo}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBuyer(buyer)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <User className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBuyer(buyer)}
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <Edit className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBuyer(buyer.id)}
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
        onSelect={handleAddBuyer}
        title="வாங்குபவரைத் தேடு"
      />

      <UserDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedBuyer}
        isEditing={isEditing}
        onUpdate={handleUpdateBuyer}
        title={isEditing ? "வாங்குபவர் விவரங்களைத் திருத்து" : "வாங்குபவர் விவரங்கள்"}
      />
    </div>
  )
}
