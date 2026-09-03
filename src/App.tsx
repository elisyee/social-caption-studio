const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    try {
      // Import the Google Gen AI SDK client-side
      const { GoogleGenAI, Type, Schema } = await import("@google/genai");
      
      // Initialize using the environment variable injected by GitHub Actions
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || (window as any).__GEMINI_API_KEY__ });

      const prompt = `Generate social media captions for Malaysian importers and exporters on the topic: "${params.topic}". 
      Tone/Style: ${params.tone || 'Professional & Engaging'}. 
      Target audience: ${params.audience || 'Malaysian Importers & Exporters'}.
      Return the response in structured JSON format containing 3 platforms: instagramTikTok, linkedIn, and facebook. Each platform object must include hook, body, callToAction, and hashtags array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');

      if (data) {
        setCaptions({
          instagramTikTok: {
            ...INITIAL_CAPTIONS.instagramTikTok,
            ...data.instagramTikTok,
          },
          linkedIn: {
            ...INITIAL_CAPTIONS.linkedIn,
            ...data.linkedIn,
          },
          facebook: {
            ...INITIAL_CAPTIONS.facebook,
            ...data.facebook,
          },
        });
        setCurrentTopic(params.topic);
        showNotification("Generated fresh captions via Gemini AI directly!");
      }
    } catch (err: any) {
      console.error("Failed to generate:", err);
      showNotification("Failed to generate captions. Check API key configuration.");
    } finally {
      setIsGenerating(false);
    }
  };
