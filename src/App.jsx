import React, { useState } from "react";

// --- DATABASE: Keywords and Job Profiles ---
// (This data is kept as it's the core "database" for the app)
const sectorKeywords = {
  "Software Development": [
    "javascript",
    "react",
    "vue",
    "angular",
    "node.js",
    "express",
    "python",
    "django",
    "flask",
    "java",
    "spring",
    "c++",
    "c#",
    ".net",
    "html",
    "css",
    "tailwind",
    "sass",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "nosql",
    "rest",
    "api",
    "graphql",
    "git",
    "github",
    "gitlab",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "ci/cd",
    "devops",
    "microservices",
    "typescript",
    "php",
    "laravel",
    "ruby",
    "rails",
  ],
  "Data Science & Analytics": [
    "python",
    "r",
    "sql",
    "tensorflow",
    "pytorch",
    "keras",
    "scikit-learn",
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn",
    "machine learning",
    "deep learning",
    "nlp",
    "natural language processing",
    "data visualization",
    "statistics",
    "statistical analysis",
    "big data",
    "hadoop",
    "spark",
    "etl",
    "data warehousing",
    "business intelligence",
    "tableau",
    "power bi",
  ],
  "Project Management": [
    "agile",
    "scrum",
    "kanban",
    "lean",
    "pmp",
    "prince2",
    "jira",
    "confluence",
    "trello",
    "asana",
    "project planning",
    "risk management",
    "stakeholder management",
    "budgeting",
    "sdlc",
    "project lifecycle",
    "gantt chart",
  ],
  "UI/UX Design": [
    "figma",
    "sketch",
    "adobe xd",
    "invision",
    "zeplin",
    "user research",
    "wireframing",
    "prototyping",
    "usability testing",
    "user journey",
    "ui design",
    "ux design",
    "design thinking",
    "user interface",
    "user experience",
    "interaction design",
    "design system",
  ],
};

