import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

import fallbackImage from "../assets/react.svg";

function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {backendUrl} = useContext(AuthContext);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'technology', name: 'Technology' },
    { id: 'art', name: 'Art' },
    { id: 'food', name: 'Food' },
    { id: 'games', name: 'Games' },
    { id: 'music', name: 'Music' },
    { id: 'film', name: 'Film & Video' },
    { id: 'publishing', name: 'Publishing' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'design', name: 'Design' },
    { id: 'community', name: 'Community' }
  ];

  // Fetch all campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(backendUrl + '/campaigns');
        setCampaigns(response.data);
        setFilteredCampaigns(response.data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns by category
  const filterByCategory = async (categoryId) => {
    setActiveCategory(categoryId);
    setIsLoading(true);

    try {
      if (categoryId === 'all') {
        setFilteredCampaigns(campaigns);
      } else {
        // Option 1: Filter from already fetched data
        setFilteredCampaigns(campaigns.filter(campaign => campaign.category === categoryId));

        // Option 2: Fetch from API (uncomment if you prefer this approach)
        /*
        const response = await axios.get(`http://localhost:5000/campaigns/category/${categoryId}`);
        setFilteredCampaigns(response.data);
        */
      }
    } catch (err) {
      console.error('Error filtering campaigns:', err);
      setError('Failed to filter campaigns. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate days remaining for a campaign
  const calculateDaysRemaining = (deadline) => {
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

  // Show skeleton loading UI
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Discover Projects</h2>
          <div className="w-40 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="mb-8">
          <div className="flex space-x-2 pb-2 overflow-x-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4 animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Discover Projects</h2>
        <Link
          to="/startCampaign"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Start a Campaign
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => filterByCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* No campaigns found */}
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">No campaigns found</h3>
          <p className="mt-2 text-gray-400">Be the first to create a campaign in this category!</p>
        </div>
      )}

      {/* Campaign Grid */}
      {filteredCampaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <Link
              to={`/campaign/${campaign._id}`}
              key={campaign._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={campaign.coverImage}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = null;
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    {campaign.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.description}</p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${calculateProgress(campaign.currentAmount, campaign.targetAmount)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-semibold">${campaign.currentAmount.toLocaleString()}</span>
                    <span className="text-gray-500"> of ${campaign.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-gray-500">
                    {calculateDaysRemaining(campaign.deadline)} days left
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
