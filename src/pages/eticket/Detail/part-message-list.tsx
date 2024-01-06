import ResponsiveBox, { Col, Item, Location, Row } from "devextreme-react/responsive-box";
import { Button, ScrollView, TabPanel, Tabs, TextArea, DropDownBox, List } from 'devextreme-react';
import { Item as TabItem } from 'devextreme-react/tabs';
import { Avatar } from "../components/avatar";
import { PartMessageItem } from "./part-message-item";
import { Eticket } from "@/packages/types";


export const PartMessageList = ({ data }: { data: Eticket }) => {


    return (
        <div className={'w-full pt-3 pb-3 pl-5 pr-5'}>
            {data.MessageList?.map((item, idx) => {
                return <PartMessageItem data={item} />

            })}


        </div>
    );
}