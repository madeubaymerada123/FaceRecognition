<?php
// $name = $_POST["names"];
// $faceId = $_POST["face_id"];
// $img_url = $_POST["image_url"];

// if (empty($name) || empty($faceId)) {
//     die("Please enter a name and ensure face ID is available");
// }

// $host = "localhost";
// $dbname = "ai_database";
// $username = "root";
// $password = "";

// $conn = mysqli_connect($host, $username, $password, $dbname);

// if (mysqli_connect_errno()) {
//     die("Connection error: " . mysqli_connect_error());
// }

// $sql = "INSERT INTO msidentity VALUES ('$faceId','$name')";

// $stmt = mysqli_stmt_init($conn);

// if (!mysqli_stmt_prepare($stmt, $sql)) {
//     die(mysqli_error($conn));
// }


// mysqli_stmt_execute($stmt);

// mysqli_stmt_close($stmt);
// mysqli_close($conn);

$apiData = json_decode($_POST['apiData'], true);


$host = "localhost";
$dbname = "ai_database";
$username = "root";
$password = "";

$conn = mysqli_connect($host, $username, $password, $dbname);

if (mysqli_connect_errno()) {
    die("Connection error: " . mysqli_connect_error());
}

// Contoh: Menyimpan data ke database
$faceId = mysqli_real_escape_string($conn, $apiData['face_id']);
$name = mysqli_real_escape_string($conn, $apiData['name']);

$sql = "INSERT INTO msidentity (face_id, name) VALUES ('$faceId', '$name')";
$result = mysqli_query($conn, $sql);

if ($result) {
    echo "Data successfully saved to the database.";
} else {
    echo "Error saving data to the database: " . mysqli_error($conn);
}

mysqli_close($conn);
?>


