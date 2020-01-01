import { Utils } from './utils';

describe('Utils', () => {
    it('parce', () => {
        expect(Utils.parse(`{"a":"b"}`)).toEqual({a: 'b'});
    });
});
