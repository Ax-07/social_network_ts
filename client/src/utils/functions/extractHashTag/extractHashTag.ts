
/**
 * Extrait les hashtags d'un texte
 * @param text
 * @returns
 * @example const post = "Voici un post avec des #hashtag et #ReactJS";
 * const hashtags = extractHashtags(post);
 * console.log(hashtags); // ["#hashtag", "#ReactJS"]
 */
export const extractHashtags = (text: string) => {
    const regex = /#[\w]+/g; // Regex pour détecter les hashtags commençant par #
    const hashtags = text.match(regex);
    return hashtags || [];
  };
  