import { COMPONENTS } from "../lib/audio/components";

export interface CreationMenuProps {
    onCreate(nodeName: string): void;
  }
  
export function CreationMenu({ onCreate }: CreationMenuProps) {
    return (
      <ul>
        {Object.keys(COMPONENTS).map(name => (
          <li key={name}><button onClick={() => onCreate(name)}>{name}</button></li>
        ))}
      </ul>
    );
  }