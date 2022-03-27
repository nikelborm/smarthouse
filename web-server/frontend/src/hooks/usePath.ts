import { useLocation } from 'react-router';

export function usePath() {
  const path = useLocation().pathname.replace(/\/$/, '');
  const pathParts = path.split('/').filter((e) => e);
  const deepestPathPart = pathParts[pathParts.length - 1];
  return {
    path,
    pathParts,
    deepestPathPart,
  };
}
