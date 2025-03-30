import { createUnitTestData } from '../../utils/create-unit-test-data.function';

const code = `
export class FirstClassWithoutDecorator {}

export class SecondClassWithoutDecorator {}

export class ThirdClassWithoutDecorator {}

export class FourthClassWithoutDecorator {}
`;

export const MULTIPLE_CLASSES_WITHOUT_DECORATOR = createUnitTestData(code, code);
