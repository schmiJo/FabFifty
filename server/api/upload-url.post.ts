import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
    console.log('📤 Upload URL request received')

    try {
        const body = await readBody(event)
        console.log('📋 Request body:', { fileName: body?.fileName, fileType: body?.fileType, path: body?.path })

        if (!body?.fileName || !body?.fileType) {
            console.error('❌ Missing fileName or fileType in request body')
            throw createError({
                statusCode: 400,
                statusMessage: 'fileName and fileType are required',
            })
        }

        const config = useRuntimeConfig()
        const { doSpacesKey, doSpacesSecret } = config
        const spaceName = 'fifty'

        if (!doSpacesKey || !doSpacesSecret) {
            console.error('❌ Missing DigitalOcean Spaces credentials')
            throw createError({
                statusCode: 500,
                statusMessage: 'Server misconfigured',
            })
        }

        const s3Client = new S3Client({
            endpoint: 'https://fra1.digitaloceanspaces.com',
            credentials: {
                accessKeyId: doSpacesKey,
                secretAccessKey: doSpacesSecret,
            },
            region: 'fra1',
            forcePathStyle: false,
        })

        const basePath = body.path || 'images'
        const key = `${basePath}/${crypto.randomUUID()}-${body.fileName}`
        console.log('🔑 Generated file key:', key)

        const command = new PutObjectCommand({
            Bucket: spaceName,
            Key: key,
            ContentType: body.fileType,
            ACL: 'public-read',
        })

        const url = await getSignedUrl(s3Client, command, {
            expiresIn: 60,
            signingRegion: 'fra1',
            signingService: 's3',
        })

        const publicUrl = `https://${spaceName}.fra1.cdn.digitaloceanspaces.com/${key}`

        return {
            url,       // Presigned URL to upload with correct headers
            key,       // Object key
            publicUrl, // Final public image URL after upload
            headers: {
                'x-amz-acl': 'public-read',
                'Content-Type': body.fileType,
            },
        }
    } catch (error) {
        console.error('❌ Failed to generate signed URL:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate upload URL',
        })
    }
})
