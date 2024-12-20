import React, { useEffect } from 'react';
import AuthLayout from '../../layouts/AuthLayout';

//components
import SignIn from '../../components/@generalComponents/layout/SignIn';

const Login = () => {
  const colorStored = localStorage.getItem('mainColor');
  const secColor = localStorage.getItem('secColor');
  const userNameStored = localStorage.getItem('userName');

  useEffect(() => {
    if (colorStored) return;
  }, [colorStored]);

  return (
    <div id={colorStored ? null : 'main'}>
      <AuthLayout userName={userNameStored}>
        <SignIn />
      </AuthLayout>
    </div>
  );
};

export default Login;
