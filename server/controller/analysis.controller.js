import { Analysis } from "../models/analysis.models.js";
import { analyzeWithAI } from "../utils/openAi.js";

export const analyzeCode = async (req, res) => {

    let code = null;

    // Try all possible key variations that might contain the code
    if (req.body.code) {
        code = req.body.code;
    } else if (req.body['code ']) {
        code = req.body['code '];
    } else {
        // If nothing else works, look through all keys for possible matches
        for (const key in req.body) {
            if (key.trim() === 'code' || key.startsWith('code')) {
                code = req.body[key];
                console.log(`Found code in key: "${key}"`);
                break;
            }
        }
    }
    // let language = req.body.language;
    // const { code, language } = req.body;


    try {
        const result = await analyzeWithAI(code);
        const analysisText = result?.candidates?.[0]?.content?.parts?.[0]?.text;



        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'AI Analysis failed', details: error.message });
    }
};

<<<<<<< HEAD

=======
>>>>>>> cfea46c463020d901f1eec2eb0dc072befe8ef40

export const saveAnalysis = async (req, res) => {
    try {
        // Debug: Log the complete incoming request
        console.log("Incoming request body:", JSON.stringify(req.body, null, 2));

        let code = null;

        // Code extraction logic (keep your existing code)
        if (req.body.code) {
            code = req.body.code;
        } else if (req.body['code ']) {
            code = req.body['code '];
        } else {
            for (const key in req.body) {
                if (key.trim() === 'code' || key.startsWith('code')) {
                    code = req.body[key];
                    break;
                }
            }
        }

        // Validate all required fields exist
        if (!code || !req.body.language || !req.body.analysis) {
            return res.status(400).json({
                error: "Missing required fields",
                missing: {
                    code: !code,
                    language: !req.body.language,
                    analysis: !req.body.analysis
                }
            });
        }

        // Validate analysis sub-fields
        if (!req.body.analysis.timeComplexity || !req.body.analysis.spaceComplexity) {
            return res.status(400).json({
                error: "Analysis missing required fields",
                missing: {
                    timeComplexity: !req.body.analysis.timeComplexity,
                    spaceComplexity: !req.body.analysis.spaceComplexity
                },
                receivedAnalysisFields: Object.keys(req.body.analysis)
            });
        }

        const newAnalysis = await Analysis.create({
            userId: req.user.id,
            code,
            language: req.body.language,
            analysis: {
                timeComplexity: req.body.analysis.timeComplexity,
                spaceComplexity: req.body.analysis.spaceComplexity,
                suggestions: req.body.analysis.suggestions || [],
                motivationalQuote: req.body.analysis.motivationalQuote || ""
            }
        });

        return res.status(201).json({
            message: "Analysis saved successfully",
            data: newAnalysis
        });

    } catch (error) {
        console.error("Save error:", error);

        // Enhanced error handling
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
            return res.status(422).json({
                error: "Validation failed",
                details: errors,
                receivedData: req.body
            });
        }

        return res.status(500).json({
            error: "Internal server error",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
