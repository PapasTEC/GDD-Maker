const jwt = require("jsonwebtoken");

const privateKey = process.env.SECRET_KEY;

function generateToken(data) {
  const { name, email, owned_documents, shared_with_me_documents } = data;

  const token = jwt.sign(
    {
      name,
      email,
      owned_documents,
      shared_with_me_documents,
    },
    privateKey,
    { algorithm: "HS256" }
  );
  return token;
}

function decodeToken(req, token) {
  try {
    const decoded = jwt.verify(token, privateKey, { algorithms: ["HS256"] });
    return decoded;
  } catch (err) {
    const readOnlyURL = req.headers["readonly"];
    if (readOnlyURL === "true") {
      data = {
        name: "Guest",
        email: "",
        owned_documents: [],
        shared_with_me_documents: [],
      };
      return data;
    }
  }
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, privateKey, { algorithms: ["HS256"] });
    return true;
  } catch (err) {
    return false;
  }
}

function generateTokenController(req, res) {
  const token = generateToken(req.body);
  res.json({ token });
}

function decodeTokenController(req, res) {
  const { token } = req.body;
  const decoded = decodeToken(req, token);
  res.json({ decoded });
}

function verifyTokenController(req, res) {
  const { token } = req.body;
  const isValidToken = verifyToken(token);
  res.json({ isValidToken });
}

function backendValidation(req, res, next) {
  const headerToken = req.headers["authorization"];
  const readOnlyURL = req.headers["readonly"];

  if (!headerToken && !readOnlyURL) {
    return res.status(401).json({ mensaje: "Token not found" });
  }

  if (readOnlyURL === "true") {
    return next();
  }
  const token = headerToken.split(" ")[1];
  try {
    const isValidToken = verifyToken(token);
    if (isValidToken || readOnlyURL === "true") {
      return next();
    }
    return res.status(401).json({ mensaje: "Invalid Token" });
  } catch (error) {
    return res.status(401).json({ mensaje: "error while verifying token " });
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
