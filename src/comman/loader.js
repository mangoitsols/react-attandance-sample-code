import React from 'react';
import ReactLoading from 'react-loading';
 
const Example = ({ type, color }) => (
    <ReactLoading type={"spinningBubbles"} color={"#007bff"} height={100} width={100} className="loader" />
);
 
export default Example;