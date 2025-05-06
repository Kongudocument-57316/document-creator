import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StateForm } from "./state-form"
import { DistrictForm } from "./district-form"
import { TalukForm } from "./taluk-form"
import { VillageForm } from "./village-form"
import { TahsildarOfficeForm } from "./tahsildar-office-form"
import { RegistrationDistrictForm } from "./registration-district-form"
import { SubRegistrarOfficeForm } from "./sub-registrar-office-form"
import { MapPin } from "lucide-react"

export default function LocationDetails() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header className="bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800">இட விவரங்கள்</h2>
          </div>

          <Tabs defaultValue="state" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-7 bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg overflow-hidden">
              <TabsTrigger
                value="state"
                className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-900 hover:bg-blue-200 transition-colors"
              >
                மாநிலம்
              </TabsTrigger>
              <TabsTrigger
                value="district"
                className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-900 hover:bg-blue-200 transition-colors"
              >
                மாவட்டம்
              </TabsTrigger>
              <TabsTrigger
                value="taluk"
                className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-900 hover:bg-blue-200 transition-colors"
              >
                வட்டம்
              </TabsTrigger>
              <TabsTrigger
                value="village"
                className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-900 hover:bg-blue-200 transition-colors"
              >
                கிராமம்
              </TabsTrigger>
              <TabsTrigger
                value="tahsildar"
                className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-900 hover:bg-blue-200 transition-colors"
              >
                வட்டாட்சியர் அலுவலகம்
              </TabsTrigger>
              <TabsTrigger
                value="registration"
                className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-900 hover:bg-blue-200 transition-colors"
              >
                பதிவு மாவட்டம்
              </TabsTrigger>
              <TabsTrigger
                value="subregistrar"
                className="data-[state=active]:bg-blue-300 data-[state=active]:text-blue-900 hover:bg-blue-200 transition-colors"
              >
                சார்பதிவாளர் அலுவலகம்
              </TabsTrigger>
            </TabsList>
            <div className="mt-0 bg-white p-6 rounded-b-lg border border-blue-300 shadow-md">
              <TabsContent value="state">
                <StateForm />
              </TabsContent>
              <TabsContent value="district">
                <DistrictForm />
              </TabsContent>
              <TabsContent value="taluk">
                <TalukForm />
              </TabsContent>
              <TabsContent value="village">
                <VillageForm />
              </TabsContent>
              <TabsContent value="tahsildar">
                <TahsildarOfficeForm />
              </TabsContent>
              <TabsContent value="registration">
                <RegistrationDistrictForm />
              </TabsContent>
              <TabsContent value="subregistrar">
                <SubRegistrarOfficeForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <footer className="bg-gradient-to-r from-blue-100 to-blue-200 border-t border-blue-300 py-4 text-center text-blue-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
