import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateGift() {
  const navigate = useNavigate();
  const location = useLocation();
  const gift = location.state?.gift;

  // Redirect to home if no gift data is present
  if (!gift) {
    navigate("/home");
    return null;
  }

  const [formData, setFormData] = useState({
    name: gift.name,
    recipient: gift.recipient,
    recipientBirthday: gift.recipientBirthday ? gift.recipientBirthday.split('T')[0] : '',
    occasion: gift.occasion,
    date: gift.date.split('T')[0],
    price: gift.price,
    type: gift.type,
    notes: gift.notes || "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/gifts/${gift._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Gift updated successfully!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-highlight mb-6">Update Gift</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gift Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recipient</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recipient Birthday</label>
              <input
                type="date"
                name="recipientBirthday"
                value={formData.recipientBirthday}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Occasion</label>
              <input
                type="text"
                name="occasion"
                value={formData.occasion}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
              >
                <option value="given">Given</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-highlight focus:border-highlight"
                rows="3"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-colors duration-200"
              >
                Update Gift
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
