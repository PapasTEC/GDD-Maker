const Image = require('../models/ImageModel');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const imageController = {};


const folderPath = '../Frontend/src/uploads/';

checkExistsWithTimeout = async (filePath, timeout) => {
  return new Promise(function (resolve, reject) {

    var timer = setTimeout(function () {
        watcher.close();
        reject(new Error('File did not exists and was not created during the timeout.'));
    }, timeout);

    fs.access(filePath, fs.constants.R_OK, function (err) {
        if (!err) {
            clearTimeout(timer);
            watcher.close();
            resolve();
        }
    });

    var dir = path.dirname(filePath);
    var basename = path.basename(filePath);
    var watcher = fs.watch(dir, function (eventType, filename) {
        if (eventType === 'rename' && filename === basename) {
            clearTimeout(timer);
            watcher.close();
            resolve();
        }
    });
  });
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crea una carpeta para cada usuario utilizando su ID
    const documentId = req.params.documentId;
    const path = folderPath + documentId;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

imageController.upload = multer({ storage: storage });

// Controlador para cargar una imagen

imageController.uploadImage = async (req, res) => {
  const documentId = req.params.documentId;
  const path = folderPath + documentId;
  if (checkExistsWithTimeout(path, 10000)) {
    res.status(200).send('OK');
  } else {
    err.status(400).send('No se ha seleccionado ningún archivo');
  }
  // image.save()
  //   .then(result => res.send(result))
  //   .catch(err => next(err));
}

// Controlador para eliminar una imagen

imageController.deleteImage = async (req, res) => {
  const documentId = req.params.documentId;
  const fileName = req.params.fileName;
  const filePath = `${folderPath}/${documentId}/${fileName}`;

  // Elimina el archivo del sistema de archivos
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el archivo');
    }
  });
}

module.exports = imageController;
