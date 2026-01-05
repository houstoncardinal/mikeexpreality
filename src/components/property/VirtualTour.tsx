import { Play, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VirtualTourProps {
  videoUrl?: string;
  matterportUrl?: string;
  title: string;
}

export const VirtualTour = ({ videoUrl, matterportUrl, title }: VirtualTourProps) => {
  const [activeTab, setActiveTab] = useState<"video" | "3d">(videoUrl ? "video" : "3d");

  if (!videoUrl && !matterportUrl) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-foreground">Virtual Tour</h2>
        
        {videoUrl && matterportUrl && (
          <div className="flex gap-2">
            <Button
              variant={activeTab === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("video")}
            >
              <Play className="h-4 w-4 mr-2" />
              Video Tour
            </Button>
            <Button
              variant={activeTab === "3d" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("3d")}
            >
              <Box className="h-4 w-4 mr-2" />
              3D Walkthrough
            </Button>
          </div>
        )}
      </div>

      <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
        {activeTab === "video" && videoUrl && (
          <iframe
            src={videoUrl}
            title={`${title} - Video Tour`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        
        {activeTab === "3d" && matterportUrl && (
          <iframe
            src={matterportUrl}
            title={`${title} - 3D Walkthrough`}
            className="w-full h-full"
            allow="xr-spatial-tracking"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};
