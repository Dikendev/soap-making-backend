import { writeFile } from 'fs/promises';

export const saveJsonFile = async (fileName: string, data: object) => {
  let filePath: string;
  try {
    filePath = `./TMP/${fileName}.json`;
    await writeFile(filePath, JSON.stringify(data));
  } catch (err) {
    throw err;
  }
};
