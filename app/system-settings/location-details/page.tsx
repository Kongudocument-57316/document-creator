import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StateForm } from "./state-form"
import { DistrictForm } from "./district-form"
import { TalukForm } from "./taluk-form"
import { VillageForm } from "./village-form"
import { TahsildarOfficeForm } from "./tahsildar-office-form"
import { RegistrationDistrictForm } from "./registration-district-form"
import { SubRegistrarOfficeForm } from "./sub-registrar-office-form"

export default function LocationDetails() {
  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <Header className="bg-blue-100 border-blue-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">இட விவரங்கள்</h2>

          <Tabs defaultValue="state" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-7 bg-blue-100">
              <TabsTrigger value="state" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800">
                மாநிலம்
              </TabsTrigger>
              <TabsTrigger
                value="district"
                className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800"
              >
                மாவட்டம்
              </TabsTrigger>
              <TabsTrigger value="taluk" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800">
                வட்டம்
              </TabsTrigger>
              <TabsTrigger
                value="village"
                className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800"
              >
                கிராமம்
              </TabsTrigger>
              <TabsTrigger
                value="tahsildar"
                className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800"
              >
                வட்டாட்சியர் அலுவலகம்
              </TabsTrigger>
              <TabsTrigger
                value="registration"
                className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800"
              >
                பதிவு மாவட்டம்
              </TabsTrigger>
              <TabsTrigger
                value="subregistrar"
                className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800"
              >
                சார்பதிவாளர் அலுவலகம்
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
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
      <footer className="bg-blue-100 border-t border-blue-200 py-4 text-center text-blue-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
