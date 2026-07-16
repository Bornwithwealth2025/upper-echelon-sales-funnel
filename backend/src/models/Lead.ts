
export class LeadValidator {

  
  static validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.fullName || data.fullName.trim() === '') {
      errors.push('Full name is required');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.phoneNumber || !this.isValidPhone(data.phoneNumber)) {
      errors.push('Valid phone number is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
  }
}
