import { FC } from 'react';
import Link from 'next/link';
import { Typography } from '@mui/material';

interface NavItemProps {
  label: string;
  href: string;
}

const NavItem: FC<NavItemProps> = ({ label, href }) => (
  <Link href={href} passHref>
    <Typography
      component="span" 
      className="relative text-[#3E2723] hover:text-[#5A473D] transition-all duration-300 
                 before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 
                 before:bg-[#3E2723] before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300
                 font-playfair cursor-pointer"
    >
      {label}
    </Typography>
  </Link>
);

export default NavItem;
