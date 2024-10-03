import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom'; // Si tu utilises React Router pour la navigation

interface ContentWhithHashTagAndMentionsProps {
    content: string;
}

const ContentWhithHashTagAndMentions: FunctionComponent<ContentWhithHashTagAndMentionsProps> = ({ content }) => {
    // Regex pour les hashtags et mentions
    const hashtagRegex = /#[\w]+/g;
    const mentionRegex = /@[\w]+/g;

    // Fonction pour créer des éléments JSX à partir du texte avec des hashtags et des mentions
    const renderTextWithLinks = (text: string) => {
        // Utiliser une regex combinée pour détecter à la fois les hashtags et mentions
        const combinedRegex = /([#@][\w]+)/g;

        // Découper le texte par les hashtags et mentions
        const parts = text.split(combinedRegex);
        
        return parts.map((part, index) => {
            // Vérifier si la partie est un hashtag
            if (part.match(hashtagRegex)) {
                return (
                    <Link key={index} to={`/explore/hashtags/${part.substring(1)}`} style={{ color: 'blueviolet' }}>
                        {part}
                    </Link>
                );
            }
            // Vérifier si la partie est une mention
            if (part.match(mentionRegex)) {
                return (
                    <Link key={index} to={`/profile/${part.substring(1)}`} style={{ color: 'green' }}>
                        {part}
                    </Link>
                );
            }
            // Retourner le texte normal s'il ne s'agit ni d'un hashtag ni d'une mention
            return <span key={index}>{part}</span>;
        });
    };

    return <>{renderTextWithLinks(content)}</>;
};

export default ContentWhithHashTagAndMentions;
