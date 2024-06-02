document.addEventListener('DOMContentLoaded', function () {
    const choosePictureButton = document.getElementById('choose-picture');
    const accessCameraButton = document.getElementById('access-camera');
    const pictureInput = document.getElementById('picture-input');
    const cameraStream = document.getElementById('camera-stream');
    const imageBase64 = document.getElementById('image-base64');
    const signInButton = document.getElementById('sign-in-button');

    choosePictureButton.addEventListener('click', function () {
        pictureInput.click();
    });

    pictureInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                imageBase64.value = reader.result;
                // You may perform additional actions like displaying the selected picture
            };
            reader.readAsDataURL(file);
        }
    });

    accessCameraButton.addEventListener('click', function () {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    cameraStream.srcObject = stream;
                    cameraStream.style.display = 'block';
                    pictureInput.style.display = 'none';
                })
                .catch(function (error) {
                    console.error('Error accessing the camera:', error);
                });
        }
    });

    signInButton.addEventListener('click', function (e) {
        e.preventDefault();
        const imageData = imageBase64.value;
        // Here you would send the image data to your authentication backend for verification
        // You might use APIs or libraries like Face API, OpenCV, or others for image recognition/verification
        // This example doesn't cover the authentication logic; it's up to your backend implementation
    });
});
