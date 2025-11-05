import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, MapPin, MessageSquare, Video, BookOpen, TrendingUp } from "lucide-react";
import cowImage from "@/assets/livestock-cow.jpg";
import goatsImage from "@/assets/livestock-goats.jpg";
import sheepImage from "@/assets/livestock-sheep.jpg";
import chickensImage from "@/assets/livestock-chickens.jpg";

const Index = () => {
  const features = [
    { icon: Store, title: "Marketplace", desc: "Buy & sell livestock", path: "/marketplace" },
    { icon: MapPin, title: "Slaughterhouses", desc: "Find processing facilities", path: "/slaughterhouses" },
    { icon: MessageSquare, title: "Q&A Forum", desc: "Ask farming questions", path: "/forum" },
    { icon: Video, title: "Videos", desc: "Learn from farmers", path: "/videos" },
    { icon: BookOpen, title: "Education", desc: "Training resources", path: "/education" },
  ];

  const livestockImages = [
    { src: cowImage, alt: "Healthy cattle in pasture" },
    { src: goatsImage, alt: "Farm goats" },
    { src: sheepImage, alt: "Grazing sheep" },
    { src: chickensImage, alt: "Free-range chickens" }
  ];

  return (
    <div className="space-y-12">
      {/* Livestock Showcase */}
      <section className="relative overflow-hidden rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {livestockImages.map((image, index) => (
            <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to MALOGA
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your complete livestock marketplace and education platform
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/marketplace">
            <Button size="lg">Browse Marketplace</Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline">Get Started</Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.path} to={feature.path}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Index;
