import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Houston Elite Real Estate</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center bg-background">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-serif text-8xl md:text-9xl font-bold text-accent/20 mb-4">404</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Sorry, the page you're looking for doesn't exist. Let's get you back on track.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/">
                  <Button variant="gold" size="lg">
                    <Home className="h-5 w-5" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button variant="outline" size="lg">
                    Browse Listings
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default NotFound;
