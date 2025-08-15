import { Configuration, ResponseContext } from '@/lib/gen/runtime';

const Config = new Configuration({
  apiKey: () => 'Bearer ' + localStorage.getItem('token'),
  basePath: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api',
  middleware: [
    {
      async post(context: ResponseContext): Promise<void | Response> {
        const code = context.response.status;
        if (code === 401) {
          alert('Unauthorized access. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userid');
          localStorage.removeItem('role');
          window.location.href = '/login';
        } else if (code === 403) {
          window.location.href = '/403';
        } else if (code === 404) {
          window.location.href = '/404';
        } else if (code === 500) {
          alert('An error occurred. Please try again.');
          // window.location.reload();
        }
      }
    }
  ]
});

export default Config;
