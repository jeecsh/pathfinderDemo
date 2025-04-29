// We can't use the useAuth hook directly here because it's a React hook
// Instead, we'll access localStorage directly to get the token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export type LogAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'enable'
  | 'disable';

export type LogEntity =
  | 'admin_user'
  | 'mobile_user'
  | 'announcement'
  | 'subscription'
  | 'setting';

interface LogParams {
  action: LogAction;
  entity: LogEntity;
  entity_id?: string;
  details?: Record<string, unknown>;
}

export async function logActivity({ action, entity, entity_id, details }: LogParams): Promise<boolean> {
  try {
    const token = getToken();

    if (!token) {
      console.error('Cannot log activity: No authentication token');
      return false;
    }

    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action,
        entity,
        entity_id,
        details
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error logging activity:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to log activity:', error);
    return false;
  }
}
