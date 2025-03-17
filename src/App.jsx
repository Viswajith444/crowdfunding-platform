import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import IntroImage from "./assets/stolen_img.png"
// import "./index.css"

function App() {
    let inputItems = [
        {
            link: "/",
            text: "Home",
        },

        {
            link: "/service",
            text: "Service",
        },

        {
            link: "/startCampaign",
            text: "Start Campaign",
        },

        {
            link: "/Login",
            text: "Login",
        },
    ];

    return (
        <>
            <Navbar items={inputItems} />
            <main className="ml-[3rem] mt-[5rem] h-[200vh]">
                <div className="border-b-1 border-gray-500 animate-appear">
                    <img src={IntroImage} alt="Intro" />
                </div>

                <h1 className="py-4 font-semibold">Inspire Fundraisers inspired by what you care about</h1>
                <Home />
            </main>
        </>
    );
}

export default App;
