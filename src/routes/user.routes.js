import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

const router = Router();

router.post('/register', register, isAuthenticated);
router.post('/login', login, isAuthenticated);
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);

router.delete('/', isAuthenticated, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.userId);
        if (!deletedUser) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        res.clearCookie('token');
        res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
});

export default router;
