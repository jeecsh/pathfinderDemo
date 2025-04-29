// Request types
interface RegisterData {
  organizationName: string;
  adminEmail: string;
  adminPassword: string;
}

// Response types
interface RegistrationResponse {
  tempToken: string;
  expiresIn: number;
}

export interface OnboardingData {
  customization: {
    org_name: string;
    color_theme: string;
    data_analytics_enabled: boolean;
    share_data_analytics: boolean;
  };
  subscription: {
    tracking_type: string;
    counting_type: string;
    mobile_app_enabled: boolean;
    announcement_enabled: boolean;
    notification_enabled: boolean;
    hardware_devices: {
      type: string;
      quantity: number;
      model: string;
    }[];
  };
  users?: Array<{
    email: string;
    role: string;
    type: string;
    name?: string;
    phone?: string;
  }>;
  vehicles?: Array<{
    name: string;
    type: string;
    plate_number: string;
    driver_email?: string;
  }>;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiConfig = {
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  handleResponse: async (response: Response) => {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  }
};

export const authApi = {
  register: async (data: RegisterData): Promise<RegistrationResponse> => {
    console.log('API Call Data:', data); // Debug request data

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: apiConfig.baseHeaders,
      body: JSON.stringify(data),
    });

    return apiConfig.handleResponse(response);
  },

  completeRegistration: async (tempToken: string, onboardingData: OnboardingData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/complete-registration`, {
      method: 'POST',
      headers: {
        ...apiConfig.baseHeaders,
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify(onboardingData)
    });

    return apiConfig.handleResponse(response);
  },

  login: async (email: string, password: string, rememberMe?: boolean): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: apiConfig.baseHeaders,
      body: JSON.stringify({ email, password, rememberMe }),
    });

    return apiConfig.handleResponse(response);
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: apiConfig.baseHeaders,
    });

    return apiConfig.handleResponse(response);
  },
};
