import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const nav = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/userInfos/chk",
                {
                    username,
                    password,
                },
            );

            const data = response.data;

            setMessage("");
            console.log(data);

            if (response.status === 200 && data.login === true) {
                console.log("Login successful");
                nav("/Home", { replace: true });
                // Redirect or update the UI as needed
            } else if (response.status !== 201 || data.login === false) {
                console.log("Invalid Password");
                setMessage(data.message);
            } else {
                console.log("idk");
                setMessage(data.message);
            }
        } catch (err) {
            console.error("Error during login:", err);
            setMessage("An error occurred. Please try again.");
        }
    };
    return (
        <main className="flex h-[100vh] w-full items-center justify-center bg-stone-200">
            <div className="flex min-h-80 min-w-75 flex-col items-center gap-2 rounded-md bg-white drop-shadow-xl">
                <h1 className="mt-5 text-3xl font-medium">Login</h1>
                <form
                    onSubmit={handleLogin}
                    className="mt-20 flex flex-col items-center gap-3"
                >
                    <label htmlFor="name">
                        <input
                            type="text"
                            placeholder="Enter username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(() => e.target.value)}
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            required
                        />
                    </label>
                    <label htmlFor="password">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(() => e.target.value)}
                            placeholder="Enter password"
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        // onClick={() => {
                        //     nav("/Home", { replace: true });
                        // }}
                        className="mt-5 w-20 rounded-md bg-sky-500 py-1 text-white hover:bg-sky-700 active:outline-3 active:outline-offset-1 active:outline-blue-500"
                    >
                        Submit
                    </button>
                </form>

                {message && (
                    <p className="font-light text-pink-700 hover:underline">
                        {message}
                    </p>
                )}

                <Link to="/SignIn" className="mr-5 self-end">
                    <span className="font-light text-sky-400 hover:underline">
                        create new account
                    </span>
                </Link>
            </div>
        </main>
    );
}
