import "./App.css";
import "@smastrom/react-rating/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentCentre from "./pages/StudentCentre";
import TutorCentre from "./pages/TutorCentre";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Course from "./pages/Course";
import Tutor from "./pages/Tutor";
import Profile from "./pages/Profile";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { AuthProvider } from "./services/AuthContext";
import PublicRoute from "./utils/PublicRoute";
import CreateCourse from "./pages/CreateCourse";
import Call2 from "./pages/Call";
import { STUDENT_ROLE, TUTOR_ROLE } from "./config";
import { SocketProvider } from "./services/SocketContext";
import CallNotification from "./components/CallNotification";
import CreateMeeting from "./pages/CreateMeeting";
import TutorMeetings from "./pages/TutorMeetings";
import StudentMeetings from "./pages/StudentMeetings";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <SocketProvider>
          <CallNotification />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/create-course"
              element={
                <ProtectedRoutes roles={[TUTOR_ROLE]}>
                  <CreateCourse />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tutor-meetings"
              element={
                <ProtectedRoutes roles={[TUTOR_ROLE]}>
                  <TutorMeetings />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/student-meetings"
              element={
                <ProtectedRoutes roles={[STUDENT_ROLE]}>
                  <StudentMeetings />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/create-meeting"
              element={
                <ProtectedRoutes roles={[TUTOR_ROLE]}>
                  <CreateMeeting />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/student-centre"
              element={
                <ProtectedRoutes roles={[STUDENT_ROLE]}>
                  <StudentCentre />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/tutor-centre"
              element={
                <ProtectedRoutes roles={[TUTOR_ROLE]}>
                  <TutorCentre />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoutes roles={[TUTOR_ROLE, STUDENT_ROLE]}>
                  <Messages />
                </ProtectedRoutes>
              }
            />
            <Route path="/search" element={<Search />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route path="/course" element={<Course />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/call" element={<Call2 />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            ></Route>
          </Routes>
        </SocketProvider>
      </Router>
    </AuthProvider>
  );
}
