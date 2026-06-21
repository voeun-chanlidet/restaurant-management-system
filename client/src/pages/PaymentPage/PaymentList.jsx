import PaymentCard from "./PaymentCard";

const PaymentList = ({ sessions }) => {
  if (sessions.length === 0) {
    console.log(sessions);
    return <p className="text-dimmed text-sm">No orders awaiting payment.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <PaymentCard key={session.id} session={session} />
      ))}
    </div>
  );
};

export default PaymentList;
