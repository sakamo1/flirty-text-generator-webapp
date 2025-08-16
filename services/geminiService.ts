import { GoogleGenAI, Type } from "@google/genai";
import { FlirtyTextResponse, ConversationCoachResponse, ChatReviewResponse, ProfileAnalysisResponse, DateIdeaResponse } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const flirtyTextSchema = {
    type: Type.OBJECT,
    properties: {
        messages: {
            type: Type.ARRAY,
            description: "An array of 5 unique, short, and creative flirty text messages.",
            items: {
                type: Type.STRING,
                description: "A single flirty text message.",
            },
        },
    },
    required: ["messages"],
};

const inspirationTextSchema = {
    type: Type.OBJECT,
    properties: {
        messages: {
            type: Type.ARRAY,
            description: "An array of 5 new, unique, and creative flirty text messages for the specified category. Do not repeat any of the examples provided.",
            items: {
                type: Type.STRING,
                description: "A single flirty text message.",
            },
        },
    },
    required: ["messages"],
}

const conversationCoachSchema = {
    type: Type.OBJECT,
    properties: {
        replies: {
            type: Type.ARRAY,
            description: "An array of 3 unique and creative replies to the conversation.",
            items: {
                type: Type.OBJECT,
                properties: {
                    reply: {
                        type: Type.STRING,
                        description: "The suggested flirty reply.",
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief explanation of why this reply is effective (e.g., 'This is playful and shows you're confident').",
                    },
                },
                required: ["reply", "explanation"],
            },
        },
    },
    required: ["replies"],
};

const chatReviewSchema = {
    type: Type.OBJECT,
    properties: {
        overallFeedback: {
            type: Type.STRING,
            description: "Overall feedback on the user's conversation style, tone, and strategy. Be constructive and encouraging."
        },
        critiques: {
            type: Type.ARRAY,
            description: "An array of critiques for specific messages sent by the user.",
            items: {
                type: Type.OBJECT,
                properties: {
                    originalMessage: {
                        type: Type.STRING,
                        description: "The verbatim text of the user's message that is being critiqued."
                    },
                    critique: {
                        type: Type.STRING,
                        description: "A concise critique explaining what could be improved in this specific message (e.g., 'A bit too passive', 'Could be more playful')."
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "A better, alternative message the user could have sent instead."
                    }
                },
                required: ["originalMessage", "critique", "suggestion"]
            }
        }
    },
    required: ["overallFeedback", "critiques"]
};

const profileAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallFeedback: {
            type: Type.STRING,
            description: "A summary of the dating profile's strengths and weaknesses. Offer actionable advice for improvement. The tone should be encouraging and constructive."
        },
        photoAnalysis: {
            type: Type.ARRAY,
            description: "An array of critiques for each of the user's photos. Provide one critique object per photo analyzed.",
            items: {
                type: Type.OBJECT,
                properties: {
                    photoDescription: {
                        type: Type.STRING,
                        description: "A brief, one-sentence description of the photo being critiqued (e.g., 'The photo of you hiking with a dog')."
                    },
                    critique: {
                        type: Type.STRING,
                        description: "A concise critique explaining what works or doesn't work in this photo (e.g., 'Good quality and shows an interest, but the lighting is dark')."
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "A concrete suggestion for improving or replacing the photo (e.g., 'Try a similar shot during the day or use a photo with friends to show you're social')."
                    }
                },
                required: ["photoDescription", "critique", "suggestion"]
            }
        },
        bioAnalysis: {
            type: Type.OBJECT,
            description: "A critique of the user's bio.",
            properties: {
                critique: {
                    type: Type.STRING,
                    description: "A concise critique of the bio (e.g., 'It's a bit generic and uses clichés')."
                },
                suggestion: {
                    type: Type.STRING,
                    description: "A rewritten, more engaging and charming bio that the user could use instead."
                }
            },
            required: ["critique", "suggestion"]
        }
    },
    required: ["overallFeedback", "photoAnalysis", "bioAnalysis"]
};

const dateIdeaSchema = {
    type: Type.OBJECT,
    properties: {
        ideas: {
            type: Type.ARRAY,
            description: "An array of 3 unique and creative date ideas that match the user's criteria.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "A short, catchy title for the date idea.",
                    },
                    description: {
                        type: Type.STRING,
                        description: "A one or two sentence description of the date idea, explaining what it is and why it's fun.",
                    },
                    emoji: {
                        type: Type.STRING,
                        description: "A single emoji that represents the date idea.",
                    },
                },
                required: ["title", "description", "emoji"],
            },
        },
    },
    required: ["ideas"],
};


