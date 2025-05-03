"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Check } from "lucide-react"
import { toast } from "sonner"

export interface BuildingDetail {
  id: string
  buildingType: string
  facingDirection: string
  northMeasurement: string
  southMeasurement: string
  eastMeasurement: string
  westMeasurement: string
  totalSqFeet: string
  totalSqMeter: string
  buildingAge: string
  hasToilet: boolean
  toiletDetails: {
    length: string
    width: string
    totalSqFeet: string
    totalSqMeter: string
    facingDirection: string
  } | null
  doorNumbers: { id: string; number: string }[]
  taxAssessmentNumbers: { id: string; number: string }[]
  waterConnectionNumbers: { id: string; number: string }[]
  electricityConnectionNumbers: { id: string; number: string }[]
  wallDetails: {
    length: string
    height: string
  } | null
  description: string
}

interface BuildingFormProps {
  onAddBuilding: (building: BuildingDetail) => void
  onCancel: () => void
  initialData?: BuildingDetail
  isEdit?: boolean
}

export function BuildingForm({ onAddBuilding, onCancel, initialData, isEdit = false }: BuildingFormProps) {
  const [buildingType, setBuildingType] = useState(initialData?.buildingType || "")
  const [facingDirection, setFacingDirection] = useState(initialData?.facingDirection || "")
  const [northMeasurement, setNorthMeasurement] = useState(initialData?.northMeasurement || "")
  const [southMeasurement, setSouthMeasurement] = useState(initialData?.southMeasurement || "")
  const [eastMeasurement, setEastMeasurement] = useState(initialData?.eastMeasurement || "")
  const [westMeasurement, setWestMeasurement] = useState(initialData?.westMeasurement || "")
  const [totalSqFeet, setTotalSqFeet] = useState(initialData?.totalSqFeet || "")
  const [totalSqMeter, setTotalSqMeter] = useState(initialData?.totalSqMeter || "")
  const [buildingAge, setBuildingAge] = useState(initialData?.buildingAge || "")
  const [hasToilet, setHasToilet] = useState(initialData?.hasToilet || false)
  const [toiletDetails, setToiletDetails] = useState(
    initialData?.toiletDetails || {
      length: "",
      width: "",
      totalSqFeet: "",
      totalSqMeter: "",
      facingDirection: "தெற்கு",
    },
  )
  const [doorNumbers, setDoorNumbers] = useState<{ id: string; number: string }[]>(
    initialData?.doorNumbers || [{ id: Date.now().toString(), number: "" }],
  )
  const [taxAssessmentNumbers, setTaxAssessmentNumbers] = useState<{ id: string; number: string }[]>(
    initialData?.taxAssessmentNumbers || [{ id: Date.now().toString(), number: "" }],
  )
  const [waterConnectionNumbers, setWaterConnectionNumbers] = useState<{ id: string; number: string }[]>(
    initialData?.waterConnectionNumbers || [{ id: Date.now().toString(), number: "" }],
  )
  const [electricityConnectionNumbers, setElectricityConnectionNumbers] = useState<{ id: string; number: string }[]>(
    initialData?.electricityConnectionNumbers || [{ id: Date.now().toString(), number: "" }],
  )
  const [wallDetails, setWallDetails] = useState(
    initialData?.wallDetails || {
      length: "",
      height: "",
    },
  )

  // கதவு எண் சேர்த்தல்
  const addDoorNumber = () => {
    setDoorNumbers([...doorNumbers, { id: Date.now().toString(), number: "" }])
  }

  // கதவு எண் நீக்குதல்
  const removeDoorNumber = (id: string) => {
    if (doorNumbers.length > 1) {
      setDoorNumbers(doorNumbers.filter((item) => item.id !== id))
    } else {
      toast.warning("குறைந்தபட்சம் ஒரு கதவு எண் தேவை")
    }
  }

  // கதவு எண் மாற்றுதல்
  const updateDoorNumber = (id: string, value: string) => {
    setDoorNumbers(doorNumbers.map((item) => (item.id === id ? { ...item, number: value } : item)))
  }

  // வரி விதிப்பு எண் சேர்த்தல்
  const addTaxNumber = () => {
    setTaxAssessmentNumbers([...taxAssessmentNumbers, { id: Date.now().toString(), number: "" }])
  }

  // வரி விதிப்பு எண் நீக்குதல்
  const removeTaxNumber = (id: string) => {
    if (taxAssessmentNumbers.length > 1) {
      setTaxAssessmentNumbers(taxAssessmentNumbers.filter((item) => item.id !== id))
    } else {
      toast.warning("குறைந்தபட்சம் ஒரு வரி விதிப்பு எண் தேவை")
    }
  }

  // வரி விதிப்பு எண் மாற்றுதல்
  const updateTaxNumber = (id: string, value: string) => {
    setTaxAssessmentNumbers(taxAssessmentNumbers.map((item) => (item.id === id ? { ...item, number: value } : item)))
  }

  // குடிநீர் இணைப்பு எண் சேர்த்தல்
  const addWaterNumber = () => {
    setWaterConnectionNumbers([...waterConnectionNumbers, { id: Date.now().toString(), number: "" }])
  }

  // குடிநீர் இணைப்பு எண் நீக்குதல்
  const removeWaterNumber = (id: string) => {
    if (waterConnectionNumbers.length > 1) {
      setWaterConnectionNumbers(waterConnectionNumbers.filter((item) => item.id !== id))
    } else {
      toast.warning("குறைந்தபட்சம் ஒரு குடிநீர் இணைப்பு எண் தேவை")
    }
  }

  // குடிநீர் இணைப்பு எண் மாற்றுதல்
  const updateWaterNumber = (id: string, value: string) => {
    setWaterConnectionNumbers(
      waterConnectionNumbers.map((item) => (item.id === id ? { ...item, number: value } : item)),
    )
  }

  // மின் இணைப்பு எண் சேர்த்தல்
  const addElectricityNumber = () => {
    setElectricityConnectionNumbers([...electricityConnectionNumbers, { id: Date.now().toString(), number: "" }])
  }

  // மின் இணைப்பு எண் நீக்குதல்
  const removeElectricityNumber = (id: string) => {
    if (electricityConnectionNumbers.length > 1) {
      setElectricityConnectionNumbers(electricityConnectionNumbers.filter((item) => item.id !== id))
    } else {
      toast.warning("குறைந்தபட்சம் ஒரு மின் இணைப்பு எண் தேவை")
    }
  }

  // மின் இணைப்பு எண் மாற்றுதல்
  const updateElectricityNumber = (id: string, value: string) => {
    setElectricityConnectionNumbers(
      electricityConnectionNumbers.map((item) => (item.id === id ? { ...item, number: value } : item)),
    )
  }

  // கழிப்பறை விவரங்கள் மாற்றுதல்
  const updateToiletDetails = (field: string, value: string) => {
    setToiletDetails({ ...toiletDetails, [field]: value })
  }

  // சுற்றுச்சுவர் விவரங்கள் மாற்றுதல்
  const updateWallDetails = (field: string, value: string) => {
    setWallDetails({ ...wallDetails, [field]: value })
  }

  // கட்டிட விவரத்தின் விளக்கம் உருவாக்கம்
  const generateBuildingDescription = (): string => {
    let description = ""

    // கட்டிட அளவுகள்
    description += `${facingDirection}ப் பார்த்து கிழமேல் ${eastMeasurement} அடி தென்வடல் ${northMeasurement} அடி ஆக ${totalSqFeet} சதுரடிக்கு ${totalSqMeter} சதுரமீட்டர் அளவில் ${buildingAge} வருடங்களுக்கு முன்பு மேற்கூரை `

    // கட்டிட வகை
    switch (buildingType) {
      case "தார்சு வீடு":
        description += "தார்சு போட்டு கட்டப்பட்டுள்ள தார்சு வீடு வகையறாக்கள் பூராவும்."
        break
      case "ஓட்டு வீடு":
        description += "மங்களூர் ஓடு போர்த்து கட்டப்பட்டுள்ள ஓட்டு வில்லை வீடு வகையறாக்கள் பூராவும்."
        break
      case "சிமெண்ட் சீட்":
        description += "சிமெண்ட் சீட் போட்டு கட்டப்பட்டுள்ள கட்டிடம் வகையறாக்கள் பூராவும்."
        break
      case "தகர சீட்":
        description += "தகர சீட் போட்டு கட்டப்பட்டுள்ள கட்டிடம் வகையறாக்கள் பூராவும்."
        break
      case "கூரைச்சாலை":
        description += "கூரைச்சாலை அமைத்து கட்டப்பட்டுள்ள கட்டிடம் வகையறாக்கள் பூராவும்."
        break
      default:
        description += "கட்டப்பட்டுள்ள கட்டிடம் வகையறாக்கள் பூராவும்."
    }

    // கழிப்பறை விவரங்கள்
    if (hasToilet && toiletDetails) {
      description += `\nபின்னும், மேற்படி இடத்தில் கிழமேல் ${toiletDetails.length} அடி தென்வடல் ${toiletDetails.width} அடி ஆக ${toiletDetails.totalSqFeet} சதுரடிக்கு ${toiletDetails.totalSqMeter} சதுரமீட்டர் அளவில் ${toiletDetails.facingDirection}ப் பார்த்து ${buildingAge} வருடங்களுக்கு முன்பு மேற்கூரை சிமெண்ட் சீட் போட்டு கட்டப்பட்டுள்ள கழிப்பறை சகிதம் பூராவும்.`
    }

    // வீட்டு விவரங்கள் சுருக்கம்
    description += "\nபின்னும், மேற்படி வீடு வகையறாக்களுக்குச் சேர்ந்த கதவு நிலவு கட்டுக்கோப்பு முன், பின் வாசல்"

    if (hasToilet) {
      description += ", கழிப்பறை"
    }

    description += " சகிதம் பூராவும்."

    // கதவு எண், வரி விதிப்பு எண், மின் இணைப்பு எண்
    if (doorNumbers.length > 0 && doorNumbers[0].number) {
      description += ` மேற்படி வீடு வகையறாக்களுக்கு கதவு எண்:-${doorNumbers.map((item) => item.number).join(", ")}`
    }

    if (taxAssessmentNumbers.length > 0 && taxAssessmentNumbers[0].number) {
      description += `. இதன் வரி விதிப்பு எண்:-${taxAssessmentNumbers.map((item) => item.number).join(", ")}`
    }

    if (waterConnectionNumbers.length > 0 && waterConnectionNumbers[0].number) {
      description += `. இதன் குடிநீர் இணைப்பு வரி விதிப்பு எண்:-${waterConnectionNumbers.map((item) => item.number).join(", ")}`
    }

    if (electricityConnectionNumbers.length > 0 && electricityConnectionNumbers[0].number) {
      description += `. இதன் மின் இணைப்பு எண்:-${electricityConnectionNumbers.map((item) => item.number).join(", ")} உள்ளது பாதுகாப்பு தொகையுடன் பூராவும்`
    }

    // சுற்றுச் சுவர் விவரங்கள்
    if (wallDetails?.length && wallDetails?.height) {
      description += `\nபின்னும், மேற்படி இடத்தை சுற்றி நீளம் ${wallDetails.length} அடி, உயரம் ${wallDetails.height} அடி அளவுள்ள சுற்றுச் சுவர் சகிதம் பூராவும்.`
    }

    return description
  }

  const handleSubmit = () => {
    if (!buildingType) {
      toast.error("வீட்டின்/கட்டிடத்தின் வகையை தேர்ந்தெடுக்கவும்")
      return
    }

    if (!facingDirection) {
      toast.error("கட்டிடம் எந்த திசையை நோக்கி உள்ளது என்பதை தேர்ந்தெடுக்கவும்")
      return
    }

    if (!northMeasurement || !southMeasurement || !eastMeasurement || !westMeasurement) {
      toast.error("கட்டிடத்தின் நான்கு பக்க அளவுகளையும் உள்ளிடவும்")
      return
    }

    if (!totalSqFeet || !totalSqMeter) {
      toast.error("கட்டிடத்தின் மொத்த பரப்பளவை உள்ளிடவும்")
      return
    }

    if (!buildingAge) {
      toast.error("கட்டிடத்தின் வயதை உள்ளிடவும்")
      return
    }

    if (doorNumbers.some((item) => !item.number)) {
      toast.error("அனைத்து கதவு எண்களையும் உள்ளிடவும்")
      return
    }

    const building: BuildingDetail = {
      id: initialData?.id || Date.now().toString(),
      buildingType,
      facingDirection,
      northMeasurement,
      southMeasurement,
      eastMeasurement,
      westMeasurement,
      totalSqFeet,
      totalSqMeter,
      buildingAge,
      hasToilet,
      toiletDetails: hasToilet ? toiletDetails : null,
      doorNumbers,
      taxAssessmentNumbers,
      waterConnectionNumbers,
      electricityConnectionNumbers,
      wallDetails,
      description: generateBuildingDescription(),
    }

    onAddBuilding(building)
  }

  // கழிப்பறை பரப்பளவு கணக்கீடு
  const calculateToiletArea = () => {
    if (toiletDetails.length && toiletDetails.width) {
      const sqft = Number.parseFloat(toiletDetails.length) * Number.parseFloat(toiletDetails.width)
      const sqm = sqft * 0.092903

      updateToiletDetails("totalSqFeet", sqft.toString())
      updateToiletDetails("totalSqMeter", sqm.toFixed(2))
    }
  }

  return (
    <Card className="border-cyan-200 mb-6">
      <CardHeader className="bg-cyan-50">
        <CardTitle className="text-cyan-800">வீடு/கட்டிடம் விவரங்கள் {isEdit ? "திருத்தம்" : "சேர்க்க"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* வீடு/கட்டிட வகை */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="building-type" className="text-cyan-800 font-medium">
              வீடு/கட்டிட வகை
            </Label>
            <Select value={buildingType} onValueChange={setBuildingType}>
              <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                <SelectValue placeholder="வீடு/கட்டிட வகையை தேர்ந்தெடுக்கவும்" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="தார்சு வீடு">தார்சு வீடு</SelectItem>
                <SelectItem value="ஓட்டு வீடு">ஓட்டு வீடு</SelectItem>
                <SelectItem value="சிமெண்ட் சீட்">சிமெண்ட் சீட்</SelectItem>
                <SelectItem value="தகர சீட்">தகர சீட்</SelectItem>
                <SelectItem value="கூரைச்சாலை">கூரைச்சாலை</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="facing-direction" className="text-cyan-800 font-medium">
              கட்டிடத்தின் திசை
            </Label>
            <Select value={facingDirection} onValueChange={setFacingDirection}>
              <SelectTrigger className="mt-1 bg-white border-cyan-200 focus:border-cyan-400">
                <SelectValue placeholder="கட்டிடம் எந்த திசையை நோக்கி உள்ளது" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="கிழக்கு">கிழக்கு</SelectItem>
                <SelectItem value="மேற்கு">மேற்கு</SelectItem>
                <SelectItem value="வடக்கு">வடக்கு</SelectItem>
                <SelectItem value="தெற்கு">தெற்கு</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* கட்டிடத்தின் அளவுகள் */}
        <div className="border-t border-cyan-200 pt-4">
          <h4 className="font-medium mb-2 text-cyan-800">கட்டிடத்தின் நான்கு பக்க அளவுகள்</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="north-measurement" className="text-cyan-800 text-sm">
                வடபுறம் (அடி)
              </Label>
              <Input
                id="north-measurement"
                value={northMeasurement}
                onChange={(e) => setNorthMeasurement(e.target.value)}
                placeholder="வடபுறம் அளவு"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="south-measurement" className="text-cyan-800 text-sm">
                தென்புறம் (அடி)
              </Label>
              <Input
                id="south-measurement"
                value={southMeasurement}
                onChange={(e) => setSouthMeasurement(e.target.value)}
                placeholder="தென்புறம் அளவு"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="east-measurement" className="text-cyan-800 text-sm">
                கிழபுறம் (அடி)
              </Label>
              <Input
                id="east-measurement"
                value={eastMeasurement}
                onChange={(e) => setEastMeasurement(e.target.value)}
                placeholder="கிழபுறம் அளவு"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="west-measurement" className="text-cyan-800 text-sm">
                மேல்புறம் (அடி)
              </Label>
              <Input
                id="west-measurement"
                value={westMeasurement}
                onChange={(e) => setWestMeasurement(e.target.value)}
                placeholder="மேல்புறம் அளவு"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="total-sqfeet" className="text-cyan-800 text-sm">
                மொத்த பரப்பளவு (சதுரடி)
              </Label>
              <Input
                id="total-sqfeet"
                value={totalSqFeet}
                onChange={(e) => setTotalSqFeet(e.target.value)}
                placeholder="மொத்த சதுரடி"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="total-sqmeter" className="text-cyan-800 text-sm">
                மொத்த பரப்பளவு (சதுரமீட்டர்)
              </Label>
              <Input
                id="total-sqmeter"
                value={totalSqMeter}
                onChange={(e) => setTotalSqMeter(e.target.value)}
                placeholder="மொத்த சதுரமீட்டர்"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* கட்டிடத்தின் வயது */}
        <div className="border-t border-cyan-200 pt-4">
          <h4 className="font-medium mb-2 text-cyan-800">கட்டிடத்தின் வயது மற்றும் விவரங்கள்</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="building-age" className="text-cyan-800 text-sm">
                கட்டிடத்தின் வயது (வருடங்கள்)
              </Label>
              <Input
                id="building-age"
                value={buildingAge}
                onChange={(e) => setBuildingAge(e.target.value)}
                placeholder="கட்டிடத்தின் வயது"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* கதவு எண்கள் */}
        <div className="border-t border-cyan-200 pt-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium text-cyan-800">கதவு எண்கள்</h4>
            <Button
              type="button"
              onClick={addDoorNumber}
              variant="outline"
              size="sm"
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              கதவு எண் சேர்க்க
            </Button>
          </div>
          <div className="space-y-2">
            {doorNumbers.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Input
                  value={item.number}
                  onChange={(e) => updateDoorNumber(item.id, e.target.value)}
                  placeholder={`கதவு எண் ${index + 1}`}
                  className="bg-white border-cyan-200 focus:border-cyan-400"
                />
                <Button
                  type="button"
                  onClick={() => removeDoorNumber(item.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50 min-w-[40px]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* வரி விதிப்பு எண்கள் */}
        <div className="border-t border-cyan-200 pt-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium text-cyan-800">வரி விதிப்பு எண்கள்</h4>
            <Button
              type="button"
              onClick={addTaxNumber}
              variant="outline"
              size="sm"
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              வரி விதிப்பு எண் சேர்க்க
            </Button>
          </div>
          <div className="space-y-2">
            {taxAssessmentNumbers.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Input
                  value={item.number}
                  onChange={(e) => updateTaxNumber(item.id, e.target.value)}
                  placeholder={`வரி விதிப்பு எண் ${index + 1}`}
                  className="bg-white border-cyan-200 focus:border-cyan-400"
                />
                <Button
                  type="button"
                  onClick={() => removeTaxNumber(item.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50 min-w-[40px]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* குடிநீர் இணைப்பு எண்கள் */}
        <div className="border-t border-cyan-200 pt-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium text-cyan-800">குடிநீர் இணைப்பு வரி விதிப்பு எண்கள்</h4>
            <Button
              type="button"
              onClick={addWaterNumber}
              variant="outline"
              size="sm"
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              குடிநீர் இணைப்பு எண் சேர்க்க
            </Button>
          </div>
          <div className="space-y-2">
            {waterConnectionNumbers.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Input
                  value={item.number}
                  onChange={(e) => updateWaterNumber(item.id, e.target.value)}
                  placeholder={`குடிநீர் இணைப்பு எண் ${index + 1}`}
                  className="bg-white border-cyan-200 focus:border-cyan-400"
                />
                <Button
                  type="button"
                  onClick={() => removeWaterNumber(item.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50 min-w-[40px]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* மின் இணைப்பு எண்கள் */}
        <div className="border-t border-cyan-200 pt-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium text-cyan-800">மின் இணைப்பு எண்கள்</h4>
            <Button
              type="button"
              onClick={addElectricityNumber}
              variant="outline"
              size="sm"
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              மின் இணைப்பு எண் சேர்க்க
            </Button>
          </div>
          <div className="space-y-2">
            {electricityConnectionNumbers.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-center">
                <Input
                  value={item.number}
                  onChange={(e) => updateElectricityNumber(item.id, e.target.value)}
                  placeholder={`மின் இணைப்பு எண் ${index + 1}`}
                  className="bg-white border-cyan-200 focus:border-cyan-400"
                />
                <Button
                  type="button"
                  onClick={() => removeElectricityNumber(item.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50 min-w-[40px]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* கழிப்பறை விவரங்கள் */}
        <div className="border-t border-cyan-200 pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="has-toilet"
              checked={hasToilet}
              onChange={(e) => setHasToilet(e.target.checked)}
              className="border-cyan-300 rounded text-cyan-600 focus:ring-cyan-300"
            />
            <Label htmlFor="has-toilet" className="text-cyan-800 font-medium">
              கழிப்பறை உள்ளதா?
            </Label>
          </div>

          {hasToilet && (
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              <h5 className="font-medium mb-3 text-cyan-700">கழிப்பறை விவரங்கள்</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="toilet-length" className="text-cyan-800 text-sm">
                    நீளம் (அடி)
                  </Label>
                  <Input
                    id="toilet-length"
                    value={toiletDetails.length}
                    onChange={(e) => {
                      updateToiletDetails("length", e.target.value)
                      setTimeout(calculateToiletArea, 100)
                    }}
                    placeholder="நீளம்"
                    className="bg-white border-cyan-200 focus:border-cyan-400"
                  />
                </div>
                <div>
                  <Label htmlFor="toilet-width" className="text-cyan-800 text-sm">
                    அகலம் (அடி)
                  </Label>
                  <Input
                    id="toilet-width"
                    value={toiletDetails.width}
                    onChange={(e) => {
                      updateToiletDetails("width", e.target.value)
                      setTimeout(calculateToiletArea, 100)
                    }}
                    placeholder="அகலம்"
                    className="bg-white border-cyan-200 focus:border-cyan-400"
                  />
                </div>
                <div>
                  <Label htmlFor="toilet-sqft" className="text-cyan-800 text-sm">
                    மொத்த பரப்பளவு (சதுரடி)
                  </Label>
                  <Input
                    id="toilet-sqft"
                    value={toiletDetails.totalSqFeet}
                    readOnly
                    placeholder="மொத்த சதுரடி"
                    className="bg-slate-50 border-cyan-200"
                  />
                </div>
                <div>
                  <Label htmlFor="toilet-sqm" className="text-cyan-800 text-sm">
                    மொத்த பரப்பளவு (சதுரமீட்டர்)
                  </Label>
                  <Input
                    id="toilet-sqm"
                    value={toiletDetails.totalSqMeter}
                    readOnly
                    placeholder="மொத்த சதுரமீட்டர்"
                    className="bg-slate-50 border-cyan-200"
                  />
                </div>
                <div>
                  <Label htmlFor="toilet-facing" className="text-cyan-800 text-sm">
                    திசை
                  </Label>
                  <Select
                    value={toiletDetails.facingDirection}
                    onValueChange={(value) => updateToiletDetails("facingDirection", value)}
                  >
                    <SelectTrigger className="bg-white border-cyan-200 focus:border-cyan-400">
                      <SelectValue placeholder="திசையை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="கிழக்கு">கிழக்கு</SelectItem>
                      <SelectItem value="மேற்கு">மேற்கு</SelectItem>
                      <SelectItem value="வடக்கு">வடக்கு</SelectItem>
                      <SelectItem value="தெற்கு">தெற்கு</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* சுற்றுச் சுவர் விவரங்கள் */}
        <div className="border-t border-cyan-200 pt-4">
          <h4 className="font-medium mb-2 text-cyan-800">சுற்றுச் சுவர் விவரங்கள்</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wall-length" className="text-cyan-800 text-sm">
                சுற்றுச் சுவரின் நீளம் (அடி)
              </Label>
              <Input
                id="wall-length"
                value={wallDetails.length}
                onChange={(e) => updateWallDetails("length", e.target.value)}
                placeholder="சுற்றுச் சுவரின் நீளம்"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="wall-height" className="text-cyan-800 text-sm">
                சுற்றுச் சுவரின் உயரம் (அடி)
              </Label>
              <Input
                id="wall-height"
                value={wallDetails.height}
                onChange={(e) => updateWallDetails("height", e.target.value)}
                placeholder="சுற்றுச் சுவரின் உயரம்"
                className="bg-white border-cyan-200 focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            ரத்து செய்
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            {isEdit ? (
              <>
                <Check className="h-4 w-4 mr-2" /> கட்டிட விவரங்களை புதுப்பிக்க
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" /> கட்டிட விவரங்களை சேர்க்க
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
