# Idea Board - Setup Instructions

A collaborative platform for sharing and voting on ideas, built with Next.js, Tailwind CSS, and Firebase Firestore.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install firebase next react react-dom tailwindcss
# or
yarn add firebase next react react-dom tailwindcss
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Anonymous Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Anonymous" provider
4. Enable **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in production mode
   - Choose your region

#### Get Firebase Config
1. Go to Project Settings → General → Your apps
2. Add a web app and copy the config object
3. Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Deploy Security Rules
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore` (select your project)
4. Replace the generated `firestore.rules` with the provided `firebase.rules`
5. Deploy rules: `firebase deploy --only firestore:rules`

### 3. Run the Application

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the app!

## 📁 File Structure

```
idea-board/
├── components/
│   └── IdeaCard.jsx          # Individual idea card component
├── pages/
│   ├── index.jsx             # Landing page
│   └── app.jsx               # Main idea board application
├── services/
│   └── firebase.ts           # Firebase configuration and initialization
├── utils/
│   └── cloudFunctions.js     # Optional: Cloud Function utilities
├── functions/                # Optional: Cloud Functions
│   ├── index.js              # Secure upvoting functions
│   └── package.json          # Functions dependencies
├── firebase.rules            # Firestore security rules
└── README-snippet.md         # This file
```

## 🔒 Security Features

### Firestore Rules
- **Read**: Anyone can read ideas (public)
- **Create**: Only authenticated users can create ideas with:
  - Text length ≤ 280 characters
  - Initial upvotes = 0
  - Valid timestamp and author
- **Update**: Only allows incrementing upvotes by 1
- **Delete**: Prevented entirely

### Authentication
- Uses Firebase Anonymous Authentication
- Automatic sign-in on app load
- No user registration required

## 🎯 Core Features

### ✅ Implemented
- **Idea Creation**: Submit ideas up to 280 characters
- **Real-time Updates**: Ideas and votes update instantly using `onSnapshot`
- **Upvoting**: Click to upvote ideas (client-side transactions)
- **Responsive Design**: Works on desktop and mobile
- **Anonymous Auth**: Automatic anonymous authentication

### 🔧 Client-Side Upvoting (Default Method)
Uses Firestore `runTransaction()` for atomic upvote increments:

```javascript
const handleUpvote = async (ideaId) => {
  const ideaRef = doc(db, 'ideas', ideaId);
  await runTransaction(db, async (transaction) => {
    const ideaDoc = await transaction.get(ideaRef);
    const currentUpvotes = ideaDoc.data().upvotes || 0;
    transaction.update(ideaRef, { upvotes: currentUpvotes + 1 });
  });
};
```

## 🛡️ OPTIONAL: Secure One-Vote-Per-User (Cloud Functions)

For production apps requiring strict vote validation, deploy the Cloud Functions:

### Setup Cloud Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

### Usage
Replace the client-side upvote handler with:

```javascript
import { upvoteIdea } from '../utils/cloudFunctions';

const handleSecureUpvote = async (ideaId) => {
  try {
    const result = await upvoteIdea(ideaId);
    console.log('Upvoted:', result);
  } catch (error) {
    alert(error.message); // "User has already upvoted this idea!"
  }
};
```

### Cloud Function Features
- **One vote per user**: Tracks votes in `/ideas/{id}/votes/{uid}` subcollection
- **Atomic operations**: Uses Firestore transactions
- **Error handling**: Proper error messages for duplicate votes
- **Vote tracking**: Optional functions to check vote status

## 🎨 Customization

### Styling
- Built with Tailwind CSS
- Responsive design patterns
- Easy to customize colors and layout

### Features to Add
- User profiles (replace anonymous auth)
- Idea categories/tags
- Search and filtering
- Idea editing (with proper security rules)
- Comments/discussions
- Admin moderation

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Config Error**
   - Ensure all environment variables are set correctly
   - Check that the Firebase project is active

2. **Permission Denied**
   - Verify Firestore rules are deployed
   - Check that Anonymous Auth is enabled

3. **Real-time Updates Not Working**
   - Ensure Firestore is properly initialized
   - Check browser console for errors

### Debug Mode
Add this to see Firebase operations:
```javascript
// In firebase.ts
import { connectFirestoreEmulator } from 'firebase/firestore';

// For local development only
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📊 Performance Notes

- Uses Firestore real-time listeners (charged per document read)
- Anonymous auth has no additional costs
- Consider pagination for large idea lists
- Cloud Functions have cold start latency

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

Remember to set environment variables in your deployment platform!

---

**Total Development Time**: ~8-10 hours for a complete implementation
**Difficulty**: Intermediate (requires Firebase knowledge)
**Production Ready**: Yes (with Cloud Functions for vote validation)
