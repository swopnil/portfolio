import React, { useState } from 'react';
import { Users, Eye, EyeOff, RotateCcw, Plus, Minus } from 'lucide-react';

const CATEGORIES = {
  countries: {
    name: '🌍 World Countries',
    items: [
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
    ]
  },
  foods: {
    name: '🍕 Famous Foods',
    items: [
      'Pizza', 'Sushi', 'Tacos', 'Pasta', 'Burger', 'Croissant', 'Paella', 'Curry', 'Pho', 'Dim Sum',
      'Ramen', 'Kebab', 'Falafel', 'Pad Thai', 'Momos', 'Biryani', 'Samosa', 'Dosa', 'Tandoori Chicken', 'Naan',
      'Fajitas', 'Enchiladas', 'Burritos', 'Quesadilla', 'Nachos', 'Hot Dog', 'Fried Chicken', 'BBQ Ribs', 'Steak',
      'Fish and Chips', 'Bangers and Mash', 'Haggis', 'Bratwurst', 'Schnitzel', 'Fondue', 'Pierogi', 'Goulash',
      'Borscht', 'Baklava', 'Gyros', 'Souvlaki', 'Moussaka', 'Dolma', 'Hummus', 'Shawarma', 'Couscous', 'Tagine',
      'Jollof Rice', 'Injera', 'Bunny Chow', 'Bobotie', 'Pavlova', 'Lamington', 'Vegemite Toast', 'Meat Pie',
      'Poutine', 'Butter Chicken', 'Chow Mein', 'Spring Rolls', 'Peking Duck', 'Tom Yum', 'Satay', 'Nasi Goreng',
      'Rendang', 'Laksa', 'Bibimbap', 'Bulgogi', 'Kimchi', 'Tempura', 'Okonomiyaki', 'Takoyaki', 'Churrasco',
      'Empanadas', 'Ceviche', 'Arepas', 'Feijoada', 'Moqueca', 'Stroganoff', 'Pelmeni', 'Blini'
    ]
  },
  brands: {
    name: '🏢 Top Brands (Origin Country)',
    items: [
      'Toyota', 'Honda', 'Sony', 'Nintendo', 'Samsung', 'LG', 'Hyundai', 'Kia', 'Apple', 'Microsoft',
      'Google', 'Tesla', 'Ford', 'Chevrolet', 'Coca-Cola', 'Pepsi', 'McDonalds', 'KFC', 'Starbucks',
      'Nike', 'Adidas', 'Puma', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Porsche', 'Ferrari',
      'Lamborghini', 'Fiat', 'Gucci', 'Prada', 'Versace', 'Armani', 'Chanel', 'Louis Vuitton', 'Hermès',
      'Zara', 'H&M', 'IKEA', 'Volvo', 'Spotify', 'Nokia', 'Ericsson', 'LEGO', 'Rolex', 'Nestlé',
      'Lindt', 'Toblerone', 'Shell', 'Philips', 'Heineken', 'Guinness', 'Burberry', 'Rolls-Royce',
      'Bentley', 'Jaguar', 'Land Rover', 'Renault', 'Peugeot', 'Citroën', 'Cartier', 'Dior', 'Lancôme',
      'LOréal', 'Danone', 'Carrefour', 'Airbus', 'Bose', 'Harley-Davidson', 'Boeing', 'IBM', 'Intel',
      'HP', 'Dell', 'Amazon', 'Facebook', 'Netflix', 'Uber', 'Walmart', 'Target', 'Canon', 'Nikon',
      'Panasonic', 'Mitsubishi', 'Nissan', 'Subaru', 'Mazda', 'Suzuki', 'Yamaha', 'Kawasaki'
    ]
  },
  vehicles: {
    name: '🚗 Vehicle Companies (Origin Country)',
    items: [
      'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Suzuki', 'Lexus', 'Infiniti', 'Acura',
      'Ford', 'Chevrolet', 'Dodge', 'Jeep', 'Tesla', 'Cadillac', 'Buick', 'GMC', 'Lincoln', 'Ram',
      'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Opel', 'Smart', 'Maybach', 'Mini Cooper',
      'Ferrari', 'Lamborghini', 'Maserati', 'Alfa Romeo', 'Fiat', 'Lancia', 'Pagani', 'Ducati',
      'Renault', 'Peugeot', 'Citroën', 'Bugatti', 'DS Automobiles', 'Alpine',
      'Volvo', 'Saab', 'Koenigsegg', 'Scania', 'Polestar',
      'Jaguar', 'Land Rover', 'Bentley', 'Rolls-Royce', 'Aston Martin', 'McLaren', 'Lotus', 'Mini',
      'Hyundai', 'Kia', 'Genesis', 'SsangYong', 'Daewoo',
      'Tata Motors', 'Mahindra', 'Maruti Suzuki', 'Royal Enfield', 'Hero MotoCorp',
      'Geely', 'BYD', 'Great Wall', 'Chery', 'NIO', 'Xpeng', 'Li Auto', 'Hongqi',
      'Lada', 'GAZ', 'UAZ', 'Kamaz',
      'SEAT', 'Cupra',
      'Škoda',
      'Dacia',
      'Holden', 'HSV'
    ]
  },
  nepal: {
    name: '🇳🇵 Nepal - History & Geography',
    items: [
      'Mount Everest', 'Kathmandu', 'Pokhara', 'Lumbini', 'Chitwan National Park', 'Annapurna', 'Pashupatinath Temple',
      'Boudhanath Stupa', 'Swayambhunath', 'Durbar Square', 'Sagarmatha National Park', 'Langtang National Park',
      'Rara Lake', 'Phewa Lake', 'Tilicho Lake', 'Manaslu', 'Dhaulagiri', 'Makalu', 'Kanchenjunga', 'Gosaikunda',
      'Muktinath', 'Janakpur', 'Bhaktapur', 'Patan', 'Nagarkot', 'Bandipur', 'Gorkha', 'Mustang', 'Dolpo',
      'Koshi Tappu', 'Bardia National Park', 'Shivapuri National Park', 'Khaptad National Park', 'Manang',
      'Everest Base Camp', 'Annapurna Base Camp', 'Upper Mustang', 'Tsum Valley', 'Rolwaling Valley',
      'Prithvi Narayan Shah', 'King Tribhuvan', 'Mahendra of Nepal', 'Birendra of Nepal', 'Gyanendra of Nepal',
      'Jung Bahadur Rana', 'BP Koirala', 'Malla Dynasty', 'Shah Dynasty', 'Licchavi Dynasty', 'Kirat Dynasty',
      'Nepal Unification', 'Anglo-Nepalese War', 'Rana Regime', 'Democracy Movement 1990', 'People War',
      'Republic of Nepal', 'Federal Democratic Republic', 'Madhesh Movement', 'Koshi Province', 'Madhesh Province',
      'Bagmati Province', 'Gandaki Province', 'Lumbini Province', 'Karnali Province', 'Sudurpashchim Province',
      'Terai Region', 'Hill Region', 'Mountain Region', 'Himalayan Range', 'Mahabharat Range', 'Siwalik Hills',
      'Koshi River', 'Gandaki River', 'Karnali River', 'Mahakali River', 'Narayani River', 'Rapti River',
      'Sherpa People', 'Tamang People', 'Newar People', 'Tharu People', 'Magar People', 'Gurung People'
    ]
  },
  bollywood: {
    name: '🎬 Bollywood Movies (1990-2024)',
    items: [
      'Dilwale Dulhania Le Jayenge', 'Kuch Kuch Hota Hai', 'Kabhi Khushi Kabhie Gham', 'Kal Ho Naa Ho',
      'Dil Chahta Hai', 'Lagaan', 'Dangal', 'PK', '3 Idiots', 'Bajrangi Bhaijaan', 'Sultan', 'Tiger Zinda Hai',
      'Pathaan', 'Jawan', 'Dunki', 'Brahmastra', 'RRR', 'KGF Chapter 2', 'Pushpa', 'Animal',
      'Hum Aapke Hain Koun', 'Maine Pyar Kiya', 'Raja Hindustani', 'Border', 'Dil To Pagal Hai',
      'Taal', 'Devdas', 'Kabhi Alvida Naa Kehna', 'Jab We Met', 'Chak De India', 'Taare Zameen Par',
      'Ghajini', 'Love Aaj Kal', 'My Name Is Khan', 'Zindagi Na Milegi Dobara', 'Rockstar', 'Barfi',
      'Chennai Express', 'Yeh Jawaani Hai Deewani', 'Dhoom 3', 'Bang Bang', 'Happy New Year',
      'Prem Ratan Dhan Payo', 'Bajirao Mastani', 'Dilwale', 'Ae Dil Hai Mushkil', 'Raees', 'Judwaa 2',
      'Padmaavat', 'Sanju', 'Zero', 'Uri', 'Gully Boy', 'Kabir Singh', 'War', 'Good Newwz',
      'Tanhaji', 'Street Dancer 3D', 'Baaghi 3', 'Angrezi Medium', 'Laxmii', 'Coolie No 1',
      'Master', 'Radhe', 'Bell Bottom', 'Sooryavanshi', 'Eternals', 'Pushpa', '83', 'Jersey',
      'Heropanti 2', 'Runway 34', 'Bhool Bhulaiyaa 2', 'Samrat Prithviraj', 'Jugjugg Jeeyo',
      'Shamshera', 'Darlings', 'Laal Singh Chaddha', 'Raksha Bandhan', 'Brahmastra Part One Shiva',
      'Vikram Vedha', 'Goodbye', 'Thank God', 'Ram Setu', 'Drishyam 2', 'Bhediya', 'Cirkus',
      'Mission Majnu', 'Shehzada', 'Selfiee', 'Tu Jhoothi Main Makkaar', 'Bholaa', 'Kisi Ka Bhai Kisi Ki Jaan',
      'The Kerala Story', 'Zara Hatke Zara Bachke', 'Adipurush', 'OMG 2', 'Gadar 2', 'Dream Girl 2',
      'Fukrey 3', 'Mission Raniganj', 'The Vaccine War', 'Tejas', 'Tiger 3', 'Sam Bahadur', 'Salaar',
      'Fighter', 'Teri Baaton Mein Aisa Uljha Jiya', 'Shaitaan', 'Yodha', 'Crew', 'Bade Miyan Chote Miyan',
      'Maidaan', 'Amar Singh Chamkila', 'Do Aur Do Pyaar', 'Srikanth', 'Mr and Mrs Mahi', 'Chandu Champion',
      'Munjya', 'Bad Newz', 'Auron Mein Kahan Dum Tha', 'Khel Khel Mein', 'Stree 2', 'Vedaa', 'Khiladi 786',
      'Barfi', 'Kahaani', 'Vicky Donor', 'English Vinglish', 'Raanjhanaa', 'Aashiqui 2', 'Shahid',
      'Queen', 'Highway', 'Mary Kom', 'Haider', 'Piku', 'Tanu Weds Manu Returns', 'Masaan', 'Neerja',
      'Airlift', 'Kapoor and Sons', 'Udta Punjab', 'Pink', 'Dangal', 'Kaabil', 'Jolly LLB 2', 'Hindi Medium',
      'Toilet Ek Prem Katha', 'Newton', 'Tumhari Sulu', 'Andhadhun', 'Stree', 'Badhaai Ho', 'Article 15',
      'Super 30', 'Chhichhore', 'Batla House', 'The Sky Is Pink', 'Panga', 'Thappad', 'Shubh Mangal Zyada Saavdhan',
      'Gunjan Saxena', 'Ludo', 'Dil Bechara', 'Laal Kaptaan', 'Shershaah', 'Sardar Udham', 'Chandigarh Kare Aashiqui'
    ]
  }
};

