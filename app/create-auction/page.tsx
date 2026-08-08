'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import API from '@/lib/api';

export default function CreateAuction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

 const [formData, setFormData] = useState({
  title: '',
  description: '',
  startingPrice: '',
  category: '',
  condition: '',
  image: '',  // ADD THIS LINE
});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError('Title is required');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('Description is required');
        setLoading(false);
        return;
      }

      if (!formData.startingPrice || Number(formData.startingPrice) <= 0) {
        setError('Starting price must be greater than 0');
        setLoading(false);
        return;
      }

      // Create auction with image URL or placeholder
      const auctionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        condition: formData.condition,
        startingBid: Number(formData.startingPrice),
        images: imageUrl
          ? [imageUrl]
          : ['https://via.placeholder.com/400x300?text=Product+Image'],
      };

      const response = await API.post('/auctions', auctionData);

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setFormData({
          title: '',
          description: '',
          startingPrice: '',
          category: 'Other',
          condition: 'New',
        });
        setImageUrl('');

        // Redirect to auctions page after 1.5 seconds
        setTimeout(() => {
          router.push('/app/auctions');
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating auction:', err);
      setError(
        err.response?.data?.message ||
          'Failed to create auction. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Auction
        </h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              Auction created successfully! Redirecting...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Product Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., iPhone 14 Pro Max"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product in detail..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              required
            ></textarea>
          </div>

          {/* Starting Price Field */}
          <div>
            <label
              htmlFor="startingPrice"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Starting Bid (₦)
            </label>
            <input
              type="number"
              id="startingPrice"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleInputChange}
              placeholder="e.g., 50000"
              min="1"
              step="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Garden</option>
              <option value="Sports">Sports & Outdoors</option>
              <option value="Books">Books & Media</option>
              <option value="Toys">Toys & Games</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Condition Field */}
          <div>
            <label
              htmlFor="condition"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          {/* Image Upload - CldUploadWidget */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Image
            </label>
            <CldUploadWidget
              uploadPreset="tradespace"
              onSuccess={(result: any) => {
                setFormData({ ...formData, image: result.info.secure_url });
              }}
              onError={(error) => {
                console.error('Upload error:', error);
                setError('Image upload failed. Please try again.');
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
                >
                  {imageUrl ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="w-32 h-32 object-cover mx-auto rounded mb-2"
                      />
                      <p className="text-blue-600 font-semibold text-sm">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 font-semibold mb-1">
                        Click to upload image
                      </p>
                      <p className="text-gray-500 text-sm">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </button>
              )}
            </CldUploadWidget>
            <p className="text-gray-500 text-xs mt-2">
              Note: Image upload is optional. A placeholder will be used if no
              image is uploaded.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Creating Auction...' : 'Create Auction'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}