import { model, Schema, Document } from 'mongoose';
import { Color } from '../enums/index.ts';

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
        required: [true, 'El nombre es obligatorio']
    },
    color: {
        type: String,
        default: Color.Blue,
        enum: [Color.Red, Color.Blue, Color.Green],
        required: [true, 'El Rol es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

TestSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...test } = this.toObject();
    test.uid = _id;
    return test;
}

TestSchema.methods.getColorName = function () {
    const { color } = this.toObject();
    return color;
}

const TestModel = model<ITest>('Test', TestSchema);

export { ITestParams, ITest, TestDocument, TestModel };
