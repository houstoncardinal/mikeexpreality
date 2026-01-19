import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { AdvancedMortgageCalculator } from "@/components/mortgage";
import { siteConfig } from "@/lib/siteConfig";
import { getMortgageCalculatorSchemas } from "@/lib/schema";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

export default function MortgageCalculatorPage() {
  const schemas = getMortgageCalculatorSchemas();

  return (
    <>
      <Helmet>
        <title>Mortgage Calculator | {siteConfig.name}</title>
        <meta
          name="description"
          content="Calculate your monthly mortgage payment with our advanced calculator. Includes rate scenario planning, extra payment analysis, and full compliance disclosures."
        />
        <meta name="keywords" content="mortgage calculator, home loan calculator, monthly payment calculator, mortgage rate scenarios, Houston mortgage, Texas mortgage calculator" />
        <link rel="canonical" href={`${siteConfig.url}/mortgage-calculator`} />
      </Helmet>

      {/* FinancialProduct Schema for Mortgage Calculator */}
      <SchemaMarkup schemas={schemas} />

      <Layout>
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto">
            <AdvancedMortgageCalculator />
          </div>
        </section>
      </Layout>
    </>
  );
}
