
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const footerSections = [
    { title: 'Company', links: ['About', 'Blog', 'Careers'] },
    { title: 'Legal', links: ['Legal', 'Privacy', 'Terms'] }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-indigo-600 mb-4">TodoSphere</h3>
          <p className="text-gray-500 max-w-xs">
            The modern way to manage your tasks and projects with ease.
          </p>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <Link to={`/coming-soon/${link}`} className="text-gray-500 hover:text-indigo-600 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} TodoSphere. Built with passion by a CS student.
      </div>
    </footer>
  );
};

export default Footer;
