// Libraries
import React from 'react';

const ConditionalRenderer = ({ render, children }) => {
  if (render) return <React.Fragment>{children}</React.Fragment>;
  else return null;
};

export default ConditionalRenderer;
