import TableCard from "./TableCard";

const FloorMap = ({ tables, onEdit, onTableClick }) => {
  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-dimmed">
        <p className="text-4xl mb-3">🪑</p>
        <p className="text-sm">No tables yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onEdit={onEdit}
          onTableClick={onTableClick}
        />
      ))}
    </div>
  );
};

export default FloorMap;
