import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt, // Dashboard
  faList, // Orders
  faBox, // Products
  faUsers, // Customers
  faEnvelope, // Email
  faTools, // Tools
  faBars,
  faAngleDown,
  faAngleRight,
  faTruck, // Shipping
  faTags, // Coupons
  faPlus, // Add Product
  faEdit, // Edit Product
  faLayerGroup, // Category
  faCrop, // Image Cropper
} from "@fortawesome/free-solid-svg-icons";
import Category from "../Category/Category";
import Crop from "../Crop/Crop";
import Customer from "../CustomerProfile/Customer";
import EditProduct from "../EditProduct/EditProduct";
import EditProductPage from "../EditProduct/EditProductPage";
import Email from "../Email/Email";
import Order from "../order/Order";
import SingleOrder from "../order/SingleOrder";
import PerformanceBoard from "../PerformanceBoard/PerformanceBoard";
import Product from "../Product/Product";
import Tools from "../Tools/Tools";
import Coupon from "../Coupon/Coupon";
import Shipping from "../Shipping/Shipping";
import "bootstrap/dist/css/bootstrap.min.css";

const themes = {
  dark: {
    sidebar: { backgroundColor: "#0B2948", color: "#d1d8e0" },
    menu: {
      icon: "#1abc9c", // Default icon color
      activeIcon: "#fff", // Icon color when active
      hover: { backgroundColor: "#2e5e82", color: "#fff" },
      active: { backgroundColor: "#1abc9c", color: "#fff" },
      submenu: {
        backgroundColor: "#1a3c5e",
        hover: "linear-gradient(90deg, #346d9b, #2e5e82)",
        active: "#1abc9c",
      },
    },
  },
};

// Sidebar Header Component
const SidebarHeader = ({ collapsed, toggleSidebar }) => (
  <div
    className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom"
    style={{ backgroundColor: "#0B2948", color: "#fff" }}
  >
    {!collapsed && (
      <div
        className="text-center w-100"
        style={{ fontWeight: "bold", fontSize: "1.2rem", userSelect: "none" }}
      >
        <span style={{ color: "#1abc9c" }}>Aihomesd</span>{" "}
        <span style={{ color: "#d1d8e0" }}>Dashboard</span>
      </div>
    )}
    <button
      className="btn text-white d-md-none"
      onClick={toggleSidebar}
      style={{ padding: "5px" }}
    >
      <FontAwesomeIcon icon={faBars} />
    </button>
  </div>
);

// Sidebar Footer Component
const SidebarFooter = ({ collapsed }) => (
  <div
    className="text-center py-2 border-top"
    style={{ backgroundColor: "#0B2948", color: "#d1d8e0" }}
  >
    {!collapsed && (
      <p className="mb-0 small" style={{ userSelect: "none" }}>
        Developed by{" "}
        <a
          href="https://araflogix.com/"
          style={{ color: "#1abc9c", textDecoration: "none" }}
        >
          ArafLogix
        </a>
      </p>
    )}
  </div>
);

// Sidebar Menu Item Component
const MenuItem = ({ label, icon, active, onClick, hasSubmenu, collapsed, isSubmenu }) => (
  <div
    className={`w-100 ${isSubmenu ? "ps-4" : "px-3"} py-2`}
    style={{
      backgroundColor: active ? themes.dark.menu.active.backgroundColor : "transparent",
      color: active ? themes.dark.menu.active.color : "#d1d8e0",
      cursor: "pointer",
      transition: "all 0.3s ease",
      borderRadius: "8px",
      margin: isSubmenu ? "5px 0" : "5px 0",
      ...(isSubmenu && { borderLeft: active ? "3px solid #fff" : "none" }),
      userSelect: "none", // Prevent text selection
    }}
    onClick={onClick}
    onMouseEnter={(e) =>
      !active && (e.currentTarget.style.backgroundColor = themes.dark.menu.hover.backgroundColor)
    }
    onMouseLeave={(e) =>
      !active && (e.currentTarget.style.backgroundColor = "transparent")
    }
  >
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={icon}
          style={{
            color: active ? themes.dark.menu.activeIcon : themes.dark.menu.icon,
            marginRight: collapsed ? "0" : "10px",
          }}
        />
        {!collapsed && <span>{label}</span>}
      </div>
      {hasSubmenu && !collapsed && (
        <FontAwesomeIcon
          icon={active ? faAngleDown : faAngleRight}
          style={{ color: active ? themes.dark.menu.activeIcon : themes.dark.menu.icon }}
        />
      )}
    </div>
  </div>
);

