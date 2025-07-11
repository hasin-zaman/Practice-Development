import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export default function Home() {
  const [gifts, setGifts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/gifts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGifts(data);
    } catch (error) {
      toast.error("Failed to fetch gifts");
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-highlight">Gift Keeper</h1>
          <button
            onClick={() => navigate("/gifts/add")}
            className="flex items-center gap-2 px-4 py-2 bg-highlight text-white rounded-full hover:bg-accent transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            Add Gift
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <div
              key={gift._id}
              onClick={() => navigate(`/gifts/${gift._id}/edit`, { state: { gift } })}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-highlight">{gift.name}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  gift.type === 'given' ? 'bg-accent text-white' : 'bg-primary text-highlight'
                }`}>
                  {gift.type}
                </span>
              </div>
              <p className="text-gray-600">For: {gift.recipient}</p>
              <p className="text-gray-600">Occasion: {gift.occasion}</p>
              <p className="text-gray-600">Date: {new Date(gift.date).toLocaleDateString()}</p>
              {gift.price && (
                <p className="text-gray-600">Price: ${gift.price}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
