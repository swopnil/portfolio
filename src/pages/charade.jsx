import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff, RotateCcw, Plus, Minus, Clock, Edit3 } from 'lucide-react';

const CATEGORIES = {
  nepalPlaces: {
    name: 'Nepal Places',
    emoji: '🇳🇵',
    color: 'from-green-400 to-green-600',
    character: '🏔️',
    items: [
      'Kathmandu', 'Pokhara', 'Lumbini', 'Chitwan', 'Bhaktapur', 'Patan', 'Janakpur', 'Biratnagar', 'Dharan',
      'Butwal', 'Nepalgunj', 'Hetauda', 'Itahari', 'Gorkha', 'Mustang', 'Bandipur', 'Nagarkot', 'Dhulikhel',
      'Manang', 'Dolpo', 'Lukla', 'Namche Bazaar', 'Everest Base Camp', 'Annapurna Base Camp', 'Langtang',
      'Rara Lake', 'Phewa Lake', 'Gosaikunda', 'Muktinath', 'Pashupatinath', 'Boudhanath', 'Swayambhunath',
      'Durbar Square', 'Thamel', 'New Road', 'Asan Tole', 'Indra Chowk', 'Basantapur', 'Hanuman Dhoka',
      'Kirtipur', 'Lalitpur', 'Madhyapur Thimi', 'Bhimdatta', 'Siddharthanagar', 'Kalaiya', 'Bardibas',
      'Lahan', 'Rajbiraj', 'Siraha', 'Saptari', 'Jhapa', 'Morang', 'Sunsari', 'Udayapur', 'Khotang',
      'Solukhumbu', 'Sankhuwasabha', 'Tehrathum', 'Panchthar', 'Ilam', 'Taplejung', 'Ramechhap', 'Dolakha',
      'Sindhupalchok', 'Rasuwa', 'Nuwakot', 'Dhading', 'Makwanpur', 'Sindhuli', 'Kavrepalanchok', 'Lalitpur',
      'Manakamana', 'Devghat', 'Gokarna', 'Sankhu', 'Changunarayan', 'Tokha', 'Budhanilkantha', 'Thankot'
    ]
  },
    countries: {
    name: 'Countries',
    emoji: '🌍',
    color: 'from-blue-400 to-blue-600',
    character: '🌎',
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
  nepaliSlangWorst: {
  name: 'Nepali Slang',
  emoji: '😈',
  color: 'from-red-400 to-red-600',
  character: '👹',
  items: [
    'Randi',
    'Muji',
    'Chutiya',
    'Gandu',
    'Lado',
    'Boka',
    'Bhalu',
    'Kukur',
    'Tharki',
    'Khate',
    'Pakhe',
    'Jh*nte',
    'Beshya',
    'Kukur',
    'Boka',
    'Kaale',
    'Kanda',
    'Pakhe',
    'Chapri',
      'Fattu',
  'Chor',
  'Gadha',
  'Bakchod',
  'Nalayak',
  'Ullu',
  'Namarda',
  'Madarchod',
  'Behenchod',
  'Pagal',
  'Dalla',
  'Joker',
  'Chikne',
  ]
},
footballers: {
  name: 'Footballers',
  emoji: '⚽',
  color: 'from-green-400 to-green-600',
  character: '⚽',
  items: [
    'Lionel Messi', 'Cristiano Ronaldo', 'Pelé', 'Diego Maradona', 'Johan Cruyff', 'Zinedine Zidane', 'Ronaldo Nazário', 'Franz Beckenbauer', 'Alfredo Di Stéfano', 'Michel Platini',
    'Ronaldinho', 'Thierry Henry', 'Kylian Mbappé', 'Neymar', 'Erling Haaland', 'Kevin De Bruyne', 'Mohamed Salah', 'Robert Lewandowski', 'Karim Benzema', 'Luka Modrić',
    'Andrés Iniesta', 'Xavi Hernández', 'Steven Gerrard', 'Frank Lampard', 'Paul Scholes', 'Andrea Pirlo', 'Gianluigi Buffon', 'Iker Casillas', 'Manuel Neuer', 'Lev Yashin',
    'Paolo Maldini', 'Franco Baresi', 'Sergio Ramos', 'Virgil van Dijk', 'Carles Puyol', 'John Terry', 'Rio Ferdinand', 'Fabio Cannavaro', 'Roberto Carlos', 'Cafu',
    'Dani Alves', 'Philipp Lahm', 'Marcelo', 'Ashley Cole', 'Javier Zanetti', 'Gareth Bale', 'Eden Hazard', 'Arjen Robben', 'Franck Ribéry', 'David Beckham',
    'Luis Figo', 'George Best', 'Bobby Charlton', 'Ruud Gullit', 'Marco van Basten', 'Dennis Bergkamp', 'Alan Shearer', 'Gary Lineker', 'Michael Owen', 'Wayne Rooney',
    'Harry Kane', 'Zlatan Ibrahimović', 'Didier Drogba', 'Samuel Eto\'o', 'Sergio Agüero', 'Raúl González', 'Fernando Torres', 'David Villa', 'Carlos Tevez', 'Robin van Persie',
    'Romário', 'Rivaldo', 'Zico', 'Bebeto', 'Jairzinho', 'Garrincha', 'Kaká', 'Vinícius Júnior', 'Rodrygo', 'Richarlison',
    'Gabriel Jesus', 'Philippe Coutinho', 'Casemiro', 'Fabinho', 'Alisson Becker', 'Ederson', 'Thibaut Courtois', 'Marc-André ter Stegen', 'Jan Oblak', 'Gianluigi Donnarumma',
    'David de Gea', 'Hugo Lloris', 'Keylor Navas', 'Petr Čech', 'Edwin van der Sar', 'Oliver Kahn', 'Peter Schmeichel', 'Dino Zoff', 'Gordon Banks', 'Sepp Maier',
    'Toni Kroos', 'N\'Golo Kanté', 'Paul Pogba', 'Marco Verratti', 'Sergio Busquets', 'Jude Bellingham', 'Pedri', 'Gavi', 'Frenkie de Jong', 'Eduardo Camavinga',
    'Aurélien Tchouaméni', 'Declan Rice', 'Rodri', 'Bruno Fernandes', 'Mason Mount', 'Phil Foden', 'Jack Grealish', 'Bukayo Saka', 'Marcus Rashford', 'Jadon Sancho',
    'Raheem Sterling', 'Son Heung-min', 'Sadio Mané', 'Riyad Mahrez', 'Leroy Sané', 'Kingsley Coman', 'Serge Gnabry', 'Thomas Müller', 'Joshua Kimmich', 'Leon Goretzka',
    'Matthijs de Ligt', 'Ruben Dias', 'Marquinhos', 'Thiago Silva', 'Raphaël Varane', 'Jules Koundé', 'Eder Militão', 'Antonio Rüdiger', 'David Alaba', 'Alphonso Davies',
    'João Cancelo', 'Reece James', 'Trent Alexander-Arnold', 'Andrew Robertson', 'Theo Hernández', 'Achraf Hakimi', 'Kyle Walker', 'Benjamin Pavard', 'Lucas Hernández', 'Presnel Kimpembe',
    'Giorgio Chiellini', 'Leonardo Bonucci', 'Alessandro Nesta', 'Nemanja Vidić', 'Jaap Stam', 'Sol Campbell', 'Vincent Kompany', 'Gerard Piqué', 'Pepe', 'Kalidou Koulibaly',
    'Antoine Griezmann', 'Ousmane Dembélé', 'Luis Suárez', 'Edinson Cavani', 'Radamel Falcao', 'James Rodríguez', 'Alexis Sánchez', 'Arturo Vidal', 'Claudio Bravo', 'Arturo Vidal',
    'Ángel Di María', 'Paulo Dybala', 'Lautaro Martínez', 'Julián Álvarez', 'Alexis Mac Allister', 'Enzo Fernández', 'Lisandro Martínez', 'Emiliano Martínez', 'Cristian Romero', 'Nicolás Otamendi',
    'Mesut Özil', 'Toni Kroos', 'Bastian Schweinsteiger', 'Michael Ballack', 'Lothar Matthäus', 'Gerd Müller', 'Karl-Heinz Rummenigge', 'Rudi Völler', 'Jürgen Klinsmann', 'Miroslav Klose',
    'Mario Götze', 'André Schürrle', 'Mats Hummels', 'Jérôme Boateng', 'Ilkay Gündoğan', 'Marco Reus', 'Kai Havertz', 'Florian Wirtz', 'Jamal Musiala', 'Niclas Füllkrug',
    'Francesco Totti', 'Alessandro Del Piero', 'Roberto Baggio', 'Paolo Rossi', 'Gianluca Vialli', 'Christian Vieri', 'Filippo Inzaghi', 'Andrea Pirlo', 'Daniele De Rossi', 'Ciro Immobile',
    'Lorenzo Insigne', 'Federico Chiesa', 'Nicolò Barella', 'Marco Verratti', 'Jorginho', 'Sandro Tonali', 'Giovanni Di Lorenzo', 'Gigio Donnarumma', 'Rafael Leão', 'Victor Osimhen',
    'Patrick Vieira', 'Claude Makélélé', 'Lilian Thuram', 'Marcel Desailly', 'Laurent Blanc', 'Bixente Lizarazu', 'Eric Cantona', 'Just Fontaine', 'Raymond Kopa', 'Jean-Pierre Papin',
    'Zinedine Zidane', 'Karim Benzema', 'Olivier Giroud', 'Antoine Griezmann', 'Kylian Mbappé', 'Paul Pogba', 'N\'Golo Kanté', 'Raphaël Varane', 'Hugo Lloris', 'Aurélien Tchouaméni',
    'Xavi', 'Andrés Iniesta', 'Sergio Busquets', 'Carles Puyol', 'Gerard Piqué', 'Sergio Ramos', 'Iker Casillas', 'David Villa', 'Fernando Torres', 'Raúl',
    'Emilio Butragueño', 'Luis Enrique', 'Fernando Hierro', 'Michel Salgado', 'Xabi Alonso', 'Cesc Fàbregas', 'David Silva', 'Juan Mata', 'Pedro Rodríguez', 'Dani Carvajal',
    'Jordi Alba', 'César Azpilicueta', 'Aymeric Laporte', 'Unai Simón', 'Pedri', 'Gavi', 'Ferran Torres', 'Ansu Fati', 'Dani Olmo', 'Álvaro Morata',
    'Cristiano Ronaldo', 'Luís Figo', 'Eusébio', 'Rui Costa', 'Ricardo Carvalho', 'Paulo Ferreira', 'Nani', 'Ricardo Quaresma', 'Pepe', 'Bruno Fernandes',
    'Bernardo Silva', 'João Félix', 'Rúben Dias', 'Diogo Jota', 'Rafael Leão', 'Diogo Costa', 'João Cancelo', 'Renato Sanches', 'William Carvalho', 'Gonçalo Ramos',
    'Ryan Giggs', 'Paul Scholes', 'David Beckham', 'Steven Gerrard', 'Frank Lampard', 'Rio Ferdinand', 'John Terry', 'Ashley Cole', 'Gary Neville', 'Jamie Carragher',
    'Michael Owen', 'Alan Shearer', 'Wayne Rooney', 'Harry Kane', 'Raheem Sterling', 'Marcus Rashford', 'Phil Foden', 'Bukayo Saka', 'Jude Bellingham', 'Declan Rice',
    'Johan Cruyff', 'Marco van Basten', 'Ruud Gullit', 'Dennis Bergkamp', 'Frank Rijkaard', 'Ronald Koeman', 'Clarence Seedorf', 'Edgar Davids', 'Patrick Kluivert', 'Edwin van der Sar',
    'Arjen Robben', 'Robin van Persie', 'Wesley Sneijder', 'Rafael van der Vaart', 'Virgil van Dijk', 'Matthijs de Ligt', 'Frenkie de Jong', 'Memphis Depay', 'Cody Gakpo', 'Nathan Aké',
    'Diego Maradona', 'Lionel Messi', 'Gabriel Batistuta', 'Hernán Crespo', 'Mario Kempes', 'Daniel Passarella', 'Javier Mascherano', 'Juan Román Riquelme', 'Carlos Tévez', 'Sergio Agüero',
    'Ángel Di María', 'Paulo Dybala', 'Lautaro Martínez', 'Julián Álvarez', 'Emiliano Martínez', 'Alexis Mac Allister', 'Enzo Fernández', 'Rodrigo De Paul', 'Nahuel Molina', 'Cristian Romero',
    'Socrates', 'Cafu', 'Roberto Carlos', 'Romário', 'Ronaldo', 'Ronaldinho', 'Rivaldo', 'Kaká', 'Neymar', 'Thiago Silva',
    'Dani Alves', 'Marcelo', 'Casemiro', 'Vinícius Jr', 'Rodrygo', 'Gabriel Jesus', 'Raphinha', 'Antony', 'Richarlison', 'Alisson',
    'Mohamed Salah', 'Riyad Mahrez', 'Sadio Mané', 'Samuel Eto\'o', 'Didier Drogba', 'Yaya Touré', 'Jay-Jay Okocha', 'George Weah', 'Roger Milla', 'Abedi Pele',
    'Michael Essien', 'Asamoah Gyan', 'Mohamed Aboutrika', 'Pierre-Emerick Aubameyang', 'Achraf Hakimi', 'Hakim Ziyech', 'Kalidou Koulibaly', 'Edouard Mendy', 'Victor Osimhen', 'Khvicha Kvaratskhelia'
  ]
},
  wwePlayers: {
  name: 'WWE Superstars',
  emoji: '🤼',
  color: 'from-red-500 to-yellow-500',
  character: '💪',
  items: [
    // Legends & Attitude Era
    'The Rock',
    'Stone Cold',
    'The Undertaker',
    'Triple H',
    'Shawn Michaels',
    'Kane',
    'Hulk Hogan',
    'Ric Flair',
    'Big Show',
    'Goldberg',
    'Edge',
    'Christian',

    // Ruthless Aggression Era
    'John Cena',
    'Batista',
    'Randy Orton',
    'Brock Lesnar',
    'Rey Mysterio',
    'Kurt Angle',
    'Jeff Hardy',
    'Matt Hardy',
    'The Miz',
    'CM Punk',

    // PG / Modern Era (2010–2020)
    'Roman Reigns',
    'Seth Rollins',
    'Dean Ambrose',
    'AJ Styles',
    'Daniel Bryan',
    'Bray Wyatt',
    'Kevin Owens',
    'Samoa Joe',
    'Shinsuke Nakamura',
    'Drew McIntyre',
    'Sheamus',
    'Kofi Kingston',
    'Big E',
    'Xavier Woods',

    // Tag Teams / Stables
    'The Shield',
    'The New Day',
    'DX',
    'The Usos',
  ]
},
  professions: {
    name: 'Professions',
    emoji: '💼',
    color: 'from-purple-400 to-purple-600',
    character: '👨‍💼',
    items: [
      'Doctor', 'Teacher', 'Engineer', 'Lawyer', 'Police Officer', 'Firefighter', 'Pilot', 'Chef', 'Artist', 'Musician',
      'Farmer', 'Carpenter', 'Electrician', 'Plumber', 'Mechanic', 'Nurse', 'Dentist', 'Pharmacist', 'Architect', 'Journalist',
      'Photographer', 'Designer', 'Programmer', 'Accountant', 'Banker', 'Real Estate Agent', 'Insurance Agent', 'Travel Agent',
      'Hair Stylist', 'Barber', 'Tailor', 'Shopkeeper', 'Waiter', 'Driver', 'Security Guard', 'Cleaner', 'Gardener',
      'Construction Worker', 'Factory Worker', 'Delivery Person', 'Postman', 'Bus Driver', 'Taxi Driver', 'Rickshaw Driver',
      'Student', 'Professor', 'Principal', 'Librarian', 'Scientist', 'Researcher', 'Lab Technician', 'Social Worker',
      'Psychologist', 'Therapist', 'Veterinarian', 'Judge', 'Magistrate', 'Government Officer', 'Army Officer', 'Navy Officer',
      'Air Force Officer', 'Politician', 'Mayor', 'Minister', 'Ambassador', 'Diplomat', 'Translator', 'Interpreter',
      'Tour Guide', 'Hotel Manager', 'Receptionist', 'Event Planner', 'Wedding Planner', 'Interior Designer', 'Fashion Designer',
      'Software Developer', 'Data Analyst', 'Digital Marketer', 'Content Creator', 'YouTuber', 'Blogger', 'Influencer',
      'Film Director', 'Actor', 'Singer', 'Dancer', 'Sports Player', 'Coach', 'Referee', 'Commentator', 'News Anchor'
    ]
  },
  nepaliIndianFood: {
    name: 'Nepali Food',
    emoji: '🍛',
    color: 'from-yellow-400 to-orange-500',
    character: '🍽️',
    items: [
   'Dal Bhat', 'Momos', 'Sel Roti', 'Gundruk', 'Dhido', 'Bara', 'Chatamari', 'Yomari', 'Lakhamari', 'Juju Dhau',
'Sukuti', 'Chhurpi', 'Aloo Tama', 'Saag', 'Kheer', 'Rasgulla', 'Samay Baji', 'Choila', 'Sekuwa', 'Jhol Momo',
'Kothey Momo', 'C Momo', 'Buff Momo', 'Chicken Momo', 'Veg Momo', 'Thukpa', 'Chowmein', 'Fried Rice', 'Laphing',
'Biryani', 'Pulao', 'Samosa', 'Pakora', 'Paratha', 'Naan', 'Roti', 'Chapati', 'Puri', 'Aloo Paratha',
'Butter Chicken', 'Chicken Curry', 'Mutton Curry', 'Paneer Makhani', 'Palak Paneer', 'Kadai Paneer', 'Paneer Tikka',
'Aloo Gobi', 'Dal Tadka', 'Dal Makhani', 'Rajma', 'Chole', 'Wai Wai', 'Chiya', 'Lassi', 'Tongba', 'Raksi',
'Chaang', 'Masala Chiya', 'Dudh Chiya', 'Kalo Chiya', 'Nimbu Pani', 'Mango Lassi', 'Sweet Lassi', 'Salted Lassi',
'Newari Khaja', 'Wo', 'Kwati', 'Bhutwa', 'Chicken Chilli', 'Chicken Choila', 'Aloo Dum', 'Paneer Chilli',
'Mushroom Chilli', 'Tandoori Chicken', 'Mutton Sekuwa', 'Aloo Chop', 'Pani Puri', 'Aloo Chaat', 'Pakauda',
'Badaam Sadeko', 'Bhatmas Sadeko', 'Aloo Sadeko', 'Chicken Fry', 'Masu', 'Gundruk Soup', 'Piro Aloo', 'Chatpate'
    ]
  },
  everydayObjects: {
    name: 'Everyday Objects',
    emoji: '🏠',
    color: 'from-teal-400 to-cyan-500',
    character: '🔧',
    items: [
      'Mobile Phone', 'Laptop', 'Television', 'Remote Control', 'Charger', 'Headphones', 'Speaker', 'Camera', 'Watch', 'Glasses',
      'Wallet', 'Keys', 'Bag', 'Umbrella', 'Water Bottle', 'Cup', 'Glass', 'Plate', 'Spoon', 'Fork',
      'Knife', 'Chopsticks', 'Bowl', 'Pot', 'Pan', 'Stove', 'Refrigerator', 'Microwave', 'Toaster', 'Blender',
      'Chair', 'Table', 'Bed', 'Pillow', 'Blanket', 'Mattress', 'Lamp', 'Fan', 'Air Conditioner', 'Heater',
      'Mirror', 'Comb', 'Brush', 'Toothbrush', 'Toothpaste', 'Soap', 'Shampoo', 'Towel', 'Tissue', 'Toilet Paper',
      'Book', 'Pen', 'Pencil', 'Eraser', 'Ruler', 'Scissors', 'Stapler', 'Calculator', 'Computer Mouse', 'Keyboard',
      'Shoe', 'Sandal', 'Socks', 'Shirt', 'Pants', 'Jacket', 'Hat', 'Scarf', 'Gloves', 'Belt',
      'Clock', 'Calendar', 'Photo Frame', 'Candle', 'Flashlight', 'Battery', 'Plug', 'Wire', 'Switch', 'Socket',
      'Door', 'Window', 'Curtain', 'Carpet', 'Sofa', 'Cushion', 'Vase', 'Plant Pot', 'Flower', 'Painting',
      'Bicycle', 'Helmet', 'Lock', 'Chain', 'Rope', 'Nail', 'Hammer', 'Screwdriver', 'Wrench', 'Drill'
    ]
  },
  nepaliSongs: {
    name: 'Nepali Songs',
    emoji: '🎵',
    color: 'from-pink-400 to-rose-500',
    character: '🎤',
    items: [
      'Resham Firiri', 'Yo Samjhine Man Chha','Phoolko Aankhama',
     'Chyangba Hoi Chyangba', 'Kutu Ma Kutu', 'Mayalu',
      'Rato Ra Chandra Surya', 'Sayaun Thunga Phool Ka',
      'Yo Mann Ta Mero Nepali Ho',
      'Dashain Aayo', 
      'Risaune Bhaye', 'Maya Ma', 'Gajalu', 'Gulabi', 'Sathi', 'Sarangi', 'Aama', 'Bardali', 'Pahuna', 'Kya Kardiya',
      'Hataarindai Bataasindai', 'Chitthi Bhitra', 'Sasto Mutu', 'Hawaijahaj', 'Phutki Janey Jovan', 'Lukamari', 'Parkhaai', 'Naganya Maya', 'Suna Kaanchi', 'Dhairya',
      'Khai', 'Najeek', 'Aasha', 'Bimbaakash', 'Timi Ra Ma', 'Sochchau K Mero Bare', 'K Hunthyo Hola',
      'Gedai Jasto Jindagi', 'Hamro Nepal Ma', 'Flirty Maya', 'Rebirth', 'Chuck You',
      'Yo Dil Mero', 'Mero Aanshu', 'Thaha Chaina', 'Timro Yaad', 'Samjheyra', 'Kasari',
      'Komal Tyo Timro', 'Samarpan', 'Sundarta Ko Timi', 'Ma Sansar Jitne Aat', 'Timro Lagi',
      'Parelima', 'Maya Ko Dori Le', 'Man Magan', 'Oh Amira', "Rajamati Kumati", 'Gaine Dajaile'," Mai Chori Sundari", "Maya Ko Dori Le", "Taal Ko Pani", "Sambodhan", "Timi nai Hau"
    ]
  },
  hindiSongs: {
    name: 'Hindi Songs',
    emoji: '🎶',
    color: 'from-indigo-400 to-purple-500',
    character: '🎼',
    items: [
      'Tum Hi Ho', 'Kal Ho Naa Ho', 'Tujhe Dekha Toh', 'Kabhi Kabhi Aditi', 'Dil Chahta Hai', 'Yeh Dosti',
      'Tere Naam', 'Main Hoon Na', 'Koi Mil Gaya', 'Rang De Basanti', 'Jai Ho', 'Maa Tujhe Salaam',
      'Vande Mataram', 'Ae Mere Watan', 'Saare Jahan Se Achha', 'Jana Gana Mana', 'Kuch Kuch Hota Hai',
      'Chaiyya Chaiyya', 'Nagada Sang Dhol', 'Teri Meri', 'Tum Se Hi', 'Sajde', 'Phir Mohabbat',
      'Banjaara', 'Galliyan', 'Tum Jo Aaye', 'Jeene Laga Hoon', 'Raabta', 'Gerua', 'Dilwale',
      'Shah Rukh Khan Songs', 'Salman Khan Songs', 'Aamir Khan Songs', 'Akshay Kumar Songs', 'Hrithik Roshan Songs',
      'Arijit Singh Songs', 'Shreya Ghoshal Songs', 'Sonu Nigam Songs', 'Rahat Fateh Ali Khan Songs',
      'Kishor Kumar Songs', 'Lata Mangeshkar Songs', 'Mohammed Rafi Songs', 'Asha Bhosle Songs',
      'Tum Mile', 'Pee Loon', 'Channa Mereya', 'Ae Dil Hai Mushkil', 'Bulleya', 'Ishq Wala Love',
      'Nagini', 'Lungi Dance', 'Chennai Express', 'Happy New Year', 'Dilwale Dulhania Le Jayenge',
      'Kaho Naa Pyaar Hai', 'Lagaan', 'Dangal', 'Taare Zameen Par', '3 Idiots', 'PK', 'Bajrangi Bhaijaan'
    ]
  },
  brands: {
    name: 'Top Brands',
    emoji: '🏢',
    color: 'from-gray-400 to-gray-600',
    character: '🛍️',
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
    name: 'Vehicle Companies',
    emoji: '🚗',
    color: 'from-emerald-400 to-teal-500',
    character: '🏎️',
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
    name: 'Nepal Places and History',
    emoji: '🇳🇵',
    color: 'from-amber-400 to-orange-500',
    character: '🏛️',
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
    name: 'Bollywood Movies',
    emoji: '🎬',
    color: 'from-violet-400 to-purple-600',
    character: '🎭',
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
  const [selectedCategory, setSelectedCategory] = useState('nepalPlaces');
  const [numPlayers, setNumPlayers] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [imposterIndex, setImposterIndex] = useState(-1);
  const [revealedPlayers, setRevealedPlayers] = useState([]);
  const [gamePhase, setGamePhase] = useState('setup');
  const [timerDuration, setTimerDuration] = useState(2); // in minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [playerNames, setPlayerNames] = useState([]);
  const [customNames, setCustomNames] = useState(false);
  const [editingNames, setEditingNames] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentPlayerRevealed, setCurrentPlayerRevealed] = useState(false);
  const [currentPlayerHasSeen, setCurrentPlayerHasSeen] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setGamePhase('timeUp');
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Initialize player names when number changes
  useEffect(() => {
    const defaultNames = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);
    if (!customNames) {
      setPlayerNames(defaultNames);
    } else {
      const newNames = [...playerNames];
      while (newNames.length < numPlayers) {
        newNames.push(`Player ${newNames.length + 1}`);
      }
      while (newNames.length > numPlayers) {
        newNames.pop();
      }
      setPlayerNames(newNames);
    }
  }, [numPlayers, customNames]);

  const startGame = () => {
    const items = CATEGORIES[selectedCategory].items;
    const item = items[Math.floor(Math.random() * items.length)];
    const imposter = Math.floor(Math.random() * numPlayers);
    setSelectedItem(item);
    setImposterIndex(imposter);
    setGameStarted(true);
    setRevealedPlayers(new Array(numPlayers).fill(false));
    setGamePhase('reveal');
    setTimeLeft(0);
    setTimerActive(false);
    setCurrentPlayerIndex(0);
    setCurrentPlayerRevealed(false);
    setCurrentPlayerHasSeen(false);
  };

  const toggleReveal = (index) => {
    const newRevealed = [...revealedPlayers];
    newRevealed[index] = !newRevealed[index];
    setRevealedPlayers(newRevealed);
  };

  const startDiscussion = () => {
    setGamePhase('discussion');
    setTimeLeft(timerDuration * 60); // Convert minutes to seconds
    setTimerActive(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedItem('');
    setImposterIndex(-1);
    setRevealedPlayers([]);
    setGamePhase('setup');
    setTimeLeft(0);
    setTimerActive(false);
    setCurrentPlayerIndex(0);
    setCurrentPlayerRevealed(false);
    setCurrentPlayerHasSeen(false);
  };

  const restartSameCategory = () => {
    const items = CATEGORIES[selectedCategory].items;
    const item = items[Math.floor(Math.random() * items.length)];
    const imposter = Math.floor(Math.random() * numPlayers);
    setSelectedItem(item);
    setImposterIndex(imposter);
    setRevealedPlayers(new Array(numPlayers).fill(false));
    setGamePhase('reveal');
    setTimeLeft(0);
    setTimerActive(false);
    setCurrentPlayerIndex(0);
    setCurrentPlayerRevealed(false);
    setCurrentPlayerHasSeen(false);
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < numPlayers - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setCurrentPlayerRevealed(false);
      setCurrentPlayerHasSeen(false);
    } else {
      // All players have seen their cards, move to discussion phase setup
      setGamePhase('readyForDiscussion');
    }
  };

  const toggleCurrentPlayerReveal = () => {
    if (!currentPlayerRevealed) {
      // First time revealing - mark as seen
      setCurrentPlayerHasSeen(true);
    }
    setCurrentPlayerRevealed(!currentPlayerRevealed);
  };

  const changePlayers = (delta) => {
    const newNum = numPlayers + delta;
    if (newNum >= 3 && newNum <= 6) {
      setNumPlayers(newNum);
    }
  };

  const updatePlayerName = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name || `Player ${index + 1}`;
    setPlayerNames(newNames);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const players = playerNames.length > 0 ? playerNames : Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);

  const getInstructionText = () => {
    if (selectedCategory === 'brands' || selectedCategory === 'vehicles') {
      return 'Describe WITHOUT saying the brand name or country!';
    }
    if (selectedCategory === 'nepaliIndianFood') {
      return 'Describe WITHOUT saying the food name!';
    }
        if (selectedCategory === 'wwePlayers') {
      return 'Describe WITHOUT saying the player name!';
    }
    
    if (selectedCategory === 'nepal' || selectedCategory === 'nepalPlaces') {
      return 'Describe WITHOUT saying the exact name!';
    }
    if (selectedCategory === 'countries' || selectedCategory === 'country') {
      return 'Describe WITHOUT saying the exact name!';
    }
    if (selectedCategory === 'bollywood') {
      return 'Describe WITHOUT saying the movie name!';
    }
    if (selectedCategory === 'hindiSongs' || selectedCategory === 'nepaliSongs') {
      return 'Describe WITHOUT saying the song name!';
    }
    if (selectedCategory === 'nepaliSlangWorst') {
      return 'Describe WITHOUT saying the slang name!';
    }
    if (selectedCategory === 'professions') {
      return 'Describe WITHOUT saying the profession name!';
    }
    if (selectedCategory === 'everydayObjects') {
      return 'Describe WITHOUT saying the object name!';
    }
    return 'Describe WITHOUT saying the name!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            Ultimate Charade
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">Find the imposter among you!</p>
        </div>

        {!gameStarted ? (
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 transform hover:scale-105 min-h-[200px] flex flex-col justify-between ${
                      selectedCategory === key
                        ? `bg-gradient-to-br ${cat.color} text-white shadow-2xl scale-105 ring-4 ring-yellow-400 ring-opacity-75`
                        : `bg-gradient-to-br ${cat.color} opacity-70 hover:opacity-100 text-white shadow-lg`
                    }`}
                  >
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="text-6xl mb-3 transform hover:scale-110 transition-transform">
                        {cat.character}
                      </div>
                      <h3 className="text-lg font-bold mb-1">
                        {cat.name}
                      </h3>
                      <div className="text-xs opacity-80">
                        Magic Charade
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 text-2xl opacity-50">
                      {cat.emoji}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 text-center">Choose Category</h2>
                <button
                  onClick={() => setShowHowToPlay(!showHowToPlay)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2 touch-manipulation"
                >
                  <span>❓</span>
                  How to Play
                </button>
              </div>
              
              {showHowToPlay && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="text-4xl mb-3 text-center"></div>
                      <h3 className="font-bold text-lg mb-2 text-center">Setup</h3>
                      <p className="text-sm text-center opacity-90">3-6 Players: One becomes the secret imposter, others know the word</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="text-4xl mb-3 text-center">👁️</div>
                      <h3 className="font-bold text-lg mb-2 text-center">Reveal</h3>
                      <p className="text-sm text-center opacity-90">Each player privately checks their card - don't let others see!</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                      <div className="text-4xl mb-3 text-center">💬</div>
                      <h3 className="font-bold text-lg mb-2 text-center">Discuss</h3>
                      <p className="text-sm text-center opacity-90">Describe the word WITHOUT saying its name directly</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 text-white shadow-lg md:col-span-2 lg:col-span-1">
                      <div className="text-4xl mb-3 text-center"></div>
                      <h3 className="font-bold text-lg mb-2 text-center">Win Goal</h3>
                      <p className="text-sm text-center opacity-90">Regular players find the imposter, imposter guesses the word</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg md:col-span-2">
                      <div className="text-4xl mb-3 text-center">⚠️</div>
                      <h3 className="font-bold text-lg mb-2 text-center">Imposter Challenge</h3>
                      <p className="text-sm text-center opacity-90">You don't know the word - blend in and try to guess what everyone's talking about!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6 sm:mb-8">
              <p className="text-gray-800 text-base sm:text-lg mb-4 text-center">Number of Players</p>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => changePlayers(-1)}
                  disabled={numPlayers <= 3}
                  className="bg-gray-100 text-gray-800 p-2 sm:p-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-300 touch-manipulation"
                >
                  <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <span className="text-gray-800 text-3xl sm:text-4xl font-bold w-16 sm:w-20 text-center">{numPlayers}</span>
                <button
                  onClick={() => changePlayers(1)}
                  disabled={numPlayers >= 6}
                  className="bg-gray-100 text-gray-800 p-2 sm:p-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-300 touch-manipulation"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mt-2 text-center">Min: 3 | Max: 6</p>
            </div>

            <div className="mb-6 sm:mb-8">
              <p className="text-gray-800 text-base sm:text-lg mb-4 text-center">Discussion Timer</p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                <button
                  onClick={() => setTimerDuration(1)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all border touch-manipulation text-sm sm:text-base ${ 
                    timerDuration === 1 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                  1 Minute
                </button>
                <button
                  onClick={() => setTimerDuration(2)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all border touch-manipulation text-sm sm:text-base ${ 
                    timerDuration === 2 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                  2 Minutes
                </button>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <p className="text-gray-800 text-lg">Player Names</p>
                <button
                  onClick={() => {
                    setCustomNames(!customNames);
                    setEditingNames(!customNames);
                  }}
                  className="bg-gray-100 text-gray-800 p-2 rounded-lg hover:bg-gray-200 transition-all border border-gray-300"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              
              {editingNames && (
                <div className="space-y-3 max-w-md mx-auto">
                  {Array.from({ length: numPlayers }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-600 w-20">Player {index + 1}:</span>
                      <input
                        type="text"
                        value={playerNames[index] || `Player ${index + 1}`}
                        onChange={(e) => {
                          setCustomNames(true);
                          updatePlayerName(index, e.target.value);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Player ${index + 1}`}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingNames(false)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
              
              {!editingNames && (
                <div className="text-center text-gray-600">
                  {customNames ? 'Custom names set' : 'Using default names (Player 1, Player 2, ...)'}
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg touch-manipulation"
              >
                Start New Game
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl">{CATEGORIES[selectedCategory].character}</span>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">
                    {CATEGORIES[selectedCategory].name}
                  </p>
                  <p className="text-sm opacity-90 font-medium">🎯 Selected Category</p>
                </div>
                <span className="text-3xl sm:text-4xl">{CATEGORIES[selectedCategory].emoji}</span>
              </div>
            </div>

            {gamePhase === 'reveal' && (
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl">🤫</span>
                    <h3 className="text-lg sm:text-xl font-bold">Secret Reveal</h3>
                    <span className="text-2xl">👁️</span>
                  </div>
                  <p className="text-center text-sm sm:text-base opacity-90">
                    {players[currentPlayerIndex]}, it's your turn! Others should look away.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-200">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">
                      {currentPlayerIndex === imposterIndex ? '' : ''}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                      {players[currentPlayerIndex]}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <span>Player {currentPlayerIndex + 1} of {numPlayers}</span>
                      <div className="flex gap-1">
                        {Array.from({length: numPlayers}).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full ${
                              i === currentPlayerIndex ? 'bg-blue-500' : 
                              i < currentPlayerIndex ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {!currentPlayerRevealed ? (
                    <button
                      onClick={toggleCurrentPlayerReveal}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg touch-manipulation flex items-center justify-center gap-3"
                    >
                      <Eye className="w-6 h-6" />
                      Click to Reveal Your Card
                    </button>
                  ) : (
                    <div className="space-y-6">
                      <button
                        onClick={toggleCurrentPlayerReveal}
                        className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                      >
                        <span>👁️</span>
                        Click to Hide Card
                      </button>
                      
                      {imposterIndex === currentPlayerIndex ? (
                        <div className="text-center p-6 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl text-white">
                          <div className="text-4xl mb-3">🕵️</div>
                          <p className="text-2xl font-bold mb-2">YOU ARE THE IMPOSTER!</p>
                          <p className="text-sm opacity-90">
                            You don't know the secret word. Listen carefully during discussion and try to guess what everyone's talking about!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl text-white">
                          <div className="text-4xl mb-3">🎯</div>
                          <p className="text-lg mb-2 opacity-90">Your secret word is:</p>
                          <p className="text-3xl font-bold mb-3 break-words">{selectedItem}</p>
                          <p className="text-sm opacity-90">{getInstructionText()}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentPlayerHasSeen && (
                    <div className="mt-6">
                      <button
                        onClick={nextPlayer}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-xl font-bold hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg touch-manipulation flex items-center justify-center gap-3"
                      >
                        {currentPlayerIndex === numPlayers - 1 ? (
                          <>
                            <Users className="w-6 h-6" />
                            Ready for Discussion
                          </>
                        ) : (
                          <>
                            Next Player ({players[currentPlayerIndex + 1]})
                            <span className="text-2xl">→</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={resetGame}
                    className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2 mx-auto border border-gray-300 touch-manipulation"
                  >
                    <RotateCcw className="w-5 h-5" />
                    New Game
                  </button>
                </div>
              </div>
            )}

            {gamePhase === 'readyForDiscussion' && (
              <div className="max-w-md mx-auto text-center">
                <div className="bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-lg mb-6">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-2xl font-bold mb-2">All Players Ready!</h3>
                  <p className="text-sm opacity-90">Everyone has seen their cards. Ready to start the discussion?</p>
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={startDiscussion}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg touch-manipulation"
                  >
                    Start Discussion
                  </button>
                  <button
                    onClick={resetGame}
                    className="bg-gray-100 text-gray-800 px-8 py-4 rounded-xl text-xl font-bold hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2 border border-gray-300 touch-manipulation"
                  >
                    <RotateCcw className="w-6 h-6" />
                    New Game
                  </button>
                </div>
              </div>
            )}

            {gamePhase === 'discussion' && (
              <div className="max-w-md mx-auto text-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200 mb-6">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Discussion Time</h3>
                  <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-3xl mb-6 ${
                    timeLeft <= 30 ? 'bg-red-100 text-red-600 border-2 border-red-300' 
                    : timeLeft <= 60 ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300'
                    : 'bg-green-100 text-green-600 border-2 border-green-300'
                  }`}>
                    <Clock className="w-8 h-8" />
                    {formatTime(timeLeft)}
                  </div>
                  
                  <button
                    onClick={() => setGamePhase('timeUp')}
                    className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-xl font-bold hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg touch-manipulation flex items-center justify-center gap-3 mb-4"
                  >
                    <span className="text-2xl">🎯</span>
                    Ready to Guess!
                  </button>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={restartSameCategory}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg touch-manipulation flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Same Category
                    </button>
                    
                    <button
                      onClick={resetGame}
                      className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all shadow-lg touch-manipulation flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🏠</span>
                      Go Home
                    </button>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-gray-500 text-sm">
                    Category: {CATEGORIES[selectedCategory].name}
                  </p>
                </div>
              </div>
            )}

            {gamePhase === 'timeUp' && (
              <div className="max-w-md mx-auto text-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200 mb-6">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Voting Time!</h3>
                  <div className="text-gray-600 text-sm space-y-2 mb-6">
                    <p>🗳️ Discuss and vote for who you think is the imposter</p>
                    <p>🤔 Imposter: Try to guess the secret word to win</p>
                    <p>🎯 Regular players: Find the imposter to win</p>
                  </div>
                  
                  <div className="flex gap-3 justify-center mb-4">
                    <button
                      onClick={restartSameCategory}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg touch-manipulation flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Same Category
                    </button>
                    
                    <button
                      onClick={resetGame}
                      className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all shadow-lg touch-manipulation flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🏠</span>
                      Go Home
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    Category: {CATEGORIES[selectedCategory].name}
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
