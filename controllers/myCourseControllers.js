const { categories, reviews, courses, myCourse } = require("../models");

module.exports = {
    MyCourse : async (req, res) => {
        try {
            const kategori = req.query.kategori;
            const search = req.query.search;
            const filter = req.query.filter;
            const level = req.query.level;
            const type = req.body.type;
            let user = res.user.id

            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = 12;
            const skip = (page - 1) * itemsPerPage;

            let data = await myCourse.findMany({
                skip,
                take : itemsPerPage,
                where: {
                  categories: kategori !== null ? { name: kategori } : {},
                  title : search !== null ? {contains: search}:{},
                  level : level !== null ? level:{},
                  price : type !== null ? type == 'premium' ? {not : 0}: 0 : {}
                },
                include: {
                  categories: true,
                },
              });


        } catch (error) {
            
        }
    }
}