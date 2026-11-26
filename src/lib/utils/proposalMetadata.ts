import type { ProposalMetadata } from '@secureseco-dao/diamond-governance-sdk';

const gateways = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.filebase.io/ipfs/',
];

async function fetchMetadata(
  gateway: string,
  cid: string
): Promise<ProposalMetadata> {
  const response = await fetch(`${gateway}${encodeURIComponent(cid)}`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`IPFS returned HTTP ${response.status}`);

  const { title, description, body, resources } = (await response.json()) ?? {};
  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('Proposal metadata has no title');
  }

  return {
    title,
    description: typeof description === 'string' ? description : '',
    body: typeof body === 'string' ? body : '',
    resources: Array.isArray(resources) ? resources : [],
  };
}

export async function getProposalMetadata(
  cid: string
): Promise<ProposalMetadata> {
  try {
    return await Promise.any(
      gateways.map((gateway) => fetchMetadata(gateway, cid))
    );
  } catch {
    return {
      title: '',
      description: 'Proposal text is currently unavailable.',
      body: '',
      resources: [],
    };
  }
}
