// taken from https://github.com/firebase/firebase-tools/blob/master/src/mcp/util.ts

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";
import { dump } from "js-yaml";
import { platform } from "os";

/**
 * Converts data to a CallToolResult.
 */
export function toContent(
  data: any,
  options?: {
    format?: "json" | "yaml";
    contentPrefix?: string;
    contentSuffix?: string;
  }
): CallToolResult {
  if (typeof data === "string")
    return { content: [{ type: "text", text: data }] };

  let text = "";
  const format = options?.format || "yaml"; // use YAML because it's a little more prose-like for the LLM to parse
  switch (format) {
    case "json":
      text = JSON.stringify(data);
      break;
    case "yaml":
      text = dump(data);
      break;
  }
  const prefix = options?.contentPrefix || "";
  const suffix = options?.contentSuffix || "";
  return {
    content: [{ type: "text", text: `${prefix}${text}${suffix}` }],
  };
}

/**
 * Returns an error message to the user.
 */
export function mcpError(
  message: Error | string | unknown,
  code?: string
): CallToolResult {
  let errorMessage = "unknown error";
  if (message instanceof Error) {
    errorMessage = message.message;
  }
  if (typeof message === "string") {
    errorMessage = message;
  }
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: `Error: ${code ? `${code}: ` : ""}${errorMessage}`,
      },
    ],
  };
}

