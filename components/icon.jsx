import { ASSETS } from "../lib/assets.js";

let sprite = ASSETS.get("sprite.svg");

export function Icon({ size = "20", name, ...rest }) {
  return (
    <svg {...rest} width={size} height={size} aria-hidden="true">
      <use href={`${sprite}#${name}`} />
    </svg>
  );
}
