# premissas
- hoje o projeto não está...
-- utilizando a ideia de SSR
-- tratanto internationalização (i18n), tudo está em PT-BR chumbado

# Problemas conhecidos
É importante atualizar o nodejs para pelo menos a versão `v8.11.3` porque senão vai ocorrer erros de sintaxe no projeto
durante a execução do bundle, isso ocorre em casos quando usar Arrow Function, Async, Await, etc.


# Tema
## Cor primária (main): `00aeef`
## Cor primária (dark): 006fb6
## Cor secundária: `00cf74`




- criar a aplicação frontend

# métodos

- validarAExistenciaDeUmToken
token não informado (não existe)
token inválido
token válido

- adicionarNovoToken
token inválido
token válido

- DeviceStatus (ou DeviceInfo)
Não encontrado
Encontrado

-- status
-- address

- getExames (com filtros)

- criarNovoExame
    - email (pode ser mais de um email)
    - nome
    - telefone (pode ser mais de um telefone)
    - data / hora

- Transmissão
Abre a tela de transmissão com player pra assistir e botão pra iniciar transmissão.
-- Parar transmissão

- Desativar Exame
- Reenviar Exame

# métodos
- getInfo
Pode retornar m3u8 ou mp4. Se tiver mp4 é porque é vod.

# Telas
- informar token
- buscar device
- dashboard
    - modal de desativar exame
- novo exame
- transmissão
- reenviar (igual novo exame, mas a data e hora não pode alterar)


# Aplicação da pessoa que vai assistir
- como identificar a transição de live para vod.
