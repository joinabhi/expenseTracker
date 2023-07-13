const Expense = require('../model/expense');
const User = require('../model/user')
const sequelize = require('../util/database')

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const getUserLeaderBoard = await User.findAll({
        //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalCost']],
        //     include: [{
        //         model: Expense,
        //         attributes: []
        //     }],
        //     group: ['user.id'],
            order: [['totalExpense', 'DESC']] // Modified order property
        });
        res.status(200).json(getUserLeaderBoard);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

