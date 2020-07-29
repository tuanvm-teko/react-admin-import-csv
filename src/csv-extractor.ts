import { parse as convertFromCSV, ParseConfig } from "papaparse";
import lensPath from "ramda/src/lensPath";
import over from "ramda/src/over";
import readXlsxFile from "read-excel-file";

const setObjectValue = (object: any, path: string, value: any): any => {
  const lensPathFunction = lensPath(path.split("."));
  return over(lensPathFunction, () => value, object || {});
};

export async function processCsvFile(
  file: File | any,
  parseConfig: ParseConfig = {}
) {
  if (!file) {
    return;
  }
  const csvData = await getCsvData(file, parseConfig);
  return processCsvData(csvData);
}

export async function getCsvData(
  file: File | any,
  inputConfig: ParseConfig = {}
) {
  let config = {};
  const isObject = !!inputConfig && typeof inputConfig === "object";
  if (isObject) {
    config = inputConfig;
  }
  return new Promise<string[][]>((resolve, reject) => {
    const dataParser = (data: any) =>
      convertFromCSV(data, {
        // Defaults
        delimiter: ",",
        skipEmptyLines: true,
        // Configs (overwrites)
        ...config,
        // Callbacks
        complete: (result: any) => resolve(result.data),

        error: (error) => reject(error),
      });
    return readXlsxFile(file)
      .then((data: string[][]) => {
        return dataParser(data.map((line) => line.join(",")).join("\n"));
      })
      .catch((err) => {
        return dataParser(file);
      });
  });
}

export function processCsvData(data: string[][]): any[] {
  if (Array.isArray(data[0])) {
    const topRowKeys: string[] = data[0];

    const dataRows = data.slice(1).map((row) => {
      let value: any = {};

      topRowKeys.forEach((key, index) => {
        value = setObjectValue(value, key, row[index]);
      });

      return value;
    });
    return dataRows;
  } else {
    const dataRows = [];
    data.forEach((obj) => {
      let value: any = {};
      for (let key in obj) value = setObjectValue(value, key, obj[key]);
      dataRows.push(value);
    });
    return dataRows;
  }
}
