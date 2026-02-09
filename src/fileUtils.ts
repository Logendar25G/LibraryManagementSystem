import fs from "fs";
import path from "path";

export function saveToFile(fileName: string, data: any) {
    // check that the folder exists
    const dir = path.dirname(fileName);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
}
export function loadFromFile(fileName: string, defaultData: any = []) {
    if (fs.existsSync(fileName)) {
    const data = fs.readFileSync(fileName, "utf-8");
    if (!data.trim()) return defaultData; 
    return JSON.parse(data);
  }
    return defaultData;
}