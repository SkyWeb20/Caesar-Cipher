// Advanced Caesar Cipher Implementation with Optimizations
class AdvancedCaesarCipher {
    constructor() {
        // Pre-computed lookup tables for maximum performance
        this.alphabets = {
            english: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            persian: 'ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی',
            digits: '0123456789'
        };
        
        // Alphabet sizes for modulo operations
        this.alphabetSizes = {
            english: 26,
            persian: 32
        };
        
        // Pre-computed shift tables for ultra-fast lookups
        this.shiftTables = new Map();
        this.reverseShiftTables = new Map();
        
        // Performance counters
        this.performanceMetrics = {
            encryptionTime: 0,
            decryptionTime: 0,
            charactersProcessed: 0
        };
        
        // Initialize optimization systems
        this.initializeShiftTables();
        this.initializeEventListeners();
        this.setupAdvancedFeatures();
    }

    // Pre-compute all possible shift combinations for O(1) lookup
    initializeShiftTables() {
        // Generate tables for shifts up to 100 (will be normalized by modulo)
        for (let shift = 1; shift <= 100; shift++) {
            const forwardTable = new Map();
            const reverseTable = new Map();
            
            // English alphabet optimization (26 letters)
            for (let i = 0; i < this.alphabetSizes.english; i++) {
                const char = this.alphabets.english[i];
                const normalizedShift = shift % this.alphabetSizes.english;
                const shiftedIndex = (i + normalizedShift) % this.alphabetSizes.english;
                const reverseIndex = (i - normalizedShift + this.alphabetSizes.english) % this.alphabetSizes.english;
                
                forwardTable.set(char, this.alphabets.english[shiftedIndex]);
                forwardTable.set(char.toLowerCase(), this.alphabets.english[shiftedIndex].toLowerCase());
                
                reverseTable.set(char, this.alphabets.english[reverseIndex]);
                reverseTable.set(char.toLowerCase(), this.alphabets.english[reverseIndex].toLowerCase());
            }
            
            // Persian alphabet optimization (32 letters)
            for (let i = 0; i < this.alphabetSizes.persian; i++) {
                const char = this.alphabets.persian[i];
                const normalizedShift = shift % this.alphabetSizes.persian;
                const shiftedIndex = (i + normalizedShift) % this.alphabetSizes.persian;
                const reverseIndex = (i - normalizedShift + this.alphabetSizes.persian) % this.alphabetSizes.persian;
                
                forwardTable.set(char, this.alphabets.persian[shiftedIndex]);
                reverseTable.set(char, this.alphabets.persian[reverseIndex]);
            }
            
            // Digit shifting (optional advanced feature)
            for (let i = 0; i < 10; i++) {
                const digit = this.alphabets.digits[i];
                const normalizedShift = shift % 10;
                const shiftedDigit = this.alphabets.digits[(i + normalizedShift) % 10];
                const reverseDigit = this.alphabets.digits[(i - normalizedShift + 10) % 10];
                
                forwardTable.set(digit, shiftedDigit);
                reverseTable.set(digit, reverseDigit);
            }
            
            this.shiftTables.set(shift, forwardTable);
            this.reverseShiftTables.set(shift, reverseTable);
        }
    }
    
    // Detect the primary alphabet used in the text
    detectPrimaryAlphabet(text) {
        let englishCount = 0;
        let persianCount = 0;
        
        for (const char of text) {
            const upperChar = char.toUpperCase();
            if (this.alphabets.english.includes(upperChar)) {
                englishCount++;
            } else if (this.alphabets.persian.includes(char)) {
                persianCount++;
            }
        }
        
        // Return the alphabet with more characters, default to English if equal
        return persianCount > englishCount ? 'persian' : 'english';
    }
    
    // Normalize shift value based on alphabet
    normalizeShift(shift, alphabet) {
        const alphabetSize = this.alphabetSizes[alphabet];
        
        // Handle negative shifts
        if (shift < 0) {
            shift = ((shift % alphabetSize) + alphabetSize) % alphabetSize;
        }
        
        // Normalize positive shifts
        return shift % alphabetSize || alphabetSize;
    }

