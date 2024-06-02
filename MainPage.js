var finalFileName;

const [preview, outputs, capture, result] = [
  document.getElementById('videoElement'),
  document.getElementById('outputs'),
  document.getElementById('capture'),
  document.getElementById('result'),
]
navigator.mediaDevices.getUserMedia({
    audio : false,
    video : {
        width : 300,
        height : 300
    }
})
.then(stream => {
    preview.srcObject = stream;
    console.log(stream);
    preview.play();
})
.catch(error => {
    console.error(error);
})

capture.addEventListener('click', () => {
  const context = outputs.getContext('2d');

  outputs.width = 300;
  outputs.height = 300;

  context.drawImage(preview, 0, 0, outputs.width, outputs.height);

  const blob = dataURLtoBlob(outputs.toDataURL());

  saveToLocal(blob);

  const imageUrl = URL.createObjectURL(blob);

  result.src = imageUrl;
});

function generateRandomFileName() {
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });

  return guid.substring(0, 6);
}

function saveToLocal(blob) {
  const randomName = generateRandomFileName()
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = randomName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

}
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const PROVIDER = "amazon";
var apiUrl = "https://api.edenai.run/v2/image/face_recognition/add_face";

function addFaces() {
    const fileInput = document.getElementById("fileInput");
    console.log(fileInput);
    console.log("test woi");
    apiUrl = "https://api.edenai.run/v2/image/face_recognition/add_face";
    if (fileInput == "") {
        alert("Please select one or more files.");
        return;
    }

    const files = fileInput.files[0];
    console.log(files);
    const options = constructPayload(files,apiUrl);
    console.log(1);

    axios.request(options)
        .then(response => {
            const responseData = response.data;
            console.log(1);
 
            sendDataToPHP(responseData);
        })
        .catch(error => {
            console.error("Error adding faces:", error);
        });

    alert("Faces added successfully!");
}

function sendDataToPHP(data) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
          if (this.status == 200) {
              // Handle successful response from PHP
              console.log("Data sent to PHP:", this.responseText);
          } else {
              // Handle error response from PHP
              console.error("Error sending data to PHP:", this.responseText);
          }
      }
  };

  // Ganti "proses.php" dengan path ke file PHP yang akan menangani data
  xhr.open("POST", "proccess-form.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  // Mengirim data ke PHP
  xhr.send("apiData=" + encodeURIComponent(JSON.stringify(data)));
}

function constructPayload(filePath, apiurls) {
    const form = new FormData();
    form.append("providers", PROVIDER);
    form.append("file", filePath);
    form.append("fallback_providers", "");
    return {
        method: "POST",
        url: apiurls,
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTFmYzRhN2QtMDIyYS00OGNjLWJjYTMtNDZmY2E0MTU4NDVhIiwidHlwZSI6ImFwaV90b2tlbiJ9.HKffbRLs1ZqqSAYXBzQ7RtElaCAgHauOOKAInog2Uxc",
          "Content-Type": "multipart/form-data; boundary=",
        },
        data: form,
    };
}

function recognizeFace() {
  apiUrl = "https://api.edenai.run/v2/image/face_recognition/recognize";
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length === 0) {
    alert("Please select a file.");
    return;
  }

  const file = fileInput.files[0];
  const options = constructPayload(file, apiUrl);

  axios.request(options).then((response) => {
    const faceItems = response.data[PROVIDER].items;
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    faceItems.forEach((faceItem) => {
      const faceId = document.createElement("p");
      faceId.textContent = "Face ID: " + faceItem.face_id;

      const confidence = document.createElement("p");
      confidence.textContent = "Confidence: " + faceItem.confidence;

      outputDiv.appendChild(faceId);
      outputDiv.appendChild(confidence);
    });
  });
}


