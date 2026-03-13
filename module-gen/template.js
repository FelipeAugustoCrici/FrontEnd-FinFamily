import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const applicationDir = `${__dirname}/../src/pages/`;

export const templates = {
  // CRUD Pages
  list: {
    template: readFileSync(`${__dirname}/templates/crud/list.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: '',
    name: '{ModelUpper}List',
  },
  create: {
    template: readFileSync(`${__dirname}/templates/crud/create.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: '',
    name: '{ModelUpper}Create',
  },
  edit: {
    template: readFileSync(`${__dirname}/templates/crud/edit.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: '',
    name: '{ModelUpper}Edit',
  },
  // Components (sem tabela específica - usa global)
  form: {
    template: readFileSync(`${__dirname}/templates/crud/form.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'components',
    name: '{ModelUpper}Form',
  },
  header: {
    template: readFileSync(`${__dirname}/templates/crud/header.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'components',
    name: '{ModelUpper}Header',
  },
  filters: {
    template: readFileSync(`${__dirname}/templates/crud/filters.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'components',
    name: '{ModelUpper}Filters',
  },
  formHeader: {
    template: readFileSync(`${__dirname}/templates/crud/formHeader.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'components',
    name: '{ModelUpper}FormHeader',
  },
  // Hooks
  useFilters: {
    template: readFileSync(`${__dirname}/templates/hook/useFilters.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'hooks',
    name: 'use{ModelUpper}Filters',
  },
  useItems: {
    template: readFileSync(`${__dirname}/templates/hook/useItems.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'hooks',
    name: 'use{ModelUpper}s',
  },
  useItem: {
    template: readFileSync(`${__dirname}/templates/hook/useItem.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'hooks',
    name: 'use{ModelUpper}',
  },
  useCreate: {
    template: readFileSync(`${__dirname}/templates/hook/useCreate.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'hooks',
    name: 'useCreate{ModelUpper}',
  },
  useUpdate: {
    template: readFileSync(`${__dirname}/templates/hook/useUpdate.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'hooks',
    name: 'useUpdate{ModelUpper}',
  },
  useDelete: {
    template: readFileSync(`${__dirname}/templates/hook/useDelete.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'hooks',
    name: 'useDelete{ModelUpper}',
  },
  // Base
  types: {
    template: readFileSync(`${__dirname}/templates/base/types.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'types',
    name: '{ModelLower}.types',
  },
  service: {
    template: readFileSync(`${__dirname}/templates/base/service.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'services',
    name: '{ModelLower}.service',
  },
  routes: {
    template: readFileSync(`${__dirname}/templates/base/routes.txt`, 'utf-8'),
    dir: applicationDir,
    subDir: 'base',
    name: '{ModelUpper}Routes',
  },
};
