import { Router } from "express";
import { questions as questionsFromFile } from "../utils/db.js";

let questionsData = [...questionsFromFile];
const questionRouter = Router();

//เพิ่มคำถามเข้าไป

questionRouter.post("/", (req, res) => {
  try {
    let questionsFronClient = req.body;

    if (!req.body.title) {
      return res.status(400).json({
        message: "Title not found, please give title to create question",
      });
    }

    if (!req.body.description) {
      return res.status(400).json({
        message:
          "Description not found, please give description to create question",
      });
    }

    questionsData.push({
      id: questionsData[questionsData.length - 1].id + 1,
      ...questionsFronClient,
    });
    return res.json({ message: "Question has been added successfully" });
  } catch (error) {
    console.error("Error adding question:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//ดูคำถามทั้งหมด

questionRouter.get("/", (req, res) => {
  try {
    if (req.query.limit > 10) {
      return res.json({
        message: "Invalid request,limit not exceeds 10 questions",
      });
    }

    const questionResult = questionsData.slice(0, req.query.limit);

    return res.json({ data: questionResult });
  } catch (error) {
    console.error("Error searching question:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//ดูคำถามแต่ละข้อ

questionRouter.get("/:questionId", (req, res) => {
  try {
    let questionsFronClient = Number(req.params.questionId);
    const getQuestionId = questionsData.filter(
      (item) => item.id === questionsFronClient
    );

    return res.json({ data: getQuestionId[0] });
  } catch (error) {
    console.error("Error searching question:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//แก้ไขคำถาม

questionRouter.put("/:questionId", (req, res) => {
  try {
    let questionsFronClient = Number(req.params.questionId);
    const updateQuestionData = {
      ...req.body,
    };

    const hasFound = questionsData.find((item) => {
      return item.id === questionsFronClient;
    });

    if (!hasFound) {
      return res.status(404).json({ message: "No question to update" });
    }

    const questionIndex = questionsData.findIndex((item) => {
      return item.id === questionsFronClient;
    });

    questionsData[questionIndex] = {
      id: questionsFronClient,
      ...updateQuestionData,
    };

    if (!req.body.title) {
      return res.status(400).json({
        message: "Title not found, please give title to update question",
      });
    }

    if (!req.body.description) {
      return res.status(400).json({
        message:
          "Description not found, please give description to update question",
      });
    }

    return res.json({ message: "Question has been updated successfully" });
  } catch (error) {
    console.error("Error updating question:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//ลบคำถาม

questionRouter.delete("/:questionId", (req, res) => {
  try {
    let questionsFronClient = Number(req.params.questionId);
    const newQuestion = questionsData.filter((item) => {
      return item.id !== questionsFronClient;
    });

    questionsData = newQuestion;

    return res.json({ message: "Question has been deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default questionRouter;
