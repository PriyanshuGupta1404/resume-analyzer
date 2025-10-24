import React, { useState } from "react";
import { Sparkles } from "lucide-react"; // Using lucide-react for a nice icon

// --- Sample Resume (for "Try Sample" button) ---
const sampleResume = `John Doe - Senior Full Stack Developer

Summary:
Experienced Full Stack Developer with over 8 years of experience in building scalable web applications. Proficient in JavaScript, React, Node.js, and Python. Proven ability to lead projects from conception to deployment on AWS. Passionate about clean code and agile methodologies.

Experience:
Lead Developer, Tech Solutions Inc. (2018 - Present)
- Led a team of 5 developers in an agile environment using Jira and Scrum.
- Architected and developed a microservices-based e-commerce platform using React, Node.js, and Docker.
- Managed database design and implementation with PostgreSQL and MongoDB.
- Implemented CI/CD pipelines on AWS, reducing deployment time by 40%.

Skills:
- Languages: JavaScript, TypeScript, Python, SQL
- Frontend: React, Redux, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, Django
- Databases: PostgreSQL, MongoDB, Redis
- DevOps: AWS, Docker, Kubernetes, Git, CI/CD
- Project Management: Agile, Scrum, Jira`;

// --- Main App Component ---
export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // --- Gemini API Call Helper ---
  const getGeminiAnalysis = async (text) => {
    const apiKey = ""; // API key will be injected by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemPrompt =
      "You are an expert career coach and professional resume reviewer. Analyze the provided resume text and return a JSON object. Your analysis must be constructive, positive, and actionable.";

    const userQuery = `Analyze the following resume text:
---
${text}
---
Please provide:
1.  A concise professional summary based on the resume.
2.  A list of the candidate's key strengths.
3.  A list of 3-5 specific, actionable recommendations for improvement.
4.  A list of 3-5 job titles that would be a good fit for this candidate.
`;

    // Define the JSON schema for the expected response
    const schema = {
      type: "OBJECT",
      properties: {
        summary: {
          type: "STRING",
          description: "A concise professional summary.",
        },
        strengths: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of key strengths.",
        },
        recommendations: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of actionable recommendations.",
        },
        jobFits: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of suitable job titles.",
        },
      },
      required: ["summary", "strengths", "recommendations", "jobFits"],
    };

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.5,
      },
    };

    // Retry logic with exponential backoff
    let response;
    let retries = 3;
    let delay = 1000;
    while (retries > 0) {
      try {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          const candidate = result.candidates?.[0];
          if (candidate && candidate.content?.parts?.[0]?.text) {
            // Successfully parsed the JSON text
            return JSON.parse(candidate.content.parts[0].text);
          } else {
            throw new Error("Invalid response structure from API.");
          }
        } else if (response.status === 429 || response.status >= 500) {
          // Retry on rate limiting or server errors
          retries--;
          if (retries === 0) {
            throw new Error(
              `API request failed after retries with status: ${response.status}`
            );
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          // Don't retry on bad requests (e.g., 400)
          throw new Error(`API request failed with status: ${response.status}`);
        }
      } catch (err) {
        retries--;
        if (retries === 0) {
          console.error("API call failed:", err);
          throw new Error(
            `An error occurred while fetching the analysis: ${err.message}`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const result = await getGeminiAnalysis(resumeText);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(
        err.message ||
          "An error occurred while analyzing the resume. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Functions ---

  // Helper component for list sections
  const AnalysisSection = ({ title, items }) => (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-3">{title}</h3>
      <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
        {items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>
        ))}
      </ul>
    </div>
  );

  const renderResults = () => {
    if (!analysisResult) {
      return null;
    }

    const { summary, strengths, recommendations, jobFits } = analysisResult;

    return (
      <div className="space-y-8">
        {/* Overview */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Analysis Overview
          </h2>
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Professional Summary
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{summary}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
            <AnalysisSection title="Key Strengths" items={strengths} />
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
            <AnalysisSection title="Suitable Job Roles" items={jobFits} />
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Actionable Recommendations
          </h2>
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
            <AnalysisSection title="" items={recommendations} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-sky-500" />
            AI Resume Analyzer
          </h1>
          <p className="text-slate-600 mt-3 text-lg">
            Paste your resume text below for an AI-powered analysis.
          </p>
        </header>

        <main>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="resume-text"
                className="block text-sm font-medium text-slate-700"
              >
                Paste Resume Content
              </label>
              <button
                onClick={() => {
                  setResumeText(sampleResume);
                  setError(null);
                  setAnalysisResult(null);
                }}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
              >
                Try Sample
              </button>
            </div>
            <textarea
              id="resume-text"
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                if (error) setError(null);
              }}
              rows="12"
              className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 resize-y ${
                error ? "border-rose-400" : "border-slate-300"
              }`}
              placeholder="Paste the full text of a resume here..."
            ></textarea>
            {error && (
              <p className="text-rose-600 text-sm mt-2">
                <strong>Error:</strong> {error}
              </p>
            )}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="mt-4 w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>

          <div className="mt-10">
            {isLoading && (
              <div className="text-center p-8 flex flex-col items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-sky-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-lg font-semibold text-slate-600 mt-4">
                  AI is analyzing the resume...
                </p>
              </div>
            )}

            {!isLoading && renderResults()}
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} AI Resume Analyzer. Powered by
            Gemini.
          </p>
        </footer>
      </div>
    </div>
  );
}
