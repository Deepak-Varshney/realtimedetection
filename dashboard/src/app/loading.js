// components/Loader.js

import React from 'react';

const Loader = () => (
  <div className="flex justify-center items-center h-screen bg-purple-50">
    <div className="w-16 h-16 border-4 border-solid border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
  </div>
);

export default Loader;
