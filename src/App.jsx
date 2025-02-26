import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
// import "./index.css"

function App() {
  let inputItems = [
    {
      link: "/",
      text: "Home",
    },
    {
      link: "/",
      text: "Home",
    },
    {
      link: "/",
      text: "Home",
    },
  ];

  return (
    <>
      <Navbar items={inputItems} />
      <main className="mt-[5rem]">
        <Home />
      </main>
    </>
  );
}

export default App;
