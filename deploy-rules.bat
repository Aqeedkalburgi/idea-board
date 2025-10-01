@echo off
echo Deploying Firestore Security Rules...
echo.
echo Make sure you have Firebase CLI installed:
echo   npm install -g firebase-tools
echo.
echo Then run these commands:
echo   firebase login
echo   firebase init firestore
echo   firebase deploy --only firestore:rules
echo.
pause

REM Uncomment these lines after installing Firebase CLI:
REM firebase login
REM firebase init firestore
REM firebase deploy --only firestore:rules