    initializeEventListeners() {
        const encryptBtn = document.getElementById('encryptBtn');
        const decryptBtn = document.getElementById('decryptBtn');
        const clearBtn = document.getElementById('clearBtn');
        const copyBtn = document.getElementById('copyBtn');
        const liveEncryptionCheckbox = document.getElementById('liveEncryption');
        const inputText = document.getElementById('inputText');
        const shiftValue = document.getElementById('shiftValue');

        encryptBtn.addEventListener('click', () => this.encrypt());
        decryptBtn.addEventListener('click', () => this.decrypt());
        clearBtn.addEventListener('click', () => this.clearAll());
        copyBtn.addEventListener('click', () => this.copyResult());
        
        // Live encryption functionality
        const performLiveEncryption = () => {
            if (liveEncryptionCheckbox.checked && inputText.value.trim()) {
                this.performLiveEncryption();
            }
        };
        
        // Add event listeners for live encryption
        inputText.addEventListener('input', performLiveEncryption);
        shiftValue.addEventListener('input', performLiveEncryption);
        liveEncryptionCheckbox.addEventListener('change', () => {
            if (liveEncryptionCheckbox.checked) {
                performLiveEncryption();
                this.showSuccess('رمزگذاری زنده فعال شد!');
            } else {
                document.getElementById('outputText').value = '';
                this.showSuccess('رمزگذاری زنده غیرفعال شد!');
            }
        });

        // Allow Enter key to trigger encryption
        inputText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.encrypt();
            }
        });
    }
    
    // Perform live encryption without showing notifications
    async performLiveEncryption() {
        const inputText = document.getElementById('inputText').value;
        let shiftValueStr = document.getElementById('shiftValue').value;
        
        // Convert Persian numerals to English
        shiftValueStr = this.convertPersianToEnglish(shiftValueStr);
        const shiftValue = parseInt(shiftValueStr);

        // Only encrypt if we have valid input
        if (!inputText.trim()) {
            document.getElementById('outputText').value = '';
            return;
        }

        if (isNaN(shiftValue) || shiftValue === 0) {
            document.getElementById('outputText').value = 'خطا: مقدار جابجایی نامعتبر';
            return;
        }
        
        // Show processing indicator for large texts
        if (inputText.length > 1000) {
            document.getElementById('outputText').value = 'در حال پردازش...';
        }
        
        try {
            const encrypted = await this.batchProcess(inputText, shiftValue, false);
            this.displayResult(encrypted);
        } catch (error) {
            document.getElementById('outputText').value = 'خطا در رمزگذاری';
        }
    }

    // Ultra-optimized Caesar cipher using pre-computed lookup tables
    caesarShiftOptimized(text, shift, isDecrypt = false) {
        const startTime = performance.now();
        
        // Input validation
        if (!text || shift === 0) {
            return text;
        }
        
        // Detect primary alphabet
        const primaryAlphabet = this.detectPrimaryAlphabet(text);
        
        // Normalize shift value based on detected alphabet
        let normalizedShift = this.normalizeShift(Math.abs(shift), primaryAlphabet);
        
        // For shifts larger than 100, use modulo of the original shift
        if (Math.abs(shift) > 100) {
            normalizedShift = Math.abs(shift) % this.alphabetSizes[primaryAlphabet];
            if (normalizedShift === 0) normalizedShift = this.alphabetSizes[primaryAlphabet];
        }
        
        // Ensure we have a lookup table for this shift
        if (!this.shiftTables.has(normalizedShift)) {
            // Generate on-demand for very large shifts
            this.generateShiftTable(normalizedShift);
        }
        
        // Select appropriate lookup table
        const lookupTable = isDecrypt ? 
            this.reverseShiftTables.get(normalizedShift) : 
            this.shiftTables.get(normalizedShift);
        
        // Ultra-fast character-by-character transformation using lookup table
        let result = '';
        const textLength = text.length;
        
        // Optimized loop with minimal overhead
        for (let i = 0; i < textLength; i++) {
            const char = text[i];
            const shifted = lookupTable.get(char);
            result += shifted !== undefined ? shifted : char;
        }
        
        // Performance tracking
        const endTime = performance.now();
        const operation = isDecrypt ? 'decryption' : 'encryption';
        this.performanceMetrics[`${operation}Time`] = endTime - startTime;
        this.performanceMetrics.charactersProcessed = textLength;
        
        return result;
    }
    
    // Generate shift table on-demand for large shifts
    generateShiftTable(shift) {
        const forwardTable = new Map();
        const reverseTable = new Map();
        
        // English alphabet
        for (let i = 0; i < this.alphabetSizes.english; i++) {
            const char = this.alphabets.english[i];
            const normalizedShift = shift % this.alphabetSizes.english;
            const shiftedIndex = (i + normalizedShift) % this.alphabetSizes.english;
            const reverseIndex = (i - normalizedShift + this.alphabetSizes.english) % this.alphabetSizes.english;
            
            forwardTable.set(char, this.alphabets.english[shiftedIndex]);
            forwardTable.set(char.toLowerCase(), this.alphabets.english[shiftedIndex].toLowerCase());
            
            reverseTable.set(char, this.alphabets.english[reverseIndex]);
            reverseTable.set(char.toLowerCase(), this.alphabets.english[reverseIndex].toLowerCase());
        }
        
        // Persian alphabet
        for (let i = 0; i < this.alphabetSizes.persian; i++) {
            const char = this.alphabets.persian[i];
            const normalizedShift = shift % this.alphabetSizes.persian;
            const shiftedIndex = (i + normalizedShift) % this.alphabetSizes.persian;
            const reverseIndex = (i - normalizedShift + this.alphabetSizes.persian) % this.alphabetSizes.persian;
            
            forwardTable.set(char, this.alphabets.persian[shiftedIndex]);
            reverseTable.set(char, this.alphabets.persian[reverseIndex]);
        }
        
        this.shiftTables.set(shift, forwardTable);
        this.reverseShiftTables.set(shift, reverseTable);
    }
    
    // Advanced batch processing for large texts
    async batchProcess(text, shift, isDecrypt = false, batchSize = 1000) {
        if (text.length <= batchSize) {
            return this.caesarShiftOptimized(text, shift, isDecrypt);
        }
        
        const startTime = performance.now();
        let result = '';
        
        // Process in optimized batches to prevent UI blocking
        for (let i = 0; i < text.length; i += batchSize) {
            const batch = text.slice(i, i + batchSize);
            result += this.caesarShiftOptimized(batch, shift, isDecrypt);
            
            // Yield control to prevent UI freezing for very large texts
            if (i % (batchSize * 10) === 0 && text.length > 10000) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        const endTime = performance.now();
        
        return result;
    }

    // Advanced Persian and Arabic numeral conversion with caching
    convertPersianToEnglish(str) {
        // Use a more efficient Map-based approach for better performance
        const numeralMap = new Map([
            ['۰', '0'], ['۱', '1'], ['۲', '2'], ['۳', '3'], ['۴', '4'],
            ['۵', '5'], ['۶', '6'], ['۷', '7'], ['۸', '8'], ['۹', '9'],
            // Arabic numerals support
            ['٠', '0'], ['٢', '2'], ['٣', '3'], ['٤', '4'],
            ['٥', '5'], ['٦', '6'], ['٧', '7'], ['٨', '8'], ['٩', '9']
        ]);
        
        return str.replace(/[۰-۹٠-٩]/g, char => numeralMap.get(char) || char);
    }
    
    // Advanced frequency analysis for cryptanalysis
    analyzeFrequency(text, showDetails = false) {
        const frequency = new Map();
        const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
        const totalChars = cleanText.length;
        
        // Count character frequencies
        for (const char of cleanText) {
            frequency.set(char, (frequency.get(char) || 0) + 1);
        }
        
        // Calculate percentages and sort
        const analysis = Array.from(frequency.entries())
            .map(([char, count]) => ({
                char,
                count,
                percentage: ((count / totalChars) * 100).toFixed(2)
            }))
            .sort((a, b) => b.count - a.count);
        
        if (showDetails) {
            // Analysis details could be shown in UI instead of console
        }
        
        return analysis.slice(0, 10); // Return top 10
    }
    
    // Brute force attack simulation (educational purpose)
    bruteForceAnalysis(ciphertext) {
        const results = [];
        for (let shift = 1; shift <= 25; shift++) {
            const decrypted = this.caesarShiftOptimized(ciphertext, shift, true);
            const frequency = this.analyzeFrequency(decrypted);
            
            // Simple scoring based on English letter frequency
            const score = this.calculateEnglishScore(decrypted);
            
            results.push({
                shift,
                text: decrypted.slice(0, 50) + (decrypted.length > 50 ? '...' : ''),
                score,
                topChars: frequency.slice(0, 3)
            });
        }
        
        return results.sort((a, b) => b.score - a.score);
    }
    
    // Calculate English-like score for brute force analysis
    calculateEnglishScore(text) {
        const englishFreq = { 'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7 };
        const frequency = this.analyzeFrequency(text);
        
        let score = 0;
        for (const { char, percentage } of frequency.slice(0, 6)) {
            if (englishFreq[char]) {
                score += Math.abs(englishFreq[char] - parseFloat(percentage));
            }
        }
        
        return 100 - score; // Higher score = more English-like
    }
    
    // Pattern detection for weak encryption
    detectPatterns(text) {
        const patterns = {
            repeatedChars: /([A-Z])\1{2,}/g,
            commonWords: /\b(THE|AND|FOR|ARE|BUT|NOT|YOU|ALL|CAN|HER|WAS|ONE|OUR|HAD|BY)\b/g,
            doubleLetters: /([A-Z])\1/g
        };
        
        const results = {};
        for (const [pattern, regex] of Object.entries(patterns)) {
            const matches = text.match(regex) || [];
            results[pattern] = matches.length;
        }
        
        return results;
    }

    getInputValues() {
        const inputText = document.getElementById('inputText').value;
        let shiftValueStr = document.getElementById('shiftValue').value;
        
        // Convert Persian numerals to English
        shiftValueStr = this.convertPersianToEnglish(shiftValueStr);
        const shiftValue = parseInt(shiftValueStr);

        if (!inputText.trim()) {
            this.showError('لطفاً متنی برای رمزگذاری/رمزگشایی وارد کنید.');
            return null;
        }

        if (isNaN(shiftValue) || shiftValue === 0) {
            this.showError('لطفاً مقدار جابجایی معتبری وارد کنید (هر عدد غیر صفر).');
            return null;
        }

        return { inputText, shiftValue };
    }
    
    // Setup advanced features and performance monitoring
    setupAdvancedFeatures() {
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Advanced keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Auto-save functionality
        this.setupAutoSave();
    }
    
    setupPerformanceMonitoring() {
        // Performance metrics are tracked internally without console output
        setInterval(() => {
            if (this.performanceMetrics.charactersProcessed > 0) {
                // Performance data available for internal use
            }
        }, 30000); // Every 30 seconds
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'e':
                        e.preventDefault();
                        this.encrypt();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.decrypt();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.clearAll();
                        break;
                }
            }
        });
    }
    
    setupAutoSave() {
        // Auto-save input text to localStorage
        const inputText = document.getElementById('inputText');
        inputText.addEventListener('input', () => {
            localStorage.setItem('caesarCipherInput', inputText.value);
        });
        
        // Restore on load and trigger live encryption if enabled
        const saved = localStorage.getItem('caesarCipherInput');
        if (saved) {
            inputText.value = saved;
            // Trigger live encryption if checkbox is checked (default)
            const liveEncryptionCheckbox = document.getElementById('liveEncryption');
            if (liveEncryptionCheckbox && liveEncryptionCheckbox.checked) {
                // Use setTimeout to ensure DOM is fully loaded
                setTimeout(() => {
                    this.performLiveEncryption();
                }, 100);
            }
        }
    }

    async encrypt() {
        const values = this.getInputValues();
        if (!values) return;

        const { inputText, shiftValue } = values;
        
        // Show processing indicator for large texts
        if (inputText.length > 1000) {
            this.showSuccess('در حال پردازش متن بزرگ...');
        }
        
        const encrypted = await this.batchProcess(inputText, shiftValue, false);
        
        this.displayResult(encrypted);
        this.showAdvancedSuccess('متن با موفقیت رمزگذاری شد!', {
            characters: inputText.length,
            time: this.performanceMetrics.encryptionTime,
            text: inputText,
            originalShift: shiftValue
        });
    }

    async decrypt() {
        const values = this.getInputValues();
        if (!values) return;

        const { inputText, shiftValue } = values;
        
        // Show processing indicator for large texts
        if (inputText.length > 1000) {
            this.showSuccess('در حال پردازش متن بزرگ...');
        }
        
        const decrypted = await this.batchProcess(inputText, shiftValue, true);
        
        this.displayResult(decrypted);
        this.showAdvancedSuccess('متن با موفقیت رمزگشایی شد!', {
            characters: inputText.length,
            time: this.performanceMetrics.decryptionTime,
            text: inputText,
            originalShift: shiftValue
        });
        
        // Show frequency analysis for educational purposes
        if (inputText.length > 50) {
            const frequency = this.analyzeFrequency(decrypted);
            // Frequency analysis data available for internal use
        }
    }

    displayResult(result) {
        const outputText = document.getElementById('outputText');
        outputText.value = result;
        
        // Add a subtle animation
        outputText.style.transform = 'scale(0.98)';
        setTimeout(() => {
            outputText.style.transform = 'scale(1)';
        }, 150);
    }

    clearAll() {
        document.getElementById('inputText').value = '';
        document.getElementById('outputText').value = '';
        document.getElementById('shiftValue').value = '3';
        document.getElementById('liveEncryption').checked = true;
        
        this.showSuccess('تمام فیلدها پاک شد!');
    }

    async copyResult() {
        const outputText = document.getElementById('outputText');
        
        if (!outputText.value.trim()) {
            this.showError('نتیجه‌ای برای کپی وجود ندارد!');
            return;
        }

        try {
            await navigator.clipboard.writeText(outputText.value);
            this.showSuccess('نتیجه روی کلیپ‌بورد کپی شد!');
        } catch (err) {
            // Fallback for older browsers
            outputText.select();
            document.execCommand('copy');
            this.showSuccess('نتیجه روی کلیپ‌بورد کپی شد!');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    // Advanced success notification with performance metrics
    showAdvancedSuccess(message, metrics) {
        const detectedAlphabet = this.detectPrimaryAlphabet(metrics.text || '');
        const alphabetName = detectedAlphabet === 'persian' ? 'فارسی' : 'انگلیسی';
        const alphabetSize = this.alphabetSizes[detectedAlphabet];
        const normalizedShift = this.normalizeShift(Math.abs(metrics.originalShift || 0), detectedAlphabet);
        
        const enhancedMessage = `${message}\n📊 ${metrics.characters} کاراکتر در ${metrics.time.toFixed(2)}ms\n🔤 الفبا: ${alphabetName} (${alphabetSize} حرف)\n⚡ جابجایی اعمال شده: ${normalizedShift}`;
        this.showNotification(enhancedMessage, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            direction: rtl;
            text-align: right;
            font-family: 'Vazir', 'Shabnam', 'Samim', sans-serif;
            font-weight: 500;
            letter-spacing: 0.3px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the Advanced Caesar Cipher application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const cipher = new AdvancedCaesarCipher();
    
    // Add some interactive effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
});