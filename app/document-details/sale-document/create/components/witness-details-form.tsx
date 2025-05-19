"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"
import { FormError } from "@/components/ui/form-error"
import { isRequired, errorMessages } from "@/lib/validation"
import { toast } from "sonner"

export default function WitnessDetailsForm({ data, updateData }) {
  const [witnesses, setWitnesses] = useState(data)
  const [errors, setErrors] = useState([])
  const [touched, setTouched] = useState([])

  useEffect(() => {
    // Initialize errors and touched arrays
    setErrors(witnesses.map(() => ({})))
    setTouched(witnesses.map(() => ({})))
  }, [witnesses.length])

  const validateField = (index, field, value) => {
    switch (field) {
      case "name":
        return isRequired(value) ? "" : errorMessages.required
      case "address":
        return isRequired(value) ? "" : errorMessages.required
      default:
        return ""
    }
  }

  const validateWitness = (witness, index) => {
    const witnessErrors = {}
    let isValid = true

    // Validate required fields
    if (!isRequired(witness.name)) {
      witnessErrors.name = errorMessages.required
      isValid = false
    }

    if (!isRequired(witness.address)) {
      witnessErrors.address = errorMessages.required
      isValid = false
    }

    // Update errors for this witness
    const newErrors = [...errors]
    newErrors[index] = witnessErrors
    setErrors(newErrors)

    return isValid
  }

  const validateAllWitnesses = () => {
    // Mark all fields as touched
    const allTouched = witnesses.map(() => ({
      name: true,
      address: true,
    }))
    setTouched(allTouched)

    // Validate all witnesses
    return witnesses.every((witness, index) => validateWitness(witness, index))
  }

  const handleAddWitness = () => {
    setWitnesses([...witnesses, { name: "", address: "" }])
    setErrors([...errors, {}])
    setTouched([...touched, {}])
  }

  const handleRemoveWitness = (index) => {
    const updatedWitnesses = [...witnesses]
    updatedWitnesses.splice(index, 1)
    setWitnesses(updatedWitnesses)

    const updatedErrors = [...errors]
    updatedErrors.splice(index, 1)
    setErrors(updatedErrors)

    const updatedTouched = [...touched]
    updatedTouched.splice(index, 1)
    setTouched(updatedTouched)
  }

  const handleChange = (index, field, value) => {
    const updatedWitnesses = [...witnesses]
    updatedWitnesses[index] = { ...updatedWitnesses[index], [field]: value }
    setWitnesses(updatedWitnesses)

    // Mark field as touched
    const newTouched = [...touched]
    newTouched[index] = { ...newTouched[index], [field]: true }
    setTouched(newTouched)

    // Validate the field
    const error = validateField(index, field, value)
    const newErrors = [...errors]
    newErrors[index] = { ...newErrors[index], [field]: error }
    setErrors(newErrors)
  }

  const handleBlur = (index, field) => {
    // Mark field as touched
    const newTouched = [...touched]
    newTouched[index] = { ...newTouched[index], [field]: true }
    setTouched(newTouched)

    // Validate the field
    const error = validateField(index, field, witnesses[index][field])
    const newErrors = [...errors]
    newErrors[index] = { ...newErrors[index], [field]: error }
    setErrors(newErrors)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateAllWitnesses()) {
      updateData(witnesses)
    } else {
      toast.error("படிவத்தில் பிழைகள் உள்ளன. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.")
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {witnesses.map((witness, index) => (
        <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">சாட்சி {index + 1}</h3>
            {witnesses.length > 2 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveWitness(index)}>
                <Trash2 className="h-4 w-4 mr-1" /> நீக்கு
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor={`name-${index}`}
                className={errors[index]?.name && touched[index]?.name ? "text-red-500" : ""}
              >
                பெயர் <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`name-${index}`}
                value={witness.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                onBlur={() => handleBlur(index, "name")}
                className={errors[index]?.name && touched[index]?.name ? "border-red-500" : ""}
                required
              />
              {touched[index]?.name && <FormError message={errors[index]?.name} />}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`address-${index}`}
                className={errors[index]?.address && touched[index]?.address ? "text-red-500" : ""}
              >
                முகவரி <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`address-${index}`}
                value={witness.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
                onBlur={() => handleBlur(index, "address")}
                className={errors[index]?.address && touched[index]?.address ? "border-red-500" : ""}
                required
              />
              {touched[index]?.address && <FormError message={errors[index]?.address} />}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4 text-sm text-gray-500">
        <span className="text-red-500">*</span> குறிக்கப்பட்ட புலங்கள் கட்டாயமாக நிரப்பப்பட வேண்டும்
      </div>

      <Button type="button" variant="outline" onClick={handleAddWitness} className="mt-2">
        <PlusCircle className="h-4 w-4 mr-1" /> மற்றொரு சாட்சியைச் சேர்க்க
      </Button>

      <Button type="submit" className="mt-4 ml-2 bg-cyan-600 hover:bg-cyan-700 text-white">
        முடிக்க
      </Button>
    </form>
  )
}
