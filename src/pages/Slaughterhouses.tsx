import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, DollarSign } from "lucide-react";

interface Slaughterhouse {
  id: string;
  name: string;
  location: string;
  price_per_kg: number;
  service_fee: number;
  phone: string;
  address: string;
  operating_hours: string;
}

const Slaughterhouses = () => {
  const [slaughterhouses, setSlaughterhouses] = useState<Slaughterhouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlaughterhouses();
  }, []);

  const fetchSlaughterhouses = async () => {
    const { data, error } = await supabase
      .from("slaughterhouses")
      .select("*")
      .order("name");

    if (!error && data) {
      setSlaughterhouses(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading slaughterhouses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Slaughterhouse Locator</h1>
        <p className="text-muted-foreground">Find suitable processing facilities for your livestock</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slaughterhouses.map((slaughterhouse) => (
          <Card key={slaughterhouse.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{slaughterhouse.name}</CardTitle>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="text-sm">{slaughterhouse.location}</span>
                  </div>
                </div>
                <Badge className="bg-primary">Available</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>Price per kg</span>
                  </div>
                  <p className="text-lg font-semibold text-primary">
                    KES {slaughterhouse.price_per_kg}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span>Service Fee</span>
                  </div>
                  <p className="text-lg font-semibold text-secondary">
                    KES {slaughterhouse.service_fee}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{slaughterhouse.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{slaughterhouse.address}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{slaughterhouse.operating_hours}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Slaughterhouses;
