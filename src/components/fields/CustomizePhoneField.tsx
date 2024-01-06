import { usePhone } from "@/packages/hooks/usePhone";
import { showErrorAtom } from "@/packages/store";
import { SelectBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

const CustomizePhoneField = ({ param, options, customOptions }: any) => {
  const { component, formData } = param;

  const phone = usePhone();

  const showError = useSetAtom(showErrorAtom);

  const [value, setValue] = useState<any>(undefined);

  useEffect(() => {
    if (options) {
      setValue(
        options?.find((item: any) => item?.FlagDefault == "1")?.CtmPhoneNo
      );
    }
  }, []);

  const handleCall = () => {
    phone.call(value);
  };

  return (
    <div className="flex gap-2">
      <SelectBox
        dataSource={options ?? []}
        valueExpr="CtmPhoneNo"
        displayExpr="CtmPhoneNo"
        onValueChanged={(e: any) => {
          setValue(e.value);
        }}
        value={value}
        readOnly={customOptions?.editType == "detail"}
      ></SelectBox>
      <div
        className="bg-[#00703C] flex items-center justify-center w-[40px] cursor-pointer"
        onClick={handleCall}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hover:scale-125 transition-all"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.4239 0.604372L5.92487 2.04241L5.93607 2.0534C6.34634 2.4645 6.5149 3.03447 6.5149 3.54806C6.5149 4.06164 6.34634 4.63158 5.93614 5.04269L5.20582 5.77462C5.37775 6.37698 5.78753 7.04135 6.35803 7.61689C6.93007 8.1939 7.59423 8.61159 8.20729 8.78603L8.93718 8.0546C9.34759 7.64328 9.91704 7.47395 10.4307 7.47395C10.9443 7.47395 11.5138 7.64328 11.9242 8.05453L13.4212 9.55485C13.8315 9.96596 14 10.5359 14 11.0495C14 11.5631 13.8314 12.133 13.4212 12.5441C12.3049 13.6629 10.8486 14 10.1811 14C9.14774 14 8.2145 13.9364 7.14007 13.4338C6.09252 12.9438 4.96301 12.0615 3.44829 10.5435C1.91304 9.00485 1.04037 7.74667 0.557634 6.64116C0.0682569 5.52038 0 4.60183 0 3.79815C0 3.23595 0.0706509 2.69781 0.305963 2.14762C0.538916 1.60295 0.91315 1.0933 1.45213 0.553139C1.87413 0.130226 2.45589 -0.0180628 2.96815 0.00172629C3.47848 0.0214384 4.02716 0.210558 4.4239 0.604372ZM2.91411 1.40069C2.68243 1.39173 2.52023 1.46477 2.44315 1.54202C1.98412 2.00205 1.73454 2.36762 1.59317 2.69816C1.45417 3.02317 1.4 3.36023 1.4 3.79815C1.4 4.49482 1.45663 5.20142 1.84065 6.08087C2.2313 6.97555 2.98054 8.09261 4.43932 9.55464C5.91864 11.0372 6.9097 11.7804 7.73332 12.1657C8.52999 12.5384 9.2183 12.6 10.1811 12.6C10.5359 12.6 11.6155 12.3717 12.4302 11.5552C12.519 11.4662 12.6 11.286 12.6 11.0494C12.6 10.8129 12.519 10.6327 12.4302 10.5437L10.9332 9.04342C10.8446 8.95466 10.6655 8.87395 10.4307 8.87395C10.1958 8.87395 10.0168 8.95466 9.92817 9.04342L8.93018 10.0437C8.77443 10.1997 8.55435 10.2733 8.33609 10.2422C7.24241 10.0867 6.17477 9.42059 5.36381 8.60256C4.55308 7.78468 3.90217 6.71746 3.74961 5.64722C3.71857 5.42944 3.79171 5.20973 3.9471 5.054L4.94511 4.05382C5.0339 3.96482 5.11489 3.78461 5.11489 3.54804C5.11489 3.31503 5.03634 3.13674 4.94915 3.04643L3.45037 1.61051L3.43915 1.5995C3.33727 1.49742 3.14507 1.40961 2.91411 1.40069Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomizePhoneField;
