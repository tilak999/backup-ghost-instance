import * as fs from "fs"
import archiver from "archiver"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import path from "path"
import { s3Client } from "../lib/s3"

export async function archive(directoryToArchive: string, outputFile: string) {
    return new Promise<number>((resolve, reject) => {
        const output = fs.createWriteStream(outputFile)
        const archive = archiver("zip", { zlib: { level: 9 } }) // Use zip compression
        archive.on("error", function (err) {
            reject(err)
        })
        archive.directory(directoryToArchive, false) // Add the directory contents to the archive
        archive.pipe(output)
        archive.finalize()
        output.on("close", function () {
            resolve(archive.pointer())
        })
    })
}

function deleteFile(path: string) {
    fs.unlinkSync(path)
}

async function uploadToS3(archiveName: string, archiveFilePath: string) {
    const bucketName = process.env.s3_bucket
    if (!bucketName) {
        throw new Error("S3 bucket name is not defined in environment variables.")
    }
    const uploadParams = {
        Bucket: bucketName,
        Key: archiveName,
        Body: fs.createReadStream(archiveFilePath),
    }
    const command = new PutObjectCommand(uploadParams)
    await s3Client.send(command)
}

export async function archiveAndUploadDirectory(directoryPath: string, archiveName: string) {
    const s3Path = process.env.s3_path
    const archiveFilePath = path.join("/tmp", archiveName) // Use a temporary directory
    const contentLength = await archive(directoryPath, archiveFilePath)
    await uploadToS3(s3Path ? path.join(s3Path, archiveName) : archiveName, archiveFilePath)
    deleteFile(archiveFilePath)
    return { contentLength }
}

