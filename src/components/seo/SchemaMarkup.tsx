import React from "react";
import { Helmet } from "react-helmet-async";

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
  if (!schemas || schemas.length === 0) {
    return null;
  }

  // Combine all schemas into a single script to avoid multiple Helmet renders
  const combinedSchema = schemas.length === 1 
    ? JSON.stringify(schemas[0])
    : JSON.stringify(schemas);

  return (
    <Helmet>
      <script type="application/ld+json">{combinedSchema}</script>
    </Helmet>
  );
};

/**
 * Single schema component for simpler use cases
 */
export const SingleSchema: React.FC<{ schema: object }> = ({ schema }) => {
  if (!schema) {
    return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default SchemaMarkup;
