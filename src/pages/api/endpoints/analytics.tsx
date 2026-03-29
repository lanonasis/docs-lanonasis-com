import React from 'react';
import { Redirect } from '@docusaurus/router';

/** Preserves bookmarks and external links to the previous doc URL. */
export default function LegacyAnalyticsDocRedirect(): JSX.Element {
  return <Redirect to="/api/analytics" />;
}
