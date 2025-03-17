import { useState, useEffect, useMemo, useRef , useContext} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import backgroundImage from "../assets/sign_and_login_background.jpg";
import { AuthContext } from "./AuthContext";

export default function SignIn() {
    const nav = useNavigate();

    const {backendUrl} = useContext(AuthContext);

    const [newUser, setNewUser] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [message, setMessage] = useState("");
    const [message1, setMessage1] = useState("");

    const [isUsernameFocused, setIsUsernameFocused] = useState(false);

    const memoizedMessages = useRef({});

    const memoMessage = useMemo(() => {
        return memoizedMessages.current[newUser] || "";
    }, [newUser]);

    useEffect(() => {
        if (memoMessage) {
            setMessage1(memoMessage);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.post(
                    backendUrl +"/userInfos/add",
                    {
                        username: newUser,
                    },
                );

                const data = response.data;

                if (response.status === 201 && data.success === false) {
                    setMessage1(data.message);
                    memoizedMessages.current[newUser] = data.message;
                } else if (response.status === 200 && data.success === true) {
                    setMessage1(""); // Clear message on success
                    memoizedMessages.current[newUser] = "";
                }
            } catch (err) {
                console.error("Error during username validation:", err);
                setMessage1(
                    "Unable to validate username. Please try again later.",
                );
            }
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            setMessage1("");
        };
    }, [newUser, memoMessage, backendUrl]);

    async function formEventHandler(e) {
        e.preventDefault();

        if (newPassword !== repeatPassword) {
            setMessage("Both passwords didn't match");
            return;
        }

        if (!newUser || !newPassword) {
            setMessage("Username and password are required");
            return;
        }

        try {
            const response = await axios.post(
                backendUrl +"/userInfos/add",
                {
                    username: newUser,
                    password: newPassword,
                },
            );

            const data = response.data;
            console.log("Server response:", data);

            if (response.status === 201 && data.success === false) {
                setMessage(data.message);
                return;
            }

            if (response.status === 200 && data.success === true) {
                setMessage(data.message);
                nav("/Login", { replace: true }); // Success 🎊
            }
        } catch (err) {
            console.error("Error during sign-in:", err);
            setMessage("Unable to sign in. Please try again later.");
        }
    }

    return (
        <main
            className="flex h-[100vh] w-full items-center justify-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
            }}
        >
            <div className="flex h-max w-max flex-col items-center gap-2 rounded-md bg-white px-18 py-5 drop-shadow-xl">
                <h1 className="text-3xl font-medium">Sign In</h1>
                <form
                    onSubmit={formEventHandler}
                    className="mt-15 flex flex-col items-center gap-3"
                >
                    <label htmlFor="newUserName">
                        <input
                            type="text"
                            id="newUsername"
                            placeholder="Enter username"
                            value={newUser}
                            onFocus={() => setIsUsernameFocused(true)}
                            onChange={(e) => setNewUser(e.target.value)}
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            required
                        />
                    </label>
                    {newUser && isUsernameFocused === true && message1 && (
                        <p className="-mt-3 font-light text-pink-700">
                            {message1}
                        </p>
                    )}
                    <label htmlFor="password">
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter password"
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            required
                        />
                    </label>
                    <label htmlFor="verifyPassword">
                        <input
                            type="password"
                            id="repeatPassword"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            placeholder="Repeat password"
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            required
                        />
                    </label>

                    {message && (
                        <p className="font-light text-pink-700 hover:underline">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"

                        className="mt-5 w-20 rounded-md bg-sky-500 py-1 text-white hover:bg-sky-700 active:outline-3 active:outline-offset-1 active:outline-blue-500"
                    >
                        Submit
                    </button>
                </form>

                <Link to="/Login">
                    <span className="-ml-[90%] self-start font-light text-sky-400 hover:underline">
                        👈 back to login
                    </span>
                </Link>
            </div>
        </main>
    );
}
