import mysqldump from "mysqldump"
import path from "path"
import { z } from "zod"

const envSchema = z.object({
    database_name: z.string().min(1, "Database name is not defined in environment variables."),
    database__connection__host: z.string().min(1, "Database host is not defined in environment variables."),
    database__connection__user: z.string().min(1, "Database user is not defined in environment variables."),
    database__connection__password: z.string().min(1, "Database password is not defined in environment variables."),
    database__connection__port: z.string().min(1, "Database port is not defined in environment variables."),
    db_backup_filename: z.string().default("database-backup.sql")
})

function validateEnvVariables() {
    const parsed = envSchema.safeParse(process.env)
    if (!parsed.success) {
        throw new Error(parsed.error.errors.map(e => e.message).join("\n"))
    }
    return parsed.data
}

export async function createDump(directoryPath: string) {
    const {
        database_name,
        database__connection__host,
        database__connection__user,
        database__connection__password,
        database__connection__port,
        db_backup_filename
    } = validateEnvVariables()

    return mysqldump({
        connection: {
            host: database__connection__host,
            user: database__connection__user,
            password: database__connection__password,
            port: parseInt(database__connection__port),
            database: database_name,
        },
        dumpToFile: path.join(directoryPath, db_backup_filename),
    })
}
