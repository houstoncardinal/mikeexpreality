import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { ExternalLink } from "lucide-react";

const MLSSearch = () => {
  const harSearchUrl = "https://www.har.com/idx/mls/search?sitetype=aws&cid=598724&mlsorgid=1&allmls=n&for_sale=1";

  return (
    <Layout>
      <Helmet>
        <title>MLS Search | Mike Ogunkeye Real Estate</title>
        <meta name="description" content="Search Houston MLS listings. Find homes for sale in Houston, TX with our integrated HAR MLS search tool." />
        <meta property="og:title" content="MLS Search | Mike Ogunkeye Real Estate" />
        <meta property="og:description" content="Search Houston MLS listings. Find homes for sale in Houston, TX." />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          MLS Search
        </h1>
        <p className="text-muted-foreground mb-6">
          Browse all available Houston MLS listings powered by HAR.
        </p>

        <div 
          className="relative w-full rounded-2xl overflow-hidden border border-border shadow-lg"
          style={{ paddingTop: '140%' }}
        >
          <iframe
            src={harSearchUrl}
            className="absolute top-0 left-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            title="HAR MLS Search"
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
          If the embed is blocked, open it directly:
          <a 
            href={harSearchUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Open MLS Search
            <ExternalLink className="w-4 h-4" />
          </a>
        </p>
      </section>
    </Layout>
  );
};

export default MLSSearch;
