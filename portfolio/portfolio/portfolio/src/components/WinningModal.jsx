import React, { useState } from 'react';
import { X, Trophy, Crown, Users, Eye, EyeOff } from 'lucide-react';

// Card component for the winning modal
const ModalCard = ({ card, isJoker = false, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-8 h-12 text-[8px]',
    sm: 'w-10 h-14 text-xs',
    md: 'w-12 h-16 text-sm'
  };

  const getSuitSymbol = (suit) => {
    const symbols = {
      spades: '♠',
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣'
    };
    return symbols[suit] || suit[0];
  };

  const getSuitColor = (suit) => {
    return ['hearts', 'diamonds'].includes(suit) ? 'red' : 'black';
  };

  const getDisplayRank = (rank) => {
    if (rank === 'ace') return 'A';
    if (rank === 'jack') return 'J';
    if (rank === 'queen') return 'Q';
    if (rank === 'king') return 'K';
    return rank;
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      bg-white rounded-lg border-2 flex flex-col justify-between p-1 shadow-sm
      ${isJoker ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}
    `}>
      <div className={`
        font-bold leading-none
        ${getSuitColor(card.suit) === 'red' ? 'text-red-500' : 'text-black'}
      `}>
        {getDisplayRank(card.rank)}
      </div>
      <div className={`
        text-center leading-none
        ${getSuitColor(card.suit) === 'red' ? 'text-red-500' : 'text-black'}
      `}>
        {getSuitSymbol(card.suit)}
      </div>
      {isJoker && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-xs text-black">J</span>
        </div>
      )}
    </div>
  );
};

// Player hand dropdown component
const PlayerHandDropdown = ({ players, currentPlayer, jokers, onClose }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showHands, setShowHands] = useState(false);

  const isJoker = (card) => {
    if (!jokers || !card) return false;
    return jokers.alternateColorJokers.some(j => j.rank === card.rank && j.suit === card.suit) ||
           jokers.oneUpJokers.some(j => j.rank === card.rank && j.suit === card.suit);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 max-h-80 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Users size={16} />
          Player Hands
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {players.map((player, index) => (
          <div key={player.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`
                  text-sm font-medium
                  ${player.id === currentPlayer ? 'text-blue-600' : 'text-gray-700'}
                `}>
                  {player.name}
                  {player.id === currentPlayer && ' (You)'}
                  {player.isBot && ' 🤖'}
                </span>
                <span className="text-xs text-gray-500">
                  {player.hand?.length || 0} cards
                </span>
              </div>
              <button
                onClick={() => setSelectedPlayer(selectedPlayer === index ? null : index)}
                className="text-blue-500 hover:text-blue-700 p-1"
              >
                {selectedPlayer === index ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {selectedPlayer === index && player.hand && (
              <div className="grid grid-cols-7 sm:grid-cols-10 gap-1 mt-2">
                {player.hand.map((card, cardIndex) => (
                  <ModalCard
                    key={`${card.id}-${cardIndex}`}
                    card={card}
                    isJoker={isJoker(card)}
                    size="xs"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main winning modal component
const WinningModal = ({ 
  isOpen, 
  onClose, 
  winner, 
  winningHand, 
  arrangedHand, 
  jokers, 
  players, 
  scores,
  onNewGame,
  onMainMenu,
  gameType = 'rummy'
}) => {
  const [showPlayerHands, setShowPlayerHands] = useState(false);

  if (!isOpen) return null;

  const isJoker = (card) => {
    if (!jokers || !card) return false;
    return jokers.alternateColorJokers.some(j => j.rank === card.rank && j.suit === card.suit) ||
           jokers.oneUpJokers.some(j => j.rank === card.rank && j.suit === card.suit);
  };

  const getGroupType = (cards) => {
    if (!cards || cards.length === 0) return 'Unknown';
    
    // Check if it's a valid straight run (consecutive cards, same suit)
    if (cards.length >= 3 && cards.every(c => c.suit === cards[0].suit)) {
      const values = cards.map(c => {
        if (c.rank === 'ace') return 1;
        if (['jack', 'queen', 'king'].includes(c.rank)) return ['jack', 'queen', 'king'].indexOf(c.rank) + 11;
        return parseInt(c.rank);
      }).sort((a, b) => a - b);
      
      let isConsecutive = true;
      for (let i = 1; i < values.length; i++) {
        if (values[i] !== values[i-1] + 1) {
          isConsecutive = false;
          break;
        }
      }
      
      if (isConsecutive) return 'Straight Run';
    }
    
    // Check if it's a set (same rank, different suits)
    if (cards.length >= 3 && cards.every(c => c.rank === cards[0].rank)) {
      return 'Set';
    }
    
    // Check if it's a regular run (same suit, with possible jokers)
    if (cards.length >= 3 && cards.every(c => c.suit === cards[0].suit || isJoker(c))) {
      return 'Run';
    }
    
    return 'Combination';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative p-4 sm:p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/20 rounded-full p-2 backdrop-blur-sm"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="text-yellow-400" size={32} />
            <h1 className="text-2xl sm:text-4xl font-bold text-white">
              {winner} Wins!
            </h1>
            <Crown className="text-yellow-400" size={32} />
          </div>
          
          <p className="text-blue-100 text-sm sm:text-base">
            Congratulations on your victory!
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pb-6 space-y-4">
          {/* Winning Hand Display */}
          {winningHand && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                🏆 Winning Hand
              </h3>
              
              <div className="space-y-3">
                {Object.entries(winningHand).map(([groupName, cards]) => {
                  const groupType = getGroupType(cards);
                  return (
                    <div key={groupName} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-xs sm:text-sm font-medium">
                          Group {groupName}: {groupType}
                        </span>
                        <span className="text-white/70 text-xs">
                          {cards.length} cards
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {cards.map((card, index) => (
                          <ModalCard
                            key={`${card.id}-${index}`}
                            card={card}
                            isJoker={isJoker(card)}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scores */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">
              Final Scores
            </h3>
            
            <div className="space-y-2">
              {scores?.map((player, index) => (
                <div 
                  key={index}
                  className={`
                    flex justify-between items-center p-3 rounded-lg
                    ${player.name === winner 
                      ? 'bg-yellow-400/20 border border-yellow-400/30' 
                      : 'bg-white/5'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {player.name}
                    </span>
                    {player.name === winner && (
                      <Crown className="text-yellow-400" size={16} />
                    )}
                  </div>
                  <span className="text-white font-bold">
                    {player.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Player Hands Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowPlayerHands(!showPlayerHands)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
            >
              <Users size={16} />
              {showPlayerHands ? 'Hide' : 'View'} All Hands
            </button>
          </div>

          {/* Player Hands Dropdown */}
          {showPlayerHands && (
            <PlayerHandDropdown
              players={players}
              currentPlayer={0}
              jokers={jokers}
              onClose={() => setShowPlayerHands(false)}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onNewGame}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
            >
              New Game
            </button>
            <button
              onClick={onMainMenu}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningModal;