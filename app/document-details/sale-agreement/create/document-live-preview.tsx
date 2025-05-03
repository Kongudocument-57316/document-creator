import { Card, CardContent } from "@/components/ui/card"

interface DocumentLivePreviewProps {
  documentText: string
}

export default function DocumentLivePreview({ documentText }: DocumentLivePreviewProps) {
  // Split the document text by newlines and render each line
  const lines = documentText.split("\n")

  return (
    <Card className="w-full mt-4">
      <CardContent className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-16 prose max-w-none">
          {lines.map((line, index) => (
            <p key={index} className={line.trim() === "" ? "my-4" : "my-1"}>
              {line}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
