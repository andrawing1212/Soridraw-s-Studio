import { GoogleGenAI, Type } from "@google/genai";
import { BASE_PROMPTS, MANDATORY_PROMPT_SUFFIX, GENRES, MOODS, THEMES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SongGenerationResult {
  englishTitle: string;
  koreanTitle: string;
  genres: string[];
  englishLyrics: string;
  koreanLyrics: string;
  musicPrompt: string;
  appliedGenres: string[];
  appliedMoods: string[];
  appliedThemes: string[];
}

export async function generateSong(
  selectedGenres: string[],
  selectedMoods: string[],
  selectedThemes: string[],
  freeText: string
): Promise<SongGenerationResult> {
  const prompt = `
You are an expert songwriter and music producer. 
A user wants to compose a song based on the following inputs:
- Selected Genres: ${selectedGenres.length > 0 ? selectedGenres.join(", ") : "None (Please select 1-3 randomly from the available genres)"}
- Selected Moods: ${selectedMoods.length > 0 ? selectedMoods.join(", ") : "None (Please select 1-4 randomly from the available moods)"}
- Selected Themes: ${selectedThemes.length > 0 ? selectedThemes.join(", ") : "None (Please select 1-4 randomly from the available themes)"}
- Additional Input: ${freeText || "None"}

Available Genres: ${GENRES.join(", ")}
Available Moods: ${MOODS.join(", ")}
Available Themes: ${THEMES.join(", ")}

Instructions:
1. If any category (Genre, Mood, Theme) is empty, randomly select appropriate ones from the available lists to complement the other selections.
2. Create an English Title and a Korean Title.
3. Determine 1 or 2 main genres that best describe the song.
4. Write English lyrics and Korean lyrics. The lyrics must be structured with sections: [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus], [Outro].
   IMPORTANT: The length of the lyrics MUST be concise and suitable for a song strictly under 3 minutes (around 2 minutes 30 seconds). Do not write too many verses or repeated choruses.
5. Create a music generation prompt. You MUST base it on one of the following base prompts that best fits the mood and theme, or adapt it slightly:
   Base Prompts:
   ${BASE_PROMPTS.map((p, i) => `[${i + 1}] ${p}`).join("\n")}
   
   IMPORTANT: The music prompt MUST end with this exact phrase: "${MANDATORY_PROMPT_SUFFIX}"
6. Return the exact applied genres, moods, and themes (including the ones you randomly selected if the user didn't provide enough).

Return the result as a JSON object matching the provided schema.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          englishTitle: { type: Type.STRING, description: "The English title of the song" },
          koreanTitle: { type: Type.STRING, description: "The Korean title of the song" },
          genres: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "1 or 2 main genres for the title display (e.g., ['Indie R&B'])" 
          },
          englishLyrics: { type: Type.STRING, description: "The English lyrics with section tags" },
          koreanLyrics: { type: Type.STRING, description: "The Korean lyrics with section tags" },
          musicPrompt: { type: Type.STRING, description: "The music generation prompt" },
          appliedGenres: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The genres applied to this song" },
          appliedMoods: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The moods applied to this song" },
          appliedThemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The themes applied to this song" },
        },
        required: ["englishTitle", "koreanTitle", "genres", "englishLyrics", "koreanLyrics", "musicPrompt", "appliedGenres", "appliedMoods", "appliedThemes"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate song");
  }

  return JSON.parse(text) as SongGenerationResult;
}
