import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

const resources = [
  { title: "React Documentation", url: "https://react.dev", type: "Docs" },
  { title: "Total TypeScript", url: "https://www.totaltypescript.com", type: "Course" },
  { title: "Tailwind CSS Labs", url: "https://www.youtube.com/tailwindlabs", type: "Video" },
]

export function ResourceList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div>
                <div className="font-medium">{resource.title}</div>
                <div className="text-xs text-muted-foreground">{resource.type}</div>
              </div>
              <Link href={resource.url} target="_blank" className="text-primary hover:underline">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
