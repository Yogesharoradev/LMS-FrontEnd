import React, { useContext } from 'react'
import { Routes , Route} from "react-router-dom"
import AuthPage from './pages/auth'
import HomePage from './pages/homepage'
import AdminPage from './pages/adminpage'
import ProtectedRoute from './lib/protectedRoute'
import { AuthContext } from './context/auth-context'
import NotFoundPage from './pages/notFoundPage'
import NewCoursePage from './pages/add-new-course'
import StudentCourses from './components/studentsView/student-courses'
import CourseDetailsPage from './pages/course-detailsPage'
import PaypalPaymentReturn from './pages/payment-return'
import StudentCoursesPage from './pages/studentCoursesPage'
import CourseProgressPage from './pages/course-progressPage'

const App = () => {

  const {auth} = useContext(AuthContext)

  return (
      <Routes>
        <Route 
          path='/auth'
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <AuthPage />
            </ProtectedRoute>
              }
        />
       
        <Route 
          path='/'
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route 
          path='/Student-Courses'
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path='/course/details/:id'
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <CourseDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="payment-return"
          element={ 
              <PaypalPaymentReturn />
          }
        />
           <Route 
          path="my-courses-page"
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <StudentCoursesPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="course-progress/:id"
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <CourseProgressPage />
            </ProtectedRoute>
          }
         />



         <Route 
          path='/admin'
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

         <Route 
          path='/admin/add-new-course'
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <NewCoursePage />
            </ProtectedRoute>
          }
        />

        <Route 
          path='/admin/course/edit/:courseId'
          element={
            <ProtectedRoute authenticated={auth?.authenticate} user={auth?.user}>
              <NewCoursePage />
            </ProtectedRoute>
          }
        />

        
          <Route 
                path='*'
                element={
                    <NotFoundPage />
                }
              />

      </Routes>

  )
}

export default App