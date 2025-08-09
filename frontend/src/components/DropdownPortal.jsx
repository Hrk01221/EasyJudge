import { createPortal } from "react-dom";

const DropdownPortal = ({ children }) => {
  return createPortal(children, document.getElementById("dropdown-root"));
};

export default DropdownPortal;
