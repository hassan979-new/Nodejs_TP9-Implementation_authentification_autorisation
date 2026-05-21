# Node.js – Authentification avec Express, Sessions et JWT

## 📖 Description
Ce projet est une **API d’authentification** construite avec **Node.js**, **Express**, **MongoDB** et **Mongoose**.  
Il démontre deux approches complémentaires :  
- Authentification par **sessions** avec `express-session`.  
- Authentification par **JWT (JSON Web Token)** avec gestion des tokens d’accès et de rafraîchissement.  

Le projet inclut la gestion des rôles (`user`, `admin`), la sécurisation avec **Helmet**, la limitation de requêtes avec **express-rate-limit**, et une architecture modulaire.

---

## 📂 Structure du projet
```
auth-express-demo/
├── config/
│   └── db.js                
├── controllers/
│   └── authController.js    
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── utils/
│   └── tokenUtils.js
├── server.js
├── package.json
└── package-lock.json
```


---

## ⚙️ Fonctionnalités

### Authentification par sessions
- **[Inscription session](ca://s?q=Inscription_avec_sessions)** : création d’un utilisateur et ouverture de session.  
- **[Connexion session](ca://s?q=Connexion_avec_sessions)** : vérification email/mot de passe et stockage en session.  
- **[Déconnexion session](ca://s?q=Déconnexion_avec_sessions)** : destruction de la session et suppression du cookie.  
- **[Profil session](ca://s?q=Profil_utilisateur_sessions)** : récupération des infos utilisateur connecté.  
- **[Accès admin session](ca://s?q=Accès_admin_sessions)** : route protégée par rôle.  

### Authentification par JWT
- **[Inscription JWT](ca://s?q=Inscription_avec_JWT)** : création d’un utilisateur avec génération de tokens.  
- **[Connexion JWT](ca://s?q=Connexion_avec_JWT)** : login avec génération d’un access token et refresh token.  
- **[Déconnexion JWT](ca://s?q=Déconnexion_avec_JWT)** : suppression du refresh token et du cookie.  
- **[Refresh token](ca://s?q=Rafraîchir_le_token)** : génération d’un nouveau access token.  
- **[Profil JWT](ca://s?q=Profil_utilisateur_JWT)** : récupération des infos utilisateur connecté via JWT.  
- **[Accès admin JWT](ca://s?q=Accès_admin_JWT)** : route protégée par rôle.  

### Sécurité
- **Helmet** pour sécuriser les en-têtes HTTP.  
- **Rate limiting** sur les routes de connexion pour limiter les tentatives.  
- **Cookie HTTP-only** pour le refresh token.  
- **Gestion des erreurs** centralisée (validation, duplication, JWT expiré, etc.).  

---

## 🖥️ Exemple d’exécution

https://github.com/user-attachments/assets/14b83494-71be-4d83-ad72-5829be15dad8

---

## 💡 Concepts pratiqués
- Authentification avec **sessions** et **JWT**.  
- Gestion des rôles et autorisations.  
- Sécurisation avec **Helmet** et **rate limiting**.  
- Architecture MVC (controllers, routes, modèles, middlewares).  
- Gestion des tokens d’accès et de rafraîchissement.  
- Middleware global de gestion des erreurs.  

---

## 🧑‍💻 Auteur
👤 **Agouram Hassan**  
⚙️ Développement Node.js
🎓 Instructor : **Mr. LACHGAR**  
📅 22 Mai 2026
