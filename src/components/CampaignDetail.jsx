import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns"; // Make sure to install this package
import { AuthContext } from "./AuthContext";
import fallbackImage from "../assets/react.svg";

function CampaignDetail() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pledgeAmount, setPledgeAmount] = useState("");
    const [selectedReward, setSelectedReward] = useState(null);
    const [isPledging, setIsPledging] = useState(false);

    const { backendUrl } = useContext(AuthContext);

    useEffect(() => {
        const fetchCampaign = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    backendUrl + `/campaigns/${id}`,
                );
                setCampaign(response.data);
            } catch (err) {
                console.error("Error fetching campaign:", err);
                setError(
                    "Failed to load campaign details. Please try again later.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaign();
    }, [id, backendUrl]);

    // Calculate days remaining for a campaign
    const calculateDaysRemaining = (deadline) => {
        if (!deadline) return 0;
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const timeDiff = deadlineDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysRemaining > 0 ? daysRemaining : 0;
    };

    // Calculate funding progress percentage
    const calculateProgress = (current, target) => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    const handlePledge = async (e) => {
        e.preventDefault();

        if (!pledgeAmount || pledgeAmount <= 0) {
            alert("Please enter a valid pledge amount.");
            return;
        }

        // Show loading state
        setIsPledging(true);

        try {
            // Send pledge to backend
            console.log(backendUrl);
            await axios.post(backendUrl + `/campaigns/${id}/pledge`, {
                amount: parseFloat(pledgeAmount),
                rewardId: selectedReward ? selectedReward.id : null
            });

            // Refresh campaign data to show updated pledge amount
            const response = await axios.get(backendUrl + `/campaigns/${id}`);
            setCampaign(response.data);

            // Reset form
            setPledgeAmount("");
            setSelectedReward(null);

            // Show success message
            alert("Thank you for your pledge! Your support is greatly appreciated.");
        } catch (err) {
            console.error("Error pledging to campaign:", err);
            alert("There was an error processing your pledge. Please try again.");
        } finally {
            setIsPledging(false);
        }
    };

    const selectReward = (reward) => {
        setSelectedReward(reward);
        setPledgeAmount(reward.amount);
        // Scroll to the pledge form
        document
            .getElementById("pledge-form")
            .scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-96 rounded bg-gray-200"></div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <div className="mb-4 h-6 rounded bg-gray-200"></div>
                            <div className="mb-2 h-4 rounded bg-gray-200"></div>
                            <div className="mb-2 h-4 rounded bg-gray-200"></div>
                            <div className="mb-2 h-4 rounded bg-gray-200"></div>
                        </div>
                        <div className="rounded bg-gray-100 p-6">
                            <div className="mb-4 h-6 rounded bg-gray-200"></div>
                            <div className="mb-2 h-4 rounded bg-gray-200"></div>
                            <div className="mb-4 h-10 rounded bg-gray-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    <p>{error}</p>
                    <button
                        className="mt-2 rounded bg-red-500 px-4 py-2 text-white"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return null;
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Campaign Header */}
            <div className="mb-8">
                <Link
                    to="/"
                    className="mb-4 inline-block text-blue-600 hover:text-blue-800"
                >
                    &larr; Back to All Campaigns
                </Link>
                <h1 className="mb-2 text-3xl font-bold">{campaign.title}</h1>
                <p className="mb-4 text-gray-600">{campaign.description}</p>
            </div>

            {/* Campaign Media */}
            <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
                <img
                    src={campaign.coverImage}
                    alt={campaign.title}
                    className="h-96 w-full object-cover object-center"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = {fallbackImage};
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Campaign Story */}
                <div className="md:col-span-2">
                    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-xl font-semibold">
                            About This Project
                        </h2>
                        <div className="prose max-w-none">
                            {campaign.story
                                .split("\n")
                                .map((paragraph, idx) => (
                                    <p key={idx} className="mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Campaign Stats and Pledge Form */}
                <div className="space-y-6">
                    {/* Campaign Stats */}
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <div className="mb-1 text-2xl font-bold">
                            ${campaign.currentAmount.toLocaleString()}
                        </div>
                        <div className="mb-4 text-gray-600">
                            pledged of ${campaign.targetAmount.toLocaleString()}{" "}
                            goal
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-green-600"
                                style={{
                                    width: `${calculateProgress(campaign.currentAmount, campaign.targetAmount)}%`,
                                }}
                            ></div>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-bold">
                                    {campaign.backers}
                                </div>
                                <div className="text-gray-600">backers</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {calculateDaysRemaining(campaign.deadline)}
                                </div>
                                <div className="text-gray-600">days to go</div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <span className="text-sm text-gray-600">
                                Campaign ends on:
                            </span>
                            <div className="font-semibold">
                                {campaign.deadline
                                    ? format(
                                          new Date(campaign.deadline),
                                          "MMMM d, yyyy",
                                      )
                                    : "N/A"}
                            </div>
                        </div>

                        <div className="mb-4">
                            <span className="text-sm text-gray-600">
                                Category:
                            </span>
                            <div className="font-semibold capitalize">
                                {campaign.category}
                            </div>
                        </div>

                        {/* Pledge Form */}
                        <form
                            id="pledge-form"
                            onSubmit={handlePledge}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-2 block text-gray-700">
                                    Pledge Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={pledgeAmount}
                                    onChange={(e) =>{
                                        setPledgeAmount(e.target.value);
                                    }}
                                    className="w-full rounded border border-gray-300 p-2"
                                    min="1"
                                    required
                                    disabled={isPledging}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:bg-gray-400"
                                disabled={isPledging}
                            >
                                {isPledging ? "Processing..." : "Back this project"}
                            </button>
                        </form>
                    </div>

                    {/* Share Buttons */}
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h3 className="mb-4 font-semibold">
                            Share this campaign
                        </h3>
                        <div className="flex space-x-2">
                            <button className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
                                Facebook
                            </button>
                            <button className="flex-1 rounded bg-blue-400 py-2 text-white hover:bg-blue-500">
                                Twitter
                            </button>
                            <button className="flex-1 rounded bg-green-500 py-2 text-white hover:bg-green-600">
                                Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rewards Section */}
            <div className="mt-12">
                <h2 className="mb-6 text-2xl font-semibold">Select a Reward</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {campaign.rewards.map((reward, index) => (
                        <div
                            key={index}
                            className={`rounded-lg border-2 bg-white p-6 shadow-md ${
                                selectedReward === reward
                                    ? "border-green-500"
                                    : "border-transparent"
                            } hover:border-green-500`}
                            onClick={() => selectReward(reward)}
                        >
                            <h3 className="mb-2 text-xl font-semibold">
                                {reward.title}
                            </h3>
                            <div className="mb-4 text-xl font-bold text-green-600">
                                Pledge ${reward.amount}
                            </div>
                            <p className="mb-4 text-gray-600">
                                {reward.description}
                            </p>
                            <div className="text-sm text-gray-500">
                                <span>Estimated delivery:</span>
                                <div className="font-medium">
                                    {reward.deliveryDate
                                        ? format(
                                              new Date(reward.deliveryDate),
                                              "MMMM yyyy",
                                          )
                                        : "N/A"}
                                </div>
                            </div>
                            <button
                                className="mt-4 w-full rounded bg-gray-100 py-2 font-medium text-gray-800 hover:bg-gray-200"
                                onClick={() => selectReward(reward)}
                                disabled={isPledging}
                            >
                                Select this reward
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CampaignDetail;