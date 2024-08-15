// Définir une fonction pour formater la différence de temps
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
export const getTimeSinceCreation = (createdAt: string): string => {
  const currentDateTime = new Date();
  const postDateTime = new Date(createdAt);

  const differenceInMilliseconds =
    currentDateTime.getTime() - postDateTime.getTime();
  return formatDifference(differenceInMilliseconds);
};
