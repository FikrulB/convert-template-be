import fs from 'fs';
import path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    '❌ Please provide a module name. Example: pnpm module:create User',
  );
  process.exit(1);
}

// Name formats
const folderName = moduleName.toLowerCase();
const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const fileName = folderName;

const baseDir = path.join('src/modules', folderName);
const appModulePath = 'src/app.module.ts';

// Check if already exists
if (fs.existsSync(baseDir)) {
  console.error(`⚠️ Module ${className} already exists.`);
  process.exit(1);
}

// Create directories
fs.mkdirSync(baseDir, { recursive: true });
fs.mkdirSync(path.join(baseDir, 'dto'), { recursive: true });

// Templates
const controllerTemplate = `
import { Controller } from '@nestjs/common';
import { ${className}Service } from './${fileName}.service';

@Controller('${fileName}')
export class ${className}Controller {
  constructor(private readonly ${fileName}Service: ${className}Service) {}
}
`.trim();

const serviceTemplate = `
import { Injectable } from '@nestjs/common';
import { ${className}Repository } from './${fileName}.repository';

@Injectable()
export class ${className}Service {
  constructor(private readonly ${className.toLowerCase()}Repo: ${className}Repository) {}
}
`.trim();

const repositoryTemplate = `
import { PrismaService } from '#/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Repository {
  constructor(private prisma: PrismaService) {}
}
`.trim();

const moduleTemplate = `
import { Module } from '@nestjs/common';
import { ${className}Controller } from './${fileName}.controller';
import { ${className}Service } from './${fileName}.service';
import { ${className}Repository } from './${fileName}.repository';

@Module({
  controllers: [${className}Controller],
  providers: [${className}Service, ${className}Repository],
  exports: [${className}Service],
})
export class ${className}Module {}
`.trim();

// Write Files
fs.writeFileSync(
  path.join(baseDir, `${fileName}.controller.ts`),
  controllerTemplate,
);
fs.writeFileSync(path.join(baseDir, `${fileName}.service.ts`), serviceTemplate);
fs.writeFileSync(
  path.join(baseDir, `${fileName}.repository.ts`),
  repositoryTemplate,
);
fs.writeFileSync(path.join(baseDir, `${fileName}.module.ts`), moduleTemplate);
fs.writeFileSync(
  path.join(baseDir, 'dto/index.ts'),
  '// DTO exports placeholder',
);

// 🛠 Auto update AppModule
if (fs.existsSync(appModulePath)) {
  let appModule = fs.readFileSync(appModulePath, 'utf-8');

  const importLine = `import { ${className}Module } from './modules/${folderName}/${fileName}.module';`;

  if (!appModule.includes(importLine)) {
    appModule = importLine + '\n' + appModule;
  }

  const importsRegex = /imports:\s*\[((.|\n)*?)\]/m;
  const match = appModule.match(importsRegex);

  if (match) {
    if (!match[1].includes(`${className}Module`)) {
      const newImports = match[1].trim().endsWith(',')
        ? `${match[1]} ${className}Module,`
        : `${match[1]}, ${className}Module,`;

      appModule = appModule.replace(importsRegex, `imports: [${newImports}]`);
    }
  }

  fs.writeFileSync(appModulePath, appModule);
}

console.log(`\n✨ Module ${className} created successfully!`);
console.log(`📁 Location: ${baseDir}`);
console.log(`🧩 AppModule updated & registered: ${className}Module\n`);
