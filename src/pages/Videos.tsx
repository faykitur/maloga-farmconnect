import { Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Videos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Farmer Videos</h1>
        <p className="text-muted-foreground">Share and learn farming techniques</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Video className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Video feature coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Videos;
