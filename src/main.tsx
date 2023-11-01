import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import App from './App.tsx'


const oidcConfig = {
  authority: "http://localhost:3000/oidc/",
  client_id: "oidc_client",
  client_secret: "a_different_secret",
  redirect_uri: "http://localhost:5173/redirect",
  scope: 'openid profile lorem',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AuthProvider {...oidcConfig}>
    <App />
    </AuthProvider>
  </React.StrictMode>,
)
