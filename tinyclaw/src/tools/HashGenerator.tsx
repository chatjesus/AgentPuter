"use client";

import React, { useState, useCallback } from 'react';

// Helper function to convert ArrayBuffer to Hex string
const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
const md5 = (str: string): string => {
    const rotateLeft = (lValue: number, iShiftBits: number): number => {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    const addUnsigned = (lX: number, lY: number): number => {
        let lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    const F = (x: number, y: number, z: number): number => (x & y) | ((~x) & z);
    const G = (x: number, y: number, z: number): number => (x & z) | (y & (~z));
    const H = (x: number, y: number, z: number): number => (x ^ y ^ z);
    const I = (x: number, y: number, z: number): number => (y ^ (x | (~z)));

    const FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    const GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    const HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    const II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    const convertToWordArray = (str: string): number[] => {
        let lWordCount;
        const lMessageLength = str.length;
        const lNumberOfWords_temp1 = lMessageLength + 8;
        const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        lWordCount = (lNumberOfWords_temp2 + 1) * 16;
        const lWordArray = Array(lWordCount - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lWordArray.length - 2] = lMessageLength << 3;
        lWordArray[lWordArray.length - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    const wordToHex = (lValue: number): string => {
        let wordToHexValue = "",
            wordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    const x = convertToWordArray(str);
    let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;

    for (let i = 0; i < x.length; i += 16) {
        const AA = a, BB = b, CC = c, DD = d;
        a = FF(a, b, c, d, x[i + 0], 7, 0xD76AA478);
        d = FF(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
        c = FF(c, d, a, b, x[i + 2], 17, 0x242070DB);
        b = FF(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
        d = FF(d, a, b, c, x[i + 5], 12, 0x4787C62A);
        c = FF(c, d, a, b, x[i + 6], 17, 0xA8304613);
        b = FF(b, c, d, a, x[i + 7], 22, 0xFD469501);
        a = FF(a, b, c, d, x[i + 8], 7, 0x698098D8);
        d = FF(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
        a = FF(a, b, c, d, x[i + 12], 7, 0x6B901122);
        d = FF(d, a, b, c, x[i + 13], 12, 0xFD987193);
        c = FF(c, d, a, b, x[i + 14], 17, 0xA679438E);
        b = FF(b, c, d, a, x[i + 15], 22, 0x49B40821);
        a = GG(a, b, c, d, x[i + 1], 5, 0xF61E2562);
        d = GG(d, a, b, c, x[i + 6], 9, 0xC040B340);
        c = GG(c, d, a, b, x[i + 11], 14, 0x265E5A51);
        b = GG(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[i + 5], 5, 0xD62F105D);
        d = GG(d, a, b, c, x[i + 10], 9, 0x2441453);
        c = GG(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
        b = GG(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
        d = GG(d, a, b, c, x[i + 14], 9, 0xC33707D6);
        c = GG(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
        b = GG(b, c, d, a, x[i + 8], 20, 0x455A14ED);
        a = GG(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
        d = GG(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[i + 7], 14, 0x676F02D9);
        b = GG(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
        d = HH(d, a, b, c, x[i + 8], 11, 0x8771F681);
        c = HH(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
        b = HH(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
        a = HH(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
        d = HH(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
        c = HH(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
        b = HH(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
        a = HH(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
        d = HH(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
        c = HH(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
        b = HH(b, c, d, a, x[i + 6], 23, 0x4881D05);
        a = HH(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
        d = HH(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
        c = HH(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
        b = HH(b, c, d, a, x[i + 2], 23, 0xC4AC5665);
        a = II(a, b, c, d, x[i + 0], 6, 0xF4292244);
        d = II(d, a, b, c, x[i + 7], 10, 0x432AFF97);
        c = II(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
        b = II(b, c, d, a, x[i + 5], 21, 0xFC93A039);
        a = II(a, b, c, d, x[i + 12], 6, 0x655B59C3);
        d = II(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
        c = II(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
        b = II(b, c, d, a, x[i + 1], 21, 0x85845DD1);
        a = II(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
        d = II(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
        c = II(c, d, a, b, x[i + 6], 15, 0xA3014314);
        b = II(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
        a = II(a, b, c, d, x[i + 4], 6, 0xF7537E82);
        d = II(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
        c = II(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
        b = II(b, c, d, a, x[i + 9], 21, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

type HashType = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';
const HASH_TYPES: HashType[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

export default function HashGenerator() {
    const [inputText, setInputText] = useState<string>('');
    const [hashes, setHashes] = useState<Record<HashType, string>>({
        'MD5': '',
        'SHA-1': '',
        'SHA-256': '',
        'SHA-512': '',
    });
    const [error, setError] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<Record<HashType, string>>({
        'MD5': 'Copy',
        'SHA-1': 'Copy',
        'SHA-256': 'Copy',
        'SHA-512': 'Copy',
    });

    const handleGenerateHashes = useCallback(async () => {
        setError(null);
        if (!inputText) {
            setHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' });
            return;
        }

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(inputText);

            const shaPromises = [
                crypto.subtle.digest('SHA-1', data),
                crypto.subtle.digest('SHA-256', data),
                crypto.subtle.digest('SHA-512', data),
            ];

            const [sha1Buffer, sha256Buffer, sha512Buffer] = await Promise.all(shaPromises);

            setHashes({
                'MD5': md5(inputText),
                'SHA-1': arrayBufferToHex(sha1Buffer),
                'SHA-256': arrayBufferToHex(sha256Buffer),
                'SHA-512': arrayBufferToHex(sha512Buffer),
            });

        } catch (e) {
            console.error(e);
            setError('Failed to generate hashes. The Web Crypto API may not be available in this context (e.g., non-secure HTTP).');
        }
    }, [inputText]);

    const handleCopy = useCallback((text: string, type: HashType) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus(prev => ({ ...prev, [type]: 'Copied!' }));
            setTimeout(() => {
                setCopyStatus(prev => ({ ...prev, [type]: 'Copy' }));
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }, []);

    return (
        <div className="tool-stack">
            <textarea
                className="tool-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text here to generate hashes..."
                rows={8}
            />
            <div className="tool-btn-row">
                <button className="tool-run-btn" onClick={handleGenerateHashes}>
                    Generate Hashes
                </button>
            </div>

            {error && <div className="tool-error">{error}</div>}

            {HASH_TYPES.map((type) => (
                hashes[type] && (
                    <div className="tool-output" key={type}>
                        <h3>{type}</h3>
                        <div className="tool-split">
                            <pre className="tool-output-pre tool-mono">{hashes[type]}</pre>
                            <button
                                className="tool-copy-btn tool-btn-secondary"
                                onClick={() => handleCopy(hashes[type], type)}
                            >
                                {copyStatus[type]}
                            </button>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}