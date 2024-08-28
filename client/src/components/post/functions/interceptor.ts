interface InterceptorTypes {
    action: () => void;
    ref: React.RefObject<HTMLDivElement>;
}

/**
 * 
 * @param action
 * @param ref
 * @description Déclenche une action lorsqu'un élément est visible à 100%
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useInterceptor({ action: () => console.log("Visible"), ref });
 * 
 */
const interceptor = ({ action, ref }: InterceptorTypes) => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            action(); // Déclencher l'action
            observer.disconnect(); // Déconnecter l'observateur après avoir détecté une vue
            console.log("Observer disconnected");
          }
        },
        {
          threshold: 1, // Le post doit être à moitié visible pour déclencher la vue
        }
      );
  
      if (ref.current) {
        observer.observe(ref.current); // Observer le post
        console.log("Observer started");
      }
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
            console.log("Observer stopped");
        }
      };
};

export default interceptor;