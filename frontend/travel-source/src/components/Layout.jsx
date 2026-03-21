import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "72px" }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
