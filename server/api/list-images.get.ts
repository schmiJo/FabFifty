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

        // Initialize S3 client for DigitalOcean Spaces
        const s3Client = new S3Client({
            endpoint: `https://${config.public.region}.digitaloceanspaces.com`,
            region: config.public.region,
            credentials: {
                accessKeyId: config.doSpacesKey,
                secretAccessKey: config.doSpacesSecret
            },
            forcePathStyle: false
        })

        console.log(`🔍 Listing images for category path: ${categoryPath}`)

        // List objects in the specified path
        const listCommand = new ListObjectsV2Command({
            Bucket: config.public.spaceName,
            Prefix: categoryPath.endsWith('/') ? categoryPath : `${categoryPath}/`,
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

        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : 'Failed to list images'
        })
    }
})
