import { Utils } from './utils';

describe('toEqual', () => {
    it('toEqual => true', () => {
        expect(Utils.toEqual({ a: 'b' }, { a: 'b' })).toBe(true);
    });
    it('toEqual => false', () => {
        expect(Utils.toEqual({ a: 'b' }, { a: 'c' })).toBe(false);
    });
    it('toEqual => false', () => {
        expect(Utils.toEqual({ a: 'b', c: 'b' }, { a: 'c' })).toBe(false);
    });
});

describe('round', () => {
    it('round 1', () => {
        expect(Utils.round(123.451, 2)).toBe(123.45);
    });
    it('round 4', () => {
        expect(Utils.round(123.454, 2)).toBe(123.45);
    });
    it('round 5', () => {
        expect(Utils.round(123.455, 2)).toBe(123.46);
    });
    it('round 9', () => {
        expect(Utils.round(123.459, 2)).toBe(123.46);
    });
    it('round e+', () => {
        expect(Utils.round(123e+1)).toBe(1230);
    });
    it('round NaN', () => {
        expect(isNaN(Utils.round(123e+123))).toBe(true);
    });
});

describe('parce', () => {
    it('convertUnit cm to in', () => {
        expect(Utils.convertUnit(1, 'cm', 'in')).toBe(0.3937);
    });
    it('convertUnit NaN', () => {
        expect(isNaN(Utils.convertUnit(1, 'km', 'in'))).toBe(true);
    });
});

describe('parce', () => {
    it('parce', () => {
        expect(Utils.parse(`{"a":"b"}`)).toEqual({ a: 'b' });
    });
});
