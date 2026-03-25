const UserService = require('../services/user-service');
const userService = new UserService();

const signup = async (req, res) => {
    try {
        const data = req.body;
        const user = await userService.signup(data);
        return res.status(201).json({
            data: user,
            success: true,
            message: 'Successfully created a user',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a user',
            err: error
        });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userService.findOne({ _id: userId });
        if(!user) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'User not found',
                err: {}
            });
        }
        return res.status(200).json({
            data: user,
            success: true,
            message: 'Successfully fetched user profile',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},   
            success: false,
            message: 'Not able to fetch user profile',
            err: error
        });
    }
}


const loginUser = async (req, res) => {
    try {
        const data = req.body;
        const { user, token } = await userService.login({...data, ip: req.ip});
        return res.status(200).json({
            data: { user, token },
            success: true,
            message: 'Successfully logged in',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to login',
            err: error
        });
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.findOne({ _id: id });
        if(!user) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'User not found',
                err: {}
            });
        }
        return res.status(200).json({
            data: user,
            success: true,
            message: 'Successfully fetched the user',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetch the user',
            err: error 
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.delete({ _id: id });
        if(!user) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'User not found',
                err: {}
            });
        }
        return res.status(200).json({
            data: user,
            success: true,
            message: 'Successfully deleted the user',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to delete the user',
            err: error
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await userService.update(id, data);
        if(!user) {
            return res.status(404).json({
                data: {},
                success: false,
                message: 'User not found',
                err: {}
            });
        }
        return res.status(200).json({
            data: user,
            success: true,
            message: 'Successfully updated the user',
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to update the user',
            err: error
        });
    }
}

module.exports = {
    signup,
    getUser,
    deleteUser,
    updateUser,
    loginUser,
    getUserProfile
}