import React, { useState, useRef, useCallback, useEffect } from 'react';

import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  EmailRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import { useAuthService } from '@packages/services/auth-services';

import './LoginForm.scss';
import { useI18n } from '@/i18n/useI18n';

export default function LoginForm() {
  const { signIn } = useAuthService();
  const [loading, setLoading] = useState(false);
  const formData = useRef({ email: '', password: '' });

  const { t } = useI18n("Common");

  const emailEditorOptions = { stylingMode: 'filled', placeholder: t('email'), mode: 'email' };
  const passwordEditorOptions = { stylingMode: 'filled', placeholder: t('password'), mode: 'password' };
  const rememberMeEditorOptions = { text: t('rememberMe'), elementAttr: { class: 'form-text' } };
  const onSubmit = useCallback(async (e: any) => {
    e.preventDefault();
    const { email, password } = formData.current;
    setLoading(true);

    const result = await signIn(email, password);
    if (!result.isOk) {
      setLoading(false);
      notify(result.message, 'error', 2000);
    }
  }, [signIn]);
  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <Form formData={formData.current} disabled={loading}>
        <Item
          dataField={'email'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message={t('emailIsRequired')} />
          <EmailRule message={t('emailIsInvalid')} />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message={t('passwordIsRequired')} />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'rememberMe'}
          editorType={'dxCheckBox'}
          editorOptions={rememberMeEditorOptions}
        >
          <Label visible={false} />
        </Item>
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {
                loading
                  ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : t('signIn')
              }
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
    </form>
  );
}

