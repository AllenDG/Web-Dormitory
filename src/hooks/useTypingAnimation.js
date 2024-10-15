import { useEffect, useState } from "react";

export default function useTypingAnimation (words, typingSpeed = 150, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (displayText.length < words[index].length) {
        setDisplayText((prev) => prev + words[index].charAt(displayText.length));
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setDisplayText("");
          setIndex((prev) => (prev + 1) % words.length); 
        }, pauseDuration);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [displayText, index, words, typingSpeed, pauseDuration]);

  return displayText;
};


