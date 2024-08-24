document.addEventListener('DOMContentLoaded', function () {
    const collageArea = document.getElementById('collage-area');
    const images = document.querySelectorAll('.draggable-image');
    let activeImage = null;
    let initialMouseX = 0;
    let initialMouseY = 0;
    let imageStartX = 0;
    let imageStartY = 0;

    images.forEach(image => {
        image.addEventListener('mousedown', function (e) {
            // Only allow dragging within the collage area
            if (collageArea.contains(e.target)) {
                activeImage = e.target;
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;

                // Get the image's starting position
                imageStartX = parseInt(activeImage.style.left || 0, 10);
                imageStartY = parseInt(activeImage.style.top || 0, 10);

                // Prevent default dragging behavior
                e.preventDefault();

                document.addEventListener('mousemove', onDrag);
                document.addEventListener('mouseup', onStopDrag);
            }
        });

        // Prevent default dragging for images
        image.addEventListener('dragstart', (e) => e.preventDefault());
    });

    function onDrag(e) {
        if (activeImage) {
            // Calculate new position
            const deltaX = e.clientX - initialMouseX;
            const deltaY = e.clientY - initialMouseY;

            // Set the new position
            activeImage.style.left = `${imageStartX + deltaX}px`;
            activeImage.style.top = `${imageStartY + deltaY}px`;
        }
    }

    function onStopDrag() {
        if (activeImage) {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', onStopDrag);
            activeImage = null;
        }
    }

    // Rotate Left Button
    document.getElementById('rotate-left-btn').addEventListener('click', function () {
        if (activeImage) {
            const currentRotation = getCurrentRotation(activeImage);
            const newRotation = currentRotation - 15;
            activeImage.style.transform = `rotate(${newRotation}deg)`;
        }
    });

    // Rotate Right Button
    document.getElementById('rotate-right-btn').addEventListener('click', function () {
        if (activeImage) {
            const currentRotation = getCurrentRotation(activeImage);
            const newRotation = currentRotation + 15;
            activeImage.style.transform = `rotate(${newRotation}deg)`;
        }
    });

    // Function to get the current rotation of an element
    function getCurrentRotation(element) {
        const transform = window.getComputedStyle(element).getPropertyValue('transform');
        if (transform === 'none') {
            return 0;
        }
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
            const values = matrix[1].split(', ');
            const a = values[0];
            const b = values[1];
            return Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        return 0;
    }

    // Download Button
    document.getElementById('download-btn').addEventListener('click', function () {
        html2canvas(collageArea).then(function (canvas) {
            const link = document.createElement('a');
            link.download = 'collage.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});