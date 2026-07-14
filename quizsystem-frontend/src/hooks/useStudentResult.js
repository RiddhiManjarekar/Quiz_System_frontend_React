import { useQuery } from "@tanstack/react-query";

import {
  getResults,
  getResultDetails,
} from "../api/studentApi";

/*
|--------------------------------------------------------------------------
| Get All Results
|--------------------------------------------------------------------------
*/

export const useResults = () => {
  return useQuery({
    queryKey: ["student-results"],
    queryFn: getResults,
  });
};

/*
|--------------------------------------------------------------------------
| Get Result Details
|--------------------------------------------------------------------------
*/

export const useResult = (attemptId) => {
  return useQuery({
    queryKey: ["student-result", attemptId],
    queryFn: () => getResultDetails(attemptId),
    enabled: !!attemptId,
  });
};