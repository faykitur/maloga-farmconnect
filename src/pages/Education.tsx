import { BookOpen, Video, FileText, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const educationalResources = [
  {
    id: 1,
    title: "Cattle Nutrition and Feeding",
    description: "Learn optimal feeding practices for healthy cattle growth",
    category: "cattle",
    type: "video",
    duration: "45 min",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Disease Prevention in Livestock",
    description: "Essential vaccination schedules and disease management",
    category: "health",
    type: "article",
    duration: "15 min read",
    url: "https://example.com/disease-prevention",
  },
  {
    id: 3,
    title: "Goat Breeding Best Practices",
    description: "Comprehensive guide to successful goat breeding programs",
    category: "goat",
    type: "video",
    duration: "30 min",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 4,
    title: "Poultry Farm Management",
    description: "From chicks to layers - complete poultry farming guide",
    category: "poultry",
    type: "course",
    duration: "2 hours",
    url: "https://example.com/poultry-course",
  },
  {
    id: 5,
    title: "Sheep Wool Quality Management",
    description: "Techniques for producing high-quality wool",
    category: "sheep",
    type: "article",
    duration: "20 min read",
    url: "https://example.com/sheep-wool",
  },
  {
    id: 6,
    title: "Organic Livestock Farming",
    description: "Transitioning to organic livestock production methods",
    category: "general",
    type: "course",
    duration: "3 hours",
    url: "https://example.com/organic-farming",
  },
  {
    id: 7,
    title: "Pasture Management",
    description: "Rotational grazing and sustainable pasture practices",
    category: "general",
    type: "video",
    duration: "40 min",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 8,
    title: "Record Keeping for Farmers",
    description: "Essential records and data management for livestock farms",
    category: "management",
    type: "article",
    duration: "10 min read",
    url: "https://example.com/record-keeping",
  },
];

const Education = () => {
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
