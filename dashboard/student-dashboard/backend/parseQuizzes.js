const fs = require('fs');
const path = require('path');

// Function to parse a Markdown file and extract questions
function parseMarkdown(filePath, skill) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const questions = [];
  let currentQuestion = null;

  lines.forEach((line) => {
    // Check if the line is a question
    if (line.startsWith('#### Q')) {
      if (currentQuestion) questions.push(currentQuestion); // Save the previous question
      currentQuestion = {
        skill: skill, // Add the skill field
        question: line.replace('#### ', '').trim(),
        options: [],
        correctAnswer: '',
        explanation: '',
      };
    }
    // Check if the line is an option
    else if (line.startsWith('- [ ]') && currentQuestion) {
      currentQuestion.options.push(line.replace('- [ ] ', '').trim());
    }
    // Check if the line is a correct answer
    else if (line.startsWith('- [x]') && currentQuestion) {
      const correctAnswer = line.replace('- [x] ', '').trim();
      currentQuestion.correctAnswer = correctAnswer;
      currentQuestion.options.push(correctAnswer);
    }
    // Check if the line is an explanation
    else if (line.startsWith('**Explanation:**') && currentQuestion) {
      currentQuestion.explanation = line.replace('**Explanation:**', '').trim();
    }
  });

  // Save the last question if it exists
  if (currentQuestion) questions.push(currentQuestion);
  return questions;
}

// Function to process all Markdown files in the repository
function processQuizzes() {
  const quizzes = {};
  const skillsFolders = fs.readdirSync('.').filter((folder) => fs.statSync(folder).isDirectory());

  skillsFolders.forEach((skill) => {
    const skillFolderPath = path.join('.', skill);
    const markdownFiles = fs.readdirSync(skillFolderPath).filter((file) => file.endsWith('.md'));

    // Filter out non-English quizzes
    const englishQuizzes = markdownFiles.filter((file) => {
      const languageSuffix = file.split('-').pop().replace('.md', '');
      return languageSuffix === 'quiz'; // Only include files like 'python-quiz.md'
    });

    quizzes[skill] = [];
    englishQuizzes.forEach((file) => {
      const filePath = path.join(skillFolderPath, file);
      const questions = parseMarkdown(filePath, skill); // Pass the skill to the parser
      quizzes[skill].push(...questions);
    });
  });

  // Save the quizzes as a JSON file
  fs.writeFileSync('quizzes.json', JSON.stringify(quizzes, null, 2));
  console.log('Quizzes have been parsed and saved to quizzes.json');
}

// Run the script
processQuizzes();
