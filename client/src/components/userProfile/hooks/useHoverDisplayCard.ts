import { useCallback, useEffect, useState, useRef } from "react";

export const useHoverDisplayCard = () => {
  const [isHoveringThumbnail, setIsHoveringThumbnail] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [showUserCard, setShowUserCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const keepUserProfileCardInBounds = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();

      // Vérifier et ajuster le dépassement à droite
      if (rect.right > window.innerWidth) {
        cardRef.current.style.position = "fixed";
        cardRef.current.style.left = "auto";
        cardRef.current.style.right = "20px";
      } else if (rect.left < 0) {
        // Ajuster si ça dépasse à gauche
        cardRef.current.style.position = "fixed";
        cardRef.current.style.left = "20px";
        cardRef.current.style.right = "auto";
      }

      // Vérifier et ajuster le dépassement en bas
      if (rect.bottom > window.innerHeight) {
        cardRef.current.style.position = "fixed";
        cardRef.current.style.top = "auto";
        cardRef.current.style.bottom = "20px";
        cardRef.current.style.left = "70px";
      }
    }
  }, []);

  useEffect(() => {
    if (showUserCard) {
      keepUserProfileCardInBounds();
    }
  }, [showUserCard, keepUserProfileCardInBounds]);

  const handleMouseEnterThumbnail = useCallback(() => {
    setIsHoveringThumbnail(true);
  }, []);
  const handleMouseLeaveThumbnail = useCallback(() => {
    setIsHoveringThumbnail(false);
  }, []);
  const handleMouseEnterCard = useCallback(() => {
    setIsHoveringCard(true);
  }, []);
  const handleMouseLeaveCard = useCallback(() => {
    setIsHoveringCard(false);
  }, []);

  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    if (isHoveringThumbnail || isHoveringCard) {
      showTimeout = setTimeout(() => setShowUserCard(true), 500);
    } else {
      hideTimeout = setTimeout(() => setShowUserCard(false), 300);
    }

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isHoveringThumbnail, isHoveringCard]);

  return {
    showUserCard,
    handleMouseEnterThumbnail,
    handleMouseLeaveThumbnail,
    handleMouseEnterCard,
    handleMouseLeaveCard,
    cardRef
  };
};
