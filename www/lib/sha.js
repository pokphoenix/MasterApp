/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2016
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
 */
'use strict';
(function (W) {
    function w(d, a, c) {
        var b = 0, f = [], h = 0, g, e, n, k, m, q, v, p = !1, r = [], t = [], l, u = !1;
        c = c || {};
        g = c.encoding || "UTF8";
        l = c.numRounds || 1;
        n = L(a, g);
        if (l !== parseInt(l, 10) || 1 > l)throw Error("numRounds must a integer >= 1");
        if ("SHA-1" === d)m = 512, q = M, v = X, k = 160; else if (q = function (a, c) {
                return N(a, c, d)
            }, v = function (a, c, b, f) {
                var h, C;
                if ("SHA-224" === d || "SHA-256" === d)h = (c + 65 >>> 9 << 4) + 15, C = 16; else if ("SHA-384" === d || "SHA-512" === d)h = (c + 129 >>> 10 << 5) + 31, C = 32; else throw Error("Unexpected error in SHA-2 implementation");
                for (; a.length <= h;)a.push(0);
                a[c >>> 5] |= 128 << 24 - c % 32;
                c = c + b;
                a[h] = c & 4294967295;
                a[h - 1] = c / 4294967296 | 0;
                b = a.length;
                for (c = 0; c < b; c += C)f = N(a.slice(c, c + C), f, d);
                if ("SHA-224" === d)a = [f[0], f[1], f[2], f[3], f[4], f[5], f[6]]; else if ("SHA-256" === d)a = f; else if ("SHA-384" === d)a = [f[0].a, f[0].b, f[1].a, f[1].b, f[2].a, f[2].b, f[3].a, f[3].b, f[4].a, f[4].b, f[5].a, f[5].b]; else if ("SHA-512" === d)a = [f[0].a, f[0].b, f[1].a, f[1].b, f[2].a, f[2].b, f[3].a, f[3].b, f[4].a, f[4].b, f[5].a, f[5].b, f[6].a, f[6].b, f[7].a, f[7].b]; else throw Error("Unexpected error in SHA-2 implementation");
                return a
            }, "SHA-224" === d)m = 512, k = 224; else if ("SHA-256" === d)m = 512, k = 256; else if ("SHA-384" === d)m = 1024, k = 384; else if ("SHA-512" === d)m = 1024, k = 512; else throw Error("Chosen SHA variant is not supported");
        e = y(d);
        this.setHMACKey = function (a, c, f) {
            var h;
            if (!0 === p)throw Error("HMAC key already set");
            if (!0 === u)throw Error("Cannot set HMAC key after calling update");
            g = (f || {}).encoding || "UTF8";
            c = L(c, g)(a);
            a = c.binLen;
            c = c.value;
            h = m >>> 3;
            f = h / 4 - 1;
            if (h < a / 8) {
                for (c = v(c, a, 0, y(d)); c.length <= f;)c.push(0);
                c[f] &= 4294967040
            } else if (h >
                a / 8) {
                for (; c.length <= f;)c.push(0);
                c[f] &= 4294967040
            }
            for (a = 0; a <= f; a += 1)r[a] = c[a] ^ 909522486, t[a] = c[a] ^ 1549556828;
            e = q(r, e);
            b = m;
            p = !0
        };
        this.update = function (a) {
            var d, c, g, k = 0, p = m >>> 5;
            d = n(a, f, h);
            a = d.binLen;
            c = d.value;
            d = a >>> 5;
            for (g = 0; g < d; g += p)k + m <= a && (e = q(c.slice(g, g + p), e), k += m);
            b += k;
            f = c.slice(k >>> 5);
            h = a % m;
            u = !0
        };
        this.getHash = function (a, c) {
            var g, m, n, q;
            if (!0 === p)throw Error("Cannot call getHash after setting HMAC key");
            n = O(c);
            switch (a) {
                case "HEX":
                    g = function (a) {
                        return P(a, n)
                    };
                    break;
                case "B64":
                    g = function (a) {
                        return Q(a,
                            n)
                    };
                    break;
                case "BYTES":
                    g = R;
                    break;
                case "ARRAYBUFFER":
                    try {
                        m = new ArrayBuffer(0)
                    } catch (t) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    g = S;
                    break;
                default:
                    throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            q = v(f.slice(), h, b, e.slice());
            for (m = 1; m < l; m += 1)q = v(q, k, 0, y(d));
            return g(q)
        };
        this.getHMAC = function (a, c) {
            var g, n, l, r;
            if (!1 === p)throw Error("Cannot call getHMAC without first setting HMAC key");
            l = O(c);
            switch (a) {
                case "HEX":
                    g = function (a) {
                        return P(a, l)
                    };
                    break;
                case "B64":
                    g = function (a) {
                        return Q(a,
                            l)
                    };
                    break;
                case "BYTES":
                    g = R;
                    break;
                case "ARRAYBUFFER":
                    try {
                        g = new ArrayBuffer(0)
                    } catch (u) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    g = S;
                    break;
                default:
                    throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            n = v(f.slice(), h, b, e.slice());
            r = q(t, y(d));
            r = v(n, k, m, r);
            return g(r)
        }
    }

    function b(d, a) {
        this.a = d;
        this.b = a
    }

    function Y(d, a, c) {
        var b = d.length, f, h, g, e, n;
        a = a || [0];
        c = c || 0;
        n = c >>> 3;
        if (0 !== b % 2)throw Error("String of HEX type must be in byte increments");
        for (f = 0; f < b; f += 2) {
            h = parseInt(d.substr(f,
                2), 16);
            if (isNaN(h))throw Error("String of HEX type contains invalid characters");
            e = (f >>> 1) + n;
            for (g = e >>> 2; a.length <= g;)a.push(0);
            a[g] |= h << 8 * (3 - e % 4)
        }
        return {value: a, binLen: 4 * b + c}
    }

    function Z(d, a, c) {
        var b = [], f, h, g, e, b = a || [0];
        c = c || 0;
        h = c >>> 3;
        for (f = 0; f < d.length; f += 1)a = d.charCodeAt(f), e = f + h, g = e >>> 2, b.length <= g && b.push(0), b[g] |= a << 8 * (3 - e % 4);
        return {value: b, binLen: 8 * d.length + c}
    }

    function aa(d, a, c) {
        var b = [], f = 0, h, g, e, n, k, m, b = a || [0];
        c = c || 0;
        a = c >>> 3;
        if (-1 === d.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");
        g = d.indexOf("=");
        d = d.replace(/\=/g, "");
        if (-1 !== g && g < d.length)throw Error("Invalid '=' found in base-64 string");
        for (g = 0; g < d.length; g += 4) {
            k = d.substr(g, 4);
            for (e = n = 0; e < k.length; e += 1)h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[e]), n |= h << 18 - 6 * e;
            for (e = 0; e < k.length - 1; e += 1) {
                m = f + a;
                for (h = m >>> 2; b.length <= h;)b.push(0);
                b[h] |= (n >>> 16 - 8 * e & 255) << 8 * (3 - m % 4);
                f += 1
            }
        }
        return {value: b, binLen: 8 * f + c}
    }

    function ba(d, a, c) {
        var b = [], f, h, e, b = a || [0];
        c = c || 0;
        f = c >>> 3;
        for (a = 0; a < d.byteLength; a += 1)e = a +
            f, h = e >>> 2, b.length <= h && b.push(0), b[h] |= d[a] << 8 * (3 - e % 4);
        return {value: b, binLen: 8 * d.byteLength + c}
    }

    function P(d, a) {
        var c = "", b = 4 * d.length, f, h;
        for (f = 0; f < b; f += 1)h = d[f >>> 2] >>> 8 * (3 - f % 4), c += "0123456789abcdef".charAt(h >>> 4 & 15) + "0123456789abcdef".charAt(h & 15);
        return a.outputUpper ? c.toUpperCase() : c
    }

    function Q(d, a) {
        var c = "", b = 4 * d.length, f, h, e;
        for (f = 0; f < b; f += 3)for (e = f + 1 >>> 2, h = d.length <= e ? 0 : d[e], e = f + 2 >>> 2, e = d.length <= e ? 0 : d[e], e = (d[f >>> 2] >>> 8 * (3 - f % 4) & 255) << 16 | (h >>> 8 * (3 - (f + 1) % 4) & 255) << 8 | e >>> 8 * (3 - (f + 2) % 4) & 255, h = 0; 4 >
        h; h += 1)8 * f + 6 * h <= 32 * d.length ? c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >>> 6 * (3 - h) & 63) : c += a.b64Pad;
        return c
    }

    function R(d) {
        var a = "", c = 4 * d.length, b, f;
        for (b = 0; b < c; b += 1)f = d[b >>> 2] >>> 8 * (3 - b % 4) & 255, a += String.fromCharCode(f);
        return a
    }

    function S(d) {
        var a = 4 * d.length, c, b = new ArrayBuffer(a);
        for (c = 0; c < a; c += 1)b[c] = d[c >>> 2] >>> 8 * (3 - c % 4) & 255;
        return b
    }

    function O(d) {
        var a = {outputUpper: !1, b64Pad: "="};
        d = d || {};
        a.outputUpper = d.outputUpper || !1;
        !0 === d.hasOwnProperty("b64Pad") && (a.b64Pad =
            d.b64Pad);
        if ("boolean" !== typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");
        if ("string" !== typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");
        return a
    }

    function L(d, a) {
        var c;
        switch (a) {
            case "UTF8":
            case "UTF16BE":
            case "UTF16LE":
                break;
            default:
                throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
        }
        switch (d) {
            case "HEX":
                c = Y;
                break;
            case "TEXT":
                c = function (c, d, b) {
                    var e = [], x = [], n = 0, k, m, q, l, p, e = d || [0];
                    d = b || 0;
                    q = d >>> 3;
                    if ("UTF8" === a)for (k = 0; k < c.length; k += 1)for (b = c.charCodeAt(k),
                                                                               x = [], 128 > b ? x.push(b) : 2048 > b ? (x.push(192 | b >>> 6), x.push(128 | b & 63)) : 55296 > b || 57344 <= b ? x.push(224 | b >>> 12, 128 | b >>> 6 & 63, 128 | b & 63) : (k += 1, b = 65536 + ((b & 1023) << 10 | c.charCodeAt(k) & 1023), x.push(240 | b >>> 18, 128 | b >>> 12 & 63, 128 | b >>> 6 & 63, 128 | b & 63)), m = 0; m < x.length; m += 1) {
                        p = n + q;
                        for (l = p >>> 2; e.length <= l;)e.push(0);
                        e[l] |= x[m] << 8 * (3 - p % 4);
                        n += 1
                    } else if ("UTF16BE" === a || "UTF16LE" === a)for (k = 0; k < c.length; k += 1) {
                        b = c.charCodeAt(k);
                        "UTF16LE" === a && (m = b & 255, b = m << 8 | b >>> 8);
                        p = n + q;
                        for (l = p >>> 2; e.length <= l;)e.push(0);
                        e[l] |= b << 8 * (2 - p % 4);
                        n += 2
                    }
                    return {
                        value: e,
                        binLen: 8 * n + d
                    }
                };
                break;
            case "B64":
                c = aa;
                break;
            case "BYTES":
                c = Z;
                break;
            case "ARRAYBUFFER":
                try {
                    c = new ArrayBuffer(0)
                } catch (b) {
                    throw Error("ARRAYBUFFER not supported by this environment");
                }
                c = ba;
                break;
            default:
                throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
        }
        return c
    }

    function u(d, a) {
        return d << a | d >>> 32 - a
    }

    function r(d, a) {
        return d >>> a | d << 32 - a
    }

    function l(d, a) {
        var c = null, c = new b(d.a, d.b);
        return c = 32 >= a ? new b(c.a >>> a | c.b << 32 - a & 4294967295, c.b >>> a | c.a << 32 - a & 4294967295) : new b(c.b >>> a - 32 | c.a << 64 -
            a & 4294967295, c.a >>> a - 32 | c.b << 64 - a & 4294967295)
    }

    function T(d, a) {
        var c = null;
        return c = 32 >= a ? new b(d.a >>> a, d.b >>> a | d.a << 32 - a & 4294967295) : new b(0, d.a >>> a - 32)
    }

    function ca(d, a, c) {
        return d & a ^ ~d & c
    }

    function da(d, a, c) {
        return new b(d.a & a.a ^ ~d.a & c.a, d.b & a.b ^ ~d.b & c.b)
    }

    function U(d, a, c) {
        return d & a ^ d & c ^ a & c
    }

    function ea(d, a, c) {
        return new b(d.a & a.a ^ d.a & c.a ^ a.a & c.a, d.b & a.b ^ d.b & c.b ^ a.b & c.b)
    }

    function fa(d) {
        return r(d, 2) ^ r(d, 13) ^ r(d, 22)
    }

    function ga(d) {
        var a = l(d, 28), c = l(d, 34);
        d = l(d, 39);
        return new b(a.a ^ c.a ^ d.a, a.b ^ c.b ^ d.b)
    }

    function ha(d) {
        return r(d, 6) ^ r(d, 11) ^ r(d, 25)
    }

    function ia(d) {
        var a = l(d, 14), c = l(d, 18);
        d = l(d, 41);
        return new b(a.a ^ c.a ^ d.a, a.b ^ c.b ^ d.b)
    }

    function ja(d) {
        return r(d, 7) ^ r(d, 18) ^ d >>> 3
    }

    function ka(d) {
        var a = l(d, 1), c = l(d, 8);
        d = T(d, 7);
        return new b(a.a ^ c.a ^ d.a, a.b ^ c.b ^ d.b)
    }

    function la(d) {
        return r(d, 17) ^ r(d, 19) ^ d >>> 10
    }

    function ma(d) {
        var a = l(d, 19), c = l(d, 61);
        d = T(d, 6);
        return new b(a.a ^ c.a ^ d.a, a.b ^ c.b ^ d.b)
    }

    function A(d, a) {
        var c = (d & 65535) + (a & 65535);
        return ((d >>> 16) + (a >>> 16) + (c >>> 16) & 65535) << 16 | c & 65535
    }

    function na(d, a,
                c, b) {
        var f = (d & 65535) + (a & 65535) + (c & 65535) + (b & 65535);
        return ((d >>> 16) + (a >>> 16) + (c >>> 16) + (b >>> 16) + (f >>> 16) & 65535) << 16 | f & 65535
    }

    function B(d, a, c, b, f) {
        var e = (d & 65535) + (a & 65535) + (c & 65535) + (b & 65535) + (f & 65535);
        return ((d >>> 16) + (a >>> 16) + (c >>> 16) + (b >>> 16) + (f >>> 16) + (e >>> 16) & 65535) << 16 | e & 65535
    }

    function oa(d, a) {
        var c, e, f;
        c = (d.b & 65535) + (a.b & 65535);
        e = (d.b >>> 16) + (a.b >>> 16) + (c >>> 16);
        f = (e & 65535) << 16 | c & 65535;
        c = (d.a & 65535) + (a.a & 65535) + (e >>> 16);
        e = (d.a >>> 16) + (a.a >>> 16) + (c >>> 16);
        return new b((e & 65535) << 16 | c & 65535, f)
    }

    function pa(d,
                a, c, e) {
        var f, h, g;
        f = (d.b & 65535) + (a.b & 65535) + (c.b & 65535) + (e.b & 65535);
        h = (d.b >>> 16) + (a.b >>> 16) + (c.b >>> 16) + (e.b >>> 16) + (f >>> 16);
        g = (h & 65535) << 16 | f & 65535;
        f = (d.a & 65535) + (a.a & 65535) + (c.a & 65535) + (e.a & 65535) + (h >>> 16);
        h = (d.a >>> 16) + (a.a >>> 16) + (c.a >>> 16) + (e.a >>> 16) + (f >>> 16);
        return new b((h & 65535) << 16 | f & 65535, g)
    }

    function qa(d, a, c, e, f) {
        var h, g, l;
        h = (d.b & 65535) + (a.b & 65535) + (c.b & 65535) + (e.b & 65535) + (f.b & 65535);
        g = (d.b >>> 16) + (a.b >>> 16) + (c.b >>> 16) + (e.b >>> 16) + (f.b >>> 16) + (h >>> 16);
        l = (g & 65535) << 16 | h & 65535;
        h = (d.a & 65535) + (a.a &
            65535) + (c.a & 65535) + (e.a & 65535) + (f.a & 65535) + (g >>> 16);
        g = (d.a >>> 16) + (a.a >>> 16) + (c.a >>> 16) + (e.a >>> 16) + (f.a >>> 16) + (h >>> 16);
        return new b((g & 65535) << 16 | h & 65535, l)
    }

    function y(d) {
        var a, c;
        if ("SHA-1" === d)d = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]; else switch (a = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], c = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], d) {
            case "SHA-224":
                d = a;
                break;
            case "SHA-256":
                d = c;
                break;
            case "SHA-384":
                d =
                    [new b(3418070365, a[0]), new b(1654270250, a[1]), new b(2438529370, a[2]), new b(355462360, a[3]), new b(1731405415, a[4]), new b(41048885895, a[5]), new b(3675008525, a[6]), new b(1203062813, a[7])];
                break;
            case "SHA-512":
                d = [new b(c[0], 4089235720), new b(c[1], 2227873595), new b(c[2], 4271175723), new b(c[3], 1595750129), new b(c[4], 2917565137), new b(c[5], 725511199), new b(c[6], 4215389547), new b(c[7], 327033209)];
                break;
            default:
                throw Error("Unknown SHA variant");
        }
        return d
    }

    function M(d, a) {
        var c = [], b, f, e, g, l, n, k;
        b = a[0];
        f = a[1];
        e = a[2];
        g = a[3];
        l = a[4];
        for (k = 0; 80 > k; k += 1)c[k] = 16 > k ? d[k] : u(c[k - 3] ^ c[k - 8] ^ c[k - 14] ^ c[k - 16], 1), n = 20 > k ? B(u(b, 5), f & e ^ ~f & g, l, 1518500249, c[k]) : 40 > k ? B(u(b, 5), f ^ e ^ g, l, 1859775393, c[k]) : 60 > k ? B(u(b, 5), U(f, e, g), l, 2400959708, c[k]) : B(u(b, 5), f ^ e ^ g, l, 3395469782, c[k]), l = g, g = e, e = u(f, 30), f = b, b = n;
        a[0] = A(b, a[0]);
        a[1] = A(f, a[1]);
        a[2] = A(e, a[2]);
        a[3] = A(g, a[3]);
        a[4] = A(l, a[4]);
        return a
    }

    function X(b, a, c, e) {
        var f;
        for (f = (a + 65 >>> 9 << 4) + 15; b.length <= f;)b.push(0);
        b[a >>> 5] |= 128 << 24 - a % 32;
        a += c;
        b[f] = a & 4294967295;
        b[f - 1] = a / 4294967296 | 0;
        a = b.length;
        for (f = 0; f < a; f += 16)e = M(b.slice(f, f + 16), e);
        return e
    }

    function N(d, a, c) {
        var l, f, h, g, r, n, k, m, q, v, p, u, t, w, y, D, E, F, G, H, I, J, z = [], K;
        if ("SHA-224" === c || "SHA-256" === c)v = 64, u = 1, J = Number, t = A, w = na, y = B, D = ja, E = la, F = fa, G = ha, I = U, H = ca, K = e; else if ("SHA-384" === c || "SHA-512" === c)v = 80, u = 2, J = b, t = oa, w = pa, y = qa, D = ka, E = ma, F = ga, G = ia, I = ea, H = da, K = V; else throw Error("Unexpected error in SHA-2 implementation");
        c = a[0];
        l = a[1];
        f = a[2];
        h = a[3];
        g = a[4];
        r = a[5];
        n = a[6];
        k = a[7];
        for (p = 0; p < v; p += 1)16 > p ? (q = p * u, m = d.length <= q ? 0 : d[q], q = d.length <= q + 1 ?
            0 : d[q + 1], z[p] = new J(m, q)) : z[p] = w(E(z[p - 2]), z[p - 7], D(z[p - 15]), z[p - 16]), m = y(k, G(g), H(g, r, n), K[p], z[p]), q = t(F(c), I(c, l, f)), k = n, n = r, r = g, g = t(h, m), h = f, f = l, l = c, c = t(m, q);
        a[0] = t(c, a[0]);
        a[1] = t(l, a[1]);
        a[2] = t(f, a[2]);
        a[3] = t(h, a[3]);
        a[4] = t(g, a[4]);
        a[5] = t(r, a[5]);
        a[6] = t(n, a[6]);
        a[7] = t(k, a[7]);
        return a
    }

    var e, V;
    e = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078,
        604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
    V = [new b(e[0], 3609767458),
        new b(e[1], 602891725), new b(e[2], 3964484399), new b(e[3], 2173295548), new b(e[4], 4081628472), new b(e[5], 3053834265), new b(e[6], 2937671579), new b(e[7], 3664609560), new b(e[8], 2734883394), new b(e[9], 1164996542), new b(e[10], 1323610764), new b(e[11], 3590304994), new b(e[12], 4068182383), new b(e[13], 991336113), new b(e[14], 633803317), new b(e[15], 3479774868), new b(e[16], 2666613458), new b(e[17], 944711139), new b(e[18], 2341262773), new b(e[19], 2007800933), new b(e[20], 1495990901), new b(e[21], 1856431235), new b(e[22],
            3175218132), new b(e[23], 2198950837), new b(e[24], 3999719339), new b(e[25], 766784016), new b(e[26], 2566594879), new b(e[27], 3203337956), new b(e[28], 1034457026), new b(e[29], 2466948901), new b(e[30], 3758326383), new b(e[31], 168717936), new b(e[32], 1188179964), new b(e[33], 1546045734), new b(e[34], 1522805485), new b(e[35], 2643833823), new b(e[36], 2343527390), new b(e[37], 1014477480), new b(e[38], 1206759142), new b(e[39], 344077627), new b(e[40], 1290863460), new b(e[41], 3158454273), new b(e[42], 3505952657), new b(e[43],
            106217008), new b(e[44], 3606008344), new b(e[45], 1432725776), new b(e[46], 1467031594), new b(e[47], 851169720), new b(e[48], 3100823752), new b(e[49], 1363258195), new b(e[50], 3750685593), new b(e[51], 3785050280), new b(e[52], 3318307427), new b(e[53], 3812723403), new b(e[54], 2003034995), new b(e[55], 3602036899), new b(e[56], 1575990012), new b(e[57], 1125592928), new b(e[58], 2716904306), new b(e[59], 442776044), new b(e[60], 593698344), new b(e[61], 3733110249), new b(e[62], 2999351573), new b(e[63], 3815920427), new b(3391569614,
            3928383900), new b(3515267271, 566280711), new b(3940187606, 3454069534), new b(4118630271, 4000239992), new b(116418474, 1914138554), new b(174292421, 2731055270), new b(289380356, 3203993006), new b(460393269, 320620315), new b(685471733, 587496836), new b(852142971, 1086792851), new b(1017036298, 365543100), new b(1126000580, 2618297676), new b(1288033470, 3409855158), new b(1501505948, 4234509866), new b(1607167915, 987167468), new b(1816402316, 1246189591)];
    "function" === typeof define && define.amd ? define(function () {
        return w
    }) :
        "undefined" !== typeof exports ? "undefined" !== typeof module && module.exports ? module.exports = exports = w : exports = w : W.jsSHA = w
})(this);
