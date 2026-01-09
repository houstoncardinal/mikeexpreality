import React from "react";

interface SchemaMarkupProps {
  schemas: object[];
}

/**
 * Component to render multiple JSON-LD schema markup scripts
 * Use this component in page components to add structured data
 * 
 * @example
 * import { getHomepageSchemas } from "@/lib/schema";
 * 
 * const HomePage = () => (
 *   <>
 *     <Helmet>...</Helmet>
 *     <SchemaMarkup schemas={getHomepageSchemas()} />
 *     <main>...</main>
 *   </>
 * );
 */
export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ schemas }) => {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

/**
 * Single schema component for simpler use cases
 */
export const SingleSchema: React.FC<{ schema: object }> = ({ schema }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
);

export default SchemaMarkup;
