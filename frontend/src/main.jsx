import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'
import PlantContextProvider from './context/PlantContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
          domain="dev-hw5ruopz5lz2c3p0.us.auth0.com"
          clientId="NF4ZjbcsPKmhrHshA5Bsvqgrk7Y0uj2o"
          authorizationParams={{
          redirect_uri: window.location.origin,
          audience,
          scope
          }}
      >
        <PlantContextProvider>
          <App/>
        </PlantContextProvider>
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>
)
