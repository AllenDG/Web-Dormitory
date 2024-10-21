export function chatbotResponses(userInput) {
    const lowerCaseInput = userInput.toLowerCase();
  
    const responses = {
      hello: "Hi there! How can I assist you today?",
      "how are you?": "I'm just a bunch of code, but I'm doing great! How about you?",
      "what is your name?": "I'm DormyBot, your virtual assistant.",
      "thank you": "You're welcome! Is there anything else I can help you with?",
      bye: "Goodbye! Have a great day!",
      
      "show me available rooms": 
        "Here are the rooms I found: Studio Type Room, Deluxe Studio Room, Economy Studio Room, Family Studio Room, Luxury Studio Room, and Condo Studio Unit. Would you like more details on any of these?",
      
      "tell me about studio rooms in dagupan": 
        "In Dagupan, we have the following rooms available: Studio Type Room, Deluxe Studio Room, Family Studio Room, and Luxury Studio Room. Prices range from 3,000 to 8,000 per night. Would you like more details on any of these?",
      
      "tell me about studio rooms in manaoag": 
        "We have the Condo Studio Unit available in Manaoag, which is priced at 3,500 per night. It includes amenities like Wifi, Air Conditioning, a Kitchenette, Gym Access, and Parking. Would you like to book it?",
      
      "what amenities are available?": 
        "Our rooms offer amenities like Wifi/Internet, Air Conditioning, Refrigerator, Kitchen, and Parking. Some rooms also include additional features like Rooftop Access, Gym Access, Study Hub, or a Family Room. Which room are you interested in?",
      
      "how much does the economy studio room cost?": 
        "The Economy Studio Room is priced at 2,000 per night. It's ideal for budget travelers and includes amenities like Wifi, a shared kitchen, and parking.",
      
      "show me the most expensive room": 
        "The most expensive room is the Luxury Studio Room, priced at 8,000 per night. It offers high-end furnishings, stunning views, and amenities like Rooftop Access, 24/7 Security, and a King Bed.",
      
      "show me the cheapest room": 
        "The cheapest room is the Economy Studio Room, which costs 2,000 per night. It offers basic amenities such as Wifi, a shared kitchen, and parking. Perfect for short stays.",
      
      "can i see rooms for 2 people?": 
        "Here are rooms that accommodate 2 people: Studio Type Room (3,000 per night), Economy Studio Room (2,000 per night), and Condo Studio Unit (3,500 per night). Would you like to book any of these?",
      
      "are there family rooms?": 
        "Yes! The Family Studio Room is available, perfect for families or groups. It can accommodate up to 6 people and is priced at 6,000 per night. It includes amenities like Wifi, Air Conditioning, a Kitchen, and a Family Room.",
      
      "what room is good for long stays?": 
        "The Deluxe Studio Room is perfect for long stays. It's spacious, features a fully equipped kitchen, and offers amenities like Wifi, Air Conditioning, and Rooftop Access. It's priced at 4,500 per night. Would you like more details?",
      
      "tell me about the condo studio unit": 
        "The Condo Studio Unit is located in Manaoag and is priced at 3,500 per night. It combines comfort with style, featuring a double bed, a kitchenette, gym access, and parking. Ideal for individuals or couples.",
      
      "show me rooms with a kitchen": 
        "Here are the rooms with kitchen facilities: Studio Type Room, Deluxe Studio Room, Economy Studio Room (shared kitchen), Family Studio Room, and the Condo Studio Unit. Would you like to know more about any specific room?",
      
      "how do i book a room?": 
        "You can book a room by providing your preferred room, check-in date, and duration of stay. Once confirmed, I'll guide you through the process!",
      
      "is there free wifi?": 
        "Yes, all of our rooms offer free Wifi/Internet access.",
      
      "is parking available?": 
        "Yes, parking is available for most rooms. The Studio Type Room, Economy Studio Room, and Condo Studio Unit all offer parking.",
      
      "which room has the best view?": 
        "The Luxury Studio Room offers the best views, along with high-end furnishings and rooftop access. It's priced at 8,000 per night.",
      
      "do you have rooms for couples?": 
        "Yes, we have several rooms ideal for couples, including the Studio Type Room (3,000 per night), Deluxe Studio Room (4,500 per night), and the Condo Studio Unit (3,500 per night). Would you like more information on any of these?"
    };
  
    return (
      responses[lowerCaseInput] ||
      "I'm sorry, I don't understand that. Can you please ask something else?"
    );
  }
  