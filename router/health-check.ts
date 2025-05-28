import { FastifyInstance } from "fastify"

export const healthCheck = (server: FastifyInstance) => {
    server.get("/healthcheck", async () => {
        return { ping: "pong!" }
    })
}
