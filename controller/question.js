const category = require("../models/category");
const company = require("../models/company");
const location = require("../models/location");
const Question = require("../models/question");
const moment = require("moment-timezone");
const user = require("../models/user");

exports.addQuestion = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { compId, locId, categoryId, title, questions } = req.body;

    const currentDate = moment().format();

    const data = await Question.create({
      // compId,
      // locId,
      categoryId,
      title,
      questions,
      createdBy: userId,
      dateField: currentDate,
    });

    return res.status(200).json({
      error: false,
      message: "Question Created Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, search = "" } = req.body;

    const skip = page * pageSize;

    let searchQuery = {};
    searchQuery.$or = [{ title: { $regex: search, $options: "i" } }];

    const totalCount = await Question.countDocuments({
      ...searchQuery,
      isDelete: 0,
    });

    const questionData = await Question.find({ ...searchQuery, isDelete: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec();

    const newData = await Promise.all(
      questionData.map(async (que) => {
        let findCompany;
        let findLocation;
        let findCategory;
        let findUser;
        if (que?.compId !== "") {
          findCompany = await company.findById(que?.compId);
        }
        if (que?.categoryId !== "") {
          findCategory = await category.findById(que?.categoryId);
        }

        if (que?.locId !== "") {
          findLocation = await location.findById(que?.locId);
        }
        if (que?.locId !== "") {
          findUser = await user.findById(que?.createdBy);
        }

        return {
          ...que,
          compName:
            findCompany && findCompany !== undefined ? findCompany.name : "",
          locName:
            findLocation && findLocation !== undefined
              ? findLocation.locName
              : "",
          categoryName:
            findCategory && findCategory !== undefined ? findCategory.name : "",
          userName: findUser && findUser !== undefined ? findUser.name : "",
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Question fetched Successfully",
      data: newData,
      totalCount,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const currentDate = moment().format();

    const data = await Question.findByIdAndUpdate(
      id,
      { isDelete: 1, deletedBy: userId, dateField: currentDate },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Question deleted Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

// exports.updateQuestion = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const currentDate = moment().format();

//     const data = await Question.findByIdAndUpdate(
//       id,
//       { ...req.body, dateField: currentDate },
//       { new: true }
//     );

//     return res.status(200).json({
//       error: false,
//       message: "Question updated Successfully",
//       data: data,
//     });
//   } catch (error) {
//     return res.status(400).json({ error: true, message: error.message });
//   }
// };

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = moment().format();

    const { targetUserId, newStatus } = req.body;

    let updatedData;


    // 1️⃣ If updating assigned user's status
    if (targetUserId && newStatus) {
      updatedData = await Question.findOneAndUpdate(
        { _id: id, "assignedTo.user": targetUserId },
        {
          $set: {
            "assignedTo.$.status": newStatus,
            "assignedTo.$.statusUpdatedAt": new Date(),
            dateField: currentDate, // you still want to track latest update globally
          },
        },
        { new: true }
      );
    } else {
      // 2️⃣ Normal question update (unchanged logic)
      updatedData = await Question.findByIdAndUpdate(
        id,
        { ...req.body, dateField: currentDate },
        { new: true }
      );
    }

    return res.status(200).json({
      error: false,
      message: "Question updated successfully",
      data: updatedData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, search = "" } = req.body;

    const skip = page * pageSize;

    let searchQuery = {};
    searchQuery.$or = [{ title: { $regex: search, $options: "i" } }];

    const totalCount = await Question.countDocuments({
      ...searchQuery,
      isDelete: 0,
    });

    const questionData = await Question.find({ ...searchQuery, isDelete: 0 })
      .sort({ createdAt: -1 })
      .populate("categoryId createdBy assignedTo")
      .skip(skip)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      error: false,
      message: "Questions fetched Successfully",
      data: questionData,
      totalCount,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const queId = req.params.id;
    const questionData = await Question.findById(queId).populate(
      "categoryId createdBy assignedTo"
    );

    return res.status(200).json({
      error: false,
      message: "Question fetched Successfully",
      data: questionData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};
exports.getDeletedQuestions = async (req, res) => {
  try {
    const questionData = await Question.find({ isDelete: 1 }).populate(
      "deletedBy"
    );

    return res.status(200).json({
      error: false,
      message: "Question fetched Successfully",
      data: questionData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.restoreQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Question.findByIdAndUpdate(
      id,
      { isDelete: 0 },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Question Restored Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

// exports.assignQuestion = async (req, res) => {
//   try {
//     const { assignedTo, status } = req.body;
//     const questionId = req.params.id;

//     // Validate input
//     if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "assignedTo must be a non-empty array" });
//     }

//     // Map to new structure
//     const assignedArray = assignedTo.map((userId) => ({
//       user: userId,
//       status: status || "assigned",
//     }));

//     const updated = await Question.findByIdAndUpdate(
//       questionId,
//       { assignedTo: assignedArray },
//       { new: true }
//     ).populate("assignedTo.user");

//     if (!updated) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res.status(200).json({
//       message: "Assigned successfully",
//       question: updated,
//     });
//   } catch (error) {
//     console.error("Error assigning question:", error);
//     res.status(500).json({
//       message: "Error assigning question",
//       error,
//     });
//   }
// };

// const Question = require("../models/question");

const mongoose = require("mongoose");
// const Question = require("../models/question");

exports.assignQuestion = async (req, res) => {
  try {
    const { assignedTo, status } = req.body;
    const questionId = req.params.id;

    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
      return res.status(400).json({
        message: "assignedTo must be a non-empty array",
      });
    }

    // ✅ Step 1: Normalize all entries to userIds (string)
    const userIdsOnly = assignedTo
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item?.user) return item.user.toString();
        return null;
      })
      .filter(Boolean); // Remove nulls

    // ✅ Step 2: Validate IDs
    const invalidIds = userIdsOnly.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Invalid userIds found",
        invalidIds,
      });
    }

    // ✅ Step 3: Fetch existing data
    const question = await Question.findById(questionId).lean();
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // ✅ Step 4: Build existing user map
    const existingMap = {};
    question.assignedTo?.forEach((entry) => {
      const uid = entry.user.toString();
      existingMap[uid] = entry;
    });

    // ✅ Step 5: Merge new userIds into the map
    userIdsOnly.forEach((userId) => {
      const uid = userId.toString();
      existingMap[uid] = {
        user: new mongoose.Types.ObjectId(uid),
        status: status || "assigned",
        statusUpdatedAt: new Date(),
      };
    });

    const mergedAssignedTo = Object.values(existingMap);

    // ✅ Step 6: Update question
    const updated = await Question.findByIdAndUpdate(
      questionId,
      { assignedTo: mergedAssignedTo },
      { new: true }
    ).populate("assignedTo.user");

    res.status(200).json({
      message: "Assigned successfully",
      question: updated,
    });
  } catch (error) {
    console.error("Error assigning question:", error);
    res.status(500).json({ message: "Error assigning question", error });
  }
};

// exports.getUserAssignedQuestions = async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user;

//     const questions = await Question.find({
//       assignedTo: { $in: [userId] },
//       isDelete: 0,
//     }).populate("categoryId compId locId createdBy");

//     res.status(200).json(questions);
//   } catch (error) {
//     console.error("Error fetching assigned questions:", error);
//     res.status(500).json({ message: "Failed to fetch questions", error });
//   }
// };

exports.getUserAssignedQuestions = async (req, res) => {
  try {
    const userId = req.user.userId || req.user;

    const questions = await Question.find({
      "assignedTo.user": userId,
      isDelete: 0,
    }).populate([
      { path: "categoryId" },
      // { path: "compId" },
      // { path: "locId" },
      { path: "createdBy" },
      { path: "assignedTo.user" },
    ]);

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching assigned questions:", error);
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};

exports.getAssignedUserIds = async (req, res) => {
  try {
    const queId = req.params.id;

    const question = await Question.findOne({
      _id: queId,
      isDelete: 0,
    }).select("assignedTo"); // only fetch assigned user IDs

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      assignedUserIds: question.assignedTo || [],
    });
  } catch (error) {
    console.error("Error fetching assigned user IDs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned users",
      error,
    });
  }
};

// exports.getAuditData = async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user;

//     const questions = await Question.find({
//       assignedTo: {
//         $in: [userId], // includes current user
//         $exists: true, // field must exist
//         $ne: [], // must not be empty array
//       },
//       isDelete: 0,
//     })
//       .populate("categoryId compId locId createdBy")
//       .populate({
//         path: "assignedTo.user",
//         populate: {
//           path: "compId", // this is inside each assignedTo user
//           model: "company", // replace with your actual model name
//         },
//       });

//     res.status(200).json(questions);
//   } catch (error) {
//     console.error("Error fetching assigned questions:", error);
//     res.status(500).json({ message: "Failed to fetch questions", error });
//   }
// };

// exports.getAuditData = async (req, res) => {
//   try {
//     const userId = req.user.userId || req.user;
//     const role = req.user.roleId;

//     console.log(userId, "userId", role, "role");
//     let questions;

//     console.log(userId && role == 3);

//     if (userId && role == 3) {
//       questions = await Question.find({
//         isDelete: 0,
//       });
//     }

//     questions = await Question.find({
//       "assignedTo.user": userId,
//       isDelete: 0,
//     })
//       .populate("categoryId compId locId createdBy")
//       .populate({
//         path: "assignedTo.user", // first populate user
//         populate: {
//           path: "compId", // then populate compId inside user
//           model: "company", // or "Company", match your model registration
//         },
//       })
//       .lean(); // convert to plain JS objects

//     console.log(questions, "Questions");
//     // Filter assignedTo to only include current user's assignment
//     const filtered = questions.map((q) => {
//       const currentUserEntry = q?.assignedTo?.find(
//         (entry) =>
//           entry.user?._id?.toString() === userId.toString() ||
//           entry.user === userId
//       );

//       // const allUserEntries = q?.assignedTo?.map((item) => )

//       return {
//         ...q,
//         assignedTo: currentUserEntry ? [currentUserEntry] : [],
//       };
//     });

//     res.status(200).json(filtered);
//   } catch (error) {
//     console.error("Error fetching audit data:", error);
//     res.status(500).json({ message: "Failed to fetch questions", error });
//   }
// };

// exports.getAuditData = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const role = req.user.roleId;


//     console.log(req.user, "role");

//     const { page = 0, pageSize = 10, search = "" } = req.body;

//     const skip = page * pageSize;

//     let questionData;

//     if (role === 3) {
//       questionData = await Question.find({ isDelete: 0 })
//         .sort({ createdAt: -1 })
//         .populate("categoryId createdBy")
//         .populate({
//           path: "assignedTo.user", // first populate the user
//           populate: [
//             {
//               path: "compId", // populate user's company
//               model: "company",
//             },
//             {
//               path: "locId", // populate user's location
//               model: "location",
//             },
//           ],
//         })
//         .skip(skip)
//         .limit(pageSize)
//         .lean();
//     }

//         const compId = req.user.compId

//   if (role === 2) {
//   const que = await Question.find({ isDelete: 0 })
//     .sort({ createdAt: -1 })
//     .populate("categoryId createdBy")
//     .populate({
//       path: "assignedTo.user",
//       populate: [
//         { path: "compId", model: "company" },
//         { path: "locId", model: "location" },
//       ],
//     })
//     .skip(skip)
//     .limit(pageSize)
//     .lean();

//   // ✅ Filter questions where at least one assigned user's compId matches
//    questionData = que
//   .filter((q) =>
//     q.assignedTo.some((entry) => entry.user?.compId?._id?.toString() === compId.toString())
//   )
//   .map((q) => ({
//     ...q,
//     assignedTo: q.assignedTo.filter(
//       (entry) => entry.user?.compId?._id?.toString() === compId.toString()
//     ),
//   }));

//   console.log(questionData, "Filtered questionData");
// }


//     // if (compId) {
//     //   questionData = await Question.find({ isDelete: 0, compId: compId })
//     //     .sort({ createdAt: -1 })
//     //     .populate("compId locId categoryId createdBy")
//     //     .populate({
//     //       path: "assignedTo.user", // first populate the user
//     //       populate: [
//     //         {
//     //           path: "compId", // populate user's company
//     //           model: "company",
//     //         },
//     //         {
//     //           path: "locId", // populate user's location
//     //           model: "location",
//     //         },
//     //       ],
//     //     })
//     //     .skip(skip)
//     //     .limit(pageSize)
//     //     .lean();
//     // }

//     return res.status(200).json({
//       error: false,
//       message: "Questions fetched Successfully",
//       data: questionData,
//     });
//   } catch (error) {
//     return res.status(400).json({ error: true, message: error.message });
//   }
// };



