const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (window as any).__GEMINI_API_KEY__;
      
      const prompt = `Generate social media captions for Malaysian importers and exporters on the topic: "${params.topic}". 
      Tone/Style: ${params.tone || 'Professional & Engaging'}. 
      Target audience: ${params.audience || 'Malaysian Importers & Exporters'}.
      Return the response in structured JSON format containing 3 platforms: instagramTikTok, linkedIn, and facebook. Each platform object must include hook, body, callToAction, and hashtags array.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const result = await response.json();
      const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const data = JSON.parse(textContent || '{}');

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
        showNotification("Generated fresh captions via Gemini AI!");
      }
    } catch (err: any) {
      console.error("Failed to generate:", err);
      showNotification("Failed to generate captions. Check API key configuration.");
    } finally {
      setIsGenerating(false);
    }
  };
