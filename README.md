# premissas
- hoje o projeto não está...
-- utilizando a ideia de SSR
-- tratanto internationalização (i18n), tudo está em PT-BR chumbado

Versões de ambiente usadas pra desolver esse projeto: nodejs `v8.11.3` e npm `6.3.0`

# Problemas conhecidos
É importante atualizar o nodejs para pelo menos a versão `v8.11.3` porque senão vai ocorrer erros de sintaxe no projeto
durante a execução do bundle, isso ocorre em casos quando usar Arrow Function, Async, Await, etc.

## npm run test
Error: Cannot find module '/home/user/test/node_modules/jest-cli'
Solução tá aqui: https://github.com/wmonk/create-react-app-typescript/issues/154

Problema:
    TypeError: environment.teardown is not a function
Solução:
    https://github.com/facebook/jest/issues/6393

# Tema
## Cor primária (main): `00aeef`
## Cor primária (dark): 006fb6
## Cor secundária: `00cf74`

