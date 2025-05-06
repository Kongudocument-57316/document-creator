import type React from "react"
import { Suspense } from "react"
import Link from "next/link"
import {
  Building,
  BadgeIcon as Certificate,
  FileText,
  Landmark,
  LayoutDashboard,
  MapPin,
  Plus,
  Store,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  getDashboardStats,
  getRecentDocuments,
  getPropertyStats,
  getDocumentActivityData,
  getCertificateStats,
  getDistrictStats,
  type RecentDocument,
} from "./actions/dashboard-actions"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <WelcomeBanner />

        <Suspense fallback={<StatisticsCardsSkeleton />}>
          <StatisticsCards />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full md:col-span-1 lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>சமீபத்திய ஆவணங்கள்</CardTitle>
                <CardDescription>உங்கள் சமீபத்திய ஆவணங்களின் நிலை</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/document-details/sale-deed-creation">
                  <Plus className="mr-2 h-4 w-4" />
                  புதிய ஆவணம்
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RecentDocumentsSkeleton />}>
                <RecentDocumentsDisplay />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>ஆவண செயல்பாடு</CardTitle>
              <CardDescription>கடந்த 12 மாதங்களில் உருவாக்கப்பட்ட ஆவணங்கள்</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[200px] animate-pulse bg-muted rounded-md" />}>
                <DocumentActivityChart />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full md:col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>விரைவு செயல்கள்</CardTitle>
              <CardDescription>அடிக்கடி பயன்படுத்தப்படும் செயல்கள்</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                  href="/document-details/sale-deed-creation"
                  icon={<FileText className="h-5 w-5" />}
                  label="கிரைய பத்திரம் உருவாக்கு"
                  color="bg-gradient-to-br from-purple-500 to-indigo-600"
                />
                <QuickActionButton
                  href="/document-editor"
                  icon={<FileText className="h-5 w-5" />}
                  label="ஆவண எடிட்டர்"
                  color="bg-gradient-to-br from-cyan-500 to-blue-600"
                />
                <QuickActionButton
                  href="/system-settings/user-management"
                  icon={<Users className="h-5 w-5" />}
                  label="பயனர் மேலாண்மை"
                  color="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <QuickActionButton
                  href="/system-settings/property-details"
                  icon={<Building className="h-5 w-5" />}
                  label="சொத்து விவரங்கள்"
                  color="bg-gradient-to-br from-emerald-500 to-green-600"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>சான்றிதழ் விவரங்கள்</CardTitle>
              <CardDescription>சான்றிதழ் வகைகளின் விவரங்கள்</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[200px] animate-pulse bg-muted rounded-md" />}>
                <CertificateStatsDisplay />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>சொத்து புள்ளிவிவரங்கள்</CardTitle>
              <CardDescription>சொத்து வகைகளின் விவரங்கள்</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<PropertyStatsSkeleton />}>
                <PropertyStatsDisplay />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full md:col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>மாவட்ட விவரங்கள்</CardTitle>
              <CardDescription>மாவட்ட வாரியாக ஆவணங்கள்</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[200px] animate-pulse bg-muted rounded-md" />}>
                <DistrictStatsDisplay />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>நாள்காட்டி</CardTitle>
              <CardDescription>இன்றைய தேதி மற்றும் நிகழ்வுகள்</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      {new Date().toLocaleDateString("ta-IN", { month: "long", year: "numeric" })}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <span className="sr-only">Previous month</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <span className="sr-only">Next month</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs leading-5">
                    <div>ஞா</div>
                    <div>தி</div>
                    <div>செ</div>
                    <div>பு</div>
                    <div>வி</div>
                    <div>வெ</div>
                    <div>ச</div>
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-2 text-sm">
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1
                      const isToday = day === new Date().getDate()
                      const hasEvent = [3, 12, 22].includes(day)

                      return (
                        <div
                          key={day}
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isToday ? "bg-purple-600 text-white" : hasEvent ? "bg-purple-100 text-purple-700" : ""
                          }`}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function WelcomeBanner() {
  return (
    <div className="rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 p-6 shadow-lg">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            வணக்கம், உங்கள் டாஷ்போர்டுக்கு வரவேற்கிறோம்!
          </h1>
          <p className="text-purple-100">உங்கள் ஆவணங்களை எளிதாக உருவாக்கவும், நிர்வகிக்கவும் மற்றும் கண்காணிக்கவும்.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-white text-purple-600 hover:bg-purple-50" asChild>
            <Link href="/document-details/sale-deed-creation">
              <Plus className="mr-2 h-4 w-4" />
              புதிய ஆவணம் உருவாக்கு
            </Link>
          </Button>
          <Button variant="outline" className="border-purple-200 text-white hover:bg-purple-700" asChild>
            <Link href="/document-details/sale-document/search">
              <FileText className="mr-2 h-4 w-4" />
              ஆவணங்களைத் தேடு
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

async function StatisticsCards() {
  const stats = await getDashboardStats()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="மொத்த ஆவணங்கள்"
        value={stats.totalDocuments.toString()}
        description="உருவாக்கப்பட்ட மொத்த ஆவணங்கள்"
        icon={<FileText className="h-5 w-5 text-purple-600" />}
        color="bg-purple-50"
      />
      <StatCard
        title="பயனர்கள்"
        value={stats.totalUsers.toString()}
        description="பதிவுசெய்யப்பட்ட பயனர்கள்"
        icon={<Users className="h-5 w-5 text-cyan-600" />}
        color="bg-cyan-50"
      />
      <StatCard
        title="சான்றிதழ்கள்"
        value={stats.totalCertificates.toString()}
        description="பதிவுசெய்யப்பட்ட சான்றிதழ்கள்"
        icon={<Certificate className="h-5 w-5 text-amber-600" />}
        color="bg-amber-50"
      />
      <StatCard
        title="முடிக்கப்பட்ட ஆவணங்கள்"
        value={stats.completedDocuments.toString()}
        description="முடிக்கப்பட்ட ஆவணங்கள்"
        icon={<LayoutDashboard className="h-5 w-5 text-emerald-600" />}
        color="bg-emerald-50"
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`rounded-full p-2 ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatisticsCardsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function RecentDocumentsDisplay() {
  const documents = await getRecentDocuments()

  if (documents.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="flex flex-col items-center text-center">
          <FileText className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">ஆவணங்கள் இல்லை</h3>
          <p className="mt-2 text-sm text-muted-foreground">புதிய ஆவணத்தை உருவாக்க "புதிய ஆவணம்" பொத்தானைக் கிளிக் செய்யவும்.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <RecentDocumentItem key={doc.id} document={doc} />
      ))}
    </div>
  )
}

