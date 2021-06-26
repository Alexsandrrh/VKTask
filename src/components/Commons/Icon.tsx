import React, { FC } from "react";

interface Props {
  icon: {
    id: string;
    viewBox: string;
  };
  className: string;
}

const Icon = ({ icon, className }: Props) => {
  return (
    <svg className={className} viewBox={icon.viewBox}>
      <use xlinkHref={`#${icon.id}`} />
    </svg>
  );
};

export default Icon;
