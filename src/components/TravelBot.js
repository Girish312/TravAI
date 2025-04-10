import React, { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { useLocation } from "react-router-dom";
import "../styles/TravelBot.css";

const TravelBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hi! Tell me your interests and I’ll suggest a travel destination ✈️",
    },
  ]);
  const [input, setInput] = useState("");
  const [typingReply, setTypingReply] = useState("");
  const chatRef = useRef(null);

  const location = useLocation();
  const selectedPlace = location.state?.selectedPlace;

  // Auto-scroll when chat updates
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typingReply]);

  // Set input if selected place is provided
  useEffect(() => {
    if (selectedPlace) {
      setInput(`Tell me about travel options near ${selectedPlace}`);
    }
  }, [selectedPlace]);

  // Auto-send input once set
  useEffect(() => {
    if (input && selectedPlace) {
      sendMessage(); // Auto trigger
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setTypingReply("");

    const prompt = selectedPlace
      ? `Give travel info for ${selectedPlace}. Include:
        - Nearby hotels 🏨
        - Popular tourist spots 📍
        - Budget range 💰`
      : `Act like a smart travel assistant. The user says: "${input}".
        Recommend **three travel destinations** that match the user's interests.
        For each suggestion, explain **why** it's a good match.
        Include variety (cultural, food, adventure, beach, etc.) and be friendly.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBGU31DaPZpGCvTvnU28g0S0y2wMVz-2bk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Hmm, couldn't fetch a suggestion.";

      // Typing animation
      let i = 0;
      const typingInterval = setInterval(() => {
        setTypingReply(reply.slice(0, i));
        i++;
        if (i > reply.length) {
          clearInterval(typingInterval);
          setTypingReply("");
          setMessages((prev) => [...prev, { role: "bot", content: reply }]);
        }
      }, 15);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <div className="container">
      <h1 className="header">🌍 Travel Destination Suggestion Bot</h1>

      <div className="chat-box" ref={chatRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "user" : "bot"}
            dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
          />
        ))}
        {typingReply && (
          <div
            className="bot"
            dangerouslySetInnerHTML={{ __html: marked.parse(typingReply) }}
          />
        )}
      </div>

      <div className="input-area">
        <input
          placeholder="E.g., I love mountains and local culture"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn-send" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TravelBot;
