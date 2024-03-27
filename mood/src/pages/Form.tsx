import React from "react";
import YesNoQ from "../components/YesNoQ";
import TextQ from "../components/TextQ";
import TenQ from "../components/TenQ";

interface Item {
  question: string;
  type: string;
  id: number;
}

const Form = () => {
  // NOTE: hard coding these questions for now, not sure where i should put them. could
  // store in database and retrieve here - figure out later
  const questions: Item[] = [
    { question: "How did you feel overall today", type: "ten", id: 9 },
    { question: "Hours of sleep", type: "text", id: 1 },
    { question: "Disrupted Sleep", type: "yesNo", id: 2 },
    {
      question: "Amount of intentional exercise and type",
      type: "text",
      id: 3,
    },
    {
      question: "Spent at least 1 hour outside the house",
      type: "yesNo",
      id: 4,
    },
    { question: "Meditated atleast 5 minutes", type: "yesNo", id: 5 },
    {
      question: "Did at least 1 thing outside of routine",
      type: "yesNo",
      id: 6,
    },
    { question: "Had a meaningful social interaction", type: "yesNo", id: 7 },
    { question: "Estimate of time spent ruminating", type: "text", id: 8 },
    {
      question: "Drank more than 3 drinks the day before",
      type: "yesNo",
      id: 10,
    },
  ];

  return (
    <>
      <div className="survey-box">
        <h2>Form Questions</h2>
        {questions.map((item) => {
          if (item.type === "yesNo") {
            return <YesNoQ question={item.question} key={item.id} />;
          } else if (item.type === "text") {
            return <TextQ question={item.question} key={item.id} />;
          } else if (item.type === "ten") {
            return <TenQ question={item.question} key={item.id} />;
          }
        })}
      </div>
      <button className="form-submit">Submit</button>
    </>
  );
};

export default Form;

/* 

left to complete:
- submit functionality to retrieve all the data input (just in a console.log for now)

*/
