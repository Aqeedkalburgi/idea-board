import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  orderBy, 
  query, 
  serverTimestamp,
  runTransaction,
  doc
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import IdeaCard from '../components/IdeaCard';

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to ideas in real-time
  useEffect(() => {
    if (!db) {
      // Show demo data when Firebase is not configured
      setIdeas([
        {
          id: 'demo-1',
          text: 'Welcome to the Idea Board! This is a demo idea. Set up Firebase to start creating real ideas.',
          upvotes: 5,
          createdAt: { toDate: () => new Date() },
          authorUid: 'demo-user'
        },
        {
          id: 'demo-2', 
          text: 'Add your Firebase configuration to .env.local to enable real-time functionality.',
          upvotes: 3,
          createdAt: { toDate: () => new Date(Date.now() - 3600000) },
          authorUid: 'demo-user'
        }
      ]);
      return;
    }

    const q = query(
      collection(db, 'ideas'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIdeas(ideasData);
    });

    return () => unsubscribe();
  }, []);

  // Handle idea submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newIdea.trim()) return;
    if (newIdea.length > 280) {
      alert('Ideas must be 280 characters or less');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!db || !user) {
        // Demo mode - just add to local state
        const newIdeaObj = {
          id: 'demo-' + Date.now(),
          text: newIdea.trim(),
          upvotes: 0,
          createdAt: { toDate: () => new Date() },
          authorUid: 'demo-user'
        };
        setIdeas(prev => [newIdeaObj, ...prev]);
        setNewIdea('');
        alert('Demo mode: Idea added locally. Set up Firebase for persistence.');
      } else {
        // Real Firebase mode
        console.log('Adding idea to Firestore...');
        const docRef = await addDoc(collection(db, 'ideas'), {
          text: newIdea.trim(),
          upvotes: 0,
          createdAt: serverTimestamp(),
          authorUid: user.uid
        });
        console.log('Idea added successfully with ID:', docRef.id);
        setNewIdea('');
      }
    } catch (error) {
      console.error('Error adding idea:', error);
      
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please check your Firestore rules and ensure the database is created.');
      } else if (error.code === 'not-found') {
        alert('Firestore database not found. Please create the database in Firebase Console.');
      } else {
        alert(`Failed to submit idea: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle upvote using transaction (client-only method)
  const handleUpvote = async (ideaId) => {
    try {
      if (!db) {
        // Demo mode - update local state
        setIdeas(prev => prev.map(idea => 
          idea.id === ideaId 
            ? { ...idea, upvotes: (idea.upvotes || 0) + 1 }
            : idea
        ));
        return;
      }

      if (!user) {
        alert('Please wait for authentication to complete');
        return;
      }

      console.log('Attempting to upvote idea:', ideaId);
      const ideaRef = doc(db, 'ideas', ideaId);
      
      await runTransaction(db, async (transaction) => {
        console.log('Transaction started for idea:', ideaId);
        const ideaDoc = await transaction.get(ideaRef);
        
        if (!ideaDoc.exists()) {
          console.error('Document does not exist:', ideaId);
          throw new Error('Idea does not exist - it may have been deleted');
        }
        
        const currentUpvotes = ideaDoc.data().upvotes || 0;
        console.log('Current upvotes:', currentUpvotes);
        
        transaction.update(ideaRef, {
          upvotes: currentUpvotes + 1
        });
        
        console.log('Transaction completed successfully');
      });
    } catch (error) {
      console.error('Error upvoting idea:', error);
      
      // More specific error messages
      if (error.code === 'not-found') {
        alert('This idea no longer exists. Please refresh the page.');
      } else if (error.code === 'permission-denied') {
        alert('Permission denied. Please check your Firestore rules.');
      } else {
        alert(`Failed to upvote: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Idea Board - Share & Vote</title>
        <meta name="description" content="Share your ideas and vote on others" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">💡</span>
                <h1 className="text-xl font-bold text-gray-900">Idea Board</h1>
              </Link>
              
              <div className="text-sm text-gray-500">
                {!db ? 'Demo Mode' : user ? `Anonymous User` : 'Not signed in'}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Idea Submission Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Share Your Idea
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <textarea
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="What's your brilliant idea? (max 280 characters)"
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="4"
                  maxLength="280"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${newIdea.length > 260 ? 'text-red-500' : 'text-gray-500'}`}>
                    {newIdea.length}/280 characters
                  </span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!newIdea.trim() || isSubmitting || newIdea.length > 280}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Sharing...' : 'Share Idea'}
              </button>
            </form>
          </div>

          {/* Ideas List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Ideas ({ideas.length})
              </h2>
            </div>

            {ideas.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">💭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No ideas yet
                </h3>
                <p className="text-gray-600">
                  Be the first to share a brilliant idea!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onUpvote={handleUpvote}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
