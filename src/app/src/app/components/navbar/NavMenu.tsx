import { FC } from 'react';
import NavItem from './NavItem';

interface NavMenuProps {
  items: { label: string; href: string }[];
}

const NavMenu: FC<NavMenuProps> = ({ items }) => (
  <div className="flex space-x-6">
    {items.map((item) => (
      <NavItem key={item.href} label={item.label} href={item.href} />
    ))}
  </div>
);

export default NavMenu;
