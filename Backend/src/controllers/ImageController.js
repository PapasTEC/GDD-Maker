const Image = require("../models/ImageModel");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const imageController = {};

// const folderPath = '../Frontend/src/uploads/';
const folderPath = "src/uploads/";

async function checkExistsWithTimeout(filePath, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      watcher.close();
      reject(
        new Error("El archivo no se ha creado en el tiempo especificado.")
      );
    }, timeout);

    const dir = path.dirname(filePath);
    const basename = path.basename(filePath);
    const watcher = fs.watch(dir, (eventType, filename) => {
      if (eventType === "rename" && filename === basename) {
        clearTimeout(timer);
        watcher.close();
        resolve(true);
      }
    });

    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        clearTimeout(timer);
        watcher.close();
        reject(err);
      } else {
        resolve(true);
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
  },
});

imageController.upload = multer({ storage: storage });

// Controlador para cargar una imagen

imageController.uploadImage = async (req, res) => {
  const documentId = req.params.documentId;
  const path = folderPath + documentId;
  try {
    const exists = await checkExistsWithTimeout(path, 10000);
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

  // verifica si la carpeta existe
  if (fs.existsSync(rutaCompleta)) {
    // elimina la carpeta utilizando el método rmdir de fs
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
    // elimina la carpeta utilizando el método rmdir de fs
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

// Controlador para eliminar una imagen

// imageController.deleteImage = async (req, res) => {
//   const documentId = req.params.documentId;
//   const fileName = req.params.fileName;
//   const filePath = `${folderPath}/${documentId}/${fileName}`;

//   // Elimina el archivo del sistema de archivos
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error al eliminar el archivo');
//     }
//   });
// }

module.exports = imageController;
