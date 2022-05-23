import classNames from 'classnames';
import { HTMLAttributes } from 'react';

import './style.css';
import './Icon.scss';

interface IconProps extends HTMLAttributes<HTMLElement> {
  iconName: string;
}

export function Icon(props: IconProps) {
  const { iconName, className, ...restProps } = props;

  return <i className={classNames('icon', `icon_${iconName}`, className)} {...restProps} />;
}
