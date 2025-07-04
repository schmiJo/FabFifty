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

<script setup lang="ts">const uploadedUrl = ref('')

async function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  console.log('🔄 Starting upload for file:', file.name)

  // Step 1: Get the presigned URL from the backend
  const res = await $fetch('/api/upload-url', {
    method: 'POST',
    body: {
      fileName: file.name,
      fileType: file.type,
    }
  })

  console.log('📋 Got signed URL response:', res)

  // Step 2: Upload the file using the signed URL with required headers
  const uploadResponse = await fetch(res.url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'x-amz-acl': 'public-read'  // 🔑 Required for public access
    },
    body: file
  })

  console.log('📤 Upload response status:', uploadResponse.status)
  console.log('📤 Upload response headers:', Object.fromEntries(uploadResponse.headers.entries()))

  if (uploadResponse.ok) {
    console.log('✅ Upload successful!')
    console.log('🔗 File should be available at:', res.publicUrl)

    // Optional: test if it's publicly accessible
    setTimeout(async () => {
      try {
        const testResponse = await fetch(res.publicUrl, { method: 'HEAD' })
        console.log('🧪 File accessibility test:', testResponse.status === 200 ? '✅ ACCESSIBLE' : '❌ NOT ACCESSIBLE')
        console.log('🧪 Test response status:', testResponse.status)
      } catch (error) {
        console.error('🧪 File accessibility test failed:', error)
      }
    }, 2000)

    uploadedUrl.value = res.publicUrl
  } else {
    const errorText = await uploadResponse.text()
    console.error('❌ Upload failed with status:', uploadResponse.status)
    console.error('❌ Error response:', errorText)
  }
}

</script>
