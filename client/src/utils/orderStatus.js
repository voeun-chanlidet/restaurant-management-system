export const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-600 border-transparent",
  IN_PROGRESS: "bg-blue-50 text-blue-600 border-transparent",
  READY: "bg-emerald-50 text-emerald-600 border-transparent",
  SERVED: "bg-gray-100 text-gray-500 border-transparent",
  CANCELLED: "bg-rose-50 text-rose-500 border-transparent",
};

export const STATUS_DOT_COLORS = {
  PENDING: "bg-amber-500",
  IN_PROGRESS: "bg-blue-500",
  READY: "bg-emerald-500",
  SERVED: "bg-gray-400",
  CANCELLED: "bg-rose-500",
};

export const STATUS_FLOW = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "READY",
  READY: "SERVED",
  SERVED: null,
  CANCELLED: null,
};

export const STATUS_BUTTON_LABEL = {
  PENDING: "Start Preparing",
  IN_PROGRESS: "Mark Ready",
  READY: "Mark as Served",
};

export const CARD_BORDER_COLORS = {
  PENDING: "border-amber-200",
  IN_PROGRESS: "border-blue-200",
  READY: "border-emerald-200",
  SERVED: "border-gray-200",
  CANCELLED: "border-rose-200",
};

export const getStatusMessaging = (status, prepTime = "") => {
  const messages = {
    PENDING: {
      subtitle: "Awaiting preparation",
      description: "Order received and waiting for kitchen confirmation.",
    },
    IN_PROGRESS: {
      subtitle: "In production pipeline",
      description: "Kitchen is currently preparing this order.",
    },
    READY: {
      subtitle: `Ready in ${prepTime}`,
      description: "Order will be moved to history after marked as served.",
    },
    SERVED: {
      subtitle: "Order completed",
      description: "This order has been served and finalized.",
    },
    CANCELLED: {
      subtitle: "Order voided",
      description: "This order was cancelled and will not be prepared.",
    },
  };

  return (
    messages[status] || {
      subtitle: "Unknown status",
      description: "Please verify the order details.",
    }
  );
};

export const getNextStatus = (status) => {
  return STATUS_FLOW[status];
};

export const canAdvanceOrder = (role, status) => {
  const nextStatus = STATUS_FLOW[status];

  if (!nextStatus) return false;

  //Kitchen cannot update pending order
  if (role === "KITCHEN" && status === "PENDING") {
    return false;
  }
  return true;
};

export const canCancelOrder = (role, status) => {
  return ["ADMIN", "STAFF"].includes(role) && status === "PENDING";
};
