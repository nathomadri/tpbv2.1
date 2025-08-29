document.getElementById('upload-btn').addEventListener('click', async () => {
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block';

    try {
        // Retrieve form data
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const location = document.getElementById('location').value;
        const category = document.getElementById('category').value;
        const subcategory = document.getElementById('subcategory').value;
        const files = document.getElementById('images').files;

        if (!category || !subcategory) {
            throw new Error('Category or subcategory is missing.');
        }

        let imageUrls = [];

        // Upload each image to Firebase Storage
        for (const file of files) {
            const imgRef = storageRef(storage, `images/${file.name}`);
            await uploadBytes(imgRef, file);
            const url = await getDownloadURL(imgRef);  // Get the download URL
            imageUrls.push(url);  // Store URLs in an array
        }

        // Create a new property object
        const newProperty = { title, price, location, imageUrls };

        // Ensure path construction is correct
        const path = `categories/${category}/${subcategory}`;
        await push(ref(database, path), newProperty);  // Push the data to Firebase Database

        // Reload properties to reflect the newly uploaded one
        loadProperties(category, subcategory);
    } catch (error) {
        console.error(error);
        alert('Failed to upload property: ' + error.message);
    } finally {
        loadingIndicator.style.display = 'none';  // Hide loading indicator
    }
});
