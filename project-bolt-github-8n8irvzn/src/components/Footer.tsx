import { Building2, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span className="text-lg font-bold">DataEntry Pro</span>
            </div>
            <p className="text-gray-400">
              Streamlining data entry workflows with advanced management tools.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Documentation</li>
              <li>Support</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 text-gray-400">
              <Twitter className="h-6 w-6 hover:text-white cursor-pointer" />
              <Github className="h-6 w-6 hover:text-white cursor-pointer" />
              <Linkedin className="h-6 w-6 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DataEntry Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}