import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("tasks.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParser = parse({
  delimiter: ",",
  skip_empty_lines: true,
  fromLine: 2,
});

async function importFromCSVFile() {
  const lines = stream.pipe(csvParser);

  for await (const line of lines) {
    const [title, description] = line;

    await fetch("http://localhost:3333/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

importFromCSVFile();
