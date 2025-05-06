"use client"

interface DocumentPreviewProps {
  content?: string
  formData?: any
  title?: string
}

export function DocumentPreview({ content, formData, title = "கிரைய ஆவணம்" }: DocumentPreviewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h1 className="text-xl font-semibold text-gray-900">{title} - முன்னோட்டம்</h1>
      </div>
      <div className="p-8 overflow-auto max-h-[70vh]">
        <div className="shadow-sm bg-white mx-auto max-w-4xl min-h-[297mm] border border-gray-200">
          <div
            className="p-8 prose prose-sm max-w-none print:prose-sm"
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
        </div>
      </div>
    </div>
  )
}
