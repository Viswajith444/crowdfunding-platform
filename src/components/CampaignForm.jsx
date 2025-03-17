import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import fallbackImg from '../assets/react.svg';
import axios from 'axios';

function CampaignForm() {
  const navigate = useNavigate();
    const {backendUrl} = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    targetAmount: '',
    deadline: '',
    description: '',
    coverImage: '', // This will be updated with the URL after upload
    story: '',
    rewards: [{ title: '', description: '', amount: '', deliveryDate: '' }]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRewardChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRewards = [...formData.rewards];
    updatedRewards[index] = {
      ...updatedRewards[index],
      [name]: value
    };

    setFormData({
      ...formData,
      rewards: updatedRewards
    });
  };

  const addReward = () => {
    setFormData({
      ...formData,
      rewards: [...formData.rewards, { title: '', description: '', amount: '', deliveryDate: '' }]
    });
  };

  const removeReward = (index) => {
    const updatedRewards = [...formData.rewards];
    updatedRewards.splice(index, 1);
    setFormData({
      ...formData,
      rewards: updatedRewards
    });
  };

  const uploadImage = async () => {
    // In a real application, you would upload to a server or cloud storage
    // For this example, we'll simulate by returning the preview URL

    // Real implementation would be something like:
    /*
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axios.post('/api/upload', formData);
    return response.data.imageUrl;
    */

    // For now, just return the data URL (in a real app, store in a proper storage)
    return (preview || fallbackImg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Upload image first
      const imageUrl = await uploadImage();

      // Prepare campaign data
      const campaignData = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        coverImage: imageUrl,
        rewards: formData.rewards.map(reward => ({
          ...reward,
          amount: Number(reward.amount)
        }))
      };

      // Send to backend
      const response = await axios.post(backendUrl + '/campaigns/create', campaignData);

      if (response.data.success) {
        // Redirect to the campaign page or home
        navigate('/');
      } else {
        setError(response.data.message || 'Failed to create campaign');
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.response?.data?.message || 'An error occurred while creating your campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create Your Fundraising Campaign</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Campaign Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="art">Art</option>
              <option value="food">Food</option>
              <option value="games">Games</option>
              <option value="music">Music</option>
              <option value="film">Film & Video</option>
              <option value="publishing">Publishing</option>
              <option value="fashion">Fashion</option>
              <option value="design">Design</option>
              <option value="community">Community</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Funding Goal ($)</label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Campaign Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Campaign Media</h2>

          <div className="mb-4 ">
            <label className="block text-gray-700 mb-2">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded hover:cursor-pointer"
              accept="image/*"
            />

            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Preview" className="h-48 object-cover rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Campaign Story */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Campaign Story</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Campaign Story</label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="8"
              required
            ></textarea>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Campaign Rewards</h2>

          {formData.rewards.map((reward, index) => (
            <div key={index} className="p-4 mb-4 border border-gray-200 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Reward #{index + 1}</h3>
                {formData.rewards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReward(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Reward Title</label>
                  <input
                    type="text"
                    name="title"
                    value={reward.title}
                    onChange={(e) => handleRewardChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Pledge Amount ($)</label>
                  <input
                    type="number"
                    name="amount"
                    value={reward.amount}
                    onChange={(e) => handleRewardChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 mb-1 text-sm">Reward Description</label>
                <textarea
                  name="description"
                  value={reward.description}
                  onChange={(e) => handleRewardChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="2"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-sm">Estimated Delivery</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={reward.deliveryDate}
                  onChange={(e) => handleRewardChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addReward}
            className="w-full py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            + Add Another Reward
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Launch Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CampaignForm;