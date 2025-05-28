import * as fs from "fs"
import archiver from "archiver"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import path from "path"

interface ArchiveServiceOptions {
    s3Client: S3Client
    bucketName: string
}

export class ArchiveService {
    private s3Client: S3Client
    private bucketName: string

    constructor(options: ArchiveServiceOptions) {
        this.s3Client = options.s3Client
        this.bucketName = options.bucketName
    }

    async archive(directoryToArchive: string, outputFile: string) {
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

    deleteFile(path: string) {
        fs.unlinkSync(path)
    }

    async uploadToS3(archiveName: string, archiveFilePath: string) {
        const uploadParams = {
            Bucket: this.bucketName,
            Key: archiveName,
            Body: fs.createReadStream(archiveFilePath),
        }
        const command = new PutObjectCommand(uploadParams)
        await this.s3Client.send(command)
    }

    public async archiveAndUploadDirectory(directoryPath: string, archiveName: string, s3Path?: string) {
        const archiveFilePath = path.join("/tmp", archiveName) // Use a temporary directory
        const contentLength = await this.archive(directoryPath, archiveFilePath)
        await this.uploadToS3(s3Path ? path.join(s3Path, archiveName) : archiveName, archiveFilePath)
        this.deleteFile(archiveFilePath)
        return { contentLength }
    }
}
