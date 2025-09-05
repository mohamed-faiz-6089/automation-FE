import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, fetchProjects } from "../API/projectAPI";

export const useProjectQuery = (id, roleName) =>
  useQuery({
    queryKey: ["projects", id, roleName],
    queryFn: ({ queryKey }) => {
      const [, userId, role] = queryKey;
      return fetchProjects(userId, role);
    },
    enabled: !!id && !!roleName,
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


