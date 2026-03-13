 
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

import { getInteractiveInputs } from './interactivePrompt.js';
import { templates } from './template.js';
import { log } from './log.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const moduleName = process.argv[2];
if (!moduleName) {
  console.error(chalk.red('Por favor, forneça um nome de módulo.'));
  console.info(chalk.yellow('Exemplo: npm run create-crud usuario'));
  process.exit(1);
}

async function main() {
  try {
    await log();
    const inputs = await getInteractiveInputs();
    console.info(chalk.cyan(`Artigo escolhido: ${inputs.artigo}`));
    console.info(chalk.cyan(`Nome visível da entidade: ${inputs.name}`));
    
    generateModule(inputs.module, inputs.artigo, inputs.name);
    
    console.info(chalk.green(`✅ Módulo "${inputs.module}" criado com sucesso!`));
    console.info(chalk.blue(`📝 Usando tabela global: import { Table, TableRow, TableCell } from '@/common/components/Table'`));
  } catch (error) {
    console.error(chalk.red('❌ Ocorreu um erro:'), error);
    process.exit(1);
  }
}

main();

function generateModule(entityName, article, visibleName) {
  const modelUpper = capitalizeFirstLetter(entityName);
  const modelLower = lowerFirstLetter(entityName);
  
  // Gerar todos os arquivos dos templates
  Object.keys(templates).forEach((key) => {
    const template = templates[key];
    if (!template.template) return;
    
    let content = template.template;
    
    // Substituir placeholders
    content = content.replace(/{ModelUpper}/g, modelUpper);
    content = content.replace(/{ModelLower}/g, modelLower);
    content = content.replace(/{ModelArticle}/g, article);
    content = content.replace(/{ModelVisible}/g, visibleName);
    
    // Determinar o diretório e nome do arquivo
    let dirName = template.dir + modelUpper;
    if (template.subDir) {
      dirName = join(dirName, template.subDir);
    }
    
    let fileName;
    if (template.name) {
      let name = template.name.replace(/{ModelUpper}/g, modelUpper);
      name = name.replace(/{ModelLower}/g, modelLower);
      fileName = join(dirName, `${name}.tsx`);
    } else {
      fileName = join(dirName, `${modelUpper}${capitalizeFirstLetter(key)}.tsx`);
    }
    
    // Criar diretório se não existir
    createDirIfNotExist(dirName);
    
    // Criar arquivo se não existir
    createFileIfNotExist(fileName, content);
  });
  
  // Criar arquivos de índice (index.ts)
  createComponentsIndex(modelUpper, modelLower);
  createHooksIndex(modelUpper, modelLower);
  
  // Atualizar rotas
  appendRoutes(modelUpper, modelLower);
}

function createComponentsIndex(modelUpper, modelLower) {
  const dirName = join(`${templates.service.dir}`, modelUpper, 'components');
  createDirIfNotExist(dirName);
  
  const content = `export * from './${modelUpper}Form';
export * from './${modelUpper}Header';
export * from './${modelUpper}Filters';
export * from './${modelUpper}FormHeader';
`;
  
  const fileName = join(dirName, 'index.ts');
  createFileIfNotExist(fileName, content);
}

function createHooksIndex(modelUpper, modelLower) {
  const dirName = join(`${templates.service.dir}`, modelUpper, 'hooks');
  createDirIfNotExist(dirName);
  
  const content = `export * from './use${modelUpper}Filters';
export * from './use${modelUpper}s';
export * from './use${modelUpper}';
export * from './useCreate${modelUpper}';
export * from './useUpdate${modelUpper}';
export * from './useDelete${modelUpper}';
`;
  
  const fileName = join(dirName, 'index.ts');
  createFileIfNotExist(fileName, content);
}

function appendRoutes(modelUpper, modelLower) {
  const path = `${__dirname}/../src/routes/routes.tsx`;
  
  if (!existsSync(path)) {
    console.warn(chalk.yellow('⚠️ Arquivo de rotas não encontrado. Rotas não foram atualizadas.'));
    return;
  }
  
  let routes = readFileSync(path, 'utf-8');
  
  // Adicionar import
  const importString = `import { ${modelUpper}Routes } from '@/pages/${modelUpper}/base/${modelUpper}Routes';`;
  if (!routes.includes(importString)) {
    routes = importString + '\n' + routes;
  }
  
  // Adicionar nas rotas privadas
  const routePattern = /export const PrivateRoutes = \{([\s\S]*?)\} satisfies Record<string, AppRoute>;/;
  const routeEntry = `  ...${modelUpper}Routes,`;
  
  if (!routes.includes(routeEntry)) {
    routes = routes.replace(routePattern, (match, content) => {
      return `export const PrivateRoutes = {\n${routeEntry}\n${content}} satisfies Record<string, AppRoute>;`;
    });
  }
  
  writeFileSync(path, routes, 'utf-8');
  console.info(chalk.blue('📍 Rotas atualizadas'));
}

function createDirIfNotExist(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function createFileIfNotExist(fileName, content) {
  if (!existsSync(fileName)) {
    writeFileSync(fileName, content, 'utf-8');
    console.info(chalk.green(`  ✓ ${fileName}`));
  } else {
    console.info(chalk.yellow(`  ⚠ ${fileName} (já existe)`));
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
