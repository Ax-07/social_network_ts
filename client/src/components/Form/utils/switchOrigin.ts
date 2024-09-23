/**
 * @description Type pour définir l'origine du formulaire de publication
 */
export type FormOrigin =
  | undefined // Par défaut
  | "modal-addPost" // Ajout de publication via le modal
  | "modal-comment" // Ajout de commentaire via le modal
  | "modal-comment-post" // Ajout de commentaire a un post via le boutton addComment de postCard
  | "modal-comment-comment" // Ajout de commentaire a un commentaire via le boutton addComment de commentCard
  | "page-home" // Ajout de publication via la page d'accueil
  | "post-page-comment" // Ajout de commentaire via la page d'un post
  | "comment-page-comment" // Ajout de commentaire via la page d'un commentaire
  | "post-list" // Ajout de publication via la liste des publications ( a verifier l'utilité )
  | "btn-repost" // Repost d'une publication
  | "modal-repost" // Repost d'une publication via le modal
  | "btn-repost-with-comment" // Repost d'une publication avec commentaire
  | "modal-repost-comment" // Repost d'une publication avec commentaire via le modal
  | "modal-message" // Envoie de message via le modal
  | "response-message"; // Réponse à un message

/**
 * @description Fonction pour changer le texte du bouton et le placeholder du textarea, en fonction de l'origine du formulaire
 * @param origin
 * @returns buttonText et placeholder
 *
 */
export const switchOrigin = (origin: FormOrigin) => {
  let buttonText = "";
  let placeholder = "";

  switch (origin) {
    case "modal-addPost":
      buttonText = "Poster";
      placeholder = "Quoi de neuf ?";
      break;
    case "modal-comment":
      buttonText = "Commenter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-comment-post":
      buttonText = "Commenter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-comment-comment":
      buttonText = "Commenter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "page-home":
      buttonText = "Publier";
      placeholder = "Quoi de neuf ?";
      break;
    case "post-page-comment":
      buttonText = "Répondre";
      placeholder = "Ajouter un commentaire...";
      break;
    case "comment-page-comment":
      buttonText = "Répondre";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-repost":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "btn-repost":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-repost-comment":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "btn-repost-with-comment":
      buttonText = "Reposter";
      placeholder = "Ajouter un commentaire...";
      break;
    case "modal-message":
      buttonText = "Envoyer";
      placeholder = "Envoyer un message...";
      break;
    case "response-message":
      buttonText = "Répondre";
      placeholder = "Répondre...";
      break;
    default:
      buttonText = "Publier";
      placeholder = "Quoi de neuf ?";
      break;
  }

  return { buttonText, placeholder };
};
