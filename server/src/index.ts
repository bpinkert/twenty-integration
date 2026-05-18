#!/usr/bin/env node
/**
 * MCP Server generated from OpenAPI spec for twenty-mcp vv0.1
 * Generated on: 2026-05-18T01:05:49.930Z
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

/**
 * Type definition for JSON objects
 */
type JsonObject = Record<string, any>;

/**
 * Interface for MCP Tool Definition
 */
interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
}

/**
 * Server configuration
 */
export const SERVER_NAME = "twenty-mcp";
export const SERVER_VERSION = "v0.1";
// Base URL for the API, can be set via environment variable or determined from OpenAPI spec
export const API_BASE_URL = process.env.API_BASE_URL || "http://192.168.50.193:3000/rest";
console.error("API_BASE_URL is set to:", API_BASE_URL);

/**
 * MCP Server instance
 */
const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
);

/**
 * Map of tool definitions by name
 */
const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["GetOpenApiSchema", {
    name: "GetOpenApiSchema",
    description: `Get Open Api Schema`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/open-api/core",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyAttachments", {
    name: "findManyAttachments",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **attachments**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/attachments",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneAttachment", {
    name: "createOneAttachment",
    description: `Create One attachment`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"Attachment name"},"file":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Attachment file"},"fullPath":{"type":"string","description":"Attachment full path"},"fileCategory":{"type":"string","enum":["ARCHIVE","AUDIO","IMAGE","PRESENTATION","SPREADSHEET","TEXT_DOCUMENT","VIDEO","OTHER"],"description":"Attachment file category"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Attachment record position"},"targetTaskId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/attachments",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyAttachments", {
    name: "deleteManyAttachments",
    description: `Delete Many attachments`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/attachments",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyAttachments", {
    name: "updateManyAttachments",
    description: `Update Many attachments`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"Attachment name"},"file":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Attachment file"},"fullPath":{"type":"string","description":"Attachment full path"},"fileCategory":{"type":"string","enum":["ARCHIVE","AUDIO","IMAGE","PRESENTATION","SPREADSHEET","TEXT_DOCUMENT","VIDEO","OTHER"],"description":"Attachment file category"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Attachment record position"},"targetTaskId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/attachments",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyAttachments", {
    name: "createManyAttachments",
    description: `Create Many attachments`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"An attachment","properties":{"name":{"type":"string","description":"Attachment name"},"file":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Attachment file"},"fullPath":{"type":"string","description":"Attachment full path"},"fileCategory":{"type":"string","enum":["ARCHIVE","AUDIO","IMAGE","PRESENTATION","SPREADSHEET","TEXT_DOCUMENT","VIDEO","OTHER"],"description":"Attachment file category"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Attachment record position"},"targetTaskId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/attachments",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneAttachment", {
    name: "findOneAttachment",
    description: `**depth** can be provided to request your **attachment**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/attachments/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneAttachment", {
    name: "deleteOneAttachment",
    description: `Delete One attachment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/attachments/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneAttachment", {
    name: "UpdateOneAttachment",
    description: `Update One attachment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"Attachment name"},"file":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Attachment file"},"fullPath":{"type":"string","description":"Attachment full path"},"fileCategory":{"type":"string","enum":["ARCHIVE","AUDIO","IMAGE","PRESENTATION","SPREADSHEET","TEXT_DOCUMENT","VIDEO","OTHER"],"description":"Attachment file category"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Attachment record position"},"targetTaskId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/attachments/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findAttachmentDuplicates", {
    name: "findAttachmentDuplicates",
    description: `**depth** can be provided to request your **attachment**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"An attachment","properties":{"name":{"type":"string","description":"Attachment name"},"file":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Attachment file"},"fullPath":{"type":"string","description":"Attachment full path"},"fileCategory":{"type":"string","enum":["ARCHIVE","AUDIO","IMAGE","PRESENTATION","SPREADSHEET","TEXT_DOCUMENT","VIDEO","OTHER"],"description":"Attachment file category"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Attachment record position"},"targetTaskId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/attachments/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneAttachment", {
    name: "restoreOneAttachment",
    description: `Restore One attachment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/attachments/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyAttachments", {
    name: "restoreManyAttachments",
    description: `Restore Many attachments`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/attachments",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyAttachments", {
    name: "mergeManyAttachments",
    description: `Merge Many attachments`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/attachments/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByAttachments", {
    name: "groupByAttachments",
    description: `Groups **attachments** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/attachments/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyBlocklists", {
    name: "findManyBlocklists",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **blocklists**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/blocklists",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneBlocklist", {
    name: "createOneBlocklist",
    description: `Create One blocklist`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Blocklist record position"},"handle":{"type":"string","description":"Handle"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["workspaceMember"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/blocklists",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyBlocklists", {
    name: "deleteManyBlocklists",
    description: `Delete Many blocklists`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/blocklists",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyBlocklists", {
    name: "updateManyBlocklists",
    description: `Update Many blocklists`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Blocklist record position"},"handle":{"type":"string","description":"Handle"},"workspaceMemberId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/blocklists",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyBlocklists", {
    name: "createManyBlocklists",
    description: `Create Many blocklists`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Blocklist","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Blocklist record position"},"handle":{"type":"string","description":"Handle"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["workspaceMember"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/blocklists",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneBlocklist", {
    name: "findOneBlocklist",
    description: `**depth** can be provided to request your **blocklist**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/blocklists/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneBlocklist", {
    name: "deleteOneBlocklist",
    description: `Delete One blocklist`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/blocklists/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneBlocklist", {
    name: "UpdateOneBlocklist",
    description: `Update One blocklist`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Blocklist record position"},"handle":{"type":"string","description":"Handle"},"workspaceMemberId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/blocklists/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findBlocklistDuplicates", {
    name: "findBlocklistDuplicates",
    description: `**depth** can be provided to request your **blocklist**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Blocklist","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Blocklist record position"},"handle":{"type":"string","description":"Handle"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["workspaceMember"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/blocklists/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneBlocklist", {
    name: "restoreOneBlocklist",
    description: `Restore One blocklist`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/blocklists/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyBlocklists", {
    name: "restoreManyBlocklists",
    description: `Restore Many blocklists`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/blocklists",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyBlocklists", {
    name: "mergeManyBlocklists",
    description: `Merge Many blocklists`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/blocklists/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByBlocklists", {
    name: "groupByBlocklists",
    description: `Groups **blocklists** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/blocklists/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyCalendarChannelEventAssociations", {
    name: "findManyCalendarChannelEventAssociations",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **calendarChannelEventAssociations**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/calendarChannelEventAssociations",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneCalendarChannelEventAssociation", {
    name: "createOneCalendarChannelEventAssociation",
    description: `Create One calendarChannelEventAssociation`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel event association record position"},"eventExternalId":{"type":"string","description":"Event external ID"},"recurringEventExternalId":{"type":"string","description":"Recurring Event ID"},"calendarChannelId":{"type":"string","format":"uuid","description":"Channel ID"},"calendarEventId":{"type":"string","format":"uuid"}},"required":["calendarChannelId","calendarEvent"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarChannelEventAssociations",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyCalendarChannelEventAssociations", {
    name: "deleteManyCalendarChannelEventAssociations",
    description: `Delete Many calendarChannelEventAssociations`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/calendarChannelEventAssociations",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyCalendarChannelEventAssociations", {
    name: "updateManyCalendarChannelEventAssociations",
    description: `Update Many calendarChannelEventAssociations`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel event association record position"},"eventExternalId":{"type":"string","description":"Event external ID"},"recurringEventExternalId":{"type":"string","description":"Recurring Event ID"},"calendarChannelId":{"type":"string","format":"uuid","description":"Channel ID"},"calendarEventId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarChannelEventAssociations",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyCalendarChannelEventAssociations", {
    name: "createManyCalendarChannelEventAssociations",
    description: `Create Many calendarChannelEventAssociations`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Calendar Channel Event Associations","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel event association record position"},"eventExternalId":{"type":"string","description":"Event external ID"},"recurringEventExternalId":{"type":"string","description":"Recurring Event ID"},"calendarChannelId":{"type":"string","format":"uuid","description":"Channel ID"},"calendarEventId":{"type":"string","format":"uuid"}},"required":["calendarChannelId","calendarEvent"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/calendarChannelEventAssociations",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneCalendarChannelEventAssociation", {
    name: "findOneCalendarChannelEventAssociation",
    description: `**depth** can be provided to request your **calendarChannelEventAssociation**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/calendarChannelEventAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneCalendarChannelEventAssociation", {
    name: "deleteOneCalendarChannelEventAssociation",
    description: `Delete One calendarChannelEventAssociation`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/calendarChannelEventAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneCalendarChannelEventAssociation", {
    name: "UpdateOneCalendarChannelEventAssociation",
    description: `Update One calendarChannelEventAssociation`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel event association record position"},"eventExternalId":{"type":"string","description":"Event external ID"},"recurringEventExternalId":{"type":"string","description":"Recurring Event ID"},"calendarChannelId":{"type":"string","format":"uuid","description":"Channel ID"},"calendarEventId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/calendarChannelEventAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findCalendarChannelEventAssociationDuplicates", {
    name: "findCalendarChannelEventAssociationDuplicates",
    description: `**depth** can be provided to request your **calendarChannelEventAssociation**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Calendar Channel Event Associations","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel event association record position"},"eventExternalId":{"type":"string","description":"Event external ID"},"recurringEventExternalId":{"type":"string","description":"Recurring Event ID"},"calendarChannelId":{"type":"string","format":"uuid","description":"Channel ID"},"calendarEventId":{"type":"string","format":"uuid"}},"required":["calendarChannelId","calendarEvent"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarChannelEventAssociations/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneCalendarChannelEventAssociation", {
    name: "restoreOneCalendarChannelEventAssociation",
    description: `Restore One calendarChannelEventAssociation`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/calendarChannelEventAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyCalendarChannelEventAssociations", {
    name: "restoreManyCalendarChannelEventAssociations",
    description: `Restore Many calendarChannelEventAssociations`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/calendarChannelEventAssociations",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyCalendarChannelEventAssociations", {
    name: "mergeManyCalendarChannelEventAssociations",
    description: `Merge Many calendarChannelEventAssociations`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarChannelEventAssociations/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByCalendarChannelEventAssociations", {
    name: "groupByCalendarChannelEventAssociations",
    description: `Groups **calendarChannelEventAssociations** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/calendarChannelEventAssociations/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyCalendarChannels", {
    name: "findManyCalendarChannels",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **calendarChannels**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/calendarChannels",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneCalendarChannel", {
    name: "createOneCalendarChannel",
    description: `Create One calendarChannel`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel record position"},"handle":{"type":"string","description":"Handle"},"visibility":{"type":"string","enum":["METADATA","SHARE_EVERYTHING"],"description":"Visibility"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["AS_PARTICIPANT_AND_ORGANIZER","AS_PARTICIPANT","AS_ORGANIZER","NONE"],"description":"Automatically create records for people you participated with in an event."},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Sync Cursor. Used for syncing events from the calendar provider"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["CALENDAR_EVENT_LIST_FETCH_PENDING","CALENDAR_EVENT_LIST_FETCH_SCHEDULED","CALENDAR_EVENT_LIST_FETCH_ONGOING","CALENDAR_EVENTS_IMPORT_PENDING","CALENDAR_EVENTS_IMPORT_SCHEDULED","CALENDAR_EVENTS_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"connectedAccountId":{"type":"string","format":"uuid"}},"required":["connectedAccount"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarChannels",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyCalendarChannels", {
    name: "deleteManyCalendarChannels",
    description: `Delete Many calendarChannels`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/calendarChannels",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyCalendarChannels", {
    name: "updateManyCalendarChannels",
    description: `Update Many calendarChannels`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel record position"},"handle":{"type":"string","description":"Handle"},"visibility":{"type":"string","enum":["METADATA","SHARE_EVERYTHING"],"description":"Visibility"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["AS_PARTICIPANT_AND_ORGANIZER","AS_PARTICIPANT","AS_ORGANIZER","NONE"],"description":"Automatically create records for people you participated with in an event."},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Sync Cursor. Used for syncing events from the calendar provider"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["CALENDAR_EVENT_LIST_FETCH_PENDING","CALENDAR_EVENT_LIST_FETCH_SCHEDULED","CALENDAR_EVENT_LIST_FETCH_ONGOING","CALENDAR_EVENTS_IMPORT_PENDING","CALENDAR_EVENTS_IMPORT_SCHEDULED","CALENDAR_EVENTS_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"connectedAccountId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarChannels",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyCalendarChannels", {
    name: "createManyCalendarChannels",
    description: `Create Many calendarChannels`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Calendar Channels","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel record position"},"handle":{"type":"string","description":"Handle"},"visibility":{"type":"string","enum":["METADATA","SHARE_EVERYTHING"],"description":"Visibility"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["AS_PARTICIPANT_AND_ORGANIZER","AS_PARTICIPANT","AS_ORGANIZER","NONE"],"description":"Automatically create records for people you participated with in an event."},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Sync Cursor. Used for syncing events from the calendar provider"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["CALENDAR_EVENT_LIST_FETCH_PENDING","CALENDAR_EVENT_LIST_FETCH_SCHEDULED","CALENDAR_EVENT_LIST_FETCH_ONGOING","CALENDAR_EVENTS_IMPORT_PENDING","CALENDAR_EVENTS_IMPORT_SCHEDULED","CALENDAR_EVENTS_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"connectedAccountId":{"type":"string","format":"uuid"}},"required":["connectedAccount"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/calendarChannels",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneCalendarChannel", {
    name: "findOneCalendarChannel",
    description: `**depth** can be provided to request your **calendarChannel**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/calendarChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneCalendarChannel", {
    name: "deleteOneCalendarChannel",
    description: `Delete One calendarChannel`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/calendarChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneCalendarChannel", {
    name: "UpdateOneCalendarChannel",
    description: `Update One calendarChannel`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel record position"},"handle":{"type":"string","description":"Handle"},"visibility":{"type":"string","enum":["METADATA","SHARE_EVERYTHING"],"description":"Visibility"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["AS_PARTICIPANT_AND_ORGANIZER","AS_PARTICIPANT","AS_ORGANIZER","NONE"],"description":"Automatically create records for people you participated with in an event."},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Sync Cursor. Used for syncing events from the calendar provider"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["CALENDAR_EVENT_LIST_FETCH_PENDING","CALENDAR_EVENT_LIST_FETCH_SCHEDULED","CALENDAR_EVENT_LIST_FETCH_ONGOING","CALENDAR_EVENTS_IMPORT_PENDING","CALENDAR_EVENTS_IMPORT_SCHEDULED","CALENDAR_EVENTS_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"connectedAccountId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/calendarChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findCalendarChannelDuplicates", {
    name: "findCalendarChannelDuplicates",
    description: `**depth** can be provided to request your **calendarChannel**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Calendar Channels","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar channel record position"},"handle":{"type":"string","description":"Handle"},"visibility":{"type":"string","enum":["METADATA","SHARE_EVERYTHING"],"description":"Visibility"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["AS_PARTICIPANT_AND_ORGANIZER","AS_PARTICIPANT","AS_ORGANIZER","NONE"],"description":"Automatically create records for people you participated with in an event."},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Sync Cursor. Used for syncing events from the calendar provider"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["CALENDAR_EVENT_LIST_FETCH_PENDING","CALENDAR_EVENT_LIST_FETCH_SCHEDULED","CALENDAR_EVENT_LIST_FETCH_ONGOING","CALENDAR_EVENTS_IMPORT_PENDING","CALENDAR_EVENTS_IMPORT_SCHEDULED","CALENDAR_EVENTS_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"connectedAccountId":{"type":"string","format":"uuid"}},"required":["connectedAccount"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarChannels/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneCalendarChannel", {
    name: "restoreOneCalendarChannel",
    description: `Restore One calendarChannel`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/calendarChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyCalendarChannels", {
    name: "restoreManyCalendarChannels",
    description: `Restore Many calendarChannels`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/calendarChannels",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyCalendarChannels", {
    name: "mergeManyCalendarChannels",
    description: `Merge Many calendarChannels`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarChannels/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByCalendarChannels", {
    name: "groupByCalendarChannels",
    description: `Groups **calendarChannels** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/calendarChannels/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyCalendarEventParticipants", {
    name: "findManyCalendarEventParticipants",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **calendarEventParticipants**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/calendarEventParticipants",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneCalendarEventParticipant", {
    name: "createOneCalendarEventParticipant",
    description: `Create One calendarEventParticipant`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event participant record position"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"isOrganizer":{"type":"boolean","description":"Is Organizer"},"responseStatus":{"type":"string","enum":["NEEDS_ACTION","DECLINED","TENTATIVE","ACCEPTED"],"description":"Response Status"},"calendarEventId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["calendarEvent"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarEventParticipants",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyCalendarEventParticipants", {
    name: "deleteManyCalendarEventParticipants",
    description: `Delete Many calendarEventParticipants`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/calendarEventParticipants",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyCalendarEventParticipants", {
    name: "updateManyCalendarEventParticipants",
    description: `Update Many calendarEventParticipants`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event participant record position"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"isOrganizer":{"type":"boolean","description":"Is Organizer"},"responseStatus":{"type":"string","enum":["NEEDS_ACTION","DECLINED","TENTATIVE","ACCEPTED"],"description":"Response Status"},"calendarEventId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarEventParticipants",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyCalendarEventParticipants", {
    name: "createManyCalendarEventParticipants",
    description: `Create Many calendarEventParticipants`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Calendar event participants","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event participant record position"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"isOrganizer":{"type":"boolean","description":"Is Organizer"},"responseStatus":{"type":"string","enum":["NEEDS_ACTION","DECLINED","TENTATIVE","ACCEPTED"],"description":"Response Status"},"calendarEventId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["calendarEvent"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/calendarEventParticipants",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneCalendarEventParticipant", {
    name: "findOneCalendarEventParticipant",
    description: `**depth** can be provided to request your **calendarEventParticipant**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/calendarEventParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneCalendarEventParticipant", {
    name: "deleteOneCalendarEventParticipant",
    description: `Delete One calendarEventParticipant`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/calendarEventParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneCalendarEventParticipant", {
    name: "UpdateOneCalendarEventParticipant",
    description: `Update One calendarEventParticipant`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event participant record position"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"isOrganizer":{"type":"boolean","description":"Is Organizer"},"responseStatus":{"type":"string","enum":["NEEDS_ACTION","DECLINED","TENTATIVE","ACCEPTED"],"description":"Response Status"},"calendarEventId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/calendarEventParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findCalendarEventParticipantDuplicates", {
    name: "findCalendarEventParticipantDuplicates",
    description: `**depth** can be provided to request your **calendarEventParticipant**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Calendar event participants","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event participant record position"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"isOrganizer":{"type":"boolean","description":"Is Organizer"},"responseStatus":{"type":"string","enum":["NEEDS_ACTION","DECLINED","TENTATIVE","ACCEPTED"],"description":"Response Status"},"calendarEventId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["calendarEvent"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarEventParticipants/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneCalendarEventParticipant", {
    name: "restoreOneCalendarEventParticipant",
    description: `Restore One calendarEventParticipant`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/calendarEventParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyCalendarEventParticipants", {
    name: "restoreManyCalendarEventParticipants",
    description: `Restore Many calendarEventParticipants`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/calendarEventParticipants",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyCalendarEventParticipants", {
    name: "mergeManyCalendarEventParticipants",
    description: `Merge Many calendarEventParticipants`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarEventParticipants/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByCalendarEventParticipants", {
    name: "groupByCalendarEventParticipants",
    description: `Groups **calendarEventParticipants** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/calendarEventParticipants/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyCalendarEvents", {
    name: "findManyCalendarEvents",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **calendarEvents**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/calendarEvents",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneCalendarEvent", {
    name: "createOneCalendarEvent",
    description: `Create One calendarEvent`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"isCanceled":{"type":"boolean","description":"Is canceled"},"isFullDay":{"type":"boolean","description":"Is Full Day"},"startsAt":{"type":"string","format":"date-time","description":"Start Date"},"endsAt":{"type":"string","format":"date-time","description":"End Date"},"externalCreatedAt":{"type":"string","format":"date-time","description":"Creation DateTime"},"externalUpdatedAt":{"type":"string","format":"date-time","description":"Update DateTime"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event record position"},"title":{"type":"string","description":"Title"},"description":{"type":"string","description":"Description"},"location":{"type":"string","description":"Location"},"iCalUid":{"type":"string","description":"iCal UID"},"conferenceSolution":{"type":"string","description":"Conference Solution"},"conferenceLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Meet Link"}},"required":["calendarChannelEventAssociations","calendarEventParticipants"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarEvents",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyCalendarEvents", {
    name: "deleteManyCalendarEvents",
    description: `Delete Many calendarEvents`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/calendarEvents",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyCalendarEvents", {
    name: "updateManyCalendarEvents",
    description: `Update Many calendarEvents`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"isCanceled":{"type":"boolean","description":"Is canceled"},"isFullDay":{"type":"boolean","description":"Is Full Day"},"startsAt":{"type":"string","format":"date-time","description":"Start Date"},"endsAt":{"type":"string","format":"date-time","description":"End Date"},"externalCreatedAt":{"type":"string","format":"date-time","description":"Creation DateTime"},"externalUpdatedAt":{"type":"string","format":"date-time","description":"Update DateTime"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event record position"},"title":{"type":"string","description":"Title"},"description":{"type":"string","description":"Description"},"location":{"type":"string","description":"Location"},"iCalUid":{"type":"string","description":"iCal UID"},"conferenceSolution":{"type":"string","description":"Conference Solution"},"conferenceLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Meet Link"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarEvents",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyCalendarEvents", {
    name: "createManyCalendarEvents",
    description: `Create Many calendarEvents`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Calendar events","properties":{"isCanceled":{"type":"boolean","description":"Is canceled"},"isFullDay":{"type":"boolean","description":"Is Full Day"},"startsAt":{"type":"string","format":"date-time","description":"Start Date"},"endsAt":{"type":"string","format":"date-time","description":"End Date"},"externalCreatedAt":{"type":"string","format":"date-time","description":"Creation DateTime"},"externalUpdatedAt":{"type":"string","format":"date-time","description":"Update DateTime"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event record position"},"title":{"type":"string","description":"Title"},"description":{"type":"string","description":"Description"},"location":{"type":"string","description":"Location"},"iCalUid":{"type":"string","description":"iCal UID"},"conferenceSolution":{"type":"string","description":"Conference Solution"},"conferenceLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Meet Link"}},"required":["calendarChannelEventAssociations","calendarEventParticipants"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/calendarEvents",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneCalendarEvent", {
    name: "findOneCalendarEvent",
    description: `**depth** can be provided to request your **calendarEvent**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/calendarEvents/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneCalendarEvent", {
    name: "deleteOneCalendarEvent",
    description: `Delete One calendarEvent`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/calendarEvents/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneCalendarEvent", {
    name: "UpdateOneCalendarEvent",
    description: `Update One calendarEvent`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"isCanceled":{"type":"boolean","description":"Is canceled"},"isFullDay":{"type":"boolean","description":"Is Full Day"},"startsAt":{"type":"string","format":"date-time","description":"Start Date"},"endsAt":{"type":"string","format":"date-time","description":"End Date"},"externalCreatedAt":{"type":"string","format":"date-time","description":"Creation DateTime"},"externalUpdatedAt":{"type":"string","format":"date-time","description":"Update DateTime"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event record position"},"title":{"type":"string","description":"Title"},"description":{"type":"string","description":"Description"},"location":{"type":"string","description":"Location"},"iCalUid":{"type":"string","description":"iCal UID"},"conferenceSolution":{"type":"string","description":"Conference Solution"},"conferenceLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Meet Link"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/calendarEvents/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findCalendarEventDuplicates", {
    name: "findCalendarEventDuplicates",
    description: `**depth** can be provided to request your **calendarEvent**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Calendar events","properties":{"isCanceled":{"type":"boolean","description":"Is canceled"},"isFullDay":{"type":"boolean","description":"Is Full Day"},"startsAt":{"type":"string","format":"date-time","description":"Start Date"},"endsAt":{"type":"string","format":"date-time","description":"End Date"},"externalCreatedAt":{"type":"string","format":"date-time","description":"Creation DateTime"},"externalUpdatedAt":{"type":"string","format":"date-time","description":"Update DateTime"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Calendar event record position"},"title":{"type":"string","description":"Title"},"description":{"type":"string","description":"Description"},"location":{"type":"string","description":"Location"},"iCalUid":{"type":"string","description":"iCal UID"},"conferenceSolution":{"type":"string","description":"Conference Solution"},"conferenceLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Meet Link"}},"required":["calendarChannelEventAssociations","calendarEventParticipants"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/calendarEvents/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneCalendarEvent", {
    name: "restoreOneCalendarEvent",
    description: `Restore One calendarEvent`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/calendarEvents/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyCalendarEvents", {
    name: "restoreManyCalendarEvents",
    description: `Restore Many calendarEvents`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/calendarEvents",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyCalendarEvents", {
    name: "mergeManyCalendarEvents",
    description: `Merge Many calendarEvents`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/calendarEvents/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByCalendarEvents", {
    name: "groupByCalendarEvents",
    description: `Groups **calendarEvents** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/calendarEvents/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyCompanies", {
    name: "findManyCompanies",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **companies**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/companies",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneCompany", {
    name: "createOneCompany",
    description: `Create One company`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The company name"},"domainName":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company website URL. We use this url to fetch the company icon"},"address":{"type":"object","properties":{"addressStreet1":{"type":"string"},"addressStreet2":{"type":"string"},"addressCity":{"type":"string"},"addressPostcode":{"type":"string"},"addressState":{"type":"string"},"addressCountry":{"type":"string"},"addressLat":{"type":"number"},"addressLng":{"type":"number"}},"description":"Address of the company"},"employees":{"type":"number","description":"Number of employees in the company"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Twitter/X account"},"annualRecurringRevenue":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Annual Recurring Revenue: The actual or estimated annual revenue of the company"},"idealCustomerProfile":{"type":"boolean","description":"Ideal Customer Profile: Indicates whether the company is the most suitable and valuable customer for you"},"position":{"type":"number","description":"Company record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"accountOwnerId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/companies",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyCompanies", {
    name: "deleteManyCompanies",
    description: `Delete Many companies`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/companies",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyCompanies", {
    name: "updateManyCompanies",
    description: `Update Many companies`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The company name"},"domainName":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company website URL. We use this url to fetch the company icon"},"address":{"type":"object","properties":{"addressStreet1":{"type":"string"},"addressStreet2":{"type":"string"},"addressCity":{"type":"string"},"addressPostcode":{"type":"string"},"addressState":{"type":"string"},"addressCountry":{"type":"string"},"addressLat":{"type":"number"},"addressLng":{"type":"number"}},"description":"Address of the company"},"employees":{"type":"number","description":"Number of employees in the company"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Twitter/X account"},"annualRecurringRevenue":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Annual Recurring Revenue: The actual or estimated annual revenue of the company"},"idealCustomerProfile":{"type":"boolean","description":"Ideal Customer Profile: Indicates whether the company is the most suitable and valuable customer for you"},"position":{"type":"number","description":"Company record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"accountOwnerId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/companies",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyCompanies", {
    name: "createManyCompanies",
    description: `Create Many companies`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A company","properties":{"name":{"type":"string","description":"The company name"},"domainName":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company website URL. We use this url to fetch the company icon"},"address":{"type":"object","properties":{"addressStreet1":{"type":"string"},"addressStreet2":{"type":"string"},"addressCity":{"type":"string"},"addressPostcode":{"type":"string"},"addressState":{"type":"string"},"addressCountry":{"type":"string"},"addressLat":{"type":"number"},"addressLng":{"type":"number"}},"description":"Address of the company"},"employees":{"type":"number","description":"Number of employees in the company"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Twitter/X account"},"annualRecurringRevenue":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Annual Recurring Revenue: The actual or estimated annual revenue of the company"},"idealCustomerProfile":{"type":"boolean","description":"Ideal Customer Profile: Indicates whether the company is the most suitable and valuable customer for you"},"position":{"type":"number","description":"Company record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"accountOwnerId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/companies",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneCompany", {
    name: "findOneCompany",
    description: `**depth** can be provided to request your **company**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/companies/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneCompany", {
    name: "deleteOneCompany",
    description: `Delete One company`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/companies/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneCompany", {
    name: "UpdateOneCompany",
    description: `Update One company`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The company name"},"domainName":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company website URL. We use this url to fetch the company icon"},"address":{"type":"object","properties":{"addressStreet1":{"type":"string"},"addressStreet2":{"type":"string"},"addressCity":{"type":"string"},"addressPostcode":{"type":"string"},"addressState":{"type":"string"},"addressCountry":{"type":"string"},"addressLat":{"type":"number"},"addressLng":{"type":"number"}},"description":"Address of the company"},"employees":{"type":"number","description":"Number of employees in the company"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Twitter/X account"},"annualRecurringRevenue":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Annual Recurring Revenue: The actual or estimated annual revenue of the company"},"idealCustomerProfile":{"type":"boolean","description":"Ideal Customer Profile: Indicates whether the company is the most suitable and valuable customer for you"},"position":{"type":"number","description":"Company record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"accountOwnerId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/companies/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findCompanyDuplicates", {
    name: "findCompanyDuplicates",
    description: `**depth** can be provided to request your **company**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A company","properties":{"name":{"type":"string","description":"The company name"},"domainName":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company website URL. We use this url to fetch the company icon"},"address":{"type":"object","properties":{"addressStreet1":{"type":"string"},"addressStreet2":{"type":"string"},"addressCity":{"type":"string"},"addressPostcode":{"type":"string"},"addressState":{"type":"string"},"addressCountry":{"type":"string"},"addressLat":{"type":"number"},"addressLng":{"type":"number"}},"description":"Address of the company"},"employees":{"type":"number","description":"Number of employees in the company"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"The company Twitter/X account"},"annualRecurringRevenue":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Annual Recurring Revenue: The actual or estimated annual revenue of the company"},"idealCustomerProfile":{"type":"boolean","description":"Ideal Customer Profile: Indicates whether the company is the most suitable and valuable customer for you"},"position":{"type":"number","description":"Company record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"accountOwnerId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/companies/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneCompany", {
    name: "restoreOneCompany",
    description: `Restore One company`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/companies/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyCompanies", {
    name: "restoreManyCompanies",
    description: `Restore Many companies`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/companies",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyCompanies", {
    name: "mergeManyCompanies",
    description: `Merge Many companies`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/companies/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByCompanies", {
    name: "groupByCompanies",
    description: `Groups **companies** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/companies/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyConnectedAccounts", {
    name: "findManyConnectedAccounts",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **connectedAccounts**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/connectedAccounts",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneConnectedAccount", {
    name: "createOneConnectedAccount",
    description: `Create One connectedAccount`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Connected account record position"},"handle":{"type":"string","description":"The account handle (email, username, phone number, etc.)"},"provider":{"type":"string","description":"The account provider"},"accessToken":{"type":"string","description":"Messaging provider access token"},"refreshToken":{"type":"string","description":"Messaging provider refresh token"},"lastSyncHistoryId":{"type":"string","description":"Last sync history ID"},"authFailedAt":{"type":"string","format":"date-time","description":"Auth failed at"},"lastCredentialsRefreshedAt":{"type":"string","format":"date-time","description":"Last credentials refreshed at"},"handleAliases":{"type":"string","description":"Handle Aliases"},"scopes":{"type":"array","items":{"type":"string"},"description":"Scopes"},"connectionParameters":{"type":"object","description":"JSON object containing custom connection parameters"},"accountOwnerId":{"type":"string","format":"uuid"}},"required":["calendarChannels","accountOwner","messageChannels"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/connectedAccounts",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyConnectedAccounts", {
    name: "deleteManyConnectedAccounts",
    description: `Delete Many connectedAccounts`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/connectedAccounts",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyConnectedAccounts", {
    name: "updateManyConnectedAccounts",
    description: `Update Many connectedAccounts`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Connected account record position"},"handle":{"type":"string","description":"The account handle (email, username, phone number, etc.)"},"provider":{"type":"string","description":"The account provider"},"accessToken":{"type":"string","description":"Messaging provider access token"},"refreshToken":{"type":"string","description":"Messaging provider refresh token"},"lastSyncHistoryId":{"type":"string","description":"Last sync history ID"},"authFailedAt":{"type":"string","format":"date-time","description":"Auth failed at"},"lastCredentialsRefreshedAt":{"type":"string","format":"date-time","description":"Last credentials refreshed at"},"handleAliases":{"type":"string","description":"Handle Aliases"},"scopes":{"type":"array","items":{"type":"string"},"description":"Scopes"},"connectionParameters":{"type":"object","description":"JSON object containing custom connection parameters"},"accountOwnerId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/connectedAccounts",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyConnectedAccounts", {
    name: "createManyConnectedAccounts",
    description: `Create Many connectedAccounts`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A connected account","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Connected account record position"},"handle":{"type":"string","description":"The account handle (email, username, phone number, etc.)"},"provider":{"type":"string","description":"The account provider"},"accessToken":{"type":"string","description":"Messaging provider access token"},"refreshToken":{"type":"string","description":"Messaging provider refresh token"},"lastSyncHistoryId":{"type":"string","description":"Last sync history ID"},"authFailedAt":{"type":"string","format":"date-time","description":"Auth failed at"},"lastCredentialsRefreshedAt":{"type":"string","format":"date-time","description":"Last credentials refreshed at"},"handleAliases":{"type":"string","description":"Handle Aliases"},"scopes":{"type":"array","items":{"type":"string"},"description":"Scopes"},"connectionParameters":{"type":"object","description":"JSON object containing custom connection parameters"},"accountOwnerId":{"type":"string","format":"uuid"}},"required":["calendarChannels","accountOwner","messageChannels"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/connectedAccounts",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneConnectedAccount", {
    name: "findOneConnectedAccount",
    description: `**depth** can be provided to request your **connectedAccount**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/connectedAccounts/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneConnectedAccount", {
    name: "deleteOneConnectedAccount",
    description: `Delete One connectedAccount`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/connectedAccounts/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneConnectedAccount", {
    name: "UpdateOneConnectedAccount",
    description: `Update One connectedAccount`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Connected account record position"},"handle":{"type":"string","description":"The account handle (email, username, phone number, etc.)"},"provider":{"type":"string","description":"The account provider"},"accessToken":{"type":"string","description":"Messaging provider access token"},"refreshToken":{"type":"string","description":"Messaging provider refresh token"},"lastSyncHistoryId":{"type":"string","description":"Last sync history ID"},"authFailedAt":{"type":"string","format":"date-time","description":"Auth failed at"},"lastCredentialsRefreshedAt":{"type":"string","format":"date-time","description":"Last credentials refreshed at"},"handleAliases":{"type":"string","description":"Handle Aliases"},"scopes":{"type":"array","items":{"type":"string"},"description":"Scopes"},"connectionParameters":{"type":"object","description":"JSON object containing custom connection parameters"},"accountOwnerId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/connectedAccounts/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findConnectedAccountDuplicates", {
    name: "findConnectedAccountDuplicates",
    description: `**depth** can be provided to request your **connectedAccount**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A connected account","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Connected account record position"},"handle":{"type":"string","description":"The account handle (email, username, phone number, etc.)"},"provider":{"type":"string","description":"The account provider"},"accessToken":{"type":"string","description":"Messaging provider access token"},"refreshToken":{"type":"string","description":"Messaging provider refresh token"},"lastSyncHistoryId":{"type":"string","description":"Last sync history ID"},"authFailedAt":{"type":"string","format":"date-time","description":"Auth failed at"},"lastCredentialsRefreshedAt":{"type":"string","format":"date-time","description":"Last credentials refreshed at"},"handleAliases":{"type":"string","description":"Handle Aliases"},"scopes":{"type":"array","items":{"type":"string"},"description":"Scopes"},"connectionParameters":{"type":"object","description":"JSON object containing custom connection parameters"},"accountOwnerId":{"type":"string","format":"uuid"}},"required":["calendarChannels","accountOwner","messageChannels"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/connectedAccounts/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneConnectedAccount", {
    name: "restoreOneConnectedAccount",
    description: `Restore One connectedAccount`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/connectedAccounts/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyConnectedAccounts", {
    name: "restoreManyConnectedAccounts",
    description: `Restore Many connectedAccounts`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/connectedAccounts",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyConnectedAccounts", {
    name: "mergeManyConnectedAccounts",
    description: `Merge Many connectedAccounts`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/connectedAccounts/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByConnectedAccounts", {
    name: "groupByConnectedAccounts",
    description: `Groups **connectedAccounts** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/connectedAccounts/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyDashboards", {
    name: "findManyDashboards",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **dashboards**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/dashboards",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneDashboard", {
    name: "createOneDashboard",
    description: `Create One dashboard`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"title":{"type":"string","description":"Dashboard title"},"position":{"type":"number","description":"Dashboard record Position"},"pageLayoutId":{"type":"string","format":"uuid","description":"Dashboard page layout"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/dashboards",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyDashboards", {
    name: "deleteManyDashboards",
    description: `Delete Many dashboards`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/dashboards",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyDashboards", {
    name: "updateManyDashboards",
    description: `Update Many dashboards`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"title":{"type":"string","description":"Dashboard title"},"position":{"type":"number","description":"Dashboard record Position"},"pageLayoutId":{"type":"string","format":"uuid","description":"Dashboard page layout"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/dashboards",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyDashboards", {
    name: "createManyDashboards",
    description: `Create Many dashboards`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A dashboard","properties":{"title":{"type":"string","description":"Dashboard title"},"position":{"type":"number","description":"Dashboard record Position"},"pageLayoutId":{"type":"string","format":"uuid","description":"Dashboard page layout"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/dashboards",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneDashboard", {
    name: "findOneDashboard",
    description: `**depth** can be provided to request your **dashboard**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/dashboards/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneDashboard", {
    name: "deleteOneDashboard",
    description: `Delete One dashboard`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/dashboards/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneDashboard", {
    name: "UpdateOneDashboard",
    description: `Update One dashboard`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"title":{"type":"string","description":"Dashboard title"},"position":{"type":"number","description":"Dashboard record Position"},"pageLayoutId":{"type":"string","format":"uuid","description":"Dashboard page layout"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/dashboards/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findDashboardDuplicates", {
    name: "findDashboardDuplicates",
    description: `**depth** can be provided to request your **dashboard**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A dashboard","properties":{"title":{"type":"string","description":"Dashboard title"},"position":{"type":"number","description":"Dashboard record Position"},"pageLayoutId":{"type":"string","format":"uuid","description":"Dashboard page layout"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/dashboards/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneDashboard", {
    name: "restoreOneDashboard",
    description: `Restore One dashboard`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/dashboards/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyDashboards", {
    name: "restoreManyDashboards",
    description: `Restore Many dashboards`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/dashboards",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyDashboards", {
    name: "mergeManyDashboards",
    description: `Merge Many dashboards`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/dashboards/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByDashboards", {
    name: "groupByDashboards",
    description: `Groups **dashboards** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/dashboards/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyMessageChannelMessageAssociationMessageFolders", {
    name: "findManyMessageChannelMessageAssociationMessageFolders",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **messageChannelMessageAssociationMessageFolders**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneMessageChannelMessageAssociationMessageFolder", {
    name: "createOneMessageChannelMessageAssociationMessageFolder",
    description: `Create One messageChannelMessageAssociationMessageFolder`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"messageFolderId":{"type":"string","format":"uuid","description":"Message Folder"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association message folder record position"},"messageChannelMessageAssociationId":{"type":"string","format":"uuid"}},"required":["messageFolderId","messageChannelMessageAssociation"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyMessageChannelMessageAssociationMessageFolders", {
    name: "deleteManyMessageChannelMessageAssociationMessageFolders",
    description: `Delete Many messageChannelMessageAssociationMessageFolders`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyMessageChannelMessageAssociationMessageFolders", {
    name: "updateManyMessageChannelMessageAssociationMessageFolders",
    description: `Update Many messageChannelMessageAssociationMessageFolders`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"messageFolderId":{"type":"string","format":"uuid","description":"Message Folder"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association message folder record position"},"messageChannelMessageAssociationId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyMessageChannelMessageAssociationMessageFolders", {
    name: "createManyMessageChannelMessageAssociationMessageFolders",
    description: `Create Many messageChannelMessageAssociationMessageFolders`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Join table linking message channel message associations to message folders","properties":{"messageFolderId":{"type":"string","format":"uuid","description":"Message Folder"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association message folder record position"},"messageChannelMessageAssociationId":{"type":"string","format":"uuid"}},"required":["messageFolderId","messageChannelMessageAssociation"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/messageChannelMessageAssociationMessageFolders",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneMessageChannelMessageAssociationMessageFolder", {
    name: "findOneMessageChannelMessageAssociationMessageFolder",
    description: `**depth** can be provided to request your **messageChannelMessageAssociationMessageFolder**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneMessageChannelMessageAssociationMessageFolder", {
    name: "deleteOneMessageChannelMessageAssociationMessageFolder",
    description: `Delete One messageChannelMessageAssociationMessageFolder`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneMessageChannelMessageAssociationMessageFolder", {
    name: "UpdateOneMessageChannelMessageAssociationMessageFolder",
    description: `Update One messageChannelMessageAssociationMessageFolder`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"messageFolderId":{"type":"string","format":"uuid","description":"Message Folder"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association message folder record position"},"messageChannelMessageAssociationId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findMessageChannelMessageAssociationMessageFolderDuplicates", {
    name: "findMessageChannelMessageAssociationMessageFolderDuplicates",
    description: `**depth** can be provided to request your **messageChannelMessageAssociationMessageFolder**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Join table linking message channel message associations to message folders","properties":{"messageFolderId":{"type":"string","format":"uuid","description":"Message Folder"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association message folder record position"},"messageChannelMessageAssociationId":{"type":"string","format":"uuid"}},"required":["messageFolderId","messageChannelMessageAssociation"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneMessageChannelMessageAssociationMessageFolder", {
    name: "restoreOneMessageChannelMessageAssociationMessageFolder",
    description: `Restore One messageChannelMessageAssociationMessageFolder`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/messageChannelMessageAssociationMessageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyMessageChannelMessageAssociationMessageFolders", {
    name: "restoreManyMessageChannelMessageAssociationMessageFolders",
    description: `Restore Many messageChannelMessageAssociationMessageFolders`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/messageChannelMessageAssociationMessageFolders",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyMessageChannelMessageAssociationMessageFolders", {
    name: "mergeManyMessageChannelMessageAssociationMessageFolders",
    description: `Merge Many messageChannelMessageAssociationMessageFolders`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByMessageChannelMessageAssociationMessageFolders", {
    name: "groupByMessageChannelMessageAssociationMessageFolders",
    description: `Groups **messageChannelMessageAssociationMessageFolders** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/messageChannelMessageAssociationMessageFolders/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyMessageChannelMessageAssociations", {
    name: "findManyMessageChannelMessageAssociations",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **messageChannelMessageAssociations**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/messageChannelMessageAssociations",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneMessageChannelMessageAssociation", {
    name: "createOneMessageChannelMessageAssociation",
    description: `Create One messageChannelMessageAssociation`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association record position"},"messageExternalId":{"type":"string","description":"Message id from the messaging provider"},"messageThreadExternalId":{"type":"string","description":"Thread id from the messaging provider"},"direction":{"type":"string","enum":["INCOMING","OUTGOING"],"description":"Message Direction"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel Id"},"messageId":{"type":"string","format":"uuid"},"messageThreadId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageChannelMessageAssociations",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyMessageChannelMessageAssociations", {
    name: "deleteManyMessageChannelMessageAssociations",
    description: `Delete Many messageChannelMessageAssociations`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/messageChannelMessageAssociations",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyMessageChannelMessageAssociations", {
    name: "updateManyMessageChannelMessageAssociations",
    description: `Update Many messageChannelMessageAssociations`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association record position"},"messageExternalId":{"type":"string","description":"Message id from the messaging provider"},"messageThreadExternalId":{"type":"string","description":"Thread id from the messaging provider"},"direction":{"type":"string","enum":["INCOMING","OUTGOING"],"description":"Message Direction"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel Id"},"messageId":{"type":"string","format":"uuid"},"messageThreadId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannelMessageAssociations",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyMessageChannelMessageAssociations", {
    name: "createManyMessageChannelMessageAssociations",
    description: `Create Many messageChannelMessageAssociations`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Message Synced with a Message Channel","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association record position"},"messageExternalId":{"type":"string","description":"Message id from the messaging provider"},"messageThreadExternalId":{"type":"string","description":"Thread id from the messaging provider"},"direction":{"type":"string","enum":["INCOMING","OUTGOING"],"description":"Message Direction"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel Id"},"messageId":{"type":"string","format":"uuid"},"messageThreadId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/messageChannelMessageAssociations",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneMessageChannelMessageAssociation", {
    name: "findOneMessageChannelMessageAssociation",
    description: `**depth** can be provided to request your **messageChannelMessageAssociation**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/messageChannelMessageAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneMessageChannelMessageAssociation", {
    name: "deleteOneMessageChannelMessageAssociation",
    description: `Delete One messageChannelMessageAssociation`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/messageChannelMessageAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneMessageChannelMessageAssociation", {
    name: "UpdateOneMessageChannelMessageAssociation",
    description: `Update One messageChannelMessageAssociation`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association record position"},"messageExternalId":{"type":"string","description":"Message id from the messaging provider"},"messageThreadExternalId":{"type":"string","description":"Thread id from the messaging provider"},"direction":{"type":"string","enum":["INCOMING","OUTGOING"],"description":"Message Direction"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel Id"},"messageId":{"type":"string","format":"uuid"},"messageThreadId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannelMessageAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findMessageChannelMessageAssociationDuplicates", {
    name: "findMessageChannelMessageAssociationDuplicates",
    description: `**depth** can be provided to request your **messageChannelMessageAssociation**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Message Synced with a Message Channel","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message channel message association record position"},"messageExternalId":{"type":"string","description":"Message id from the messaging provider"},"messageThreadExternalId":{"type":"string","description":"Thread id from the messaging provider"},"direction":{"type":"string","enum":["INCOMING","OUTGOING"],"description":"Message Direction"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel Id"},"messageId":{"type":"string","format":"uuid"},"messageThreadId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageChannelMessageAssociations/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneMessageChannelMessageAssociation", {
    name: "restoreOneMessageChannelMessageAssociation",
    description: `Restore One messageChannelMessageAssociation`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/messageChannelMessageAssociations/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyMessageChannelMessageAssociations", {
    name: "restoreManyMessageChannelMessageAssociations",
    description: `Restore Many messageChannelMessageAssociations`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/messageChannelMessageAssociations",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyMessageChannelMessageAssociations", {
    name: "mergeManyMessageChannelMessageAssociations",
    description: `Merge Many messageChannelMessageAssociations`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannelMessageAssociations/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByMessageChannelMessageAssociations", {
    name: "groupByMessageChannelMessageAssociations",
    description: `Groups **messageChannelMessageAssociations** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/messageChannelMessageAssociations/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyMessageChannels", {
    name: "findManyMessageChannels",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **messageChannels**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/messageChannels",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneMessageChannel", {
    name: "createOneMessageChannel",
    description: `Create One messageChannel`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Channel record position"},"visibility":{"type":"string","enum":["METADATA","SUBJECT","SHARE_EVERYTHING"],"description":"Visibility"},"handle":{"type":"string","description":"Handle"},"type":{"type":"string","enum":["EMAIL","SMS","EMAIL_GROUP"],"description":"Channel Type"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["SENT_AND_RECEIVED","SENT","NONE"],"description":"Automatically create People records when receiving or sending emails"},"messageFolderImportPolicy":{"type":"string","enum":["ALL_FOLDERS","SELECTED_FOLDERS"],"description":"Message folder import policy"},"excludeNonProfessionalEmails":{"type":"boolean","description":"Exclude non professional emails"},"excludeGroupEmails":{"type":"boolean","description":"Exclude group emails"},"pendingGroupEmailsAction":{"type":"string","enum":["GROUP_EMAILS_DELETION","GROUP_EMAILS_IMPORT","NONE"],"description":"Pending action for group emails"},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Last sync cursor"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["MESSAGE_LIST_FETCH_PENDING","MESSAGE_LIST_FETCH_SCHEDULED","MESSAGE_LIST_FETCH_ONGOING","MESSAGES_IMPORT_PENDING","MESSAGES_IMPORT_SCHEDULED","MESSAGES_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"throttleRetryAfter":{"type":"string","format":"date-time","description":"Throttle Retry After"},"connectedAccountId":{"type":"string","format":"uuid"}},"required":["connectedAccount"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageChannels",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyMessageChannels", {
    name: "deleteManyMessageChannels",
    description: `Delete Many messageChannels`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/messageChannels",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyMessageChannels", {
    name: "updateManyMessageChannels",
    description: `Update Many messageChannels`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Channel record position"},"visibility":{"type":"string","enum":["METADATA","SUBJECT","SHARE_EVERYTHING"],"description":"Visibility"},"handle":{"type":"string","description":"Handle"},"type":{"type":"string","enum":["EMAIL","SMS","EMAIL_GROUP"],"description":"Channel Type"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["SENT_AND_RECEIVED","SENT","NONE"],"description":"Automatically create People records when receiving or sending emails"},"messageFolderImportPolicy":{"type":"string","enum":["ALL_FOLDERS","SELECTED_FOLDERS"],"description":"Message folder import policy"},"excludeNonProfessionalEmails":{"type":"boolean","description":"Exclude non professional emails"},"excludeGroupEmails":{"type":"boolean","description":"Exclude group emails"},"pendingGroupEmailsAction":{"type":"string","enum":["GROUP_EMAILS_DELETION","GROUP_EMAILS_IMPORT","NONE"],"description":"Pending action for group emails"},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Last sync cursor"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["MESSAGE_LIST_FETCH_PENDING","MESSAGE_LIST_FETCH_SCHEDULED","MESSAGE_LIST_FETCH_ONGOING","MESSAGES_IMPORT_PENDING","MESSAGES_IMPORT_SCHEDULED","MESSAGES_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"throttleRetryAfter":{"type":"string","format":"date-time","description":"Throttle Retry After"},"connectedAccountId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannels",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyMessageChannels", {
    name: "createManyMessageChannels",
    description: `Create Many messageChannels`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Message Channels","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Channel record position"},"visibility":{"type":"string","enum":["METADATA","SUBJECT","SHARE_EVERYTHING"],"description":"Visibility"},"handle":{"type":"string","description":"Handle"},"type":{"type":"string","enum":["EMAIL","SMS","EMAIL_GROUP"],"description":"Channel Type"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["SENT_AND_RECEIVED","SENT","NONE"],"description":"Automatically create People records when receiving or sending emails"},"messageFolderImportPolicy":{"type":"string","enum":["ALL_FOLDERS","SELECTED_FOLDERS"],"description":"Message folder import policy"},"excludeNonProfessionalEmails":{"type":"boolean","description":"Exclude non professional emails"},"excludeGroupEmails":{"type":"boolean","description":"Exclude group emails"},"pendingGroupEmailsAction":{"type":"string","enum":["GROUP_EMAILS_DELETION","GROUP_EMAILS_IMPORT","NONE"],"description":"Pending action for group emails"},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Last sync cursor"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["MESSAGE_LIST_FETCH_PENDING","MESSAGE_LIST_FETCH_SCHEDULED","MESSAGE_LIST_FETCH_ONGOING","MESSAGES_IMPORT_PENDING","MESSAGES_IMPORT_SCHEDULED","MESSAGES_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"throttleRetryAfter":{"type":"string","format":"date-time","description":"Throttle Retry After"},"connectedAccountId":{"type":"string","format":"uuid"}},"required":["connectedAccount"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/messageChannels",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneMessageChannel", {
    name: "findOneMessageChannel",
    description: `**depth** can be provided to request your **messageChannel**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/messageChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneMessageChannel", {
    name: "deleteOneMessageChannel",
    description: `Delete One messageChannel`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/messageChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneMessageChannel", {
    name: "UpdateOneMessageChannel",
    description: `Update One messageChannel`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Channel record position"},"visibility":{"type":"string","enum":["METADATA","SUBJECT","SHARE_EVERYTHING"],"description":"Visibility"},"handle":{"type":"string","description":"Handle"},"type":{"type":"string","enum":["EMAIL","SMS","EMAIL_GROUP"],"description":"Channel Type"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["SENT_AND_RECEIVED","SENT","NONE"],"description":"Automatically create People records when receiving or sending emails"},"messageFolderImportPolicy":{"type":"string","enum":["ALL_FOLDERS","SELECTED_FOLDERS"],"description":"Message folder import policy"},"excludeNonProfessionalEmails":{"type":"boolean","description":"Exclude non professional emails"},"excludeGroupEmails":{"type":"boolean","description":"Exclude group emails"},"pendingGroupEmailsAction":{"type":"string","enum":["GROUP_EMAILS_DELETION","GROUP_EMAILS_IMPORT","NONE"],"description":"Pending action for group emails"},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Last sync cursor"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["MESSAGE_LIST_FETCH_PENDING","MESSAGE_LIST_FETCH_SCHEDULED","MESSAGE_LIST_FETCH_ONGOING","MESSAGES_IMPORT_PENDING","MESSAGES_IMPORT_SCHEDULED","MESSAGES_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"throttleRetryAfter":{"type":"string","format":"date-time","description":"Throttle Retry After"},"connectedAccountId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findMessageChannelDuplicates", {
    name: "findMessageChannelDuplicates",
    description: `**depth** can be provided to request your **messageChannel**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Message Channels","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Channel record position"},"visibility":{"type":"string","enum":["METADATA","SUBJECT","SHARE_EVERYTHING"],"description":"Visibility"},"handle":{"type":"string","description":"Handle"},"type":{"type":"string","enum":["EMAIL","SMS","EMAIL_GROUP"],"description":"Channel Type"},"isContactAutoCreationEnabled":{"type":"boolean","description":"Is Contact Auto Creation Enabled"},"contactAutoCreationPolicy":{"type":"string","enum":["SENT_AND_RECEIVED","SENT","NONE"],"description":"Automatically create People records when receiving or sending emails"},"messageFolderImportPolicy":{"type":"string","enum":["ALL_FOLDERS","SELECTED_FOLDERS"],"description":"Message folder import policy"},"excludeNonProfessionalEmails":{"type":"boolean","description":"Exclude non professional emails"},"excludeGroupEmails":{"type":"boolean","description":"Exclude group emails"},"pendingGroupEmailsAction":{"type":"string","enum":["GROUP_EMAILS_DELETION","GROUP_EMAILS_IMPORT","NONE"],"description":"Pending action for group emails"},"isSyncEnabled":{"type":"boolean","description":"Is Sync Enabled"},"syncCursor":{"type":"string","description":"Last sync cursor"},"syncedAt":{"type":"string","format":"date-time","description":"Last sync date"},"syncStatus":{"type":"string","enum":["ONGOING","NOT_SYNCED","ACTIVE","FAILED_INSUFFICIENT_PERMISSIONS","FAILED_UNKNOWN"],"description":"Sync status"},"syncStage":{"type":"string","enum":["MESSAGE_LIST_FETCH_PENDING","MESSAGE_LIST_FETCH_SCHEDULED","MESSAGE_LIST_FETCH_ONGOING","MESSAGES_IMPORT_PENDING","MESSAGES_IMPORT_SCHEDULED","MESSAGES_IMPORT_ONGOING","FAILED","PENDING_CONFIGURATION"],"description":"Sync stage"},"syncStageStartedAt":{"type":"string","format":"date-time","description":"Sync stage started at"},"throttleFailureCount":{"type":"number","description":"Throttle Failure Count"},"throttleRetryAfter":{"type":"string","format":"date-time","description":"Throttle Retry After"},"connectedAccountId":{"type":"string","format":"uuid"}},"required":["connectedAccount"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageChannels/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneMessageChannel", {
    name: "restoreOneMessageChannel",
    description: `Restore One messageChannel`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/messageChannels/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyMessageChannels", {
    name: "restoreManyMessageChannels",
    description: `Restore Many messageChannels`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/messageChannels",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyMessageChannels", {
    name: "mergeManyMessageChannels",
    description: `Merge Many messageChannels`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageChannels/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByMessageChannels", {
    name: "groupByMessageChannels",
    description: `Groups **messageChannels** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/messageChannels/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyMessageFolders", {
    name: "findManyMessageFolders",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **messageFolders**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/messageFolders",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneMessageFolder", {
    name: "createOneMessageFolder",
    description: `Create One messageFolder`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Folder record position"},"name":{"type":"string","description":"Folder name"},"syncCursor":{"type":"string","description":"Sync Cursor"},"isSentFolder":{"type":"boolean","description":"Is Sent Folder"},"isSynced":{"type":"boolean","description":"Is Synced"},"parentFolderId":{"type":"string","description":"Parent Folder ID"},"externalId":{"type":"string","description":"External ID"},"pendingSyncAction":{"type":"string","enum":["FOLDER_DELETION","NONE"],"description":"Pending action for folder sync"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel"}},"required":["messageChannelId"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageFolders",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyMessageFolders", {
    name: "deleteManyMessageFolders",
    description: `Delete Many messageFolders`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/messageFolders",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyMessageFolders", {
    name: "updateManyMessageFolders",
    description: `Update Many messageFolders`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Folder record position"},"name":{"type":"string","description":"Folder name"},"syncCursor":{"type":"string","description":"Sync Cursor"},"isSentFolder":{"type":"boolean","description":"Is Sent Folder"},"isSynced":{"type":"boolean","description":"Is Synced"},"parentFolderId":{"type":"string","description":"Parent Folder ID"},"externalId":{"type":"string","description":"External ID"},"pendingSyncAction":{"type":"string","enum":["FOLDER_DELETION","NONE"],"description":"Pending action for folder sync"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageFolders",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyMessageFolders", {
    name: "createManyMessageFolders",
    description: `Create Many messageFolders`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Message Folders","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Folder record position"},"name":{"type":"string","description":"Folder name"},"syncCursor":{"type":"string","description":"Sync Cursor"},"isSentFolder":{"type":"boolean","description":"Is Sent Folder"},"isSynced":{"type":"boolean","description":"Is Synced"},"parentFolderId":{"type":"string","description":"Parent Folder ID"},"externalId":{"type":"string","description":"External ID"},"pendingSyncAction":{"type":"string","enum":["FOLDER_DELETION","NONE"],"description":"Pending action for folder sync"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel"}},"required":["messageChannelId"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/messageFolders",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneMessageFolder", {
    name: "findOneMessageFolder",
    description: `**depth** can be provided to request your **messageFolder**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/messageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneMessageFolder", {
    name: "deleteOneMessageFolder",
    description: `Delete One messageFolder`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/messageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneMessageFolder", {
    name: "UpdateOneMessageFolder",
    description: `Update One messageFolder`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Folder record position"},"name":{"type":"string","description":"Folder name"},"syncCursor":{"type":"string","description":"Sync Cursor"},"isSentFolder":{"type":"boolean","description":"Is Sent Folder"},"isSynced":{"type":"boolean","description":"Is Synced"},"parentFolderId":{"type":"string","description":"Parent Folder ID"},"externalId":{"type":"string","description":"External ID"},"pendingSyncAction":{"type":"string","enum":["FOLDER_DELETION","NONE"],"description":"Pending action for folder sync"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/messageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findMessageFolderDuplicates", {
    name: "findMessageFolderDuplicates",
    description: `**depth** can be provided to request your **messageFolder**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Message Folders","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Folder record position"},"name":{"type":"string","description":"Folder name"},"syncCursor":{"type":"string","description":"Sync Cursor"},"isSentFolder":{"type":"boolean","description":"Is Sent Folder"},"isSynced":{"type":"boolean","description":"Is Synced"},"parentFolderId":{"type":"string","description":"Parent Folder ID"},"externalId":{"type":"string","description":"External ID"},"pendingSyncAction":{"type":"string","enum":["FOLDER_DELETION","NONE"],"description":"Pending action for folder sync"},"messageChannelId":{"type":"string","format":"uuid","description":"Message Channel"}},"required":["messageChannelId"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageFolders/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneMessageFolder", {
    name: "restoreOneMessageFolder",
    description: `Restore One messageFolder`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/messageFolders/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyMessageFolders", {
    name: "restoreManyMessageFolders",
    description: `Restore Many messageFolders`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/messageFolders",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyMessageFolders", {
    name: "mergeManyMessageFolders",
    description: `Merge Many messageFolders`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageFolders/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByMessageFolders", {
    name: "groupByMessageFolders",
    description: `Groups **messageFolders** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/messageFolders/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyMessageParticipants", {
    name: "findManyMessageParticipants",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **messageParticipants**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/messageParticipants",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneMessageParticipant", {
    name: "createOneMessageParticipant",
    description: `Create One messageParticipant`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Participant record position"},"role":{"type":"string","enum":["FROM","TO","CC","BCC"],"description":"Role"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"messageId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["message"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageParticipants",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyMessageParticipants", {
    name: "deleteManyMessageParticipants",
    description: `Delete Many messageParticipants`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/messageParticipants",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyMessageParticipants", {
    name: "updateManyMessageParticipants",
    description: `Update Many messageParticipants`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Participant record position"},"role":{"type":"string","enum":["FROM","TO","CC","BCC"],"description":"Role"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"messageId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageParticipants",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyMessageParticipants", {
    name: "createManyMessageParticipants",
    description: `Create Many messageParticipants`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Message Participants","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Participant record position"},"role":{"type":"string","enum":["FROM","TO","CC","BCC"],"description":"Role"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"messageId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["message"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/messageParticipants",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneMessageParticipant", {
    name: "findOneMessageParticipant",
    description: `**depth** can be provided to request your **messageParticipant**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/messageParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneMessageParticipant", {
    name: "deleteOneMessageParticipant",
    description: `Delete One messageParticipant`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/messageParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneMessageParticipant", {
    name: "UpdateOneMessageParticipant",
    description: `Update One messageParticipant`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Participant record position"},"role":{"type":"string","enum":["FROM","TO","CC","BCC"],"description":"Role"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"messageId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/messageParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findMessageParticipantDuplicates", {
    name: "findMessageParticipantDuplicates",
    description: `**depth** can be provided to request your **messageParticipant**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Message Participants","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Participant record position"},"role":{"type":"string","enum":["FROM","TO","CC","BCC"],"description":"Role"},"handle":{"type":"string","description":"Handle"},"displayName":{"type":"string","description":"Display Name"},"messageId":{"type":"string","format":"uuid"},"personId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"}},"required":["message"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageParticipants/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneMessageParticipant", {
    name: "restoreOneMessageParticipant",
    description: `Restore One messageParticipant`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/messageParticipants/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyMessageParticipants", {
    name: "restoreManyMessageParticipants",
    description: `Restore Many messageParticipants`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/messageParticipants",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyMessageParticipants", {
    name: "mergeManyMessageParticipants",
    description: `Merge Many messageParticipants`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageParticipants/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByMessageParticipants", {
    name: "groupByMessageParticipants",
    description: `Groups **messageParticipants** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/messageParticipants/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyMessages", {
    name: "findManyMessages",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **messages**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/messages",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneMessage", {
    name: "createOneMessage",
    description: `Create One message`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message record position"},"headerMessageId":{"type":"string","description":"Message id from the message header"},"subject":{"type":"string","description":"Subject"},"text":{"type":"string","description":"Text"},"receivedAt":{"type":"string","format":"date-time","description":"The date the message was received"},"messageThreadId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messages",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyMessages", {
    name: "deleteManyMessages",
    description: `Delete Many messages`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/messages",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyMessages", {
    name: "updateManyMessages",
    description: `Update Many messages`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message record position"},"headerMessageId":{"type":"string","description":"Message id from the message header"},"subject":{"type":"string","description":"Subject"},"text":{"type":"string","description":"Text"},"receivedAt":{"type":"string","format":"date-time","description":"The date the message was received"},"messageThreadId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messages",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyMessages", {
    name: "createManyMessages",
    description: `Create Many messages`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Message","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message record position"},"headerMessageId":{"type":"string","description":"Message id from the message header"},"subject":{"type":"string","description":"Subject"},"text":{"type":"string","description":"Text"},"receivedAt":{"type":"string","format":"date-time","description":"The date the message was received"},"messageThreadId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/messages",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneMessage", {
    name: "findOneMessage",
    description: `**depth** can be provided to request your **message**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/messages/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneMessage", {
    name: "deleteOneMessage",
    description: `Delete One message`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/messages/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneMessage", {
    name: "UpdateOneMessage",
    description: `Update One message`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message record position"},"headerMessageId":{"type":"string","description":"Message id from the message header"},"subject":{"type":"string","description":"Subject"},"text":{"type":"string","description":"Text"},"receivedAt":{"type":"string","format":"date-time","description":"The date the message was received"},"messageThreadId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/messages/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findMessageDuplicates", {
    name: "findMessageDuplicates",
    description: `**depth** can be provided to request your **message**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Message","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message record position"},"headerMessageId":{"type":"string","description":"Message id from the message header"},"subject":{"type":"string","description":"Subject"},"text":{"type":"string","description":"Text"},"receivedAt":{"type":"string","format":"date-time","description":"The date the message was received"},"messageThreadId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messages/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneMessage", {
    name: "restoreOneMessage",
    description: `Restore One message`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/messages/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyMessages", {
    name: "restoreManyMessages",
    description: `Restore Many messages`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/messages",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyMessages", {
    name: "mergeManyMessages",
    description: `Merge Many messages`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messages/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByMessages", {
    name: "groupByMessages",
    description: `Groups **messages** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/messages/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyMessageThreads", {
    name: "findManyMessageThreads",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **messageThreads**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/messageThreads",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneMessageThread", {
    name: "createOneMessageThread",
    description: `Create One messageThread`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Thread record position"},"subject":{"type":"string","description":"Subject"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageThreads",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyMessageThreads", {
    name: "deleteManyMessageThreads",
    description: `Delete Many messageThreads`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/messageThreads",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyMessageThreads", {
    name: "updateManyMessageThreads",
    description: `Update Many messageThreads`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Thread record position"},"subject":{"type":"string","description":"Subject"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageThreads",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyMessageThreads", {
    name: "createManyMessageThreads",
    description: `Create Many messageThreads`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Message Thread","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Thread record position"},"subject":{"type":"string","description":"Subject"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/messageThreads",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneMessageThread", {
    name: "findOneMessageThread",
    description: `**depth** can be provided to request your **messageThread**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/messageThreads/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneMessageThread", {
    name: "deleteOneMessageThread",
    description: `Delete One messageThread`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/messageThreads/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneMessageThread", {
    name: "UpdateOneMessageThread",
    description: `Update One messageThread`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Thread record position"},"subject":{"type":"string","description":"Subject"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/messageThreads/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findMessageThreadDuplicates", {
    name: "findMessageThreadDuplicates",
    description: `**depth** can be provided to request your **messageThread**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Message Thread","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Message Thread record position"},"subject":{"type":"string","description":"Subject"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/messageThreads/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneMessageThread", {
    name: "restoreOneMessageThread",
    description: `Restore One messageThread`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/messageThreads/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyMessageThreads", {
    name: "restoreManyMessageThreads",
    description: `Restore Many messageThreads`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/messageThreads",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyMessageThreads", {
    name: "mergeManyMessageThreads",
    description: `Merge Many messageThreads`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/messageThreads/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByMessageThreads", {
    name: "groupByMessageThreads",
    description: `Groups **messageThreads** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/messageThreads/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyNotes", {
    name: "findManyNotes",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **notes**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/notes",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneNote", {
    name: "createOneNote",
    description: `Create One note`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Note record position"},"title":{"type":"string","description":"Note title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Note body"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/notes",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyNotes", {
    name: "deleteManyNotes",
    description: `Delete Many notes`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/notes",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyNotes", {
    name: "updateManyNotes",
    description: `Update Many notes`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Note record position"},"title":{"type":"string","description":"Note title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Note body"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/notes",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyNotes", {
    name: "createManyNotes",
    description: `Create Many notes`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A note","properties":{"position":{"type":"number","description":"Note record position"},"title":{"type":"string","description":"Note title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Note body"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/notes",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneNote", {
    name: "findOneNote",
    description: `**depth** can be provided to request your **note**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/notes/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneNote", {
    name: "deleteOneNote",
    description: `Delete One note`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/notes/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneNote", {
    name: "UpdateOneNote",
    description: `Update One note`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Note record position"},"title":{"type":"string","description":"Note title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Note body"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/notes/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findNoteDuplicates", {
    name: "findNoteDuplicates",
    description: `**depth** can be provided to request your **note**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A note","properties":{"position":{"type":"number","description":"Note record position"},"title":{"type":"string","description":"Note title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Note body"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/notes/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneNote", {
    name: "restoreOneNote",
    description: `Restore One note`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/notes/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyNotes", {
    name: "restoreManyNotes",
    description: `Restore Many notes`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/notes",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyNotes", {
    name: "mergeManyNotes",
    description: `Merge Many notes`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/notes/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByNotes", {
    name: "groupByNotes",
    description: `Groups **notes** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/notes/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyNoteTargets", {
    name: "findManyNoteTargets",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **noteTargets**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/noteTargets",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneNoteTarget", {
    name: "createOneNoteTarget",
    description: `Create One noteTarget`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"NoteTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"noteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/noteTargets",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyNoteTargets", {
    name: "deleteManyNoteTargets",
    description: `Delete Many noteTargets`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/noteTargets",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyNoteTargets", {
    name: "updateManyNoteTargets",
    description: `Update Many noteTargets`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"NoteTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"noteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/noteTargets",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyNoteTargets", {
    name: "createManyNoteTargets",
    description: `Create Many noteTargets`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A note target","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"NoteTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"noteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/noteTargets",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneNoteTarget", {
    name: "findOneNoteTarget",
    description: `**depth** can be provided to request your **noteTarget**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/noteTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneNoteTarget", {
    name: "deleteOneNoteTarget",
    description: `Delete One noteTarget`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/noteTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneNoteTarget", {
    name: "UpdateOneNoteTarget",
    description: `Update One noteTarget`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"NoteTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"noteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/noteTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findNoteTargetDuplicates", {
    name: "findNoteTargetDuplicates",
    description: `**depth** can be provided to request your **noteTarget**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A note target","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"NoteTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"noteId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/noteTargets/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneNoteTarget", {
    name: "restoreOneNoteTarget",
    description: `Restore One noteTarget`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/noteTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyNoteTargets", {
    name: "restoreManyNoteTargets",
    description: `Restore Many noteTargets`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/noteTargets",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyNoteTargets", {
    name: "mergeManyNoteTargets",
    description: `Merge Many noteTargets`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/noteTargets/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByNoteTargets", {
    name: "groupByNoteTargets",
    description: `Groups **noteTargets** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/noteTargets/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyOpportunities", {
    name: "findManyOpportunities",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **opportunities**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/opportunities",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneOpportunity", {
    name: "createOneOpportunity",
    description: `Create One opportunity`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The opportunity name"},"amount":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Opportunity amount"},"closeDate":{"type":"string","format":"date-time","description":"Opportunity close date"},"stage":{"type":"string","enum":["NEW","SCREENING","MEETING","PROPOSAL","CUSTOMER"],"description":"Opportunity stage"},"position":{"type":"number","description":"Opportunity record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"},"pointOfContactId":{"type":"string","format":"uuid"},"ownerId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/opportunities",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyOpportunities", {
    name: "deleteManyOpportunities",
    description: `Delete Many opportunities`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/opportunities",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyOpportunities", {
    name: "updateManyOpportunities",
    description: `Update Many opportunities`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The opportunity name"},"amount":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Opportunity amount"},"closeDate":{"type":"string","format":"date-time","description":"Opportunity close date"},"stage":{"type":"string","enum":["NEW","SCREENING","MEETING","PROPOSAL","CUSTOMER"],"description":"Opportunity stage"},"position":{"type":"number","description":"Opportunity record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"},"pointOfContactId":{"type":"string","format":"uuid"},"ownerId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/opportunities",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyOpportunities", {
    name: "createManyOpportunities",
    description: `Create Many opportunities`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"An opportunity","properties":{"name":{"type":"string","description":"The opportunity name"},"amount":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Opportunity amount"},"closeDate":{"type":"string","format":"date-time","description":"Opportunity close date"},"stage":{"type":"string","enum":["NEW","SCREENING","MEETING","PROPOSAL","CUSTOMER"],"description":"Opportunity stage"},"position":{"type":"number","description":"Opportunity record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"},"pointOfContactId":{"type":"string","format":"uuid"},"ownerId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/opportunities",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneOpportunity", {
    name: "findOneOpportunity",
    description: `**depth** can be provided to request your **opportunity**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/opportunities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneOpportunity", {
    name: "deleteOneOpportunity",
    description: `Delete One opportunity`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/opportunities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneOpportunity", {
    name: "UpdateOneOpportunity",
    description: `Update One opportunity`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The opportunity name"},"amount":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Opportunity amount"},"closeDate":{"type":"string","format":"date-time","description":"Opportunity close date"},"stage":{"type":"string","enum":["NEW","SCREENING","MEETING","PROPOSAL","CUSTOMER"],"description":"Opportunity stage"},"position":{"type":"number","description":"Opportunity record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"},"pointOfContactId":{"type":"string","format":"uuid"},"ownerId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/opportunities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOpportunityDuplicates", {
    name: "findOpportunityDuplicates",
    description: `**depth** can be provided to request your **opportunity**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"An opportunity","properties":{"name":{"type":"string","description":"The opportunity name"},"amount":{"type":"object","properties":{"amountMicros":{"type":"number"},"currencyCode":{"type":"string"}},"description":"Opportunity amount"},"closeDate":{"type":"string","format":"date-time","description":"Opportunity close date"},"stage":{"type":"string","enum":["NEW","SCREENING","MEETING","PROPOSAL","CUSTOMER"],"description":"Opportunity stage"},"position":{"type":"number","description":"Opportunity record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"},"pointOfContactId":{"type":"string","format":"uuid"},"ownerId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/opportunities/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneOpportunity", {
    name: "restoreOneOpportunity",
    description: `Restore One opportunity`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/opportunities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyOpportunities", {
    name: "restoreManyOpportunities",
    description: `Restore Many opportunities`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/opportunities",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyOpportunities", {
    name: "mergeManyOpportunities",
    description: `Merge Many opportunities`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/opportunities/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByOpportunities", {
    name: "groupByOpportunities",
    description: `Groups **opportunities** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/opportunities/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyPeople", {
    name: "findManyPeople",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **people**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/people",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOnePerson", {
    name: "createOnePerson",
    description: `Create One person`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Contact's name"},"emails":{"type":"object","properties":{"primaryEmail":{"type":"string"},"additionalEmails":{"type":"array","items":{"type":"string","format":"email"}}},"description":"Contact's Emails"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's X/Twitter account"},"jobTitle":{"type":"string","description":"Contact's job title"},"phones":{"properties":{"additionalPhones":{"type":"array","items":{"type":"string"}},"primaryPhoneCountryCode":{"type":"string"},"primaryPhoneCallingCode":{"type":"string"},"primaryPhoneNumber":{"type":"string"}},"type":"object","description":"Contact's phone numbers"},"city":{"type":"string","description":"Contact's city"},"avatarUrl":{"type":"string","description":"Contact's avatar"},"avatarFile":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Contact's avatar file"},"position":{"type":"number","description":"Person record Position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/people",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyPeople", {
    name: "deleteManyPeople",
    description: `Delete Many people`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/people",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyPeople", {
    name: "updateManyPeople",
    description: `Update Many people`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Contact's name"},"emails":{"type":"object","properties":{"primaryEmail":{"type":"string"},"additionalEmails":{"type":"array","items":{"type":"string","format":"email"}}},"description":"Contact's Emails"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's X/Twitter account"},"jobTitle":{"type":"string","description":"Contact's job title"},"phones":{"properties":{"additionalPhones":{"type":"array","items":{"type":"string"}},"primaryPhoneCountryCode":{"type":"string"},"primaryPhoneCallingCode":{"type":"string"},"primaryPhoneNumber":{"type":"string"}},"type":"object","description":"Contact's phone numbers"},"city":{"type":"string","description":"Contact's city"},"avatarUrl":{"type":"string","description":"Contact's avatar"},"avatarFile":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Contact's avatar file"},"position":{"type":"number","description":"Person record Position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/people",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyPeople", {
    name: "createManyPeople",
    description: `Create Many people`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A person","properties":{"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Contact's name"},"emails":{"type":"object","properties":{"primaryEmail":{"type":"string"},"additionalEmails":{"type":"array","items":{"type":"string","format":"email"}}},"description":"Contact's Emails"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's X/Twitter account"},"jobTitle":{"type":"string","description":"Contact's job title"},"phones":{"properties":{"additionalPhones":{"type":"array","items":{"type":"string"}},"primaryPhoneCountryCode":{"type":"string"},"primaryPhoneCallingCode":{"type":"string"},"primaryPhoneNumber":{"type":"string"}},"type":"object","description":"Contact's phone numbers"},"city":{"type":"string","description":"Contact's city"},"avatarUrl":{"type":"string","description":"Contact's avatar"},"avatarFile":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Contact's avatar file"},"position":{"type":"number","description":"Person record Position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/people",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOnePerson", {
    name: "findOnePerson",
    description: `**depth** can be provided to request your **person**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/people/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOnePerson", {
    name: "deleteOnePerson",
    description: `Delete One person`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/people/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOnePerson", {
    name: "UpdateOnePerson",
    description: `Update One person`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Contact's name"},"emails":{"type":"object","properties":{"primaryEmail":{"type":"string"},"additionalEmails":{"type":"array","items":{"type":"string","format":"email"}}},"description":"Contact's Emails"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's X/Twitter account"},"jobTitle":{"type":"string","description":"Contact's job title"},"phones":{"properties":{"additionalPhones":{"type":"array","items":{"type":"string"}},"primaryPhoneCountryCode":{"type":"string"},"primaryPhoneCallingCode":{"type":"string"},"primaryPhoneNumber":{"type":"string"}},"type":"object","description":"Contact's phone numbers"},"city":{"type":"string","description":"Contact's city"},"avatarUrl":{"type":"string","description":"Contact's avatar"},"avatarFile":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Contact's avatar file"},"position":{"type":"number","description":"Person record Position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/people/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findPersonDuplicates", {
    name: "findPersonDuplicates",
    description: `**depth** can be provided to request your **person**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A person","properties":{"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Contact's name"},"emails":{"type":"object","properties":{"primaryEmail":{"type":"string"},"additionalEmails":{"type":"array","items":{"type":"string","format":"email"}}},"description":"Contact's Emails"},"linkedinLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's Linkedin account"},"xLink":{"type":"object","properties":{"primaryLinkLabel":{"type":"string"},"primaryLinkUrl":{"type":"string"},"secondaryLinks":{"type":"array","items":{"type":"object","description":"A secondary link","properties":{"url":{"type":"string","format":"uri"},"label":{"type":"string"}}}}},"description":"Contact's X/Twitter account"},"jobTitle":{"type":"string","description":"Contact's job title"},"phones":{"properties":{"additionalPhones":{"type":"array","items":{"type":"string"}},"primaryPhoneCountryCode":{"type":"string"},"primaryPhoneCallingCode":{"type":"string"},"primaryPhoneNumber":{"type":"string"}},"type":"object","description":"Contact's phone numbers"},"city":{"type":"string","description":"Contact's city"},"avatarUrl":{"type":"string","description":"Contact's avatar"},"avatarFile":{"type":"array","items":{"type":"object","properties":{"fileId":{"type":"string","format":"uuid"},"label":{"type":"string"}}},"description":"Contact's avatar file"},"position":{"type":"number","description":"Person record Position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"companyId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/people/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOnePerson", {
    name: "restoreOnePerson",
    description: `Restore One person`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/people/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyPeople", {
    name: "restoreManyPeople",
    description: `Restore Many people`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/people",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyPeople", {
    name: "mergeManyPeople",
    description: `Merge Many people`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/people/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByPeople", {
    name: "groupByPeople",
    description: `Groups **people** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/people/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyTasks", {
    name: "findManyTasks",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **tasks**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/tasks",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneTask", {
    name: "createOneTask",
    description: `Create One task`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Task record position"},"title":{"type":"string","description":"Task title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Task body"},"dueAt":{"type":"string","format":"date-time","description":"Task due date"},"status":{"type":"string","enum":["TODO","IN_PROGRESS","DONE"],"description":"Task status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"assigneeId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/tasks",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyTasks", {
    name: "deleteManyTasks",
    description: `Delete Many tasks`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/tasks",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyTasks", {
    name: "updateManyTasks",
    description: `Update Many tasks`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Task record position"},"title":{"type":"string","description":"Task title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Task body"},"dueAt":{"type":"string","format":"date-time","description":"Task due date"},"status":{"type":"string","enum":["TODO","IN_PROGRESS","DONE"],"description":"Task status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"assigneeId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/tasks",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyTasks", {
    name: "createManyTasks",
    description: `Create Many tasks`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A task","properties":{"position":{"type":"number","description":"Task record position"},"title":{"type":"string","description":"Task title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Task body"},"dueAt":{"type":"string","format":"date-time","description":"Task due date"},"status":{"type":"string","enum":["TODO","IN_PROGRESS","DONE"],"description":"Task status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"assigneeId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/tasks",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneTask", {
    name: "findOneTask",
    description: `**depth** can be provided to request your **task**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/tasks/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneTask", {
    name: "deleteOneTask",
    description: `Delete One task`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/tasks/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneTask", {
    name: "UpdateOneTask",
    description: `Update One task`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Task record position"},"title":{"type":"string","description":"Task title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Task body"},"dueAt":{"type":"string","format":"date-time","description":"Task due date"},"status":{"type":"string","enum":["TODO","IN_PROGRESS","DONE"],"description":"Task status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"assigneeId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/tasks/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findTaskDuplicates", {
    name: "findTaskDuplicates",
    description: `**depth** can be provided to request your **task**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A task","properties":{"position":{"type":"number","description":"Task record position"},"title":{"type":"string","description":"Task title"},"bodyV2":{"type":"object","properties":{"blocknote":{"type":"string"},"markdown":{"type":"string"}},"description":"Task body"},"dueAt":{"type":"string","format":"date-time","description":"Task due date"},"status":{"type":"string","enum":["TODO","IN_PROGRESS","DONE"],"description":"Task status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"assigneeId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/tasks/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneTask", {
    name: "restoreOneTask",
    description: `Restore One task`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/tasks/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyTasks", {
    name: "restoreManyTasks",
    description: `Restore Many tasks`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/tasks",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyTasks", {
    name: "mergeManyTasks",
    description: `Merge Many tasks`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/tasks/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByTasks", {
    name: "groupByTasks",
    description: `Groups **tasks** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/tasks/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyTaskTargets", {
    name: "findManyTaskTargets",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **taskTargets**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/taskTargets",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneTaskTarget", {
    name: "createOneTaskTarget",
    description: `Create One taskTarget`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"TaskTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"taskId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/taskTargets",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyTaskTargets", {
    name: "deleteManyTaskTargets",
    description: `Delete Many taskTargets`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/taskTargets",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyTaskTargets", {
    name: "updateManyTaskTargets",
    description: `Update Many taskTargets`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"TaskTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"taskId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/taskTargets",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyTaskTargets", {
    name: "createManyTaskTargets",
    description: `Create Many taskTargets`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A task target","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"TaskTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"taskId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/taskTargets",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneTaskTarget", {
    name: "findOneTaskTarget",
    description: `**depth** can be provided to request your **taskTarget**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/taskTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneTaskTarget", {
    name: "deleteOneTaskTarget",
    description: `Delete One taskTarget`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/taskTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneTaskTarget", {
    name: "UpdateOneTaskTarget",
    description: `Update One taskTarget`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"TaskTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"taskId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/taskTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findTaskTargetDuplicates", {
    name: "findTaskTargetDuplicates",
    description: `**depth** can be provided to request your **taskTarget**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A task target","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"TaskTarget record position"},"targetCompanyId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"taskId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/taskTargets/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneTaskTarget", {
    name: "restoreOneTaskTarget",
    description: `Restore One taskTarget`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/taskTargets/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyTaskTargets", {
    name: "restoreManyTaskTargets",
    description: `Restore Many taskTargets`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/taskTargets",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyTaskTargets", {
    name: "mergeManyTaskTargets",
    description: `Merge Many taskTargets`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/taskTargets/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByTaskTargets", {
    name: "groupByTaskTargets",
    description: `Groups **taskTargets** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/taskTargets/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyTimelineActivities", {
    name: "findManyTimelineActivities",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **timelineActivities**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/timelineActivities",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneTimelineActivity", {
    name: "createOneTimelineActivity",
    description: `Create One timelineActivity`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Timeline activity record position"},"happensAt":{"type":"string","format":"date-time","description":"Creation date"},"name":{"type":"string","description":"Event name"},"properties":{"type":"object","description":"Json value for event details"},"linkedRecordCachedName":{"type":"string","description":"Cached record name"},"linkedRecordId":{"type":"string","format":"uuid","description":"Linked Record id"},"linkedObjectMetadataId":{"type":"string","format":"uuid","description":"Linked Object Metadata Id"},"targetCompanyId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetTaskId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"},"targetWorkflowVersionId":{"type":"string","format":"uuid"},"targetWorkflowRunId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/timelineActivities",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyTimelineActivities", {
    name: "deleteManyTimelineActivities",
    description: `Delete Many timelineActivities`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/timelineActivities",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyTimelineActivities", {
    name: "updateManyTimelineActivities",
    description: `Update Many timelineActivities`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Timeline activity record position"},"happensAt":{"type":"string","format":"date-time","description":"Creation date"},"name":{"type":"string","description":"Event name"},"properties":{"type":"object","description":"Json value for event details"},"linkedRecordCachedName":{"type":"string","description":"Cached record name"},"linkedRecordId":{"type":"string","format":"uuid","description":"Linked Record id"},"linkedObjectMetadataId":{"type":"string","format":"uuid","description":"Linked Object Metadata Id"},"targetCompanyId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetTaskId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"},"targetWorkflowVersionId":{"type":"string","format":"uuid"},"targetWorkflowRunId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/timelineActivities",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyTimelineActivities", {
    name: "createManyTimelineActivities",
    description: `Create Many timelineActivities`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"Aggregated / filtered event to be displayed on the timeline","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Timeline activity record position"},"happensAt":{"type":"string","format":"date-time","description":"Creation date"},"name":{"type":"string","description":"Event name"},"properties":{"type":"object","description":"Json value for event details"},"linkedRecordCachedName":{"type":"string","description":"Cached record name"},"linkedRecordId":{"type":"string","format":"uuid","description":"Linked Record id"},"linkedObjectMetadataId":{"type":"string","format":"uuid","description":"Linked Object Metadata Id"},"targetCompanyId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetTaskId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"},"targetWorkflowVersionId":{"type":"string","format":"uuid"},"targetWorkflowRunId":{"type":"string","format":"uuid"}}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/timelineActivities",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneTimelineActivity", {
    name: "findOneTimelineActivity",
    description: `**depth** can be provided to request your **timelineActivity**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/timelineActivities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneTimelineActivity", {
    name: "deleteOneTimelineActivity",
    description: `Delete One timelineActivity`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/timelineActivities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneTimelineActivity", {
    name: "UpdateOneTimelineActivity",
    description: `Update One timelineActivity`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Timeline activity record position"},"happensAt":{"type":"string","format":"date-time","description":"Creation date"},"name":{"type":"string","description":"Event name"},"properties":{"type":"object","description":"Json value for event details"},"linkedRecordCachedName":{"type":"string","description":"Cached record name"},"linkedRecordId":{"type":"string","format":"uuid","description":"Linked Record id"},"linkedObjectMetadataId":{"type":"string","format":"uuid","description":"Linked Object Metadata Id"},"targetCompanyId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetTaskId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"},"targetWorkflowVersionId":{"type":"string","format":"uuid"},"targetWorkflowRunId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/timelineActivities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findTimelineActivityDuplicates", {
    name: "findTimelineActivityDuplicates",
    description: `**depth** can be provided to request your **timelineActivity**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"Aggregated / filtered event to be displayed on the timeline","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"Timeline activity record position"},"happensAt":{"type":"string","format":"date-time","description":"Creation date"},"name":{"type":"string","description":"Event name"},"properties":{"type":"object","description":"Json value for event details"},"linkedRecordCachedName":{"type":"string","description":"Cached record name"},"linkedRecordId":{"type":"string","format":"uuid","description":"Linked Record id"},"linkedObjectMetadataId":{"type":"string","format":"uuid","description":"Linked Object Metadata Id"},"targetCompanyId":{"type":"string","format":"uuid"},"targetDashboardId":{"type":"string","format":"uuid"},"targetNoteId":{"type":"string","format":"uuid"},"targetOpportunityId":{"type":"string","format":"uuid"},"targetPersonId":{"type":"string","format":"uuid"},"targetTaskId":{"type":"string","format":"uuid"},"workspaceMemberId":{"type":"string","format":"uuid"},"targetWorkflowId":{"type":"string","format":"uuid"},"targetWorkflowVersionId":{"type":"string","format":"uuid"},"targetWorkflowRunId":{"type":"string","format":"uuid"}}}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/timelineActivities/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneTimelineActivity", {
    name: "restoreOneTimelineActivity",
    description: `Restore One timelineActivity`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/timelineActivities/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyTimelineActivities", {
    name: "restoreManyTimelineActivities",
    description: `Restore Many timelineActivities`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/timelineActivities",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyTimelineActivities", {
    name: "mergeManyTimelineActivities",
    description: `Merge Many timelineActivities`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/timelineActivities/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByTimelineActivities", {
    name: "groupByTimelineActivities",
    description: `Groups **timelineActivities** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/timelineActivities/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyWorkflowAutomatedTriggers", {
    name: "findManyWorkflowAutomatedTriggers",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **workflowAutomatedTriggers**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/workflowAutomatedTriggers",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneWorkflowAutomatedTrigger", {
    name: "createOneWorkflowAutomatedTrigger",
    description: `Create One workflowAutomatedTrigger`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"WorkflowAutomatedTrigger record position"},"type":{"type":"string","enum":["DATABASE_EVENT","CRON"],"description":"The workflow automated trigger type"},"settings":{"type":"object","description":"The workflow automated trigger settings"},"workflowId":{"type":"string","format":"uuid"}},"required":["settings","workflow"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflowAutomatedTriggers",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyWorkflowAutomatedTriggers", {
    name: "deleteManyWorkflowAutomatedTriggers",
    description: `Delete Many workflowAutomatedTriggers`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/workflowAutomatedTriggers",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyWorkflowAutomatedTriggers", {
    name: "updateManyWorkflowAutomatedTriggers",
    description: `Update Many workflowAutomatedTriggers`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"WorkflowAutomatedTrigger record position"},"type":{"type":"string","enum":["DATABASE_EVENT","CRON"],"description":"The workflow automated trigger type"},"settings":{"type":"object","description":"The workflow automated trigger settings"},"workflowId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflowAutomatedTriggers",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyWorkflowAutomatedTriggers", {
    name: "createManyWorkflowAutomatedTriggers",
    description: `Create Many workflowAutomatedTriggers`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A workflow automated trigger","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"WorkflowAutomatedTrigger record position"},"type":{"type":"string","enum":["DATABASE_EVENT","CRON"],"description":"The workflow automated trigger type"},"settings":{"type":"object","description":"The workflow automated trigger settings"},"workflowId":{"type":"string","format":"uuid"}},"required":["settings","workflow"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/workflowAutomatedTriggers",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneWorkflowAutomatedTrigger", {
    name: "findOneWorkflowAutomatedTrigger",
    description: `**depth** can be provided to request your **workflowAutomatedTrigger**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/workflowAutomatedTriggers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneWorkflowAutomatedTrigger", {
    name: "deleteOneWorkflowAutomatedTrigger",
    description: `Delete One workflowAutomatedTrigger`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/workflowAutomatedTriggers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneWorkflowAutomatedTrigger", {
    name: "UpdateOneWorkflowAutomatedTrigger",
    description: `Update One workflowAutomatedTrigger`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"WorkflowAutomatedTrigger record position"},"type":{"type":"string","enum":["DATABASE_EVENT","CRON"],"description":"The workflow automated trigger type"},"settings":{"type":"object","description":"The workflow automated trigger settings"},"workflowId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/workflowAutomatedTriggers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findWorkflowAutomatedTriggerDuplicates", {
    name: "findWorkflowAutomatedTriggerDuplicates",
    description: `**depth** can be provided to request your **workflowAutomatedTrigger**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A workflow automated trigger","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"position":{"type":"number","description":"WorkflowAutomatedTrigger record position"},"type":{"type":"string","enum":["DATABASE_EVENT","CRON"],"description":"The workflow automated trigger type"},"settings":{"type":"object","description":"The workflow automated trigger settings"},"workflowId":{"type":"string","format":"uuid"}},"required":["settings","workflow"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflowAutomatedTriggers/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneWorkflowAutomatedTrigger", {
    name: "restoreOneWorkflowAutomatedTrigger",
    description: `Restore One workflowAutomatedTrigger`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/workflowAutomatedTriggers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyWorkflowAutomatedTriggers", {
    name: "restoreManyWorkflowAutomatedTriggers",
    description: `Restore Many workflowAutomatedTriggers`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/workflowAutomatedTriggers",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyWorkflowAutomatedTriggers", {
    name: "mergeManyWorkflowAutomatedTriggers",
    description: `Merge Many workflowAutomatedTriggers`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflowAutomatedTriggers/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByWorkflowAutomatedTriggers", {
    name: "groupByWorkflowAutomatedTriggers",
    description: `Groups **workflowAutomatedTriggers** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/workflowAutomatedTriggers/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyWorkflowRuns", {
    name: "findManyWorkflowRuns",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **workflowRuns**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/workflowRuns",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneWorkflowRun", {
    name: "createOneWorkflowRun",
    description: `Create One workflowRun`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"Name of the workflow run"},"enqueuedAt":{"type":"string","format":"date-time","description":"Workflow run enqueued at"},"startedAt":{"type":"string","format":"date-time","description":"Workflow run started at"},"endedAt":{"type":"string","format":"date-time","description":"Workflow run ended at"},"status":{"type":"string","enum":["NOT_STARTED","RUNNING","COMPLETED","FAILED","ENQUEUED","STOPPING","STOPPED"],"description":"Workflow run status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The executor of the workflow"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"state":{"type":"object","description":"State of the workflow run"},"position":{"type":"number","description":"Workflow run position"},"workflowId":{"type":"string","format":"uuid"},"workflowVersionId":{"type":"string","format":"uuid"}},"required":["state","timelineActivities","workflow","workflowVersion"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflowRuns",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyWorkflowRuns", {
    name: "deleteManyWorkflowRuns",
    description: `Delete Many workflowRuns`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/workflowRuns",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyWorkflowRuns", {
    name: "updateManyWorkflowRuns",
    description: `Update Many workflowRuns`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"Name of the workflow run"},"enqueuedAt":{"type":"string","format":"date-time","description":"Workflow run enqueued at"},"startedAt":{"type":"string","format":"date-time","description":"Workflow run started at"},"endedAt":{"type":"string","format":"date-time","description":"Workflow run ended at"},"status":{"type":"string","enum":["NOT_STARTED","RUNNING","COMPLETED","FAILED","ENQUEUED","STOPPING","STOPPED"],"description":"Workflow run status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The executor of the workflow"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"state":{"type":"object","description":"State of the workflow run"},"position":{"type":"number","description":"Workflow run position"},"workflowId":{"type":"string","format":"uuid"},"workflowVersionId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflowRuns",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyWorkflowRuns", {
    name: "createManyWorkflowRuns",
    description: `Create Many workflowRuns`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A workflow run","properties":{"name":{"type":"string","description":"Name of the workflow run"},"enqueuedAt":{"type":"string","format":"date-time","description":"Workflow run enqueued at"},"startedAt":{"type":"string","format":"date-time","description":"Workflow run started at"},"endedAt":{"type":"string","format":"date-time","description":"Workflow run ended at"},"status":{"type":"string","enum":["NOT_STARTED","RUNNING","COMPLETED","FAILED","ENQUEUED","STOPPING","STOPPED"],"description":"Workflow run status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The executor of the workflow"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"state":{"type":"object","description":"State of the workflow run"},"position":{"type":"number","description":"Workflow run position"},"workflowId":{"type":"string","format":"uuid"},"workflowVersionId":{"type":"string","format":"uuid"}},"required":["state","timelineActivities","workflow","workflowVersion"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/workflowRuns",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneWorkflowRun", {
    name: "findOneWorkflowRun",
    description: `**depth** can be provided to request your **workflowRun**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/workflowRuns/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneWorkflowRun", {
    name: "deleteOneWorkflowRun",
    description: `Delete One workflowRun`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/workflowRuns/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneWorkflowRun", {
    name: "UpdateOneWorkflowRun",
    description: `Update One workflowRun`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"Name of the workflow run"},"enqueuedAt":{"type":"string","format":"date-time","description":"Workflow run enqueued at"},"startedAt":{"type":"string","format":"date-time","description":"Workflow run started at"},"endedAt":{"type":"string","format":"date-time","description":"Workflow run ended at"},"status":{"type":"string","enum":["NOT_STARTED","RUNNING","COMPLETED","FAILED","ENQUEUED","STOPPING","STOPPED"],"description":"Workflow run status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The executor of the workflow"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"state":{"type":"object","description":"State of the workflow run"},"position":{"type":"number","description":"Workflow run position"},"workflowId":{"type":"string","format":"uuid"},"workflowVersionId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/workflowRuns/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findWorkflowRunDuplicates", {
    name: "findWorkflowRunDuplicates",
    description: `**depth** can be provided to request your **workflowRun**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A workflow run","properties":{"name":{"type":"string","description":"Name of the workflow run"},"enqueuedAt":{"type":"string","format":"date-time","description":"Workflow run enqueued at"},"startedAt":{"type":"string","format":"date-time","description":"Workflow run started at"},"endedAt":{"type":"string","format":"date-time","description":"Workflow run ended at"},"status":{"type":"string","enum":["NOT_STARTED","RUNNING","COMPLETED","FAILED","ENQUEUED","STOPPING","STOPPED"],"description":"Workflow run status"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The executor of the workflow"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"state":{"type":"object","description":"State of the workflow run"},"position":{"type":"number","description":"Workflow run position"},"workflowId":{"type":"string","format":"uuid"},"workflowVersionId":{"type":"string","format":"uuid"}},"required":["state","timelineActivities","workflow","workflowVersion"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflowRuns/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneWorkflowRun", {
    name: "restoreOneWorkflowRun",
    description: `Restore One workflowRun`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/workflowRuns/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyWorkflowRuns", {
    name: "restoreManyWorkflowRuns",
    description: `Restore Many workflowRuns`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/workflowRuns",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyWorkflowRuns", {
    name: "mergeManyWorkflowRuns",
    description: `Merge Many workflowRuns`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflowRuns/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByWorkflowRuns", {
    name: "groupByWorkflowRuns",
    description: `Groups **workflowRuns** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/workflowRuns/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyWorkflows", {
    name: "findManyWorkflows",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **workflows**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/workflows",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneWorkflow", {
    name: "createOneWorkflow",
    description: `Create One workflow`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The workflow name"},"lastPublishedVersionId":{"type":"string","description":"The workflow last published version id"},"statuses":{"type":"array","items":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED"]},"description":"The current statuses of the workflow versions"},"position":{"type":"number","description":"Workflow record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}},"required":["attachments","timelineActivities","versions","runs","automatedTriggers"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflows",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyWorkflows", {
    name: "deleteManyWorkflows",
    description: `Delete Many workflows`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/workflows",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyWorkflows", {
    name: "updateManyWorkflows",
    description: `Update Many workflows`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The workflow name"},"lastPublishedVersionId":{"type":"string","description":"The workflow last published version id"},"statuses":{"type":"array","items":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED"]},"description":"The current statuses of the workflow versions"},"position":{"type":"number","description":"Workflow record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflows",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyWorkflows", {
    name: "createManyWorkflows",
    description: `Create Many workflows`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A workflow","properties":{"name":{"type":"string","description":"The workflow name"},"lastPublishedVersionId":{"type":"string","description":"The workflow last published version id"},"statuses":{"type":"array","items":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED"]},"description":"The current statuses of the workflow versions"},"position":{"type":"number","description":"Workflow record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}},"required":["attachments","timelineActivities","versions","runs","automatedTriggers"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/workflows",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneWorkflow", {
    name: "findOneWorkflow",
    description: `**depth** can be provided to request your **workflow**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/workflows/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneWorkflow", {
    name: "deleteOneWorkflow",
    description: `Delete One workflow`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/workflows/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneWorkflow", {
    name: "UpdateOneWorkflow",
    description: `Update One workflow`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"name":{"type":"string","description":"The workflow name"},"lastPublishedVersionId":{"type":"string","description":"The workflow last published version id"},"statuses":{"type":"array","items":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED"]},"description":"The current statuses of the workflow versions"},"position":{"type":"number","description":"Workflow record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/workflows/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findWorkflowDuplicates", {
    name: "findWorkflowDuplicates",
    description: `**depth** can be provided to request your **workflow**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A workflow","properties":{"name":{"type":"string","description":"The workflow name"},"lastPublishedVersionId":{"type":"string","description":"The workflow last published version id"},"statuses":{"type":"array","items":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED"]},"description":"The current statuses of the workflow versions"},"position":{"type":"number","description":"Workflow record position"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}},"required":["attachments","timelineActivities","versions","runs","automatedTriggers"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflows/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneWorkflow", {
    name: "restoreOneWorkflow",
    description: `Restore One workflow`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/workflows/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyWorkflows", {
    name: "restoreManyWorkflows",
    description: `Restore Many workflows`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/workflows",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyWorkflows", {
    name: "mergeManyWorkflows",
    description: `Merge Many workflows`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflows/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByWorkflows", {
    name: "groupByWorkflows",
    description: `Groups **workflows** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/workflows/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyWorkflowVersions", {
    name: "findManyWorkflowVersions",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **workflowVersions**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/workflowVersions",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneWorkflowVersion", {
    name: "createOneWorkflowVersion",
    description: `Create One workflowVersion`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"name":{"type":"string","description":"The workflow version name"},"trigger":{"type":"object","description":"Json object to provide trigger"},"steps":{"type":"object","description":"Json object to provide steps"},"status":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED","ARCHIVED"],"description":"The workflow version status"},"position":{"type":"number","description":"Workflow version position"},"workflowId":{"type":"string","format":"uuid"}},"required":["timelineActivities"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflowVersions",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyWorkflowVersions", {
    name: "deleteManyWorkflowVersions",
    description: `Delete Many workflowVersions`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/workflowVersions",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyWorkflowVersions", {
    name: "updateManyWorkflowVersions",
    description: `Update Many workflowVersions`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"name":{"type":"string","description":"The workflow version name"},"trigger":{"type":"object","description":"Json object to provide trigger"},"steps":{"type":"object","description":"Json object to provide steps"},"status":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED","ARCHIVED"],"description":"The workflow version status"},"position":{"type":"number","description":"Workflow version position"},"workflowId":{"type":"string","format":"uuid"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflowVersions",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyWorkflowVersions", {
    name: "createManyWorkflowVersions",
    description: `Create Many workflowVersions`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A workflow version","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"name":{"type":"string","description":"The workflow version name"},"trigger":{"type":"object","description":"Json object to provide trigger"},"steps":{"type":"object","description":"Json object to provide steps"},"status":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED","ARCHIVED"],"description":"The workflow version status"},"position":{"type":"number","description":"Workflow version position"},"workflowId":{"type":"string","format":"uuid"}},"required":["timelineActivities"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/workflowVersions",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneWorkflowVersion", {
    name: "findOneWorkflowVersion",
    description: `**depth** can be provided to request your **workflowVersion**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/workflowVersions/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneWorkflowVersion", {
    name: "deleteOneWorkflowVersion",
    description: `Delete One workflowVersion`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/workflowVersions/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneWorkflowVersion", {
    name: "UpdateOneWorkflowVersion",
    description: `Update One workflowVersion`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"name":{"type":"string","description":"The workflow version name"},"trigger":{"type":"object","description":"Json object to provide trigger"},"steps":{"type":"object","description":"Json object to provide steps"},"status":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED","ARCHIVED"],"description":"The workflow version status"},"position":{"type":"number","description":"Workflow version position"},"workflowId":{"type":"string","format":"uuid"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/workflowVersions/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findWorkflowVersionDuplicates", {
    name: "findWorkflowVersionDuplicates",
    description: `**depth** can be provided to request your **workflowVersion**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A workflow version","properties":{"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"},"name":{"type":"string","description":"The workflow version name"},"trigger":{"type":"object","description":"Json object to provide trigger"},"steps":{"type":"object","description":"Json object to provide steps"},"status":{"type":"string","enum":["DRAFT","ACTIVE","DEACTIVATED","ARCHIVED"],"description":"The workflow version status"},"position":{"type":"number","description":"Workflow version position"},"workflowId":{"type":"string","format":"uuid"}},"required":["timelineActivities"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workflowVersions/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneWorkflowVersion", {
    name: "restoreOneWorkflowVersion",
    description: `Restore One workflowVersion`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/workflowVersions/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyWorkflowVersions", {
    name: "restoreManyWorkflowVersions",
    description: `Restore Many workflowVersions`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/workflowVersions",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyWorkflowVersions", {
    name: "mergeManyWorkflowVersions",
    description: `Merge Many workflowVersions`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workflowVersions/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByWorkflowVersions", {
    name: "groupByWorkflowVersions",
    description: `Groups **workflowVersions** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/workflowVersions/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findManyWorkspaceMembers", {
    name: "findManyWorkspaceMembers",
    description: `**order_by**, **filter**, **limit**, **depth**, **starting_after** or **ending_before** can be provided to request your **workspaceMembers**`,
    inputSchema: {"type":"object","properties":{"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"starting_after":{"type":"string","description":"Returns objects starting after a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"},"ending_before":{"type":"string","description":"Returns objects ending before a specific cursor. You can find cursors in **startCursor** and **endCursor** in **pageInfo** in response data"}}},
    method: "get",
    pathTemplate: "/workspaceMembers",
    executionParameters: [{"name":"order_by","in":"query"},{"name":"filter","in":"query"},{"name":"limit","in":"query"},{"name":"depth","in":"query"},{"name":"starting_after","in":"query"},{"name":"ending_before","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createOneWorkspaceMember", {
    name: "createOneWorkspaceMember",
    description: `Create One workspaceMember`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Workspace member position"},"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Workspace member name"},"colorScheme":{"type":"string","description":"Preferred color scheme"},"locale":{"type":"string","description":"Preferred language"},"avatarUrl":{"type":"string","description":"Workspace member avatar"},"userEmail":{"type":"string","description":"Related user email address"},"calendarStartDay":{"type":"number","description":"User's preferred start day of the week"},"userId":{"type":"string","format":"uuid","description":"Associated User Id"},"timeZone":{"type":"string","description":"User time zone"},"dateFormat":{"type":"string","enum":["SYSTEM","MONTH_FIRST","DAY_FIRST","YEAR_FIRST"],"description":"User's preferred date format"},"timeFormat":{"type":"string","enum":["SYSTEM","HOUR_24","HOUR_12"],"description":"User's preferred time format"},"numberFormat":{"type":"string","enum":["SYSTEM","COMMAS_AND_DOT","SPACES_AND_COMMA","DOTS_AND_COMMA","APOSTROPHE_AND_DOT"],"description":"User's preferred number format"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}},"required":["name","userId","blocklist","calendarEventParticipants","accountOwnerForCompanies","connectedAccounts","messageParticipants","ownedOpportunities","assignedTasks"]}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workspaceMembers",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteManyWorkspaceMembers", {
    name: "deleteManyWorkspaceMembers",
    description: `Delete Many workspaceMembers`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}}},
    method: "delete",
    pathTemplate: "/workspaceMembers",
    executionParameters: [{"name":"filter","in":"query"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["updateManyWorkspaceMembers", {
    name: "updateManyWorkspaceMembers",
    description: `Update Many workspaceMembers`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Workspace member position"},"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Workspace member name"},"colorScheme":{"type":"string","description":"Preferred color scheme"},"locale":{"type":"string","description":"Preferred language"},"avatarUrl":{"type":"string","description":"Workspace member avatar"},"userEmail":{"type":"string","description":"Related user email address"},"calendarStartDay":{"type":"number","description":"User's preferred start day of the week"},"userId":{"type":"string","format":"uuid","description":"Associated User Id"},"timeZone":{"type":"string","description":"User time zone"},"dateFormat":{"type":"string","enum":["SYSTEM","MONTH_FIRST","DAY_FIRST","YEAR_FIRST"],"description":"User's preferred date format"},"timeFormat":{"type":"string","enum":["SYSTEM","HOUR_24","HOUR_12"],"description":"User's preferred time format"},"numberFormat":{"type":"string","enum":["SYSTEM","COMMAS_AND_DOT","SPACES_AND_COMMA","DOTS_AND_COMMA","APOSTROPHE_AND_DOT"],"description":"User's preferred number format"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workspaceMembers",
    executionParameters: [{"name":"depth","in":"query"},{"name":"filter","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["createManyWorkspaceMembers", {
    name: "createManyWorkspaceMembers",
    description: `Create Many workspaceMembers`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"upsert":{"type":"boolean","default":false,"description":"If true, creates the object or updates it if it already exists."},"requestBody":{"type":"array","items":{"type":"object","description":"A workspace member","properties":{"position":{"type":"number","description":"Workspace member position"},"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Workspace member name"},"colorScheme":{"type":"string","description":"Preferred color scheme"},"locale":{"type":"string","description":"Preferred language"},"avatarUrl":{"type":"string","description":"Workspace member avatar"},"userEmail":{"type":"string","description":"Related user email address"},"calendarStartDay":{"type":"number","description":"User's preferred start day of the week"},"userId":{"type":"string","format":"uuid","description":"Associated User Id"},"timeZone":{"type":"string","description":"User time zone"},"dateFormat":{"type":"string","enum":["SYSTEM","MONTH_FIRST","DAY_FIRST","YEAR_FIRST"],"description":"User's preferred date format"},"timeFormat":{"type":"string","enum":["SYSTEM","HOUR_24","HOUR_12"],"description":"User's preferred time format"},"numberFormat":{"type":"string","enum":["SYSTEM","COMMAS_AND_DOT","SPACES_AND_COMMA","DOTS_AND_COMMA","APOSTROPHE_AND_DOT"],"description":"User's preferred number format"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}},"required":["name","userId","blocklist","calendarEventParticipants","accountOwnerForCompanies","connectedAccounts","messageParticipants","ownedOpportunities","assignedTasks"]},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/batch/workspaceMembers",
    executionParameters: [{"name":"depth","in":"query"},{"name":"upsert","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findOneWorkspaceMember", {
    name: "findOneWorkspaceMember",
    description: `**depth** can be provided to request your **workspaceMember**`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "get",
    pathTemplate: "/workspaceMembers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["deleteOneWorkspaceMember", {
    name: "deleteOneWorkspaceMember",
    description: `Delete One workspaceMember`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"soft_delete":{"type":"boolean","default":false,"description":"If true, soft deletes the objects. If false, objects are permanently deleted."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/workspaceMembers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"soft_delete","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["UpdateOneWorkspaceMember", {
    name: "UpdateOneWorkspaceMember",
    description: `Update One workspaceMember`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","description":"body","properties":{"position":{"type":"number","description":"Workspace member position"},"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Workspace member name"},"colorScheme":{"type":"string","description":"Preferred color scheme"},"locale":{"type":"string","description":"Preferred language"},"avatarUrl":{"type":"string","description":"Workspace member avatar"},"userEmail":{"type":"string","description":"Related user email address"},"calendarStartDay":{"type":"number","description":"User's preferred start day of the week"},"userId":{"type":"string","format":"uuid","description":"Associated User Id"},"timeZone":{"type":"string","description":"User time zone"},"dateFormat":{"type":"string","enum":["SYSTEM","MONTH_FIRST","DAY_FIRST","YEAR_FIRST"],"description":"User's preferred date format"},"timeFormat":{"type":"string","enum":["SYSTEM","HOUR_24","HOUR_12"],"description":"User's preferred time format"},"numberFormat":{"type":"string","enum":["SYSTEM","COMMAS_AND_DOT","SPACES_AND_COMMA","DOTS_AND_COMMA","APOSTROPHE_AND_DOT"],"description":"User's preferred number format"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}}}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/workspaceMembers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["findWorkspaceMemberDuplicates", {
    name: "findWorkspaceMemberDuplicates",
    description: `**depth** can be provided to request your **workspaceMember**`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","description":"A workspace member","properties":{"position":{"type":"number","description":"Workspace member position"},"name":{"type":"object","properties":{"firstName":{"type":"string"},"lastName":{"type":"string"}},"description":"Workspace member name"},"colorScheme":{"type":"string","description":"Preferred color scheme"},"locale":{"type":"string","description":"Preferred language"},"avatarUrl":{"type":"string","description":"Workspace member avatar"},"userEmail":{"type":"string","description":"Related user email address"},"calendarStartDay":{"type":"number","description":"User's preferred start day of the week"},"userId":{"type":"string","format":"uuid","description":"Associated User Id"},"timeZone":{"type":"string","description":"User time zone"},"dateFormat":{"type":"string","enum":["SYSTEM","MONTH_FIRST","DAY_FIRST","YEAR_FIRST"],"description":"User's preferred date format"},"timeFormat":{"type":"string","enum":["SYSTEM","HOUR_24","HOUR_12"],"description":"User's preferred time format"},"numberFormat":{"type":"string","enum":["SYSTEM","COMMAS_AND_DOT","SPACES_AND_COMMA","DOTS_AND_COMMA","APOSTROPHE_AND_DOT"],"description":"User's preferred number format"},"createdBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The creator of the record"},"updatedBy":{"type":"object","properties":{"source":{"type":"string","enum":["EMAIL","CALENDAR","WORKFLOW","AGENT","API","IMPORT","MANUAL","SYSTEM","WEBHOOK"]}},"description":"The workspace member who last updated the record"}},"required":["name","userId","blocklist","calendarEventParticipants","accountOwnerForCompanies","connectedAccounts","messageParticipants","ownedOpportunities","assignedTasks"]}},"ids":{"type":"array","items":{"type":"string","format":"uuid"}}},"description":"body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workspaceMembers/duplicates",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreOneWorkspaceMember", {
    name: "restoreOneWorkspaceMember",
    description: `Restore One workspaceMember`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/restore/workspaceMembers/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["restoreManyWorkspaceMembers", {
    name: "restoreManyWorkspaceMembers",
    description: `Restore Many workspaceMembers`,
    inputSchema: {"type":"object","properties":{"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"}}},
    method: "patch",
    pathTemplate: "/restore/workspaceMembers",
    executionParameters: [{"name":"filter","in":"query"},{"name":"depth","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["mergeManyWorkspaceMembers", {
    name: "mergeManyWorkspaceMembers",
    description: `Merge Many workspaceMembers`,
    inputSchema: {"type":"object","properties":{"depth":{"type":"number","enum":[0,1],"default":1,"description":"Determines the level of nested related objects to include in the response.\n    - 0: Primary object only\n    - 1: Primary object + direct relations"},"requestBody":{"type":"object","properties":{"ids":{"type":"array","description":"The IDs of the records to merge","items":{"type":"string","format":"uuid"}},"conflictPriorityIndex":{"type":"number","description":"The index of the record to use when conflicts occur"},"dryRun":{"description":"If true, the merge will not be performed and a preview of the merge will be returned.","type":"boolean","default":false}},"required":["ids","conflictPriorityIndex"],"description":"body"}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/workspaceMembers/merge",
    executionParameters: [{"name":"depth","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["groupByWorkspaceMembers", {
    name: "groupByWorkspaceMembers",
    description: `Groups **workspaceMembers** by specified fields and optionally computes aggregate values for each group.`,
    inputSchema: {"type":"object","properties":{"group_by":{"type":"string","description":"Array of fields to group by. Each element can specify a field and optionally a subfield or granularity for date fields."},"filter":{"type":"string","description":"Format: field[COMPARATOR]:value,field2[COMPARATOR]:value2.\n    For like/ilike, use % as a wildcard (e.g. %value% for substring match).\n    Refer to the filter section at the top of the page for more details."},"order_by":{"type":"string","description":"Format: **field_name_1,field_name_2[DIRECTION_2]\n    Refer to the filter section at the top of the page for more details."},"limit":{"type":"number","minimum":0,"maximum":200,"default":60,"description":"Limits the number of objects returned."},"view_id":{"type":"string","format":"uuid","description":"View ID to apply filters from."},"aggregate":{"type":"string","description":"Array of aggregate operations to compute for each group."},"include_records_sample":{"type":"boolean","default":false,"description":"If true, includes a sample of records for each group in the response."},"order_by_for_records":{"type":"string","description":"Order by clause for records within each group. Only applicable when include_records_sample is true."}},"required":["group_by"]},
    method: "get",
    pathTemplate: "/workspaceMembers/groupBy",
    executionParameters: [{"name":"group_by","in":"query"},{"name":"filter","in":"query"},{"name":"order_by","in":"query"},{"name":"limit","in":"query"},{"name":"view_id","in":"query"},{"name":"aggregate","in":"query"},{"name":"include_records_sample","in":"query"},{"name":"order_by_for_records","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
  ["duplicateDashboard", {
    name: "duplicateDashboard",
    description: `Creates a duplicate of an existing dashboard`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Object id."}},"required":["id"]},
    method: "post",
    pathTemplate: "/dashboards/{id}/duplicate",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}]
  }],
]);

/**
 * Security schemes from the OpenAPI spec
 */
const securitySchemes =   {
    "bearerAuth": {
      "type": "http",
      "scheme": "bearer",
      "bearerFormat": "JWT",
      "description": "Enter the token with the `Bearer: ` prefix, e.g. \"Bearer abcde12345\"."
    }
  };


server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
  return { tools: toolsForClient };
});


server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    console.error(`Error: Unknown tool requested: ${toolName}`);
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});



/**
 * Type definition for cached OAuth tokens
 */
interface TokenCacheEntry {
    token: string;
    expiresAt: number;
}

/**
 * Declare global __oauthTokenCache property for TypeScript
 */
declare global {
    var __oauthTokenCache: Record<string, TokenCacheEntry> | undefined;
}

/**
 * Acquires an OAuth2 token using client credentials flow
 * 
 * @param schemeName Name of the security scheme
 * @param scheme OAuth2 security scheme
 * @returns Acquired token or null if unable to acquire
 */
async function acquireOAuth2Token(schemeName: string, scheme: any): Promise<string | null | undefined> {
    try {
        // Check if we have the necessary credentials
        const clientId = process.env[`OAUTH_CLIENT_ID_SCHEMENAME`];
        const clientSecret = process.env[`OAUTH_CLIENT_SECRET_SCHEMENAME`];
        const scopes = process.env[`OAUTH_SCOPES_SCHEMENAME`];
        
        if (!clientId || !clientSecret) {
            console.error(`Missing client credentials for OAuth2 scheme '${schemeName}'`);
            return null;
        }
        
        // Initialize token cache if needed
        if (typeof global.__oauthTokenCache === 'undefined') {
            global.__oauthTokenCache = {};
        }
        
        // Check if we have a cached token
        const cacheKey = `${schemeName}_${clientId}`;
        const cachedToken = global.__oauthTokenCache[cacheKey];
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
            console.error(`Using cached OAuth2 token for '${schemeName}' (expires in ${Math.floor((cachedToken.expiresAt - now) / 1000)} seconds)`);
            return cachedToken.token;
        }
        
        // Determine token URL based on flow type
        let tokenUrl = '';
        if (scheme.flows?.clientCredentials?.tokenUrl) {
            tokenUrl = scheme.flows.clientCredentials.tokenUrl;
            console.error(`Using client credentials flow for '${schemeName}'`);
        } else if (scheme.flows?.password?.tokenUrl) {
            tokenUrl = scheme.flows.password.tokenUrl;
            console.error(`Using password flow for '${schemeName}'`);
        } else {
            console.error(`No supported OAuth2 flow found for '${schemeName}'`);
            return null;
        }
        
        // Prepare the token request
        let formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        
        // Add scopes if specified
        if (scopes) {
            formData.append('scope', scopes);
        }
        
        console.error(`Requesting OAuth2 token from ${tokenUrl}`);
        
        // Make the token request
        const response = await axios({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            data: formData.toString()
        });
        
        // Process the response
        if (response.data?.access_token) {
            const token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
            
            // Cache the token
            global.__oauthTokenCache[cacheKey] = {
                token,
                expiresAt: now + (expiresIn * 1000) - 60000 // Expire 1 minute early
            };
            
            console.error(`Successfully acquired OAuth2 token for '${schemeName}' (expires in ${expiresIn} seconds)`);
            return token;
        } else {
            console.error(`Failed to acquire OAuth2 token for '${schemeName}': No access_token in response`);
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error acquiring OAuth2 token for '${schemeName}':`, errorMessage);
        return null;
    }
}


/**
 * Executes an API tool with the provided arguments
 * 
 * @param toolName Name of the tool to execute
 * @param definition Tool definition
 * @param toolArgs Arguments provided by the user
 * @param allSecuritySchemes Security schemes from the OpenAPI spec
 * @returns Call tool result
 */
async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>
): Promise<CallToolResult> {
  try {
    // Validate arguments against the input schema
    let validatedArgs: JsonObject;
    try {
        const zodSchema = getZodSchemaFromJsonSchema(definition.inputSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}): ${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    // Prepare URL, query parameters, headers, and request body
    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    // Apply parameters to the URL path, query, or headers
    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            }
            else if (param.in === 'query') {
                queryParams[param.name] = value;
            }
            else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    // Ensure all path parameters are resolved
    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }
    
    // Construct the full URL
    const requestUrl = API_BASE_URL ? `${API_BASE_URL}${urlPath}` : urlPath;

    // Handle request body if needed
    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }


    // Apply security requirements if available
    // Security requirements use OR between array items and AND within each object
    const appliedSecurity = definition.securityRequirements?.find(req => {
        // Try each security requirement (combined with OR)
        return Object.entries(req).every(([schemeName, scopesArray]) => {
            const scheme = allSecuritySchemes[schemeName];
            if (!scheme) return false;
            
            // API Key security (header, query, cookie)
            if (scheme.type === 'apiKey') {
                return !!process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            // HTTP security (basic, bearer)
            if (scheme.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    return !!process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    return !!process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] && 
                           !!process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
            }
            
            // OAuth2 security
            if (scheme.type === 'oauth2') {
                // Check for pre-existing token
                if (process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    return true;
                }
                
                // Check for client credentials for auto-acquisition
                if (process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                    process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    // Verify we have a supported flow
                    if (scheme.flows?.clientCredentials || scheme.flows?.password) {
                        return true;
                    }
                }
                
                return false;
            }
            
            // OpenID Connect
            if (scheme.type === 'openIdConnect') {
                return !!process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            return false;
        });
    });

    // If we found matching security scheme(s), apply them
    if (appliedSecurity) {
        // Apply each security scheme from this requirement (combined with AND)
        for (const [schemeName, scopesArray] of Object.entries(appliedSecurity)) {
            const scheme = allSecuritySchemes[schemeName];
            
            // API Key security
            if (scheme?.type === 'apiKey') {
                const apiKey = process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (apiKey) {
                    if (scheme.in === 'header') {
                        headers[scheme.name.toLowerCase()] = apiKey;
                        console.error(`Applied API key '${schemeName}' in header '${scheme.name}'`);
                    }
                    else if (scheme.in === 'query') {
                        queryParams[scheme.name] = apiKey;
                        console.error(`Applied API key '${schemeName}' in query parameter '${scheme.name}'`);
                    }
                    else if (scheme.in === 'cookie') {
                        // Add the cookie, preserving other cookies if they exist
                        headers['cookie'] = `${scheme.name}=${apiKey}${headers['cookie'] ? `; ${headers['cookie']}` : ''}`;
                        console.error(`Applied API key '${schemeName}' in cookie '${scheme.name}'`);
                    }
                }
            } 
            // HTTP security (Bearer or Basic)
            else if (scheme?.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    const token = process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (token) {
                        headers['authorization'] = `Bearer ${token}`;
                        console.error(`Applied Bearer token for '${schemeName}'`);
                    }
                } 
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    const username = process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    const password = process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (username && password) {
                        headers['authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
                        console.error(`Applied Basic authentication for '${schemeName}'`);
                    }
                }
            }
            // OAuth2 security
            else if (scheme?.type === 'oauth2') {
                // First try to use a pre-provided token
                let token = process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                
                // If no token but we have client credentials, try to acquire a token
                if (!token && (scheme.flows?.clientCredentials || scheme.flows?.password)) {
                    console.error(`Attempting to acquire OAuth token for '${schemeName}'`);
                    token = (await acquireOAuth2Token(schemeName, scheme)) ?? '';
                }
                
                // Apply token if available
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OAuth2 token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
            // OpenID Connect
            else if (scheme?.type === 'openIdConnect') {
                const token = process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OpenID Connect token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
        }
    } 
    // Log warning if security is required but not available
    else if (definition.securityRequirements?.length > 0) {
        // First generate a more readable representation of the security requirements
        const securityRequirementsString = definition.securityRequirements
            .map(req => {
                const parts = Object.entries(req)
                    .map(([name, scopesArray]) => {
                        const scopes = scopesArray as string[];
                        if (scopes.length === 0) return name;
                        return `${name} (scopes: ${scopes.join(', ')})`;
                    })
                    .join(' AND ');
                return `[${parts}]`;
            })
            .join(' OR ');
            
        console.warn(`Tool '${toolName}' requires security: ${securityRequirementsString}, but no suitable credentials found.`);
    }
    

    // Prepare the axios request configuration
    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(), 
      url: requestUrl, 
      params: queryParams, 
      headers: headers,
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    // Log request info to stderr (doesn't affect MCP output)
    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);
    
    // Execute the request
    const response = await axios(config);

    // Process and format the response
    let responseText = '';
    const contentType = String(response.headers['content-type'] ?? '').toLowerCase();
    
    // Handle JSON responses
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch (e) { 
             responseText = "[Stringify Error]"; 
         }
    } 
    // Handle string responses
    else if (typeof response.data === 'string') { 
         responseText = response.data; 
    }
    // Handle other response types
    else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    }
    // Handle empty responses
    else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    // Return formatted response
    return { 
        content: [ 
            { 
                type: "text", 
                text: `API Response (Status: ${response.status}):\n${responseText}` 
            } 
        ], 
    };

  } catch (error: unknown) {
    // Handle errors during execution
    let errorMessage: string;
    
    // Format Axios errors specially
    if (axios.isAxiosError(error)) { 
        errorMessage = formatApiError(error); 
    }
    // Handle standard errors
    else if (error instanceof Error) { 
        errorMessage = error.message; 
    }
    // Handle unexpected error types
    else { 
        errorMessage = 'Unexpected error: ' + String(error); 
    }
    
    // Log error to stderr
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    
    // Return error message to client
    return { content: [{ type: "text", text: errorMessage }] };
  }
}


/**
 * Main function to start the server
 */
async function main() {
// Set up stdio transport
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`${SERVER_NAME} MCP Server (v${SERVER_VERSION}) running on stdio${API_BASE_URL ? `, proxying API at ${API_BASE_URL}` : ''}`);
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    console.error("Shutting down MCP server...");
    process.exit(0);
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
main().catch((error) => {
  console.error("Fatal error in main execution:", error);
  process.exit(1);
});

/**
 * Formats API errors for better readability
 * 
 * @param error Axios error
 * @returns Formatted error message
 */
function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        }
        else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        }
        else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

/**
 * Converts a JSON Schema to a Zod schema for runtime validation
 * 
 * @param jsonSchema JSON Schema
 * @param toolName Tool name for error reporting
 * @returns Zod schema
 */
function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        const zodSchema = eval(zodSchemaString);
        if (typeof zodSchema?.parse !== 'function') { 
            throw new Error('Eval did not produce a valid Zod schema.'); 
        }
        return zodSchema as z.ZodTypeAny;
    } catch (err: any) {
        console.error(`Failed to generate/evaluate Zod schema for '${toolName}':`, err);
        return z.object({}).passthrough();
    }
}
