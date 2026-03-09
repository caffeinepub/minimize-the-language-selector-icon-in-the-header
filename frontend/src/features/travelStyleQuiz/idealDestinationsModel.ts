export interface Destination {
  id: string;
  name: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

export interface DestinationsResponse {
  destinations: Destination[];
  isLoading: boolean;
  error: Error | null;
}
