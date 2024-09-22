const mongoose = require('mongoose');
const Message = require('../../src/models/Message');
const User = require('../../src/models/User');

describe('Message Model Test', () => {
    let user;

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
        user = await User.create({ username: 'testuser', password: 'testpassword' });
    });

    afterAll(async () => {
        await User.deleteMany();
        await mongoose.connection.close();
    });

    it('create & save message successfully', async () => {
        const messageData = {
            sender: user._id,
            content: 'Test message',
            room: 'general'
        };
        const validMessage = new Message(messageData);
        const savedMessage = await validMessage.save();

        expect(savedMessage._id).toBeDefined();
        expect(savedMessage.content).toBe(messageData.content);
        expect(savedMessage.room).toBe(messageData.room);
        expect(savedMessage.sender.toString()).toBe(user._id.toString());
    });

    it('insert message with required field missing fails', async () => {
        const messageWithoutRequiredField = new Message({
            sender: user._id,
            room: 'general'
        });
        let err;
        try {
            await messageWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});