import Dashboard from "./Dashboard";
import Login from "./Login";

function HomePage() {
  const accessToken = sessionStorage.getItem("accessToken");
  return (
    <div>
      {!accessToken && <Login />}
      {accessToken && <Dashboard />}
    </div>
  );
}

export default HomePage;
