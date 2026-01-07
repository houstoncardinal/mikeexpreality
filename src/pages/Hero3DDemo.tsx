import React from 'react';
import { Hero3DSection } from "@/components/ui/3d-hero-section-boxes";
import { Layout } from "@/components/layout";
import { Helmet } from "react-helmet-async";

export default function Hero3DDemo() {
  return (
    <>
      <Helmet>
        <title>3D Hero Experience | Mike Ogunkeye Real Estate</title>
        <meta name="description" content="Experience our immersive 3D hero section showcasing luxury real estate in Houston." />
      </Helmet>
      
      <Layout>
        <Hero3DSection showSpline={true} showScreenshot={true} />
        
        {/* Additional content below the hero */}
        <section className="py-24 px-6 bg-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-serif font-bold mb-6 text-foreground">
              Explore Our 3D Experience
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This immersive hero section demonstrates the power of 3D graphics 
              combined with smooth animations for a premium user experience.
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
}
