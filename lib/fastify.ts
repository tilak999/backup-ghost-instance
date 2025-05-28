import Fastify from "fastify"

const FastifyServer = Fastify({
    logger: {
        level: process.env.NODE_ENV == "developement" ? "debug" : "info",
    },
})

const logger = FastifyServer.log

export { FastifyServer, logger }
