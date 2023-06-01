const jwt = require("jsonwebtoken");

const privateKey = process.env.SECRET_KEY;

// Función para generar un token JWT
function generateToken(data) {
  const { name, email, owned_documents, shared_with_me_documents } = data;

  const token = jwt.sign({
    name,
    email,
    owned_documents,
    shared_with_me_documents,
  }, privateKey, { algorithm: "HS256" });
  return token;
}

// Función para decodificar un token JWT
function decodeToken(req, token) {
  try{
    const decoded = jwt.verify(token, privateKey, { algorithms: ["HS256"] });
    return decoded;
  }catch(err){
    const readOnlyURL = req.headers['readonly'];
    if (readOnlyURL === 'true') {
      data = {name: "Guest", email: "", owned_documents: [], shared_with_me_documents: []}
      return data;
    }
  }
}

// Función para verificar un token JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, privateKey, { algorithms: ["HS256"] });
    return true;
  } catch (err) {
    return false;
  }
}

// Controlador para generar un token y devolverlo como respuesta
function generateTokenController(req, res) {
  const token = generateToken(req.body);
  res.json({ token });
}

// Controlador para decodificar un token y devolver la información como respuesta
function decodeTokenController(req, res) {
  const { token } = req.body;
  const decoded = decodeToken(req, token);
  res.json({ decoded });
}

// Controlador para verificar un token y devolver la información como respuesta
function verifyTokenController(req, res) {
  const { token } = req.body;
  const isValidToken = verifyToken(token);
  res.json({ isValidToken });
}

function backendValidation(req, res, next) {
  // Obtener el token del header de la petición
  const headerToken = req.headers['authorization'];
  const readOnlyURL = req.headers['readonly'];
  // Verificar si el token existe
  if (!headerToken && !readOnlyURL) {
    return res.status(401).json({ mensaje: 'Token not found' });
  }

  // Verificar si el token es válido
  if (readOnlyURL === 'true') {
    return next();
  }
  const token = headerToken.split(' ')[1];
  try {
    const isValidToken = verifyToken(token);
    if (isValidToken || readOnlyURL === 'true') {
      return next();
    }
    return res.status(401).json({ mensaje: 'Invalid Token' });
  } catch (error) {
    return res.status(401).json({ mensaje: 'error while verifying token ' });
  }
}

module.exports = {
  generateToken,
  decodeToken,
  verifyToken,
  generateTokenController,
  decodeTokenController,
  verifyTokenController,
  backendValidation,
};
