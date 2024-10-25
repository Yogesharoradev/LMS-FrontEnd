import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/auth-context/index.jsx'
import CourseProvider from './context/course-context/index.jsx'
import StudentProvider from './context/student-context/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
       <AuthProvider>
        <CourseProvider>
         <StudentProvider>
           <App />
         </StudentProvider>
        </CourseProvider>
        </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
