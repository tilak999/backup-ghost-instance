import { archiveAndUploadRouter } from "./archive-and-upload"
import { FastifyServer } from "../lib/fastify"
import { healthCheck } from "./health-check"

export const server = () => {
    archiveAndUploadRouter(FastifyServer)
    healthCheck(FastifyServer)
    return FastifyServer
}
