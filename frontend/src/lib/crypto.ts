
export async function computeSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 64);
  } catch {
    // Fallback for environments without crypto.subtle
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0').repeat(4).substring(0, 64);
  }
}

export function getVerificationData(block: { url: string; timestamp: string; prediction: string }): string {
  // Use JSON.stringify for absolute consistency in property ordering and typing
  return JSON.stringify({
    url: block.url,
    timestamp: block.timestamp,
    prediction: block.prediction
  });
}
