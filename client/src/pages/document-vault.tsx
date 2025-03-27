import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

export default function DocumentVault() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Vault</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.title}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {doc.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
              <div className="text-sm text-muted-foreground">
                Uploaded: {doc.uploadDate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const documents = [
  {
    title: "Health Insurance Policy",
    description: "Annual health insurance policy document",
    uploadDate: "2024-02-18",
  },
  {
    title: "Car Insurance",
    description: "Vehicle insurance coverage details",
    uploadDate: "2024-02-15",
  },
  {
    title: "Medical Records",
    description: "Recent medical examination reports",
    uploadDate: "2024-02-10",
  },
];
