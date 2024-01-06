import { Popup } from "devextreme-react";
import { useAtom, useAtomValue } from "jotai";
import React from "react";
import { listAgentAtom } from "./store";
import { nanoid } from "nanoid";

const ListAgent = ({ onCancel }: any) => {
  const listAgent = useAtomValue(listAgentAtom);
  return (
    <Popup
      width={200}
      height={"auto"}
      hideOnOutsideClick={true}
      closeOnOutsideClick={onCancel}
      showTitle={false}
      visible={listAgent.length > 0}
    >
      {listAgent.map((item) => {
        return (
          <p className="agent-item-value" key={nanoid()}>
            {item}
          </p>
        );
      })}
    </Popup>
  );
};

export default ListAgent;
