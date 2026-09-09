import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./features/auth/Login";
import Profile from "./features/profile/Profile";
import Feed from "./features/feed/Feed";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Error404 from "./components/Error404";
import Connections from "./features/connections/Connections";
import Requests from "./features/connections/Requests";
import Premium from "./features/premium/Premium";
import Chat from "./features/chat/Chat";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:toUserId" element={<Chat />} />
            </Route>
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
