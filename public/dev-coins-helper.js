// Dev Utility: Add coins for testing
// Open browser console and type: addTestCoins(500) to add 500 coins
// Or type: resetCoins() to reset to 1000 coins

(function () {
    if (typeof window !== 'undefined') {
        // @ts-ignore
        window.addTestCoins = (amount: number = 500) => {
            const current = localStorage.getItem('periopal-coins');
            const newAmount = (current ? parseInt(current) : 0) + amount;
            localStorage.setItem('periopal-coins', newAmount.toString());
            console.log(`✅ Added ${amount} coins! Total: ${newAmount} coins`);
            console.log('🔄 Refresh the page to see the updated coins.');
        };

        // @ts-ignore
        window.resetCoins = (amount: number = 1000) => {
            localStorage.setItem('periopal-coins', amount.toString());
            console.log(`✅ Reset to ${amount} coins!`);
            console.log('🔄 Refresh the page to see the updated coins.');
        };

        // @ts-ignore
        window.clearAllProgress = () => {
            localStorage.removeItem('periopal-coins');
            localStorage.removeItem('periopal-items');
            localStorage.removeItem('periopal-favorites');
            console.log('✅ Cleared all progress!');
            console.log('🔄 Refresh the page to start fresh with 1000 coins.');
        };

        console.log('💰 Coin Dev Tools Loaded!');
        console.log('Commands available:');
        console.log('  - addTestCoins(500) - Add coins');
        console.log('  - resetCoins(1000) - Reset to specific amount');
        console.log('  - clearAllProgress() - Clear everything and start fresh');
    }
})();

export { };
