import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "../schemas/schema_contract.json"), "utf8"));

/**
 * Validates an intent object against the schema contract.
 * @param {Object} intent - The intent object to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateIntent(intent) {
  const errors = [];

  // Validate table exists
  if (!schema.tables[intent.table]) {
    errors.push(`Table '${intent.table}' does not exist in schema`);
    return { valid: false, errors };
  }

  const tableSchema = schema.tables[intent.table];
  const validColumns = Object.keys(tableSchema.columns);

  // Validate fields
  if (!intent.fields || intent.fields.length === 0) {
    errors.push("Fields array is required and cannot be empty");
  } else {
    intent.fields.forEach((field, idx) => {
      if (field.column !== "*" && !validColumns.includes(field.column)) {
        errors.push(`Invalid column '${field.column}' in fields[${idx}]`);
      }
    });
  }

  // Validate filters
  if (intent.filters) {
    intent.filters.forEach((filter, idx) => {
      if (!validColumns.includes(filter.column)) {
        errors.push(`Invalid column '${filter.column}' in filters[${idx}]`);
      }
      
      // Validate operator matches column type
      const columnMeta = tableSchema.columns[filter.column];
      if (columnMeta) {
        const columnType = columnMeta.type;
        
        // LIKE only for strings
        if (filter.operator === "LIKE" && columnType !== "string") {
          errors.push(`LIKE operator not valid for ${columnType} column '${filter.column}'`);
        }
        
        // Numeric comparisons only for numbers/integers
        if ([">", ">=", "<", "<="].includes(filter.operator) && !["number", "integer", "date"].includes(columnType)) {
          errors.push(`Operator '${filter.operator}' not valid for ${columnType} column '${filter.column}'`);
        }
      }
    });
  }

  // Validate aggregations
  if (intent.aggregations) {
    intent.aggregations.forEach((agg, idx) => {
      if (agg.column !== "*" && !validColumns.includes(agg.column)) {
        errors.push(`Invalid column '${agg.column}' in aggregations[${idx}]`);
      }
      
      // Validate numeric aggregations
      if (["SUM", "AVG"].includes(agg.function)) {
        const columnMeta = tableSchema.columns[agg.column];
        if (columnMeta && !["number", "integer"].includes(columnMeta.type)) {
          errors.push(`${agg.function} requires numeric column, got '${agg.column}' (${columnMeta.type})`);
        }
      }
    });
  }

  // Validate groupBy columns
  if (intent.groupBy) {
    intent.groupBy.forEach((col, idx) => {
      if (!validColumns.includes(col)) {
        errors.push(`Invalid column '${col}' in groupBy[${idx}]`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Translates a validated intent object into a safe SQL query with parameters.
 * @param {Object} intent - The validated intent object
 * @returns {Object} - { sql: string, params: any[] }
 */
export function intentToSQL(intent) {
  const params = [];
  let sql = "";

  // SELECT clause
  if (intent.distinct) {
    sql = "SELECT DISTINCT ";
  } else {
    sql = "SELECT ";
  }

  const selectParts = [];

  // Add regular fields
  if (intent.fields) {
    intent.fields.forEach((field) => {
      if (field.column === "*") {
        selectParts.push("*");
      } else if (field.alias) {
        selectParts.push(`${field.column} AS ${field.alias}`);
      } else {
        selectParts.push(field.column);
      }
    });
  }

  // Add aggregations
  if (intent.aggregations) {
    intent.aggregations.forEach((agg) => {
      let aggStr;
      if (agg.function === "COUNT_DISTINCT") {
        aggStr = `COUNT(DISTINCT ${agg.column})`;
      } else {
        aggStr = `${agg.function}(${agg.column})`;
      }
      
      if (agg.alias) {
        aggStr += ` AS ${agg.alias}`;
      }
      
      selectParts.push(aggStr);
    });
  }

  sql += selectParts.join(", ");

  // FROM clause
  sql += ` FROM ${intent.table}`;

  // WHERE clause
  if (intent.filters && intent.filters.length > 0) {
    const whereParts = [];
    
    intent.filters.forEach((filter, idx) => {
      let condition;
      
      if (filter.operator === "IS NULL" || filter.operator === "IS NOT NULL") {
        condition = `${filter.column} ${filter.operator}`;
      } else if (filter.operator === "IN") {
        const placeholders = filter.value.map(() => "?").join(", ");
        condition = `${filter.column} IN (${placeholders})`;
        params.push(...filter.value);
      } else if (filter.operator === "BETWEEN") {
        condition = `${filter.column} BETWEEN ? AND ?`;
        params.push(filter.value[0], filter.value[1]);
      } else if (filter.operator === "LIKE") {
        condition = `${filter.column} LIKE ?`;
        params.push(filter.value);
      } else {
        condition = `${filter.column} ${filter.operator} ?`;
        params.push(filter.value);
      }
      
      // Add logical operator
      if (idx > 0) {
        const logicalOp = intent.filters[idx - 1].logicalOperator || "AND";
        whereParts.push(logicalOp);
      }
      
      whereParts.push(condition);
    });
    
    sql += " WHERE " + whereParts.join(" ");
  }

  // GROUP BY clause
  if (intent.groupBy && intent.groupBy.length > 0) {
    sql += " GROUP BY " + intent.groupBy.join(", ");
  }

  // ORDER BY clause
  if (intent.orderBy && intent.orderBy.length > 0) {
    const orderParts = intent.orderBy.map((order) => {
      return `${order.column} ${order.direction || "ASC"}`;
    });
    sql += " ORDER BY " + orderParts.join(", ");
  }

  // LIMIT clause
  if (intent.limit) {
    sql += ` LIMIT ${intent.limit}`;
  }

  // OFFSET clause
  if (intent.offset) {
    sql += ` OFFSET ${intent.offset}`;
  }

  return { sql, params };
}

/**
 * Main function to convert intent to SQL with validation.
 * @param {Object} intent - The intent object
 * @returns {Object} - { success: boolean, sql?: string, params?: any[], error?: string }
 */
export function buildQuery(intent) {
  // Validate intent
  const validation = validateIntent(intent);
  
  if (!validation.valid) {
    return {
      success: false,
      error: `Intent validation failed: ${validation.errors.join("; ")}`
    };
  }

  // Generate SQL
  try {
    const { sql, params } = intentToSQL(intent);
    return {
      success: true,
      sql,
      params
    };
  } catch (error) {
    return {
      success: false,
      error: `SQL generation failed: ${error.message}`
    };
  }
}
