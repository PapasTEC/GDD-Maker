const Image = require('../models/ImageModel');
const fs = require('fs');
const multer = require('multer');
const imageController = {};

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crea una carpeta para cada usuario utilizando su ID
    const userId = req.params.userId;
    const folderPath = `uploads/${userId}`;
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

imageController.upload = multer({ storage: storage });

// Controlador para cargar una imagen

imageController.uploadImage = async (req, res) => {
  const image = new Image({
    name: req.file.originalname,
    path: req.file.path,
    userId: req.params.userId
  });
  image.save()
    .then(result => res.send(result))
    .catch(err => next(err));
}

// Controlador para eliminar una imagen

imageController.deleteImage = async (req, res) => {
  const userId = req.params.userId;
  const fileName = req.params.fileName;
  const filePath = `uploads/${userId}/${fileName}`;

  // Elimina el archivo del sistema de archivos
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el archivo');
    } else {
      // Elimina la imagen de la base de datos
      Image.deleteOne({ name: fileName, userId: userId })
        .then(result => res.send(result))
        .catch(err => next(err));
    }
  });
}

module.exports = imageController;
