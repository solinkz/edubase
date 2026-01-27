/**
 * Deterministic View Selection Rules
 * 
 * This module provides rule-based logic to automatically select between
 * Table and Summary views based on query result characteristics.
 * 
 * NO AI DECISION-MAKING - All rules are explicit and deterministic.
 */

interface Filter {
  column: string;
  operator: string;
  value: string | number | boolean | (string | number)[] | null;
  logicalOperator?: "AND" | "OR";
}

interface Intent {
  table: string;
  fields?: { column: string; alias?: string }[];
  filters?: Filter[];
  aggregations?: { function: string; column: string; alias?: string }[];
  groupBy?: string[];
  distinct?: boolean;
}

/**
 * Determines the appropriate view type based on query intent and result data.
 * 
 * @param intent - The query intent object
 * @param data - The result data array
 * @returns - The recommended view type
 */
export function determineViewType(intent: Intent, data: Record<string, unknown>[]): "table" | "summary" {
  // RULE 1: If query has aggregations → Summary view
  // Rationale: Aggregated data (COUNT, AVG, SUM, etc.) is better presented
  // as summary statistics rather than raw table rows
  if (intent.aggregations && intent.aggregations.length > 0) {
    return "summary";
  }

  // RULE 2: If query has GROUP BY → Summary view
  // Rationale: Grouped data represents aggregated insights, not individual records
  if (intent.groupBy && intent.groupBy.length > 0) {
    return "summary";
  }

  // RULE 3: If result has very few rows (≤ 3) and multiple columns → Summary view
  // Rationale: Small result sets with multiple metrics are likely summary statistics
  if (data.length <= 3 && data.length > 0) {
    const columnCount = Object.keys(data[0]).length;
    if (columnCount >= 3) {
      return "summary";
    }
  }

  // RULE 4: If result has computed/aliased columns → Summary view
  // Rationale: Aliases like "avg_qpa", "total_students" indicate aggregated metrics
  if (hasComputedColumns(intent)) {
    return "summary";
  }

  // RULE 5: If query uses DISTINCT → Summary view
  // Rationale: DISTINCT queries typically return unique values for analysis
  if (intent.distinct === true) {
    return "summary";
  }

  // DEFAULT: Table view
  // Rationale: Raw data with multiple rows is best displayed in tabular format
  return "table";
}

/**
 * Checks if the intent contains computed/aliased columns.
 * 
 * @param intent - The query intent object
 * @returns - True if computed columns exist
 */
function hasComputedColumns(intent: Intent): boolean {
  // Check if any field has an alias (indicates computed column)
  if (intent.fields) {
    const hasAlias = intent.fields.some(field => field.alias);
    if (hasAlias) return true;
  }

  // Check if any aggregation has an alias
  if (intent.aggregations) {
    const hasAggAlias = intent.aggregations.some(agg => agg.alias);
    if (hasAggAlias) return true;
  }

  return false;
}

/**
 * Generates a human-readable explanation of why a view was selected.
 * Useful for debugging and user transparency.
 * 
 * @param intent - The query intent object
 * @param data - The result data array
 * @returns - Explanation of view selection
 */
export function explainViewSelection(intent: Intent, data: Record<string, unknown>[]): string {
  if (intent.aggregations && intent.aggregations.length > 0) {
    return `Summary view selected: Query contains ${intent.aggregations.length} aggregation(s)`;
  }

  if (intent.groupBy && intent.groupBy.length > 0) {
    return `Summary view selected: Query groups by ${intent.groupBy.join(", ")}`;
  }

  if (data.length <= 3 && data.length > 0) {
    const columnCount = Object.keys(data[0]).length;
    if (columnCount >= 3) {
      return `Summary view selected: Small result set (${data.length} rows) with ${columnCount} columns suggests summary statistics`;
    }
  }

  if (intent.distinct === true) {
    return "Summary view selected: Query uses DISTINCT for unique value analysis";
  }

  return `Table view selected: Query returns ${data.length} individual records`;
}

/**
 * Example usage and test cases
 */
export const VIEW_SELECTION_EXAMPLES = {
  // Example 1: Aggregation query → Summary
  aggregationQuery: {
    intent: {
      table: "students",
      fields: [{ column: "country" }],
      aggregations: [
        { function: "AVG", column: "qpa", alias: "avg_qpa" },
        { function: "COUNT", column: "*", alias: "total" }
      ],
      groupBy: ["country"]
    },
    expectedView: "summary",
    reason: "Contains aggregations and GROUP BY"
  },

  // Example 2: Simple filter query → Table
  simpleQuery: {
    intent: {
      table: "students",
      fields: [
        { column: "name" },
        { column: "qpa" },
        { column: "country" }
      ],
      filters: [
        { column: "country", operator: "=", value: "Canada" }
      ]
    },
    expectedView: "table",
    reason: "Returns individual student records"
  },

  // Example 3: DISTINCT query → Summary
  distinctQuery: {
    intent: {
      table: "students",
      fields: [{ column: "country" }],
      distinct: true
    },
    expectedView: "summary",
    reason: "Uses DISTINCT for unique values"
  },

  // Example 4: Small aggregated result → Summary
  smallAggregateResult: {
    intent: {
      table: "students",
      aggregations: [
        { function: "COUNT", column: "*", alias: "total_students" },
        { function: "AVG", column: "qpa", alias: "average_qpa" }
      ]
    },
    data: [{ total_students: 100, average_qpa: 3.2 }],
    expectedView: "summary",
    reason: "Single row with aggregate statistics"
  }
};
