// import React from 'react'
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'

// const ErrorPage = () => {
// const navigate = useNavigate();
// useEffect(()=>(
//     setTimeout(()=>navigate(-1),3000)
// ));
//   return (
//     <div>
//         <h1 className="">OOPS!! Something went wrong. You will be re-directed to previous page in 3-seconds.</h1>
//     </div>
//   )
// }

// export default ErrorPage

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1); // Go back one page
    }, 3000);

    return () => clearTimeout(timer); // ✅ Proper cleanup
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>OOPS!! Something went wrong.</h1>
      <p>You will be re-directed to the previous page in 3 seconds.</p>
    </div>
  );
};

export default ErrorPage;
