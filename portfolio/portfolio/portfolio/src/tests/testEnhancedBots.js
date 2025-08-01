// Test script for enhanced bot simulation
// Run this to test if the enhanced bots can actually win games

import { simulateEnhanced3BotGame, runMultipleEnhancedSimulations } from './enhancedBotSimulation.js';

console.log('🎮 Starting Enhanced Bot Rummy Test...\n');

// Test 1: Run a single game
console.log('=== TEST 1: Single Game ===');
try {
    const singleResult = await simulateEnhanced3BotGame();
    console.log('\n📊 Single Game Result:');
    console.log(`- Completed: ${singleResult.completed}`);
    console.log(`- Turns: ${singleResult.turns}`);
    console.log(`- Winner: ${singleResult.winner ? singleResult.winner.name : 'None'}`);
    console.log(`- Draw pile remaining: ${singleResult.drawPileRemaining}`);
} catch (error) {
    console.error('❌ Error in single game test:', error);
}

// Test 2: Run multiple games
console.log('\n=== TEST 2: Multiple Games ===');
try {
    const results = await runMultipleEnhancedSimulations(5);
    console.log('\n📊 Multiple Games Results:');
    console.log(`- Total games: ${results.length}`);
    console.log(`- Completed games: ${results.filter(r => r.completed).length}`);
    console.log(`- Success rate: ${((results.filter(r => r.completed).length / results.length) * 100).toFixed(1)}%`);
    
    const completedGames = results.filter(r => r.completed);
    if (completedGames.length > 0) {
        const avgTurns = completedGames.reduce((sum, r) => sum + r.turns, 0) / completedGames.length;
        console.log(`- Average turns for completed games: ${avgTurns.toFixed(1)}`);
        
        // Count winners
        const winners = {};
        completedGames.forEach(result => {
            const name = result.winner.name;
            winners[name] = (winners[name] || 0) + 1;
        });
        
        console.log('- Winners:');
        Object.entries(winners).forEach(([name, wins]) => {
            console.log(`  ${name}: ${wins} wins`);
        });
    }
} catch (error) {
    console.error('❌ Error in multiple games test:', error);
}

console.log('\n🎯 Enhanced Bot Test Complete!'); 