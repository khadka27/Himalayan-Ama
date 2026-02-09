import axiosInstance from './axios-instance';

export interface PayoneerSessionRequest {
  orderId: string;
  amount: number;
  full_name: string;
  email: string;
  phone_number: string;
  description?: string;
  isAdvancePayment?: boolean;
  advancePercentage?: number;
  fullAmount?: number;
}

export interface PayoneerSessionResponse {
  success: boolean;
  payment_id: number;
  invoice_number: string;
  redirect_url: string;
  long_id: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  payment: {
    id: number;
    invoice_number: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'canceled';
    payment_gateway: string;
    paid_at: string | null;
    created_at: string;
  };
}

class PayoneerService {
  /**
   * Create a Payoneer payment session
   * @param data Payment session data
   * @returns Payment session response with redirect URL
   */
  async createPaymentSession(data: PayoneerSessionRequest): Promise<PayoneerSessionResponse> {
    try {
      const response = await axiosInstance.post<PayoneerSessionResponse>(
        '/payoneer/session',
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating Payoneer session:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to create payment session'
      );
    }
  }

  /**
   * Get payment status by payment ID
   * @param paymentId Payment ID
   * @returns Payment status
   */
  async getPaymentStatus(paymentId: number): Promise<PaymentStatusResponse> {
    try {
      const response = await axiosInstance.get<PaymentStatusResponse>(
        `/payoneer/status/${paymentId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching payment status:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch payment status'
      );
    }
  }

  /**
   * Redirect user to Payoneer hosted checkout
   * @param redirectUrl Payoneer redirect URL
   */
  redirectToCheckout(redirectUrl: string): void {
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  }
}

export const payoneerService = new PayoneerService();
