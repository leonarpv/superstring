import Jimp from 'jimp/es';
import * as Utility from './utility';

export enum DataType {
    Uint8,
    Uint32
}

const QUOTA = 16384;

const entropy = <T extends Uint8Array | Uint32Array>(type: DataType, size: number): T => {
    let output: T;

    switch (type) {
        case DataType.Uint8:
            output = new Uint8Array(size) as T;
            break;
        case DataType.Uint32:
            output = new Uint32Array(size) as T;
            break;
        default:
            throw Error(`Unsupported data format ${type}`);
    }

    return crypto.getRandomValues<T>(output);
};

export const getRandomNumbers = (type: DataType, size: number) => Utility.async(
    () => {
        if (size < 0) throw Error('Argument must not be negative');
        if (size === 0) return [];

        const start = performance.now();
        const data = [] as number[];
        const quotient = Math.floor(size / QUOTA);
        const remainder = size % QUOTA;

        const add = (entropy: Uint8Array | Uint32Array) => {
            for (let index = 0; index < entropy.length; index++) data.push(entropy[index]);
        };

        for (let index = 0; index < quotient; index++) add(entropy(type, QUOTA));
        if (quotient === 0 || remainder > 0) add(entropy(type, remainder));

        const end = performance.now();

        Utility.debug(`Generated ${size} random numbers in ${end - start}ms`);

        return data;
    }
);

export const getRandomString = async (count: number, characters: string) => Utility.async(
    async () => {
        if (count < 0) throw Error('Argument must not be negative');
        if (characters.length === 0) throw Error('No characters provided');
        if (count === 0) return '';

        const values = await getRandomNumbers(DataType.Uint32, count);
        const start = performance.now();
        let output = '';

        for (let index = 0; index < count; index++) {
            const number = values[index] / (0xffffffff + 1);
            const position = Math.floor(number * characters.length);
            const character = characters.charAt(position);

            output += character;
        }

        const end = performance.now();

        Utility.debug(`Generated ${count} random characters in ${end - start}ms`);

        return output;
    }
);

export const getRandomWords = async (count: number, dictionary: string[], separator: string = '') => Utility.async(
    async () => {
        if (count < 0) throw Error('Argument must not be negative');
        if (dictionary.length === 0) throw Error('Dictionary is empty');
        if (count === 0) return '';

        const values = await getRandomNumbers(DataType.Uint32, count);
        const start = performance.now();
        let output = [];

        for (let index = 0; index < count; index++) {
            const number = values[index] / (0xffffffff + 1);
            const position = Math.floor(number * dictionary.length);
            const word = dictionary[position];

            output.push(word);
        }

        const end = performance.now();

        Utility.debug(`Generated ${count} random words in ${end - start}ms`);

        return output.join(separator);
    }
);

export const getRandomImage = (width: number, height: number, mime: string, grayscale: boolean) => Utility.async(
    async () => {
        if (width < 1 || height < 1) throw Error('All dimensions must be greater than zero');
        if (!/image\/(png|jpeg|bmp)/.test(mime)) throw Error('Invalid mime type');

        const array = new Uint8Array(width * height * 4);
        const size = width * height * 3;
        const data = await getRandomNumbers(DataType.Uint8, size);
        const start = performance.now();

        for (let i = 0, j = 0; i < size; i += 3, j += 4) {
            array[j] = data[i];
            array[j + 1] = data[i + 1];
            array[j + 2] = data[i + 2];
            array[j + 3] = 255;
        }

        const buffer = Buffer.from(array);
        const raw = {
            data: buffer,
            width: width,
            height: height
        };
        const image = new Jimp(raw);

        if (grayscale) image.grayscale();

        const base64 = await image.getBase64Async(mime);
        const end = performance.now();

        Utility.debug(`Rendered an image of ${Utility.humanize(size)} in ${end - start}ms`);

        return base64;
    }
);
