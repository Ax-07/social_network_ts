/**
 * 
 * @param textarea 
 * @description Fonction pour redimensionner automatiquement un textarea en fonction de son contenu
 */
const autoResizeTextarea = (textarea: HTMLTextAreaElement): void => {
    const lineHeight = 30; // Hauteur approximative d'une ligne (ajuster selon le CSS réel)
    const maxHeight = 200; // Hauteur maximale en pixels du textarea
    
    // Calcul de la nouvelle hauteur en pixels du contenu 
    let scrollHeight = textarea.scrollHeight;
    if (scrollHeight > maxHeight) {
      scrollHeight = maxHeight;
      textarea.style.overflowY = "scroll";
    }
    
    // Calcul du nombre actuel de lignes visibles
    const currentRows = textarea.rows;
  
    // Calcul du nombre de lignes nécessaires basé sur le scrollHeight
    const newRows = Math.floor(scrollHeight / lineHeight);
    
    // Ne met à jour les lignes que si le nombre de lignes calculé dépasse celui actuel
    if (newRows > currentRows) {
      textarea.rows = newRows;
    }
  };

export { autoResizeTextarea };