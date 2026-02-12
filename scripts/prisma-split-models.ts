import fs from 'fs';
import path from 'path';

const prismaDir = 'prisma';
const schemaPath = path.join(prismaDir, 'schema.prisma');
const introspectedPath = path.join(prismaDir, 'introspected.prisma');

function extractAndMergeModels(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content: string = fs.readFileSync(filePath, 'utf-8');

  const modelRegex = /model\s+(\w+)\s+{[^}]*}/gms;
  let match: RegExpExecArray | null;

  while ((match = modelRegex.exec(content)) !== null) {
    const block: string = match[0];
    const modelName: string = match[1];

    const schemaMatch: RegExpMatchArray | null =
      block.match(/@@schema\("(.+?)"\)/);

    const schemaName: string = schemaMatch?.[1] ?? 'public';
    const targetFile: string = path.join(prismaDir, `${schemaName}.prisma`);

    let existingContent = '';

    if (fs.existsSync(targetFile)) {
      existingContent = fs.readFileSync(targetFile, 'utf-8');

      const modelExistsRegex = new RegExp(`model\\s+${modelName}\\s+{`, 'g');

      if (modelExistsRegex.test(existingContent)) {
        console.log(`⚠️  ${modelName} already exists in ${schemaName}.prisma`);
        continue;
      }

      fs.appendFileSync(targetFile, `\n\n${block}\n`);
      console.log(`➕ Appended ${modelName} → ${schemaName}.prisma`);
    } else {
      fs.writeFileSync(targetFile, `${block}\n`);
      console.log(`✔ Created ${schemaName}.prisma with ${modelName}`);
    }
  }
}

function cleanMainSchema(): void {
  const schema: string = fs.readFileSync(schemaPath, 'utf-8');

  const generatorRegex = /generator\s+[\s\S]*?}/g;
  const datasourceRegex = /datasource\s+[\s\S]*?}/g;

  const generator: string = schema.match(generatorRegex)?.[0] ?? '';
  const datasource: string = schema.match(datasourceRegex)?.[0] ?? '';

  fs.writeFileSync(schemaPath, `${generator}\n\n${datasource}\n`);

  console.log('🧹 schema.prisma cleaned (generator + datasource only)');
}

function run(): void {
  console.log('\n🚀 Processing schema.prisma...');
  extractAndMergeModels(schemaPath);

  cleanMainSchema();

  console.log('\n🚀 Checking introspector.prisma...');
  const introspectorExists: boolean = fs.existsSync(introspectedPath);

  if (introspectorExists) {
    extractAndMergeModels(introspectedPath);

    fs.unlinkSync(introspectedPath);
    console.log('🗑 introspector.prisma deleted');
  }

  console.log('\n✨ Done! All schemas merged safely ✔');
}

run();
