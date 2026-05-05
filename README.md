# PacketAds

Bot Discord que envia anúncios periódicos do site [packetloss.com.br](https://packetloss.com.br) — rankings e próximas partidas — em um canal configurável via painel.

## Requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 10
- Bot Discord criado no [Discord Developer Portal](https://discord.com/developers/applications)

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/sistematico/advertisements.git
cd advertisements
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DISCORD_TOKEN=seu_token_do_bot_aqui
PACKETLOSS_API_URL=https://packetloss.com.br
BOT_API_TOKEN=seu_token_da_api_aqui
```

| Variável             | Descrição                                      |
| -------------------- | ---------------------------------------------- |
| `DISCORD_TOKEN`      | Token do bot obtido no Discord Developer Portal |
| `PACKETLOSS_API_URL` | URL base da API do PacketLoss                  |
| `BOT_API_TOKEN`      | Token de autorização da API                    |

### 4. Compile o projeto

```bash
pnpm build
```

## Execução

### Desenvolvimento (com hot-reload)

```bash
pnpm dev
```

### Produção

```bash
pnpm start
```

### Verificar tipos sem compilar

```bash
pnpm check
```

## Execução como serviço (systemd)

O arquivo de serviço está disponível em `files/packetads.service`.

### 1. Copie o arquivo de serviço

```bash
sudo cp files/packetads.service /etc/systemd/system/packetads.service
```

### 2. Ajuste o arquivo conforme o seu ambiente

Edite `/etc/systemd/system/packetads.service` e verifique:

- `User` — usuário que irá executar o bot
- `WorkingDirectory` — caminho absoluto para a pasta do projeto
- `ExecStart` — caminho do executável `pnpm` no sistema

### 3. Ative e inicie o serviço

```bash
sudo systemctl daemon-reload
sudo systemctl enable packetads
sudo systemctl start packetads
```

### 4. Verifique o status

```bash
sudo systemctl status packetads
```

### Logs

```bash
sudo journalctl -u packetads -f
```

## Tipos de mensagem

O tipo de mensagem enviada é configurado via painel (`messageType`):

| Tipo               | Descrição                                     |
| ------------------ | --------------------------------------------- |
| `full_rankings`    | Envia ranking geral e semanal juntos          |
| `rankings_total`   | Envia apenas o ranking geral                  |
| `rankings_weekly`  | Envia apenas o ranking semanal                |
| `upcoming_match`   | Envia informações da próxima partida agendada |

## Licença

ISC © [sistematico](https://github.com/sistematico)
