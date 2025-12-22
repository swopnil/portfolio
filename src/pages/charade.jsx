import React, { useState } from 'react';
import { Users, Eye, EyeOff, RotateCcw } from 'lucide-react';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

export default function ImposterGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [imposterIndex, setImposterIndex] = useState(-1);
  const [revealedPlayers, setRevealedPlayers] = useState([false, false, false]);
  const [gamePhase, setGamePhase] = useState('setup');

  const startGame = () => {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const imposter = Math.floor(Math.random() * 3);
    setSelectedCountry(country);
    setImposterIndex(imposter);
    setGameStarted(true);
    setRevealedPlayers([false, false, false]);
    setGamePhase('reveal');
  };

  const toggleReveal = (index) => {
    const newRevealed = [...revealedPlayers];
    newRevealed[index] = !newRevealed[index];
    setRevealedPlayers(newRevealed);
  };

  const startDiscussion = () => {
    setGamePhase('discussion');
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedCountry('');
    setImposterIndex(-1);
    setRevealedPlayers([false, false, false]);
    setGamePhase('setup');
  };

  const players = ['Player 1', 'Player 2', 'Player 3'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Users className="w-12 h-12" />
            Country Imposter
          </h1>
          <p className="text-blue-200 text-lg">Find the imposter among you!</p>
        </div>

        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-4">How to Play</h2>
              <div className="text-left text-blue-100 space-y-3 max-w-2xl mx-auto">
                <p>🎯 <strong>3 Players:</strong> One is the imposter, two know the secret country</p>
                <p>👁️ <strong>Reveal Phase:</strong> Each player privately checks their card</p>
                <p>💬 <strong>Discussion:</strong> Players describe the country WITHOUT saying its name</p>
                <p>🕵️ <strong>Goal:</strong> Regular players find the imposter, imposter guesses the country</p>
                <p>⚠️ <strong>Imposter:</strong> Must blend in without knowing the country!</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Start New Game
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {gamePhase === 'reveal' && (
              <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-6 border-2 border-yellow-400">
                <p className="text-yellow-100 text-center text-lg font-semibold">
                  ⚠️ Each player should privately reveal their card. Don't let others see!
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {players.map((player, index) => (
                <div
                  key={index}
                  className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all border-purple-500`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{player}</h3>
                  </div>

                  <button
                    onClick={() => toggleReveal(index)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      revealedPlayers[index]
                        ? 'bg-white/20 text-white'
                        : 'bg-white/30 text-white hover:bg-white/40'
                    }`}
                  >
                    {revealedPlayers[index] ? (
                      <>
                        <EyeOff className="w-5 h-5" />
                        Hide Card
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        Reveal Card
                      </>
                    )}
                  </button>

                  {revealedPlayers[index] && (
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      {imposterIndex === index ? (
                        <div className="text-center">
                          <p className="text-red-600 font-bold text-xl mb-2">YOU ARE THE IMPOSTER!</p>
                          <p className="text-gray-700 text-sm">You don't know the country. Try to blend in and guess it!</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-600 text-sm mb-2">Your country is:</p>
                          <p className="text-blue-600 font-bold text-3xl">{selectedCountry}</p>
                          <p className="text-gray-700 text-sm mt-2">Describe it without saying the name!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              {gamePhase === 'reveal' && (
                <button
                  onClick={startDiscussion}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  Start Discussion Phase
                </button>
              )}
              <button
                onClick={resetGame}
                className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-white/30 transition-all shadow-lg flex items-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                New Game
              </button>
            </div>

            {gamePhase === 'discussion' && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Discussion Phase</h3>
                <div className="space-y-4 text-blue-100">
                  <p>💬 <strong>Take turns</strong> describing the country with hints like:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Location/continent</li>
                    <li>Famous landmarks or food</li>
                    <li>Climate or geography</li>
                    <li>Cultural facts</li>
                  </ul>
                  <p className="text-yellow-200 font-semibold mt-6">
                    🎯 After discussion, vote on who you think is the imposter!
                  </p>
                  <p className="text-sm">
                    If the imposter is found: Regular players win!<br/>
                    If the imposter survives: They can guess the country to win!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}