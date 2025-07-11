import { FastifyInstance } from "fastify"
import { archiveAndUploadDirectory } from "../services/archive-service"
import { logger } from "../lib/fastify"
import { z } from "zod"
import { createDump } from "../services/dump-db"

const archiveAndUploadBodySchema = z.object({
    directoryPath: z.string().default(process.env.data_directory || "/data"),
    filename: z.string().min(4, "must be minimum 3 charecters").endsWith(".zip", "must end with .zip").default("backup.zip"),
})

export const archiveAndUploadRouter = (server: FastifyInstance) => {
    server.post("/archive-and-upload", async (request, reply) => {
        const result = archiveAndUploadBodySchema.safeParse(request.body)

        if (!result.success) {
            logger.error({ error: result.error.flatten() }, "input validation fail")
            return reply.status(400).send({ success: false, message: result.error.issues })
        }

        try {
            const { directoryPath, filename } = result.data
            await createDump(directoryPath)
            const { contentLength } = await archiveAndUploadDirectory(
                directoryPath,
                filename
            )
            reply.send({
                success: true,
                contentLength,
                message: "Directory archived and uploaded.",
            })
        } catch (error) {
            logger.error(error, "Error archiving and uploading")
            reply.status(500).send({
                success: false,
                message: "Failed to archive and upload directory.",
            })
        }
    })
}
