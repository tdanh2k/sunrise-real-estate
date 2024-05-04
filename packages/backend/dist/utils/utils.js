"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atob = void 0;
const atob = (base64) => {
    const buffer = Buffer.from(base64, "base64");
    return buffer.toString("binary");
};
exports.atob = atob;
