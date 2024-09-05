import { useEffect, useState, type FunctionComponent } from 'react';

interface BtnViewsProps {
    viewsCount?: number;
}

const BtnViews: FunctionComponent<BtnViewsProps> = ({viewsCount}) => {
    const [showIncrement, setShowIncrement] = useState(false);

    useEffect(() => {
      if (viewsCount !== undefined) {
        setShowIncrement(true);
  
        // Masquer l'animation après un court délai
        const timer = setTimeout(() => {
          setShowIncrement(false);
        }, 1000); // Durée de l'animation
  
        return () => clearTimeout(timer); // Nettoyage du timeout
      }
    }, [viewsCount]);
  return (
    <div className="btn__modal-comment" aria-label={`Nombre de vues: ${viewsCount}`}>
      <img src="/src/assets/icons/faStats.svg" alt="Icône des statistiques" />
      <p>{viewsCount} {showIncrement && <span>+ 1</span>}</p>
    </div>
  );
};

export default BtnViews;