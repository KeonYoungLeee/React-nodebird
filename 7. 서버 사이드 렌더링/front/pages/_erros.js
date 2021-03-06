import React from 'react';
import Error from 'next/error';
import PropTypes from 'prop-types';

const MyError = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode}에러 발생</h1>
      <Error statusCode={statusCode} />
    </div>
  );
};


MyError.propTypes = {
  statusCode: PropTypes.number,
}

MyError.defaultProps = {
  statusCode: 400,
}

MyError.getInitialprops = async (context) => {
  const statusCode = 
    context.res 
      ? context.res.statusCode 
      : context.err 
      ? context.err.statusCode 
      : null;
      
  return { statusCode };
}

export default MyError;