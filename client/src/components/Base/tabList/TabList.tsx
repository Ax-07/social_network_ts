import type { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

interface TabListProps {
  links: { name: string; to: string; end?: boolean }[];
}

const TabList: FunctionComponent<TabListProps> = (props) => {
  return (
    <menu className="tablist" role="tablist">
      {props.links.map((link, index) => (
        <div key={link.name}  className="tablist__item">
        <NavLink to={link.to} end={link.end} 
          className="tablist__link"
          role="tab" // Définit le rôle de l'élément pour l'accessibilité (navigation)
          aria-selected="true" // L'onglet actif est sélectionné
          tabIndex={index === 0 ? 0 : -1} // L'onglet actif ou le premier doit être dans le focus au début
          aria-controls={`tabpanel-${index}`} // Lien vers le panneau de contenu correspondant
          >
          {link.name}
        </NavLink>
        <hr className="tablist__link--active"/>
        </div>
      ))}
    </menu>
  );
};

export default TabList;
