import React from "react";
import { ReactComponent as RemoveIcon } from "./svg/remove.svg";
import { ReactComponent as EditIcon } from "./svg/edit.svg";
import { ReactComponent as AddIcon } from "./svg/add.svg";
import { ReactComponent as TrashIcon } from "./svg/trash.svg";
import { ReactComponent as PlusIcon } from "./svg/plus-circle.svg";
import { ReactComponent as PdfIcon } from "./svg/pdf.svg";
import { ReactComponent as XlsxIcon } from "./svg/xlsx.svg";
import { ReactComponent as JpgIcon } from "./svg/jpg.svg";
import { ReactComponent as DocxIcon } from "./svg/docx.svg";
import { ReactComponent as ExpandDownIcon } from "./svg/expand-down.svg";
import { ReactComponent as CallIcon } from "./svg/call.svg";
import { ReactComponent as ZaloIcon } from "./svg/zalo.svg";
import { ReactComponent as EmailIcon } from "./svg/email.svg";
import { ReactComponent as FaceBookIcon } from "./svg/facebook.svg";
import { ReactComponent as ClockIcon } from "./svg/clock.svg";
import { ReactComponent as RightIcon } from "./svg/right.svg";
import { ReactComponent as SendIcon } from "./svg/send.svg";
import { ReactComponent as ReplyIcon } from "./svg/reply.svg";
import { ReactComponent as Txt } from "./svg/txt.svg";
import { ReactComponent as Pptx } from "./svg/Pptx.svg";
import { ReactComponent as PhoneCall } from "./svg/phone_call.svg";
import { ReactComponent as settingIcon } from "./svg/settingicon.svg";
//customer
import { ReactComponent as phoneIcon } from "./customer/phone.svg";
// eticket
import { ReactComponent as SmsIcon } from "./svg/sms.svg";
import { ReactComponent as HeadPhoneIcon } from "./svg/headphone.svg";
import { ReactComponent as LiveChatIcon } from "./svg/livechat.svg";
import { ReactComponent as ExpandPNG } from "./svg/png.svg";
import { ReactComponent as Portal } from "./svg/portal.svg";
import { ReactComponent as Gif } from "./svg/gif.svg";
import { ReactComponent as CallMissed } from "./svg/call_missed.svg";
import { ReactComponent as CallMissedIn } from "./svg/call_missed.svg";
import { ReactComponent as callNoAnswer } from "./svg/call_noanswer.svg";
import { ReactComponent as callOut } from "./svg/call_out.svg";
import { ReactComponent as pin } from "./svg/pin.svg";
import { ReactComponent as unpin } from "./svg/unpin.svg";
import { ReactComponent as note } from "./svg/note.svg";
import { ReactComponent as ZaloIn } from "./eticket_icons/zaloin.svg";
import { ReactComponent as ZaloOut } from "./eticket_icons/zaloout.svg";
import { ReactComponent as MailIn } from "./eticket_icons/mailin.svg";
import { ReactComponent as MailOut } from "./eticket_icons/mailout.svg";
import { ReactComponent as CallIn } from "./eticket_icons/callin.svg";
import { ReactComponent as CallMissingIn } from "./eticket_icons/callmissingin.svg";
import { ReactComponent as CallMissingOut } from "./eticket_icons/callmissingout.svg";
import { ReactComponent as CallOut } from "./eticket_icons/callout.svg";
import { ReactComponent as ClearX } from "./svg/clearX.svg";

// campaign
import { ReactComponent as ExpandCampaign } from "./campaign/expand.svg";
export type Dict = {
  [key: string]: any;
};
//  PNG, XLSX
const ICONS = {
  pptx: Pptx,
  txt: Txt,
  phone: PhoneCall,
  remove: RemoveIcon,
  add: AddIcon,
  edit: EditIcon,
  trash: TrashIcon,
  headphone: HeadPhoneIcon,
  plus: PlusIcon,
  pdf: PdfIcon,
  xlsx: XlsxIcon,
  jpg: JpgIcon,
  jpeg: JpgIcon,
  docx: DocxIcon,
  phoneIcon: phoneIcon,
  expandDown: ExpandDownIcon,
  png: ExpandPNG,
  email: EmailIcon,
  right: RightIcon,
  call: CallIcon,
  zalo: ZaloIcon,
  reply: ReplyIcon,
  facebook: FaceBookIcon,
  sms: SmsIcon,
  livechat: LiveChatIcon,
  portal: Portal,
  remark: Gif,
  callin: CallIn,
  callmissedin: CallMissingIn,
  callmissedout: CallMissingOut,
  callOut: CallOut,
  callmissed: CallMissed,
  callnoanswer: callNoAnswer,
  callout: callOut,
  pin: pin,
  unpin: unpin,
  note: note,
  zaloin: ZaloIn,
  zaloout: ZaloOut,
  emailin: MailIn,
  emailout: MailOut,
  setting: settingIcon,
  clock: ClockIcon,
  send: SendIcon,
  expandCampaign: ExpandCampaign,
  ClearX: ClearX,
};

// email, call, sms, livechat, zalo, fb
export type IconName = keyof typeof ICONS;

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  name: IconName;
  style?: Dict;
};

export const Icon = ({
  name,
  size = 10,
  className,
  style,
  ...restProps
}: IconProps) => {
  const Component = ICONS[name];
  return (
    <Component
      className={className}
      width={size}
      height={size}
      {...restProps}
      style={style}
    />
  );
};
