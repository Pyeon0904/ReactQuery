import {useQuery, useQueryClient} from "@tanstack/react-query";

import type {Treatment} from "@shared/types";

import {axiosInstance} from "@/axiosInstance";
import {queryKeys} from "@/react-query/constants";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const {data} = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // TODO: get data from server via useQuery
  const fallback: Treatment[] = [];
  const {data = fallback} = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });
  return data;
}

export function usePrefetchTreatments(): void { // 아무것도 반환하지 않는 이유는, cache를 채우는 것이기에
  const queryClient = useQueryClient(); // prefetchQuery를 가져오기 위해 useQueryClient 호출
  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments], // QueryKey는 동일한 것으로!
    queryFn: getTreatments, // QueryFn()도 동일한 것으로!
  });
}