import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const categoryPath = query.path as string

        if (!categoryPath) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Category path is required'
            })
        }

        const config = useRuntimeConfig()

        // Validate required environment variables
        if (!config.doSpacesKey || !config.doSpacesSecret) {
            console.error('❌ Missing DigitalOcean Spaces credentials')
            console.error('Available config keys:', Object.keys(config))
            console.error('Environment variables:', {
                NUXT_DO_SPACES_KEY: process.env.NUXT_DO_SPACES_KEY ? 'SET' : 'NOT SET',
                NUXT_DO_SPACES_SECRET: process.env.NUXT_DO_SPACES_SECRET ? 'SET' : 'NOT SET'
            })
            throw createError({
                statusCode: 500,
                statusMessage: 'DigitalOcean Spaces credentials not configured'
            })
        }

        console.log('🔧 S3 Configuration:', {
            endpoint: `https://${config.public.region}.digitaloceanspaces.com`,
            region: config.public.region,
            bucket: config.public.spaceName,
            hasCredentials: !!(config.doSpacesKey && config.doSpacesSecret)
        })

        // Initialize S3 client for DigitalOcean Spaces
        const s3Client = new S3Client({
            endpoint: `https://${config.public.region}.digitaloceanspaces.com`,
            region: config.public.region,
            credentials: {
                accessKeyId: config.doSpacesKey,
                secretAccessKey: config.doSpacesSecret
            },
            forcePathStyle: false,
            // Add additional configuration for better compatibility
            maxAttempts: 3,
            requestHandler: {
                metadata: { handlerProtocol: 'https' }
            }
        })

        console.log(`🔍 Listing images for category path: ${categoryPath}`)
        console.log(`🪣 Bucket: ${config.public.spaceName}`)

        // Ensure the prefix is properly formatted
        let prefix = categoryPath.trim()

        // Remove leading slash if present
        if (prefix.startsWith('/')) {
            prefix = prefix.substring(1)
        }

        // Ensure trailing slash
        if (!prefix.endsWith('/')) {
            prefix = `${prefix}/`
        }

        console.log(`📁 Cleaned prefix: ${prefix}`)

        // List objects in the specified path
        const listCommand = new ListObjectsV2Command({
            Bucket: config.public.spaceName,
            Prefix: prefix,
            MaxKeys: 1000
        })

        console.log('📋 ListObjectsV2Command parameters:', {
            Bucket: config.public.spaceName,
            Prefix: prefix,
            MaxKeys: 1000
        })

        const response = await s3Client.send(listCommand)

        // Filter and format the results to only include image files
        const images = (response.Contents || [])
            .filter(item => {
                // Only include actual files (not directories) and image extensions
                return item.Key &&
                    !item.Key.endsWith('/') &&
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(item.Key)
            })
            .map(item => ({
                key: item.Key,
                url: `https://${config.public.spaceName}.${config.public.region}.digitaloceanspaces.com/${item.Key}`,
                lastModified: item.LastModified,
                size: item.Size,
                fileName: item.Key?.split('/').pop() || 'unknown'
            }))
            .sort((a, b) => {
                // Sort by last modified date, newest first
                if (!a.lastModified || !b.lastModified) return 0
                return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
            })

        console.log(`📸 Found ${images.length} images in ${categoryPath}`)

        return {
            success: true,
            categoryPath,
            totalImages: images.length,
            images
        }

    } catch (error) {
        console.error('❌ Error listing images:', error)

        // Log more detailed error information for debugging
        if (error instanceof Error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack
            })
        }

        // Check if it's a specific AWS SDK error
        if (error && typeof error === 'object' && '$metadata' in error) {
            console.error('AWS SDK Error metadata:', error.$metadata)
            console.error('AWS SDK Error code:', (error as any).Code)
        }

        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : 'Failed to list images'
        })
    }
})
