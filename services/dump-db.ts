import mysqldump from "mysqldump"
import path from "path"

function validateEnvVariables() {
    const { db_name, db_host, db_password, db_port, db_user, db_dump_filename } = process.env
    if (!db_name) {
        throw new Error("Database name is not defined in environment variables.")
    }
    if (!db_host) {
        throw new Error("Database host is not defined in environment variables.")
    }
    if (!db_user) {
        throw new Error("Database user is not defined in environment variables.")
    }
    if (!db_password) {
        throw new Error("Database password is not defined in environment variables.")
    }
    if (!db_port) {
        throw new Error("Database port is not defined in environment variables.")
    }
    if (!db_dump_filename) {
        throw new Error("Database db_dump_filename is not defined in environment variables.")
    }
    return { db_name, db_host, db_password, db_port, db_user, db_dump_filename }
}

export async function createDump(directoryPath: string) {
    const { db_name, db_host, db_password, db_port, db_user, db_dump_filename } = validateEnvVariables()
    return mysqldump({
        connection: {
            host: db_host,
            user: db_user,
            password: db_password,
            port: parseInt(db_port),
            database: db_name,
        },
        dumpToFile: path.join(directoryPath, db_dump_filename),
    })
}
