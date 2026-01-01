// Centralized suggestions for all wizard steps
// Each question has a pool of suggestions that can be randomized

const suggestions = {
    travelMemory: {
      icon: '✈️',
      customPrefix: '✈️',
      suggestionsLabel: '✨ Need inspiration? Others said...',
      hint: '💫 Add as many as you like — the more memories the better!',
      pools: [
        // Pool 1 - Cities
        ['🗼 Paris', '🗾 Tokyo', '🗽 New York', '🏖️ Barcelona', '🌴 Bali', '🎡 London', '🏛️ Rome', '🌉 San Francisco'],
        // Pool 2 - Experiences
        ['🏠 Home with family', '🚗 A road trip', '🏔️ The mountains', '🏝️ A beach somewhere', '🌆 A new city', '✨ Somewhere magical'],
        // Pool 3 - More cities
        ['🇵🇹 Portugal', '🇬🇷 Greece', '🇹🇭 Thailand', '🇯🇵 Japan', '🇮🇹 Italy', '🇪🇸 Spain', '🇲🇽 Mexico', '🇻🇳 Vietnam'],
        // Pool 4 - Adventure
        ['⛷️ Skiing trip', '🚢 A cruise', '🏕️ Camping adventure', '🌋 Somewhere exotic', '🎢 Theme park trip', '🚂 Train journey']
      ]
    },
  
    bigMoment: {
      icon: '⭐',
      customPrefix: '⭐',
      suggestionsLabel: '🎊 Others celebrated...',
      hint: '🌟 Big or small, every milestone counts!',
      pools: [
        ['🎓 My graduation', '💼 A new job', '💍 Getting married', '👶 Having a baby', '🏠 Buying a home', '📦 Moving somewhere new'],
        ['🎉 A promotion', '🚀 Starting a business', '🏆 Winning something', '📚 Finishing a course', '💪 A health milestone', '🎂 A special birthday'],
        ['🎤 Public speaking', '🏃 Completed a race', '📖 Wrote something', '🎨 Created something', '🤝 Made a big decision', '💔 Survived something hard'],
        ['🧘 Mental health win', '💳 Paid off debt', '🚗 Got my license', '✈️ Solo trip', '🐕 Got a pet', '🎓 Kids milestone']
      ]
    },
  
    quietJoy: {
      icon: '✨',
      customPrefix: '✨',
      suggestionsLabel: '☀️ Others found joy in...',
      hint: '🌸 The little things often mean the most',
      pools: [
        ['☕ Morning coffee in peace', '📖 A really good book', '🚶 Sunday walks', '🍳 Cooking a great meal', '🌙 Late night talks', '😴 A lazy weekend'],
        ['🐕 Time with my pet', '🌅 A perfect sunset', '🛁 A long bath', '🎵 Music that hit different', '🌧️ Rain on the window', '🍷 Wine with a friend'],
        ['🌸 Spring flowers', '🕯️ Candle-lit evening', '📺 Binge watching', '🎮 Gaming session', '🧩 A good puzzle', '☀️ Morning sunshine'],
        ['👨‍👩‍👧 Family dinner', '📱 Video call with friends', '🍕 Perfect takeaway', '🛋️ Cozy couch time', '📝 Journaling', '🎧 New album drop']
      ]
    },
  
    habitsThatStuck: {
      icon: '✅',
      customPrefix: '✅',
      suggestionsLabel: '💯 Others kept up with...',
      hint: '🏆 Every habit is a win — select all that stuck!',
      pools: [
        ['🌅 Morning routine', '👟 10k steps', '📚 Reading before bed', '💧 Drinking water', '🥗 Meal prepping', '📝 Journaling'],
        ['📵 No phone in bed', '🏋️ Gym consistency', '🧘 Meditation', '⏰ Early wake ups', '🥦 Healthy eating', '😴 Regular sleep'],
        ['💰 Budgeting', '🚶 Daily walks', '📧 Inbox zero', '🧹 Weekly cleaning', '📅 Planning ahead', '🙏 Gratitude practice'],
        ['🎯 Weekly reviews', '💊 Taking vitamins', '🌿 Plant care', '📞 Calling family', '✍️ Daily writing', '🎨 Creative time']
      ]
    },
  
    personWhoMadeYear: {
      icon: '💝',
      customPrefix: '💝',
      suggestionsLabel: '🥰 Others were grateful for...',
      hint: '💕 Add everyone who made a difference — big or small',
      pools: [
        ['💑 My partner', '👯 My best friend', '👩 My mum', '👨 My dad', '👫 My siblings', '🤝 A new friend'],
        ['💼 A colleague', '👶 My kids', '👴 My grandparents', '🐕 My pet', '👨‍🏫 A mentor', '🏠 My roommate'],
        ['🧑‍⚕️ My therapist', '👨‍🍳 A kind stranger', '📚 An author', '🎙️ A podcaster', '👨‍🏫 A teacher', '🤝 My boss'],
        ['💪 My gym buddy', '🎮 Online friends', '👨‍👩‍👧 Extended family', '🏥 Healthcare worker', '☕ Barista friend', '🐱 My cat']
      ]
    },
  
    whatDidntWork: {
      icon: '📝',
      customPrefix: '📝',
      suggestionsLabel: '💭 Others reflected on...',
      hint: '🌱 No judgment here — this is how we grow',
      pools: [
        ['🏋️ That gym membership', '💼 Staying in a job too long', '😴 Not enough sleep', '💸 Spending habits', '🙋 Saying yes to everything', '🚧 Not enough boundaries'],
        ['📱 Too much screen time', '🦥 Procrastinating', '🤐 Not asking for help', '🍔 Eating habits', '😰 Stressing too much', '🗓️ Poor time management'],
        ['🍺 Drinking too much', '😤 Losing my temper', '📵 Ignoring messages', '🛋️ Being too sedentary', '💭 Overthinking', '🙈 Avoiding problems'],
        ['💳 Credit card debt', '🚬 Bad habits', '😔 Negative self-talk', '🎯 No clear goals', '👥 Wrong crowd', '⏰ Always rushing']
      ]
    },
  
    wishedMoreTimeFor: {
      icon: '⏰',
      customPrefix: '⏰',
      suggestionsLabel: '🕐 Others wished for more time with...',
      hint: '⏳ Now you know what to protect in 2026',
      pools: [
        ['👨‍👩‍👧‍👦 Family', '👯 Friends', '🎨 Hobbies', '😴 Rest', '✈️ Travel', '🧘 Myself'],
        ['🏃 Exercise', '📚 Learning', '🌳 Being outdoors', '🎸 Creative projects', '📖 Reading', '🧠 Mental health'],
        ['💑 My relationship', '🐕 My pet', '🏠 Home projects', '💼 Side projects', '🎮 Fun stuff', '🧹 Getting organized'],
        ['👴 Grandparents', '📞 Old friends', '🎯 Career growth', '💰 Financial planning', '🌱 Personal growth', '🙏 Spirituality']
      ]
    },
  
    kindOfPerson: {
      icon: '🦋',
      customPrefix: '🦋',
      suggestionsLabel: '✨ Others are becoming...',
      hint: '🌱 Not what you want to do — who you want to become',
      pools: [
        ['😌 Calmer', '💥 Bolder', '💪 Healthier', '🧘 More present', '🌍 More adventurous', '🎯 More focused'],
        ['✨ More confident', '🙏 More patient', '🎨 More creative', '🤝 More connected', '📚 More knowledgeable', '💰 More financially savvy'],
        ['🗣️ Better communicator', '❤️ More loving', '🧠 More disciplined', '😊 More positive', '🦁 More courageous', '🌟 More authentic'],
        ['🏃 More active', '📖 More curious', '🙌 More generous', '⚡ More energetic', '🎭 More spontaneous', '🧘 More mindful']
      ]
    },
  
    perfectDay: {
      icon: '☀️',
      customPrefix: '☀️',
      suggestionsLabel: '🌤️ Others are dreaming of...',
      hint: '🌅 Design the ordinary day, design your extraordinary year',
      pools: [
        ['🏃 Morning workout done', '💼 Work I actually enjoy', '⚡ Energy all day', '👨‍👩‍👧 Time for people I love', '🚶 Not rushing', '😴 Sleeping well'],
        ['🎨 Creative time', '📚 Learning something new', '🌳 Time outdoors', '🥗 Eating well', '🙏 Feeling grateful', '😂 Laughing more'],
        ['☕ Slow morning coffee', '🧘 Meditation done', '📵 Phone-free time', '🌅 Watching sunrise', '👟 A good walk', '🍳 Home-cooked meals'],
        ['📖 Reading time', '🛁 Relaxing evening', '💬 Great conversations', '🎵 Music playing', '🧹 Tidy space', '✅ Inbox zero']
      ]
    },
  
    wantToExperience: {
      icon: '✨',
      customPrefix: '✨',
      suggestionsLabel: '💫 Others are craving...',
      hint: '🌈 Dream big — what would make this year unforgettable?',
      pools: [
        ['✈️ A big trip', '💼 A new job', '💕 Falling in love', '☮️ Inner peace', '🎢 An adventure', '🎓 Learning something new'],
        ['🦅 More freedom', '💪 Better health', '💰 Financial security', '🤝 Making new friends', '🚀 Starting something', '🏆 Feeling proud of myself'],
        ['🏠 A new home', '👶 Starting a family', '🎉 Epic celebration', '🌊 Beach vibes', '🏔️ Mountain adventure', '🎭 Cultural experience'],
        ['🏃 Running a race', '📚 Writing a book', '🎤 Public speaking', '🎨 Art exhibition', '🎵 Live concert', '🌟 Viral moment']
      ]
    },
  
    goalsDreams: {
      icon: '🎯',
      customPrefix: '🎯',
      suggestionsLabel: '🔥 Others are going for...',
      hint: '🌟 What would make you really proud this time next year?',
      pools: [
        ['🏃 Run a marathon', '🗣️ Learn a language', '📈 Get promoted', '💻 Start a side project', '📚 Read 20 books', '💰 Save €10,000'],
        ['💪 Get really fit', '👨‍🍳 Learn to cook', '✍️ Write more', '🚭 Quit a bad habit', '🧠 Start therapy', '💼 Find a new job'],
        ['🎸 Learn an instrument', '📱 Build an app', '🎨 Create more art', '🏠 Buy a home', '🚗 Get a car', '💳 Pay off debt'],
        ['🎓 Get certified', '🚀 Launch a business', '📺 Start a YouTube', '🎙️ Start a podcast', '👨‍👩‍👧 Have a baby', '💍 Get engaged']
      ]
    },
  
    placeToVisit: {
      icon: '🌍',
      customPrefix: '🌍',
      suggestionsLabel: '🧳 Popular dream destinations...',
      hint: '✈️ Where in the world is calling your name?',
      pools: [
        ['🗾 Japan', '🍝 Italy', '🥝 New Zealand', '🇵🇹 Portugal', '🌋 Iceland', '🏛️ Greece'],
        ['🏝️ Thailand', '🍁 Canada', '🐪 Morocco', '🦘 Australia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland', '🍜 Vietnam'],
        ['🗽 New York', '🌉 San Francisco', '🏔️ Switzerland', '🎭 London', '🗼 Paris', '🌆 Dubai'],
        ['🇲🇽 Mexico', '🇧🇷 Brazil', '🇿🇦 South Africa', '🇮🇳 India', '🇰🇷 South Korea', '🇳🇴 Norway']
      ]
    },
  
    habitToBuild: {
      icon: '🔄',
      customPrefix: '🔄',
      suggestionsLabel: '💫 Popular habits to build...',
      hint: '⚡ Small daily actions create big yearly results',
      pools: [
        ['🌅 Morning routine', '🏃 Exercise regularly', '📖 Read daily', '🧘 Meditate', '💧 Drink more water', '😴 Sleep 8 hours'],
        ['📝 Journal', '🎓 Learn something new', '🥗 Eat healthier', '📵 Less phone time', '👟 Walk 10k steps', '📋 Weekly planning'],
        ['🙏 Practice gratitude', '🧹 Keep space tidy', '💰 Track spending', '⏰ Wake up early', '📧 Inbox zero', '🎯 Daily goals'],
        ['🧠 Brain training', '🌿 Spend time in nature', '📞 Call loved ones', '✍️ Write daily', '🎨 Create something', '💪 Strength training']
      ]
    },
  
    savingFor: {
      icon: '💰',
      customPrefix: '💰',
      suggestionsLabel: '💵 Others are saving for...',
      hint: '🎯 What gets you excited to put money aside?',
      pools: [
        ['🏖️ A big holiday', '🚗 A new car', '🏠 A house deposit', '🆘 Emergency fund', '💒 A wedding', '💻 New laptop'],
        ['🚀 Starting a business', '🎓 Going back to school', '🎁 A special gift', '👴 Retirement', '🔨 Home renovations', '💳 Paying off debt'],
        ['📱 New phone', '🎸 Something fun', '👶 Family planning', '🏋️ Home gym', '🛋️ New furniture', '🎮 Gaming setup'],
        ['✈️ First class flight', '⌚ Nice watch', '📸 Camera gear', '🚲 Electric bike', '👗 Wardrobe upgrade', '🎓 Kids education']
      ]
    }
  };
  
  // Get a random selection of suggestions for a question
  export const getSuggestions = (questionKey, count = 12) => {
    const questionData = suggestions[questionKey];
    if (!questionData) return [];
  
    // Flatten all pools
    const allSuggestions = questionData.pools.flat();
    
    // Shuffle and take the requested count
    const shuffled = allSuggestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  
  // Get a new batch of suggestions (excluding current ones)
  export const getNewSuggestions = (questionKey, currentSuggestions = [], count = 12) => {
    const questionData = suggestions[questionKey];
    if (!questionData) return [];
  
    // Flatten all pools
    const allSuggestions = questionData.pools.flat();
    
    // Filter out current suggestions
    const available = allSuggestions.filter(s => !currentSuggestions.includes(s));
    
    // If not enough new suggestions, include some old ones
    if (available.length < count) {
      const shuffled = allSuggestions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }
    
    // Shuffle and take the requested count
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  
  // Get metadata for a question
  export const getQuestionMeta = (questionKey) => {
    const questionData = suggestions[questionKey];
    if (!questionData) return {
      icon: '✨',
      customPrefix: '✨',
      suggestionsLabel: '✨ Others said...',
      hint: '💫 Add as many as you like!'
    };
  
    return {
      icon: questionData.icon,
      customPrefix: questionData.customPrefix,
      suggestionsLabel: questionData.suggestionsLabel,
      hint: questionData.hint
    };
  };
  
  // Get total count of suggestions for a question
  export const getTotalSuggestionsCount = (questionKey) => {
    const questionData = suggestions[questionKey];
    if (!questionData) return 0;
    return questionData.pools.flat().length;
  };
  
  export default suggestions;