import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
    const nav = useNavigate();

    const [newUser, setNewUser] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [message, setMessage] = useState("");
    const [message1, setMessage1] = useState("");

    const [isUsernameFocused, setIsUsernameFocused] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.post(
                    "http://localhost:5000/userInfos/add",
                    {
                        username: newUser,
                    }
                );

                const data = response.data;

                if (response.status === 201 && data.success === false) {
                    setMessage1(data.message);
                } else if (response.status === 200 && data.success === true) {
                    setMessage1(""); // no need to display problem to the user
                }
            } catch (err) {
                console.log(err);
            }
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            setMessage1("");
        };
    }, [newUser]);

    async function formEventHandler(e) {
        e.preventDefault();

        if (newPassword !== repeatPassword) {
            console.log(newPassword, repeatPassword);
            setMessage("Both password didn't match");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/userInfos/add", {
                username: newUser,
                password: newPassword
            });

            const data = response.data;
            console.log(data, response.status);

            if (response.status === 201 && data.success === false) {
                setMessage(data.message);
                return;
            }

            if (response.status === 200 && data.success === true) {
                setMessage(data.message);
                nav("/Login", { replace: true }); // Success 🎊
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main className="flex h-[100vh] w-full items-center justify-center bg-stone-200">
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
                    {isUsernameFocused === true && message1 && (
                        <p className="font-light text-pink-700 -mt-4">
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
                        // onClick={() => {
                        //     nav("/Home", { replace: true });
                        // }}
                        className="mt-5 w-20 rounded-md bg-sky-500 py-1 text-white hover:bg-sky-700 active:outline-3 active:outline-offset-1 active:outline-blue-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </main>
    );
}
