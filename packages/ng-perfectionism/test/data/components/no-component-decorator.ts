import { buildTestData } from '../../utils/build-test-data.function';

const code = `
export class TestComponent {}
`;

export const NO_COMPONENT_DECORATOR = buildTestData(code, code);
