import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

/** Preserves bookmarks and external links to the previous doc URL. */
export default function LegacyAnalyticsDocRedirect(): null {
  const history = useHistory();

  useEffect(() => {
    history.replace('/api/analytics');
  }, [history]);

  return null;
}
