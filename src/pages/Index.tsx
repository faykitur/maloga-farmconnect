import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, MapPin, MessageSquare, Video, BookOpen, TrendingUp } from "lucide-react";
import heroImage from "@/assets/livestock-hero.jpg";

const Index = () => {
  const features = [
    { icon: Store, title: "Marketplace", desc: "Buy & sell livestock", path: "/marketplace" },
    { icon: MapPin, title: "Slaughterhouses", desc: "Find processing facilities", path: "/slaughterhouses" },
    { icon: MessageSquare, title: "Q&A Forum", desc: "Ask farming questions", path: "/forum" },
    { icon: Video, title: "Videos", desc: "Learn from farmers", path: "/videos" },
    { icon: BookOpen, title: "Education", desc: "Training resources", path: "/education" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section with Livestock */}
      <section className="relative overflow-hidden rounded-xl h-[400px] md:h-[500px]">
        <img 
          src={heroImage} 
          alt="Diverse livestock grazing together in harmony"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent flex items-end">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              Connect with Quality Livestock
            </h2>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              Your trusted marketplace for buying and selling farm animals
            </p>
          </div>
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
