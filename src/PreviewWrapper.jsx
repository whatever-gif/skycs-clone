import React from 'react';
import "./index.css";
import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import './dx-styles.scss';
export const Wrapper = ({ children }) => (
  <>
    <div className="wrapped">
      {children}
    </div>
  </>
);