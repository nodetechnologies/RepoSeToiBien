import React, { useEffect } from 'react';
import AuthLayout from '../../layouts/AuthLayout';

//components
import ForgotPasswordReset from '../../components/@generalComponents/layout/ForgotPassword';

const ForgotPassword = () => {
  const colorStored = localStorage.getItem('mainColor');
  const secColor = localStorage.getItem('secColor');
  const userNameStored = localStorage.getItem('userName');

  useEffect(() => {
    if (colorStored) return;
  }, [colorStored]);

  return (
    <div id={colorStored ? null : 'main'}>
      <AuthLayout userName={userNameStored}>
        <ForgotPasswordReset />
      </AuthLayout>
    </div>
  );
};

export default ForgotPassword;
