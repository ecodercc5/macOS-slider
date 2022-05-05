import React, { PropsWithChildren } from "react";

interface Props {}

export const Card: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return <div className="card">{children}</div>;
};
