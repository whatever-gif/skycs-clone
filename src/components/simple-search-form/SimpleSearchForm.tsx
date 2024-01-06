import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
} from 'devextreme-react/form';
import './simple-search-form.scss'
import Button from "devextreme-react/button";
import {DropDownButton, ResponsiveBox} from "devextreme-react";

const renderDropdownItems = (data: any) => {
  return <Button
    type={'normal'}
    stylingMode={'outlined'}
    text={data.text}
    icon={data.icon}
    />
}
const keywordFieldOptions = {
  stylingMode: 'filled',
  placeholder: 'Keyword',
  buttons: [{
    location: 'before',
    name: 'search',
    options: {
      icon: 'search'
    }
  }]
};
export default function SimpleSearchForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formData = useRef({ keyword: '' });

  const onSubmit = useCallback(async (e: any) => {
    e.preventDefault();
    const { keyword } = formData.current;
    setLoading(true);

    setLoading(false);
  }, [navigate]);

  return (
    <div className='simple-search-form-container'>
      <form onSubmit={onSubmit}>
        <Form formData={formData.current}  disabled={loading} colCount={4} className={'simple-search-form'}>
          <Item
            dataField={'keyword'}
            editorType={'dxTextBox'}
            editorOptions={keywordFieldOptions}
            colSpan={3}
          >
            <Label visible={false} />
          </Item>
          <ButtonItem cssClass={'simple-search-form__button'}>
            <ButtonOptions
              type={'default'}
              width={'150px'}
              useSubmitBehavior={true}
              icon={'add'}
              text={'Search'}
            >
            </ButtonOptions>
          </ButtonItem>
        </Form>
      </form>
      <DropDownButton
        showArrowIcon={false}
        icon="more"
        className={'simple-search-form__button'}
        dropDownOptions={{
          width: 200,
        }}
        itemRender={renderDropdownItems}
        items={[{text: 'Export', icon: 'export'}, {text: 'Import', icon: 'import'}]}
      />
    </div>
  );
}

