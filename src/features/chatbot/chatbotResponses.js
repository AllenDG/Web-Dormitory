// chatbotResponses.js

export const chatbotResponses = (input) => {
  switch (input) {
    case "Show me available rooms":
      return "We have several room types available, including single, double, and family rooms.";
    case "Tell me about amenities":
      return "We offer a variety of amenities including free WiFi, breakfast, and pool access.";
    case "Do you have rooms for families?":
      return "Yes, we have family suites equipped with extra beds and space for children.";
    case "Which room is best for long stays?":
      return "Our executive suites are perfect for long stays as they come with kitchenettes and living areas.";
    case "Is there free WiFi?":
      return "Yes, we provide free WiFi throughout the hotel.";
    case "Do rooms have kitchens?":
      return "Some of our rooms are equipped with kitchens. Please check our room descriptions for details.";
    case "Tell me about the Family Studio Room":
      return "The Family Studio Room features a king-sized bed, a sofa bed, and a kitchenette.";
    case "What is the cost for family rooms?":
      return "Family rooms start at $150 per night, depending on the season.";
    case "What is the cost for long stays?":
      return "For long stays, we offer discounts starting at 20% off for stays longer than 7 nights.";
    case "Do you offer discounts for long stays?":
      return "Yes, we provide discounts for long stays. The longer you stay, the more you save!";
    case "Which rooms have free WiFi?":
      return "All our rooms have free WiFi access.";
    case "Is WiFi fast enough for work?":
      return "Yes, our WiFi is fast and suitable for work-related activities.";
    case "Which rooms have full kitchens?":
      return "Our executive suites and family suites come with full kitchens.";
    case "Are there shared kitchens available?":
      return "We do not have shared kitchens; however, every suite with a kitchen is private.";
    default:
      return "I'm sorry, I didn't understand that. Can you please ask something else?";
  }
};
