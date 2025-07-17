import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">
              TalentMatch AI
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <NavItem label="Features" hasDropdown>
              <DropdownMenu>
                <DropdownItem>AI Conversation Engine</DropdownItem>
                <DropdownItem>Candidate Intelligence</DropdownItem>
                <DropdownItem>Bot Detection</DropdownItem>
                <DropdownItem>Smart Ranking</DropdownItem>
              </DropdownMenu>
            </NavItem>
            <NavItem label="Solutions" hasDropdown>
              <DropdownMenu>
                <DropdownItem>Enterprise</DropdownItem>
                <DropdownItem>Mid-Market</DropdownItem>
                <DropdownItem>Staffing Agencies</DropdownItem>
              </DropdownMenu>
            </NavItem>
            <NavItem label="Pricing" />
            <NavItem label="Resources" hasDropdown>
              <DropdownMenu>
                <DropdownItem>Blog</DropdownItem>
                <DropdownItem>Case Studies</DropdownItem>
                <DropdownItem>Documentation</DropdownItem>
              </DropdownMenu>
            </NavItem>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              Log In
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-white px-4 pt-2 pb-4 border-b border-gray-200">
          <div className="flex flex-col space-y-3">
            <MobileNavItem label="Features" />
            <MobileNavItem label="Solutions" />
            <MobileNavItem label="Pricing" />
            <MobileNavItem label="Resources" />
            <div className="pt-4 flex flex-col space-y-3">
              <button className="text-gray-600 py-2">Log In</button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                Get Started
              </button>
            </div>
          </div>
        </div>}
    </header>;
};
const NavItem = ({
  label,
  hasDropdown = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
        {label}
        {hasDropdown && <ChevronDown size={16} className="ml-1" />}
      </button>
      {hasDropdown && isOpen && children}
    </div>;
};
const DropdownMenu = ({
  children
}) => {
  return <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
      {children}
    </div>;
};
const DropdownItem = ({
  children
}) => {
  return <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      {children}
    </a>;
};
const MobileNavItem = ({
  label
}) => {
  return <button className="flex justify-between items-center w-full py-2 text-gray-600">
      <span>{label}</span>
      {label !== 'Pricing' && <ChevronDown size={16} />}
    </button>;
};