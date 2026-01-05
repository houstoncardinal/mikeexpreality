import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
        {/* Main Image */}
        <div 
          className="md:col-span-3 relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={images[0]}
            alt={`${title} - Main Photo`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Expand className="h-4 w-4 mr-2" />
            View All Photos
          </Button>
        </div>

        {/* Thumbnail Grid */}
        <div className="hidden md:grid grid-rows-3 gap-4">
          {images.slice(1, 4).map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index + 1)}
            >
              <img
                src={image}
                alt={`${title} - Photo ${index + 2}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {index === 2 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{images.length - 4} More
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Thumbnails */}
      <div className="flex md:hidden gap-2 mt-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden cursor-pointer ring-2 ${
              currentIndex === index ? "ring-accent" : "ring-transparent"
            }`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`${title} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="max-w-5xl max-h-[80vh] px-16">
            <img
              src={images[currentIndex]}
              alt={`${title} - Photo ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-12 rounded overflow-hidden ring-2 transition-all ${
                  currentIndex === index ? "ring-accent scale-110" : "ring-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};
