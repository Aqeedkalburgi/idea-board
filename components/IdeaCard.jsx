import { useState } from 'react';

export default function IdeaCard({ idea, onUpvote }) {
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async () => {
    if (isUpvoting) return;
    
    setIsUpvoting(true);
    try {
      await onUpvote(idea.id);
    } catch (error) {
      console.error('Error upvoting idea:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Idea Text */}
      <p className="text-gray-800 text-lg leading-relaxed mb-4">
        {idea.text}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Timestamp */}
        <span className="text-sm text-gray-500">
          {formatDate(idea.createdAt)}
        </span>

        {/* Upvote Button */}
        <button
          onClick={handleUpvote}
          disabled={isUpvoting}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all
            ${isUpvoting 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800'
            }
          `}
        >
          <svg 
            className={`w-5 h-5 ${isUpvoting ? 'animate-pulse' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-semibold">
            {idea.upvotes || 0}
          </span>
        </button>
      </div>
    </div>
  );
}
