import React, { Suspense, lazy } from 'react';

// Lazy load your pages here
const pagesConfig = {
  Home: lazy(() => import('./pages/Home')),
  About: lazy(() => import('./pages/About')),
  // Add more pages as needed
};

const PageLoader = () => <div>Loading...</div>;

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}> 
      {/* Route configuration here, use pagesConfig */}
      <Switch>
        {Object.entries(pagesConfig).map(([name, Component]) => (
          <Route key={name} path={`/${name.toLowerCase()}`} component={Component} />
        ))}
      </Switch>
    </Suspense>
  );
};

export default App;