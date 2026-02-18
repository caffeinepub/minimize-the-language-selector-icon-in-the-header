import { useMemo } from 'react';
import { Destination, DestinationsResponse } from './idealDestinationsModel';
import { getIdealDestinations } from './getIdealDestinations';

interface TravelArchetype {
  name: string;
  description: string;
  emoji: string;
  traits: string[];
}

export function useIdealDestinations(
  primary: TravelArchetype,
  secondary?: TravelArchetype
): DestinationsResponse {
  const destinations = useMemo(() => {
    return getIdealDestinations(primary, secondary);
  }, [primary.name, secondary?.name]);

  return {
    destinations,
    isLoading: false,
    error: null
  };
}