export default function ImposterGame() {
  const [selectedCategory, setSelectedCategory] = useState('countries');
  const [numPlayers, setNumPlayers] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [imposterIndex, setImposterIndex] = useState(-1);
  const [revealedPlayers, setRevealedPlayers] = useState([]);
  const [gamePhase, setGamePhase] = useState('setup');

  const startGame = () => {
    const items = CATEGORIES[selectedCategory].items;
    const item = items[Math.floor(Math.random() * items.length)];
    const imposter = Math.floor(Math.random() * numPlayers);
    setSelectedItem(item);
    setImposterIndex(imposter);
    setGameStarted(true);
    setRevealedPlayers(new Array(numPlayers).fill(false));
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
    setSelectedItem('');
    setImposterIndex(-1);
    setRevealedPlayers([]);
    setGamePhase('setup');
  };

  const changePlayers = (delta) => {
    const newNum = numPlayers + delta;
    if (newNum >= 3 && newNum <= 6) {
      setNumPlayers(newNum);
    }
  };

  const players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);

  const getInstructionText = () => {
    if (selectedCategory === 'brands' || selectedCategory === 'vehicles') {
      return 'Describe WITHOUT saying the brand name or country!';
    }
    if (selectedCategory === 'foods') {
      return 'Describe WITHOUT saying the food name!';
    }
    if (selectedCategory === 'nepal') {
      return 'Describe WITHOUT saying the exact name!';
    }
    if (selectedCategory === 'bollywood') {
      return 'Describe WITHOUT saying the movie name!';
    }
    return 'Describe WITHOUT saying the name!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Users className="w-12 h-12" />
            Ultimate Imposter Game
          </h1>
          <p className="text-blue-200 text-lg">Find the imposter among you!</p>
        </div>

        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Choose Category</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`p-6 rounded-xl font-bold text-lg transition-all ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">How to Play</h2>
              <div className="text-left text-blue-100 space-y-3 max-w-2xl mx-auto">
                <p>🎯 <strong>3-6 Players:</strong> One is the imposter, others know the secret word</p>
                <p>👁️ <strong>Reveal Phase:</strong> Each player privately checks their card</p>
                <p>💬 <strong>Discussion:</strong> Players describe it WITHOUT saying the name</p>
                <p>🕵️ <strong>Goal:</strong> Regular players find the imposter, imposter guesses the word</p>
                <p>⚠️ <strong>Imposter:</strong> Must blend in without knowing what it is!</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-white text-lg mb-4 text-center">Number of Players</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => changePlayers(-1)}
                  disabled={numPlayers <= 3}
                  className="bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="text-white text-4xl font-bold w-20 text-center">{numPlayers}</span>
                <button
                  onClick={() => changePlayers(1)}
                  disabled={numPlayers >= 6}
                  className="bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <p className="text-blue-300 text-sm mt-2 text-center">Min: 3 | Max: 6</p>
            </div>

            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Start New Game
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-lg rounded-xl p-4 border-2 border-purple-400">
              <p className="text-white text-center text-lg font-semibold">
                Category: {CATEGORIES[selectedCategory].name}
              </p>
            </div>

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
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all border-purple-500"
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
                          <p className="text-gray-700 text-sm">You don't know the word. Try to blend in and guess it!</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-600 text-sm mb-2">Your word is:</p>
                          <p className="text-blue-600 font-bold text-2xl break-words">{selectedItem}</p>
                          <p className="text-gray-700 text-sm mt-2">{getInstructionText()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
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
                  <p>💬 <strong>Take turns</strong> giving hints about the word:</p>
                  {selectedCategory === 'countries' && (
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Location/continent</li>
                      <li>Famous landmarks or cities</li>
                      <li>Climate or geography</li>
                      <li>Cultural facts or language</li>
                    </ul>
                  )}
                  {selectedCategory === 'foods' && (
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Taste or ingredients</li>
                      <li>How it's prepared</li>
                      <li>When it's typically eaten</li>
                      <li>Country or region it's from</li>
                    </ul>
                  )}
                  {(selectedCategory === 'brands' || selectedCategory === 'vehicles') && (
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Industry or product type</li>
                      <li>Famous products or models</li>
                      <li>Quality or reputation</li>
                      <li>Target market or customers</li>
                    </ul>
                  )}
                  {selectedCategory === 'nepal' && (
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Type (place, person, event, region)</li>
                      <li>Historical significance or time period</li>
                      <li>Location or geographical features</li>
                      <li>Cultural or religious importance</li>
                    </ul>
                  )}
                  {selectedCategory === 'bollywood' && (
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Genre or theme</li>
                      <li>Lead actors or director</li>
                      <li>Plot summary (without spoilers)</li>
                      <li>Year released or era</li>
                      <li>Famous songs or dialogues</li>
                    </ul>
                  )}
                  <p>🔍 <strong>Watch for:</strong> Players who are vague or hesitant</p>
                  <p>🎯 <strong>Vote:</strong> When ready, discuss who you think is the imposter</p>
                  <p>⚡ <strong>Imposter wins if:</strong> They correctly guess the word OR aren't caught</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}