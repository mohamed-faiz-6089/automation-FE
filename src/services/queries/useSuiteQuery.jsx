// src/services/queries/useSuiteQuery.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSuite, fetchSuites, fetchSuitesByProjectId } from "../API/suiteAPI";

export const useSuiteQuery = () =>
  useQuery({
    queryKey: ["suites"],
    queryFn: fetchSuites,
  });

export const useCreateSuiteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSuite,
    onSuccess: () => {
      queryClient.invalidateQueries(["suites"]);
    },
  });
};

// export const useSuiteByIdQuery = (id) =>
//   useQuery({
//     queryKey: ["suite", id],
//     queryFn: () => fetchSuitesByProjectId(id),
//     enabled: !!id,
//   });

export const useSuitesByProjectIdQuery = (projectId) =>
  useQuery({
    queryKey: ["suites", projectId],
    queryFn: () => fetchSuitesByProjectId(projectId),
    enabled: !!projectId,
  });