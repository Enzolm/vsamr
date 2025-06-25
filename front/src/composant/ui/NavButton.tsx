import { useState } from "react";

// Un bouton principal avec plusieurs sous-boutons
type NavButtonPropsData = {
  title: string;
  to: string;
};

type DropdownProps = {
  title: string;
  items: { to: string; label: string }[];
};

export function NavButton({ title, data }: { title: string; data: NavButtonPropsData[] }) {
  return (
    <div className="text-center group relative hover:cursor-pointer overflow-visible transition-all duration-300">
      <h2 className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10">{title}</h2>

      <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-64 bg-cgreen2 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 z-50 pt-1">
        <div className="flex flex-col p-2">
          {data.map((sub, subIndex) => (
            <a key={subIndex} href={sub.to} className="text-white px-4 py-3 my-1 rounded-lg hover:bg-white/10 transition-colors text-center text-sm font-medium">
              {sub.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DropdownButton({ title, items }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="relative w-48">
      <div className="bg-cgreen2 text-white font-semibold text-center py-3 px-4 rounded-t shadow cursor-pointer transition-all duration-300">{title}</div>

      <div className={`hoverflow-visible bg-white rounded-b shadow transition-all absolute duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        {items.map((item, index) => (
          <a key={index} href={item.to} className="block px-4 py-2 text-cgreen2 hover:bg-gray-100">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default { NavButton, DropdownButton };
