import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { requestLimiter } from "./requestLimiter";

/**
 * Configure les mesures de sécurité essentielles pour l'application Express.
 * 
 * Cette fonction applique une série de protections visant à renforcer la sécurité du serveur en se concentrant sur plusieurs aspects critiques :
 * 
 * 1. **Helmet** : Applique des en-têtes de sécurité HTTP pour protéger contre diverses vulnérabilités web, notamment :
 *    - **Content Security Policy (CSP)** : Limite les sources de contenu autorisées pour prévenir les attaques de type XSS et la manipulation de scripts, styles, images, etc.
 *    - **Referrer Policy** : Réduit les informations de référence envoyées à d'autres sites lors de la navigation, protégeant ainsi la vie privée des utilisateurs.
 *    - **Frameguard** : Empêche le site d'être inclus dans un `iframe` non autorisé, protégeant contre les attaques de clickjacking.
 *    - **XSS Filter** : Active les protections intégrées du navigateur contre les attaques XSS (Cross-Site Scripting).
 *    - **NoSniff** : Empêche les navigateurs d'interpréter incorrectement les types MIME, réduisant ainsi les risques d'exploits.
 *    - **DNS Prefetch Control** : Désactive la prélecture DNS pour empêcher les fuites d'informations de navigation.
 *    - **Hide Powered By** : Masque l'en-tête `X-Powered-By` pour dissimuler la technologie utilisée (Express), rendant le serveur moins identifiable.
 *    - **Cross-Origin Resource Policy (CORP)** : Limite le partage des ressources aux requêtes provenant du même site pour éviter le partage de ressources indésirables.
 * 
 * 2. **CORS (Cross-Origin Resource Sharing)** : Configure les règles CORS pour restreindre les requêtes cross-origin :
 *    - Limite les origines autorisées à celles spécifiées dans `allowedOrigins`.
 *    - Restreint les méthodes HTTP autorisées aux méthodes couramment utilisées (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
 *    - Permet l'envoi de cookies et autres informations d'authentification via l'option `credentials`.
 * 
 * 3. **Limitations de la taille des requêtes** :
 *    - Limite la taille des requêtes JSON à 10 KB pour prévenir les attaques par payload volumineux.
 *    - Limite également la taille des requêtes URL-encoded à 10 KB pour protéger contre les abus.
 * 
 * 4. **Rate Limiting** : Met en place un système de limitation de requêtes pour empêcher les attaques par déni de service (DoS) et les attaques par force brute, en limitant le nombre de requêtes qu'un client peut envoyer sur une période donnée.
 * 
 * L'application de ces mesures assure une protection renforcée contre une variété de menaces courantes sur le web, améliorant ainsi la sécurité globale du serveur.
 * 
 * @param {Express} app - L'application Express à sécuriser.
 */
export const applyServerSecurity = (app: Express) => {

  /**
   * Helmet pour sécuriser les en-têtes HTTP.
   * Helmet regroupe plusieurs protections en ajoutant des en-têtes de sécurité à vos réponses HTTP.
   */
  app.use(helmet());

  /**
   * Content Security Policy (CSP) pour limiter les sources de contenu autorisées.
   * 
   * - defaultSrc : Autorise uniquement le contenu provenant du même domaine.
   * - scriptSrc : Autorise les scripts provenant du même domaine et de Google APIs.
   * - styleSrc : Autorise les styles inline et ceux provenant de Google Fonts.
   * - imgSrc : Autorise les images provenant du même domaine, des data URIs, et d'Unsplash.
   * - connectSrc : Autorise les connexions XHR/Fetch provenant du même domaine et de l'API spécifiée.
   * - fontSrc : Autorise les fontes provenant du même domaine et de Google Fonts.
   * - objectSrc : Interdit l'intégration d'objets (comme les balises <object>, <embed>, etc.).
   * - upgradeInsecureRequests : Force les requêtes HTTP à être redirigées vers HTTPS.
   */
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: ["'self'", "https://api.yourservice.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );

  /**
   * Définit la politique Referrer pour réduire les informations de référent envoyées.
   * Cela empêche les navigateurs de partager les URL complètes lorsque l'utilisateur navigue sur un autre site.
   */
  app.use(helmet.referrerPolicy({ policy: "same-origin" }));

  /**
   * Protection contre le clickjacking en permettant uniquement l'affichage dans un iframe provenant du même domaine.
   * Cela empêche le site d'être inclus dans un cadre externe, ce qui réduit les risques d'attaques par clickjacking.
   */
  app.use(helmet.frameguard({ action: "sameorigin" }));

  /**
   * Protection contre les attaques XSS (Cross-Site Scripting).
   * Helmet ajoute l'en-tête X-XSS-Protection pour activer le filtre XSS intégré du navigateur.
   */
  app.use(helmet.xssFilter());

  /**
   * Protection contre les attaques de type MIME sniffing.
   * Empêche les navigateurs de deviner le type MIME des réponses, réduisant ainsi les risques d'exploits.
   */
  app.use(helmet.noSniff());

  /**
   * Désactivation de la prélecture DNS pour empêcher la fuite d'informations de navigation.
   * Cela réduit le risque de fuite d'informations via les pré-requêtes DNS.
   */
  app.use(helmet.dnsPrefetchControl());

  /**
   * Masquer l'en-tête X-Powered-By pour ne pas révéler que l'application utilise Express.
   * Cela rend plus difficile l'identification du framework utilisé, ce qui réduit la surface d'attaque.
   */
  app.use(helmet.hidePoweredBy());

  /**
   * Cross-Origin Resource Policy (CORP) pour limiter les ressources partagées.
   * Cette politique contrôle la manière dont les ressources sont partagées entre différentes origines.
   * 
   * - "same-origin" : Permet uniquement les requêtes provenant du même domaine (même protocole, même port).
   * - "same-site" : Permet uniquement les requêtes provenant du même site (même domaine et protocole).
   * - "cross-origin" : Permet les requêtes provenant de n'importe quel domaine.
   */
  app.use(
    helmet.crossOriginResourcePolicy({ policy: "same-site" })
  );

  /**
   * Liste des origines autorisées pour les requêtes CORS.
   * 
   * @constant {string[]} allowedOrigins - Liste des origines autorisées pour les requêtes cross-origin.
   */
  const allowedOrigins = ["http://localhost:5173", "http://localhost:8080"];

  /**
   * CORS pour gérer les politiques de cross-origin.
   * Autorise uniquement les origines spécifiées et restreint les méthodes HTTP et en-têtes autorisés.
   * 
   * - origin : Autorise les requêtes provenant des origines définies dans `allowedOrigins`.
   * - allowedHeaders : Spécifie les en-têtes autorisés dans les requêtes CORS.
   * - methods : Définit les méthodes HTTP autorisées (GET, POST, PUT, PATCH, DELETE).
   * - credentials : Permet l'envoi de cookies et autres informations d'authentification.
   */
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    })
  );

  /**
   * Limitation de la taille des requêtes JSON pour éviter les payloads volumineux.
   * Limite la taille maximale des données JSON envoyées dans les requêtes à 10 KB.
   */
  app.use(express.json({ limit: "10kb" }));

  /**
   * Limitation de la taille des requêtes URL-encoded.
   * Limite la taille maximale des données URL-encoded envoyées dans les requêtes à 10 KB.
   */
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  /**
   * Limiteurs de requêtes pour éviter les attaques de déni de service (DoS) et de force brute.
   * Applique une limite au nombre de requêtes qu'un client peut envoyer sur une période donnée.
   */
  app.use(requestLimiter);
};