// Helper function to process a single schema node (could be a property schema, items schema, etc.)
// Returns the cleaned schema, or null if the schema becomes invalid and should be removed according to the rules.
// The isRoot parameter is true only for the top-level schema object.
function deepClean(obj: any, isRootLevel: boolean = false): any {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Not a schema object or null, return as is
  }

  // Create a shallow copy to modify
  const cleanedObj = { ...obj };

  // Rule 1: Remove $schema (applies to any level, but typically at root)
  if (cleanedObj.hasOwnProperty("$schema")) {
    delete cleanedObj.$schema;
  }

  // Remove additionalProperties
  if (cleanedObj.hasOwnProperty("additionalProperties")) {
    delete cleanedObj.additionalProperties;
  }

  // Rule 2 & 3: Handle 'type' for "array" (only at root) and "null" (always)
  if (cleanedObj.hasOwnProperty("type")) {
    const currentType = cleanedObj.type;
    if (Array.isArray(currentType)) {
      let filteredTypes = currentType.filter((t: string) => t !== "null");
      if (isRootLevel) {
        filteredTypes = filteredTypes.filter((t: string) => t !== "array");
      }

      if (filteredTypes.length === 0) {
        return null; // Invalid: became typeless or only contained disallowed types
      } else if (filteredTypes.length === 1) {
        cleanedObj.type = filteredTypes[0]; // Simplify to single type
      } else {
        // Convert to anyOf
        delete cleanedObj.type; // Remove the original 'type' array
        cleanedObj.anyOf = filteredTypes
          .map((t: string) => {
            // Each item in anyOf is a schema, so it needs to be an object with a 'type'
            // These sub-schemas are not root level.
            return deepClean({ type: t }, false);
          })
          .filter((subSchema: any) => subSchema !== null); // Filter out any nulls from deepClean

        if (cleanedObj.anyOf.length === 0) {
          return null; // All types in the array led to invalid sub-schemas
        }
        if (cleanedObj.anyOf.length === 1) {
          // If after cleaning, only one valid type remains in anyOf, simplify it
          const singleSchema = cleanedObj.anyOf[0];
          delete cleanedObj.anyOf;
          // Merge the single schema's properties into cleanedObj
          // Most commonly, this will just be setting cleanedObj.type = singleSchema.type
          Object.assign(cleanedObj, singleSchema);
        }
      }
    } else if (typeof currentType === "string") {
      if (currentType === "null") {
        return null; // Invalid: type is "null"
      }
      if (isRootLevel && currentType === "array") {
        return null; // Invalid: top-level type is "array"
      }
      // If not root level, "array" as a string type is allowed.
    }
  }

  // Recursively clean 'properties'
  if (
    cleanedObj.hasOwnProperty("properties") &&
    typeof cleanedObj.properties === "object" &&
    cleanedObj.properties !== null
  ) {
    const newProperties: Record<string, any> = {};
    for (const key in cleanedObj.properties) {
      if (cleanedObj.properties.hasOwnProperty(key)) {
        // Properties are never root level in this recursive call
        const cleanedPropertySchema = deepClean(
          cleanedObj.properties[key],
          false
        );
        if (cleanedPropertySchema !== null) {
          // Only add valid properties
          newProperties[key] = cleanedPropertySchema;
        }
      }
    }
    if (Object.keys(newProperties).length === 0) {
      delete cleanedObj.properties; // Remove 'properties' key if it becomes empty
    } else {
      cleanedObj.properties = newProperties;
    }
  }

  // Recursively clean 'items'
  if (
    cleanedObj.hasOwnProperty("items") &&
    typeof cleanedObj.items === "object" &&
    cleanedObj.items !== null
  ) {
    // 'items' schema is never root level in this recursive call
    const cleanedItemsSchema = deepClean(cleanedObj.items, false);
    if (cleanedItemsSchema === null) {
      delete cleanedObj.items; // Items schema became invalid
    } else {
      cleanedObj.items = cleanedItemsSchema;
    }
  }

  // Recursively clean definitions (e.g., in $defs or definitions)
  const defKeywords = ["$defs", "definitions"];
  for (const keyword of defKeywords) {
    if (
      cleanedObj.hasOwnProperty(keyword) &&
      typeof cleanedObj[keyword] === "object" &&
      cleanedObj[keyword] !== null
    ) {
      const newDefs: Record<string, any> = {};
      for (const defKey in cleanedObj[keyword]) {
        if (cleanedObj[keyword].hasOwnProperty(defKey)) {
          // Definitions are never root level in this recursive call
          const cleanedDef = deepClean(cleanedObj[keyword][defKey], false);
          if (cleanedDef !== null) {
            newDefs[defKey] = cleanedDef;
          }
        }
      }
      if (Object.keys(newDefs).length === 0) {
        delete cleanedObj[keyword];
      } else {
        cleanedObj[keyword] = newDefs;
      }
    }
  }

  // Recursively clean schema arrays like anyOf, allOf, oneOf
  const schemaArrayKeywords = ["anyOf", "allOf", "oneOf"];
  for (const keyword of schemaArrayKeywords) {
    if (
      cleanedObj.hasOwnProperty(keyword) &&
      Array.isArray(cleanedObj[keyword])
    ) {
      const newSchemaArray = cleanedObj[keyword]
        // Sub-schemas in anyOf etc. are not root level in this recursive call
        .map((subSchema: any) => deepClean(subSchema, false))
        .filter((subSchema: any) => subSchema !== null); // Filter out invalid subSchemas

      if (newSchemaArray.length === 0) {
        delete cleanedObj[keyword]; // Remove key if array becomes empty
      } else {
        cleanedObj[keyword] = newSchemaArray;
      }
    }
  }
  return cleanedObj;
}

/** Takes a zodToJsonSchema output and cleans it up to be more compatible with LLM limitations. */
export function cleanSchema(schema: Record<string, any>): Record<string, any> {
  // Initial check for top-level array type before deep cleaning
  if (schema && schema.hasOwnProperty("type")) {
    const topLevelType = schema.type;
    if (topLevelType === "array") {
      return {};
    }
    if (Array.isArray(topLevelType)) {
      const filteredRootTypes = topLevelType.filter(
        (t) => t !== "null" && t !== "array"
      );
      if (filteredRootTypes.length === 0 && topLevelType.includes("array")) {
        // e.g. type: ["array"] or type: ["array", "null"]
        return {};
      }
    }
  }

  const result = deepClean(schema, true); // Pass true for isRootLevel
  return result === null ? {} : result;
}
