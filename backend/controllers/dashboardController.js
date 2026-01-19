const Student = require("../models/Student");
const Fee = require("../models/Fee");
const Payment = require("../models/Payment");

/**
 * @desc   Dashboard summary
 * @route  GET /api/dashboard/summary
 * @access Admin (JWT protected)
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    // ===============================
    // STUDENT COUNTS
    // ===============================
    const totalStudents = await Student.countDocuments();

    const [
      playgroupCount,
      nurseryCount,
      juniorKgCount,
      seniorKgCount
    ] = await Promise.all([
      Student.countDocuments({ class: "Playgroup" }),
      Student.countDocuments({ class: "Nursery" }),
      Student.countDocuments({ class: "Junior KG" }),
      Student.countDocuments({ class: "Senior KG" })
    ]);

    // ===============================
    // FEES COLLECTION (AGGREGATION)
    // ===============================
    const collectedResult = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalCollected =
      collectedResult.length > 0
        ? collectedResult[0].total
        : 0;

    // ===============================
    // PENDING FEES (AGGREGATION)
    // ===============================
    const pendingResult = await Fee.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$pendingAmount" }
        }
      }
    ]);

    const totalPending =
      pendingResult.length > 0
        ? pendingResult[0].total
        : 0;

    // ===============================
    // RESPONSE
    // ===============================
    res.json({
      students: {
        total: totalStudents,
        playgroup: playgroupCount,
        nursery: nurseryCount,
        juniorKg: juniorKgCount,
        seniorKg: seniorKgCount
      },
      fees: {
        collected: totalCollected,
        pending: totalPending
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary"
    });
  }
};
