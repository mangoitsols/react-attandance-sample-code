import React from 'react';
import '../style/404.css';

const PageNotFound = () => {
    return (
        <div className='text-center mainDiv '>
        <section className="error-container">
          <span className="four"><span className="screen-reader-text">4</span></span>
          <span className="zero"><span className="screen-reader-text">0</span></span>
          <span className="four"><span className="screen-reader-text">4</span></span>
        </section>
        <div className="link-container">
          <h1 className="more-link topHeaderH1">Ooops....</h1>
          <h4 className="more-link">Page not found</h4>
        </div>
        </div>
     );
}
 
export default PageNotFound;