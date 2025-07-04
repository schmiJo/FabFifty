<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Fab Fifty Uploader</h1>
    <input type="file" @change="handleFile" />
    <p v-if="uploadedUrl" class="mt-4">
      Uploaded to:
      <a :href="uploadedUrl" class="underline text-blue-500" target="_blank">{{ uploadedUrl }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
const uploadedUrl = ref('')

async function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  console.log('🔄 Starting upload for file:', file.name)

  const res = await $fetch('/api/upload-url', {
    method: 'POST',
    body: {
      fileName: file.name,
      fileType: file.type,
    }
  })

  console.log('📋 Got signed URL response:', res)

  const uploadResponse = await fetch(res.url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  })

  console.log('📤 Upload response status:', uploadResponse.status)
  console.log('📤 Upload response headers:', Object.fromEntries(uploadResponse.headers.entries()))

  if (uploadResponse.ok) {
    console.log('✅ Upload successful!')
    console.log('🔗 File should be available at:', `https://fifty.fra1.digitaloceanspaces.com/${res.key}`)
    
    // Wait a moment and test if the file is accessible
    setTimeout(async () => {
      try {
        const testResponse = await fetch(`https://fifty.fra1.digitaloceanspaces.com/${res.key}`, { method: 'HEAD' })
        console.log('🧪 File accessibility test:', testResponse.status === 200 ? '✅ ACCESSIBLE' : '❌ NOT ACCESSIBLE')
        console.log('🧪 Test response status:', testResponse.status)
      } catch (error) {
        console.error('🧪 File accessibility test failed:', error)
      }
    }, 2000)
    
    uploadedUrl.value = `https://fifty.fra1.digitaloceanspaces.com/${res.key}`
  } else {
    const errorText = await uploadResponse.text()
    console.error('❌ Upload failed with status:', uploadResponse.status)
    console.error('❌ Error response:', errorText)
    console.error('❌ Full response object:', uploadResponse)
  }
}
</script>
