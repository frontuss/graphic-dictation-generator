import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

import './Btn.scss';

export function Btn(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={classNames('btn', props.className)} />;
}
