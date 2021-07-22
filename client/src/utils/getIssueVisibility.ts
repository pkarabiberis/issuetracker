export const getIssueVisibility = () => {
  const titleVisibility = {
    base: 'hidden' as VisibilityState,
    sm: 'hidden' as VisibilityState,
    md: 'visible' as VisibilityState,
    lg: 'visible' as VisibilityState,
    '2xl': 'visible' as VisibilityState,
  };

  return titleVisibility;
};
