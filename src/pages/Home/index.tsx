import React from "react";
import logo from '../../static/img/logo.svg';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.main}>
      <img src={logo} className={styles.appLogo} />
      <div className={styles.text}>Learn more, goto doc</div>
    </div>
  );
}