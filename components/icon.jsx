export function Icon({ size = "20", name, ...rest }) {
  return (
    <svg {...rest} width={size} height={size}>
      <use href={`/assets/sprite.svg#${name}`} />
    </svg>
  );
}
