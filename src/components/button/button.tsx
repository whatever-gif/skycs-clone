import { Button as XButton, IButtonOptions } from 'devextreme-react/button';

export interface ButtonProps extends React.PropsWithChildren<IButtonOptions> {

}
export const Button = ({ text, icon, ...rest }: ButtonProps) => {
  return <div>
    <XButton text={text}
      icon={icon}
      stylingMode="contained"
      {...rest}
    />
  </div>;
};
export default Button;