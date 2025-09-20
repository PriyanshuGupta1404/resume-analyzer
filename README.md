# AI Resume Analyzer

This project is a sophisticated web application built with React, Vite, and Tailwind CSS that parses resume text, extracts key skills, and provides insightful analytics for career development. It helps users understand the strengths of a resume, predicts suitable job roles, and offers AI-powered recommendations and interview questions.

## ✨ Features

- Interactive UI: A sleek, modern, and fully responsive user interface built with Tailwind CSS.

- Keyword Extraction: Intelligently scans resume text to identify and categorize technical skills across various sectors like Software Development, Data Science, and more.

- Sector Analysis: Visualizes skill distribution with dynamic progress bars, showing the candidate's proficiency in different areas.

- Job Role Prediction: Calculates a match percentage for relevant job profiles based on the identified keywords.

- AI-Powered Insights (Placeholder):

- Automated Summary: Generates a concise, professional summary of the candidate's profile.

- Custom Interview Questions: Creates tailored interview questions based on the skills and experience listed in the resume.

- Actionable Recommendations: Provides concrete suggestions for improving the resume to better align with specific career paths.

- Fast Development Experience: Built with Vite for near-instant server startup and Hot Module Replacement (HMR).

## 🚀 Tech Stack

- Frontend: React.js

- Build Tool: Vite

- Styling: Tailwind CSS

- Icons: Lucide React

## ⚙️ Setup and Installation

Follow these steps to get the project running on your local machine.

1. Clone the repository (or set up the project from scratch):

```
npm create vite@latest resume-analyzer-react -- --template react
```

2. Navigate into the project directory:

```
cd resume-analyzer-react
```

3. Install project dependencies:

```
npm install
```

4. Install Tailwind CSS and its peer dependencies:

```
npm install -D tailwindcss postcss autoprefixer
```

5. Generate Tailwind and PostCSS configuration files:

```
npx tailwindcss init -p
```

Make sure to configure the tailwind.config.js and src/index.css files as per the project setup guide.

6. Install the icon library:

```
npm install lucide-react
```

## ▶️ How to Run

Once the setup is complete, you can start the development server with the following command:

npm run dev

The application will be available at http://localhost:5173 (or the next available port).

## 🔮 Future Enhancements

The current implementation uses placeholder data for the AI-powered features. The next step is to integrate a backend service that communicates with a generative AI API (like Google's Gemini) to provide real-time summaries and interview questions based on the resume content.

## 📬 Contact

- 🔗 GitHub: [@PriyanshuGupta1404](https://github.com/priyanshugupta1404)
- 🧑‍💻 LinkedIn: [@PriyanshuGupta1404](https://linkedin.com/in/priyanshugupta0551)
- 📩 Email: priyanshugupta1404@gmail.com
