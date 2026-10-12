
const { ObjectId } = require('mongodb');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { getDb } = require('../db/connect');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        if (!ObjectId.isValid(id)) {
            return done(null, false);
        }

        const user = await getDb()
            .collection('users')
            .findOne({ _id: new ObjectId(id) });

        if (!user) {
            return done(null, false);
        }

        done(null, {
            id: user._id.toString(),
            githubId: user.githubId,
            username: user.username,
            displayName: user.displayName,
            profileUrl: user.profileUrl
        });
    } catch (error) {
        done(error);
    }
});

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL ||
            'http://localhost:8080/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const users = getDb().collection('users');

            const existingUser = await users.findOne({
                githubId: profile.id
            });

            if (existingUser) {
                await users.updateOne(
                    { _id: existingUser._id },
                    {
                        $set: {
                            username: profile.username,
                            displayName: profile.displayName || profile.username,
                            profileUrl: profile.profileUrl
                        }
                    }
                );

                return done(null, {
                    id: existingUser._id.toString()
                });
            }

            const newUser = {
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName || profile.username,
                profileUrl: profile.profileUrl,
                createdAt: new Date()
            };

            const result = await users.insertOne(newUser);

            done(null, {
                id: result.insertedId.toString()
            });
        } catch (error) {
            done(error);
        }
    }
));

module.exports = passport;
