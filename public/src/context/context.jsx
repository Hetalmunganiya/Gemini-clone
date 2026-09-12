import {createContext, useState, useEffect} from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [history, setHistory] = useState({});

    useEffect(() => {
        const savedPrompts = JSON.parse(localStorage.getItem("gemini_prompts")) || [];
        const savedHistory = JSON.parse(localStorage.getItem("gemini_history")) || {};
        const savedPrompt = localStorage.getItem("gemini_recentPrompt") || "";
        const savedResult = localStorage.getItem("gemini_resultData") || "";
        const savedShowResult = localStorage.getItem("gemini_showResult") === "true";

        setPrevPrompts(savedPrompts);
        setHistory(savedHistory);
        setRecentPrompt(savedPrompt);
        setResultData(savedResult);
        setShowResult(savedShowResult);
    }, []);

    useEffect(() => {
        localStorage.setItem("gemini_prompts", JSON.stringify(prevPrompts));
        localStorage.setItem("gemini_history", JSON.stringify(history));
    }, [prevPrompts, history]);

    useEffect(() => {
        localStorage.setItem("gemini_recentPrompt", recentPrompt);
        localStorage.setItem("gemini_resultData", resultData);
        localStorage.setItem("gemini_showResult", showResult);
    }, [recentPrompt, resultData, showResult]);


    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord)
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

    const finalPrompt = prompt !== undefined ? prompt : input;
    if (!prevPrompts.includes(finalPrompt)) {
      setPrevPrompts((prev) => [...prev, finalPrompt]);
    }
    setRecentPrompt(finalPrompt);

    const response = await runChat(finalPrompt);

    setHistory((prev) => ({ ...prev, [finalPrompt]: response }));

    let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 =newResponse.split("*").join("</br>") //for next line
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length;i++) //for typing effect
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }


    setLoading(false);
    setInput("");
  };

  const onSelectHistory = (prompt) => {
    if (history[prompt]) {
      setRecentPrompt(prompt);
      setResultData(history[prompt]);
      setShowResult(true);
    } else {
      onSent(prompt);
    }
  };

  const deletePrompt = (index) => {
    const updated = [...prevPrompts];
    const promptToDelete = updated[index];
    updated.splice(index, 1);
    setPrevPrompts(updated);

    const newHistory = { ...history };
    delete newHistory[promptToDelete];
    setHistory(newHistory);
  };

  const clearAllPrompts = () => {
    setPrevPrompts([]);
    setHistory({});
    localStorage.removeItem("gemini_prompts");
    localStorage.removeItem("gemini_history");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    onSelectHistory,
    deletePrompt,
    clearAllPrompts,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;