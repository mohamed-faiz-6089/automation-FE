import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, fetchProjects } from "../API/projectAPI";

export const useProjectQuery = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
};