function RecentDocumentItem({ document }: { document: RecentDocument }) {
  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    draft: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
  }

  const statusText: Record<string, string> = {
    completed: "முடிக்கப்பட்டது",
    pending: "நிலுவையில்",
    draft: "வரைவு",
    in_progress: "செயல்பாட்டில்",
  }

  const statusColor = statusColors[document.status] || "bg-gray-100 text-gray-700"
  const statusDisplay = statusText[document.status] || document.status

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-purple-100 p-2">
          <FileText className="h-5 w-5 text-purple-700" />
        </div>
        <div>
          <p className="font-medium">{document.title}</p>
          <p className="text-xs text-muted-foreground">{document.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-1 text-xs ${statusColor}`}>{statusDisplay}</span>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/document-details/sale-document/view/${document.id}`}>
            <span className="sr-only">View document</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  )
}

function RecentDocumentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
            <div className="space-y-1">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function DocumentActivityChart() {
  const data = await getDocumentActivityData()
  const months = ["ஜன", "பிப்", "மார்", "ஏப்", "மே", "ஜூன்", "ஜூலை", "ஆக", "செப்", "அக்", "நவ", "டிச"]

  const maxValue = Math.max(...data, 1) // Ensure we don't divide by zero

  return (
    <div className="h-[200px] w-full">
      <div className="flex h-full items-end gap-2">
        {data.map((value, i) => {
          const height = value > 0 ? (value / maxValue) * 100 : 0

          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-purple-600" style={{ height: `${height}%` }} />
              <span className="text-xs">{months[i]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuickActionButton({
  href,
  icon,
  label,
  color,
}: {
  href: string
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <Button
      variant="ghost"
      className={`flex h-24 w-full flex-col items-center justify-center gap-2 rounded-lg ${color} text-white hover:opacity-90`}
      asChild
    >
      <Link href={href}>
        <div className="rounded-full bg-white/20 p-2">{icon}</div>
        <span className="text-center text-xs font-medium">{label}</span>
      </Link>
    </Button>
  )
}

async function PropertyStatsDisplay() {
  const stats = await getPropertyStats()

  const iconMap: Record<string, React.ReactNode> = {
    Landmark: <Landmark className="h-5 w-5" />,
    Building: <Building className="h-5 w-5" />,
    Store: <Store className="h-5 w-5" />,
  }

  return (
    <div className="space-y-4">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-purple-100 p-2 text-purple-700">
              {iconMap[stat.icon] || <Building className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-medium">{stat.type}</p>
              <p className="text-xs text-muted-foreground">{stat.count} சொத்துகள்</p>
            </div>
          </div>
          <div className="flex h-2 w-24 overflow-hidden rounded-full bg-purple-100">
            <div className="bg-purple-600" style={{ width: `${Math.min(100, stat.count * 10)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function PropertyStatsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
            <div className="space-y-1">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-2 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  )
}

async function CertificateStatsDisplay() {
  const { byType } = await getCertificateStats()

  return (
    <div className="space-y-4">
      {byType.map((cert, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-amber-100 p-2 text-amber-700">
              <Certificate className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{cert.name}</p>
              <p className="text-xs text-muted-foreground">{cert.count} சான்றிதழ்கள்</p>
            </div>
          </div>
          <div className="flex h-2 w-24 overflow-hidden rounded-full bg-amber-100">
            <div className="bg-amber-600" style={{ width: `${Math.min(100, cert.count * 10)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

async function DistrictStatsDisplay() {
  const districts = await getDistrictStats()

  if (districts.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="flex flex-col items-center text-center">
          <MapPin className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">மாவட்ட விவரங்கள் இல்லை</h3>
          <p className="mt-2 text-sm text-muted-foreground">மாவட்ட விவரங்களை சேர்க்க அமைப்புகளுக்குச் செல்லவும்.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {districts.map((district, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-md bg-cyan-100 p-2 text-cyan-700">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="font-medium">{district.name}</p>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-cyan-100 mt-2">
            <div className="bg-cyan-600" style={{ width: `${Math.min(100, district.count * 5)}%` }} />
          </div>
          <p className="text-xs text-right mt-1 text-muted-foreground">{district.count} ஆவணங்கள்</p>
        </div>
      ))}
    </div>
  )
}
