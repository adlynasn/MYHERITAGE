document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', document.getElementById('productImage').files[0]);
  
    try {
      const uploadResponse = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        imageFilename: uploadData.fileUrl,
      };
  
      const productResponse = await fetch(`${api}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const product = await productResponse.json();
      console.log('Product added:', product);
    } catch (error) {
      console.error('Error:', error);
    }
  });
  