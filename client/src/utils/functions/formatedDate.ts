// Définir une fonction pour formater la différence de temps
/**
 * @param differenceInMilliseconds - Différence en millisecondes
 * @returns Différence de temps formatée
 * @example
 * // returns "2 days ago"
 */
const formatDifference = (differenceInMilliseconds: number): string => {
  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
};

// Définir une fonction pour calculer le temps écoulé depuis la date de création
/**
 * @param createdAt - Date de création au format ISO 8601
 * @returns Temps écoulé depuis la date de création
 * @example
 * // returns "2 days ago"
 */
export const getTimeSinceCreation = (createdAt: string): string => {
  const currentDateTime = new Date();
  const postDateTime = new Date(createdAt);

  const differenceInMilliseconds =
    currentDateTime.getTime() - postDateTime.getTime();
  return formatDifference(differenceInMilliseconds);
};


// definir une fonction pour formater la date au format dd/mm/yyyy
/**
 * @param date - Date au format ISO 8601
 * @returns Date formatée au format dd/mm/yyyy
 * @example
 * // returns "01/01/2022"
 */
export const getFormattedDate = (date: string) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const getMonth = () => {
    if (formattedDate.getMonth() + 1 < 10) {
      return `0${formattedDate.getMonth() + 1}`;
    } else {
      return formattedDate.getMonth() + 1;
    }
  }
  const month = getMonth();
  const year = formattedDate.getFullYear();
  return `${day}/${month}/${year}`;
};