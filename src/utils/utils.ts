export class Utils {
    private static mm = [
        { unit: 'mm', value: 1 },
        { unit: 'pt', value: 2.83465 },
        { unit: 'cm', value: 0.1 },
        { unit: 'px', value: 3.780 },
        { unit: 'in', value: 0.0393701 }
    ];

    /** number round */
    public static round(num: number, places = 2): number {
        if (!(String(num)).includes('e')) {
            return +(Math.round(Number(num + 'e+' + places)) + 'e-' + places);
        } else {
            const arr = ('' + num).split('e');
            let sig = '';
            if (+arr[1] + places > 0) {
                sig = '+';
            }
            return +(Math.round(Number(+arr[0] + 'e' + sig + (+arr[1] + places))) + 'e-' + places);
        }
    }

    /** error handling for JSON.parse */
    public static parse(value: string): object {
        try {
            return JSON.parse(value);
        } catch (error) {
            return {};
        }
    }

    /**
     * conversion units are pt, mm, cm, in, px.
     * returns value with 4 decimal places rounding.
     */
    public static convertUnit(value: number, unit: string, toUnit: string) {
        const objUnit = this.mm[this.mm.findIndex((obj) => obj.unit === unit)];
        const objToUnit = this.mm[this.mm.findIndex((obj) => obj.unit === toUnit)];
        if (objUnit && objToUnit) {
            return this.round((value / objUnit.value) * objToUnit.value, 4);
        }
        return NaN;
    }

    /** text indentation */
    public static splitTextToSize(text: string, width: number, fontSize = 7): string[] {
        if (typeof text === 'string' && typeof width === 'number' && typeof fontSize === 'number') {
            let result = new Array<string>();
            const n = Math.round(width / (fontSize - ((fontSize * 45) / 100)));
            const split = text.split(/\r?\n/);
            for (const item of split) {
                let line = item;
                for (let j = n; j < item.length; j = j + n) {
                    line = line.substring(0, j) + '\n' + line.substring(j);
                }
                result = result.concat(line.split(/\r?\n/));
            }
            return result;
        }
        return [];
    }

    /** object checks are equivalent */
    public static toEqual(a: any, b: any): boolean {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) {
            return false;
        }

        for (const key of aKeys) {
            if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
                return false;
            }
        }
        return true;
    }
}
