// const User = require("../models/UserModel");
const admin = require('../config/firebase');
const User = require('../models/User'); // Si usas MongoDB

const authController = {
  // //pagina para registro opcional, depende de tu frontend
  // register: async (req, res) => {
  //   res.send('Página de registro');
  // },

  //registra nuevo usuario
  registerUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'El correo electrónico y la contraseña son obligatorios.' });
    }

    try {
      //crea usuario en Firebase
      const userRecord = await admin.auth().createUser({ email, password });
      res.status(201).json({ success: true, user: userRecord });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // //depende del flujo del frontend)
  // login: (req, res) => {
  //   res.send('Página de login');
  // },

  //inicio de sesión
  loginUser: async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Token NOOO PROPORCIONADOOO' });
    }

    try {
      //verificar token de Firebase
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      // Extraer información del usuario
      const {email, password} = decodedToken;

      //busca informacion del usuario en tu base de datos usando el `uid`

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token: idToken, // Devuelve el token al frontend
        user: {email, password},
      });
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  },

  // Manejo de cierre de sesión
  logoutUser: async (req, res) => {
    try {
      res.clearCookie('token'); // Limpia la cookie del token
      res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({ error: 'Error al cerrar sesión' });
    }
  },
};

module.exports = authController;



// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email y contraseña son requeridos" });
//     }

//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: "Credenciales inválidas" });
//     }

//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET,/*"your_jwt_secret",*/ {
//       expiresIn: "1h",
//     });
//     res.status(200).json({ message: "Inicio de sesión exitoso", token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al iniciar sesión" });
//   }n
// };

// module.exports = { login };

