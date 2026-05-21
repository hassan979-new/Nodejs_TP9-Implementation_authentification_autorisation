const { verifyAccessToken } = require('../utils/tokenUtils');

// Middleware pour vérifier si l'utilisateur est connecté (sessions)

exports.isAuthenticatedWithSession = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  res.status(401).json({
    success: false,
    message: 'Veuillez vous connecter pour accéder à cette ressource'
  });
};

// Middleware pour vérifier le rôle de l'utilisateur (sessions)
exports.authorizeWithSession = (roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vous connecter pour accéder à cette ressource'
      });
    }
    
    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à accéder à cette ressource'
      });
    }
    
    next();
  };
};

exports.isAuthenticatedWithJWT = (req, res, next) => {
  try {
    // Récupérer le token d'autorisation
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant ou format incorrect'
      });
    }
    
    // Extraire le token
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token
    const decoded = verifyAccessToken(token);
    
    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Token invalide ou expiré',
      error: error.message
    });
  }
};

// Middleware pour vérifier le rôle de l'utilisateur (JWT)
exports.authorizeWithJWT = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Authentification requise'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Vous n\'avez pas les droits nécessaires'
      });
    }
    
    next();
  };
};