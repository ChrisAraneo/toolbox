import { createUnitTestData } from '../../utils/create-unit-test-data.function';

const code = `
export class ClassWithoutDecorator {}
`;

export const CLASS_WITHOUT_DECORATOR = createUnitTestData(code, code);
