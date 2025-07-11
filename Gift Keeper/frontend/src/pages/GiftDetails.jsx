import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function GiftDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gift, setGift] = useState(null);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:5000/api/gifts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGift(data);
      } catch (error) {
        toast.error("Failed to fetch gift details");
        navigate("/home");
      }
    };
    fetchGift();
  }, [id, navigate]);

  if (!gift) {
    return <div className="min-h-screen bg-secondary p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-highlight">{gift.name}</h2>
            <span className={`px-2 py-1 rounded-full text-sm ${
              gift.type === 'given' ? 'bg-accent text-white' : 'bg-primary text-highlight'
            }`}>
              {gift.type}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Recipient</h3>
              <p className="mt-1 text-lg text-gray-900">{gift.recipient}</p>
            </div>

            {gift.recipientBirthday && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Recipient Birthday</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(gift.recipientBirthday).toLocaleDateString()}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Occasion</h3>
              <p className="mt-1 text-lg text-gray-900">{gift.occasion}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(gift.date).toLocaleDateString()}
              </p>
            </div>

            {gift.price && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="mt-1 text-lg text-gray-900">${gift.price}</p>
              </div>
            )}

            {gift.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-lg text-gray-900">{gift.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate(`/gifts/${id}/edit`)}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-colors duration-200"
            >
              Edit Gift
            </button>
            <button
              onClick={() => navigate("/home")}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
