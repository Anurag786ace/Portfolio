// Portfolio API client for Anurag Giri Portfolio
// Integrates with Node/Express + MongoDB backend

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Submit contact inquiry to be stored in MongoDB and trigger email notification
 */
export async function submitContactMessage({ name, email, message, role = 'project' }) {
  const url = `${API_BASE}/api/contact`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, message, role })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to submit message. Please try again.');
  }

  return data;
}

/**
 * Subscribe user email to the circle / newsletter
 */
export async function submitSubscriber(email, source = 'contact_modal') {
  const url = `${API_BASE}/api/subscribe`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, source })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to subscribe. Please try again.');
  }

  return data;
}

/**
 * Fetch received messages (for admin inquiry drawer / status checks)
 */
export async function fetchMessages() {
  const url = `${API_BASE}/api/messages`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Could not fetch messages');
  }
  return data.data;
}

/**
 * Check backend health & database status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) return { online: false, db: 'disconnected' };
    const data = await res.json();
    return { online: true, db: data.database };
  } catch (err) {
    return { online: false, db: 'offline' };
  }
}
