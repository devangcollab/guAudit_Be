const company = require("../models/company");
const Form = require("../models/form");
const moment = require("moment-timezone");
const location = require("../models/location");

// exports.addForm = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const compId = req.user?.compId;
//     const locId = req.user?.locId;
//     const { categoryId, title, formData } = req.body;

//     let count = 0;

//     // formData.map((m) => {
//     //   if (m.type == "descriptive" && m.answer == "") {
//     //     return (count);
//     //   } else if (m.type == "descriptive" && m.answer != "") {
//     //     return (count += 1);
//     //   } else if (m.answer == m.prefAns) {
//     //     return (count += 1);
//     //   }
//     // });

//     // formData.map((m) => {
//     //   if (m.type == "descriptive") {
//     //     if (m.answer != "") {
//     //       count += 1;
//     //     }
//     //   } else if (m.answer.length == 0) {
//     //     return;
//     //   } else if (m.type == "multiplechoice") {
//     //     m.answer.forEach((ans) => {
//     //       if (m.prefAns.includes(ans)) {
//     //         count += 1;
//     //       }
//     //     });
//     //   } else if (m.type == "options") {
//     //     if (m.prefAns.includes(m.answer)) {
//     //       count += 1;
//     //     }
//     //   } else if (m.type == "yes/no") {
//     //     if (m.prefAns.includes(m.answer)) {
//     //       count += 1;
//     //     }
//     //   }
//     // });

//     formData.forEach((item) => {
//       const { type, answer, prefAns } = item;

//       if (type === "Descriptive") {
//         if (answer?.trim()) count += 1;
//         console.log(count, "desc");
//       } else if (type === "multiplechoice") {
//         if (Array.isArray(answer)) {
//           const matched = answer.some((ans) => prefAns?.includes(ans));
//           if (matched) {
//             count += 1;
//           } else {
//             console.log(" No match in multiplechoice → +0");
//           }
//         }
//       } else if (type === "Options" || type === "Yes/No") {
//         if (prefAns?.includes(answer)) count += 1;
//         console.log(count, "option");
//       }
//     });
//     console.log("count", count);

//     const currentDate = moment().format();

//     const data = await Form.create({
//       compId,
//       locId,
//       categoryId,
//       title,
//       formData,
//       score: count,
//       createdBy: userId,
//       dateField: currentDate,
//     });

//     return res.status(200).json({
//       error: false,
//       message: "Form Created Successfully",
//       data: data,
//     });
//   } catch (error) {
//     return res.status(400).json({ error: true, message: error.message });
//   }
// };

// exports.getAllForms = async (req, res) => {
//   try {
//     const data = await Form.find({ isDelete: 0 });

//     return res.status(200).json({
//       error: false,
//       message: "Form fetched Successfully",
//       data: data,
//     });
//   } catch (error) {
//     return res.status(400).json({ error: true, message: error.message });
//   }
// };

