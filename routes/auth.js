
const express = require('express');
const passport = require('../config/passport');

const router = express.Router();

router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureMessage: false
    }),
    (req, res) => {
        res.status(200).json({
            message: 'GitHub login successful.',
            user: {
                id: req.user.id
            }
        });
    }
);

router.get('/me', (req, res) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Not logged in.'
        });
    }

    res.status(200).json({
        authenticated: true,
        user: req.user
    });
});

router.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        req.session.destroy((sessionError) => {
            if (sessionError) {
                return next(sessionError);
            }

            res.clearCookie('connect.sid');
            res.status(200).json({
                message: 'Logged out successfully.'
            });
        });
    });
});

module.exports = router;
