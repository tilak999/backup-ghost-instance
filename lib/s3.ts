import { S3Client } from "@aws-sdk/client-s3"

function createS3Client() {
    // check if all env variable are set
    const { AWS_ENDPOINTS, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env
    if (!AWS_ENDPOINTS) throw new Error("s3_endpoint is not set")
    if (!AWS_ACCESS_KEY_ID) throw new Error("s3_access_key is not set")
    if (!AWS_SECRET_ACCESS_KEY) throw new Error("s3_secret_key is not set")

    return new S3Client({
        region: "auto",
        endpoint: AWS_ENDPOINTS, // Replace with your MinIO endpoint
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID, // Replace with your MinIO access key
            secretAccessKey: AWS_SECRET_ACCESS_KEY, // Replace with your MinIO secret key
        },
        forcePathStyle: true,
    })
}

export const s3Client = createS3Client()