export const Playground = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [mainMenu, setMainMenu] = useState("");
  const [subMenu, setSubMenu] = useState("");
  const [nestedMenu, setNestedMenu] = useState("");
  const [productSubmenuOpen, setProductSubmenuOpen] = useState(false);

  const setActiveOption = (props) => {
    setNestedMenu("");
    const parts = props.split("/");
    const newUrl = `${window.location.origin}/dashboard/${props}`;
    if (parts.length > 1) {
      setMainMenu(parts[0]);
      setSubMenu(parts[1]);
      if (parts[0] === "product") setProductSubmenuOpen(true);
    } else {
      setMainMenu(props);
      setSubMenu("");
      setProductSubmenuOpen(false);
    }
    window.history.pushState({}, "", newUrl);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setToggled(!toggled);
  };

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean); // Remove empty strings from split
    if (parts.length >= 2) {
      setMainMenu(parts[1]); // e.g., "product"
      if (parts.length >= 3) {
        setSubMenu(parts[2]); // e.g., "product-edit"
        if (parts[1] === "product") {
          setProductSubmenuOpen(true);
        }
      }
      if (parts.length >= 4) {
        setNestedMenu(parts[3].split("=")[0]); // e.g., "productId"
      }
    }
  }, []);

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeString = currentDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`sidebar-container ${toggled ? "d-block" : "d-none d-md-block"}`}
        style={{
          backgroundColor: themes.dark.sidebar.backgroundColor,
          width: collapsed ? "80px" : "260px",
          height: "100vh",
          position: "fixed",
          zIndex: 1050,
          transition: "width 0.3s ease",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="d-flex flex-column h-100">
          <SidebarHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />
          <div className="flex-grow-1 px-2">
            <MenuItem
              label="Dashboard"
              icon={faTachometerAlt}
              active={mainMenu === "board" && subMenu === "performance-board"}
              onClick={() => setActiveOption("board/performance-board")}
              collapsed={collapsed}
            />
            <MenuItem
              label="Orders"
              icon={faList}
              active={mainMenu === "order" && subMenu === "order-list"}
              onClick={() => setActiveOption("order/order-list")}
              collapsed={collapsed}
            />
            <div>
              <MenuItem
                label="Products"
                icon={faBox}
                active={mainMenu === "product"}
                onClick={() => setProductSubmenuOpen(!productSubmenuOpen)}
                hasSubmenu
                collapsed={collapsed}
              />
              {productSubmenuOpen && !collapsed && (
                <div
                  style={{
                    backgroundColor: themes.dark.menu.submenu.backgroundColor,
                    borderRadius: "8px",
                    padding: "5px",
                  }}
                >
                  <MenuItem
                    label="Add Product"
                    icon={faPlus}
                    active={subMenu === "product-add"}
                    onClick={() => setActiveOption("product/product-add")}
                    collapsed={collapsed}
                    isSubmenu
                  />
                  <MenuItem
                    label="Edit Product"
                    icon={faEdit}
                    active={subMenu === "product-edit"}
                    onClick={() => setActiveOption("product/product-edit")}
                    collapsed={collapsed}
                    isSubmenu
                  />
                  <MenuItem
                    label="Category"
                    icon={faLayerGroup}
                    active={subMenu === "product-category"}
                    onClick={() => setActiveOption("product/product-category")}
                    collapsed={collapsed}
                    isSubmenu
                  />
                  <MenuItem
                    label="Image Cropper"
                    icon={faCrop}
                    active={subMenu === "product-image-cropper"}
                    onClick={() => setActiveOption("product/product-image-cropper")}
                    collapsed={collapsed}
                    isSubmenu
                  />
                </div>
              )}
            </div>
            <MenuItem
              label="Customers"
              icon={faUsers}
              active={mainMenu === "user" && subMenu === "register-customer"}
              onClick={() => setActiveOption("user/register-customer")}
              collapsed={collapsed}
            />
            <MenuItem
              label="Shipping"
              icon={faTruck}
              active={mainMenu === "shipping" && subMenu === "shipping-setting"}
              onClick={() => setActiveOption("shipping/shipping-setting")}
              collapsed={collapsed}
            />
            <MenuItem
              label="Coupons"
              icon={faTags}
              active={mainMenu === "coupon" && subMenu === "list-coupon"}
              onClick={() => setActiveOption("coupon/list-coupon")}
              collapsed={collapsed}
            />
            <MenuItem
              label="Email"
              icon={faEnvelope}
              active={mainMenu === "message" && subMenu === "email"}
              onClick={() => setActiveOption("message/email")}
              collapsed={collapsed}
            />
            <MenuItem
              label="Tools"
              icon={faTools}
              active={mainMenu === "tool" && subMenu === "Tools"}
              onClick={() => setActiveOption("tool/Tools")}
              collapsed={collapsed}
            />
          </div>
          <SidebarFooter collapsed={collapsed} />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: collapsed ? "80px" : "260px",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-between px-4 py-2 shadow-sm"
          style={{
            position: "fixed",
            top: 0,
            left: collapsed ? "80px" : "260px",
            right: 0,
            background: "linear-gradient(90deg, #0B2948, #1abc9c)",
            color: "#fff",
            height: "60px",
            zIndex: 1000,
            transition: "left 0.3s ease",
          }}
        >
          <h5 className="mb-0" style={{ userSelect: "none" }}>
            {subMenu === ""
              ? "Dashboard"
              : subMenu === "performance-board"
              ? "Dashboard"
              : subMenu === "order-list"
              ? "Orders"
              : subMenu === "product-add"
              ? "Add Product"
              : subMenu === "product-edit"
              ? "Edit Product"
              : subMenu === "product-category"
              ? "Category"
              : subMenu === "product-image-cropper"
              ? "Image Cropper"
              : subMenu === "register-customer"
              ? "Customers"
              : subMenu === "shipping-setting"
              ? "Shipping Settings"
              : subMenu === "list-coupon"
              ? "Coupons"
              : subMenu === "email"
              ? "Email"
              : subMenu === "Tools"
              ? "Tools"
              : "Dashboard"}
          </h5>
          <div className="d-none d-md-block" style={{ userSelect: "none" }}>
            {dateString} | {timeString}
          </div>
          <button
            className="btn btn-light btn-sm d-md-none"
            onClick={() => setToggled(!toggled)}
            style={{ marginLeft: "10px" }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <div className="" style={{ marginTop: "60px" }}>
          {mainMenu === "product" && (
            <div>
              {nestedMenu === "productId" ? (
                <EditProductPage />
              ) : (
                <>
                  {subMenu === "product-add" && <Product />}
                  {subMenu === "product-edit" && <EditProduct />}
                  {subMenu === "product-category" && <Category />}
                  {subMenu === "product-image-cropper" && <Crop />}
                </>
              )}
            </div>
          )}
          {mainMenu === "order" && (
            <div>
              {nestedMenu === "orderId" ? <SingleOrder /> : subMenu === "order-list" && <Order />}
            </div>
          )}
          {(mainMenu === "" || subMenu === "performance-board") && <PerformanceBoard />}
          {subMenu === "register-customer" && <Customer />}
          {subMenu === "shipping-setting" && <Shipping />}
          {subMenu === "list-coupon" && <Coupon />}
          {subMenu === "email" && <Email />}
          {subMenu === "Tools" && <Tools />}
        </div>
      </div>
    </div>
  );
};