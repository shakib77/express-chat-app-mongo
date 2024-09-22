const mongoose = require('mongoose');
const User = require('../../src/models/User');

describe('User Model Test', () => {
    it('create & save user successfully', async () => {
        const userData = { username: 'testuser', password: 'testpassword' };
        const validUser = new User(userData);
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.password).not.toBe(userData.password); // Password should be hashed
    });

    it('insert user with required field missing fails', async () => {
        const userWithoutRequiredField = new User({ username: 'testuser' });
        let err;
        try {
            await userWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});