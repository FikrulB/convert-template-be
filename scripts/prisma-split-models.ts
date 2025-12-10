import fs from 'fs';
import path from 'path';

const prismaDir = 'prisma';
const schemaPath = path.join(prismaDir, 'schema.prisma');

function splitBySchema() {
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  const modelRegex = /model\s+(\w+)\s+{[^}]*}/gms;
  const generatorRegex = /generator\s+[\s\S]*?}/g;
  const datasourceRegex = /datasource\s+[\s\S]*?}/g;

  const generator = schema.match(generatorRegex)?.[0] ?? '';
  const datasource = schema.match(datasourceRegex)?.[0] ?? '';

  const schemas: Record<string, any> = {};

  let match;
  while ((match = modelRegex.exec(schema)) !== null) {
    const block = match[0];
    const modelName = match[1];

    const schemaMatch = block.match(/@@schema\("(.+?)"\)/);
    const schemaName = schemaMatch?.[1] ?? 'public';

    if (!schemas[schemaName]) {
      schemas[schemaName] = [];
    }

    schemas[schemaName].push(block);
    console.log(`📌 ${modelName} → schema: ${schemaName}`);
  }

  Object.entries(schemas).forEach(([schemaName, blocks]) => {
    const outFile = path.join(prismaDir, `${schemaName}.prisma`);
    fs.writeFileSync(outFile, blocks.join('\n\n') + '\n');
    console.log(`✔ Created: prisma/${schemaName}.prisma`);
  });

  // Overwrite schema.prisma back to minimal version
  fs.writeFileSync(schemaPath, `${generator}\n\n${datasource}\n`);
  console.log('\n✨ Done! Schema cleaned and models split ✔');
}

splitBySchema();
