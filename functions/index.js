// OPTIONAL - Secure one-vote-per-user Cloud Function
// This ensures users can only upvote each idea once by tracking votes in a subcollection

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Callable function to upvote an idea with one-vote-per-user enforcement
exports.upvoteIdea = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to upvote.'
    );
  }

  const { ideaId } = data;
  const userId = context.auth.uid;

  if (!ideaId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'ideaId is required.'
    );
  }

  const db = admin.firestore();
  const ideaRef = db.collection('ideas').doc(ideaId);
  const voteRef = ideaRef.collection('votes').doc(userId);

  try {
    // Use a transaction to ensure atomicity
    const result = await db.runTransaction(async (transaction) => {
      // Check if idea exists
      const ideaDoc = await transaction.get(ideaRef);
      if (!ideaDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Idea not found.'
        );
      }

      // Check if user has already voted
      const voteDoc = await transaction.get(voteRef);
      if (voteDoc.exists) {
        throw new functions.https.HttpsError(
          'already-exists',
          'User has already upvoted this idea.'
        );
      }

      // Get current upvotes count
      const currentUpvotes = ideaDoc.data().upvotes || 0;

      // Record the vote
      transaction.set(voteRef, {
        votedAt: admin.firestore.FieldValue.serverTimestamp(),
        userId: userId
      });

      // Increment upvotes
      transaction.update(ideaRef, {
        upvotes: currentUpvotes + 1
      });

      return { newUpvotes: currentUpvotes + 1 };
    });

    return {
      success: true,
      upvotes: result.newUpvotes,
      message: 'Idea upvoted successfully!'
    };

  } catch (error) {
    console.error('Error upvoting idea:', error);
    
    // Re-throw HttpsError as-is
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Wrap other errors
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while upvoting the idea.'
    );
  }
});

// Optional: Function to check if user has voted on an idea
exports.hasUserVoted = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated.'
    );
  }

  const { ideaId } = data;
  const userId = context.auth.uid;

  if (!ideaId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'ideaId is required.'
    );
  }

  try {
    const db = admin.firestore();
    const voteRef = db.collection('ideas').doc(ideaId).collection('votes').doc(userId);
    const voteDoc = await voteRef.get();

    return {
      hasVoted: voteDoc.exists,
      votedAt: voteDoc.exists ? voteDoc.data().votedAt : null
    };
  } catch (error) {
    console.error('Error checking vote status:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while checking vote status.'
    );
  }
});

// Optional: Get vote count for an idea
exports.getVoteCount = functions.https.onCall(async (data, context) => {
  const { ideaId } = data;

  if (!ideaId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'ideaId is required.'
    );
  }

  try {
    const db = admin.firestore();
    const votesSnapshot = await db.collection('ideas').doc(ideaId).collection('votes').get();
    
    return {
      voteCount: votesSnapshot.size
    };
  } catch (error) {
    console.error('Error getting vote count:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while getting vote count.'
    );
  }
});
