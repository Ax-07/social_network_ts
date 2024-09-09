import { useEffect } from "react";
import { useIncrementPostViewsMutation } from "../../services/api/postApi";

// Fonction pour stocker les vues dans localStorage avec un compteur
const cachePostView = (postId: string) => {
  const views = JSON.parse(localStorage.getItem("viewsCache") || "{}");
  views[postId] = (views[postId] || 0) + 1; // Incrémente le compteur de vues
  localStorage.setItem("viewsCache", JSON.stringify(views));
};

// Hook personnalisé pour la gestion des vues
const useCachePostViews = () => {
  const [incrementPostViews] = useIncrementPostViewsMutation();

  useEffect(() => {
    const views = JSON.parse(localStorage.getItem("viewsCache") || "{}");
    const postIds = Object.keys(views);
    const postViewCounts = postIds.map(postId => ({
      postId,
      count: views[postId],
    })); console.log('post view count', postViewCounts)

    // Planifier la synchronisation avec le serveur toutes les 30 secondes
    const timer = setInterval(async () => {
      if (postViewCounts.length > 0) {
        const result = await incrementPostViews(postViewCounts); // Envoyer l'ID et le compteur
        if (result.error) {
          console.error("Failed to increment post views:", result.error);
        } else {
          localStorage.removeItem("viewsCache"); // Efface les vues après envoi réussi
        }
      } else {
        console.log("No post views to increment");
      }
    }, 1000 * 60 * 5); // 5 minutes

    return () => clearInterval(timer); // Nettoyage
  }, [incrementPostViews]);
};

export { cachePostView, useCachePostViews };