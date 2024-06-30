FROM node:alpine AS base
RUN apk --no-cache add curl && corepack enable

FROM base AS builder

ENV NUXT_TEST_VAR=${NUXT_TEST_VAR}
RUN echo ${NUXT_TEST_VAR}

WORKDIR /app
COPY . .
RUN pnpm install && pnpm build


FROM base AS runtime

COPY --from=builder /app/.output /app/.output
WORKDIR /app

ENTRYPOINT ["node", ".output/server/index.mjs"]
