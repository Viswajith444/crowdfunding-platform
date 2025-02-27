import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const nav = useNavigate();

    return (
        <main className="flex h-[100vh] w-full items-center justify-center bg-stone-200">
            <div className="flex h-max w-max flex-col items-center gap-2 rounded-md bg-white py-5 px-18 drop-shadow-xl">
                <h1 className="text-3xl font-medium">Sign In</h1>
                <form className="mt-15 flex flex-col items-center gap-3">
                    <label htmlFor="newUserName">
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            // required
                        />
                    </label>
                    <label htmlFor="password">
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            // required
                        />
                    </label>
                    <label htmlFor="verifyPassword">
                        <input
                            type="password"
                            placeholder="Repeat password"
                            className="h-8 rounded-md pl-1 inset-ring-2 inset-ring-gray-400 placeholder:pl-1 placeholder:text-gray-400 invalid:border-pink-500 invalid:text-pink-600 focus:inset-ring-sky-400 focus:outline-2 focus:outline-offset-0 focus:outline-sky-500"
                            // required
                        />
                    </label>

                    <button
                        type="submit"
                        onClick={() => {
                            nav("/Home", { replace: true });
                        }}
                        className="mt-5 w-20 rounded-md bg-sky-500 py-1 text-white hover:bg-sky-700 active:outline-3 active:outline-offset-1 active:outline-blue-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </main>
    );
}
