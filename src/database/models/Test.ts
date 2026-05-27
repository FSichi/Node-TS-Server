import { model, Schema, Document } from 'mongoose';
import { Color } from '../enums/index.js';

interface ITestParams {
    nombreCompleto: string;
    color: Color;
    estado: boolean;
}

interface ITest extends Document, ITestParams {
    getColorName(): string;
}

type TestDocument = Document & ITest;

const TestSchema = new Schema({
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    color: {
        type: String,
        default: Color.Blue,
        enum: [Color.Red, Color.Blue, Color.Green],
        required: [true, 'El color es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

TestSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.estado;
    obj.uid = obj._id;
    delete obj._id;
    return obj;
};

TestSchema.methods.getColorName = function () {
    return this.toObject().color;
};

const TestModel = model<ITest>('Test', TestSchema);

export { ITestParams, ITest, TestDocument, TestModel };
