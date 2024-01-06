import ResponsiveBox, { Col, Item, Location, Row } from "devextreme-react/responsive-box";
import { Button, ScrollView, TabPanel, Tabs, DropDownBox, List } from 'devextreme-react';
import { Item as TabItem } from 'devextreme-react/tabs';
import { useState } from "react";


export const PartReplyCall = () => {

    return (
        <div className={'w-full message-reply mb-2'}>

            <center className="mt-5">

                <Button
                    stylingMode={"contained"}
                    type="default"
                    text="Thêm cuộc gọi"
                    className='mr-1'

                />
                <Button
                    stylingMode={"contained"}
                    type="default"
                    icon="file"
                    text="Thêm file ghi âm"
                    className='mr-1'

                />


            </center>

            <div className={'w-full mb-4 p-5'} style={{ textAlign: "center" }}>

                <div className="flex float-right">
                    <DropDownBox
                        label="Lựa chọn xử lý"
                        style={{ width: 160 }}
                    >
                        <List>

                        </List>

                    </DropDownBox>
                    <Button
                        stylingMode={"contained"}
                        type="default"
                        icon="save"
                        text="Lưu"
                        className='mr-1'

                    />
                </div>


            </div>
        </div>
    );
}