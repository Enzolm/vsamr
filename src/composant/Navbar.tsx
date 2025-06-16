import logo from "@/assets/logoclear.png";
import { NavigationMenu, NavigationMenuContent, navigationMenuTriggerStyle, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu";
import { Link } from "react-router";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

function Navbar() {
  return (
    <nav className="flex items-center bg-cgreen p-2 text-black ">
      {/* <ul className="flex space-x-4 items-center">
        <li>
          <a href="/">
            <img src={logo} alt="Logo" className="h-24 mr-6" />
          </a>
        </li>
        <li>
          <a className="font-bold " href="/">
            Accueil
          </a>
        </li>
        <li>
          <a className="font-bold" href="/about">
            La Mairie
          </a>
        </li>
        <li>
          <a className="font-bold" href="/contact">
            Le Village
          </a>
        </li>
        <li>
          <a className="font-bold" href="/services">
            Les Associations
          </a>
        </li>
        <li>
          <a className="font-bold" href="/blog">
            Jeunesse
          </a>
        </li>
        <li>
          <a className="font-bold" href="/blog">
            Salle Polyvalente
          </a>
        </li>
      </ul> */}
      <Link to="/">
        <img src={logo} alt="Logo" className="max-h-20 mr-6 ml-2" />
      </Link>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link className="text-lg" to="/docs">
                <span className="text-lg">Accueil</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:cursor-pointer text-lg">La Mairie</NavigationMenuTrigger>
            <NavigationMenuContent className="bg-cgreen2 shadow-4xl text-black">
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="hover:bg-cgreenLight text-[19px]">
                      Horraires
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="hover:bg-cgreenLight text-lg">
                      Documentation
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="hover:bg-cgreenLight text-lg ">
                      Blocks
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:cursor-pointer text-lg">Le Village</NavigationMenuTrigger>
            <NavigationMenuContent className="bg-cgreen2 shadow-4xl text-black">
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="#">Components</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#">Documentation</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#">Blocks</Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:cursor-pointer text-lg">Associations</NavigationMenuTrigger>
            <NavigationMenuContent className="bg-cgreen2 shadow-4xl text-black">
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex-row items-center gap-2">
                      Backlog
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex-row items-center gap-2">
                      To Do
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex-row items-center gap-2">
                      Done
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:cursor-pointer text-lg">Jeunesse</NavigationMenuTrigger>
            <NavigationMenuContent className="bg-cgreen2 shadow-4xl text-black">
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex-row items-center gap-2">
                      Backlog
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex-row items-center gap-2">
                      To Do
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#" className="flex-row items-center gap-2">
                      Done
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;
