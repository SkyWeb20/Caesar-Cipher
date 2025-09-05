@echo off
echo ========================================
echo Caesar Cipher GitHub Upload Script
echo ========================================
echo.

echo Current repository status:
git status
echo.

echo Available branches:
git branch -a
echo.

echo ========================================
echo INSTRUCTIONS TO COMPLETE GITHUB UPLOAD:
echo ========================================
echo.
echo 1. Go to https://github.com/new
echo 2. Create a new repository with these settings:
echo    - Repository name: caesar-cipher-persian
echo    - Description: Advanced Caesar Cipher with Persian support
echo    - Set to Public
echo    - DO NOT initialize with README, .gitignore, or license
echo.
echo 3. After creating the repository, copy the repository URL
echo    (it will look like: https://github.com/YOUR_USERNAME/caesar-cipher-persian.git)
echo.
echo 4. Run these commands (replace YOUR_USERNAME with your actual username):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/caesar-cipher-persian.git
echo    git push -u origin main
echo.
echo ========================================
echo YOUR CODE IS READY TO UPLOAD!
echo ========================================
echo.
echo All files have been:
echo - ✓ Added to Git
echo - ✓ Committed with proper message
echo - ✓ Branch renamed to 'main'
echo.
echo Just add the remote origin and push!
echo.
pause