import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()

        console.log('🔧 Health check - Testing DigitalOcean Spaces connection')
        console.log('Config check:', {
            hasDoSpacesKey: !!config.doSpacesKey,
            hasDoSpacesSecret: !!config.doSpacesSecret,
            doSpacesKeyPrefix: config.doSpacesKey?.substring(0, 4) + '...',
            region: config.public.region,
            spaceName: config.public.spaceName
        })

        if (!config.doSpacesKey || !config.doSpacesSecret) {
            return {
                success: false,
                error: 'Missing credentials',
                details: 'DigitalOcean Spaces credentials not configured'
            }
        }

        // Initialize S3 client
        const s3Client = new S3Client({
            endpoint: `https://${config.public.region}.digitaloceanspaces.com`,
            region: config.public.region,
            credentials: {
                accessKeyId: config.doSpacesKey,
                secretAccessKey: config.doSpacesSecret
            },
            forcePathStyle: false,
            maxAttempts: 3,
            requestHandler: {
                metadata: { handlerProtocol: 'https' }
            }
        })

        // Test bucket access
        const headBucketCommand = new HeadBucketCommand({
            Bucket: config.public.spaceName
        })

        await s3Client.send(headBucketCommand)

        return {
            success: true,
            message: 'DigitalOcean Spaces connection successful',
            config: {
                endpoint: `https://${config.public.region}.digitaloceanspaces.com`,
                region: config.public.region,
                bucket: config.public.spaceName
            }
        }

    } catch (error) {
        console.error('❌ Health check failed:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error && typeof error === 'object' && '$metadata' in error ? error.$metadata : null
        }
    }
})
