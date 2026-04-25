import eiQuestions from "./eiQuestions.js";

const BRANCHES = [
  "Perceiving Emotions",
  "Using Emotions to Facilitate Thinking",
  "Understanding Emotions",
  "Managing Emotions"
];

const visualTypes = [...new Set(eiQuestions.map((question) => question.visualType))];

export { BRANCHES, visualTypes };
export default eiQuestions;