exports.addForm = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const compId = req.user?.compId;
    const locId = req.user?.locId;
    const { categoryId, title, formData, selectedUserIds, questionId } =
      req.body;



    // if (!Array.isArray(assignUsers) || assignUsers.length === 0) {
    //   return res.status(400).json({ error: true, message: "assignUsers must be a non-empty array" });
    // }

    // Calculate score
    let count = 0;
    formData?.forEach((item) => {
      const { type, answer, prefAns } = item;

      if (type === "Descriptive") {
        if (answer?.trim()) count += 1;
      } else if (type === "multiplechoice") {
        if (Array.isArray(answer)) {
          const matched = answer.some((ans) => prefAns?.includes(ans));
          if (matched) count += 1;
        }
      } else if (type === "Options" || type === "Yes/No") {
        if (prefAns?.includes(answer)) count += 1;
      }
    });

    const currentDate = new Date();
    const formEntries = selectedUserIds?.map((userId) => ({
      compId,
      questionId,
      locId,
      categoryId,
      title,
      formData,
      score: count,
      createdBy,
      assignUser: userId,
      status: "assigned",
      statusUpdatedAt: currentDate,
      dateField: currentDate,
    }));

    const savedForms = await Form.insertMany(formEntries);

    return res.status(200).json({
      error: false,
      message: "Forms assigned and created successfully",
      data: savedForms,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const role = req.user.roleId;
    const userId = req.user.userId;
    const compId = req.user.compId;


    const { page = 0, pageSize = 10, search = "" } = req.body;

    const skip = page * pageSize;

    let searchQuery = {};
    searchQuery.$or = [{ title: { $regex: search, $options: "i" } }];

    const findObject = {
      ...searchQuery,
      isDelete: 0,
    };

    if (role === 1 && userId) {
      findObject.createdBy = userId;
    }

    if (role === 2 && compId) {
      findObject.compId = compId;
    }

    const totalCount = await Form.countDocuments(findObject);

    const formData = await Form.find(findObject)
      .populate("compId locId categoryId createdBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec();

    // const newData = await Promise.all(
    //   formData.map(async (form) => {
    //     const findCompany = await company.findById(form.compId);
    //     const findLocation = await location.findById(form.locId);

    //     return {
    //       ...form,
    //       compName: findCompany.name,
    //       locName: findLocation.locName,
    //     };
    //   })
    // );

    return res.status(200).json({
      error: false,
      message: "Form Data fetched Successfully",
      data: formData,
      totalCount,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getFormbyLocId = async (req, res) => {
  try {
    const { locId } = req.params;
    const data = await Form.find({ locId: locId, isDelete: "0" }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      error: false,
      message: "Form Data fetched Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.roleId;
    const compId = req.user?.compId;

    const findObject = { isDelete: 0 };

    if (role == 1) {
      findObject.assignUser = userId;
    }

    if (role == 2) {
      findObject.compId = compId;
    }

    const data = await Form.find(findObject)
      .populate({
        path: "questionId",
        populate: {
          path: "categoryId",
          model: "category",
        },
      })
      .populate("createdBy compId")
      .populate({
        path: "assignUser",
        populate: {
          path: "locId",
          model: "location",
        },
      });

    return res.status(200).json({
      error: false,
      message: "Form Data fetched Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = moment().format();
    const { formData } = req.body;
    const compId = req.user.compId;

    // if (!Array.isArray(assignUsers) || assignUsers.length === 0) {
    //   return res.status(400).json({ error: true, message: "assignUsers must be a non-empty array" });
    // }

    // Calculate score
    let count = 0;
    formData?.forEach((item) => {
      const { type, answer, prefAns } = item;

      if (type === "Descriptive") {
        if (answer?.trim()) count += 1;
      } else if (type === "multiplechoice") {
        if (Array.isArray(answer)) {
          const matched = answer.some((ans) => prefAns?.includes(ans));
          if (matched) count += 1;
        }
      } else if (type === "Options" || type === "Yes/No") {
        if (prefAns?.includes(answer)) count += 1;
      }
    });


    const updatedFormData = await Form.findByIdAndUpdate(
      id,
      { ...req.body, dateField: currentDate, score: count, compId },
      {
        new: true,
      }
    );

    return res.status(200).json({
      error: false,
      message: "Form data Updated Successfully.",
      data: updatedFormData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: true, message: error.message });
  }
};

// exports.checkUserAssignment = async (req, res) => {
//   try {
//     const userId = req.params.id

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const assignedForm = await Form.findOne({
//       assignUser: userId,
//       isDelete: 0,
//       // status: "assigned", // optionally filter by active assignment
//     }).select("_id title assignUser createdAt");

//     if (assignedForm) {
//       return res.status(200).json({
//         assigned: true,
//         form: assignedForm,
//       });
//     } else {
//       return res.status(200).json({
//         assigned: false,
//         form: null,
//       });
//     }
//   } catch (error) {
//     console.error("Error checking assignment:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

exports.checkUserAssignment = async (req, res) => {
  try {
    const userId = req.params.id;
    const questionId = req.query.questionId; // You can also use req.body or req.params depending on your route

    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ message: "User ID and Question ID are required" });
    }

    const assignedForm = await Form.findOne({
      assignUser: userId,
      isDelete: 0,
      questionId: questionId,
      // formData: {
      //   $elemMatch: {
      //     _id: questionId  // or 'questionId': questionId if your structure uses a field named questionId
      //   }
      // }
    }).select("_id title assignUser createdAt");

    if (assignedForm) {
      return res.status(200).json({
        assigned: true,
        form: assignedForm,
      });
    } else {
      return res.status(200).json({
        assigned: false,
        form: null,
      });
    }
  } catch (error) {
    console.error("Error checking assignment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// exports.selectAudit = async (req, res) => {
//   try {
//     const auditText = req.query.text || "";
//     const locId = req.query.locId;

//     if (!locId) {
//       return res.status(400).json({ message: "Location ID is required" });
//     }

//     let findObject = {
//       isDelete: 0,
//       // status: "completed",
//       // locId: locId,
//     };

//     if (auditText.trim() !== "") {
//       findObject.$or = [
//         { title: { $regex: `^${auditText}`, $options: "i" } },
//       ];
//     }

//     const audits = await Form.find(findObject).limit(5).populate("questionId");

//     return res.status(200).json({
//       message: "Audit searched successfully",
//       // data: audits.map((a) => ({
//       //   label: a.title,
//       //   value: a._id,
//       // })),
//       data:audits
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };
exports.selectAudit = async (req, res) => {
  try {
    const auditText = req.query.text?.trim() || "";
    const locId = req.query.locId;

    if (!locId) {
      return res.status(400).json({ message: "Location ID is required" });
    }

    // Step 1: Fetch completed audits with locId
    let audits = await Form.find({
      isDelete: 0,
      status: "completed",
      locId,
    })
      .populate("questionId", "title") // only fetch title of question
      .limit(20); // Limit for performance

    // Step 2: Filter by question title if search text present
    if (auditText !== "") {
      audits = audits.filter(
        (audit) =>
          audit?.questionId?.title
            ?.toLowerCase()
            .startsWith(auditText.toLowerCase()) ||
          audit?.title?.toLowerCase().startsWith(auditText.toLowerCase())
      );
    }

    // Step 3: Return formatted response
    return res.status(200).json({
      message: "Audit searched successfully",
      // data: audits.slice(0, 5).map((a) => ({
      //   label: a.title,
      //   value: a._id,
      //   questionTitle: a?.questionId?.title || "",
      // })),
      data: audits,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.getAuditByQuestionId = async (req, res) => {
  try {
    const { id } = req.params;

    const audit = await Form.find({ isDelete: 0, questionId: id }).populate(
      "questionId assignUser"
    );

    return res.status(200).json({
      error: false,
      message: "Audit Get Successfully",
      data: audit,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getCompletedForms = async (req, res) => {

  const role = req.user.roleId
  const userId = req.user.userId
    const compId = req.user?.compId;


  
  try {

const findObject = { isDelete: 0, status: "completed" }

    if (role == 1) {
      findObject.assignUser = userId;
    }

    if (role == 2) {
      findObject.compId = compId;
    }


    const forms = await Form.find(findObject)
      .populate({
        path: "questionId",
        populate: {
          path: "categoryId",
          model: "category",
        },
      })
      .populate("createdBy compId")
      .populate({
        path: "assignUser",
        populate: {
          path: "locId",
          model: "location",
        },
      });
    return res.status(200).json({
      error: false,
      message: "form Get Successfully",
      data: forms,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};
