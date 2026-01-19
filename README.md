# API Study English IA

Backend em Node.js/Express para uma plataforma de aulas de inglês que vai usar a IA Gemini Flash para treinar gramática e registrar vocabulário. No estágio atual, a API entrega cadastro/autenticação de usuários (local ou Google), login JWT, listagem de contas e troca de senha.

## Tecnologias
- Node.js (ESM) + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken) e bcrypt para autenticação/senhas
- Yup para validação de payload
- Nodemon para desenvolvimento

## Arquitetura rápida
- `src/app.js`: instancia o Express e registra as rotas.
- `src/server.js`: carrega variáveis de ambiente, conecta no MongoDB e sobe o servidor.
- `src/routes/users.routes.js`: rotas de usuários/autenticação.
- `src/controllers` → lógica de entrada/saída HTTP.
- `src/services` → regras de negócio (hash/validação de senha, emissão de JWT).
- `src/repositories` → acesso ao Mongo via Mongoose.
- `src/models` → schemas Mongoose (User).
- `src/middlewares` → `auth` (JWT) e `validate` (Yup).
- `src/schema` → schemas de validação (Yup).

## Configuração e execução
1. Crie um arquivo `.env` na raiz do projeto com algo como:
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://<user>:<pass>@<host>/<db>?retryWrites=true&w=majority
   JWT_SECRET=<chave-secreta>
   ```
2. Instale dependências: `npm install`
3. Desenvolvimento com reload: `npm run dev`
4. Execução simples: `npm start`

## Rotas atuais
- `GET /` → healthcheck (`{ status: "ok" }`)

### Usuários e auth
- `POST /users/local`
  - Body: `{ "name", "email", "password" }`
  - Retorna `201` com o usuário criado (sem `passwordHash`).
  - Erros: `409 EMAIL_IN_USE`, `400` validação.
- `POST /users/google`
  - Body: `{ "name", "googleId", "email"?, "avatarUrl"? }`
  - Retorna `201` com o usuário.
  - Erros: `409` se `googleId` ou `email` já existirem.
- `POST /auth/login`
  - Body: `{ "email", "password" }`
  - Retorna `200` com `{ user, token }` (JWT de 1 dia).
  - Erros: `401 INVALID_CREDENTIALS`.
- `GET /users` (protegida)
  - Header: `Authorization: Bearer <token>`
  - Retorna `200` com a lista de usuários (sem `passwordHash`).
- `PATCH /users/:id/password` (protegida)
  - Body: `{ "currentPassword", "newPassword" }`
  - Só permite o próprio usuário (`403` caso contrário).
  - Respostas: `204` sucesso, `404` usuário inexistente, `400` senha atual inválida.

### Exemplo rápido (login + rota protegida)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "secret123" }'

# Depois, listar usuários
curl http://localhost:3000/users \
  -H "Authorization: Bearer <TOKEN_AQUI>"
```

## Tratamento de erros e validação
- Payloads são validados via Yup (erro `400` com `{ error: "Validation error", details: [...] }`).
- Autenticação via JWT (`Authorization: Bearer <token>`); tokens inválidos retornam `401`.

## Roadmap (IA e produto)
1. **Prática guiada de gramática** com Gemini Flash (geração de exercícios, explicações e correções).
2. **Vocabulário ativo**: cadastro de palavras/expressões com exemplos, tags e revisão espaçada.
3. **Sessões de treino**: endpoints para sessões cronometradas, avaliação automática e histórico por usuário.
4. **Métricas e progresso**: streaks, tempo de estudo, nível de proficiência por habilidade.
5. **Integração Google/Gemini**: segurança de tokens, limites de uso e monitoramento.

## Scripts npm
- `npm run dev` → nodemon com watch.
- `npm start` → start simples em produção.
- `npm test` → placeholder atual (sem testes implementados).

## Boas práticas
- Não versionar `.env` ou segredos.
- Usar `Authorization: Bearer <token>` nas rotas protegidas.
- Retornos são JSON e seguem HTTP status adequados (201 criação, 204 sem conteúdo, 400/401/403/404 para falhas).
