import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/auth'
import Profile from './pages/profile'
import Chat from './pages/chat'
import { Toaster } from './components/ui/sonner'
import { Provider } from 'react-redux'
import store from './store/store'
import { SocketProvider } from './context/SocketContext'
import Landing from './pages/Landing'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Landing/>
      },
      {
        path: "/auth",
        element: <Auth/>
      },
      {
        path: "/chat",
        element: <Chat/>
      },
      {
        path: "/profile",
        element: <Profile/>
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <SocketProvider>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router}/>
    </SocketProvider>
  </Provider>
 </StrictMode>,
)
