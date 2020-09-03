import { ParseConfig } from "papaparse";

export interface ImportConfig {
  logging?: boolean;
  parseConfig?: ParseConfig;
  addFields?: (row: any) => {};
}
