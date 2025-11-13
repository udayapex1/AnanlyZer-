export const analyzeWithAI = async (code) => {
    const prompt = `
Analyze the following code strictly in the format below:

${code}

Respond using EXACTLY this structure:

ALGORITHM NAME: Name of the algorithm used or matched, or "Not recognized"

TIME COMPLEXITY: O(...) followed by a brief explanation

SPACE COMPLEXITY: O(...) followed by a brief explanation

OPTIMIZATION SUGGESTIONS:
- Suggestion 1
- Suggestion 2
- Suggestion 3

COMPANIES: Google, Amazon, Microsoft, Meta, Apple

Use ONLY the above format. Do not include any intro or conclusion. No extra commentary.
`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://your-website-url.com", // Optional
                "X-Title": "Linux Command AI Assistant" // Optional
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();
        console.log("data");

        if (data.error) {
            console.error("API error:", data.error);
            return {
                code,
                analysis: {
                    algorithmName: "Error: API failed",
                    timeComplexity: "Error: API failed",
                    spaceComplexity: "Error: API failed",
                    suggestions: ["Failed to analyze due to API error"],
                    companies: ["Unable to determine companies"],
                    error: data.error.message
                }
            };
        }

        const text = data.choices?.[0]?.message?.content || "";

        const parseSection = (text, section) => {
            const regex = new RegExp(`${section}:(.+?)(?=\\n[A-Z ]+:|$)`, 's');
            const match = text.match(regex);
            return match ? match[1].trim().replace(/\*\*/g, '') : null;
        };

        const algorithmName = parseSection(text, "ALGORITHM NAME") || "Not recognized";
        let timeComplexity = parseSection(text, "TIME COMPLEXITY") || "Not determined";
        let spaceComplexity = parseSection(text, "SPACE COMPLEXITY") || "Not determined";
        const companiesText = parseSection(text, "COMPANIES") || "Google, Amazon, Microsoft, Meta, Apple";

        timeComplexity = timeComplexity.match(/O\(.+?\)/)?.[0] || timeComplexity;
        spaceComplexity = spaceComplexity.match(/O\(.+?\)/)?.[0] || spaceComplexity;

        let suggestions = [];
        const suggestionsText = parseSection(text, "OPTIMIZATION SUGGESTIONS");
        if (suggestionsText) {
            suggestions = suggestionsText
                .split(/\n-|\n•|\n\d+\./)
                .map(s => s.trim())
                .filter(s => s.length > 0);
        }

        const companies = companiesText
            .split(/,\s*/)
            .map(company => company.trim())
            .filter(company => company.length > 0);

        return {
            analysis: {
                algorithmName,
                timeComplexity,
                spaceComplexity,
                suggestions: suggestions.length > 0 ? suggestions : ["No specific suggestions provided"],
                companies: companies.length > 0 ? companies : ["No specific companies identified"]
            }
        };

    } catch (error) {
        console.error("Network error:", error);
        return {
            code,
            analysis: {
                algorithmName: "Network error",
                timeComplexity: "Network error",
                spaceComplexity: "Network error",
                suggestions: ["Service unavailable"],
                companies: ["Service unavailable"],
                error: error.message
            }
        };
    }
};