export const generateFlirtyTexts = async (recipient: string, vibe: string, context: string): Promise<string[]> => {
    const prompt = `
        You are a witty and charming expert in writing flirty text messages.
        Generate 5 unique, short, and engaging flirty text messages.

        The message is for: ${recipient}
        The desired vibe is: ${vibe}
        ${context ? `Optional context: ${context}` : ''}

        The messages should be creative and not cheesy unless the vibe is cheesy.
        Do not include any conversational filler or introductory text in your response.
        Strictly adhere to the JSON schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flirtyTextSchema,
                temperature: 0.9,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: FlirtyTextResponse = JSON.parse(jsonText);

        if (parsedResponse && Array.isArray(parsedResponse.messages)) {
            return parsedResponse.messages;
        } else {
            throw new Error("Invalid response format from AI.");
        }
    } catch (error) {
        console.error("Error generating flirty texts:", error);
        throw new Error("Failed to generate messages. The AI might be feeling shy!");
    }
};


export const generateInspirationTexts = async (category: string, existingTexts: string[]): Promise<string[]> => {
    const prompt = `
        You are an expert in writing creative, flirty text messages.
        Generate 5 new, unique text messages for the category: "${category}".

        IMPORTANT: Do not repeat any of the following messages that the user has already seen:
        ${existingTexts.map(t => `- ${t}`).join('\n')}

        The messages should be creative, engaging, and fit the category well.
        Strictly adhere to the JSON schema. Do not include any conversational filler.
    `;

     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: inspirationTextSchema,
                temperature: 0.95,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: FlirtyTextResponse = JSON.parse(jsonText);

        if (parsedResponse && Array.isArray(parsedResponse.messages)) {
            return parsedResponse.messages;
        } else {
            throw new Error("Invalid response format from AI.");
        }
    } catch (error) {
        console.error("Error generating inspiration texts:", error);
        throw new Error("Failed to generate new inspiration. The AI needs a coffee!");
    }
}


export const generateConversationReplies = async (lastMessage: string, conversationHistory: string): Promise<ConversationCoachResponse> => {
    const prompt = `
        You are an expert dating and conversation coach.
        A user needs a reply to a message they just received.

        This was the last message they received:
        "${lastMessage}"

        Here is the recent conversation history for context (if provided):
        ---
        ${conversationHistory || "No history provided."}
        ---

        Your task is to generate 3 unique, clever, and context-aware replies for the user to send.
        For each reply, provide a short explanation for why it's a good response.
        The replies should be engaging, show personality, and be appropriately flirty.
        Strictly adhere to the JSON schema. Do not include any extra text or conversational filler.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: conversationCoachSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: ConversationCoachResponse = JSON.parse(jsonText);

         if (parsedResponse && Array.isArray(parsedResponse.replies)) {
            return parsedResponse;
        } else {
            throw new Error("Invalid response format from AI coach.");
        }

    } catch(error) {
        console.error("Error generating conversation replies:", error);
        throw new Error("Failed to get coach's advice. The AI might be on a date!");
    }
};

export const analyzeConversationScreenshot = async (
    imageFile: File,
    userIdentifier: string
): Promise<ChatReviewResponse> => {
    const imagePart = await fileToGenerativePart(imageFile);

    const textPart = {
        text: `
        You are an expert dating and conversation coach.
        Analyze the conversation in the provided screenshot. The user who submitted this screenshot has identified their messages as "${userIdentifier}".

        Your task is to:
        1. Identify the user's messages based on their description.
        2. For each of the user's messages, provide a constructive critique and a better, more charming alternative they could have sent.
        3. Provide overall feedback on their performance in the conversation.
        4. Be encouraging but honest. The goal is to help them improve.

        Strictly adhere to the JSON schema. Do not include any extra text, markdown, or conversational filler in your response.
    `};

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: chatReviewSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: ChatReviewResponse = JSON.parse(jsonText);

        if (parsedResponse && parsedResponse.critiques) {
            return parsedResponse;
        } else {
            throw new Error("Invalid response format from AI coach.");
        }

    } catch(error) {
        console.error("Error analyzing conversation screenshot:", error);
        throw new Error("Failed to review the chat. The AI might be busy analyzing its own texts!");
    }
};

export const generateProfileAnalysis = async (
    imageFiles: File[],
    bio: string,
    goals: string
): Promise<ProfileAnalysisResponse> => {
    const imageParts = await Promise.all(imageFiles.map(fileToGenerativePart));

    const textPart = {
        text: `
        You are an expert dating profile coach.
        Analyze the user's dating profile based on the provided screenshots, bio, and dating goals.

        The user's dating goals are: "${goals}"
        The user's profile bio is: "${bio || "The user did not provide a bio."}"

        Your task is to:
        1.  Analyze the provided images. Give feedback on each one. Good photos show personality, are high-quality, and show the person clearly. Bad photos are blurry, are all group shots, or don't show the person's face.
        2.  Analyze the provided bio. A good bio is concise, shows personality, and gives a potential match something to talk about.
        3.  Provide overall feedback on the profile.
        4.  The tone should be encouraging, constructive, and helpful. The user wants to improve their dating life.

        Strictly adhere to the JSON schema. Do not include any extra text, markdown, or conversational filler in your response.
    `};

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [...imageParts, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: profileAnalysisSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: ProfileAnalysisResponse = JSON.parse(jsonText);

        if (parsedResponse && parsedResponse.overallFeedback && parsedResponse.photoAnalysis && parsedResponse.bioAnalysis) {
            return parsedResponse;
        } else {
            throw new Error("Invalid response format from AI coach.");
        }

    } catch(error) {
        console.error("Error generating profile analysis:", error);
        throw new Error("Failed to analyze the profile. The AI coach is currently swiping right on other tasks.");
    }
};

export const generateDateIdeas = async (vibe: string, budget: string, interests: string): Promise<DateIdeaResponse> => {
    const prompt = `
        You are a creative and experienced date planner.
        Generate 3 unique and engaging date ideas based on the following criteria.

        The desired vibe is: ${vibe}
        The budget is: ${budget}
        ${interests ? `Optional shared interests: ${interests}` : ''}

        The ideas should be creative and thoughtful.
        Do not include any conversational filler or introductory text in your response.
        Strictly adhere to the JSON schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dateIdeaSchema,
                temperature: 0.9,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: DateIdeaResponse = JSON.parse(jsonText);

        if (parsedResponse && Array.isArray(parsedResponse.ideas)) {
            return parsedResponse;
        } else {
            throw new Error("Invalid response format from AI.");
        }
    } catch (error) {
        console.error("Error generating date ideas:", error);
        throw new Error("Failed to generate ideas. The AI is fresh out of inspiration!");
    }
};
