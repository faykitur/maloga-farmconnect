import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Plus, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  likes_count: number;
  created_at: string;
  user_id: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    category: "feeding",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
    if (user) {
      fetchUserLikes();
    }

    const channel = supabase
      .channel("videos_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
        },
        () => {
          fetchVideos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const fetchUserLikes = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("video_likes")
      .select("video_id")
      .eq("user_id", user.id);

    if (data) {
      setUserLikes(new Set(data.map((like) => like.video_id)));
    }
  };

  const handleLike = async (videoId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like videos",
        variant: "destructive",
      });
      return;
    }

    const isLiked = userLikes.has(videoId);

    if (isLiked) {
      await supabase
        .from("video_likes")
        .delete()
        .eq("video_id", videoId)
        .eq("user_id", user.id);

      setUserLikes((prev) => {
        const next = new Set(prev);
        next.delete(videoId);
        return next;
      });
    } else {
      await supabase
        .from("video_likes")
        .insert({ video_id: videoId, user_id: user.id });

      setUserLikes((prev) => new Set(prev).add(videoId));
    }

    fetchVideos();
  };

  const handleShare = (videoId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/videos/${videoId}`);
    toast({
      title: "Link copied!",
      description: "Video link has been copied to clipboard",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("videos").insert({
      ...formData,
      user_id: user.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Video uploaded successfully",
    });

    setDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      video_url: "",
      category: "feeding",
    });
    fetchVideos();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farmer Videos</h1>
          <p className="text-muted-foreground">Share and learn farming techniques</p>
        </div>
        {user && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Farming Video</DialogTitle>
                <DialogDescription>
                  Share your farming techniques with the community
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="feeding">Feeding</option>
                    <option value="treatment">Treatment</option>
                    <option value="rearing">Rearing</option>
                    <option value="breeding">Breeding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Upload Video
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No videos uploaded yet</p>
            {user && (
              <Button onClick={() => setDialogOpen(true)}>Upload First Video</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <Badge className="absolute top-2 right-2">
                  {video.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLike(video.id)}
                  className={userLikes.has(video.id) ? "text-red-500" : ""}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${
                      userLikes.has(video.id) ? "fill-current" : ""
                    }`}
                  />
                  {video.likes_count}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(video.id)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(video.video_url, "_blank")}
                >
                  Watch
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
