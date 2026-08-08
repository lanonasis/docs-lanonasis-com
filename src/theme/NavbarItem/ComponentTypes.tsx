import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import HtmlNavbarItem from '@theme/NavbarItem/HtmlNavbarItem';
import DocNavbarItem from '@theme/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme/NavbarItem/DocSidebarNavbarItem';
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
// Custom build-time search (audit F26) — registered under the `custom-search`
// navbar item type so the schema's /custom-.*/ workaround accepts it.
import SearchNavbarItemCustom from '../SearchNavbarItem';

import type {ComponentTypesObject} from '@theme/NavbarItem/ComponentTypes';

const ComponentTypes: ComponentTypesObject = {
  default: DefaultNavbarItem,
  localeDropdown: LocaleDropdownNavbarItem,
  search: SearchNavbarItem,
  dropdown: DropdownNavbarItem,
  html: HtmlNavbarItem,
  doc: DocNavbarItem,
  docSidebar: DocSidebarNavbarItem,
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
  'custom-search': SearchNavbarItemCustom,
};

export default ComponentTypes;
