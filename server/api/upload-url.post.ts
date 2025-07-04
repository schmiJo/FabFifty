import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

export default defineEventHandler(async (event) => {
    console.log('📤 Upload URL request received')

    const body = await readBody(event)
    console.log('📋 Request body:', { fileName: body.fileName, fileType: body.fileType })

    if (!body?.fileName || !body?.fileType) {
        console.error('❌ Missing fileName or fileType in request body')
        throw createError({
            statusCode: 400,
            statusMessage: 'fileName and fileType are required',
        })
    }

    const config = useRuntimeConfig()
    const { doSpacesKey, doSpacesSecret } = config
    const spaceName = 'fifty' // ⬅️ Static space name

    if (!doSpacesKey || !doSpacesSecret) {
        console.error('❌ Missing DigitalOcean Spaces credentials')
        throw createError({
            statusCode: 500,
            statusMessage: 'Server misconfigured',
        })
    }

    console.log('🔐 Credentials configured:', {
        keyPresent: !!doSpacesKey,
        secretPresent: !!doSpacesSecret,
        spaceName: spaceName
    })

    const s3Client = new S3Client({
        endpoint: 'https://fra1.digitaloceanspaces.com',
        credentials: {
            accessKeyId: doSpacesKey,
            secretAccessKey: doSpacesSecret,
        },
        region: 'fra1',
        forcePathStyle: false,
    })

    console.log('🔗 S3 client initialized with endpoint: https://fra1.digitaloceanspaces.com')

    const key = `images/${uuid()}-${body.fileName}`
    console.log('🔑 Generated file key:', key)

    try {
        console.log('🚀 Starting signed URL generation...')
        console.log('📝 Parameters:', {
            endpoint: 'https://fra1.digitaloceanspaces.com',
            bucket: spaceName,
            key: key,
            contentType: body.fileType,
            expires: 60
        })

        const command = new PutObjectCommand({
            Bucket: spaceName, // Use the space name as bucket
            Key: key,
            ContentType: body.fileType,
            ACL: 'public-read',
        })

        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 })

        console.log('✅ Signed URL generated successfully')
        console.log('🪣 Space: fifty.fra1.digitaloceanspaces.com')
        console.log('⏱️ URL expires in 60 seconds')
        console.log('🔗 Generated URL length:', url.length)
        console.log('🌐 Generated URL:', url)
        console.log('📁 File will be accessible at:', `https://fifty.fra1.digitaloceanspaces.com/${key}`)

        // Let's also verify the URL format
        console.log('🔍 URL Analysis:', {
            hasSignature: url.includes('X-Amz-Signature'),
            hasCredential: url.includes('X-Amz-Credential'),
            hasExpires: url.includes('X-Amz-Expires'),
            domain: url.split('/')[2],
            path: url.split('/').slice(3, -1).join('/'),
            fileName: url.split('/').pop()?.split('?')[0]
        })

        return { url, key }
    } catch (error) {
        console.error('❌ Failed to generate signed URL:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate upload URL',
        })
    }
})

