const Image = require("../models/ImageModel");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const imageController = {};

const folderPath = "src/uploads/";

function checkExistsWithTimeout(path) {
  return new Promise((resolve, reject) => {
    const timeout = 5000; // 5 segundos de timeout

    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });

    setTimeout(() => {
      resolve(false); // Si el timeout se alcanza, asumir que el archivo no existe
    }, timeout);
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const documentId = req.params.documentId;
    const path = folderPath + documentId;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

imageController.upload = multer({ storage: storage });

imageController.uploadImage = async (req, res) => {
  const documentId = req.params.documentId;
  const imageName = req.params.imageName;

  const path = folderPath + documentId + "/" + imageName;
  try {
    const exists = await checkExistsWithTimeout(path);
    if (exists) {
      res.status(200).send("OK");
    } else {
      res.status(400).send("No se ha seleccionado ningún archivo");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

function eliminarCarpeta(req, res) {
  const rutaCarpeta = req.params.rutaCarpeta; // obtiene la ruta de la carpeta desde los parámetros de la URL
  const rutaCompleta = "./carpetas/" + rutaCarpeta; // construye la ruta completa de la carpeta

  if (fs.existsSync(rutaCompleta)) {
    fs.rmdir(rutaCompleta, { recursive: true }, (error) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la carpeta");
      } else {
        res.status(200).send("Carpeta eliminada correctamente");
      }
    });
  } else {
    res.status(404).send("La carpeta no existe");
  }
}

imageController.deleteFolder = async (req, res) => {
  const documentId = req.params.documentId;
  const path = folderPath + documentId;
  if (fs.existsSync(path)) {
    fs.rmdir(path, { recursive: true }, (error) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error deleting folder");
      } else {
        res.status(200).send("Folder deleted successfully");
      }
    });
  } else {
    res.status(200).send("Folder deleted successfully");
  }
};

module.exports = imageController;
