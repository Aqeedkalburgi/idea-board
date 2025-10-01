// OPTIONAL - Client-side utilities for using Cloud Functions (secure method)
// Use this instead of the client-only transaction method for better security

import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

// Callable function references
const upvoteIdeaFunction = httpsCallable(functions, 'upvoteIdea');
const hasUserVotedFunction = httpsCallable(functions, 'hasUserVoted');
const getVoteCountFunction = httpsCallable(functions, 'getVoteCount');

/**
 * Upvote an idea using Cloud Function (prevents multiple votes per user)
 * @param {string} ideaId - The ID of the idea to upvote
 * @returns {Promise<object>} Result with success status and new upvote count
 */
export const upvoteIdea = async (ideaId) => {
  try {
    const result = await upvoteIdeaFunction({ ideaId });
    return result.data;
  } catch (error) {
    console.error('Error upvoting idea:', error);
    throw new Error(error.message || 'Failed to upvote idea');
  }
};

/**
 * Check if the current user has already voted on an idea
 * @param {string} ideaId - The ID of the idea to check
 * @returns {Promise<object>} Object with hasVoted boolean and votedAt timestamp
 */
export const hasUserVoted = async (ideaId) => {
  try {
    const result = await hasUserVotedFunction({ ideaId });
    return result.data;
  } catch (error) {
    console.error('Error checking vote status:', error);
    throw new Error(error.message || 'Failed to check vote status');
  }
};

/**
 * Get the total vote count for an idea
 * @param {string} ideaId - The ID of the idea
 * @returns {Promise<object>} Object with voteCount number
 */
export const getVoteCount = async (ideaId) => {
  try {
    const result = await getVoteCountFunction({ ideaId });
    return result.data;
  } catch (error) {
    console.error('Error getting vote count:', error);
    throw new Error(error.message || 'Failed to get vote count');
  }
};

// Example usage in a React component:
/*
import { upvoteIdea, hasUserVoted } from '../utils/cloudFunctions';

// In your component:
const handleSecureUpvote = async (ideaId) => {
  try {
    // Check if user has already voted (optional)
    const voteStatus = await hasUserVoted(ideaId);
    if (voteStatus.hasVoted) {
      alert('You have already upvoted this idea!');
      return;
    }

    // Upvote the idea
    const result = await upvoteIdea(ideaId);
    console.log('Upvoted successfully:', result);
    
    // The UI will update automatically via Firestore real-time listeners
  } catch (error) {
    alert(error.message);
  }
};
*/