const jobProfiles = {
  "Frontend Developer": {
    keywords: [
      "html",
      "css",
      "javascript",
      "react",
      "angular",
      "vue",
      "tailwind",
      "ui design",
    ],
    weight: 1.5,
  },
  "Backend Developer": {
    keywords: [
      "node.js",
      "python",
      "java",
      "sql",
      "nosql",
      "api",
      "docker",
      "aws",
      "microservices",
    ],
    weight: 1.5,
  },
  "Full Stack Developer": {
    keywords: [
      "react",
      "node.js",
      "sql",
      "api",
      "docker",
      "aws",
      "html",
      "css",
      "javascript",
      "git",
    ],
    weight: 2,
  },
  "Data Scientist": {
    keywords: [
      "python",
      "machine learning",
      "deep learning",
      "pandas",
      "scikit-learn",
      "sql",
      "statistics",
      "data visualization",
    ],
    weight: 1.8,
  },
  "Project Manager": {
    keywords: [
      "agile",
      "scrum",
      "jira",
      "project planning",
      "risk management",
      "stakeholder management",
    ],
    weight: 1.2,
  },
  "UI/UX Designer": {
    keywords: [
      "figma",
      "user research",
      "wireframing",
      "prototyping",
      "ui design",
      "ux design",
    ],
    weight: 1.2,
  },
};

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

  const handleAnalyze = () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    // Use a setTimeout to simulate a "loading" period
    // A new coder might do this to make sure the loading spinner shows
    setTimeout(() => {
      try {
        // 1. Local Keyword & Job Analysis
        const lowerCaseText = resumeText.toLowerCase();
        const foundKeywordsBySector = {};
        let totalKeywordsFound = 0;
        const allFoundKeywords = new Set();
        for (const sector in sectorKeywords) {
          const keywords = sectorKeywords[sector];
          const found = keywords.filter((keyword) => {
            // Simple string matching is easier than regex for a beginner
            return lowerCaseText.includes(keyword.toLowerCase());
          });
          if (found.length > 0) {
            foundKeywordsBySector[sector] = found;
            totalKeywordsFound += found.length;
            found.forEach((kw) => allFoundKeywords.add(kw));
          }
        }

        const jobMatches = [];
        for (const job in jobProfiles) {
          const profile = jobProfiles[job];
          let score = 0;
          profile.keywords.forEach((kw) => {
            if (allFoundKeywords.has(kw)) {
              score += profile.weight;
            }
          });
          const matchPercentage = Math.min(
            100,
            (score / (profile.keywords.length * 1.2)) * 100
          );
          if (matchPercentage > 10) {
            jobMatches.push({ title: job, score: matchPercentage.toFixed(0) });
          }
        }
        jobMatches.sort((a, b) => b.score - a.score);

        const recommendations = [];
        if (jobMatches.length > 0) {
          const topJob = jobProfiles[jobMatches[0].title];
          const missingKeywords = topJob.keywords.filter(
            (kw) => !allFoundKeywords.has(kw)
          );
          if (missingKeywords.length > 0) {
            recommendations.push(
              `To better fit a <strong>${
                jobMatches[0].title
              }</strong> role, consider highlighting skills like: <strong>${missingKeywords
                .slice(0, 2)
                .join(", ")}</strong>.`
            );
          }
        }
        if (!allFoundKeywords.has("git")) {
          recommendations.push(
            "Mentioning version control experience with <strong>Git</strong> is crucial for almost any tech role."
          );
        }
        if (
          foundKeywordsBySector["Software Development"] &&
          !["aws", "gcp", "azure"].some((cloud) => allFoundKeywords.has(cloud))
        ) {
          recommendations.push(
            "Experience with a cloud platform like <strong>AWS, Azure, or GCP</strong> can significantly improve your profile."
          );
        }
        if (recommendations.length === 0) {
          recommendations.push(
            "Your resume shows a strong and diverse skill set. Great work!"
          );
        }

        // 2. Set the results
        setAnalysisResult({
          foundKeywordsBySector,
          totalKeywordsFound,
          jobMatches,
          recommendations,
        });
      } catch (err) {
        console.error("Analysis failed:", err);
        setAnalysisResult({
          error:
            "An error occurred while analyzing the resume. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate 1 second of loading
  };

  // Helper function to render results (kept inside the App component)
  const renderResults = () => {
    if (!analysisResult) {
      return null;
    }

    if (analysisResult.error) {
      return (
        <div className="text-center p-8 bg-white rounded-xl border border-rose-200">
          <h3 className="mt-4 text-xl font-semibold text-slate-800">
            Analysis Failed
          </h3>
          <p className="mt-1 text-slate-500">{analysisResult.error}</p>
        </div>
      );
    }

    const {
      foundKeywordsBySector,
      totalKeywordsFound,
      jobMatches,
      recommendations,
    } = analysisResult;

    const sortedSectors = Object.entries(foundKeywordsBySector).sort(
      ([, a], [, b]) => b.length - a.length
    );

    if (totalKeywordsFound === 0) {
      return (
        <div className="text-center p-8 bg-white rounded-xl border border-slate-200">
          <h3 className="mt-4 text-xl font-semibold text-slate-800">
            No Keywords Found
          </h3>
          <p className="mt-1 text-slate-500">
            We couldn't find any relevant technical keywords. Try pasting a
            different resume or adding more specific skills.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Overview */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Analysis Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Keyword Analysis
              </h3>
              <p className="text-slate-600">
                Found <strong>{totalKeywordsFound}</strong> keywords, with a
                primary focus on{" "}
                <strong>{sortedSectors[0]?.[0] || "N/A"}</strong>.
              </p>
              <div className="pt-2">
                {sortedSectors.map(([sector, keywords]) => (
                  <div key={sector} className="mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      {sector}: {keywords.length} keywords found
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Top Job Roles
              </h3>
              <div className="space-y-4">
                {jobMatches.slice(0, 3).map((match) => (
                  <div key={match.title}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {match.title}
                      </span>
                      <span className="text-sm font-medium text-emerald-600">
                        {match.score}% Match
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full"
                        style={{ width: `${match.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Recommendations
          </h2>
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
            <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
              {recommendations.map((rec, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: rec }}></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Resume Analyzer
          </h1>
          <p className="text-slate-600 mt-3 text-lg">
            Paste your resume text below to get started.
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
                onClick={() => setResumeText(sampleResume)}
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
            {error && <p className="text-rose-600 text-sm mt-2">{error}</p>}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="mt-4 w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>

          <div className="mt-10">
            {/* Instead of a separate "LoadingSkeleton" component,
              a new coder would just put a simple loading message here.
            */}
            {isLoading && (
              <div className="text-center p-8">
                <p className="text-lg font-semibold text-slate-600">
                  Loading...
                </p>
              </div>
            )}

            {/*
              Instead of a separate "AnalysisResults" component,
              we just call a render function or put the JSX inline.
            */}
            {renderResults()}
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Resume Analyzer. Built with React
            & Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  );
}
