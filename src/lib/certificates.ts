import { API_BASE, ApiError } from '@/lib/api';

const extractFileName = (contentDisposition: string | null, fallback: string): string => {
  if (!contentDisposition) {
    return fallback;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (fileNameMatch?.[1]) {
    return fileNameMatch[1];
  }

  return fallback;
};

export const downloadCertificatePdf = async (uuid: string, fallbackFileName?: string): Promise<void> => {
  if (typeof window === 'undefined') {
    throw new ApiError('Certificate downloads are only available in the browser.', 0);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: Record<string, string> = {
    'Accept': 'application/pdf, application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Construct URL carefully to avoid double slashes
  const baseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const downloadUrl = `${baseUrl}/my-certificates/${uuid}/download`;

  const response = await fetch(downloadUrl, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    let message = 'Could not download the certificate PDF.';

    if (contentType.includes('application/json')) {
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (payload?.message) {
        message = payload.message;
      }
    }

    throw new ApiError(message, response.status);
  }

  const blob = await response.blob();
  const fileName = extractFileName(
    response.headers.get('content-disposition'),
    fallbackFileName ?? `ScriptNex-Certificate-${uuid}.pdf`,
  );

  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
};
