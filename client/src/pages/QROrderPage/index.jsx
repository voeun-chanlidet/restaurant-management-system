import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MenuView from "./MenuView";
import OrderStatusView from "./OrderStatusView";
import CartDrawer from "./CartDrawer";
import api from "../../services/api";
import { io } from "socket.io-client";
import useQROrderSocket from "../../hooks/useQROrderSocket";

// Views: "loading" | "error" | "menu" | "status"
export default function QROrderPage() {
  const { tableId } = useParams();

  const [table, setTable] = useState(null);
  const [session, setSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [view, setView] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  // Cart — persisted to localStorage so refreshing doesn't wipe it
  const CART_KEY = `qr_cart_${tableId}`;
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`qr_cart_${tableId}`)) || [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Orders placed this visit (for status view)
  // const [placedOrders, setPlacedOrders] = useState([]);
  const ORDERS_KEY = `qr_orders_${tableId}`;
  const [placedOrders, setPlacedOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`qr_orders_${tableId}`)) || [];
    } catch {
      return [];
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // const socketRef = useRef(null);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, CART_KEY]);

  // Initial load — table info, open session, menu, categories
  useEffect(() => {
    async function init() {
      try {
        const [sessionRes, menuRes, catRes] = await Promise.all([
          api.get(`/sessions/table/${tableId}`),
          api.get("/menus"),
          api.get("/categories"),
        ]);

        const { activeSession } = sessionRes.data;

        if (!activeSession) {
          throw { response: { status: 404 } };
        }

        setSession(activeSession);
        setTable(activeSession.table);

        // 1. Safely extract the menu array
        const menuData = menuRes.data;
        const menuArray = Array.isArray(menuData)
          ? menuData
          : menuData.items || menuData.menus || Object.values(menuData);
        setMenuItems(menuArray);

        // 2. Safely extract the categories array 👈 THIS FIXES YOUR CURRENT ERROR
        const catData = catRes.data;
        const catArray = Array.isArray(catData)
          ? catData
          : catData.categories || catData.data || Object.values(catData);
        setCategories(catArray);

        // Check if saved orders belong to this session
        const savedOrders =
          JSON.parse(localStorage.getItem(`qr_orders_${tableId}`)) || [];

        // Check if the orders are from the last session
        const ordersFromLastSession =
          savedOrders.length > 0 &&
          savedOrders.some((o) => o.sessionId !== activeSession.id);

        if (ordersFromLastSession) {
          localStorage.removeItem(`qr_orders_${tableId}`);
          localStorage.removeItem(`qr_cart_${tableId}`);
          setPlacedOrders([]);
          setView("menu");
        } else if (savedOrders.length > 0) {
          setPlacedOrders(savedOrders);
          setView("status");
        } else {
          setView("menu");
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setErrorMsg(
            "No active session for this table. Please ask a staff member to seat you.",
          );
        } else {
          setErrorMsg(
            "Unable to load the menu. Please try again or ask a staff member.",
          );
        }
        setView("error");
      }
    }
    init();
  }, [tableId]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(placedOrders));
  }, [placedOrders, ORDERS_KEY]);

  useQROrderSocket(session, (orderId, status) => {
    setPlacedOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  });

  // ── Cart helpers ──────────────────────────────────────────────────────────

  function addToCart(item, note = "", qty = 1) {
    setCart((prev) => {
      const existing = prev.findIndex(
        (c) => c.menuId === item.id && c.note === note,
      );
      if (existing !== -1) {
        return prev.map((c, i) =>
          i === existing ? { ...c, quantity: c.quantity + qty } : c,
        );
      }
      return [
        ...prev,
        {
          menuId: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: qty,
          note,
          imageUrl: item.imageUrl || null,
        },
      ];
    });
  }

  function updateCartQty(menuId, note, delta) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.menuId === menuId && c.note === note
            ? { ...c, quantity: c.quantity + delta }
            : c,
        )
        .filter((c) => c.quantity > 0),
    );
  }

  function removeFromCart(menuId, note) {
    setCart((prev) =>
      prev.filter((c) => !(c.menuId === menuId && c.note === note)),
    );
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  }

  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  // ── Place order ───────────────────────────────────────────────────────────

  async function handlePlaceOrder() {
    if (!cart.length || !session) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        sessionId: session.id,
        tableId: parseInt(tableId),
        items: cart.map((c) => ({
          menuId: c.menuId,
          quantity: c.quantity,
          note: c.note || undefined,
        })),
      };
      console.log(payload);
      const res = await api.post("/qr/orders", payload);
      setPlacedOrders((prev) => [...prev, { ...res.data, items: cart }]);
      clearCart();
      setCartOpen(false);
      setView("status");
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (view === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#c8a96e]/30 border-t-[#c8a96e] rounded-full animate-spin" />
          <p className="text-sm text-[#9a8a70]">Loading menu…</p>
        </div>
      </div>
    );
  }

  if (view === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] p-6">
        <div className="text-center max-w-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c8a96e"
              strokeWidth="1.5"
              className="w-8 h-8"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="font-semibold text-[#2d2416] text-lg">
            Table not ready
          </p>
          <p className="text-sm text-[#9a8a70] leading-relaxed">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {view === "menu" && (
        <>
          <MenuView
            table={table}
            categories={categories}
            menuItems={menuItems}
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            onAddToCart={addToCart}
            onOpenCart={() => setCartOpen(true)}
          />
          <CartDrawer
            open={cartOpen}
            cart={cart}
            cartTotal={cartTotal}
            submitting={submitting}
            submitError={submitError}
            onClose={() => setCartOpen(false)}
            onUpdateQty={updateCartQty}
            onRemove={removeFromCart}
            onPlaceOrder={handlePlaceOrder}
          />
        </>
      )}

      {view === "status" && (
        <OrderStatusView
          table={table}
          placedOrders={placedOrders}
          onAddMore={() => setView("menu")}
        />
      )}
    </div>
  );
}
