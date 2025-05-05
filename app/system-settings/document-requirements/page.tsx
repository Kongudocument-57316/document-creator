import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookNumberForm } from "./book-number-form"
import { DocumentTypeForm } from "./document-type-form"
import { SubmissionTypeForm } from "./submission-type-form"
import { TypistForm } from "./typist-form"
import { OfficeForm } from "./office-form"
import { PaymentMethodForm } from "./payment-method-form"
import { CertificateTypeForm } from "./certificate-type-form"
import { LandTypeForm } from "./land-type-form"
import { ValueTypeForm } from "./value-type-form"
import { Suspense } from "react"
import Loading from "./loading"

export default function DocumentRequirements({ searchParams }: { searchParams: { tab?: string } }) {
  const defaultTab = searchParams.tab || "book-number"

  return (
    <div className="flex min-h-screen flex-col bg-rose-50">
      <Header className="bg-rose-100 border-rose-200" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-rose-800">ஆவணத்திற்கு தேவையான விவரங்கள்</h2>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 bg-rose-100">
              <TabsTrigger
                value="book-number"
                className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800"
              >
                புத்தக எண்
              </TabsTrigger>
              <TabsTrigger
                value="document-type"
                className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800"
              >
                ஆவணத்தின் வகை
              </TabsTrigger>
              <TabsTrigger
                value="submission-type"
                className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800"
              >
                ஆவணம் ஒப்படைப்பு
              </TabsTrigger>
              <TabsTrigger value="typist" className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800">
                தட்டச்சாளர்
              </TabsTrigger>
              <TabsTrigger value="office" className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800">
                தட்டச்சு அலுவலகம்
              </TabsTrigger>
              <TabsTrigger
                value="payment-method"
                className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800"
              >
                பணம் செலுத்தும் முறை
              </TabsTrigger>
              <TabsTrigger
                value="certificate-type"
                className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800"
              >
                சான்றிதழ்கள் விவரம்
              </TabsTrigger>
              <TabsTrigger
                value="land-type"
                className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800"
              >
                நில விவரங்கள்
              </TabsTrigger>
              <TabsTrigger
                value="value-type"
                className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-800"
              >
                இதர விவரங்கள்
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 bg-white p-6 rounded-lg border border-rose-200 shadow-sm">
              <TabsContent value="book-number">
                <Suspense fallback={<Loading />}>
                  <BookNumberForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="document-type">
                <Suspense fallback={<Loading />}>
                  <DocumentTypeForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="submission-type">
                <Suspense fallback={<Loading />}>
                  <SubmissionTypeForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="typist">
                <Suspense fallback={<Loading />}>
                  <TypistForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="office">
                <Suspense fallback={<Loading />}>
                  <OfficeForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="payment-method">
                <Suspense fallback={<Loading />}>
                  <PaymentMethodForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="certificate-type">
                <Suspense fallback={<Loading />}>
                  <CertificateTypeForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="land-type">
                <Suspense fallback={<Loading />}>
                  <LandTypeForm />
                </Suspense>
              </TabsContent>
              <TabsContent value="value-type">
                <Suspense fallback={<Loading />}>
                  <ValueTypeForm />
                </Suspense>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <footer className="bg-rose-100 border-t border-rose-200 py-4 text-center text-rose-700">
        <p>© 2023 தமிழ் ஆவண மேலாண்மை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
      </footer>
    </div>
  )
}
