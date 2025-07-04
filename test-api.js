// Simple test script to verify the API works
const testData = {
    fileName: 'test-image.jpg',
    fileType: 'image/jpeg',
    path: 'images/bester-teller-buffet'
}

console.log('Testing API endpoint with:', testData)

fetch('http://localhost:3003/api/upload-url', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
})
    .then(response => response.json())
    .then(data => {
        console.log('✅ API Response:', data)
    })
    .catch(error => {
        console.error('❌ API Error:', error)
    })
