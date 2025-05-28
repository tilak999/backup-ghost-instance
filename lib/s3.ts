import { S3Client } from "@aws-sdk/client-s3"

function createS3Client() {
    // check if all env variable are set
    const { s3_endpoint, s3_access_key, s3_secret_key } = process.env
    if (!s3_endpoint) throw new Error("s3_endpoint is not set")
    if (!s3_access_key) throw new Error("s3_access_key is not set")
    if (!s3_secret_key) throw new Error("s3_secret_key is not set")

    return new S3Client({
        region: "auto",
        endpoint: s3_endpoint, // Replace with your MinIO endpoint
        credentials: {
            accessKeyId: s3_access_key, // Replace with your MinIO access key
            secretAccessKey: s3_secret_key, // Replace with your MinIO secret key
        },
        forcePathStyle: true,
    })
}

export const s3Client = createS3Client()
