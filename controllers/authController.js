const User = require('../models/User');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} = require('../utils/tokenUtils');

// Inscription d'un nouvel utilisateur
exports.registerWithSession = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const user = await User.create({
      username,
      email,
      password
    });

    // Ne pas renvoyer le mot de passe
    user.password = undefined;

    // Créer une session pour l'utilisateur
    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion d'un utilisateur
exports.loginWithSession = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Créer une session pour l'utilisateur
    req.session.userId = user._id;
    req.session.userRole = user.role;

    // Ne pas renvoyer le mot de passe
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Déconnexion d'un utilisateur
exports.logoutWithSession = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la déconnexion',
        error: err.message
      });
    }
    
    res.clearCookie('connect.sid');
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  });
};

// Obtenir le profil de l'utilisateur connecté
exports.getProfileWithSession = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// Inscription avec JWT
exports.registerWithJWT = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const user = await User.create({
      username,
      email,
      password
    });

    // Générer les tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Sauvegarder le refresh token dans la base de données
    user.refreshToken = refreshToken;
    await user.save();

    // Ne pas renvoyer le mot de passe et le refresh token
    user.password = undefined;
    user.refreshToken = undefined;

    // Définir le cookie HTTP-only pour le refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      accessToken,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion avec JWT
exports.loginWithJWT = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer les tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Sauvegarder le refresh token dans la base de données
    user.refreshToken = refreshToken;
    await user.save();

    // Ne pas renvoyer le mot de passe et le refresh token
    user.password = undefined;
    user.refreshToken = undefined;

    // Définir le cookie HTTP-only pour le refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      accessToken,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Déconnexion avec JWT
exports.logoutWithJWT = async (req, res) => {
  try {
    // Récupérer le refresh token depuis le cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      // Trouver l'utilisateur avec ce refresh token
      const user = await User.findOne({ refreshToken });
      
      if (user) {
        // Supprimer le refresh token de la base de données
        user.refreshToken = undefined;
        await user.save();
      }
    }
    
    // Supprimer le cookie
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    });
  }
};

// Rafraîchir le token d'accès
exports.refreshToken = async (req, res) => {
  try {
    // Récupérer le refresh token depuis le cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token manquant'
      });
    }
    
    // Vérifier le refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Trouver l'utilisateur avec cet ID et ce refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token invalide'
      });
    }
    
    // Générer un nouveau token d'accès
    const accessToken = generateAccessToken(user._id, user.role);
    
    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Refresh token invalide ou expiré',
      error: error.message
    });
  }
};

// Obtenir le profil de l'utilisateur connecté avec JWT
exports.getProfileWithJWT = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};