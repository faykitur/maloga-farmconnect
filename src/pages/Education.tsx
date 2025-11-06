import { useEffect, useState } from "react";
import { BookOpen, Video, FileText, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EducationalResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  duration: string;
  url: string;
}

const Education = () => {
  const [educationalResources, setEducationalResources] = useState<EducationalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("educational_resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEducationalResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to load educational resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "article":
        return <FileText className="h-5 w-5" />;
      case "course":
        return <Award className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-primary/10 text-primary";
      case "article":
        return "bg-secondary/10 text-secondary";
      case "course":
        return "bg-accent/10 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading educational resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Educational Resources</h1>
        <p className="text-muted-foreground">Learn best practices for livestock management</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="course">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {getIcon(resource.type)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{resource.duration}</span>
                    <Button size="sm" onClick={() => window.open(resource.url, "_blank")}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalResources
              .filter((r) => r.type === "video")
              .map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {getIcon(resource.type)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{resource.duration}</span>
                      <Button size="sm" onClick={() => window.open(resource.url, "_blank")}>
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="article" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalResources
              .filter((r) => r.type === "article")
              .map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {getIcon(resource.type)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{resource.duration}</span>
                      <Button size="sm" onClick={() => window.open(resource.url, "_blank")}>
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="course" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalResources
              .filter((r) => r.type === "course")
              .map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {getIcon(resource.type)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{resource.duration}</span>
                      <Button size="sm" onClick={() => window.open(resource.url, "_blank")}>
                        Enroll
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Education;
