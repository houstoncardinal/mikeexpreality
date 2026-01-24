import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { siteConfig } from "@/lib/siteConfig";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getPrivacyPolicySchemas } from "@/lib/schema";

const PrivacyPolicy = () => {
  const schemas = getPrivacyPolicySchemas();
  
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Data Protection | {siteConfig.name}</title>
        <meta 
          name="description" 
          content="Privacy Policy for Mike Ogunkeye Real Estate. Learn how we collect, use, and protect your personal information when using our Houston real estate services." 
        />
        <link rel="canonical" href={`${siteConfig.url}/privacy-policy`} />
        <meta name="robots" content="noindex, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`Privacy Policy | ${siteConfig.name}`} />
        <meta property="og:description" content="Learn how Mike Ogunkeye Real Estate protects your personal information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/privacy-policy`} />
      </Helmet>
      
      {/* Schema Markup */}
      <SchemaMarkup schemas={schemas} />

      <Layout>
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-gradient-to-b from-secondary to-background">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="max-w-3xl prose prose-slate dark:prose-invert">
              
              <h2>Introduction</h2>
              <p>
                {siteConfig.name} ("we," "our," or "us") respects your privacy and is committed to protecting 
                your personal information. This Privacy Policy explains how we collect, use, disclose, and 
                safeguard your information when you visit our website or use our real estate services.
              </p>

              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us, including:</p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Mailing address and property preferences</li>
                <li>Financial information for mortgage pre-qualification</li>
                <li>Communication preferences</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul>
                <li>IP address and browser type</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
                <li>Device information</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide real estate services and property recommendations</li>
                <li>Respond to your inquiries and communicate with you</li>
                <li>Send property listings and market updates (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with:
              </p>
              <ul>
                <li>Real estate partners and service providers (lenders, title companies, inspectors)</li>
                <li>Third-party service providers who assist our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, 
                no method of transmission over the Internet is 100% secure.
              </p>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and receive a copy of your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2>Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience. 
                You can control cookie settings through your browser preferences.
              </p>

              <h2>Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the 
                privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly 
                collect personal information from children.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of any material changes 
                by posting the new policy on this page with an updated revision date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>Email: {siteConfig.email}</li>
                <li>Phone: {siteConfig.phone}</li>
                <li>Address: {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}</li>
              </ul>

            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
