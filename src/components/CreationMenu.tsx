import { COMPONENTS } from "../lib/audio/components";
import css from './CreationMenu.module.css';

export interface CreationMenuProps {
    onCreate(nodeName: string): void;
  }
  
export function CreationMenu({ onCreate }: CreationMenuProps) {
    return (
      <ul className={css.list}>
        {Object.keys(COMPONENTS).map(name => (
          <li key={name}><button className={css.button} onClick={() => onCreate(name)}>{name}</button></li>
        ))}
      </ul>
    );
  }