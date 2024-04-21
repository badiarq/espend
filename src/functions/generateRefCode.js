export function generateRefCode(length) {
    let referenceCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      referenceCode += characters.charAt(index);
    }
    
    return referenceCode;
}