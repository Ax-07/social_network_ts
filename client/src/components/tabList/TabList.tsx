import type { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

interface TabListProps {
  links: { name: string; to: string }[];
}

const TabList: FunctionComponent<TabListProps> = (props) => {
  return (
    <menu className="tablist">
      {props.links.map((link) => (
        <div key={link.name}  className="tablist__item background-blur">
        <NavLink to={link.to} className="tablist__link">
          {link.name}
        </NavLink>
        <hr className="tablist__link--active"/>
        </div>
      ))}
    </menu>
  );
};

export default TabList;
