import { Link } from "react-router-dom";
function Footer(){
    return (
      <footer className="bg-gray-900 text-gray-300 mt-12">
        <div className="max-w-7x1 mx-auto px-6 py-8 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white ">
              Tesfsh Electronics Store
            </h3>
            <p className="text-sm mt-2">Your one-stop shop for electronics</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">
              Quick Links
            </h4>
            <ul className="space-y-1 text-sm  ">
              <li className="hover:underline">
                <Link to="/">Home</Link>
              </li>
              <li className="hover:underline">
                <Link to="/Cart">Cart</Link>
              </li>
            </ul>
          </div>
          <div className="text-sm md:text-right">
            <p>© {new Date().getFullYear()} Tesfsh Electronics Store</p>
            <p className="text-gray-400">All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
}

export default Footer;