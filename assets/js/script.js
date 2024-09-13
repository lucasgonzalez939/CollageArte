document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.getElementById('image-container');
    const canvas = document.getElementById('collage-canvas');
    const downloadBtn = document.getElementById('download-btn');
    const ctx = canvas.getContext('2d');
    let images = []; // Array to store images and their positions
    let dragImage = null; // The image currently being dragged
    let offsetX, offsetY; // Mouse offset when dragging
  
    // Function to resize the canvas to fit its parent container
    function resizeCanvas() {
      const parent = canvas.parentElement; // Get the parent container
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      drawImages(); // Redraw images to fit new canvas size
    }
  
    // Call resizeCanvas initially and also on window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call to set the size
  
    // Load images dynamically from the images folder
    const imageNames = ['botella1.png','potecito3.png', 'botella2.png','retazocarton1.png', 'botella3.png','retazocarton2.png', 'cd1.png', 'retazocarton3.png', 'cd2.png', 'retazocarton4.png', 'cucharitaazulremovebgpreview.png','tapaceleste1.png', 'cucharitarojaremovebgpreview.png','tapitaamarilla1.png', 'plasticodeunsolousocucharita.png','tapitaazul1.png', 'plasticodeunsolousoplato.png','tapitaroja1.png', 'potecito1.png','tapitaroja2.png', 'potecito2.png','tapitaverde1.png']; // Replace with your image names
    imageNames.forEach((imageName) => {
      const img = document.createElement('img');
      img.src = `assets/images/${imageName}`;
      img.draggable = true;
      img.addEventListener('dragstart', (e) => onDragStart(e, img));
      imageContainer.appendChild(img);
    });
  
    // Handle drag and drop from image container to canvas
    function onDragStart(event, img) {
      event.dataTransfer.setData('text/plain', img.src);
    }
  
    canvas.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
  
    canvas.addEventListener('drop', (event) => {
      event.preventDefault();
  
      const imageSrc = event.dataTransfer.getData('text/plain');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        // Calculate size while maintaining aspect ratio
        const maxWidth = 100;
        const maxHeight = 100;
        let width = img.width;
        let height = img.height;
  
        const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
        width *= scaleFactor;
        height *= scaleFactor;
  
        // Store the image in the images array
        images.push({ img, x: x - width / 2, y: y - height / 2, width, height });
  
        // Draw all images on the canvas
        drawImages();
      };
    });
  
    // Draw all images on the canvas
    function drawImages() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      images.forEach((image) => {
        ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
      });
    }
  
    // Handle dragging on canvas
    canvas.addEventListener('mousedown', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      // Check if an image is clicked
      dragImage = images.find((image) =>
        x >= image.x &&
        x <= image.x + image.width &&
        y >= image.y &&
        y <= image.y + image.height
      );
  
      if (dragImage) {
        offsetX = x - dragImage.x; // Calculate the offset between mouse and image position
        offsetY = y - dragImage.y;
  
        // Move the image with the mouse
        canvas.addEventListener('mousemove', onDrag);
        canvas.addEventListener('mouseup', onStopDrag);
      }
    });
  
    function onDrag(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      // Update the image position
      dragImage.x = x - offsetX;
      dragImage.y = y - offsetY;
  
      // Redraw the canvas
      drawImages();
    }
  
    function onStopDrag() {
      // Stop moving the image
      canvas.removeEventListener('mousemove', onDrag);
      canvas.removeEventListener('mouseup', onStopDrag);
      dragImage = null;
    }
  
    // Handle double-click to delete an image
    canvas.addEventListener('dblclick', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      // Find the image that was double-clicked
      const clickedImageIndex = images.findIndex((image) =>
        x >= image.x &&
        x <= image.x + image.width &&
        y >= image.y &&
        y <= image.y + image.height
      );
  
      // If an image was double-clicked, remove it from the array
      if (clickedImageIndex !== -1) {
        images.splice(clickedImageIndex, 1);
        drawImages(); // Redraw the canvas without the deleted image
      }
    });
  
    // Download the collage
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'collage.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });
  
