const { myCourse } = require('../models'); 

module.exports = {
getPaymentHistory: async (req, res) => {
  try {
    const userId = res.user.id; 
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize;

    const userCourses = await myCourse.findMany({
      where: { 
        user: userId 
        },
      include: { 
        orders: true, 
        courses: true 
        },
      orderBy: { 
        id: 'desc' 
        }, 
      skip: offset,
      take: pageSize,
    });

    res.status(200).json({ 
        success: true,
        data: userCourses 
    });
  } catch (error) {
    console.error("Error fetching historyPayment :", error);
    res.status(500).json({ 
        success: false, 
        error: "Internal Server Error" 
    });
  }
},
};