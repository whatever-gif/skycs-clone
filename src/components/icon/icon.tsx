import AddIcon from './svgs/add.svg';

export type IconName = keyof typeof ICONS;
export type Dict = {
  [key: string]: any;
};
export type IconDict = {
  [key: string]: any;
};

const ICONS: IconDict = {
  addIcon: AddIcon,
};
export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  name: IconName;
  style: Dict;
};
export const Icon = ({ name, size = 10, className, style, ...restProps }: IconProps) => {
  const Component = ICONS[name];

  return (
    <Component
      className={className}
      style={style}
      width={size} height={size}
      {...restProps}
    />
  );
};
