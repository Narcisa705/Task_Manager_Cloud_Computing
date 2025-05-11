import React from 'react';

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        {/* Aici poți include și alte meta tag-uri sau link-uri pentru CSS */}
      </head>
      <body>
        <header>
          <nav>
          
          </nav>
        </header>
        <main>{children}</main>
        <footer>
        
        </footer>
      </body>
    </html>
  );
};

export default Layout;
