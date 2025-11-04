import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Education = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Educational Resources</h1>
        <p className="text-muted-foreground">Learn best practices for livestock management</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Educational content coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
