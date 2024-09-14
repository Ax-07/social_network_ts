import { useEffect } from "react";
import { useIncrementPostViewsMutation } from "../../services/api/postApi";

// Fonction pour stocker les vues dans sessionStorage avec un compteur et une limite de temps
const cachePostView = (postId: string) => {
  const views = JSON.parse(sessionStorage.getItem("viewsCache") || "{}");

  const now = new Date().getTime();
  const viewExpirationTime = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

  if (views[postId] && now - views[postId].timestamp < viewExpirationTime) {
    // Si le post a déjà été vu et que moins de 24 heures se sont écoulées, ne rien faire
    return;
  }

  // Sinon, on stocke la nouvelle vue avec l'horodatage actuel
  views[postId] = { count: (views[postId]?.count || 0) + 1, timestamp: now };
  sessionStorage.setItem("viewsCache", JSON.stringify(views));
};

// Hook personnalisé pour la gestion des vues
const useCachePostViews = () => {
  const [incrementPostViews] = useIncrementPostViewsMutation();

  useEffect(() => {
    const views = JSON.parse(sessionStorage.getItem("viewsCache") || "{}");
    const postIds = Object.keys(views);

    const postViewCounts = postIds.map(postId => ({
      postId,
      count: views[postId].count,
    }));

    // Planifier la synchronisation avec le serveur toutes les 30 secondes
    const timer = setInterval(async () => {
      if (postViewCounts.length > 0) {
        const result = await incrementPostViews(postViewCounts); // Envoyer l'ID et le compteur
        if (result.error) {
          console.error("Failed to increment post views:", result.error);
        } else {
          // Efface les vues après envoi réussi
          sessionStorage.removeItem("viewsCache");
        }
      } else {
        console.log("No post views to increment");
      }
    }, 1000 * 60 * 5); // 5 minutes pour la synchronisation (ajustable selon les besoins)

    return () => clearInterval(timer); // Nettoyage à la fin du composant
  }, [incrementPostViews]);
};

export { cachePostView, useCachePostViews };
