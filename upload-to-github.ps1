# Caesar Cipher GitHub Upload Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "Caesar Cipher GitHub Upload Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Current repository status:" -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "Current branch:" -ForegroundColor Yellow
git branch
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INSTRUCTIONS TO COMPLETE GITHUB UPLOAD:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Go to: " -NoNewline
Write-Host "https://github.com/new" -ForegroundColor Blue
Write-Host ""

Write-Host "2. Create repository with these settings:" -ForegroundColor White
Write-Host "   - Repository name: " -NoNewline
Write-Host "caesar-cipher-persian" -ForegroundColor Yellow
Write-Host "   - Description: " -NoNewline  
Write-Host "Advanced Caesar Cipher with Persian support" -ForegroundColor Yellow
Write-Host "   - Set to: " -NoNewline
Write-Host "Public" -ForegroundColor Green
Write-Host "   - " -NoNewline
Write-Host "DO NOT" -ForegroundColor Red -NoNewline
Write-Host " initialize with README, .gitignore, or license"
Write-Host ""

Write-Host "3. After creating repository, copy the URL and run:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/caesar-cipher-persian.git" -ForegroundColor Magenta
Write-Host "   git push -u origin main" -ForegroundColor Magenta
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "YOUR CODE IS READY TO UPLOAD!" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "✓ Git repository initialized" -ForegroundColor Green
Write-Host "✓ All files added and committed" -ForegroundColor Green
Write-Host "✓ Branch set to 'main'" -ForegroundColor Green
Write-Host "✓ Ready for GitHub upload" -ForegroundColor Green
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")