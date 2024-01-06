import { confirm } from "devextreme/ui/dialog";
import "./style.scss";
interface Props {
  asyncFunction: any;
  title: string;
  cssClass?: string;
  contentConfirm: string;
}

const ConfirmComponent = ({
  asyncFunction,
  title,
  cssClass,
  contentConfirm,
}: Props) => {
  return confirm(
    `<div class="${
      cssClass ?? ""
    } confirm-wrapper"><p class="confirm-wrapper-text confirm-wrapper-text--overwrite" >${contentConfirm}</p></div>`,
    `${title}`
  ).then((dialogResult: boolean) => {
    if (dialogResult) {
      asyncFunction();
    }
  });
};

export default ConfirmComponent;
