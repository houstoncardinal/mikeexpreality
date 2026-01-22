import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/lib/siteConfig";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | {siteConfig.name}</title>
        <meta 
          name="description" 
          content="Terms and Conditions for Mike Ogunkeye Real Estate. Please read these terms carefully before using our website or services." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-secondary to-background">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Terms & Conditions
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
            
            <h2>Agreement to Terms</h2>
            <p>
              By accessing and using the {siteConfig.name} website ("Site"), you agree to be bound by these 
              Terms and Conditions. If you do not agree with any part of these terms, please do not use our Site.
            </p>

            <h2>Real Estate Services</h2>
            <p>
              {siteConfig.name} is a licensed real estate professional operating under {siteConfig.brokerage}. 
              Our services include but are not limited to:
            </p>
            <ul>
              <li>Buyer representation and home search assistance</li>
              <li>Seller representation and property listing services</li>
              <li>Market analysis and property valuations</li>
              <li>Real estate consultation and advisory services</li>
            </ul>

            <h2>Property Information Disclaimer</h2>
            <p>
              Property listings, prices, and information displayed on this Site are believed to be accurate 
              but are not guaranteed. All information should be independently verified. Properties may be 
              sold, withdrawn, or have changed status since the last update.
            </p>
            <p>
              MLS data is provided by the Houston Association of REALTORS® (HAR) and is subject to their 
              terms of use. Listing information is deemed reliable but not guaranteed.
            </p>

            <h2>Mortgage Calculator Disclaimer</h2>
            <p>
              The mortgage calculator and financial tools on this Site are for informational and educational 
              purposes only. They do not constitute financial advice, loan approval, or a commitment to lend. 
              Actual loan terms, interest rates, and monthly payments may vary based on your credit profile, 
              down payment, and current market conditions.
            </p>
            <p>
              Always consult with a licensed mortgage professional for accurate rate quotes and loan options.
            </p>

            <h2>User Conduct</h2>
            <p>When using our Site, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information in any forms or inquiries</li>
              <li>Not use the Site for any unlawful purpose</li>
              <li>Not attempt to gain unauthorized access to any portion of the Site</li>
              <li>Not use automated systems to access the Site without permission</li>
              <li>Not interfere with the proper functioning of the Site</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content on this Site, including text, graphics, logos, images, and software, is the property 
              of {siteConfig.name} or its content suppliers and is protected by intellectual property laws. 
              You may not reproduce, distribute, or create derivative works without our written consent.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites or services. We are not responsible for the 
              content, accuracy, or practices of these external sites. Linking to a third-party site does not 
              imply endorsement.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {siteConfig.name} shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of the Site or 
              our services. Our total liability shall not exceed the amount paid by you, if any, for using 
              our services.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless {siteConfig.name}, {siteConfig.brokerage}, and their 
              officers, directors, employees, and agents from any claims, damages, losses, or expenses 
              arising from your use of the Site or violation of these Terms.
            </p>

            <h2>Fair Housing Statement</h2>
            <p>
              We are committed to the Fair Housing Act and do not discriminate based on race, color, religion, 
              sex, national origin, familial status, or disability. All real estate advertised is subject to 
              the Federal Fair Housing Act.
            </p>

            <h2>Texas Real Estate Commission Information</h2>
            <p>
              The Texas Real Estate Commission (TREC) regulates real estate brokers and sales agents. 
              For information about TREC, visit{" "}
              <a href="https://www.trec.texas.gov" target="_blank" rel="noopener noreferrer">
                www.trec.texas.gov
              </a>.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Texas, 
              without regard to its conflict of law provisions. Any disputes shall be resolved in the courts 
              of Harris County, Texas.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately 
              upon posting on the Site. Your continued use of the Site after changes constitutes acceptance 
              of the modified Terms.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms & Conditions, please contact us:
            </p>
            <ul>
              <li>Email: {siteConfig.email}</li>
              <li>Phone: {siteConfig.phone}</li>
              <li>Address: {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}</li>
            </ul>

          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
