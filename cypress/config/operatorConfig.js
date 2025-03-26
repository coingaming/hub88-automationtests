import crypto from 'crypto';

export const baseUrl = 'https://api.server1.ih.testenv.io'; 
export const operatorID = '1205';
export const currencyCode = 'EUR';
export const gameCode = 'clt_astrowild, clt_basketballpro';
export const countryCode = 'FI';
export const langCode = 'en';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----MIICWgIBAAKBgHg3P1j/W4du6vnIq51kR6CnPzYCMm3AkM9nmGrtc3/pB31NqQ5e5v/Q2RQLWkYXQQA9xhpMCX+PbpzzxQRdWLhom39HhZHgbPUELoMtjPPfGf8dobIJKUKmbOdb4BsZuhsQVmXnRs8FQiqPo7X5vMH0lFvgEVymKZXZs+J6beg9AgMBAAECgYBxEUV7p3GnCCPpm1wOROs5pxRE7/wOTjflW0J4D626eKqaqBiBc7FAmmYR/DuEAQsZ9wAEa8/jMjyPUpfTaxitxb1rr1pxCnijodPf2RkS4pAnEZ41FzIWP8X9g3Yo68u9+etwDkgNwIuCkfZJ96Me3keMAcRl5WPdZ4bY93ET4QJBAN985X21TqRZajvzCNfVUHg7IAhgBcByxveNy5hMLMNi3eEioAcGu8Uhr8aeYNO5LhoE/AW+1r7HCyBzqhQLa3cCQQCJtE62e/f+EjiSpGVh37l7Qhu2LWk2k0ZqV/WukHUXKQxz5/HkZyobX+TANmxQp2rIF+ugLTZr+rOcGD+VbE7rAkBa31YRP1+yxAjGR5QY7svBl4j23tR35DOzBRz72D17VQATQxj+wmYnSgNHJ68HaAyu18gCLg7zk8uabm2BqQMRAkAUC485uSoMbhKWJiAr8ylI7AKkrk+WhjHF4S/+TUD+MheB982adfoHKhpecI2r3/MHVZQTKQG3DjN/EXiQA8gpAkBwW+CkAcKD1eAovnhU0VkilN1LZ1ErFEgLC7bkL/c4mEJeSVR6NTzVVvWQYy7n6O70lszdRBqzeJep6oDzlMi4-----END RSA PRIVATE KEY-----`;

export function generateSignature(payload) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(JSON.stringify(payload));
    return sign.sign(privateKey, 'hex');
}