export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    return {
        environment: process.env.NODE_ENV,
        hasDoSpacesKey: !!config.doSpacesKey,
        hasDoSpacesSecret: !!config.doSpacesSecret,
        doSpacesKeyLength: config.doSpacesKey?.length || 0,
        doSpacesSecretLength: config.doSpacesSecret?.length || 0,
        region: config.public.region,
        spaceName: config.public.spaceName,
        processEnv: {
            NUXT_DO_SPACES_KEY: process.env.NUXT_DO_SPACES_KEY ? 'SET' : 'NOT SET',
            NUXT_DO_SPACES_SECRET: process.env.NUXT_DO_SPACES_SECRET ? 'SET' : 'NOT SET'
        }
    }
})
