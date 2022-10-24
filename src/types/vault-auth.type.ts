export type VaultAuth = {
  request_id: string;
  lease_id: string;
  renewable: boolean;
  lease_duration: number;
  auth: {
    client_token: string;
    accessor: string;
    policies: Array<string>;
    token_policies: Array<string>;
    metadata: { role_name: string };
    lease_duration: number;
    renewable: boolean;
    entity_id: string;
    token_type: string;
    orphan: boolean;
  };
};
