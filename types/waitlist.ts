export interface WaitlistFormData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface WaitlistApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
}
