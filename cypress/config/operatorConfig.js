import crypto from 'crypto';

export const baseUrl = 'YOUR_OPERATOR_BASE_URL'; 
export const operatorID = 'YOUR_OPERATOR_ID';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----\nMIICWgIBAAKBgHg3P1j/W4du6vnIq51kR6CnPzYCMm3AkM9nmGrtc3/pB31NqQ5e\n5v/Q2RQLWkYXQQA9xhpMCX+PbpzzxQRdWLhom39HhZHgbPUELoMtjPPfGf8dobIJ\nKUKmbOdb4BsZuhsQVmXnRs8FQiqPo7X5vMH0lFvgEVymKZXZs+J6beg9AgMBAAEC\ngYBxEUV7p3GnCCPpm1wOROs5pxRE7/wOTjflW0J4D626eKqaqBiBc7FAmmYR/DuE\nAQsZ9wAEa8/jMjyPUpfTaxitxb1rr1pxCnijodPf2RkS4pAnEZ41FzIWP8X9g3Yo\n68u9+etwDkgNwIuCkfZJ96Me3keMAcRl5WPdZ4bY93ET4QJBAN985X21TqRZajvz\nCNfVUHg7IAhgBcByxveNy5hMLMNi3eEioAcGu8Uhr8aeYNO5LhoE/AW+1r7HCyBz\nqhQLa3cCQQCJtE62e/f+EjiSpGVh37l7Qhu2LWk2k0ZqV/WukHUXKQxz5/HkZyob\nX+TANmxQp2rIF+ugLTZr+rOcGD+VbE7rAkBa31YRP1+yxAjGR5QY7svBl4j23tR3\n5DOzBRz72D17VQATQxj+wmYnSgNHJ68HaAyu18gCLg7zk8uabm2BqQMRAkAUC485\nuSoMbhKWJiAr8ylI7AKkrk+WhjHF4S/+TUD+MheB982adfoHKhpecI2r3/MHVZQT\nKQG3DjN/EXiQA8gpAkBwW+CkAcKD1eAovnhU0VkilN1LZ1ErFEgLC7bkL/c4mEJe\nSVR6NTzVVvWQYy7n6O70lszdRBqzeJep6oDzlMi4\n-----END RSA PRIVATE KEY-----`;

export function generateSignature(payload) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(JSON.stringify(payload));
    return sign.sign(privateKey, 'hex');
}