
import { GoogleGenAI, Type } from "@google/genai";
import { Announcement, GroundingSource } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async fetchLatestNotices(portalName: string, portalUrl: string): Promise<{ announcements: Announcement[], sources: GroundingSource[] }> {
    try {
      const prompt = `주어진 창업 지원 포털 사이트 [${portalName}] (${portalUrl}) 의 최신 공지사항 목록을 확인해줘. 
      오늘 날짜 기준으로 가장 최신의 공지사항 제목, 날짜, 상세 페이지 링크를 찾아줘. 
      반드시 JSON 형식의 배열로 응답해주고, 각 객체는 title, date, link 속성을 가져야 해.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                date: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["title", "date", "link"]
            }
          }
        },
      });

      const jsonStr = response.text || "[]";
      const announcements: Announcement[] = JSON.parse(jsonStr);
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: GroundingSource[] = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || '참조 사이트',
          uri: chunk.web?.uri || ''
        }));

      return { announcements, sources };
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return { announcements: [], sources: [] };
    }
  }

  async fetchGlobalTop10(): Promise<Announcement[]> {
    try {
      const prompt = `전북 지역 및 전국의 창업 지원 기관들(K-Startup, 소상공인24, 전북테크노파크 등)에서 공고된 가장 최신 지원사업 10개를 찾아줘. 
      결과는 최신순으로 정렬된 JSON 배열이어야 하며, 각 객체는 title(사업명), date(공고일), link(상세페이지 URL), summary(기관명 포함 짧은 설명) 속성을 가져야 함.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                date: { type: Type.STRING },
                link: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ["title", "date", "link", "summary"]
            }
          }
        },
      });

      const jsonStr = response.text || "[]";
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error fetching global top 10:", error);
      return [];
    }
  }

  async summarizeAnnouncement(title: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `"${title}" 라는 제목의 창업 지원 사업 공지사항이 무엇인지 요약해주고, 지원 대상과 주요 혜택을 알려줘.`,
      });
      return response.text || "요약 정보를 가져올 수 없습니다.";
    } catch (error) {
      return "요약 요청 중 오류가 발생했습니다.";
    }
  }
}
