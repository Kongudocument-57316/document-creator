"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useState } from "react"

interface UserDetailProps {
  user: any
  buttonLabel?: string
  dialogTitle?: string
}

export function UserDetailDialog({ user, buttonLabel = "விவரங்கள்", dialogTitle = "பயனாளர் விவரங்கள்" }: UserDetailProps) {
  const [open, setOpen] = useState(false)

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-purple-600 hover:text-purple-800 hover:bg-purple-100">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-purple-700">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-purple-800">பெயர்:</h3>
              <p>{user.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">பாலினம்:</h3>
              <p>{user.gender === "male" ? "ஆண்" : "பெண்"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-purple-800">உறவுமுறை:</h3>
              <p>{user.relationType || user.relation_type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">உறவினரின் பெயர்:</h3>
              <p>{user.relationName || user.relative_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-purple-800">வயது:</h3>
              <p>{user.age}</p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">கதவு எண்:</h3>
              <p>{user.doorNo || user.door_number}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-purple-800">முகவரி:</h3>
            <p>{user.address1 || user.address_line1}</p>
            <p>{user.address2 || user.address_line2}</p>
            <p>{user.address3 || user.address_line3}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-purple-800">மாவட்டம்:</h3>
              <p>{user.district_name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">வட்டம்:</h3>
              <p>{user.taluk_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-purple-800">அஞ்சல் குறியீடு:</h3>
              <p>{user.pincode}</p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">தொலைபேசி எண்:</h3>
              <p>{user.phoneNo || user.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-purple-800">ஆதார் எண்:</h3>
            <p>{user.aadharNo || user.aadhaar_number}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
